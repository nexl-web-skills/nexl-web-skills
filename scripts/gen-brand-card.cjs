#!/usr/bin/env node
/**
 * gen-brand-card.cjs — nexl 分享卡生成器
 *
 * 核心机制 L3（产出即传播）：建站完成时自动生成
 *   (a) 带 nexl 回流链接的分享卡 SVG（1200x630 社交图标准尺寸）
 *   (b) 一段可一键转发的社交文案
 * 用户把图+文案发出去 = 为 nexl 免费代言。
 *
 * 用法:
 *   node scripts/gen-brand-card.cjs --name "NovaVia" --tagline "独立社交新物种" --color "#0D7A5F"
 *   node scripts/gen-brand-card.cjs --json brand-profile.json
 *   node scripts/gen-brand-card.cjs --name "X" --out ./dist/x-card.svg
 */
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    const m = argv[i].match(/^--([\w-]+)$/);
    if (m) { a[m[1]] = argv[i + 1]; i++; }
  }
  return a;
}

let cfg = {};
const args = parseArgs(process.argv.slice(2));
if (args.json) {
  try { cfg = JSON.parse(fs.readFileSync(args.json, 'utf8')); }
  catch (e) { console.error('读取 JSON 失败:', e.message); process.exit(1); }
}

const name = args.name || cfg.name || 'Your Brand';
const tagline = args.tagline || cfg.tagline || '一句话定位你的品牌';
const color = (args.color || cfg.color || '#0A84FF').replace(/^#/, '#');
const url = 'https://github.com/nexl-web-skills/nexl-web-skills';
const out = args.out || 'brand-card.svg';

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// 截断过长文本，避免溢出
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
const safeName = esc(clip(name, 22));
const safeTag = esc(clip(tagline, 28));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a0a0c"/>
      <stop offset="1" stop-color="#16161a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="12" height="630" fill="${color}"/>
  <text x="80" y="148" fill="${color}" font-family="-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif" font-size="32" font-weight="700" letter-spacing="3">BUILT WITH NEXL</text>
  <text x="78" y="300" fill="#f5f5f7" font-family="-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif" font-size="90" font-weight="800">${safeName}</text>
  <text x="80" y="378" fill="#a1a1aa" font-family="-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif" font-size="38">${safeTag}</text>
  <line x1="80" y1="468" x2="1120" y2="468" stroke="#2a2a31" stroke-width="2"/>
  <text x="80" y="538" fill="#f5f5f7" font-family="-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif" font-size="28">你的品牌值得一个永远在线的经纪人</text>
  <text x="80" y="582" fill="${color}" font-family="-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif" font-size="26" font-weight="600">${url}</text>
</svg>`;

fs.writeFileSync(out, svg);

const shareCopy = `🚀 刚用 @nexl 把「${name}」建成了独立站：「${tagline}」

不是模板，是一个懂我品牌的 AI 经纪人全程操盘。
${url} #独立站 #AI建站 #品牌出海`;

console.log('─'.repeat(54));
console.log(shareCopy);
console.log('─'.repeat(54));
console.log(`✅ 分享卡已生成: ${path.resolve(out)}`);
console.log('   将这张图 + 上面文案发到社交平台，即为 nexl 代言 🔥');
