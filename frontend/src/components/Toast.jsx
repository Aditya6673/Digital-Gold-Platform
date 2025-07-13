import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa'

const Toast = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for animation to complete
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />
      case 'error':
        return <FaExclamationTriangle className="text-red-500" />
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" />
      default:
        return <FaInfoCircle className="text-blue-500" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-4 right-4 z-50 max-w-sm w-full ${getBgColor()} border rounded-lg shadow-lg p-4`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{message}</p>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={() => {
                  setIsVisible(false)
                  setTimeout(onClose, 300)
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast 