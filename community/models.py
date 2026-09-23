from datetime import date
from typing import Literal
import math
import re
from pydantic import BaseModel, ConfigDict, Field, model_validator


class Strict(BaseModel):
    model_config = ConfigDict(extra="forbid", allow_inf_nan=False, str_strip_whitespace=True)


class CaptureTime(Strict):
    precision: Literal["day", "month", "range", "unknown"]
    start: str = Field(default="", max_length=10)
    end: str = Field(default="", max_length=10)
    note: str = Field(default="", max_length=200)

    @model_validator(mode="after")
    def check(self):
        if self.precision == "unknown":
            if self.start or self.end:
                raise ValueError("时间未知时请清空日期")
        else:
            if self.precision == "month":
                if not re.fullmatch(r"\d{4}-\d{2}", self.start):
                    raise ValueError("月份格式为 YYYY-MM")
                date.fromisoformat(self.start + "-01")
            else:
                start = date.fromisoformat(self.start)
                if self.precision == "range" and date.fromisoformat(self.end) < start:
                    raise ValueError("结束日期不能早于开始日期")
                if self.precision == "range" and date.fromisoformat(self.end) > date.today():
                    raise ValueError("结束日期不能在未来")
            if self.start > date.today().isoformat():
                raise ValueError("拍摄日期不能在未来")
        return self


class Point(Strict):
    longitude: float = Field(ge=-180, le=180)
    latitude: float = Field(ge=-90, le=90)


class NewPlace(Strict):
    name: str = Field(min_length=2, max_length=100)
    kind: Literal["building", "floor", "room", "detail"] = "building"
    parent_id: str = Field(default="yanyuan", max_length=100)
    position: Point | None = None
    location_note: str = Field(default="", max_length=500)


class Annotation(Strict):
    kind: Literal["photo", "feedback"]
    place_id: str | None = Field(default=None, max_length=100)
    new_place: NewPlace | None = None
    part: str = Field(min_length=1, max_length=120)
    space: Literal["exterior", "floor", "room", "detail"] = "exterior"
    floor: str = Field(default="", max_length=40)
    capture_time: CaptureTime
    camera_position: Point | None = None
    camera_note: str = Field(default="", max_length=400)
    direction: str = Field(default="不确定", max_length=120)
    description: str = Field(default="", max_length=3000)
    actual: str = Field(default="", max_length=3000)
    basis: str = Field(default="", max_length=1000)
    author: str = Field(default="", max_length=80)
    consent: bool = False
    consent_version: Literal["2026-09-23"] = "2026-09-23"
    scene_revision: str = Field(default="upstream-1.2.0", max_length=100)
    model_revisions: dict[str, str] = Field(default_factory=dict, max_length=500)
    view: dict[str, float | str | list[float]] = Field(default_factory=dict)
    marks: list[list[float]] = Field(default_factory=list, max_length=2000)

    @model_validator(mode="after")
    def check(self):
        if bool(self.place_id) == bool(self.new_place):
            raise ValueError("请选择已有地点，或填写一个新地点")
        if not self.consent:
            raise ValueError("请确认资料用途与授权说明")
        if self.kind == "photo" and not self.camera_note:
            raise ValueError("请说明拍摄位置；不确定时也请写明")
        if self.kind == "feedback" and (not self.description or not self.actual):
            raise ValueError("请填写当前问题和实际情况；不确定的地方请说明")
        if self.space in ("floor", "room") and not self.floor:
            raise ValueError("请标注楼层，例如四楼或楼层不确定")
        for mark in self.marks:
            if len(mark) != 2 or not all(math.isfinite(v) and 0 <= v <= 1 for v in mark):
                raise ValueError("圈画坐标必须归一化到 0–1")
        if len(self.view) > 12:
            raise ValueError("视角信息过大")
        if any(not re.fullmatch(r"[a-z][a-z0-9_-]{2,79}", k) or not re.fullmatch(r"[a-f0-9]{64}", v) for k,v in self.model_revisions.items()):
            raise ValueError("模型部位版本信息无效")
        return self


class Evidence(Strict):
    observation_id: str = Field(pattern=r"^obs_[a-f0-9]{32}$")
    supports: str = Field(min_length=1, max_length=600)
    certainty: Literal["observed", "estimated"]


class Node(Strict):
    id: str = Field(pattern=r"^[a-zA-Z0-9_-]{1,64}$")
    parent_id: str | None = Field(default=None, max_length=64)
    type: Literal["group", "box", "cylinder", "mesh"]
    position: tuple[float, float, float] = (0, 0, 0)
    rotation: float = Field(default=0, ge=-math.tau, le=math.tau)
    color: str = Field(default="#c6b8a5", pattern=r"^#[a-fA-F0-9]{6}$")
    size: tuple[float, float, float] | None = None
    radius: float | None = Field(default=None, gt=0, le=200)
    height: float | None = Field(default=None, gt=0, le=200)
    segments: int = Field(default=16, ge=3, le=48)
    vertices: list[tuple[float, float, float]] = Field(default_factory=list, max_length=100000)
    indices: list[tuple[int, int, int]] = Field(default_factory=list, max_length=100000)

    @model_validator(mode="after")
    def check(self):
        if any(abs(v) > 400 for v in self.position):
            raise ValueError("局部坐标超出 400 米，请拆分模型")
        if self.type == "box" and (not self.size or not all(0 < v <= 400 for v in self.size)):
            raise ValueError("长方体尺寸必须在 0–400 米之间")
        if self.type == "cylinder" and (self.radius is None or self.height is None):
            raise ValueError("圆柱需要半径和高度")
        if self.type == "mesh":
            if not self.vertices or not self.indices:
                raise ValueError("网格需要顶点与三角形索引")
            if any(abs(v) > 400 for p in self.vertices for v in p):
                raise ValueError("网格顶点超出范围")
            for face in self.indices:
                if min(face) < 0 or max(face) >= len(self.vertices) or len(set(face)) != 3:
                    raise ValueError("网格索引无效")
                a, b, c = (self.vertices[i] for i in face)
                u, v = [b[i]-a[i] for i in range(3)], [c[i]-a[i] for i in range(3)]
                cross = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]]
                if sum(x*x for x in cross) < 1e-16:
                    raise ValueError("网格包含退化三角形")
        elif self.vertices or self.indices:
            raise ValueError("只有网格节点可以携带顶点")
        return self


class ModelPart(Strict):
    schema_version: Literal[1] = 1
    part_id: str = Field(pattern=r"^[a-z][a-z0-9_-]{2,79}$")
    place_id: str = Field(max_length=100)
    task_id: str = Field(pattern=r"^task_[a-f0-9]{32}$")
    base_revision: str | None = Field(default=None, pattern=r"^[a-f0-9]{64}$")
    title: str = Field(min_length=1, max_length=120)
    space: Literal["exterior", "floor", "room", "detail"]
    floor: str = Field(default="", max_length=40)
    origin: tuple[float, float, float]
    evidence: list[Evidence] = Field(min_length=1, max_length=100)
    uncertainties: list[str] = Field(default_factory=list, max_length=50)
    nodes: list[Node] = Field(min_length=1, max_length=4000)
    replaces_baseline: bool = False

    @model_validator(mode="after")
    def check(self):
        if max(abs(self.origin[0]), abs(self.origin[2])) > 20000 or not -30 <= self.origin[1] <= 300:
            raise ValueError("模型原点不在本项目的校园坐标范围内")
        if self.space in ("floor", "room") and not self.floor:
            raise ValueError("室内模型必须标明楼层")
        if self.replaces_baseline and self.space != "exterior":
            raise ValueError("室内部位不能替换整栋外观")
        if any(len(s) > 800 for s in self.uncertainties):
            raise ValueError("不确定性说明过长")
        if any(e.certainty == "estimated" for e in self.evidence) and not self.uncertainties:
            raise ValueError("估计项需要在 uncertainties 中说明")
        seen, depth, triangles = set(), {}, 0
        for n in self.nodes:
            if n.id in seen or (n.parent_id and n.parent_id not in seen):
                raise ValueError("节点编号必须唯一，父节点必须在子节点前定义")
            depth[n.id] = depth.get(n.parent_id, 0) + 1
            if depth[n.id] > 8:
                raise ValueError("节点层级不能超过 8 层")
            seen.add(n.id)
            triangles += {"box": 12, "cylinder": n.segments*4, "mesh": len(n.indices), "group": 0}[n.type]
        if triangles == 0 or triangles > 100000:
            raise ValueError("每个部位应有 1–100000 个三角形")
        return self
