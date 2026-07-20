#!/usr/bin/env node
/**
 * budget-meoo.cjs — nexl-builder 建站成本估算器（秒悟 Meoo 积分）
 *
 * 确定性、可复现。输入模型 / 步数 / 对话轮数 / 生图张数，输出预估消耗积分与人民币。
 * 计费依据：秒悟 Meoo 官方文档 https://docs.meoo.com/（模型积分扣减 + Meoo Night Plan）。
 *
 * 用法：
 *   node budget-meoo.cjs                              # 打印全部模型 × 典型场景
 *   node budget-meoo.cjs --model deepseek-v3.2       # 单模型明细
 *   node budget-meoo.cjs --model qwen3.7-max --turns 20 --images 4
 *   node budget-meoo.cjs --model qwen3.7-max --night # 套用 Night Plan 2折
 *   node budget-meoo.cjs --json                       # 机器可读输出
 *
 * 设计原则：预算必须透明。Agent 在建站前用本脚本（或等效心算）报出估算区间，
 * 用户确认后再走六步框架——这是 nexl-builder 与"黑盒建站工具"的核心差异点。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const PRICING = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'budget-meoo.json'), 'utf8')
);

/**
 * 估算一次六步建站的总积分消耗（Meoo 模型，无 Coze 阶梯，按 1K token 线性计费）。
 * @param {object} opts
 * @param {string} opts.modelKey
 * @param {number} opts.turns
 * @param {number} opts.images
 * @param {boolean} opts.night  是否套用 Meoo Night Plan（仅 qwen3.7-max/plus 生效）
 * @param {number} opts.sysTokens
 */
function estimate({ modelKey = 'qwen3.7-max', turns = 15, images = 0, night = false, sysTokens = 3000 } = {}) {
  const model = PRICING.models[modelKey];
  if (!model) throw new Error('unknown model: ' + modelKey);

  let mIn = model.input, mOut = model.output, mCache = model.cache;
  if (night && PRICING.nightPlan.discounts[modelKey]) {
    const d = PRICING.nightPlan.discounts[modelKey];
    mIn *= d; mOut *= d; mCache *= d;
  }

  const imgPer = PRICING.image_models['qwen-image-2.0'].per_image; // 两张图均 200
  let credits = 0;
  const breakdown = [];

  for (let t = 1; t <= turns; t++) {
    const fresh = 150 + (t - 1) * 450; // 用户新消息 + 历史增量
    const out = 600;

    let turnCost = 0;
    if (t === 1) {
      turnCost += (sysTokens / 1000) * mIn;     // 首轮全量输入
    } else {
      turnCost += (sysTokens / 1000) * mCache;  // 静态前缀命中缓存
    }
    turnCost += (fresh / 1000) * mIn;           // 新增输入
    turnCost += (out / 1000) * mOut;            // 输出

    credits += turnCost;
    breakdown.push({
      turn: t,
      fresh_in: Math.round(fresh),
      out,
      cost: +turnCost.toFixed(2),
    });
  }

  const imageCredits = images * imgPer;
  credits += imageCredits;

  return {
    platform: 'meoo',
    model: model.label,
    modelKey,
    night: !!night,
    turns,
    images,
    llmCredits: Math.round(credits - imageCredits),
    imageCredits,
    totalCredits: Math.round(credits),
    rmb: +(credits / 1000).toFixed(3),
    breakdown,
  };
}

// ---- CLI ----
function parseArgs(argv) {
  const o = { modelKey: null, turns: 15, images: 0, night: false, json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--model') o.modelKey = argv[++i];
    else if (a === '--turns') o.turns = parseInt(argv[++i], 10);
    else if (a === '--images') o.images = parseInt(argv[++i], 10);
    else if (a === '--night') o.night = true;
    else if (a === '--json') o.json = true;
  }
  return o;
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  const keys = args.modelKey ? [args.modelKey] : Object.keys(PRICING.models);

  if (args.json) {
    const out = keys.map((k) => estimate({ modelKey: k, turns: args.turns, images: args.images, night: args.night }));
    console.log(JSON.stringify(out, null, 2));
  } else {
    console.log('\n=== nexl-builder 建站成本估算（秒悟 Meoo 积分）===');
    console.log(`场景：6 步框架 · ${args.turns} 轮对话 · 生图 ${args.images} 张${args.night ? ' · 含 Night Plan 折扣' : ''}`);
    console.log(`汇率：1 积分 ≈ ¥${PRICING.unit.rmb_per_credit}（1000 积分 ≈ ¥1）｜ 快照 ${PRICING.snapshotDate}\n`);
    console.log('模型'.padEnd(30), 'LLM积分', '生图积分', '总积分', '≈人民币');
    for (const k of keys) {
      const r = estimate({ modelKey: k, turns: args.turns, images: args.images, night: args.night });
      console.log(
        r.model.slice(0, 28).padEnd(30),
        String(r.llmCredits).padStart(7),
        String(r.imageCredits).padStart(8),
        String(r.totalCredits).padStart(7),
        ('¥' + r.rmb).padStart(8)
      );
    }
    console.log('\n说明：Meoo 按 1K token 线性计费（无 Coze 式阶梯）；生图 200 积分/张；Night Plan 仅 qwen3.7-max(0.2x)/plus(0.4x) 生效。');
    console.log('订阅额度参考：Free 新人 10,000/月 + 每日 2,000；Pro 100,000/月（限时¥39）；Max 200,000/月（限时¥89，含自定义域名）。\n');
  }
}

module.exports = { estimate, PRICING };
