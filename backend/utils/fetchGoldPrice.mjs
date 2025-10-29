import fetch from 'node-fetch';

// Fetch quote from MCX GetQuote endpoint
export const fetchMcxQuote = async ({ commodity = 'GOLD', expiry = '05DEC2025' } = {}) => {
  const url = 'https://www.mcxindia.com/BackPage.aspx/GetQuote';

  const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Accept': '*/*',
    'X-Requested-With': 'XMLHttpRequest'
  };

  const body = JSON.stringify({ Commodity: commodity, Expiry: expiry });

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body
  });

  if (!response.ok) {
    throw new Error(`MCX API error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  // ASP.NET WebMethod typically wraps result under "d"
  const payload = typeof json?.d === 'string' ? JSON.parse(json.d) : (json?.d ?? json);
  return payload;
};

// Removed legacy Muthoot implementation; MCX is the sole source now

export const fetchDetailedGoldPrice = async ({ commodity = 'GOLD', expiry = '05DEC2025' } = {}) => {
  const quote = await fetchMcxQuote({ commodity, expiry });
  const rawPrice = quote?.LTP ?? quote?.LastTradedPrice ?? quote?.Price ?? quote?.ltp;
  const price = typeof rawPrice === 'string' ? parseFloat(rawPrice.replace(/,/g, '')) : Number(rawPrice);

  const rawChange = quote?.Change ?? quote?.Chng ?? quote?.change ?? quote?.chg;
  let changeAmount = 0;
  if (rawChange !== undefined && rawChange !== null && rawChange !== '') {
    changeAmount = typeof rawChange === 'string' ? parseFloat(rawChange.replace(/,/g, '')) : Number(rawChange);
  }

  let direction = 'No change';
  if (!Number.isNaN(changeAmount)) {
    if (changeAmount > 0) direction = 'Increase';
    else if (changeAmount < 0) direction = 'Decrease';
    changeAmount = Math.abs(changeAmount) || 0;
  } else {
    changeAmount = 0;
  }

  if (Number.isNaN(price) || !isFinite(price)) {
    throw new Error('Invalid MCX price');
  }

  return {
    price,
    changeAmount,
    direction,
    lastUpdated: new Date().toISOString(),
    source: 'MCX'
  };
};
