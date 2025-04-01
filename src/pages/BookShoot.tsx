import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnimatePresence } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { BookingHeader } from '@/components/booking/BookingHeader';
import { BookingStepIndicator } from '@/components/booking/BookingStepIndicator';
import { ClientPropertyForm } from '@/components/booking/ClientPropertyForm';
import { SchedulingForm } from '@/components/booking/SchedulingForm';
import { ReviewForm } from '@/components/booking/ReviewForm';
import { BookingComplete } from '@/components/booking/BookingComplete';
import { useShoots } from '@/context/ShootsContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ShootData } from '@/types/shoots';
import { Client } from '@/types/clients';
import { initialClientsData } from '@/data/clientsData';

const photographers = [
  { id: '1', name: 'John Doe', avatar: 'https://ui.shadcn.com/avatars/01.png', rate: 150, availability: true },
  { id: '2', name: 'Jane Smith', avatar: 'https://ui.shadcn.com/avatars/02.png', rate: 175, availability: true },
  { id: '3', name: 'Mike Brown', avatar: 'https://ui.shadcn.com/avatars/03.png', rate: 200, availability: false },
];

const packages = [
  { id: '1', name: 'Basic', description: 'Photos only', price: 150 },
  { id: '2', name: 'Standard', description: 'Photos + Floor Plans', price: 250 },
  { id: '3', name: 'Premium', description: 'Photos + Video + Floor Plans', price: 350 },
  { id: '4', name: 'Luxury', description: 'Photos + Video + 3D Tour + Floor Plans', price: 500 },
];

const BookShoot = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clientIdFromUrl = queryParams.get('clientId');
  const clientNameFromUrl = queryParams.get('clientName');
  const clientCompanyFromUrl = queryParams.get('clientCompany');
  
  const [clients, setClients] = useState<Client[]>(() => {
    const storedClients = localStorage.getItem('clientsData');
    return storedClients ? JSON.parse(storedClients) : initialClientsData;
  });
  
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
        services: selectedPackageData ? [selectedPackageData.name] : [],
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <BookingHeader 
          title="Book a Shoot" 
          description="Schedule a new photography session for a property." 
        />

        <AnimatePresence mode="wait">
          {isComplete ? (
            <BookingComplete date={date} time={time} resetForm={resetForm} />
          ) : (
            <Card className="glass-card">
              <CardHeader>
                <BookingStepIndicator currentStep={step} totalSteps={3} />
                <CardTitle>
                  {step === 1 && 'Client, Property & Package'}
                  {step === 2 && 'Date & Time Selection'}
                  {step === 3 && 'Photographer & Review'}
                </CardTitle>
                <CardDescription>
                  {step === 1 && 'Enter the client and property information, and select a package'}
                  {step === 2 && 'Choose a convenient date and time'}
                  {step === 3 && 'Select a photographer and review booking details'}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <ClientPropertyForm
                      client={client}
                      setClient={setClient}
                      address={address}
                      setAddress={setAddress}
                      city={city}
                      setCity={setCity}
                      state={state}
                      setState={setState}
                      zip={zip}
                      setZip={setZip}
                      clients={clients}
                      selectedPackage={selectedPackage}
                      setSelectedPackage={setSelectedPackage}
                      packages={packages}
                    />
                  )}
                  
                  {step === 2 && (
                    <SchedulingForm
                      date={date}
                      setDate={setDate}
                      time={time}
                      setTime={setTime}
                      selectedPackage={selectedPackage}
                      notes={notes}
                      setNotes={setNotes}
                      packages={packages}
                    />
                  )}
                  
                  {step === 3 && (
                    <ReviewForm
                      client={client}
                      address={address}
                      city={city}
                      state={state}
                      zip={zip}
                      date={date}
                      time={time}
                      photographer={photographer}
                      setPhotographer={setPhotographer}
                      selectedPackage={selectedPackage}
                      notes={notes}
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
                      packages={packages}
                    />
                  )}
                </AnimatePresence>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (step > 1) setStep(step - 1);
                  }}
                  disabled={step === 1}
                >
                  Back
                </Button>
                
                <Button
                  onClick={handleSubmit}
                >
                  {step === 3 ? 'Confirm Booking' : 'Next'}
                </Button>
              </CardFooter>
            </Card>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default BookShoot;
