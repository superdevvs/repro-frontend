
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ShootData } from '@/types/shoots';
import { shootsData as initialShootsData } from '@/data/shootsData';
import { useToast } from "@/hooks/use-toast";

interface ShootsContextType {
  shoots: ShootData[];
  addShoot: (shoot: ShootData) => void;
  updateShoot: (id: string, updatedShoot: Partial<ShootData>) => void;
  deleteShoot: (id: string) => void;
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

  return (
    <ShootsContext.Provider value={{ shoots, addShoot, updateShoot, deleteShoot }}>
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
