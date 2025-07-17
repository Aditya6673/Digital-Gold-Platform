import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaUsers, FaCoins, FaChartLine, FaShieldAlt, FaArrowUp, FaArrowDown, FaWarehouse } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import api from '../lib/axios'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGoldSold: 0,
    totalGoldBought: 0,
    totalTransactions: 0,
    pendingKyc: 0,
    activeUsers: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminStats()
  }, [])

  const fetchAdminStats = async () => {
    try {
      const response = await api.get('/api/admin/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching admin stats:', error)
    } finally {
      setLoading(false)
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="font-playfair text-4xl font-bold text-bronze-primary mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Welcome back, {user?.name}. Here's your platform overview.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="gold-card p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gold-primary">{(stats.totalUsers || 0).toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <FaArrowUp className="mr-1" />
                  {stats.activeUsers} active
                </p>
              </div>
              <FaUsers className="text-4xl text-gold-primary" />
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
                <p className="text-gray-600 text-sm">Gold Sold</p>
                <p className="text-3xl font-bold text-red-600">{(stats.totalGoldSold || 0).toFixed(2)}g</p>
                <p className="text-sm text-gray-600 mt-1">Total volume</p>
              </div>
              <FaCoins className="text-4xl text-red-600" />
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
                <p className="text-gray-600 text-sm">Gold Bought</p>
                <p className="text-3xl font-bold text-green-600">{(stats.totalGoldBought || 0).toFixed(2)}g</p>
                <p className="text-sm text-gray-600 mt-1">Total volume</p>
              </div>
              <FaCoins className="text-4xl text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="gold-card p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Transactions</p>
                <p className="text-3xl font-bold text-bronze-primary">{(stats.totalTransactions || 0).toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-1">All time</p>
              </div>
              <FaChartLine className="text-4xl text-bronze-primary" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="gold-card p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending KYC</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingKyc}</p>
                <p className="text-sm text-yellow-600 mt-1">Requires attention</p>
              </div>
              <FaShieldAlt className="text-4xl text-yellow-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="gold-card p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Users</p>
                <p className="text-3xl font-bold text-green-600">{(stats.activeUsers || 0).toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">This month</p>
              </div>
              <FaUsers className="text-4xl text-green-600" />
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="gold-card p-6 rounded-xl"
        >
          <h2 className="font-playfair text-2xl font-bold text-bronze-primary mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              className="gold-button text-white p-4 rounded-lg text-center hover:transform hover:scale-105 transition-transform"
              onClick={() => navigate('/admin/kyc')}
            >
              <FaShieldAlt className="text-2xl mx-auto mb-2" />
              <span className="font-semibold">Review KYC</span>
            </button>
            <button
              className="gold-button text-white p-4 rounded-lg text-center hover:transform hover:scale-105 transition-transform"
              onClick={() => navigate('/admin/users')}
            >
              <FaUsers className="text-2xl mx-auto mb-2" />
              <span className="font-semibold">Manage Users</span>
            </button>
            <button
              className="gold-button text-white p-4 rounded-lg text-center hover:transform hover:scale-105 transition-transform"
              onClick={() => navigate('/admin/price')}
            >
              <FaCoins className="text-2xl mx-auto mb-2" />
              <span className="font-semibold">Update Prices</span>
            </button>
            <button
              className="gold-button text-white p-4 rounded-lg text-center hover:transform hover:scale-105 transition-transform"
              onClick={() => navigate('/admin/inventory')}
            >
              <FaWarehouse className="text-2xl mx-auto mb-2" />
              <span className="font-semibold">Manage Inventory</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard 