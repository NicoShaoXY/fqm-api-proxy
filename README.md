# FQMSystem API Proxy

部署在 Render 的 API 代理服务，供 FQMSystem 后端调用国内财经 API。

## API 端点

- `GET /api/eastmoney/quote?codes=1.600519` - 东方财富实时行情
- `GET /api/sina/quote?symbol=sh600519` - 新浪财经行情
- `GET /health` - 健康检查

## 部署

自动部署到 Render.com，请访问 https://dashboard.render.com
