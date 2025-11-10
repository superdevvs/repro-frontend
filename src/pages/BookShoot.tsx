import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { BookingStepIndicator } from '@/components/booking/BookingStepIndicator';
import { BookingComplete } from '@/components/booking/BookingComplete';
import { useShoots } from '@/context/ShootsContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Client } from '@/types/clients';
import { initialClientsData } from '@/data/clientsData';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { format } from 'date-fns';
import { BookingSummary } from '@/components/booking/BookingSummary';
import { BookingContentArea } from '@/components/booking/BookingContentArea';
import { ShootData } from '@/types/shoots';
import { useIsMobile } from '@/hooks/use-mobile';
import { BookingHeader } from '@/components/booking/BookingHeader';
import axios from 'axios';
import API_ROUTES from '@/lib/api';


const BookShoot = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clientIdFromUrl = queryParams.get('clientId');
  const clientNameFromUrl = queryParams.get('clientName');
  const clientCompanyFromUrl = queryParams.get('clientCompany');
  const { user } = useAuth();
  const [packages, setPackages] = useState<{ id: string, name: string, price: number, description: string }[]>([]);

  const [clients, setClients] = useState<Client[]>([]);

  
  const [client, setClient] = useState(() => {
    if (user && user.role === 'client' && user.metadata) {
      return user.metadata.clientId ?? '';
    }
    return clientIdFromUrl || '';
  });

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState('');
  const [photographer, setPhotographer] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [notes, setNotes] = useState('');
  const [companyNotes, setCompanyNotes] = useState('');
  const [photographerNotes, setPhotographerNotes] = useState('');
  const [editorNotes, setEditorNotes] = useState('');
  const [bypassPayment, setBypassPayment] = useState(false);
  const [sendNotification, setSendNotification] = useState(true);
  const [step, setStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { addShoot } = useShoots();
  const navigate = useNavigate();
  const [photographers, setPhotographersList] = useState<Array<{ id: string; name: string; avatar?: string }>>([]);
  const [availablePhotographerIds, setAvailablePhotographerIds] = useState<string[]>([]);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);

  const to12Hour = (hhmm: string) => {
    const [h, m] = hhmm.split(':').map((v) => parseInt(v, 10));
    const mer = h >= 12 ? 'PM' : 'AM';
    const dh = h % 12 === 0 ? 12 : h % 12;
    return `${dh}:${String(m).padStart(2, '0')} ${mer}`;
  };
  const { fetchShoots } = useShoots();


  const isClientAccount = user && user.role === 'client';

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('authToken');
  
        if (!token) {
          throw new Error("No auth token found in localStorage");
        }

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/clients`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const clientsData = response.data.data.map((client: any) => ({
          ...client,
          id: client.id.toString()
        }));
        setClients(clientsData);
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast({
          title: "Failed to load clients",
          description: "There was an error loading clients from the server.",
          variant: "destructive"
        });
      }
    };

    if (!isClientAccount) {
      fetchClients();
    }
  }, [isClientAccount, toast]);


  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        // Try secured list first (supports role filtering)
        const response = await axios.get(API_ROUTES.people.adminPhotographers, { headers });
        const formatted = response.data.data.map((photographer: any) => ({
          ...photographer,
          id: photographer.id.toString(),
        }));
        setPhotographersList(formatted);
      } catch (error) {
        console.warn('Admin photographers endpoint failed, falling back to public list:', error);
        try {
          const res2 = await axios.get(API_ROUTES.people.photographers);
          const formatted2 = res2.data.data.map((p: any) => ({ ...p, id: p.id.toString() }));
          setPhotographersList(formatted2);
        } catch (err2) {
          console.error('Public photographers endpoint also failed:', err2);
        }
      }
    };

    fetchPhotographers();
  }, []);


  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/services`);
        const packageData = response.data.data.map((pkg: any) => ({
          ...pkg,
          id: pkg.id.toString()
        }));
        setPackages(packageData);
      } catch (error) {
        console.error("Error fetching packages:", error);
        toast({
          title: "Failed to load packages",
          description: "There was an error loading available services.",
          variant: "destructive"
        });
      }
    };

    fetchPackages();
  }, [toast]);

  useEffect(() => {
    const fetchAvailable = async () => {
      setAvailabilityChecked(false);
      if (!date || !time) { setAvailablePhotographerIds([]); setAvailabilityChecked(true); return; }
      // Convert UI time like "12:30 PM" to 24h HH:MM
      const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (!match) { setAvailablePhotographerIds([]); setAvailabilityChecked(true); return; }
      let hhNum = parseInt(match[1], 10);
      const mmNum = parseInt(match[2], 10);
      const mer = match[3].toUpperCase();
      if (mer === 'PM' && hhNum !== 12) hhNum += 12;
      if (mer === 'AM' && hhNum === 12) hhNum = 0;
      const hh = String(hhNum).padStart(2, '0');
      const mm = String(mmNum).padStart(2, '0');
      const start_time = `${hh}:${mm}`;
      const d = new Date(date);
      const y = d.getFullYear();
      const m = String(d.getMonth()+1).padStart(2,'0');
      const day = String(d.getDate()).padStart(2,'0');
      const fmtDate = `${y}-${m}-${day}`;
      console.debug('[Availability] Checking start-time only', { fmtDate, start_time, totalPhotographers: photographers?.length || 0 });
      // Build a 30-minute window to increase match likelihood
      const startDateTmp = new Date(2000, 0, 1, Number(hh), Number(mm), 0);
      const endDateTmp = new Date(startDateTmp.getTime() + 30 * 60 * 1000);
      const endH = String(endDateTmp.getHours()).padStart(2, '0');
      const endM = String(endDateTmp.getMinutes()).padStart(2, '0');
      const end_time = `${endH}:${endM}`;
      try {
        // Frontend-only rule: mark available if any row starts exactly at this start_time
        if (!photographers || photographers.length === 0) { setAvailablePhotographerIds([]); return; }
        const token = localStorage.getItem('authToken');
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const allTimesSet = new Set<string>();
        const checks = await Promise.all(
          photographers.map(async (p) => {
            try {
              const res = await fetch(API_ROUTES.photographerAvailability.check, {
                method: "POST",
                headers,
                body: JSON.stringify({ photographer_id: p.id, date: fmtDate })
              });
              if (!res.ok) return false;
              const json = await res.json();
              const rows = (json?.data || []) as Array<any>;
              // collect all available start times for suggestion list
              rows.forEach(r => {
                if ((r?.status ?? 'available') !== 'unavailable') {
                  const raw = (r?.start_time ?? '').toString();
                  const norm = raw.includes(':') ? raw.slice(0,5) : raw;
                  if (norm) allTimesSet.add(norm);
                }
              });
              const match = rows.some(r => {
                const raw = (r?.start_time ?? '').toString();
                const rowStart = raw.includes(':') ? raw.slice(0,5) : raw; // normalize HH:mm[:ss] -> HH:mm
                return (r?.status ?? 'available') !== 'unavailable' && rowStart === start_time;
              });
              console.debug('[Availability] Photographer', p.id, 'rows:', rows, 'start_time:', start_time, 'match:', match);
              return match;
            } catch {
              return false;
            }
          })
        );

        const ids = photographers.filter((_, idx) => checks[idx]).map(p => String(p.id));
        setAvailablePhotographerIds(ids);
        console.debug('[Availability] Available photographer IDs:', ids);
        // Show toast here to avoid race where a separate effect fires before IDs update
        const role = user?.role;
        if (role === 'client' && date && time && ids.length === 0) {
          const alternatives = Array.from(allTimesSet).filter(t => t !== start_time).sort();
          const top = alternatives.slice(0, 4).map(to12Hour).join(', ');
          const desc = top
            ? `No one at ${to12Hour(start_time)}. Other times today: ${top}`
            : 'No photographers available at the selected time. You can proceed without selecting a photographer.';
          toast({ title: 'No photographers available', description: desc });
        }
      } catch {
        setAvailablePhotographerIds([]);
      } finally {
        setAvailabilityChecked(true);
      }
    };
    fetchAvailable();
  }, [date, time, photographers]);



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

  useEffect(() => {
    if (navigator.geolocation && !address) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then(permissionStatus => {
          if (permissionStatus.state === 'prompt') {
            toast({
              title: "Location Services",
              description: "Allow location access to automatically fill your property address.",
              variant: "default",
            });
          }
        })
        .catch(err => console.error("Permission check failed:", err));
    }
  }, [address, toast]);


  const getPackagePrice = () => {
    const pkg = packages.find(p => p.id === selectedPackage);
    return pkg ? Math.round(Number(pkg.price) * 100) / 100 : 0;
  };

  const getPhotographerRate = () => {

    return 0;
  };

  const getTax = () => {
    const subtotal = getPackagePrice() + getPhotographerRate();
    return Math.round(subtotal * 0.06);
  };

   const getTotal = () => {
    const packagePrice = getPackagePrice();
    const photographerRate = getPhotographerRate();
    const tax = getTax();
    
    const packageCents = Math.round(packagePrice * 100);
    const photographerCents = Math.round(photographerRate * 100);
    const taxCents = Math.round(tax * 100);
    
    const totalCents = packageCents + photographerCents + taxCents;
    return totalCents / 100;
  };
  
  const getAvailablePhotographers = () => {
    const role = user?.role;
    if (role === 'admin' || role === 'superadmin') return photographers;
    if (!date || !time) return [];
    if (availablePhotographerIds.length === 0) return [];
    return photographers.filter(p => availablePhotographerIds.includes(p.id));
  };

  const validateCurrentStep = () => {
    if (step === 1) {
      if (!client && !isClientAccount) {
        toast({
          title: "Missing information",
          description: "Please select a client before proceeding.",
          variant: "destructive",
        });
        return false;
      }
      
      if (!address || !city || !state || !zip || !selectedPackage) {
        toast({
          title: "Missing information",
          description: "Please fill in all property details and select a package before proceeding.",
          variant: "destructive",
        });
        return false;
      }
      return true;
    }
    
    if (step === 2) {
      const errors = {};
      if (!date) errors['date'] = "Please select a date";
      if (!time) errors['time'] = "Please select a time";
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return false;
      }
      return true;
    }
    
    return true;
  };

    
      
      
      
      
      








      

  const handleSubmit = async () => {
  setFormErrors({});

  if (step === 3) {
  if (!client || !address || !city || !state || !zip || !date || !time || !selectedPackage) {
    toast({
      title: "Missing information",
      description: "Please fill in all required fields before confirming the booking.",
      variant: "destructive",
    });
    return;
  }

  const shootDate = date ? new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12
  ) : new Date();

  const baseQuote = getPackagePrice();
  const photographerRate = getPackagePrice();
  const taxAmount = getTax();
  const totalQuote = getTotal();

  const payload = {
    client_id: client,
    address,
    city,
    state,
    zip,
    scheduled_date: shootDate.toISOString().split('T')[0], // YYYY-MM-DD format
    time,
    photographer_id: photographer || null,
    service_id: selectedPackage,
    shoot_notes: notes || undefined,
    company_notes: companyNotes || undefined,
    photographer_notes: photographerNotes || undefined,
    editor_notes: editorNotes || undefined,
    bypass_payment: bypassPayment,
    send_notification: sendNotification,
    base_quote: baseQuote,
    tax_amount: taxAmount,
    total_quote: totalQuote,
    payment_status: bypassPayment ? 'pending' : 'paid', // or whatever statuses your API expects
    status: 'scheduled', // or 'scheduled', 'confirmed' - check your API documentation
    created_by: user?.name || user?.email || 'System' // Use available user info
  };

  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shoots`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    toast({
      title: "Shoot Booked!",
      description: "The shoot has been successfully created.",
      variant: "default"
    });

    setIsComplete(true);
    await fetchShoots();
    console.log("Shoot created response:", response.data);
  } catch (error) {
    console.error("Error creating shoot:", error);
    
    if (error.response?.data?.errors) {
      const errorMessages = Object.values(error.response.data.errors).flat();
      toast({
        title: "Validation Error",
        description: errorMessages.join('. '),
        variant: "destructive"
      });
    } else {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create shoot. Please try again.",
        variant: "destructive"
      });
    }
  }
  } else {
  if (!validateCurrentStep()) {
    return;
  }

  setStep(step + 1);
  }
  };

  const goBack = () => {
    if (step > 1) {
      setFormErrors({});
      setStep(step - 1);
    }
  };

  const resetForm = () => {
    if (!isClientAccount) {
      setClient('');
    }
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

  const clientPropertyFormData = React.useMemo(() => ({
    initialData: {
      clientId: client,
      clientName: isClientAccount ? user?.name || '' : clients.find(c => c.id === client)?.name || '',
      clientEmail: isClientAccount ? user?.email || '' : clients.find(c => c.id === client)?.email || '',
      clientPhone: isClientAccount ? (user?.metadata?.phone || user?.phone || '') : clients.find(c => c.id === client)?.phone || '',
      clientCompany: isClientAccount ? (user?.metadata?.company || user?.company || '') : clients.find(c => c.id === client)?.company || '',
      propertyType: 'residential' as const,
      propertyAddress: address,
      propertyCity: city,
      propertyState: state,
      propertyZip: zip,
      propertyInfo: notes,
      selectedPackage: selectedPackage
    },
    onComplete: (data: any) => {
      if (!isClientAccount && data.clientId) {
        setClient(data.clientId);
      }
      setAddress(data.propertyAddress);
      setCity(data.propertyCity);
      setState(data.propertyState);
      setZip(data.propertyZip);
      setNotes(data.shootNotes || data.propertyInfo || '');
      setCompanyNotes(data.companyNotes || '');
      setPhotographerNotes(data.photographerNotes || '');
      setEditorNotes(data.editorNotes || '');
      setSelectedPackage(data.selectedPackage || '');
      setStep(2);
    },
    isClientAccount: isClientAccount
  }), [client, clients, address, city, state, zip, notes, selectedPackage, isClientAccount, user]);


  const getSummaryInfo = () => {
    const selectedClientData = clients.find(c => c.id === client);
    const selectedPackageData = packages.find(p => p.id === selectedPackage);
    
    return {
      client: selectedClientData?.name || (isClientAccount ? user?.name || '' : ''),
      package: selectedPackageData?.name || '',
      packagePrice: getPackagePrice(),
      address: address ? `${address}, ${city}, ${state} ${zip}` : '',
      bedrooms: 0,
      bathrooms: 0,
      sqft: 0,
      date: date ? format(date, 'PPP') : '',
      time: time || '',
    };
  };

  const summaryInfo = getSummaryInfo();
  
  const getCurrentStepContent = () => {
    const stepContent = {
      1: {
        title: "Client & Property Details",
        description: "Select a client and enter the property information"
      },
      2: {
        title: "Schedule",
        description: "Choose a convenient date and time for the shoot"
      },
      3: {
        title: "Review & Confirm",
        description: "Verify all the details before confirming the booking"
      }
    };
    
    return stepContent[step as keyof typeof stepContent] || { title: '', description: '' };
  };
  
  const currentStepContent = getCurrentStepContent();

  return (
    <DashboardLayout>
      <div className="container px-4 sm:px-6 max-w-5xl py-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/shoots')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shoots
        </Button>
        
        <AnimatePresence mode="wait">
          {isComplete ? (
            <BookingComplete date={date} time={time} resetForm={resetForm} />
          ) : (
            <div>
              <BookingHeader 
                title={currentStepContent.title}
                description={currentStepContent.description}
              />
              
              <BookingStepIndicator currentStep={step} totalSteps={3} />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {/* Summary always appears on top on mobile, side on desktop */}
                <div className={`${isMobile ? "order-1 mb-4" : "order-1 md:order-1 row-span-2"} md:col-span-1`}>
                  <BookingSummary 
                    summaryInfo={summaryInfo} 
                    selectedPackage={selectedPackage}
                    packages={packages}
                    onSubmit={step === 3 ? handleSubmit : undefined}
                    isLastStep={step === 3}
                  />
                </div>
                
                <div className="order-2 md:col-span-2">
                  <BookingContentArea
                    step={step}
                    formErrors={formErrors}
                    setFormErrors={setFormErrors}
                    clientPropertyFormData={clientPropertyFormData}
                    date={date}
                    setDate={setDate}
                    time={time}
                    setTime={setTime}
                    selectedPackage={selectedPackage}
                    notes={notes}
                    setNotes={setNotes}
                    packages={packages}
                    client={client}
                    address={address}
                    city={city}
                    state={state}
                    zip={zip}
                    setAddress={setAddress}
                    setCity={setCity}
                    setState={setState}
                    setZip={setZip}
                    photographer={photographer}
                    setPhotographer={setPhotographer}
                    bypassPayment={bypassPayment}
                    setBypassPayment={setBypassPayment}
                    sendNotification={sendNotification}
                    setSendNotification={setSendNotification}
                    getPackagePrice={getPackagePrice}
                    getPhotographerRate={getPhotographerRate}
                    getTax={getTax}
                    getTotal={getTotal}
                    clients={clients}
                    photographers={getAvailablePhotographers()}
                    handleSubmit={handleSubmit}
                    goBack={goBack}
                  />
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default BookShoot;








