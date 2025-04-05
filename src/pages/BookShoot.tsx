import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/components/auth/AuthProvider';
import { useShoots } from '@/context/ShootsContext';
import { Photographer } from '@/components/photographers/usePhotographersData';
import { TimeSelect } from "@/components/ui/time-select";
import { v4 as uuidv4 } from 'uuid';
import { ShootData } from '@/types/shoots';

interface FormData {
  date: string;
  time: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCompany: string;
  serviceType: string;
  photographerId: string;
}

export function BookShoot() {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [serviceType, setServiceType] = useState("Photography");
  const [fee, setFee] = useState(200);
  const [taxRate, setTaxRate] = useState(6);
  const [taxAmount, setTaxAmount] = useState(fee * (taxRate / 100));
  const [totalWithTax, setTotalWithTax] = useState(fee + taxAmount);
  const [selectedPhotographer, setSelectedPhotographer] = useState<Photographer | null>(null);
  const [isPhotographerAvailable, setIsPhotographerAvailable] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { addShoot } = useShoots();
  const [photographers, setPhotographers] = useState<Photographer[]>([]);

  useEffect(() => {
    // Mock photographer data
    const mockPhotographers: Photographer[] = [
      {
        id: "1",
        name: "David Smith",
        email: "david@example.com",
        phone: "(555) 123-4567",
        address: "123 Main St, New York, NY 10001",
        avatar: "/assets/avatar/photographer1.jpg",
        bio: "Professional photographer with 10+ years of experience in architectural and real estate photography.",
        rating: 4.8,
        specialty: ["Real Estate", "Architecture", "Interior"],
        availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        completedShoots: 357,
        upcomingShoots: 5
      },
      {
        id: "2",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        phone: "(555) 987-6543",
        address: "456 Oak Ave, Los Angeles, CA 90001",
        avatar: "/assets/avatar/photographer2.jpg",
        bio: "Specializing in luxury real estate photography and videography. Drone certified.",
        rating: 4.9,
        specialty: ["Luxury Estates", "Drone Photography", "Twilight Shots"],
        availability: ["Monday", "Wednesday", "Friday", "Saturday"],
        completedShoots: 215,
        upcomingShoots: 3
      }
    ];

    setPhotographers(mockPhotographers);
  }, []);

  useEffect(() => {
    const newTaxAmount = fee * (taxRate / 100);
    setTaxAmount(newTaxAmount);
    setTotalWithTax(fee + newTaxAmount);
  }, [fee, taxRate]);

  const handleBookShoot = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Check photographer availability
      if (selectedPhotographer) {
        // Mock availability check
        const isAvailable = Math.random() < 0.8; // 80% chance of being available
        setIsPhotographerAvailable(isAvailable);

        if (!isAvailable) {
          toast({
            title: "Photographer Not Available",
            description: "The selected photographer is not available on this date and time.",
            variant: "destructive",
          });
          return;
        }
      }
      
      // Create shoot object
      const newShoot: ShootData = {
        id: uuidv4(),
        scheduledDate: data.date,
        time: data.time,
        status: 'booked' as const,  // Use 'as const' to ensure proper typing
        location: {
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          fullAddress: `${data.address}, ${data.city}, ${data.state} ${data.zipCode}`
        },
        client: {
          name: data.clientName,
          email: data.clientEmail,
          phone: data.clientPhone,
          company: data.clientCompany
        },
        photographer: selectedPhotographer ? {
          id: selectedPhotographer.id,
          name: selectedPhotographer.name,
          avatar: selectedPhotographer.avatar
        } : {
          name: "To be assigned",
        },
        payment: {
          baseQuote: fee,
          taxRate: taxRate,
          taxAmount: taxAmount,
          totalQuote: totalWithTax,
          totalPaid: 0
        },
        services: [data.serviceType],
        createdBy: user?.id || "guest",
        media: {
          photos: []
        }
      };
      
      addShoot(newShoot);

      toast({
        title: "Shoot Booked Successfully",
        description: `A shoot has been booked for ${data.date} at ${data.time}.`,
      });

      router.push('/Dashboard');
    } catch (error) {
      console.error("Error booking shoot:", error);
      toast({
        title: "Error Booking Shoot",
        description: "There was an error booking the shoot. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Book a Shoot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData: FormData = {
                date: format(date || new Date(), 'yyyy-MM-dd'),
                time: time,
                address: address,
                city: city,
                state: state,
                zipCode: zipCode,
                clientName: clientName,
                clientEmail: clientEmail,
                clientPhone: clientPhone,
                clientCompany: clientCompany,
                serviceType: serviceType,
                photographerId: selectedPhotographer?.id || ""
              };
              handleBookShoot(formData);
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      {date ? format(date, "PPP") : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) =>
                        date < new Date() || date > addDays(new Date(), 365)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <TimeSelect
                  value={time}
                  onChange={setTime}
                  placeholder="Select a time"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  type="text"
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  type="text"
                  id="zipCode"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                type="text"
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                type="email"
                id="clientEmail"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="clientPhone">Client Phone</Label>
              <Input
                type="tel"
                id="clientPhone"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="clientCompany">Client Company</Label>
              <Input
                type="text"
                id="clientCompany"
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="serviceType">Service Type</Label>
              <Select onValueChange={setServiceType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Photography">Photography</SelectItem>
                  <SelectItem value="Videography">Videography</SelectItem>
                  <SelectItem value="Drone Services">Drone Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fee">Fee</Label>
              <Input
                type="number"
                id="fee"
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                type="number"
                id="taxRate"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="totalWithTax">Total (with Tax)</Label>
              <Input
                type="text"
                id="totalWithTax"
                value={totalWithTax.toFixed(2)}
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="photographer">Photographer</Label>
              <Select onValueChange={(value) => {
                const photographer = photographers.find(p => p.id === value);
                setSelectedPhotographer(photographer || null);
              }}>
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Book Shoot"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
