
import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row overflow-auto bg-gradient-to-br from-background to-secondary">
      {/* Left side with branding - hidden on mobile */}
      {!isMobile && (
        <motion.div 
          className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-md w-full">
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 22V12h6v10" />
                </svg>
              </div>
              <img 
                src="/lovable-uploads/b2e1d77f-fa76-4e07-87f5-a4820c7a1396.png" 
                alt="RePro Photos Logo" 
                className="h-28 w-auto mb-2"
              />
              <p className="text-muted-foreground">Streamline your real estate media workflow with our comprehensive management dashboard.</p>
            </motion.div>
            
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Streamlined Booking</h3>
                  <p className="text-sm text-muted-foreground">Schedule shoots with ease</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Efficient Media Management</h3>
                  <p className="text-sm text-muted-foreground">Upload, organize, and share with clients</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Seamless Invoicing</h3>
                  <p className="text-sm text-muted-foreground">Track payments and manage finances</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
      
      {/* Mobile-only compact header */}
      {isMobile && (
        <motion.div 
          className="pt-8 pb-6 px-6 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-primary/10 rounded-xl flex items-center justify-center">
              <svg className="h-9 w-9 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 22V12h6v10" />
              </svg>
            </div>
          </div>
          <img 
            src="/lovable-uploads/b2e1d77f-fa76-4e07-87f5-a4820c7a1396.png" 
            alt="RePro Photos Logo" 
            className="h-20 w-auto mx-auto mb-2"
          />
          <p className="text-sm text-muted-foreground mb-0">Your complete real estate photography platform</p>
        </motion.div>
      )}
      
      {/* Right side with login form - make scrollable */}
      <motion.div 
        className={`w-full ${!isMobile ? 'md:w-1/2' : ''} flex items-center justify-center ${isMobile ? 'py-2 pb-8' : 'p-8'} bg-background/50 backdrop-blur-sm ${!isMobile ? 'border-l border-border' : ''} overflow-y-auto mobile-scrollable`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LoginForm />
      </motion.div>
    </div>
  );
};

export default Index;
