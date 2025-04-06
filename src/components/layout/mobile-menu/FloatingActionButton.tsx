
import React from 'react';
import { motion } from 'framer-motion';
import { XIcon, MenuIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export const FloatingActionButton = ({ isMenuOpen, toggleMenu }: FloatingActionButtonProps) => {
  return (
    <div className="fixed z-50 bottom-5 left-0 right-0 flex justify-center">
      <motion.button
        className={cn(
          "relative px-6 py-2.5 rounded-full",
          "flex items-center justify-center gap-2 min-w-[140px]",
          "backdrop-blur-lg bg-background/20 border border-white/20",
          "shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.25)]",
          "transition-all duration-300"
        )}
        onClick={toggleMenu}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          transition: { duration: 0.5 }
        }}
      >
        {/* Animated stroke effect */}
        <motion.span 
          className="absolute inset-0 rounded-full border-2 border-primary/50"
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [0.95, 1.02, 0.95],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {isMenuOpen ? (
          <>
            <XIcon className="text-primary h-5 w-5" />
            <span className="text-primary-foreground font-medium">Close</span>
          </>
        ) : (
          <>
            <MenuIcon className="text-primary h-5 w-5" />
            <span className="text-primary-foreground font-medium">Dashboard</span>
          </>
        )}
      </motion.button>
    </div>
  );
};
