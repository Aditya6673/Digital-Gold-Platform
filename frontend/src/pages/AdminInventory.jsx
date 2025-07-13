import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCoins, FaPlus, FaMinus, FaSync, FaWarehouse } from 'react-icons/fa'
import api from '../lib/axios'

const AdminInventory = () => {
  const [currentInventory, setCurrentInventory] = useState(0)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [grams, setGrams] = useState('')
  const [operation, setOperation] = useState('add')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const response = await api.get('/inventory')
      setCurrentInventory(parseFloat(response.data.availableGrams) || 0)
    } catch (error) {
      console.error('Error fetching inventory:', error)
      setError('Failed to fetch inventory')
    } finally {
      setLoading(false)
    }
  }

  const updateInventory = async () => {
    if (!grams || isNaN(grams) || parseFloat(grams) <= 0) {
      setError('Please enter a valid quantity')
      return
    }

    setUpdating(true)
    setError('')
    setMessage('')

    try {
      const response = await api.post('/inventory/update', {
        grams: parseFloat(grams),
        operation: operation
      })

      setMessage(response.data.message)
      setCurrentInventory(response.data.newTotal)
      setGrams('')
      setOperation('add')
    } catch (error) {
      console.error('Error updating inventory:', error)
      setError(error.response?.data?.message || 'Failed to update inventory')
    } finally {
      setUpdating(false)
    }
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="font-playfair text-4xl font-bold text-bronze-primary mb-2">
            Inventory Manager
          </h1>
          <p className="text-gray-600">Manage gold inventory levels</p>
        </motion.div>

        {/* Current Inventory Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="gold-card p-8 rounded-xl mb-8"
        >
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <FaWarehouse className="text-5xl text-gold-primary mr-4" />
              <div>
                <h2 className="font-playfair text-4xl font-bold text-bronze-primary">
                  {currentInventory.toLocaleString()} grams
                </h2>
                <p className="text-gray-600 mt-2">Available Gold Inventory</p>
              </div>
            </div>
            
            <button
              onClick={fetchInventory}
              disabled={loading}
              className="gold-button text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto disabled:opacity-50"
            >
              <FaSync className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </motion.div>

        {/* Update Inventory Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="gold-card p-6 rounded-xl mb-8"
        >
          <h2 className="font-playfair text-2xl font-bold text-bronze-primary mb-4">
            Update Inventory
          </h2>

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Operation Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operation
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="add"
                    checked={operation === 'add'}
                    onChange={(e) => setOperation(e.target.value)}
                    className="mr-2 text-gold-primary focus:ring-gold-primary"
                  />
                  <span className="flex items-center text-green-600">
                    <FaPlus className="mr-1" />
                    Add Gold
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="remove"
                    checked={operation === 'remove'}
                    onChange={(e) => setOperation(e.target.value)}
                    className="mr-2 text-gold-primary focus:ring-gold-primary"
                  />
                  <span className="flex items-center text-red-600">
                    <FaMinus className="mr-1" />
                    Remove Gold
                  </span>
                </label>
              </div>
            </div>

            {/* Quantity Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity (grams)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={grams}
                onChange={(e) => setGrams(e.target.value)}
                placeholder="Enter quantity in grams..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-primary"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={updateInventory}
              disabled={!grams || updating}
              className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 ${
                operation === 'add' 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {updating ? (
                <>
                  <FaSync className="animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  {operation === 'add' ? <FaPlus /> : <FaMinus />}
                  <span>{operation === 'add' ? 'Add' : 'Remove'} Gold</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="gold-card p-6 rounded-xl"
        >
          <h3 className="font-playfair text-xl font-bold text-bronze-primary mb-4">
            Inventory Management Guidelines
          </h3>
          <div className="space-y-3 text-gray-600">
            <div className="flex items-start space-x-2">
              <FaCoins className="text-gold-primary mt-1 flex-shrink-0" />
              <p>Add gold when new physical gold is acquired or when customers redeem their digital holdings.</p>
            </div>
            <div className="flex items-start space-x-2">
              <FaCoins className="text-gold-primary mt-1 flex-shrink-0" />
              <p>Remove gold when physical gold is sold or when inventory needs to be adjusted.</p>
            </div>
            <div className="flex items-start space-x-2">
              <FaCoins className="text-gold-primary mt-1 flex-shrink-0" />
              <p>All inventory changes are logged for audit purposes.</p>
            </div>
            <div className="flex items-start space-x-2">
              <FaCoins className="text-gold-primary mt-1 flex-shrink-0" />
              <p>Ensure sufficient inventory is available before allowing customer purchases.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminInventory 