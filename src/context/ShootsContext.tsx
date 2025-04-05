
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ShootData } from '@/types/shoots';
import { shootsData as initialShootsData } from '@/data/shootsData';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/components/auth/AuthProvider';

interface ShootsContextType {
  shoots: ShootData[];
  addShoot: (shoot: ShootData) => void;
  updateShoot: (id: string, updatedShoot: Partial<ShootData>) => void;
  deleteShoot: (id: string) => void;
  // Helper functions for accounts page
  getUniquePhotographers: () => { name: string; shootCount: number }[];
  getUniqueEditors: () => { name: string; shootCount: number }[];
  getUniqueClients: () => { name: string; shootCount: number; email?: string; company?: string; phone?: string }[];
  // New functions for client-specific data
  getCurrentClientShoots: () => ShootData[];
  getClientShootsByStatus: (status: ShootData['status']) => ShootData[];
}

const ShootsContext = createContext<ShootsContextType | undefined>(undefined);

export function ShootsProvider({ children }: { children: React.ReactNode }) {
  const [shoots, setShoots] = useState<ShootData[]>(initialShootsData);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load shoots from localStorage if available
  useEffect(() => {
    const storedShoots = localStorage.getItem('shoots');
    if (storedShoots) {
      try {
        setShoots(JSON.parse(storedShoots));
      } catch (error) {
        console.error('Failed to parse stored shoots:', error);
      }
    }
  }, []);

  // Save shoots to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('shoots', JSON.stringify(shoots));
  }, [shoots]);

  const addShoot = (shoot: ShootData) => {
    // Ensure new shoots are set to 'booked' status by default
    const shootWithDefaultStatus = {
      ...shoot,
      status: shoot.status || 'booked' as const
    };
    
    setShoots(prevShoots => [...prevShoots, shootWithDefaultStatus]);
    toast({
      title: "Shoot created",
      description: "New shoot has been successfully added.",
    });
  };

  const updateShoot = (id: string, updatedShoot: Partial<ShootData>) => {
    setShoots(prevShoots => 
      prevShoots.map(shoot => 
        shoot.id === id ? { ...shoot, ...updatedShoot } : shoot
      )
    );
    toast({
      title: "Shoot updated",
      description: "Shoot details have been updated.",
    });
  };

  const deleteShoot = (id: string) => {
    setShoots(prevShoots => prevShoots.filter(shoot => shoot.id !== id));
    toast({
      title: "Shoot deleted",
      description: "The shoot has been removed.",
      variant: "destructive",
    });
  };

  // New functions for client-specific data
  const getCurrentClientShoots = () => {
    if (user && user.role === 'client') {
      return shoots.filter(shoot => shoot.client.name === user.name);
    }
    return []; // Return empty array if not a client
  };

  const getClientShootsByStatus = (status: ShootData['status']) => {
    if (user && user.role === 'client') {
      return shoots.filter(shoot => 
        shoot.client.name === user.name && 
        shoot.status === status
      );
    }
    return []; // Return empty array if not a client
  };

  // Helper functions for Accounts page
  const getUniquePhotographers = () => {
    const photographerMap = new Map<string, number>();
    
    // For clients, only count photographers from their shoots
    const relevantShoots = user?.role === 'client' 
      ? shoots.filter(shoot => shoot.client.name === user.name)
      : shoots;
    
    relevantShoots.forEach(shoot => {
      if (shoot.photographer && shoot.photographer.name) {
        const name = shoot.photographer.name;
        photographerMap.set(name, (photographerMap.get(name) || 0) + 1);
      }
    });
    
    return Array.from(photographerMap.entries()).map(([name, shootCount]) => ({
      name, 
      shootCount
    }));
  };
  
  const getUniqueEditors = () => {
    // Since there's no editor field in ShootData, we'll return an empty array
    // In the future, if editor data is added to ShootData, this can be updated
    return [];
  };
  
  const getUniqueClients = () => {
    // For clients, only show their own data
    if (user?.role === 'client') {
      const clientData = {
        name: user.name,
        shootCount: shoots.filter(shoot => shoot.client.name === user.name).length,
        email: user.email,
        company: user.company,
        phone: user.phone
      };
      return [clientData];
    }
    
    // For admins, show all clients
    const clientMap = new Map<string, { 
      count: number, 
      email?: string,
      company?: string,
      phone?: string
    }>();
    
    shoots.forEach(shoot => {
      if (shoot.client && shoot.client.name) {
        const name = shoot.client.name;
        const existingClient = clientMap.get(name);
        
        if (existingClient) {
          clientMap.set(name, {
            ...existingClient,
            count: existingClient.count + 1
          });
        } else {
          clientMap.set(name, {
            count: 1,
            email: shoot.client.email,
            company: shoot.client.company,
            phone: shoot.client.phone
          });
        }
      }
    });
    
    return Array.from(clientMap.entries()).map(([name, data]) => ({
      name,
      shootCount: data.count,
      email: data.email,
      company: data.company,
      phone: data.phone
    }));
  };

  return (
    <ShootsContext.Provider value={{ 
      shoots, 
      addShoot, 
      updateShoot, 
      deleteShoot,
      getUniquePhotographers,
      getUniqueEditors,
      getUniqueClients,
      getCurrentClientShoots,
      getClientShootsByStatus
    }}>
      {children}
    </ShootsContext.Provider>
  );
}

export function useShoots() {
  const context = useContext(ShootsContext);
  if (context === undefined) {
    throw new Error('useShoots must be used within a ShootsProvider');
  }
  return context;
}
