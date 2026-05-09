const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 东方财富 API
app.get('/api/eastmoney/quote', async (req, res) => {
  const { codes } = req.query;
  try {
    const response = await fetch(
      `https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&invt=2&secid=${codes}&fields=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f12,f13,f14,f15,f16,f17,f18,f20,f21,f23,f24,f25,f22,f11,f62,f128,f136,f115,f152`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 新浪财经 API
app.get('/api/sina/quote', async (req, res) => {
  const { symbol } = req.query;
  try {
    const response = await fetch(
      `https://hq.sinajs.cn/list=${symbol}`,
      { headers: { 'Referer': 'https://finance.sina.com.cn' } }
    );
    const text = await response.text();
    res.type('text/plain').send(text);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 雪球 API
app.get('/api/xueqiu/quote', async (req, res) => {
  const { symbol } = req.query;
  try {
    const response = await fetch(
      `https://stock.xueqiu.com/v5/stock/quote.json?symbol=${symbol}&extend=detail`,
      { headers: { 'Cookie': 'xq_a_token=placeholder' } }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`FQMSystem API Proxy running on port ${PORT}`);
});
