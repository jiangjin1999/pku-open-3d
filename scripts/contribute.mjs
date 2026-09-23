#!/usr/bin/env node
// Project-scoped credentials; AI-provider credentials never enter this process.
import {readFile, writeFile, mkdir, chmod} from 'node:fs/promises';
import {homedir} from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';

const args=process.argv.slice(2), command=args.shift()||'help';
const site=new URL(process.env.PKU_SITE||'https://pku-open3d.org');
if(site.pathname!=='/'||site.username||site.password||(!['https:'].includes(site.protocol)&&!['localhost','127.0.0.1'].includes(site.hostname)))throw Error('PKU_SITE 必须是 HTTPS 服务根地址（本机开发除外）');
const config=path.join(homedir(),'.config','pku-open3d',createHash('sha256').update(site.origin).digest('hex').slice(0,16)+'.json');
let credentials={};try{credentials=JSON.parse(await readFile(config,'utf8'))}catch{}
const output=v=>process.stdout.write(JSON.stringify(v,null,2)+'\n');
async function request(route,{method='GET',body,anonymous=false,binary=false}={}){
 const url=new URL(route,site);if(url.origin!==site.origin)throw Error('拒绝把项目凭证发送给其他服务');
 const headers={};if(!anonymous&&credentials.token)headers.Authorization='Bearer '+credentials.token;if(body)headers['Content-Type']='application/json';
 const r=await fetch(url,{method,headers,body:body?JSON.stringify(body):undefined,redirect:'error',signal:AbortSignal.timeout(60000)});
 if(!r.ok){let d;try{d=(await r.json()).detail}catch{}throw Error(`${r.status}: ${typeof d==='string'?d:JSON.stringify(d)||'服务暂不可用'}`)}
 return binary?Buffer.from(await r.arrayBuffer()):r.json();
}
function id(value,prefix){if(!new RegExp('^'+prefix+'_[a-f0-9]{32}$').test(value||''))throw Error('请提供有效的 '+prefix+' 编号');return value}
async function savePrivate(file,content){await mkdir(path.dirname(file),{recursive:true,mode:0o700});await writeFile(file,content,{mode:0o600});await chmod(file,0o600)}
try{
 if(command==='help')output({用法:'node scripts/contribute.mjs <命令> [参数]',服务:site.origin,命令:{doctor:'检查环境与登录状态',login:'首次配对（在浏览器确认）',tasks:'查看可选任务；不自动认领',claim:'claim <task_id> 手动选定任务 / 续期',release:'release <task_id> 释放认领',fetch:'fetch <task_id> 下载本任务私有资料',schema:'显示完整模型 JSON 规范',validate:'validate <task_id> <model.json>',preview:'preview <task_id> <model.json>',submit:'submit <task_id> <model.json>',status:'status <submission_id> 查看 PR 与发布结果'},说明:'设置 PKU_SITE 可连接自建实例。凭证保存在用户配置目录，照片放入被 Git 忽略的 private-sources。'});
 else if(command==='doctor')output({node:process.version,required:'Node.js 22 或更新版本',site:site.origin,health:await request('/api/v1/health',{anonymous:true}),identity:await request('/api/v1/auth/me')});
 else if(command==='login'){
  const p=await request('/api/v1/auth/pair',{method:'POST',anonymous:true});output({open:p.verification_url,code:p.code,message:'请用户在浏览器登录 GitHub，核对配对码并确认。不要代替用户确认不明配对。'});
  const deadline=Date.now()+p.expires_in*1000;let done=false;
  while(Date.now()<deadline){await new Promise(r=>setTimeout(r,5000));const value=await request('/api/v1/auth/pair/poll',{method:'POST',body:{secret:p.secret},anonymous:true});if(value.token){await savePrivate(config,JSON.stringify({token:value.token,login:value.login,expires_at:Date.now()+value.expires_in*1000}));output({login:value.login,message:'本项目配对完成；令牌有效 7 天。'});done=true;break}}
  if(!done)throw Error('配对超时，请重新运行 login');
 }
 else if(command==='tasks')output(await request('/api/v1/tasks',{anonymous:true}));
 else if(command==='schema')output(await request('/api/v1/model-schema',{anonymous:true}));
 else if(['claim','release'].includes(command))output(await request('/api/v1/tasks/'+id(args[0],'task')+'/'+command,{method:'POST'}));
 else if(command==='fetch'){
  const task=id(args[0],'task'),pack=await request('/api/v1/tasks/'+task+'/pack'),folder=path.resolve('private-sources',task);
  for(const o of pack.observations)for(const photo of o.photos){id(photo.id,'photo');const bytes=await request(photo.url,{binary:true});if(createHash('sha256').update(bytes).digest('hex')!==photo.sha256)throw Error('资料校验值不匹配');await savePrivate(path.join(folder,photo.id+'.jpg'),bytes);photo.local_file=path.join(folder,photo.id+'.jpg')}
  await savePrivate(path.join(folder,'task.json'),JSON.stringify(pack,null,2));await savePrivate(path.join(folder,'model-schema.json'),JSON.stringify(await request('/api/v1/model-schema'),null,2));
  output({task_id:task,task_file:path.join(folder,'task.json'),photos:pack.observations.reduce((n,o)=>n+o.photos.length,0),message:'资料只供本任务使用，不要加入 Git、公开模型、PR 或日志。'});
 }
 else if(['validate','preview','submit'].includes(command)){
  const task=id(args[0],'task');if(!args[1])throw Error('请提供模型 JSON 文件');const model=JSON.parse(await readFile(args[1],'utf8'));
  output(await request('/api/v1/tasks/'+task+'/'+command,{method:'POST',body:model}));
 }
 else if(command==='status'){const result=await request('/api/v1/submissions/'+id(args[0],'sub'));delete result.model;output(result)}
 else throw Error('未知命令，请运行 help');
}catch(e){process.stderr.write(e.message+'\n');process.exitCode=1}
