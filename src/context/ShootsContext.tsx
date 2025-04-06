import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ShootData, ShootsContextType } from '@/types/shoots';
import { toStringId } from '@/utils/formatters';

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
      company: 'Company Name',
      totalShoots: 5,
    },
    photographer: {
      id: '201',
      name: 'Jane Photographer',
      email: 'jane@example.com',
      avatar: '/assets/avatars/photographer1.jpg',
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
      floorplans: [],
      slideshows: [],
    },
    tourLinks: {
      branded: '',
      mls: '',
      genericMls: '',
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
      company: 'Johnson Properties',
      totalShoots: 3,
    },
    photographer: {
      id: '202',
      name: 'Bob Photographer',
      email: 'bob@example.com',
      avatar: '/assets/avatars/photographer2.jpg',
    },
    payment: {
      totalPaid: 0,
      baseQuote: 200,
      totalQuote: 225,
    },
    services: ['Photography'],
    media: {
      photos: [],
      videos: [],
      floorplans: [],
      slideshows: [],
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
  
  const getUniquePhotographers = useCallback(() => {
    const photographersMap = new Map();
    shoots.forEach(shoot => {
      if (shoot.photographer && shoot.photographer.id && shoot.photographer.name) {
        const id = toStringId(shoot.photographer.id);
        const photographerShoots = shoots.filter(s => 
          s.photographer && toStringId(s.photographer.id) === id
        );
        
        photographersMap.set(id, {
          id: id,
          name: shoot.photographer.name,
          avatar: shoot.photographer.avatar,
          email: 'photographer@example.com',  // Added for AccountsLayout
          shootCount: photographerShoots.length
        });
      }
    });
    return Array.from(photographersMap.values());
  }, [shoots]);
  
  const getUniqueEditors = useCallback(() => {
    // Mock function - in a real app, you'd extract actual editor data
    return [
      { id: 'ed1', name: 'Editor One', email: 'editor1@example.com', company: 'Editing Co', phone: '555-1111', shootCount: 12 },
      { id: 'ed2', name: 'Editor Two', email: 'editor2@example.com', company: 'Post Production', phone: '555-2222', shootCount: 8 },
    ];
  }, []);
  
  const getUniqueClients = useCallback(() => {
    const clientsMap = new Map();
    shoots.forEach(shoot => {
      if (shoot.client && shoot.client.id && shoot.client.name) {
        const id = toStringId(shoot.client.id);
        const clientShoots = shoots.filter(s => 
          s.client && toStringId(s.client.id) === id
        );
        
        clientsMap.set(id, {
          id: id,
          name: shoot.client.name,
          email: shoot.client.email,
          company: shoot.client.company,
          phone: shoot.client.phone,
          shootCount: clientShoots.length
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
