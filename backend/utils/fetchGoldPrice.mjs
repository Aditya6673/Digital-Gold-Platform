import axios from 'axios';

export const fetchGoldPriceInINR = async () => {
  const API_KEY = process.env.METALS_API_KEY;
  const url = `https://metals-api.com/api/latest?access_key=${API_KEY}&base=INR&symbols=XAU`;

  try {
    const res = await axios.get(url);
    const rate = res.data?.rates?.XAU;

    if (!rate) throw new Error('XAU price not found');

    const inrPerOunce = 1 / rate;
    const inrPerGram = inrPerOunce / 31.1035;

    return parseFloat(inrPerGram.toFixed(2));
  } catch (err) {
    console.error('Live gold price fetch failed:', err.message);
    throw new Error('Gold price unavailable');
  }
};
