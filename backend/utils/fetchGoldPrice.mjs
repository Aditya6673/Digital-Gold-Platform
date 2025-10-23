import fetch from 'node-fetch';

export const fetchGoldPriceInINR = async () => {
  const ajaxUrl = "https://www.muthootfinance.com/callajax";
  const payload = {
    'action': 'get_gold_price'
  };

  try {
    const response = await fetch(ajaxUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(payload)
    });

    if (!response.ok) {
      throw new Error(`Muthoot Finance API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const priceHtmlString = data.daily_gold_price;

    if (!priceHtmlString) {
      throw new Error('Could not find the price key in the API response');
    }

    // Parse the HTML response to extract the price
    // The price is typically the first text node in the response
    const priceMatch = priceHtmlString.match(/(\d{1,3}(?:,\d{3})*)/);
    if (!priceMatch) {
      throw new Error('Could not extract price from HTML response');
    }

    const livePriceStr = priceMatch[1];
    const livePrice = parseFloat(livePriceStr.replace(/,/g, ''));

    if (isNaN(livePrice)) {
      throw new Error('Invalid price format received');
    }

    return livePrice;
  } catch (err) {
    console.error('Failed to fetch gold price from Muthoot Finance:', err.message);
    throw new Error('Failed to fetch gold price from Muthoot Finance');
  }
};

export const fetchDetailedGoldPrice = async () => {
  const ajaxUrl = "https://www.muthootfinance.com/callajax";
  const payload = {
    'action': 'get_gold_price'
  };

  try {
    const response = await fetch(ajaxUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(payload)
    });

    if (!response.ok) {
      throw new Error(`Muthoot Finance API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const priceHtmlString = data.daily_gold_price;

    if (!priceHtmlString) {
      throw new Error('Could not find the price key in the API response');
    }

    // Extract price
    const priceMatch = priceHtmlString.match(/(\d{1,3}(?:,\d{3})*)/);
    if (!priceMatch) {
      throw new Error('Could not extract price from HTML response');
    }

    const livePriceStr = priceMatch[1];
    const livePrice = parseFloat(livePriceStr.replace(/,/g, ''));

    if (isNaN(livePrice)) {
      throw new Error('Invalid price format received');
    }

    // Extract change information
    let changeAmount = 0;
    let direction = 'No change';

    // Look for change amount in the HTML
    const changeMatch = priceHtmlString.match(/INR\s*([+-]?\d+(?:,\d{3})*)/);
    if (changeMatch) {
      const changeStr = changeMatch[1].replace(/,/g, '');
      changeAmount = parseFloat(changeStr);
      
      // Determine direction based on the sign or CSS classes
      if (changeAmount > 0) {
        direction = 'Increase';
      } else if (changeAmount < 0) {
        direction = 'Decrease';
        changeAmount = Math.abs(changeAmount); // Return positive value for display
      }
    }

    // Check for CSS classes that indicate direction
    if (priceHtmlString.includes('greenTxt') || priceHtmlString.includes('fa-arrow-up')) {
      direction = 'Increase';
    } else if (priceHtmlString.includes('redTxt') || priceHtmlString.includes('fa-arrow-down')) {
      direction = 'Decrease';
    }

    return {
      price: livePrice,
      changeAmount,
      direction,
      lastUpdated: new Date().toISOString()
    };
  } catch (err) {
    console.error('Failed to fetch detailed gold price from Muthoot Finance:', err.message);
    throw new Error('Failed to fetch detailed gold price from Muthoot Finance');
  }
};
