export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { type, codes, symbols, symbol } = req.query;

  if (!type) {
    return res.status(200).json({
      service: 'FQMSystem API Proxy',
      status: 'ok',
      version: '1.0.0',
      endpoints: {
        eastmoney: '/api/index?type=eastmoney&codes=000001,600000',
        sina: '/api/index?type=sina&symbols=000001,600000',
        xueqiu: '/api/index?type=xueqiu&symbol=000001',
      }
    });
  }

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Referer': 'https://finance.eastmoney.com',
    'Accept': 'application/json, text/plain, */*',
  };

  let targetUrl = '';

  try {
    if (type === 'eastmoney' && codes) {
      const codeList = codes.split(',').map(c => {
        if (c.startsWith('6')) return `1.${c}`;
        if (c.startsWith('0') || c.startsWith('3')) return `0.${c}`;
        return c;
      }).join(',');
      targetUrl = `https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&invt=2&fields=f12,f14,f2,f3,f4,f5,f6&secids=${codeList}`;
    } else if (type === 'sina' && symbols) {
      const symList = symbols.split(',').map(s => {
        if (s.startsWith('6')) return `sh${s}`;
        if (s.startsWith('0') || s.startsWith('3')) return `sz${s}`;
        return s;
      }).join(',');
      targetUrl = `https://hq.sinajs.cn/list=${symList}`;
    } else if (type === 'xueqiu' && symbol) {
      const s = symbol.startsWith('6') ? `SH${symbol}` : `SZ${symbol}`;
      targetUrl = `https://stock.xueqiu.com/v5/stock/realtime/quotec.json?symbol=${s}`;
      headers['Cookie'] = 'xq_a_token=placeholder';
    } else {
      return res.status(400).json({ error: 'Missing required params' });
    }

    const response = await fetch(targetUrl, { headers });
    const text = await response.text();
    const ct = response.headers.get('content-type') || 'text/plain';
    res.setHeader('Content-Type', ct);
    return res.status(200).send(text);

  } catch (err) {
    return res.status(500).json({ error: 'Proxy error', detail: err.message });
  }
}
