import fetch from 'node-fetch';

export const fetchGoldPriceInINR = async () => {
  const url = "https://www.goldapi.io/api/XAU/INR";
  const apiKey = process.env.GOLDAPI_KEY;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        "x-access-token": apiKey,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`GoldAPI error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    // goldapi.io returns price_gram_24k for price per gram in INR
    if (!data.price_gram_24k) throw new Error('No price_gram_24k in response');
    return parseFloat(data.price_gram_24k);
  } catch (err) {
    console.error('Failed to fetch gold price from GoldAPI', err.message);
    throw new Error('Failed to fetch gold price from GoldAPI');
  }
};
