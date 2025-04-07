
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

interface FloatingMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function FloatingMenu({ isOpen, onClose, children }: FloatingMenuProps) {
  const { theme } = useTheme();
  const isLightMode = theme === 'light';

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const menuVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 30
      } 
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={onClose}
        >
          <motion.div 
            className={cn(
              "absolute bottom-16 right-4 rounded-lg overflow-hidden min-w-[180px] max-w-[250px]",
              isLightMode 
                ? "bg-white border border-gray-200 shadow-lg" 
                : "bg-background border border-border shadow-xl"
            )}
            variants={menuVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
