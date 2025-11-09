import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-dvh w-full flex flex-col md:flex-row overflow-hidden relative pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Left Side - Image Section */}
      <div
        className={`
          w-full md:w-1/2 relative
          ${isMobile ? 'p-0' : 'p-4'}
          flex items-center justify-center
        `}
      >
        {/* Mobile: shorter banner; Desktop: full fill */}
        <div className="relative w-full h-48 sm:h-64 md:h-full">
          <img
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1600&auto=format&fit=crop"
            alt="Dashboard visual"
            className="w-full h-full object-cover md:rounded-3xl"
          />
          {/* Subtle gradient overlay for text legibility */}
          <div className="absolute inset-0 md:rounded-3xl bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-4 right-4 md:bottom-10 md:left-10 text-white drop-shadow">
            <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight">
              Capture.<br />Manage.<br />Deliver.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Section */}
      <motion.div
        className={`
          w-full md:w-1/2 flex items-center justify-center
          px-4 sm:px-6 md:p-8
          py-6 sm:py-8
          overflow-y-auto overscroll-contain
        `}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        {/* Keep form comfortably narrow on mobile */}
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
