# 做T辅助计算器

A股做T（正T/反T）净盈利、保本价与成本摊薄计算器。纯静态页面，GitHub Pages 托管。

## 数据同步

数据（参数/费率/历史记录）通过自建 Cloudflare Worker 接口存入 Cloudflare KV：

- 接口：`GET/PUT https://api.zsyth.ipv64.net/data`，请求头 `X-Key` 带同步密钥
- Worker 源码：`worker.js`（KV 绑定 `TTDATA`，密钥为 Worker Secret `ACCESS_KEY`）
- 页面在「云同步设置（Cloudflare）」里粘贴一次密钥即可，密钥只存浏览器本地

旧版曾用 GitHub fine-grained token 读写私有仓库 `tt-calculator-data`，已弃用（数据已迁入 KV）。
