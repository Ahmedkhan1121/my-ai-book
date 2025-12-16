import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  hover = true,
  ...props
}) => {
  const cardVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: duration,
        delay: delay,
        ease: "easeOut"
      }
    }
  };

  const hoverVariants = hover ? {
    hover: {
      y: -5,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  } : {};

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      whileHover={hover ? "hover" : undefined}
      variants={{ ...cardVariants, ...hoverVariants }}
      className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;