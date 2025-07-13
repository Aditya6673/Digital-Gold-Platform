// Currency utility functions
export const INR_SYMBOL = 'Rs'; // Use 'Rs' instead of the INR symbol

// Format amount with Rs symbol
export const formatINR = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${INR_SYMBOL} 0`;
  }
  return `${INR_SYMBOL} ${parseFloat(amount).toLocaleString('en-IN')}`;
};

// Format amount with Rs symbol and CSS class for better font support
export const formatINRWithClass = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return <span className="inr-symbol">Rs 0</span>;
  }
  return <span className="inr-symbol">Rs {parseFloat(amount).toLocaleString('en-IN')}</span>;
};

// Format amount without symbol
export const formatAmount = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0';
  }
  return parseFloat(amount).toLocaleString('en-IN');
};

// Get Rs symbol as string
export const getINRSymbol = () => INR_SYMBOL; 