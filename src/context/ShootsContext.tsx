
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ShootData, ShootsContextType } from '@/types/shoots';

// Create context
const ShootsContext = createContext<ShootsContextType | undefined>(undefined);

// Sample data for development
const sampleShoots: ShootData[] = [
  {
    id: '1',
    scheduledDate: new Date().toISOString(),
    time: '10:00 AM',
    status: 'scheduled',
    location: {
      fullAddress: '123 Main St, City, State 12345',
    },
    client: {
      id: '101',
      name: 'John Smith',
    },
    photographer: {
      id: '201',
      name: 'Jane Photographer',
    },
    notes: {
      shootNotes: 'Sample shoot notes',
    },
  },
  {
    id: '2',
    scheduledDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    time: '2:00 PM',
    status: 'pending',
    location: {
      fullAddress: '456 Oak Ave, Town, State 54321',
    },
    client: {
      id: '102',
      name: 'Alice Johnson',
    },
    photographer: {
      id: '202',
      name: 'Bob Photographer',
    },
  },
];

interface ShootsProviderProps {
  children: ReactNode;
}

// Provider component
export const ShootsProvider = ({ children }: ShootsProviderProps) => {
  const [shoots, setShoots] = useState<ShootData[]>(sampleShoots);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addShoot = useCallback((shoot: ShootData) => {
    setShoots(prevShoots => [...prevShoots, shoot]);
  }, []);

  const updateShoot = useCallback((id: string | number, updates: Partial<ShootData>) => {
    setShoots(prevShoots => 
      prevShoots.map(shoot => 
        shoot.id === id ? { ...shoot, ...updates } : shoot
      )
    );
  }, []);

  const deleteShoot = useCallback((id: string | number) => {
    setShoots(prevShoots => prevShoots.filter(shoot => shoot.id !== id));
  }, []);

  return (
    <ShootsContext.Provider value={{
      shoots,
      loading,
      error,
      addShoot,
      updateShoot,
      deleteShoot
    }}>
      {children}
    </ShootsContext.Provider>
  );
};

// Custom hook to use the context
export const useShoots = () => {
  const context = useContext(ShootsContext);
  if (context === undefined) {
    throw new Error('useShoots must be used within a ShootsProvider');
  }
  return context;
};
