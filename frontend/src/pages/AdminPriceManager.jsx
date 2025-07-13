import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCoins, FaSync, FaClock, FaArrowUp, FaArrowDown } from 'react-icons/fa'
import { formatINR } from '../utils/currency.jsx'

const AdminPriceManager = () => {
  const [currentPrice, setCurrentPrice] = useState(0)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [priceHistory, setPriceHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [manualPrice, setManualPrice] = useState('')

  useEffect(() => {
    fetchPriceData()
  }, [])

  const fetchPriceData = async () => {
    try {
      const response = await api.get('/gold/price')
      setCurrentPrice(response.data.price || 0)
      setLastUpdated(response.data.lastUpdated || null)
      
      // Fetch price history
      const historyResponse = await api.get('/gold/price-history')
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
      const response = await api.post('/gold/update-from-api')
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
      const response = await api.post('/gold/update-price', { price: parseFloat(manualPrice) })
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

  const getPriceChange = () => {
    if (priceHistory.length < 2) return { change: 0, percentage: 0 }
    
    const current = priceHistory[0]?.price || currentPrice
    const previous = priceHistory[1]?.price || currentPrice
    const change = current - previous
    const percentage = previous > 0 ? (change / previous) * 100 : 0
    
    return { change, percentage }
  }

  const { change, percentage } = getPriceChange()

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
                  {formatINR(currentPrice)}
                </h2>
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

        {/* Manual Price Update */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="gold-card p-6 rounded-xl mb-8"
        >
          <h2 className="font-playfair text-2xl font-bold text-bronze-primary mb-4">
            Manual Price Update
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Gold Price (INR)
              </label>
              <input
                type="number"
                step="0.01"
                value={manualPrice}
                onChange={(e) => setManualPrice(e.target.value)}
                placeholder="Enter new price..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-primary"
              />
            </div>
            <button
              onClick={updatePriceManually}
              disabled={!manualPrice || updating}
              className="gold-button text-white px-6 py-2 rounded-lg disabled:opacity-50"
            >
              Update Price
            </button>
          </div>
        </motion.div>

        {/* Price History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="gold-card p-6 rounded-xl"
        >
          <h2 className="font-playfair text-2xl font-bold text-bronze-primary mb-4">
            Price History
          </h2>
          
          {priceHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date & Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Price (INR)</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Change</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {priceHistory.map((entry, index) => {
                    const prevPrice = index < priceHistory.length - 1 ? priceHistory[index + 1].price : entry.price
                    const change = entry.price - prevPrice
                    const percentage = prevPrice > 0 ? (change / prevPrice) * 100 : 0
                    
                    return (
                      <motion.tr
                        key={entry._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4 text-gray-700">
                          {new Date(entry.timestamp).toLocaleString()}
                        </td>
                        <td className="py-4 px-4 font-semibold text-gold-primary">
                          {formatINR(entry.price)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            {change > 0 ? (
                              <FaArrowUp className="text-green-600 text-sm" />
                            ) : change < 0 ? (
                              <FaArrowDown className="text-red-600 text-sm" />
                            ) : null}
                            <span className={`text-sm font-semibold ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                              {change > 0 ? '+' : ''}{change.toFixed(2)} ({percentage > 0 ? '+' : ''}{percentage.toFixed(2)}%)
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {entry.source || 'Manual'}
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FaCoins className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Price History</h3>
              <p className="text-gray-500">Price history will appear here after updates.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default AdminPriceManager 