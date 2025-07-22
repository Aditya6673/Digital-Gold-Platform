import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FaUser, FaEnvelope, FaPhone, FaShieldAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { formatINR } from '../utils/currency.jsx'
import api from '../lib/axios'

const Profile = () => {
  const { user, refreshUser } = useAuth()
  const { showSuccess, showError } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })

  const [holdings, setHoldings] = useState([])
  const [totalValue, setTotalValue] = useState(0)
  const [kycForm, setKycForm] = useState({
    pan: '',
    aadhar: '',
    panImage: null,
    aadharImage: null,
    panImageUrl: '',
    aadharImageUrl: ''
  })
  const [kycLoading, setKycLoading] = useState(false)
  const panInputRef = useRef()
  const aadharInputRef = useRef()

  useEffect(() => {
    fetchUserHoldings()
  }, [])

  useEffect(() => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
  }, [user]);

  const fetchUserHoldings = async () => {
    try {
      const response = await api.get('/api/holdings/me')
      setHoldings(response.data.holdings || [])
      setTotalValue(response.data.totalValue || 0)
    } catch (error) {
      console.error('Error fetching holdings:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.put('/api/users/profile', formData)
      showSuccess('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    })
    setIsEditing(false)
  }

  // KYC image upload helper
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/api/users/kyc/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (response.data.url) return response.data.url;
    throw new Error('Image upload failed');
  };

  const handleKycInputChange = (e) => {
    const { name, value, files } = e.target
    if (files) {
      setKycForm(prev => ({ ...prev, [name]: files[0] }))
    } else {
      setKycForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleKycSubmit = async (e) => {
    e.preventDefault()
    setKycLoading(true)
    try {
      // Upload images first
      let panImageUrl = kycForm.panImageUrl
      let aadharImageUrl = kycForm.aadharImageUrl
      if (kycForm.panImage) {
        panImageUrl = await uploadImage(kycForm.panImage)
      }
      if (kycForm.aadharImage) {
        aadharImageUrl = await uploadImage(kycForm.aadharImage)
      }
      // Submit KYC data
      const response = await api.patch('/api/users/kyc', {
        pan: kycForm.pan,
        aadhar: kycForm.aadhar,
        panImageUrl,
        aadharImageUrl
      })
      showSuccess(response.data.message || 'KYC submitted successfully!')
      setKycForm({ pan: '', aadhar: '', panImage: null, aadharImage: null, panImageUrl: '', aadharImageUrl: '' })
      await refreshUser()
    } catch (error) {
      showError('KYC submission failed. Please try again.')
    } finally {
      setKycLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-beige-light py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-playfair font-bold text-bronze-primary mb-2">
              My Profile
            </h1>
            <p className="text-gray-600">Manage your account information and view your holdings</p>
          </div>

          {/* KYC Section */}
          {user?.kyc?.status === 'not_submitted' || user?.kyc?.status === 'rejected' ? (
            <div className="gold-card rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-bronze-primary mb-4">Complete Your KYC</h2>
              {user?.kyc?.status === 'rejected' && (
                <div className="mb-4 text-red-600 font-semibold">Your KYC was rejected. Please resubmit your details.</div>
              )}
              <form onSubmit={handleKycSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
                  <input
                    type="text"
                    name="pan"
                    value={kycForm.pan}
                    onChange={handleKycInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Number</label>
                  <input
                    type="text"
                    name="aadhar"
                    value={kycForm.aadhar}
                    onChange={handleKycInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PAN Image</label>
                  <input
                    type="file"
                    name="panImage"
                    accept="image/*"
                    ref={panInputRef}
                    onChange={handleKycInputChange}
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Image</label>
                  <input
                    type="file"
                    name="aadharImage"
                    accept="image/*"
                    ref={aadharInputRef}
                    onChange={handleKycInputChange}
                    className="w-full"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={kycLoading}
                  className="w-full gold-button text-white py-3 px-4 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {kycLoading ? 'Submitting...' : 'Submit KYC'}
                </button>
              </form>
            </div>
          ) : user?.kyc?.status === 'pending' ? (
            <div className="gold-card rounded-lg p-6 mb-8 text-center">
              <h2 className="text-2xl font-playfair font-semibold text-bronze-primary mb-4">KYC Under Verification</h2>
              <p className="text-yellow-700 font-medium">Your KYC documents have been submitted and are under review. Please wait for approval.</p>
            </div>
          ) : user?.kyc?.status === 'verified' ? (
            <div className="gold-card rounded-lg p-6 mb-8 text-center">
              <h2 className="text-2xl font-playfair font-semibold text-bronze-primary mb-4">KYC Completed</h2>
              <p className="text-green-700 font-medium">Your KYC is verified. You can now buy and redeem gold.</p>
            </div>
          ) : null}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Information */}
            <div className="gold-card rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-playfair font-semibold text-bronze-primary">
                  Personal Information
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 text-gold-primary hover:text-bronze-primary transition-colors"
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-primary"
                      required
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 gold-button text-white py-2 px-4 rounded-md font-medium disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaUser className="text-gold-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{user?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-gold-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-gold-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{user?.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaShieldAlt className="text-gold-primary" />
                    <div>
                      <p className="text-sm text-gray-500">KYC Status</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user?.kyc?.status === 'verified'
                          ? 'bg-green-100 text-green-800'
                          : user?.kyc?.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : user?.kyc?.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user?.kyc?.status === 'verified'
                          ? 'Verified'
                          : user?.kyc?.status === 'pending'
                          ? 'Pending'
                          : user?.kyc?.status === 'rejected'
                          ? 'Rejected'
                          : 'Not Submitted'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Holdings Summary */}
            <div className="gold-card rounded-lg p-6">
              <h2 className="text-2xl font-playfair font-semibold text-bronze-primary mb-6">
                Holdings Summary
              </h2>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-gold-primary to-bronze-primary p-4 rounded-lg text-white">
                  <p className="text-sm opacity-90">Total Portfolio Value</p>
                  <p className="text-2xl font-bold">{formatINR(totalValue)}</p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700">Recent Holdings</h3>
                  {holdings.length > 0 ? (
                    holdings.slice(0, 3).map((holding, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{holding.grams}g Gold</p>
                          <p className="text-sm text-gray-500">
                            Purchased: {new Date(holding.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="font-semibold text-gold-primary">
                          {formatINR(holding.value)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No holdings yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile 