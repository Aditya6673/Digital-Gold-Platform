import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCoins, FaChartLine, FaWallet, FaHistory } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { formatINR } from '../utils/currency.jsx'
import { useToast } from '../context/ToastContext'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../lib/axios'

const Dashboard = () => {
  const { user } = useAuth()
  const { showSuccess, showError } = useToast()
  const [goldPrice, setGoldPrice] = useState(0)
  const [portfolioValue, setPortfolioValue] = useState(0)
  const [holdings, setHoldings] = useState([])
  const [recentTransactions, setRecentTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalType, setModalType] = useState(null) // 'buy' or 'sell' or null
  const [inputType, setInputType] = useState('grams') // 'grams' or 'inr'
  const [amount, setAmount] = useState('')
  const [modalLoading, setModalLoading] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch gold price
      const priceResponse = await api.get('/gold/price')
      setGoldPrice(priceResponse.data.price || 2000)

      // Fetch portfolio data
      const portfolioResponse = await api.get('/holdings')
      setHoldings(portfolioResponse.data.holdings || [])
      setPortfolioValue(portfolioResponse.data.totalValue || 0)

      // Fetch recent transactions
      const transactionsResponse = await api.get('/transactions/recent')
      setRecentTransactions(transactionsResponse.data.transactions || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (type) => {
    setModalType(type)
    setInputType('grams')
    setAmount('')
  }

  const handleCloseModal = () => {
    setModalType(null)
    setAmount('')
  }

  const handleConfirm = async () => {
    setModalLoading(true)
    let endpoint = modalType === 'buy' ? '/api/transactions/buy' : '/api/transactions/sell'
    let payload = {}
    if (inputType === 'grams') {
      payload.grams = parseFloat(amount)
    } else {
      payload.inr = parseFloat(amount)
    }
    try {
      const response = await api.post(endpoint.replace('/api', ''), payload)
      showSuccess(response.data.message || `${modalType === 'buy' ? 'Buy' : 'Sell'} successful!`)
      fetchDashboardData()
      handleCloseModal()
    } catch (error) {
      showError(error.response?.data?.message || 'Transaction failed')
    } finally {
      setModalLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" color="gold-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-beige-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Buy/Sell Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end mb-6 gap-4">
          <button
            onClick={() => handleOpenModal('buy')}
            className="gold-button text-white px-6 py-3 rounded-lg font-semibold shadow hover:scale-105 transition-transform"
          >
            Buy Gold
          </button>
          <button
            onClick={() => handleOpenModal('sell')}
            className="bg-bronze-primary text-white px-6 py-3 rounded-lg font-semibold shadow hover:scale-105 transition-transform"
          >
            Sell Gold
          </button>
        </div>

        {/* Modal for Buy/Sell */}
        {modalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative"
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
              <h2 className="text-2xl font-playfair font-bold text-bronze-primary mb-4 text-center">
                {modalType === 'buy' ? 'Buy Gold' : 'Sell Gold'}
              </h2>
              <div className="flex justify-center mb-4 gap-2">
                <button
                  className={`px-4 py-2 rounded-l-lg border ${inputType === 'grams' ? 'bg-gold-primary text-white' : 'bg-gray-100 text-gray-700'}`}
                  onClick={() => setInputType('grams')}
                  disabled={modalLoading}
                >
                  By Grams
                </button>
                <button
                  className={`px-4 py-2 rounded-r-lg border ${inputType === 'inr' ? 'bg-gold-primary text-white' : 'bg-gray-100 text-gray-700'}`}
                  onClick={() => setInputType('inr')}
                  disabled={modalLoading}
                >
                  By INR
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {inputType === 'grams' ? 'Enter grams' : 'Enter INR value'}
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-primary"
                  placeholder={inputType === 'grams' ? 'e.g. 1.5' : 'e.g. 5000'}
                  disabled={modalLoading}
                />
              </div>
              <button
                onClick={handleConfirm}
                disabled={modalLoading || !amount || isNaN(amount) || parseFloat(amount) <= 0}
                className="w-full gold-button text-white py-3 px-4 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {modalLoading ? (modalType === 'buy' ? 'Buying...' : 'Selling...') : (modalType === 'buy' ? 'Buy' : 'Sell')}
              </button>
            </motion.div>
          </div>
        )}

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="font-playfair text-4xl font-bold text-bronze-primary mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Here's your investment overview</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="gold-card p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Current Gold Price</p>
                <p className="text-2xl font-bold text-gold-primary">{formatINR(goldPrice)}</p>
              </div>
              <FaCoins className="text-3xl text-gold-primary" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="gold-card p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Portfolio Value</p>
                <p className="text-2xl font-bold text-bronze-primary">{formatINR(portfolioValue)}</p>
              </div>
              <FaWallet className="text-3xl text-bronze-primary" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="gold-card p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Holdings</p>
                <p className="text-2xl font-bold text-gold-primary">{holdings.length}</p>
              </div>
              <FaChartLine className="text-3xl text-gold-primary" />
            </div>
          </motion.div>
        </div>

        {/* Holdings and Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Holdings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="gold-card p-6 rounded-xl"
          >
            <h2 className="font-playfair text-2xl font-bold text-bronze-primary mb-4">
              Your Holdings
            </h2>
            {holdings.length > 0 ? (
              <div className="space-y-4">
                {holdings.map((holding, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-white rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800">{holding.type}</p>
                      <p className="text-sm text-gray-600">{holding.quantity} grams</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gold-primary">{formatINR(holding.value)}</p>
                      <p className="text-sm text-gray-600">{holding.purchaseDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaCoins className="text-4xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No holdings yet. Start investing in gold today!</p>
              </div>
            )}
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="gold-card p-6 rounded-xl"
          >
            <h2 className="font-playfair text-2xl font-bold text-bronze-primary mb-4">
              Recent Transactions
            </h2>
            {recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FaHistory className="text-gold-primary" />
                      <div>
                        <p className="font-semibold text-gray-800">{transaction.type}</p>
                        <p className="text-sm text-gray-600">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${transaction.type === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'BUY' ? '+' : '-'}{formatINR(transaction.amount)}
                      </p>
                      <p className="text-sm text-gray-600">{transaction.quantity}g</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaHistory className="text-4xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No transactions yet.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 