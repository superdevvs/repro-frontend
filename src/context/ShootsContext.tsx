import React, { createContext, useContext, useState, useEffect } from 'react';
import { ShootData } from '@/types/shoots';
import { v4 as uuidv4 } from 'uuid';
import { format, addDays } from 'date-fns';
import { useAuth } from '@/components/auth/AuthProvider';
import { UserMetadata } from '@/types/auth';

interface ShootsContextType {
  shoots: ShootData[];
  addShoot: (shoot: ShootData) => void;
  updateShoot: (shootId: string, updates: Partial<ShootData>) => void;
  deleteShoot: (shootId: string) => void;
}

const ShootsContext = createContext<ShootsContextType | undefined>(undefined);

export const useShoots = () => {
  const context = useContext(ShootsContext);
  if (!context) {
    throw new Error('useShoots must be used within a ShootsProvider');
  }
  return context;
};

export const ShootsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shoots, setShoots] = useState<ShootData[]>(() => {
    const storedShoots = localStorage.getItem('shoots');
    return storedShoots ? JSON.parse(storedShoots) : [];
  });
  const { user } = useAuth();

  useEffect(() => {
    localStorage.setItem('shoots', JSON.stringify(shoots));
  }, [shoots]);

  const addShoot = (shoot: ShootData) => {
    setShoots(prevShoots => [...prevShoots, shoot]);
  };

  const updateShoot = (shootId: string, updates: Partial<ShootData>) => {
    setShoots(prevShoots =>
      prevShoots.map(shoot =>
        shoot.id === shootId ? { ...shoot, ...updates } : shoot
      )
    );
  };

  const deleteShoot = (shootId: string) => {
    setShoots(prevShoots => prevShoots.filter(shoot => shoot.id !== shootId));
  };

  const createNewShoot = (shootData: Partial<ShootData>) => {
    const newShoot: ShootData = {
      id: uuidv4(),
      scheduledDate: shootData.scheduledDate || format(new Date(), 'yyyy-MM-dd'),
      time: shootData.time || '10:00',
      client: {
        name: shootData.client?.name || 'New Client',
        email: shootData.client?.email || 'client@example.com',
        company: shootData.client?.company || '',
        totalShoots: 0
      },
      location: {
        address: shootData.location?.address || '123 Main St',
        address2: shootData.location?.address2 || '',
        city: shootData.location?.city || 'Anytown',
        state: shootData.location?.state || 'CA',
        zip: shootData.location?.zip || '12345',
        fullAddress: shootData.location?.fullAddress || '123 Main St, Anytown, CA 12345'
      },
      photographer: {
        name: shootData.photographer?.name || 'John Doe',
        avatar: shootData.photographer?.avatar || '/avatars/avatar-john.png'
      },
      services: shootData.services || ['Photography'],
      payment: {
        baseQuote: shootData.payment?.baseQuote || 500,
        taxRate: shootData.payment?.taxRate || 7.25,
        taxAmount: shootData.payment?.taxAmount || 36.25,
        totalQuote: shootData.payment?.totalQuote || 536.25,
        totalPaid: shootData.payment?.totalPaid || 0,
      },
      status: shootData.status || 'scheduled',
      notes: shootData.notes,
      createdBy: user?.name || "System"
    };
    
    if (user && user.metadata) {
      newShoot.client.company = user.metadata.company || user.company || '';
      newShoot.client.phone = user.metadata.phone || user.phone || '';
    }

    addShoot(newShoot);
  };

  const value: ShootsContextType = {
    shoots,
    addShoot,
    updateShoot,
    deleteShoot,
  };

  return (
    <ShootsContext.Provider value={value}>
      {children}
    </ShootsContext.Provider>
  );
};
