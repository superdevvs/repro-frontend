
import { useState, useEffect } from 'react';
import { Client } from '@/types/clients';
import { initialClientsData } from '@/data/clientsData';
import { useShoots } from '@/context/ShootsContext';
import API_ROUTES from '@/lib/api';

export const useClientsData = () => {
  const { shoots } = useShoots();
  
  const [clientsData, setClientsData] = useState<Client[]>(() => {
    const storedClients = localStorage.getItem('clientsData');
    return storedClients ? JSON.parse(storedClients) : initialClientsData;
  });

  // Load clients from backend (admin list) on mount
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        if (!token) return;
        const res = await fetch(API_ROUTES.clients.adminList, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) return;
        const json = await res.json();
        const list = Array.isArray(json.data) ? json.data : (json.users || []);
        const mapped: Client[] = list.map((u: any) => ({
          id: String(u.id),
          name: u.name,
          company: u.company_name || '',
          email: u.email,
          phone: u.phonenumber || u.phone || '',
          address: '',
          status: 'active',
          shootsCount: 0,
          lastActivity: new Date().toISOString().split('T')[0],
          avatar: u.avatar || undefined,
        }));
        setClientsData(mapped);
      } catch (_) {}
    };
    load();
  }, []);
  
  const totalClients = clientsData.length;
  const activeClients = clientsData.filter(client => client.status === 'active').length;
  const totalShoots = shoots.length;
  const averageShootsPerClient = totalClients > 0 
    ? Math.round((totalShoots / totalClients) * 10) / 10 
    : 0;
  
  // Update shoots count for each client
  useEffect(() => {
    if (shoots.length > 0) {
      const clientShootCounts = new Map<string, { count: number, lastDate: string }>();
      
      shoots.forEach(shoot => {
        const clientName = shoot.client.name;
        if (!clientShootCounts.has(clientName)) {
          clientShootCounts.set(clientName, { count: 1, lastDate: shoot.scheduledDate });
        } else {
          const current = clientShootCounts.get(clientName)!;
          current.count++;
          const currentDate = new Date(current.lastDate);
          const shootDate = new Date(shoot.scheduledDate);
          if (shootDate > currentDate) {
            current.lastDate = shoot.scheduledDate;
          }
          clientShootCounts.set(clientName, current);
        }
      });
      
      const updatedClients = clientsData.map(client => {
        const shootData = clientShootCounts.get(client.name);
        if (shootData) {
          return {
            ...client,
            shootsCount: shootData.count,
            lastActivity: shootData.lastDate
          };
        }
        return client;
      });
      
      const existingClientNames = new Set(clientsData.map(c => c.name));
      clientShootCounts.forEach((data, clientName) => {
        if (!existingClientNames.has(clientName)) {
          const clientShoot = shoots.find(s => s.client.name === clientName);
          if (clientShoot) {
            const newClient: Client = {
              id: `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: clientName,
              company: clientShoot.client.company || '',
              email: clientShoot.client.email || '',
              phone: clientShoot.client.phone || '',
              address: '',
              status: 'active',
              shootsCount: data.count,
              lastActivity: data.lastDate
            };
            updatedClients.push(newClient);
          }
        }
      });
      
      setClientsData(updatedClients);
    }
  }, [shoots]);
  
  // Persist clients data to localStorage
  useEffect(() => {
    localStorage.setItem('clientsData', JSON.stringify(clientsData));
  }, [clientsData]);

  return {
    clientsData,
    setClientsData,
    totalClients,
    activeClients,
    totalShoots,
    averageShootsPerClient
  };
};
