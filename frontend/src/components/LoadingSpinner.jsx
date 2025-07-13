import { motion } from 'framer-motion'

const LoadingSpinner = ({ size = 'md', color = 'gold-primary' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const colorClasses = {
    'gold-primary': 'text-gold-primary',
    'bronze-primary': 'text-bronze-primary',
    'white': 'text-white',
    'gray': 'text-gray-500'
  }

  return (
    <div className="flex justify-center items-center">
      <motion.div
        className={`${sizeClasses[size]} ${colorClasses[color]} border-2 border-current border-t-transparent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  )
}

export default LoadingSpinner 