
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarIcon, CameraIcon, CheckCircleIcon, ClockIcon, HeartIcon, HomeIcon, UserIcon } from 'lucide-react';

// Mock data
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
  // Form state
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
  
  // Current step
  const [step, setStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  
  // Calculate total price
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
    return Math.round(subtotal * 0.06); // 6% tax rate
  };
  
  const getTotal = () => {
    return getPackagePrice() + getPhotographerRate() + getTax();
  };
  
  // Handle form submission
  const handleSubmit = () => {
    setIsComplete(true);
    
    // In a real app, you would send the data to the server here
    console.log({
      client,
      address,
      city,
      state,
      zip,
      date,
      time,
      photographer,
      selectedPackage,
      notes,
      bypassPayment,
      sendNotification,
      total: getTotal(),
    });
  };
  
  // Reset form
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
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
            New Booking
          </Badge>
          <h1 className="text-3xl font-bold">Book a Shoot</h1>
          <p className="text-muted-foreground">
            Schedule a new photography session for a property.
          </p>
        </div>
        
        {/* Booking form */}
        <AnimatePresence mode="wait">
          {isComplete ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-12 text-center max-w-md mx-auto"
            >
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <CheckCircleIcon className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Booking Complete!</h2>
              <p className="text-muted-foreground mb-6">
                The shoot has been successfully scheduled for {date ? format(date, 'MMMM d, yyyy') : ''} at {time}.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={resetForm} variant="outline">Book Another Shoot</Button>
                <Button onClick={() => window.location.href = '/shoots'}>View All Shoots</Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                      1
                    </div>
                    <Separator className="flex-1" />
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                      2
                    </div>
                    <Separator className="flex-1" />
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                      3
                    </div>
                  </div>
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
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="client">Select Client</Label>
                            <Select value={client} onValueChange={setClient}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a client" />
                              </SelectTrigger>
                              <SelectContent>
                                {clients.map((c) => (
                                  <SelectItem key={c.id} value={c.id}>
                                    {c.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="address">Property Address</Label>
                            <Input
                              id="address"
                              placeholder="Street address"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="city">City</Label>
                              <Input
                                id="city"
                                placeholder="City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="state">State</Label>
                              <Select value={state} onValueChange={setState}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="MD">Maryland</SelectItem>
                                  <SelectItem value="VA">Virginia</SelectItem>
                                  <SelectItem value="DC">Washington DC</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="zip">ZIP Code</Label>
                            <Input
                              id="zip"
                              placeholder="ZIP Code"
                              value={zip}
                              onChange={(e) => setZip(e.target.value)}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Select Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={date}
                                  onSelect={setDate}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          
                          <div>
                            <Label htmlFor="time">Select Time</Label>
                            <Select value={time} onValueChange={setTime}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a time" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                                <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                                <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                                <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                                <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                                <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                                <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                                <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Label>Select Photographer</Label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                            {photographers.map((p) => (
                              <Card
                                key={p.id}
                                className={`cursor-pointer transition-all ${
                                  photographer === p.id 
                                    ? 'border-primary/50 bg-primary/5' 
                                    : p.availability 
                                      ? 'hover:border-primary/30 hover:bg-primary/5' 
                                      : 'opacity-60 cursor-not-allowed'
                                }`}
                                onClick={() => p.availability && setPhotographer(p.id)}
                              >
                                <CardContent className="p-4 flex items-center gap-3">
                                  <div className="relative">
                                    <img
                                      src={p.avatar}
                                      alt={p.name}
                                      className="w-12 h-12 rounded-full object-cover"
                                    />
                                    {photographer === p.id && (
                                      <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                        <CheckCircleIcon className="h-4 w-4 text-white" />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{p.name}</p>
                                    <p className="text-xs text-muted-foreground">${p.rate}/shoot</p>
                                    {!p.availability && (
                                      <Badge variant="outline" className="mt-1 text-[10px]">Unavailable</Badge>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label>Select Package</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                            {packages.map((pkg) => (
                              <Card
                                key={pkg.id}
                                className={`cursor-pointer transition-all ${
                                  selectedPackage === pkg.id 
                                    ? 'border-primary/50 bg-primary/5' 
                                    : 'hover:border-primary/30 hover:bg-primary/5'
                                }`}
                                onClick={() => setSelectedPackage(pkg.id)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium">{pkg.name}</p>
                                      <p className="text-sm text-muted-foreground">{pkg.description}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold">${pkg.price}</p>
                                      {selectedPackage === pkg.id && (
                                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center ml-auto">
                                          <CheckCircleIcon className="h-4 w-4 text-white" />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="notes">Additional Notes</Label>
                          <Textarea
                            id="notes"
                            placeholder="Enter any special instructions or requirements..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="h-24"
                          />
                        </div>
                      </motion.div>
                    )}
                    
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <UserIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                  <h3 className="font-medium">Client</h3>
                                  <p className="text-muted-foreground">
                                    {clients.find(c => c.id === client)?.name || 'Not selected'}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-3">
                                <HomeIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                  <h3 className="font-medium">Property</h3>
                                  <p className="text-muted-foreground">
                                    {address ? `${address}, ${city}, ${state} ${zip}` : 'Not provided'}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-3">
                                <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                  <h3 className="font-medium">Date & Time</h3>
                                  <p className="text-muted-foreground">
                                    {date ? format(date, 'MMMM d, yyyy') : 'Not selected'} {time ? `at ${time}` : ''}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <CameraIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                  <h3 className="font-medium">Photographer</h3>
                                  <p className="text-muted-foreground">
                                    {photographers.find(p => p.id === photographer)?.name || 'Not selected'}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-3">
                                <HeartIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                  <h3 className="font-medium">Package</h3>
                                  <p className="text-muted-foreground">
                                    {packages.find(p => p.id === selectedPackage)?.name || 'Not selected'} - 
                                    {packages.find(p => p.id === selectedPackage)?.description || ''}
                                  </p>
                                </div>
                              </div>
                              
                              {notes && (
                                <div className="flex items-start gap-3">
                                  <ClockIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                                  <div>
                                    <h3 className="font-medium">Notes</h3>
                                    <p className="text-muted-foreground">{notes}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Package</span>
                              <span>${getPackagePrice()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Photographer Fee</span>
                              <span>${getPhotographerRate()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Tax ({state === 'MD' ? '6%' : state === 'VA' ? '5.3%' : '6%'})</span>
                              <span>${getTax()}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                              <span className="font-medium">Total</span>
                              <span className="font-bold">${getTotal()}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-4 pt-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="bypass-payment">Bypass Payment</Label>
                                <p className="text-xs text-muted-foreground">Allow access before payment is received</p>
                              </div>
                              <Switch
                                id="bypass-payment"
                                checked={bypassPayment}
                                onCheckedChange={setBypassPayment}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="send-notification">Send Notifications</Label>
                                <p className="text-xs text-muted-foreground">Notify photographer and client via email/SMS</p>
                              </div>
                              <Switch
                                id="send-notification"
                                checked={sendNotification}
                                onCheckedChange={setSendNotification}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
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
                    onClick={() => {
                      if (step < 3) {
                        setStep(step + 1);
                      } else {
                        handleSubmit();
                      }
                    }}
                  >
                    {step === 3 ? 'Confirm Booking' : 'Next'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default BookShoot;
