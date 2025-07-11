import axios from 'axios';

export const fetchGoldPriceInINR = async () => {
  const API_KEY = process.env.GOLDAPI_KEY;
  const url = 'https://www.goldapi.io/api/XAU/INR';

  try {
    const response = await axios.get(url, {
      headers: {
        'x-access-token': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    const pricePerGram = response.data.price_gram_24k;

    return parseFloat(pricePerGram.toFixed(2));
  } catch (err) {
    console.error('Failed to fetch gold price from goldapi.io', err.message);
    throw new Error('Failed to fetch gold price from external API');
  }
};
