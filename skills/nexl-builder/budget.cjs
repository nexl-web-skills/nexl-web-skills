#!/usr/bin/env node
/**
 * budget.js — nexl-builder 建站成本估算器（Coze 积分）
 *
 * 确定性、可复现。输入模型 / 步数 / 对话轮数 / 生图张数，输出预估消耗积分与人民币。
 * 计费依据：Coze 官方 internal_integrations_fee（见 budget.json）。
 *
 * 用法：
 *   node budget.js                         # 打印全部模型 × 典型场景
 *   node budget.js --model deepseek       # 单模型明细
 *   node budget.js --model doubao-pro --turns 20 --images 4
 *   node budget.js --json                 # 机器可读输出
 *
 * 设计原则：预算必须透明。Agent 在建站前用本脚本（或等效心算）报出估算区间，
 * 用户确认后再走六步框架——这是 nexl-builder 与"黑盒建站工具"的核心差异点。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const PRICING = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'budget.json'), 'utf8')
);

function tierFor(model, ctxTokens) {
  const tiers = model.tiers;
  for (const t of tiers) {
    if (ctxTokens <= t.max_k * 1000) return t;
  }
  return tiers[tiers.length - 1];
}

/**
 * 估算一次六步建站的总积分消耗。
 * @param {object} opts
 * @param {string} opts.modelKey  'doubao-pro' | 'deepseek' | 'glm'
 * @param {number} opts.turns     对话轮数（ask 模式一问一答算一轮）
 * @param {number} opts.images    生图张数（Seedream 5.0）
 * @param {number} opts.sysTokens 系统+SKILL 注入 token 数（默认 3000）
 */
function estimate({ modelKey = 'doubao-pro', turns = 15, images = 0, sysTokens = 3000 } = {}) {
  const model = PRICING.models[modelKey];
  if (!model) throw new Error('unknown model: ' + modelKey);
  const imgPer = PRICING.image_models['seedream-5'].per_image;

  let credits = 0;
  let ctx = sysTokens; // 上下文随轮增长
  const breakdown = [];

  for (let t = 1; t <= turns; t++) {
    const tier = tierFor(model, ctx);
    const fresh = 150 + (t - 1) * 450; // 用户新消息 + 历史增量
    const out = 600;

    let turnCost = 0;
    if (t === 1) {
      turnCost += (sysTokens / 1000) * tier.in; // 首轮全量输入
    } else {
      turnCost += (sysTokens / 1000) * tier.cache; // 静态前缀命中缓存
    }
    turnCost += (fresh / 1000) * tier.in; // 新增输入
    turnCost += (out / 1000) * tier.out; // 输出

    credits += turnCost;
    breakdown.push({
      turn: t,
      tier_max_k: tier.max_k,
      fresh_in: Math.round(fresh),
      out,
      cost: +turnCost.toFixed(2),
    });
    ctx += fresh + out;
  }

  const imageCredits = images * imgPer;
  credits += imageCredits;

  return {
    model: model.label,
    modelKey,
    turns,
    images,
    llmCredits: Math.round(credits - imageCredits),
    imageCredits,
    totalCredits: Math.round(credits),
    rmb: +(credits / 1000).toFixed(3),
    finalCtxK: +(ctx / 1000).toFixed(1),
    breakdown,
  };
}

// ---- CLI ----
function parseArgs(argv) {
  const o = { modelKey: null, turns: 15, images: 0, json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--model') o.modelKey = argv[++i];
    else if (a === '--turns') o.turns = parseInt(argv[++i], 10);
    else if (a === '--images') o.images = parseInt(argv[++i], 10);
    else if (a === '--json') o.json = true;
  }
  return o;
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  const keys = args.modelKey ? [args.modelKey] : Object.keys(PRICING.models);

  if (args.json) {
    const out = keys.map((k) => estimate({ modelKey: k, turns: args.turns, images: args.images }));
    console.log(JSON.stringify(out, null, 2));
  } else {
    console.log('\n=== nexl-builder 建站成本估算（Coze 积分）===');
    console.log(`场景：6 步框架 · ${args.turns} 轮对话 · 生图 ${args.images} 张`);
    console.log(`汇率：1 积分 ≈ ¥${PRICING.unit.rmb_per_credit}（1000 积分 ≈ ¥1）\n`);
    console.log('模型'.padEnd(26), 'LLM积分', '生图积分', '总积分', '≈人民币');
    for (const k of keys) {
      const r = estimate({ modelKey: k, turns: args.turns, images: args.images });
      console.log(
        r.model.slice(0, 24).padEnd(26),
        String(r.llmCredits).padStart(7),
        String(r.imageCredits).padStart(8),
        String(r.totalCredits).padStart(7),
        ('¥' + r.rmb).padStart(8)
      );
    }
    console.log('\n说明：阶梯计费下上下文跨 32K 后输出单价翻倍；生图(Seedream 5.0=220积分/张)是最大变量。');
    console.log('真实消耗结构参考（CSDN 实测）：大模型 38% / 插件 27% / 后台任务 22% / 中断浪费 13%。\n');
  }
}

module.exports = { estimate, PRICING };
