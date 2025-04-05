import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useShoots } from '@/context/ShootsContext';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, CheckCircle, User, Users2, MapPin, Clock, Check, Loader2 } from 'lucide-react';
import { formatDateSafe } from '@/utils/formatters';
import { TimeSelect } from "@/components/ui/time-select";
import { toast } from 'sonner';

const BookShoot = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string | undefined>('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [photographerId, setPhotographerId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const { addShoot, getUniquePhotographers } = useShoots();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const photographers = getUniquePhotographers();
  
  useEffect(() => {
    if (photographers && photographers.length > 0) {
      setPhotographerId(photographers[0].id);
    }
  }, [photographers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!date || !time || !address || !city || !state || !zip || !clientName || !clientEmail || !photographerId) {
      toast.error("Please fill in all fields.");
      setLoading(false);
      return;
    }
    
    try {
      const newShoot = {
        id: Date.now().toString(),
        scheduledDate: date.toISOString(),
        time: time,
        status: 'scheduled',
        location: {
          address: address,
          city: city,
          state: state,
          zipCode: zip,
          fullAddress: `${address}, ${city}, ${state} ${zip}`,
        },
        client: {
          name: clientName,
          email: clientEmail,
        },
        photographer: {
          id: photographerId,
          name: photographers.find(p => p.id === photographerId)?.name || 'Unknown Photographer',
        },
        notes: {
          shootNotes: notes,
        },
        payment: {
          totalPaid: 0,
          baseQuote: 200,
          taxRate: 0,
          taxAmount: 0,
          totalQuote: 200,
        },
        services: [],
        media: {
          photos: [],
          videos: [],
        },
      };
      
      addShoot(newShoot);
      toast.success("Shoot booked successfully!");
      navigate('/shoots');
    } catch (error) {
      console.error("Error booking shoot:", error);
      toast.error("Failed to book shoot. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Book a Shoot</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={
                        "w-full justify-start text-left font-normal" +
                        (date ? "" : " text-muted-foreground")
                      }
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? formatDateSafe(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start" side="bottom">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) =>
                        date < new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <TimeSelect
                  value={time}
                  onChange={setTime}
                  placeholder="Select time"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="New York"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    type="text"
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="NY"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="zip">Zip Code</Label>
                  <Input
                    type="text"
                    id="zip"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  type="text"
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="clientEmail">Client Email</Label>
                <Input
                  type="email"
                  id="clientEmail"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="john.doe@example.com"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="photographer">Photographer</Label>
              <Select onValueChange={setPhotographerId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a photographer" />
                </SelectTrigger>
                <SelectContent>
                  {photographers && photographers.map((photographer) => (
                    <SelectItem key={photographer.id} value={photographer.id}>
                      <div className="flex items-center gap-2">
                        {photographer.name}
                        {photographerId === photographer.id && (
                          <Check className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes for the shoot"
              />
            </div>
            
            <Button disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Book Shoot
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookShoot;
