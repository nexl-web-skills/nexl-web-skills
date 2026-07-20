#!/usr/bin/env node
// build-gallery.cjs — 从 templates/INDEX.json 生成 docs/gallery/index.html（集体数字资产橱窗）
// 用法: node scripts/build-gallery.cjs [--validate]
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const INDEX = path.join(ROOT, 'templates', 'INDEX.json');
const OUT_DIR = path.join(ROOT, 'docs', 'gallery');
const OUT = path.join(OUT_DIR, 'index.html');
const validateOnly = process.argv.includes('--validate');

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

let index;
try { index = JSON.parse(fs.readFileSync(INDEX, 'utf8')); }
catch (e) { console.error('✗ 无法读取 INDEX.json:', e.message); process.exit(1); }

const tpls = index.templates || [];
const required = ['id', 'name', 'author', 'category', 'platforms', 'ratings', 'license', 'preview_image'];
let ok = true;
for (const t of tpls) {
  const miss = required.filter((k) => !(k in t));
  if (miss.length) { ok = false; console.error(`✗ ${t.id || '?'} 缺字段: ${miss.join(', ')}`); }
}
if (!ok) { console.error('格式校验未通过'); process.exit(1); }
console.log(`✓ 校验通过：${tpls.length} 个模板`);
if (validateOnly) { console.log('（--validate 模式，不写文件）'); process.exit(0); }

const stars = (n) => '★'.repeat(Math.max(0, Math.min(5, n))) + '☆'.repeat(Math.max(0, 5 - Math.min(5, n)));
const cards = tpls.map((t) => `
  <article class="card">
    <a class="thumb" href="${esc(t.preview)}" target="_blank" rel="noopener">
      <img src="${esc(t.preview_image)}" alt="${esc(t.name)}" loading="lazy"/>
    </a>
    <div class="body">
      <div class="meta"><span class="badge">${esc(t.category)}</span><span class="author">@${esc(t.author)}</span></div>
      <h3>${esc(t.name)}</h3>
      <p class="pitch">${esc(t.first_screen_pitch)}</p>
      <p class="lang">${esc(t.design_language)}</p>
      <div class="rates">
        <span>质量 ${stars(t.ratings.quality)}</span>
        <span>性价比 ${stars(t.ratings.cost_efficiency)}</span>
        <span>稳定 ${stars(t.ratings.stability)}</span>
      </div>
      <a class="cta" href="${esc(t.preview)}" target="_blank" rel="noopener">查看 ↗</a>
    </div>
  </article>`).join('');

const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>nexl · 集体独立站数字资产橱窗</title>
<style>
  :root{ --bg:#0a0a0a; --fg:#f5f5f5; --muted:#8a8a8a; --line:#1c1c1c; --accent:#ffd803; }
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--fg);font-family:-apple-system,"Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased}
  header{padding:80px 24px 48px;text-align:center;border-bottom:1px solid var(--line)}
  header h1{font-size:40px;font-weight:800;letter-spacing:-1px;margin:0 0 12px}
  header p{color:var(--muted);max-width:640px;margin:0 auto;line-height:1.6;font-size:15px}
  .grid{max-width:1200px;margin:48px auto;padding:0 24px;display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px}
  .card{background:#111;border:1px solid var(--line);border-radius:14px;overflow:hidden;transition:transform .2s,border-color .2s}
  .card:hover{transform:translateY(-4px);border-color:#333}
  .thumb{display:block;aspect-ratio:3/2;background:#000;overflow:hidden}
  .thumb img{width:100%;height:100%;object-fit:cover;display:block}
  .body{padding:18px}
  .meta{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
  .badge{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--accent);border:1px solid var(--accent);border-radius:999px;padding:3px 10px}
  .author{font-size:12px;color:var(--muted)}
  h3{margin:0 0 8px;font-size:18px;font-weight:700}
  .pitch{margin:0 0 6px;font-size:13px;color:#ccc;line-height:1.5}
  .lang{margin:0 0 12px;font-size:12px;color:var(--muted)}
  .rates{display:flex;flex-direction:column;gap:3px;font-size:11px;color:var(--muted);margin-bottom:14px}
  .rates span{color:var(--accent)}
  .cta{display:inline-block;font-size:13px;color:var(--fg);text-decoration:none;border-bottom:1px solid var(--accent);padding-bottom:2px}
  footer{padding:40px 24px 80px;text-align:center;color:var(--muted);font-size:12px;border-top:1px solid var(--line)}
  footer a{color:var(--accent);text-decoration:none}
</style>
</head>
<body>
  <header>
    <h1>nexl 集体独立站数字资产橱窗</h1>
    <p>这里陈列社区贡献的可复用独立站模板——每个都是「独立站即下一个风口」的一块拼图。不受制于平台，不受制于时空。</p>
  </header>
  <main class="grid">${cards}</main>
  <footer>由 <a href="https://github.com/nexl-web-skills/nexl-web-skills" target="_blank" rel="noopener">nexl-web-skills</a> 社区共建 · MIT License · 想贡献？复制 templates/_template 提 PR 🔥</footer>
</body>
</html>`;

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT, html);
console.log(`✓ 已生成 ${OUT}（${tpls.length} 张卡片）`);
