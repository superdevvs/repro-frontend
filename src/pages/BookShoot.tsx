
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { AnimatePresence } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
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
// import { photographers } from '@/constants/bookingSteps';
import { ShootData } from '@/types/shoots';
import { useIsMobile } from '@/hooks/use-mobile';
import { BookingHeader } from '@/components/booking/BookingHeader';
import axios from 'axios';


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
  const [bypassPayment, setBypassPayment] = useState(false);
  const [sendNotification, setSendNotification] = useState(true);
  const [step, setStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { addShoot } = useShoots();
  const navigate = useNavigate();
  const [photographers, setPhotographersList] = useState([]);
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
        // setClients(response.data.data);
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

        if (!token) {
          throw new Error("No auth token found in localStorage");
        }

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/photographers`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const formatted = response.data.data.map((photographer: any) => ({
          ...photographer,
          id: photographer.id.toString(), // Ensure id is string
        }));
        setPhotographersList(formatted);
      } catch (error) {
        console.error("Error fetching photographers:", error);
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
        // setPackages(response.data.data);
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
    if (clientIdFromUrl && clientNameFromUrl) {
      setClient(clientIdFromUrl);

      toast({
        title: "Client Selected",
        description: `${decodeURIComponent(clientNameFromUrl)}${clientCompanyFromUrl ? ` (${decodeURIComponent(clientCompanyFromUrl)})` : ''} has been selected for this shoot.`,
        variant: "default",
      });
    }
  }, [clientIdFromUrl, clientNameFromUrl, clientCompanyFromUrl, toast]);

  // Ask for geolocation permission when the component mounts
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

  // const getPackagePrice = () => {
  //   const pkg = packages.find(p => p.id === selectedPackage);
  //   return pkg ? pkg.price : 0;
  // };

  const getPackagePrice = () => {
    const pkg = packages.find(p => p.id === selectedPackage);
    // Ensure we get a clean number and round to 2 decimal places
    return pkg ? Math.round(Number(pkg.price) * 100) / 100 : 0;
  };

  const getPhotographerRate = () => {
    // const photog = photographers.find(p => p.id === photographer);
    // return photog ? photog.rate : 0;

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

    // Convert to cents, add, then convert back to dollars to avoid floating point issues
    const packageCents = Math.round(packagePrice * 100);
    const photographerCents = Math.round(photographerRate * 100);
    const taxCents = Math.round(tax * 100);

    const totalCents = packageCents + photographerCents + taxCents;
    return totalCents / 100;
  };

  const getAvailablePhotographers = () => {
    // if (!date || !time || !selectedPackage) return [];

    // return photographers.filter(p => p.availability);

    return photographers
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

  // const handleSubmit = async () => {
  //   setFormErrors({});

  //   if (step === 3) {
  // const availablePhotographers = getAvailablePhotographers();

  // if (!client || !address || !city || !state || !zip || !date || !time || !selectedPackage) {
  //   toast({
  //     title: "Missing information",
  //     description: "Please fill in all required fields before confirming the booking.",
  //     variant: "destructive",
  //   });
  //   return;
  // }

  // const selectedClientData = clients.find(c => c.id === client);
  // const selectedPhotographerData = photographers.find(p => p.id === photographer);
  // const selectedPackageData = packages.find(p => p.id === selectedPackage);

  // const bookingStatus: ShootData['status'] = 'booked';

  // // Make sure date is properly formatted to avoid timezone issues
  // const shootDate = date ? new Date(
  //   date.getFullYear(),
  //   date.getMonth(),
  //   date.getDate(),
  //   12, // Set to noon to avoid timezone issues
  //   0,
  //   0
  // ) : new Date();

  // const newShoot: ShootData = {
  //   id: uuidv4(),
  //   scheduledDate: shootDate.toISOString().split('T')[0],
  //   time: time,
  //   client: {
  //     name: selectedClientData?.name || 'Unknown Client',
  //     email: selectedClientData?.email || `client${client}@example.com`,
  //     company: selectedClientData?.company,
  //     totalShoots: 1
  //   },
  //   location: {
  //     address: address,
  //     address2: '',
  //     city: city,
  //     state: state,
  //     zip: zip,
  //     fullAddress: `${address}, ${city}, ${state} ${zip}`
  //   },
  //   photographer: selectedPhotographerData ? {
  //     id: selectedPhotographerData.id,
  //     name: selectedPhotographerData.name,
  //     avatar: selectedPhotographerData.avatar
  //   } : {
  //     name: "To Be Assigned",
  //     avatar: ""
  //   },
  //   services: selectedPackageData ? [selectedPackageData.name] : [],
  //   payment: {
  //     baseQuote: getPackagePrice(),
  //     taxRate: 6.0,
  //     taxAmount: getTax(),
  //     totalQuote: getTotal(),
  //     totalPaid: bypassPayment ? 0 : getTotal(),
  //     lastPaymentDate: bypassPayment ? undefined : new Date().toISOString().split('T')[0],
  //     lastPaymentType: bypassPayment ? undefined : 'Credit Card'
  //   },
  //   status: bookingStatus,
  //   notes: notes ? { shootNotes: notes } : undefined,
  //   createdBy: user?.name || "Current User"
  // };

  // addShoot(newShoot);
  // setIsComplete(true);

  // console.log("New shoot created:", newShoot);

  //       if (!client || !address || !city || !state || !zip || !date || !time || !selectedPackage) {
  //         toast({
  //           title: "Missing information",
  //           description: "Please fill in all required fields before confirming the booking.",
  //           variant: "destructive",
  //         });
  //         return;
  //       }

  //       const shootDate = date ? new Date(
  //         date.getFullYear(),
  //         date.getMonth(),
  //         date.getDate(),
  //         12
  //       ) : new Date();

  //       const payload = {
  //         client_id: client,
  //         address,
  //         city,
  //         state,
  //         zip,
  //         scheduled_date: shootDate.toISOString().split('T')[0],
  //         time,
  //         photographer_id: photographer || null,
  //         service_id: selectedPackage,
  //         notes,
  //         bypass_payment: bypassPayment,
  //         send_notification: sendNotification
  //       };

  //       try {
  //         const token = localStorage.getItem('authToken');
  //         const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shoots`, payload, {
  //           headers: {
  //             Authorization: `Bearer ${token}`
  //           }
  //         });

  //         toast({
  //           title: "Shoot Booked!",
  //           description: "The shoot has been successfully created.",
  //           variant: "default"
  //         });

  //         setIsComplete(true);
  //         console.log("Shoot created response:", response.data);
  //       } catch (error) {
  //         console.error("Error creating shoot:", error);
  //         toast({
  //           title: "Error",
  //           description: "Failed to create shoot. Please try again.",
  //           variant: "destructive"
  //         });
  //       }
  //   } else {
  //     if (!validateCurrentStep()) {
  //       return;
  //     }

  //     setStep(step + 1);
  //   }
  // };

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

      // Calculate pricing information
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
        notes,
        bypass_payment: bypassPayment,
        send_notification: sendNotification,
        // Add the missing required fields based on API error
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

        // Better error handling to show specific validation errors
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

  const clientPropertyFormData = {
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
            <>
              <BookingHeader
                title={currentStepContent.title}
                description={currentStepContent.description}
              />

              <BookingStepIndicator currentStep={step} totalSteps={3} />

              <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1.4fr] gap-6 mt-12">
                {/* LEFT (content) - appears first on mobile */}
                <div className="order-1 md:order-1 md:col-span-1">
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

                {/* RIGHT (summary) - appears last on mobile */}
                <div className="order-2 md:order-2 md:col-span-1">
                  <BookingSummary
                    summaryInfo={summaryInfo}
                    selectedPackage={selectedPackage}
                    packages={packages}
                    onSubmit={step === 3 ? handleSubmit : undefined}
                    isLastStep={step === 3}
                  />
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
