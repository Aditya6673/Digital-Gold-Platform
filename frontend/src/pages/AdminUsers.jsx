import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaUsers, FaFilter, FaSearch, FaEye, FaTrash, FaShieldAlt, FaCheck, FaTimes } from 'react-icons/fa'
import api from '../lib/axios'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    kycStatus: 'all',
    deleted: 'all',
    search: ''
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, filters])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/admin/users')
      // Fallback: filter out admins if any slip through
      const nonAdminUsers = Array.isArray(response.data) ? response.data.filter(u => u.role !== 'admin') : (response.data.users || []).filter(u => u.role !== 'admin')
      setUsers(nonAdminUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    // Apply KYC status filter
    if (filters.kycStatus !== 'all') {
      filtered = filtered.filter(user => user.kycStatus === filters.kycStatus)
    }

    // Apply deleted status filter
    if (filters.deleted !== 'all') {
      const isDeleted = filters.deleted === 'deleted'
      filtered = filtered.filter(user => user.deleted === isDeleted)
    }

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    setFilteredUsers(filtered)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const getKycStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'rejected':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getKycStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <FaCheck className="text-green-600" />
      case 'pending':
        return <FaShieldAlt className="text-yellow-600" />
      case 'rejected':
        return <FaTimes className="text-red-600" />
      default:
        return <FaShieldAlt className="text-gray-600" />
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
            User Management
          </h1>
          <p className="text-gray-600">Manage platform users and their KYC status</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="gold-card p-6 rounded-xl mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaFilter className="text-gold-primary" />
                <select
                  value={filters.kycStatus}
                  onChange={(e) => handleFilterChange('kycStatus', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-primary"
                >
                  <option value="all">All KYC Status</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={filters.deleted}
                  onChange={(e) => handleFilterChange('deleted', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-primary"
                >
                  <option value="all">All Users</option>
                  <option value="active">Active Only</option>
                  <option value="deleted">Deleted Only</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-primary"
              />
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="gold-card p-6 rounded-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-playfair text-2xl font-bold text-bronze-primary">
              All Users
            </h2>
            <span className="text-gray-600">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">KYC Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className={`border-b border-gray-100 hover:bg-gray-50 ${user.deleted ? 'opacity-60' : ''}`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gold-primary rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{user.name}</p>
                            <p className="text-sm text-gray-600">ID: {user._id.slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{user.email}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {getKycStatusIcon(user.kycStatus)}
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getKycStatusColor(user.kycStatus)}`}>
                            {user.kycStatus}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.deleted ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'}`}>
                          {user.deleted ? 'Deleted' : 'Active'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 p-2">
                            <FaEye />
                          </button>
                          <button className="text-red-600 hover:text-red-800 p-2">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Users Found</h3>
              <p className="text-gray-500">
                {users.length === 0 
                  ? "No users have registered yet." 
                  : "No users match your current filters."}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default AdminUsers 