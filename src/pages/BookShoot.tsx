import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShootData } from '@/types/shoots';
import { useShoots } from '@/context/ShootsContext';
import { useToast } from "@/hooks/use-toast";
import { TimeSelect } from '@/components/ui/time-select';

interface Photographer {
  id: string;
  name: string;
  avatar?: string;
}

export function BookShoot() {
  const navigate = useNavigate();
  const { addShoot, getUniquePhotographers } = useShoots();
  const { toast } = useToast();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [basePrice, setBasePrice] = useState<number>(200);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPhotographer, setSelectedPhotographer] = useState<Photographer | null>(null);
  
  const photographers = getUniquePhotographers ? getUniquePhotographers() : [];
  
  const services = [
    "HDR Photography",
    "Drone Photography",
    "3D Virtual Tour",
    "Floor Plans",
    "Video Walkthrough"
  ];

  const handleFormSubmit = (formData) => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select both a date and a time for the shoot.",
        variant: "destructive"
      });
      return;
    }

    const newShoot: ShootData = {
      id: uuid(),
      scheduledDate: selectedDate,
      time: selectedTime,
      status: "booked" as const,
      location: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        fullAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`
      },
      client: {
        name: formData.clientName,
        email: formData.clientEmail,
        phone: formData.clientPhone,
        company: formData.clientCompany
      },
      photographer: selectedPhotographer ? {
        id: selectedPhotographer.id,
        name: selectedPhotographer.name,
        avatar: selectedPhotographer.avatar
      } : undefined,
      payment: {
        baseQuote: basePrice,
        taxRate: 0.08,
        taxAmount: basePrice * 0.08,
        totalQuote: basePrice * 1.08,
        totalPaid: 0
      },
      services: selectedServices,
      notes: {
        shootNotes: formData.notes || "",
      },
      media: {
        photos: [],
        videos: [],
        floorplans: []
      },
      createdBy: "Admin user"
    };

    addShoot(newShoot);
    toast({
      title: "Shoot Booked",
      description: "Your shoot has been successfully booked!",
    });
    navigate('/shoots');
  };

  return (
    <div className="container max-w-3xl py-6">
      <Card>
        <CardHeader>
          <CardTitle>Book a Shoot</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input id="clientName" placeholder="Client Name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="clientEmail">Client Email</Label>
            <Input id="clientEmail" type="email" placeholder="Client Email" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="clientPhone">Client Phone</Label>
            <Input id="clientPhone" type="tel" placeholder="Client Phone" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="clientCompany">Client Company</Label>
            <Input id="clientCompany" placeholder="Client Company" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="Address" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" placeholder="City" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" placeholder="State" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input id="zipCode" placeholder="Zip Code" />
          </div>

          <div className="grid gap-2">
            <Label>Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  {selectedDate ? (
                    format(selectedDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="border-0 rounded-md"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label>Select Time</Label>
            <TimeSelect 
              value={selectedTime}
              onChange={setSelectedTime}
            />
          </div>

          <div className="grid gap-2">
            <Label>Select Photographer</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onChange={(e) => {
                const photographer = photographers.find(p => p.id === e.target.value);
                setSelectedPhotographer(photographer || null);
              }}
            >
              <option value="">Select a photographer</option>
              {photographers.map((photographer) => (
                <option key={photographer.id} value={photographer.id}>
                  {photographer.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label>Select Services</Label>
            <ScrollArea className="h-[120px] w-full rounded-md border">
              {services.map((service) => (
                <div key={service} className="flex items-center space-x-2 p-3">
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
                  <Label htmlFor={service} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {service}
                  </Label>
                </div>
              ))}
            </ScrollArea>
          </div>

          <Separator />

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" placeholder="Additional notes for the shoot" />
          </div>

          <Button onClick={() => {
            const formData = {
              clientName: (document.getElementById('clientName') as HTMLInputElement).value,
              clientEmail: (document.getElementById('clientEmail') as HTMLInputElement).value,
              clientPhone: (document.getElementById('clientPhone') as HTMLInputElement).value,
              clientCompany: (document.getElementById('clientCompany') as HTMLInputElement).value,
              address: (document.getElementById('address') as HTMLInputElement).value,
              city: (document.getElementById('city') as HTMLInputElement).value,
              state: (document.getElementById('state') as HTMLInputElement).value,
              zipCode: (document.getElementById('zipCode') as HTMLInputElement).value,
              notes: (document.getElementById('notes') as HTMLTextAreaElement).value,
            };
            handleFormSubmit(formData);
          }}>
            Book Shoot
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default BookShoot;
