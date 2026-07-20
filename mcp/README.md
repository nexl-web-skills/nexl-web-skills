# MCP 层 · 连接与认证

MCP（Model Context Protocol）解决**底层连接与认证**，对应世界标准的 Layer 1。
tideshellbase 复用已有 CloudBase 环境，零新增运维。

## 连接清单
| 资源 | 协议 | 说明 |
|------|------|------|
| CloudBase 环境 `cloudbase-d9gumwykf42c90a92` | MCP / SDK | NoSQL(users/sites/reports) + 云函数 + 云存储 |
| 独立站域名解析 | HTTPS | 验证部署域名可达性 |
| 文件系统（构建产物） | 本地 | Astro 产物读写 |

## 安全
- 所有连接经已配置的 CloudBase Publishable Key + 用户 openid 鉴权。
- 写权限 CUSTOM 规则：`auth.openid == doc._openid`（owner-only）。
- 不持有任何私钥；密钥仅在 CloudBase 云端环境变量。
