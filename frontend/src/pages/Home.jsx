import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaCoins, FaShieldAlt, FaChartLine, FaGlobe } from 'react-icons/fa'

const Home = () => {
  const features = [
    {
      icon: <FaCoins className="text-3xl text-gold-primary" />,
      title: 'Digital Gold Investment',
      description: 'Invest in physical gold digitally with secure blockchain technology'
    },
    {
      icon: <FaShieldAlt className="text-3xl text-gold-primary" />,
      title: 'Secure & Regulated',
      description: 'Your investments are backed by physical gold and regulated by authorities'
    },
    {
      icon: <FaChartLine className="text-3xl text-gold-primary" />,
      title: 'Real-time Pricing',
      description: 'Track gold prices in real-time with live market data'
    },
    {
      icon: <FaGlobe className="text-3xl text-gold-primary" />,
      title: 'Global Access',
      description: 'Access your gold investments from anywhere in the world'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gold-gradient opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="font-playfair text-5xl md:text-7xl font-bold text-bronze-primary mb-6">
              Digital Gold Platform
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Invest in physical gold digitally with the most secure and transparent platform. 
              Your wealth, backed by real gold, accessible anywhere.
            </p>
            <div className="flex justify-center">
              <Link
                to="/register"
                className="gold-button text-white px-8 py-4 rounded-lg text-lg font-semibold inline-block"
              >
                Start Investing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-playfair text-4xl font-bold text-bronze-primary mb-4">
              Why Choose Digital Gold?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of gold investment with our cutting-edge platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="gold-card p-6 rounded-xl text-center hover:transform hover:scale-105 transition-transform"
              >
                <div className="mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-playfair text-xl font-semibold text-bronze-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-beige-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-playfair text-4xl font-bold text-bronze-primary mb-6">
              Ready to Start Your Gold Investment Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of investors who trust our platform for their gold investments
            </p>
            <Link
              to="/register"
              className="gold-button text-white px-8 py-4 rounded-lg text-lg font-semibold inline-block"
            >
              Get Started Today
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home 