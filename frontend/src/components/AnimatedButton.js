import React from 'react';
import { motion } from 'framer-motion';

const AnimatedButton = ({
  children,
  className = '',
  variant = 'primary', // 'primary', 'secondary', 'outline'
  size = 'md', // 'sm', 'md', 'lg'
  disabled = false,
  ...props
}) => {
  const getButtonClasses = () => {
    let baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    // Size classes
    let sizeClasses;
    switch(size) {
      case 'sm':
        sizeClasses = 'px-3 py-2 text-sm';
        break;
      case 'lg':
        sizeClasses = 'px-6 py-3 text-lg';
        break;
      default: // md
        sizeClasses = 'px-4 py-2 text-base';
    }

    // Variant classes
    let variantClasses;
    switch(variant) {
      case 'secondary':
        variantClasses = 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500 border border-gray-200';
        break;
      case 'outline':
        variantClasses = 'bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50 focus:ring-blue-500';
        break;
      default: // primary
        variantClasses = 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';
    }

    return `${baseClasses} ${sizeClasses} ${variantClasses} ${className}`;
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={getButtonClasses()}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;