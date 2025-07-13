import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaCoins, FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false)
  }

  return (
    <nav className="bg-white shadow-lg border-b-2 border-gold-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FaCoins className="text-2xl text-gold-primary" />
              <span className="font-playfair text-xl font-bold text-bronze-primary">
                Digital Gold
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gold-primary transition-colors">
              Home
            </Link>
            {user ? (
              <>
                {user.role === 'admin' ? (
                  // Admin Navigation
                  <>
                    <Link to="/admin" className="text-gray-700 hover:text-gold-primary transition-colors">
                      Admin Dashboard
                    </Link>
                    <Link to="/admin/users" className="text-gray-700 hover:text-gold-primary transition-colors">
                      Manage Users
                    </Link>
                    <Link to="/admin/kyc" className="text-gray-700 hover:text-gold-primary transition-colors">
                      KYC Approvals
                    </Link>
                    <Link to="/admin/price" className="text-gray-700 hover:text-gold-primary transition-colors">
                      Price Manager
                    </Link>
                    <Link to="/admin/inventory" className="text-gray-700 hover:text-gold-primary transition-colors">
                      Inventory Manager
                    </Link>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-700">Admin: {user.name}</span>
                      <button
                        onClick={handleLogout}
                        className="gold-button text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                      >
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                ) : (
                  // Regular User Navigation
                  <>
                    <Link to="/dashboard" className="text-gray-700 hover:text-gold-primary transition-colors">
                      Dashboard
                    </Link>
                    <Link to="/transactions" className="text-gray-700 hover:text-gold-primary transition-colors">
                      Transactions
                    </Link>
                    <Link to="/profile" className="text-gray-700 hover:text-gold-primary transition-colors">
                      Profile
                    </Link>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-700">Welcome, {user.name}</span>
                      <button
                        onClick={handleLogout}
                        className="gold-button text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                      >
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-gold-primary transition-colors">
                  Login
                </Link>
                <Link to="/register" className="gold-button text-white px-4 py-2 rounded-lg">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-gold-primary"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t border-gray-200"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-700 hover:text-gold-primary"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            {user ? (
              <>
                {user.role === 'admin' ? (
                  // Admin Mobile Navigation
                  <>
                    <Link
                      to="/admin"
                      className="block px-3 py-2 text-gray-700 hover:text-gold-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/admin/users"
                      className="block px-3 py-2 text-gray-700 hover:text-gold-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      Manage Users
                    </Link>
                    <Link
                      to="/admin/kyc"
                      className="block px-3 py-2 text-gray-700 hover:text-gold-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      KYC Approvals
                    </Link>
                    <Link
                      to="/admin/price"
                      className="block px-3 py-2 text-gray-700 hover:text-gold-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      Price Manager
                    </Link>
                    <Link
                      to="/admin/inventory"
                      className="block px-3 py-2 text-gray-700 hover:text-gold-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      Inventory Manager
                    </Link>
                    <div className="px-3 py-2 border-t border-gray-200 mt-2">
                      <span className="text-gray-700">Admin: {user.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 gold-button text-white rounded-lg flex items-center space-x-2"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  // Regular User Mobile Navigation
                  <>
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 text-gray-700 hover:text-gold-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/transactions"
                      className="block px-3 py-2 text-gray-700 hover:text-gold-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      Transactions
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-3 py-2 text-gray-700 hover:text-gold-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                    <div className="px-3 py-2">
                      <span className="text-gray-700">Welcome, {user.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 gold-button text-white rounded-lg flex items-center space-x-2"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-700 hover:text-gold-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 gold-button text-white rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  )
}

export default Navbar 