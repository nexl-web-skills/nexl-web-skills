#!/usr/bin/env node
/**
 * budget-miaoda.cjs — nexl-builder 建站成本估算器（百度秒哒 MIAODA 秒点）
 *
 * 确定性、可复现。输入深度开发请求数 / 发布数 / 后端启用数 / AI质检，输出预估秒点消耗与免费额度覆盖。
 * 计费依据：百度秒哒 MIAODA 官方（秒点体系：深度请求30/发布20/后端15/AI质检60）。
 *
 * 用法：
 *   node budget-miaoda.cjs                                    # 默认场景（15请求+1发布+1后端）
 *   node budget-miaoda.cjs --requests 15 --publish 1 --backend 1
 *   node budget-miaoda.cjs --requests 20 --qc 1               # 含 AI 质检
 *   node budget-miaoda.cjs --json                              # 机器可读输出
 *
 * 设计原则：预算必须透明。Agent 在建站前用本脚本（或等效心算）报出估算区间，
 * 用户确认后再走六步框架——这是 nexl-builder 与"黑盒建站工具"的核心差异点。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const PRICING = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'budget-miaoda.json'), 'utf8')
);

/**
 * 估算一次六步建站的总秒点消耗（MIAODA，官方确定费率）。
 * @param {object} opts
 * @param {number} opts.requests  深度开发请求数（生成/迭代/修Bug）
 * @param {number} opts.publish   发布应用数
 * @param {number} opts.backend   启用后端服务数（15秒点/应用/天）
 * @param {number} opts.qc        AI 质检次数
 * @param {number} opts.skills    技能调用次数（按技能规则，此处仅占位）
 */
function estimate({ requests = 15, publish = 1, backend = 1, qc = 0, skills = 0 } = {}) {
  const c = PRICING.costs;
  const breakdown = {
    deep_dev: requests * c.deep_dev_request,
    publish: publish * c.publish_app,
    backend: backend * c.enable_backend,
    ai_qc: qc * c.ai_qc,
    skills: skills * 0, // 按技能规则，占位 0
  };
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  const freePool = PRICING.earn.new_user; // 610
  const coverageFree = +(freePool / total).toFixed(2);
  const dailyPool = PRICING.earn.daily_login; // 100
  const iterPerDaily = +(dailyPool / c.deep_dev_request).toFixed(1); // 每日100可支撑几次迭代请求

  return {
    platform: 'miaoda',
    unit: '秒点',
    requests,
    publish,
    backend,
    qc,
    breakdown,
    totalMiao: total,
    coverageFreePool: coverageFree,        // 免费610可覆盖多少次完整建站
    iterRequestsPerDaily100: iterPerDaily, // 每日100秒点可支撑几次迭代请求
    note: PRICING.assumptions.note,
  };
}

function parseArgs(argv) {
  const o = { requests: 15, publish: 1, backend: 1, qc: 0, skills: 0, json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--requests') o.requests = parseInt(argv[++i], 10);
    else if (a === '--publish') o.publish = parseInt(argv[++i], 10);
    else if (a === '--backend') o.backend = parseInt(argv[++i], 10);
    else if (a === '--qc') o.qc = parseInt(argv[++i], 10);
    else if (a === '--skills') o.skills = parseInt(argv[++i], 10);
    else if (a === '--json') o.json = true;
  }
  return o;
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  const r = estimate(args);

  if (args.json) {
    console.log(JSON.stringify(r, null, 2));
  } else {
    console.log('\n=== nexl-builder 建站成本估算（百度秒哒 MIAODA 秒点）===');
    console.log(`场景：6 步框架 · ${r.requests} 请求 · 发布 ${r.publish} · 后端 ${r.backend} · AI质检 ${r.qc}｜ 快照 ${PRICING.snapshotDate}\n`);
    console.log('深度开发请求'.padEnd(16), String(r.breakdown.deep_dev).padStart(8), '秒点');
    console.log('发布应用'.padEnd(16), String(r.breakdown.publish).padStart(8), '秒点');
    console.log('启用后端'.padEnd(16), String(r.breakdown.backend).padStart(8), '秒点');
    console.log('AI 质检'.padEnd(16), String(r.breakdown.ai_qc).padStart(8), '秒点');
    console.log('—'.repeat(32));
    console.log('总消耗'.padEnd(16), String(r.totalMiao).padStart(8), '秒点');
    console.log('\n免费额度覆盖：新用户 610 秒点 → 可覆盖', r.coverageFreePool, '次完整建站');
    console.log('每日登录 100 秒点 → 可支撑', r.iterRequestsPerDaily100, '次迭代请求');
    console.log('\n费率（官方确定）：深度请求30/条 · 发布20/个 · 后端15/应用/天 · AI质检60/次。会员价以 miaoda.cn 为准。\n');
  }
}

module.exports = { estimate, PRICING };
