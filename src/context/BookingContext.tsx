
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useShoots } from '@/context/ShootsContext';
import { Client } from '@/types/clients';
import { ShootData } from '@/types/shoots';
import { PackageType, ServiceType } from '@/types/services';
import { initialClientsData } from '@/data/clientsData';
import { loadPackages, loadServices } from '@/data/servicesData';

// Define the type for the photographer object used in BookShoot
export interface BookingPhotographer {
  id: string;
  name: string;
  avatar: string;
  rate: number;
  availability: boolean;
}

// Define the type for the context value
interface BookingContextType {
  // Client and property data
  client: string;
  setClient: (id: string) => void;
  address: string;
  setAddress: (address: string) => void;
  city: string;
  setCity: (city: string) => void;
  state: string;
  setState: (state: string) => void;
  zip: string;
  setZip: (zip: string) => void;
  
  // Scheduling data
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  time: string;
  setTime: (time: string) => void;
  
  // Photographer and package data
  photographer: string;
  setPhotographer: (id: string) => void;
  selectedPackage: string;
  setSelectedPackage: (id: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  
  // Payment and notification settings
  bypassPayment: boolean;
  setBypassPayment: (bypass: boolean) => void;
  sendNotification: boolean;
  setSendNotification: (send: boolean) => void;
  
  // Booking process
  step: number;
  setStep: (step: number) => void;
  isComplete: boolean;
  setIsComplete: (isComplete: boolean) => void;
  
  // Data collections
  clients: Client[];
  photographers: BookingPhotographer[];
  packages: PackageType[];
  services: ServiceType[];
  
  // Utility functions
  getPackagePrice: () => number;
  getPhotographerRate: () => number;
  getTax: () => number;
  getTotal: () => number;
  getAvailablePhotographers: () => BookingPhotographer[];
  getSelectedPackageServices: () => string[];
  handleSubmit: () => void;
  resetForm: () => void;
}

// Create the context with a default value
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// List of photographers
const photographers: BookingPhotographer[] = [
  { id: '1', name: 'John Doe', avatar: 'https://ui.shadcn.com/avatars/01.png', rate: 150, availability: true },
  { id: '2', name: 'Jane Smith', avatar: 'https://ui.shadcn.com/avatars/02.png', rate: 175, availability: true },
  { id: '3', name: 'Mike Brown', avatar: 'https://ui.shadcn.com/avatars/03.png', rate: 200, availability: false },
];

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clientIdFromUrl = queryParams.get('clientId');
  const clientNameFromUrl = queryParams.get('clientName');
  const clientCompanyFromUrl = queryParams.get('clientCompany');
  
  const [clients, setClients] = useState<Client[]>(() => {
    const storedClients = localStorage.getItem('clientsData');
    return storedClients ? JSON.parse(storedClients) : initialClientsData;
  });
  
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  
  const [client, setClient] = useState(clientIdFromUrl || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState('');
  const [photographer, setPhotographer] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [notes, setNotes] = useState('');
  const [bypassPayment, setBypassPayment] = useState(false);
  const [sendNotification, setSendNotification] = useState(true);
  const [step, setStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  const { addShoot } = useShoots();
  const navigate = useNavigate();

  useEffect(() => {
    const storedClients = localStorage.getItem('clientsData');
    if (storedClients) {
      setClients(JSON.parse(storedClients));
    }
    
    // Load services and packages
    setPackages(loadPackages());
    setServices(loadServices());
  }, []);

  useEffect(() => {
    if (clientIdFromUrl && clientNameFromUrl) {
      setClient(clientIdFromUrl);
      
      toast({
        title: "Client Selected",
        description: `${decodeURIComponent(clientNameFromUrl)}${clientCompanyFromUrl ? ` (${decodeURIComponent(clientCompanyFromUrl)})` : ''} has been selected for this shoot.`,
        variant: "default",
      });
    }
  }, [clientIdFromUrl, clientNameFromUrl, clientCompanyFromUrl, toast]);

  const getPackagePrice = () => {
    const pkg = packages.find(p => p.id === selectedPackage);
    return pkg ? pkg.price : 0;
  };

  const getPhotographerRate = () => {
    const photog = photographers.find(p => p.id === photographer);
    return photog ? photog.rate : 0;
  };

  const getTax = () => {
    const subtotal = getPackagePrice() + getPhotographerRate();
    return Math.round(subtotal * 0.06);
  };

  const getTotal = () => {
    return getPackagePrice() + getPhotographerRate() + getTax();
  };

  const getAvailablePhotographers = () => {
    if (!date || !time || !selectedPackage) return [];

    return photographers.filter(p => p.availability);
  };

  const getSelectedPackageServices = (): string[] => {
    const pkg = packages.find(p => p.id === selectedPackage);
    if (!pkg) return [];
    
    // Map service IDs to service names
    return pkg.services.map(serviceId => {
      const service = services.find(s => s.id === serviceId);
      return service ? service.name : '';
    }).filter(name => name !== '');
  };

  const handleSubmit = () => {
    if (step === 3) {
      if (!client || !address || !city || !state || !zip || !date || !time || !photographer || !selectedPackage) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields before confirming the booking.",
          variant: "destructive",
        });
        return;
      }

      const selectedClientData = clients.find(c => c.id === client);
      const selectedPhotographerData = photographers.find(p => p.id === photographer);
      const selectedPackageData = packages.find(p => p.id === selectedPackage);
      
      const newShoot: ShootData = {
        id: uuidv4(),
        scheduledDate: date.toISOString().split('T')[0],
        time: time,
        client: {
          name: selectedClientData?.name || 'Unknown Client',
          email: selectedClientData?.email || `client${client}@example.com`,
          company: selectedClientData?.company,
          totalShoots: 1
        },
        location: {
          address: address,
          city: city,
          state: state,
          zip: zip,
          fullAddress: `${address}, ${city}, ${state} ${zip}`
        },
        photographer: {
          name: selectedPhotographerData?.name || 'Unknown Photographer',
          avatar: selectedPhotographerData?.avatar
        },
        services: getSelectedPackageServices(),
        payment: {
          baseQuote: getPackagePrice(),
          taxRate: 6.00,
          taxAmount: getTax(),
          totalQuote: getTotal(),
          ...(bypassPayment ? {} : { totalPaid: getTotal(), lastPaymentDate: new Date().toISOString().split('T')[0], lastPaymentType: 'Credit Card' })
        },
        status: 'hold' as const,
        notes: notes ? { shootNotes: notes } : undefined,
        createdBy: "Current User"
      };

      addShoot(newShoot);
      setIsComplete(true);

      console.log("New shoot created:", newShoot);
    } else {
      if (step === 1 && (!client || !address || !city || !state || !zip || !selectedPackage)) {
        toast({
          title: "Missing information",
          description: "Please fill in all client, property details and select a package before proceeding.",
          variant: "destructive",
        });
        return;
      }

      if (step === 2 && (!date || !time)) {
        toast({
          title: "Missing information",
          description: "Please select a date and time before proceeding.",
          variant: "destructive",
        });
        return;
      }

      setStep(step + 1);
    }
  };

  const resetForm = () => {
    setClient('');
    setAddress('');
    setCity('');
    setState('');
    setZip('');
    setDate(undefined);
    setTime('');
    setPhotographer('');
    setSelectedPackage('');
    setNotes('');
    setBypassPayment(false);
    setSendNotification(true);
    setStep(1);
    setIsComplete(false);
    navigate('/shoots');
  };

  const contextValue: BookingContextType = {
    client,
    setClient,
    address,
    setAddress,
    city,
    setCity,
    state,
    setState,
    zip,
    setZip,
    date,
    setDate,
    time,
    setTime,
    photographer,
    setPhotographer,
    selectedPackage,
    setSelectedPackage,
    notes,
    setNotes,
    bypassPayment,
    setBypassPayment,
    sendNotification,
    setSendNotification,
    step,
    setStep,
    isComplete,
    setIsComplete,
    clients,
    photographers,
    packages,
    services,
    getPackagePrice,
    getPhotographerRate,
    getTax,
    getTotal,
    getAvailablePhotographers,
    getSelectedPackageServices,
    handleSubmit,
    resetForm
  };

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
