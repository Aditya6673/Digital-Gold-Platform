import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCoins, FaSync, FaClock, FaArrowUp, FaArrowDown } from 'react-icons/fa'
import { formatINR } from '../utils/currency.jsx'
import api from '../lib/axios'
import { useToast } from '../context/ToastContext'

const ADMIN_PASSCODE = '1234'; // Ideally, use env or secure storage

const AdminPriceManager = () => {
  const [currentPrice, setCurrentPrice] = useState(0)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [priceHistory, setPriceHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [manualPrice, setManualPrice] = useState('')
  const [discount, setDiscount] = useState('')
  const [discountedPrice, setDiscountedPrice] = useState(null)
  const { showSuccess, showError } = useToast();
  const [passcode, setPasscode] = useState('');
  const [passcodeValidated, setPasscodeValidated] = useState(false);
  const [passcodeError, setPasscodeError] = useState('');

  useEffect(() => {
    fetchPriceData()
  }, [])

  const fetchPriceData = async () => {
    try {
      const response = await api.get('/api/gold/price')
      setCurrentPrice(response.data.price || 0)
      setLastUpdated(response.data.lastUpdated || null)
      
      // Fetch price history
      const historyResponse = await api.get('/api/gold/price-history')
      setPriceHistory(historyResponse.data.history || [])
    } catch (error) {
      console.error('Error fetching price data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updatePriceFromAPI = async () => {
    setUpdating(true)
    try {
      const response = await api.post('/api/gold/update-from-api')
      setCurrentPrice(response.data.price)
      setLastUpdated(response.data.lastUpdated)
      fetchPriceData() // Refresh all data
    } catch (error) {
      console.error('Error updating price from API:', error)
    } finally {
      setUpdating(false)
    }
  }

  const updatePriceManually = async () => {
    if (!manualPrice || isNaN(manualPrice)) return
    
    setUpdating(true)
    try {
      const response = await api.post('/api/gold/update-price', { price: parseFloat(manualPrice) })
      setCurrentPrice(response.data.price)
      setLastUpdated(response.data.lastUpdated)
      setManualPrice('')
      fetchPriceData() // Refresh all data
    } catch (error) {
      console.error('Error updating price manually:', error)
    } finally {
      setUpdating(false)
    }
  }

  const applyDiscount = async () => {
    if (!discount || isNaN(discount) || parseFloat(discount) > 100) return

    const discountAmount = (parseFloat(discount) / 100) * currentPrice
    const discountedPrice = currentPrice - discountAmount

    setDiscountedPrice(discountedPrice)

    setUpdating(true)
    try {
      const response = await api.post('/api/gold/update-price', { price: discountedPrice })
      setCurrentPrice(response.data.price)
      setLastUpdated(response.data.lastUpdated)
      setDiscount('') // Clear discount input
      fetchPriceData() // Refresh all data
      showSuccess('Discount applied and price updated successfully!')
    } catch (error) {
      showError('Error applying discount')
      console.error('Error applying discount:', error)
    } finally {
      setUpdating(false)
    }
  }

  const getPriceChange = () => {
    if (priceHistory.length < 2) return { change: 0, percentage: 0 }
    
    const current = priceHistory[0]?.price || currentPrice
    const previous = priceHistory[1]?.price || currentPrice
    const change = current - previous
    const percentage = previous > 0 ? (change / previous) * 100 : 0
    
    return { change, percentage }
  }

  const { change, percentage } = getPriceChange()

  const handlePasscodeSubmit = (e) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      setPasscodeValidated(true);
      setPasscodeError('');
    } else {
      setPasscodeError('Incorrect passcode');
      showError('Incorrect passcode');
    }
  };

  if (!passcodeValidated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige-light">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="gold-card p-8 rounded-xl shadow-lg w-full max-w-sm"
        >
          <h2 className="font-playfair text-2xl font-bold text-bronze-primary mb-4 text-center">
            Enter Admin Passcode
          </h2>
          <form onSubmit={handlePasscodeSubmit}>
            <input
              type="password"
              value={passcode}
              onChange={e => setPasscode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-primary mb-4"
              placeholder="Enter passcode"
              autoFocus
            />
            {passcodeError && (
              <div className="text-red-600 text-sm mb-2 text-center">{passcodeError}</div>
            )}
            <button
              type="submit"
              className="gold-button text-white w-full py-2 rounded-lg font-semibold"
            >
              Submit
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gold-primary text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-beige-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="font-playfair text-4xl font-bold text-bronze-primary mb-2">
            Price Manager
          </h1>
          <p className="text-gray-600">Manage gold prices and update from external APIs</p>
        </motion.div>

        {/* Current Price Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="gold-card p-8 rounded-xl mb-8"
        >
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <FaCoins className="text-5xl text-gold-primary mr-4" />
              <div>
                <h2 className="font-playfair text-4xl font-bold text-bronze-primary">
                  {discountedPrice !== null ? formatINR(discountedPrice) : formatINR(currentPrice)}
                </h2>
                {discountedPrice !== null && (
                  <div className="text-green-700 text-sm font-semibold mt-1">Discounted Price</div>
                )}
                <div className="flex items-center justify-center space-x-2 mt-2">
                  {change > 0 ? (
                    <FaArrowUp className="text-green-600" />
                  ) : change < 0 ? (
                    <FaArrowDown className="text-red-600" />
                  ) : null}
                  <span className={`text-sm font-semibold ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    {change > 0 ? '+' : ''}{change.toFixed(2)} ({percentage > 0 ? '+' : ''}{percentage.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-gray-600 mb-6">
              <FaClock />
              <span>Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={updatePriceFromAPI}
                disabled={updating}
                className="gold-button text-white px-6 py-3 rounded-lg flex items-center space-x-2 disabled:opacity-50"
              >
                <FaSync className={updating ? 'animate-spin' : ''} />
                <span>{updating ? 'Updating...' : 'Update from API'}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Discount Option */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="gold-card p-6 rounded-xl mb-8"
        >
          <h2 className="font-playfair text-2xl font-bold text-bronze-primary mb-4">
            Discount Option
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={discount || ''}
                onChange={e => setDiscount(e.target.value)}
                placeholder="Enter discount percentage..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-primary"
              />
            </div>
            <button
              onClick={applyDiscount}
              disabled={updating || !discount}
              className="gold-button text-white px-6 py-2 rounded-lg disabled:opacity-50"
            >
              Apply Discount
            </button>
          </div>
          {discountedPrice !== null && (
            <div className="mt-4 text-lg font-semibold text-green-700">
              Discounted Price: {formatINR(discountedPrice)}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default AdminPriceManager 