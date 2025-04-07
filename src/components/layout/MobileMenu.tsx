
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useMobileMenu } from './mobile-menu/useMobileMenu';
import { MobileBottomNav } from './mobile-menu/MobileBottomNav';
import { MenuContent } from './mobile-menu/MenuContent';

const MobileMenu = () => {
  const { isMenuOpen, toggleMenu, closeMenu, handleLogout, filteredItems } = useMobileMenu();
  const location = useLocation();
  const isMessagesPage = location.pathname === '/messages';

  return (
    <>
      <MobileBottomNav toggleMenu={toggleMenu} />

      <AnimatePresence>
        {isMenuOpen && !isMessagesPage && (
          <MenuContent 
            isMenuOpen={isMenuOpen}
            filteredItems={filteredItems}
            closeMenu={closeMenu}
            handleLogout={handleLogout}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileMenu;
