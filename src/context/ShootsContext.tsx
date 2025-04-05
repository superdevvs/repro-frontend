
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
      address: '123 Main St',
      city: 'City',
      state: 'State',
      zipCode: '12345',
      fullAddress: '123 Main St, City, State 12345',
    },
    client: {
      id: '101',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '555-1234',
    },
    photographer: {
      id: '201',
      name: 'Jane Photographer',
    },
    notes: {
      shootNotes: 'Sample shoot notes',
    },
    payment: {
      totalPaid: 0,
      baseQuote: 150,
      taxRate: 8,
      taxAmount: 12,
      totalQuote: 162,
    },
    services: ['Photography', 'Video Tour'],
    media: {
      photos: [],
      videos: [],
    },
  },
  {
    id: '2',
    scheduledDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    time: '2:00 PM',
    status: 'pending',
    location: {
      address: '456 Oak Ave',
      city: 'Town',
      state: 'State',
      zipCode: '54321',
      fullAddress: '456 Oak Ave, Town, State 54321',
    },
    client: {
      id: '102',
      name: 'Alice Johnson',
      email: 'alice@example.com',
    },
    photographer: {
      id: '202',
      name: 'Bob Photographer',
    },
    payment: {
      totalPaid: 0,
      baseQuote: 200,
      totalQuote: 225,
    },
    services: ['Photography'],
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
  
  const getUniquePhotographers = useCallback(() => {
    const photographersMap = new Map();
    shoots.forEach(shoot => {
      if (shoot.photographer && shoot.photographer.id && shoot.photographer.name) {
        photographersMap.set(shoot.photographer.id, {
          id: String(shoot.photographer.id),
          name: shoot.photographer.name,
        });
      }
    });
    return Array.from(photographersMap.values());
  }, [shoots]);
  
  const getUniqueEditors = useCallback(() => {
    // Mock function - in a real app, you'd extract actual editor data
    return [
      { id: 'ed1', name: 'Editor One' },
      { id: 'ed2', name: 'Editor Two' },
    ];
  }, []);
  
  const getUniqueClients = useCallback(() => {
    const clientsMap = new Map();
    shoots.forEach(shoot => {
      if (shoot.client && shoot.client.id && shoot.client.name) {
        clientsMap.set(shoot.client.id, {
          id: String(shoot.client.id),
          name: shoot.client.name,
        });
      }
    });
    return Array.from(clientsMap.values());
  }, [shoots]);
  
  const getClientShootsByStatus = useCallback((status: string) => {
    return shoots.filter(shoot => shoot.status === status);
  }, [shoots]);

  return (
    <ShootsContext.Provider value={{
      shoots,
      loading,
      error,
      addShoot,
      updateShoot,
      deleteShoot,
      getUniquePhotographers,
      getUniqueEditors,
      getUniqueClients,
      getClientShootsByStatus
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
