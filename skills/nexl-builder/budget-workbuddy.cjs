#!/usr/bin/env node
/**
 * budget-workbuddy.cjs — nexl-builder 建站成本估算器（腾讯 WorkBuddy 积分）
 *
 * 确定性、可复现。输入对话轮数 / 生图张数，输出预估消耗积分与人民币，并对比各订阅档覆盖次数。
 * 计费依据：腾讯 WorkBuddy 官方（workbuddy.cn/pricing + 腾讯云计费文档 1749/126592,126593,129680）。
 *
 * 用法：
 *   node budget-workbuddy.cjs                          # 打印默认场景 + 各档覆盖
 *   node budget-workbuddy.cjs --turns 15 --images 4    # 指定轮数与生图
 *   node budget-workbuddy.cjs --json                    # 机器可读输出
 *
 * 设计原则：预算必须透明。Agent 在建站前用本脚本（或等效心算）报出估算区间，
 * 用户确认后再走六步框架——这是 nexl-builder 与"黑盒建站工具"的核心差异点。
 *
 * 重要：WorkBuddy 未公开每 1K token 精确积分，本估算以官方锚点反推（每轮≈5积分），
 * 属估算值，非官方费率。输出中显式标注。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const PRICING = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'budget-workbuddy.json'), 'utf8')
);

/**
 * 估算一次六步建站的总积分消耗（WorkBuddy，以官方锚点反推的线性估算）。
 * @param {object} opts
 * @param {number} opts.turns   对话轮数
 * @param {number} opts.images  多模态生图张数（估算 15 积分/张）
 */
function estimate({ turns = 15, images = 0 } = {}) {
  const perTurn = PRICING.assumptions.per_turn_credit_estimate;
  const perImg = PRICING.assumptions.image_per_credit_estimate;

  const llmCredits = turns * perTurn;
  const imageCredits = images * perImg;
  const totalCredits = llmCredits + imageCredits;

  // 各订阅档能覆盖多少次完整建站
  const coverage = {};
  for (const [k, v] of Object.entries(PRICING.subscriptions)) {
    if (v.credits_per_month == null) { coverage[k] = null; continue; }
    coverage[k] = +(v.credits_per_month / totalCredits).toFixed(1);
  }

  return {
    platform: 'workbuddy',
    turns,
    images,
    llmCredits,
    imageCredits,
    totalCredits,
    rmb: +(totalCredits / 1000).toFixed(3),
    coveragePerSubscription: coverage,
    estimateNote: PRICING.assumptions.note,
  };
}

function parseArgs(argv) {
  const o = { turns: 15, images: 0, json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--turns') o.turns = parseInt(argv[++i], 10);
    else if (a === '--images') o.images = parseInt(argv[++i], 10);
    else if (a === '--json') o.json = true;
  }
  return o;
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  const r = estimate({ turns: args.turns, images: args.images });

  if (args.json) {
    console.log(JSON.stringify(r, null, 2));
  } else {
    console.log('\n=== nexl-builder 建站成本估算（腾讯 WorkBuddy 积分）===');
    console.log(`场景：6 步框架 · ${r.turns} 轮对话 · 生图 ${r.images} 张`);
    console.log(`汇率：1 积分 ≈ ¥${PRICING.unit.rmb_per_credit}（1000 积分 ≈ ¥1）｜ 快照 ${PRICING.snapshotDate}\n`);
    console.log('对话积分'.padEnd(12), String(r.llmCredits).padStart(8));
    console.log('生图积分'.padEnd(12), String(r.imageCredits).padStart(8));
    console.log('总积分'.padEnd(12), String(r.totalCredits).padStart(8));
    console.log('≈人民币'.padEnd(12), ('¥' + r.rmb).padStart(8));
    console.log('\n各订阅档覆盖次数（= 月额度 / 本次总积分）：');
    for (const [k, v] of Object.entries(r.coveragePerSubscription)) {
      const sub = PRICING.subscriptions[k];
      const cov = v == null ? '—' : (v + ' 次');
      console.log(`  ${sub.label.padEnd(8)} ¥${sub.price}${sub.per ? '/' + sub.per : ''}  ${sub.credits_per_month == null ? '更高额度' : sub.credits_per_month + '/月'}  →  ${cov}`);
    }
    console.log('\n⚠️ 估算值：WorkBuddy 未公开每1K token 精确积分，以官方锚点（10页PPT≈8~12积分、轻度日耗100~500）反推每轮≈5积分（区间3~8），生图≈15积分/张。');
    console.log('订阅参考：体验版¥0/500积分·月；标准版¥99(7折¥70)/4000积分；高级版¥199(7折¥140)/9000；企业SaaS¥198/人/2000共享。\n');
  }
}

module.exports = { estimate, PRICING };
