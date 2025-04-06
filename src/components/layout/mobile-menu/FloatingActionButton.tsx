
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
    <motion.button
      className={cn(
        "fixed z-50 bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2",
        "px-4 py-2 rounded-full",
        "bg-primary/40 backdrop-blur-md shadow-lg border border-primary/20",
        "hover:bg-primary/50 transition-all duration-300"
      )}
      onClick={toggleMenu}
      whileTap={{ scale: 0.95 }}
      animate={{ 
        y: [0, -5, 0],
        transition: { 
          repeat: isMenuOpen ? 0 : Infinity, 
          repeatType: "reverse", 
          duration: 1.5 
        }
      }}
    >
      {isMenuOpen ? (
        <>
          <XIcon className="text-primary-foreground h-5 w-5" />
          <span className="text-primary-foreground font-medium">Close</span>
        </>
      ) : (
        <>
          <MenuIcon className="text-primary-foreground h-5 w-5" />
          <span className="text-primary-foreground font-medium">Dashboard</span>
        </>
      )}
    </motion.button>
  );
};
