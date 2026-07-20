#!/usr/bin/env node
// rebuild-index.cjs — 扫描 templates/catalog/**/template.json，重建 templates/INDEX.json
// 保留 _meta（schema + agent_recall），仅替换 templates 数组。CI 在合入 PR 后自动运行。
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CATALOG = path.join(ROOT, 'templates', 'catalog');
const INDEX = path.join(ROOT, 'templates', 'INDEX.json');

function walk(dir) {
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walk(p));
    else if (e.name === 'template.json') out.push(p);
  }
  return out;
}

let existing = { _meta: {} };
try { existing = JSON.parse(fs.readFileSync(INDEX, 'utf8')); } catch (e) { /* 首次无文件 */ }

const files = fs.existsSync(CATALOG) ? walk(CATALOG) : [];
const templates = files
  .map((f) => {
    try { return JSON.parse(fs.readFileSync(f, 'utf8')); }
    catch (e) { console.error('✗ 跳过无法解析:', f, e.message); return null; }
  })
  .filter(Boolean);

const next = { _meta: existing._meta || {}, templates };
if (!next._meta.schema) next._meta.schema = existing._meta.schema;
next._meta.updatedAt = new Date().toISOString().slice(0, 10);

fs.writeFileSync(INDEX, JSON.stringify(next, null, 2) + '\n');
console.log(`✓ 已重建 INDEX.json（${templates.length} 个模板，扫描 ${files.length} 个 template.json）`);
