import React from 'react';
import { motion } from 'framer-motion';

const AnimatedSection = ({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  initialY = 20,
  initialOpacity = 0,
  animateY = 0,
  animateOpacity = 1,
  ...props
}) => {
  const containerVariants = {
    hidden: {
      y: initialY,
      opacity: initialOpacity
    },
    visible: {
      y: animateY,
      opacity: animateOpacity,
      transition: {
        duration: duration,
        delay: delay,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;