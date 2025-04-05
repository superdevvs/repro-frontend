import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
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
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CalendarIcon, Clock, HomeIcon, User, DollarSign, MapPin } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const stepContent = {
  1: {
    title: "Property Details",
    description: "Enter details about the property and select your package"
  },
  2: {
    title: "Schedule Your Shoot",
    description: "Choose a date and time that works for you"
  },
  3: {
    title: "Review & Confirm",
    description: "Review all details and confirm your booking"
  }
};

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
  const { user } = useAuth();
  
  const [clients, setClients] = useState<Client[]>(() => {
    const storedClients = localStorage.getItem('clientsData');
    return storedClients ? JSON.parse(storedClients) : initialClientsData;
  });
  
  const [client, setClient] = useState(() => {
    if (user && user.role === 'client' && user.metadata && user.metadata.clientId) {
      return user.metadata.clientId;
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
  const [bypassPayment, setBypassPayment] = useState(false);
  const [sendNotification, setSendNotification] = useState(true);
  const [step, setStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  const { addShoot } = useShoots();
  const navigate = useNavigate();

  const isClientAccount = user && user.role === 'client';

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

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    setFormErrors({});
    
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
        createdBy: user?.name || "Current User"
      };

      addShoot(newShoot);
      setIsComplete(true);

      console.log("New shoot created:", newShoot);
    } else {
      if (!validateCurrentStep()) {
        return;
      }
      
      setStep(step + 1);
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

  const clientPropertyFormData = {
    initialData: {
      clientId: client,
      clientName: isClientAccount ? user?.name || '' : clients.find(c => c.id === client)?.name || '',
      clientEmail: isClientAccount ? user?.email || '' : clients.find(c => c.id === client)?.email || '',
      clientPhone: isClientAccount ? (user?.metadata?.phone || '') : clients.find(c => c.id === client)?.phone || '',
      clientCompany: isClientAccount ? (user?.metadata?.company || '') : clients.find(c => c.id === client)?.company || '',
      propertyType: 'residential' as const,
      propertyAddress: address,
      propertyCity: city,
      propertyState: state,
      propertyZip: zip,
      propertyInfo: notes
    },
    onComplete: (data: any) => {
      if (!isClientAccount && data.clientId) {
        setClient(data.clientId);
      }
      setAddress(data.propertyAddress);
      setCity(data.propertyCity);
      setState(data.propertyState);
      setZip(data.propertyZip);
      setNotes(data.propertyInfo || '');
      setSelectedPackage(data.selectedPackage || '');
      setStep(2);
    },
    isClientAccount: isClientAccount
  };

  const getSummaryInfo = () => {
    const selectedClientData = clients.find(c => c.id === client);
    const selectedPackageData = packages.find(p => p.id === selectedPackage);
    
    return {
      client: selectedClientData?.name || (isClientAccount ? user?.name : ''),
      package: selectedPackageData?.name || '',
      packagePrice: getPackagePrice(),
      address: address ? `${address}, ${city}, ${state} ${zip}` : '',
      date: date ? format(date, 'PPP') : '',
      time: time || '',
    };
  };

  const summaryInfo = getSummaryInfo();

  return (
    <DashboardLayout>
      <div className="container max-w-5xl py-6 space-y-8">
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
            <>
              <BookingStepIndicator currentStep={step} totalSteps={3} />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 order-2 md:order-1">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-card rounded-lg border shadow-sm p-6 sticky top-20"
                  >
                    <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
                    <p className="text-muted-foreground mb-6 text-sm">Complete all steps to schedule your shoot</p>
                    
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <div className="text-sm text-muted-foreground">Client</div>
                        {summaryInfo.client ? (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            <span>{summaryInfo.client}</span>
                          </div>
                        ) : (
                          <Skeleton className="h-6 w-2/3" />
                        )}
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="text-sm text-muted-foreground">Property</div>
                        {summaryInfo.address ? (
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-primary mt-0.5" />
                            <span>{summaryInfo.address}</span>
                          </div>
                        ) : (
                          <Skeleton className="h-6 w-full" />
                        )}
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="text-sm text-muted-foreground">Date & Time</div>
                        {summaryInfo.date ? (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4 text-primary" />
                              <span>{summaryInfo.date}</span>
                            </div>
                            {summaryInfo.time && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                <span>{summaryInfo.time}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <Skeleton className="h-6 w-3/4" />
                        )}
                      </div>
                      
                      {selectedPackage && (
                        <div className="pt-4 border-t border-border">
                          <h3 className="text-sm font-medium mb-3">Selected Package:</h3>
                          <div className="bg-primary/5 rounded-md p-3 border border-primary/10">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{summaryInfo.package}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {packages.find(p => p.id === selectedPackage)?.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4 text-primary" />
                                <span className="font-bold">{getPackagePrice()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
                
                <div className="md:col-span-2 order-1 md:order-2">
                  <motion.div
                    key={`step-${step}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle>{stepContent.title}</CardTitle>
                        <p className="text-muted-foreground text-sm">{stepContent.description}</p>
                      </CardHeader>
                      
                      <CardContent className="pb-8">
                        <AnimatePresence mode="wait">
                          {step === 1 && (
                            <ClientPropertyForm
                              onComplete={clientPropertyFormData.onComplete}
                              initialData={clientPropertyFormData.initialData}
                              isClientAccount={clientPropertyFormData.isClientAccount}
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
                              formErrors={formErrors}
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
                    </Card>
                    
                    <div className="flex justify-between mt-6">
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (step > 1) {
                            setFormErrors({});
                            setStep(step - 1);
                          }
                        }}
                        disabled={step === 1}
                      >
                        Back
                      </Button>
                      
                      <Button
                        onClick={handleSubmit}
                        className="bg-primary hover:bg-primary/90 transition-colors"
                      >
                        {step === 3 ? 'Confirm Booking' : 'Continue'}
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default BookShoot;
