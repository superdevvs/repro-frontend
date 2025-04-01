
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ShootData } from '@/types/shoots';
import { shootsData as initialShootsData } from '@/data/shootsData';
import { useToast } from "@/hooks/use-toast";

interface ShootsContextType {
  shoots: ShootData[];
  addShoot: (shoot: ShootData) => void;
  updateShoot: (id: string, updatedShoot: Partial<ShootData>) => void;
  deleteShoot: (id: string) => void;
  // Helper functions for accounts page
  getUniquePhotographers: () => { name: string; shootCount: number }[];
  getUniqueEditors: () => { name: string; shootCount: number }[];
  getUniqueClients: () => { name: string; shootCount: number; email?: string; company?: string; phone?: string }[];
}

const ShootsContext = createContext<ShootsContextType | undefined>(undefined);

export function ShootsProvider({ children }: { children: React.ReactNode }) {
  const [shoots, setShoots] = useState<ShootData[]>(initialShootsData);
  const { toast } = useToast();

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
    // Ensure new shoots are set to 'hold' status by default
    const shootWithDefaultStatus = {
      ...shoot,
      status: shoot.status || 'hold' as const
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

  // New helper functions for Accounts page
  const getUniquePhotographers = () => {
    const photographerMap = new Map<string, number>();
    
    shoots.forEach(shoot => {
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
    // Assuming editors are stored in shoot.editor field
    // If not, this will need to be adapted based on your data structure
    const editorMap = new Map<string, number>();
    
    shoots.forEach(shoot => {
      if (shoot.editor && shoot.editor.name) {
        const name = shoot.editor.name;
        editorMap.set(name, (editorMap.get(name) || 0) + 1);
      }
    });
    
    return Array.from(editorMap.entries()).map(([name, shootCount]) => ({
      name, 
      shootCount
    }));
  };
  
  const getUniqueClients = () => {
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
      getUniqueClients
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
