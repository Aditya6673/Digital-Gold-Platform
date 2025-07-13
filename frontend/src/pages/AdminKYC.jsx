import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaShieldAlt, FaCheck, FaTimes, FaEye, FaDownload, FaFilter } from 'react-icons/fa'
import api from '../lib/axios'

const AdminKYC = () => {
  const [kycApplications, setKycApplications] = useState([])
  const [filteredApplications, setFilteredApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [filter, setFilter] = useState('pending')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchKYCApplications()
  }, [])

  useEffect(() => {
    filterApplications()
  }, [kycApplications, filter])

  const fetchKYCApplications = async () => {
    try {
      const response = await api.get('/api/admin/kyc')
      setKycApplications(response.data.applications || [])
    } catch (error) {
      console.error('Error fetching KYC applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterApplications = () => {
    if (filter === 'all') {
      setFilteredApplications(kycApplications)
    } else {
      setFilteredApplications(kycApplications.filter(app => app.status === filter))
    }
  }

  const handleKycAction = async (applicationId, action) => {
    try {
      const response = await api.put(`/api/admin/kyc/${applicationId}/${action}`)
      // Refresh the applications list
      fetchKYCApplications()
      setShowModal(false)
      setSelectedApplication(null)
    } catch (error) {
      console.error('Error updating KYC status:', error)
    }
  }

  const getStatusColor = (status) => {
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

  const getStatusIcon = (status) => {
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
            KYC Approvals
          </h1>
          <p className="text-gray-600">Review and approve user-submitted KYC documents</p>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="gold-card p-6 rounded-xl mb-8"
        >
          <div className="flex items-center space-x-4">
            <FaFilter className="text-gold-primary" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-primary"
            >
              <option value="all">All Applications</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </motion.div>

        {/* KYC Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="gold-card p-6 rounded-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-playfair text-2xl font-bold text-bronze-primary">
              KYC Applications
            </h2>
            <span className="text-gray-600">
              {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredApplications.length > 0 ? (
            <div className="space-y-4">
              {filteredApplications.map((application, index) => (
                <motion.div
                  key={application._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gold-primary rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {application.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{application.user.name}</h3>
                        <p className="text-sm text-gray-600">{application.user.email}</p>
                        <p className="text-xs text-gray-500">Submitted: {new Date(application.submittedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(application.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedApplication(application)
                            setShowModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-800 p-2"
                          title="View Documents"
                        >
                          <FaEye />
                        </button>
                        {application.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleKycAction(application._id, 'approve')}
                              className="text-green-600 hover:text-green-800 p-2"
                              title="Approve"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => handleKycAction(application._id, 'reject')}
                              className="text-red-600 hover:text-red-800 p-2"
                              title="Reject"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaShieldAlt className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No KYC Applications</h3>
              <p className="text-gray-500">
                {kycApplications.length === 0 
                  ? "No KYC applications have been submitted yet." 
                  : "No applications match your current filter."}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Document Viewer Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-playfair text-2xl font-bold text-bronze-primary">
                KYC Documents - {selectedApplication.user.name}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Personal Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Name:</strong> {selectedApplication.user.name}</p>
                  <p><strong>Email:</strong> {selectedApplication.user.email}</p>
                  <p><strong>Phone:</strong> {selectedApplication.phone || 'Not provided'}</p>
                  <p><strong>Address:</strong> {selectedApplication.address || 'Not provided'}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Documents</h4>
                <div className="space-y-2">
                  {selectedApplication.documents?.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm text-gray-700">{doc.type}</span>
                      <button className="text-blue-600 hover:text-blue-800 p-1">
                        <FaDownload />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {selectedApplication.status === 'pending' && (
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => handleKycAction(selectedApplication._id, 'approve')}
                    className="gold-button text-white px-6 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <FaCheck />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleKycAction(selectedApplication._id, 'reject')}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700"
                  >
                    <FaTimes />
                    <span>Reject</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminKYC 