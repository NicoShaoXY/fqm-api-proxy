# FQMSystem API Proxy

Vercel-deployed API proxy for FQMSystem, accessible from mainland China.

## API Endpoints

```
GET /api/index?type=eastmoney&codes=000001,600000
GET /api/index?type=sina&symbols=000001,600000
GET /api/index?type=xueqiu&symbol=000001
```

## Deploy

1. Import this repo to Vercel
2. Deploy — no env vars needed
3. Update FQMSystem backend proxy URL
