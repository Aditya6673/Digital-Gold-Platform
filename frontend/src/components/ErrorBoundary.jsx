import React from 'react'
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa'
import { Link } from 'react-router-dom'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-beige-light flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="gold-card rounded-lg p-8">
              <div className="mb-6">
                <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-playfair font-bold text-bronze-primary mb-2">
                  Oops! Something went wrong
                </h1>
                <p className="text-gray-600 mb-6">
                  We encountered an unexpected error. Please try refreshing the page or return to the home page.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full gold-button text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2"
                >
                  <FaRedo />
                  <span>Refresh Page</span>
                </button>
                
                <Link
                  to="/"
                  className="block w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-400 transition-colors flex items-center justify-center space-x-2"
                >
                  <FaHome />
                  <span>Go to Home</span>
                </Link>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 text-xs text-red-600 bg-red-50 p-3 rounded overflow-auto">
                    {this.state.error && this.state.error.toString()}
                    <br />
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary 