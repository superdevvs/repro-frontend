import React, { useRef, useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();
  
  // 🎬 Background video playlist
  const videos = [
    "/bg-video.mp4",
    "/bg-video-2.mp4",
    "/bg-video-3.mp4",
    "/bg-video-4.mp4",
  ];

  const videoRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleEnded = () => {
    const nextIndex = (currentIndex + 1) % videos.length; // loop back to first
    setCurrentIndex(nextIndex);
    if (videoRef.current) {
      videoRef.current.src = videos[nextIndex];
      videoRef.current.play();
    }
  };
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden relative">
      {/* Full page background cover image */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          src={videos[currentIndex]}
          autoPlay
          muted
          playsInline
          onEnded={handleEnded}
          className="object-cover w-full h-full"
        />
        {/* <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/70"></div> */}
      </div>
      
      <div className="flex flex-col md:flex-row w-full z-10">
        {/* Left side with just the logo - hidden on mobile */}
        {!isMobile && (
          <motion.div 
            className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-md w-full flex flex-col items-center">
              <motion.div 
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <img 
                  src="/REPRO-HQ.png" 
                  alt="RePro Photos Logo" 
                  className="w-auto h-auto max-h-72 max-w-full object-contain"
                />
                <p className="text-center text-lg md:text-xl mt-4 text-white font-medium italic drop-shadow-md">
                  Elevating your Status Quo!
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
        
        {/* Mobile-only logo */}
        {isMobile && (
          <motion.div 
            className="pt-8 pb-6 px-6 flex flex-col items-center relative"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <img 
              src="/REPRO-HQ.png" 
              alt="RePro Photos Logo" 
              className="w-auto h-auto max-h-48 max-w-full object-contain relative z-10"
            />
            <p className="text-center text-base mt-3 text-white font-medium italic drop-shadow-md relative z-10">
              Elevating your Status Quo!
            </p>
          </motion.div>
        )}
        
        {/* Right side with login form - make scrollable */}
        <motion.div 
          className={`w-full ${!isMobile ? 'md:w-1/2' : ''} flex items-center justify-center ${isMobile ? 'py-2 pb-8' : 'p-8'}  overflow-y-auto mobile-scrollable`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <LoginForm />
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
