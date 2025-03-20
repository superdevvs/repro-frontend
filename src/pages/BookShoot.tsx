import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ShootData } from '@/types/shoots';

const clients = [
  { id: '1', name: 'ABC Properties' },
  { id: '2', name: 'XYZ Realty' },
  { id: '3', name: 'Coastal Properties' },
  { id: '4', name: 'Mountain Homes' },
  { id: '5', name: 'Lakefront Properties' },
];

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
  const [client, setClient] = useState('');
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

  const getAvailableTimes = () => {
    if (!photographer || !date) return [];

    const photog = photographers.find(p => p.id === photographer);

    if (!photog || !photog.availability) {
      return [];
    }

    return [
      "9:00 AM", 
      "10:00 AM", 
      "11:00 AM", 
      "1:00 PM", 
      "2:00 PM", 
      "3:00 PM"
    ];
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
          email: `client${client}@example.com`,
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
        status: 'scheduled' as const,
        notes: notes ? { shootNotes: notes } : undefined,
        createdBy: "Current User"
      };

      addShoot(newShoot);
      setIsComplete(true);

      console.log("New shoot created:", newShoot);
    } else {
      if (step === 1 && (!client || !address || !city || !state || !zip)) {
        toast({
          title: "Missing information",
          description: "Please fill in all client and property details before proceeding.",
          variant: "destructive",
        });
        return;
      }

      if (step === 2 && (!date || !time || !photographer || !selectedPackage)) {
        toast({
          title: "Missing information",
          description: "Please select a date, time, photographer, and package before proceeding.",
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
                  {step === 1 && 'Client & Property Details'}
                  {step === 2 && 'Scheduling & Services'}
                  {step === 3 && 'Review & Confirm'}
                </CardTitle>
                <CardDescription>
                  {step === 1 && 'Enter the client and property information'}
                  {step === 2 && 'Choose date, time, photographer, and services'}
                  {step === 3 && 'Review booking details and confirm'}
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
                    />
                  )}
                  
                  {step === 2 && (
                    <SchedulingForm
                      date={date}
                      setDate={setDate}
                      time={time}
                      setTime={setTime}
                      photographer={photographer}
                      setPhotographer={setPhotographer}
                      selectedPackage={selectedPackage}
                      setSelectedPackage={setSelectedPackage}
                      notes={notes}
                      setNotes={setNotes}
                      photographers={photographers}
                      packages={packages}
                      getAvailableTimes={getAvailableTimes}
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
                      photographers={photographers}
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
