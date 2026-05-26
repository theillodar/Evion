"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
};

/**
 * Animated container with fade-in and slide-up effect
 */
export function AnimatedContainer({ children, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered container for animating lists of items
 */
export function StaggerContainer({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Individual item for staggered animation
 */
export function StaggerItem({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.4,
            ease: "easeOut",
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Scale-in animation for cards and modals
 */
export function ScaleInContainer({ children, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
