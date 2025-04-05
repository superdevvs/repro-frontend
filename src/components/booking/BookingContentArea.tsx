
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { ClientPropertyForm } from '@/components/booking/ClientPropertyForm';
import { SchedulingForm } from '@/components/booking/SchedulingForm';
import { ReviewForm } from '@/components/booking/ReviewForm';
import { StepNavigation } from '@/components/booking/StepNavigation';
import { stepContent } from '@/constants/bookingSteps';

interface BookingContentAreaProps {
  step: number;
  formErrors: Record<string, string>;
  setFormErrors: (errors: Record<string, string>) => void;
  clientPropertyFormData: {
    initialData: any;
    onComplete: (data: any) => void;
    isClientAccount: boolean;
  };
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  time: string;
  setTime: (time: string) => void;
  selectedPackage: string;
  notes: string;
  setNotes: (notes: string) => void;
  packages: Array<{ id: string; name: string; description: string; price: number }>;
  client: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  photographer: string;
  setPhotographer: (photographer: string) => void;
  bypassPayment: boolean;
  setBypassPayment: (bypass: boolean) => void;
  sendNotification: boolean;
  setSendNotification: (send: boolean) => void;
  getPackagePrice: () => number;
  getPhotographerRate: () => number;
  getTax: () => number;
  getTotal: () => number;
  clients: any[];
  photographers: any[];
  handleSubmit: () => void;
  goBack: () => void;
}

export function BookingContentArea({
  step,
  formErrors,
  setFormErrors,
  clientPropertyFormData,
  date,
  setDate,
  time,
  setTime,
  selectedPackage,
  notes,
  setNotes,
  packages,
  client,
  address,
  city,
  state,
  zip,
  photographer,
  setPhotographer,
  bypassPayment,
  setBypassPayment,
  sendNotification,
  setSendNotification,
  getPackagePrice,
  getPhotographerRate,
  getTax,
  getTotal,
  clients,
  photographers,
  handleSubmit,
  goBack
}: BookingContentAreaProps) {
  return (
    <motion.div
      key={`step-${step}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle>{stepContent[step as keyof typeof stepContent]?.title}</CardTitle>
          <p className="text-muted-foreground text-sm">{stepContent[step as keyof typeof stepContent]?.description}</p>
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
                photographers={photographers}
                packages={packages}
              />
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      
      <StepNavigation 
        step={step} 
        goBack={goBack} 
        goNext={handleSubmit}
      />
    </motion.div>
  );
}
