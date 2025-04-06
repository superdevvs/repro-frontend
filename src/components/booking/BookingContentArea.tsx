
import React from 'react';
import { Card } from '@/components/ui/card';
import { ClientPropertyForm } from './ClientPropertyForm';
import { SchedulingForm } from './SchedulingForm';
import { ReviewForm } from './ReviewForm';
import { stepContent } from '@/constants/bookingSteps';

interface BookingContentAreaProps {
  step: number;
  formErrors: Record<string, string>;
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  clientPropertyFormData: any;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  time: string;
  setTime: React.Dispatch<React.SetStateAction<string>>;
  selectedPackage: string;
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
  packages: any[];
  client: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  photographer: string;
  setPhotographer: React.Dispatch<React.SetStateAction<string>>;
  bypassPayment: boolean;
  setBypassPayment: React.Dispatch<React.SetStateAction<boolean>>;
  sendNotification: boolean;
  setSendNotification: React.Dispatch<React.SetStateAction<boolean>>;
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
  const currentStepContent = stepContent[step as keyof typeof stepContent];
  
  return (
    <Card className="p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">{currentStepContent.title}</h2>
        <p className="text-muted-foreground">{currentStepContent.description}</p>
      </div>
      
      {step === 1 && (
        <ClientPropertyForm
          data={clientPropertyFormData.initialData}
          onComplete={clientPropertyFormData.onComplete}
          packages={packages}
          isClientAccount={clientPropertyFormData.isClientAccount}
          clients={clients}
        />
      )}
      
      {step === 2 && (
        <SchedulingForm
          date={date}
          setDate={setDate}
          time={time}
          setTime={setTime}
          errors={formErrors}
          setErrors={setFormErrors}
          selectedPackage={selectedPackage}
          handleSubmit={handleSubmit}
          goBack={goBack}
        />
      )}
      
      {step === 3 && (
        <ReviewForm
          client={clientPropertyFormData.initialData.clientName}
          address={address}
          city={city}
          state={state}
          zip={zip}
          date={date}
          time={time}
          photographer={photographer}
          setPhotographer={setPhotographer}
          bypassPayment={bypassPayment}
          setBypassPayment={setBypassPayment}
          sendNotification={sendNotification}
          setSendNotification={setSendNotification}
          photographers={photographers}
          selectedPackage={selectedPackage}
          packagePrice={getPackagePrice()}
          photographerRate={getPhotographerRate()}
          tax={getTax()}
          total={getTotal()}
          additionalNotes={notes}
          setAdditionalNotes={setNotes}
          onConfirm={handleSubmit}
          onBack={goBack}
        />
      )}
    </Card>
  );
}
