
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnimatePresence } from 'framer-motion';
import { BookingProvider, useBooking } from '@/context/BookingContext';
import { BookingHeader } from '@/components/booking/BookingHeader';
import { BookingStepIndicator } from '@/components/booking/BookingStepIndicator';
import { ClientPropertyForm } from '@/components/booking/ClientPropertyForm';
import { SchedulingForm } from '@/components/booking/SchedulingForm';
import { ReviewForm } from '@/components/booking/ReviewForm';
import { BookingComplete } from '@/components/booking/BookingComplete';

// BookingContent component that uses the booking context
const BookingContent = () => {
  const {
    date, setDate,
    time, setTime,
    step, setStep,
    isComplete,
    notes, setNotes,
    selectedPackage,
    client, setClient,
    address, setAddress,
    city, setCity,
    state, setState,
    zip, setZip,
    photographer, setPhotographer,
    bypassPayment, setBypassPayment,
    sendNotification, setSendNotification,
    clients, packages,
    getPackagePrice, getPhotographerRate, getTax, getTotal,
    getAvailablePhotographers, handleSubmit, resetForm
  } = useBooking();

  return (
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
                    setSelectedPackage={setPackage => setSelectedPackage(setPackage)}
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
  );
};

// Main BookShoot component that provides the BookingProvider
const BookShoot = () => {
  return (
    <DashboardLayout>
      <BookingProvider>
        <BookingContent />
      </BookingProvider>
    </DashboardLayout>
  );
};

export default BookShoot;
