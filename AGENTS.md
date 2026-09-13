# Project guide

- The maintained application lives in `app/`; the website builds to `dist/`.
- The release version is defined in `VERSION`. Present the repository as PKU-3D, built with GPT-6 Astra using publicly available source data. Keep the website branding concise; provenance and project status belong in the README and source documentation.
- Prefer focused improvements supported by references and rendered comparisons. Preserve uncertainty where building details are not established.
- Keep model detail, original image resolution, shadows, reflections and antialiasing intact. Improve actual rendering costs instead of reducing visual quality.
- Preserve prebuilt scenes, lossless mesh reuse and compression, two-worker decoding, bounded uploads, visibility caches, ordered instance streams, the two-frame GPU queue, idle scheduling, context recovery, lazy photos and offline fallbacks.
- Rebuild caches after scene inputs change. Validate affected views and interactions; compare performance with the unchanged frozen reference under matching conditions. Never replace the baseline or relax thresholds to hide regressions.
- Keep conversation logs, personal paths, machine-specific reports and intermediate screenshots out of public documentation. Local archives remain available for historical verification.
- See `docs/DEVELOPMENT.md` and `docs/development/performance.md` for maintenance.
