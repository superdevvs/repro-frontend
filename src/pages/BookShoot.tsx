import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useShoots } from '@/context/ShootsContext';
import { ShootData } from '@/types/shoots';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from "lucide-react";

const TAX_RATE = 0.08; // 8% tax rate

const BookShoot = () => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
	const [clientCompany, setClientCompany] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPhotographer, setSelectedPhotographer] = useState<{ id: string; name: string } | { name: string; avatar: string } | null>(null);
  
  const { addShoot, shoots } = useShoots();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Mock photographer data
  const photographers = [
    { id: '1', name: 'John Doe', avatar: 'https://ui.shadcn.com/avatars/01.png' },
    { id: '2', name: 'Jane Smith', avatar: 'https://ui.shadcn.com/avatars/02.png' },
  ];
  
  // Mock service data
  const services = [
    'Photography',
    '3D Virtual Tour',
    'Drone Photography',
    'Floor Plans',
  ];
  
  // Mock time slots
  const timeSlots = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
  ];
  
  // Calculate base price based on selected services
  const calculateBasePrice = () => {
    let basePrice = 100; // Default base price
    selectedServices.forEach(service => {
      switch (service) {
        case '3D Virtual Tour':
          basePrice += 75;
          break;
        case 'Drone Photography':
          basePrice += 125;
          break;
        case 'Floor Plans':
          basePrice += 50;
          break;
        default:
          break;
      }
    });
    return basePrice;
  };
  
  // Calculate tax amount
  const calculateTaxAmount = () => {
    return calculateBasePrice() * TAX_RATE;
  };
  
  // Calculate total price
  const calculateTotalPrice = () => {
    return calculateBasePrice() + calculateTaxAmount();
  };
  
  // Reset form fields
  const resetForm = () => {
    setClientName('');
    setClientEmail('');
    setClientPhone('');
		setClientCompany('');
    setPropertyAddress('');
    setCity('');
    setState('');
    setZipCode('');
    setSelectedDate(undefined);
    setSelectedTimeSlot('10:00 AM');
    setSelectedServices([]);
    setSpecialInstructions('');
    setSelectedPhotographer(null);
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Form validation
    if (!clientName || !propertyAddress || !selectedDate) {
      toast.error("Please fill out all required fields");
      setIsSubmitting(false);
      return;
    }
    
    // Check if a photographer is selected for the shoot
    if (!selectedPhotographer) {
      toast.error("Please select a photographer");
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Generate unique ID for the shoot
      const shootId = uuidv4();
      
      // Format date for storing
      const formattedDate = selectedDate.toISOString();
      
      // Photographer object
      const photographer = selectedPhotographer.id 
        ? { 
            id: selectedPhotographer.id,
            name: selectedPhotographer.name,
          }
        : { 
            id: uuidv4(), // Generate an ID if one doesn't exist
            name: selectedPhotographer.name,
          };
      
      // Create a new shoot object
      const newShoot: ShootData = {
        id: shootId,
        scheduledDate: formattedDate,
        time: selectedTimeSlot,
        status: 'scheduled' as const, // Using as const to ensure type compatibility
        client: {
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
					company: clientCompany,
        },
        location: {
          address: propertyAddress,
          fullAddress: `${propertyAddress}, ${city}, ${state} ${zipCode}`,
          city,
          state,
          zipCode,
        },
        photographer: photographer,
        notes: {
          shootNotes: specialInstructions,
        },
        payment: {
          totalPaid: 0,
          status: 'unpaid',
          baseQuote: calculateBasePrice(),
          taxAmount: calculateTaxAmount(),
          taxRate: TAX_RATE,
          totalQuote: calculateTotalPrice(),
        },
        services: selectedServices,
        completedDate: undefined,
      };
      
      // Add the shoot to the context
      addShoot(newShoot);
      
      // Show success message
      toast.success("Shoot scheduled successfully!");
      
      // Reset form
      resetForm();
      
      // Redirect to the shoots page after a short delay
      setTimeout(() => {
        navigate('/shoots');
      }, 1500);
      
    } catch (error) {
      console.error("Error booking shoot:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Book a Photoshoot</CardTitle>
          <CardDescription>
            Fill out the form below to schedule a photoshoot for your property.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                type="text"
                id="clientName"
                placeholder="Enter client name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                type="email"
                id="clientEmail"
                placeholder="Enter client email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="clientPhone">Client Phone</Label>
              <Input
                type="tel"
                id="clientPhone"
                placeholder="Enter client phone"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
              />
            </div>
						<div>
              <Label htmlFor="clientCompany">Client Company</Label>
              <Input
                type="text"
                id="clientCompany"
                placeholder="Enter client company"
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="propertyAddress">Property Address</Label>
              <Input
                type="text"
                id="propertyAddress"
                placeholder="Enter property address"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  type="text"
                  id="city"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  type="text"
                  id="state"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  type="text"
                  id="zipCode"
                  placeholder="Zip Code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="date">Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>
            <div>
              <Label htmlFor="time">Select Time</Label>
              <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Select Services</Label>
              <div className="grid grid-cols-2 gap-2">
                {services.map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={service}
                      checked={selectedServices.includes(service)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedServices([...selectedServices, service]);
                        } else {
                          setSelectedServices(selectedServices.filter((s) => s !== service));
                        }
                      }}
                    />
                    <Label htmlFor={service}>{service}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="specialInstructions">Special Instructions</Label>
              <Textarea
                id="specialInstructions"
                placeholder="Enter any special instructions"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="photographer">Select Photographer</Label>
              <Select 
                onValueChange={(value) => {
                  const photographer = photographers.find(p => p.id === value);
                  if (photographer) {
                    setSelectedPhotographer({
                      id: photographer.id,
                      name: photographer.name,
                    });
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a photographer" />
                </SelectTrigger>
                <SelectContent>
                  {photographers.map((photographer) => (
                    <SelectItem key={photographer.id} value={photographer.id}>
                      {photographer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Submitting...' : 'Book Photoshoot'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookShoot;
