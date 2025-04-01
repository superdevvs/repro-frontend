
import { ServiceType, PackageType } from '@/types/services';
import { v4 as uuidv4 } from 'uuid';

// Individual services
export const availableServices: ServiceType[] = [
  { id: uuidv4(), name: 'HDR Photos', price: 150, category: 'Photos' },
  { id: uuidv4(), name: '25 HDR Photo + Walkthough Video', price: 250, category: 'Video' },
  { id: uuidv4(), name: 'Just Drone Photos Package', price: 180, category: 'Drone' },
  { id: uuidv4(), name: '2D Floor plans', price: 100, category: 'Floor Plans' },
  { id: uuidv4(), name: 'HDR Photos + Video', price: 275, category: 'Video' },
  { id: uuidv4(), name: '10 Exterior HDR Photos', price: 120, category: 'Photos' },
  { id: uuidv4(), name: 'HDR Photo + iGuide', price: 225, category: 'Tours' },
  { id: uuidv4(), name: '35 HDR Photos', price: 200, category: 'Photos' },
  { id: uuidv4(), name: '25 HDR Photos', price: 175, category: 'Photos' },
  { id: uuidv4(), name: 'Digital Dusk/Twilight', price: 125, category: 'Photos' },
  { id: uuidv4(), name: '30 HDR Photos + 2D Floor Plans*', price: 275, category: 'Floor Plans' },
  { id: uuidv4(), name: 'HDR Photo + Video + iGuide', price: 350, category: 'Tours' },
  { id: uuidv4(), name: '3 Twilight Photos', price: 150, category: 'Photos' },
  { id: uuidv4(), name: '15 HDR -Rental Listings only', price: 130, category: 'Photos' },
  { id: uuidv4(), name: '25 Flash Photos', price: 175, category: 'Photos' },
  { id: uuidv4(), name: '5 Flash Photos', price: 100, category: 'Photos' },
  { id: uuidv4(), name: '45 HDR Photos', price: 225, category: 'Photos' },
  { id: uuidv4(), name: 'Drone Boundary Lines -Photos', price: 200, category: 'Drone' },
  { id: uuidv4(), name: 'On site Cancellation/Reschedule Fee', price: 75, category: 'Add-ons' },
  { id: uuidv4(), name: 'Virtual staging(price is per image)', price: 50, category: 'Add-ons' },
  { id: uuidv4(), name: 'Add on - 10 HDR Photos', price: 50, category: 'Add-ons' },
  { id: uuidv4(), name: 'Silver Drone Package', price: 150, category: 'Drone' },
  { id: uuidv4(), name: 'Travel Fee 60 miles', price: 40, category: 'Add-ons' },
  { id: uuidv4(), name: 'Travel fee 120 Miles', price: 80, category: 'Add-ons' },
  { id: uuidv4(), name: '2 Minute Bio Video & Head shots shoot', price: 300, category: 'Video' }
];

// Pre-defined packages
export const availablePackages: PackageType[] = [
  { 
    id: '1', 
    name: 'Basic', 
    description: 'Photos only', 
    price: 150,
    services: ['HDR Photos'],
    featured: true
  },
  { 
    id: '2', 
    name: 'Standard', 
    description: 'Photos + Floor Plans', 
    price: 250,
    services: ['HDR Photos', '2D Floor plans'],
    featured: true
  },
  { 
    id: '3', 
    name: 'Premium', 
    description: 'Photos + Video + Floor Plans', 
    price: 350,
    services: ['HDR Photos', 'HDR Photos + Video', '2D Floor plans'],
    featured: true
  },
  { 
    id: '4', 
    name: 'Luxury', 
    description: 'Photos + Video + 3D Tour + Floor Plans', 
    price: 500,
    services: ['HDR Photos', 'HDR Photos + Video', 'HDR Photo + iGuide', '2D Floor plans'],
    featured: true
  },
];

// Helper functions
export const getServicesList = () => {
  return availableServices;
};

export const getServicesById = (ids: string[]) => {
  return availableServices.filter(service => ids.includes(service.id));
};

export const getServiceCategories = () => {
  const categories: Record<string, ServiceType[]> = {};
  
  availableServices.forEach(service => {
    if (!categories[service.category]) {
      categories[service.category] = [];
    }
    categories[service.category].push(service);
  });
  
  return categories;
};

export const getPackagesList = () => {
  return availablePackages;
};

// Function to save services and packages to localStorage
export const saveServices = (services: ServiceType[]) => {
  localStorage.setItem('availableServices', JSON.stringify(services));
};

export const savePackages = (packages: PackageType[]) => {
  localStorage.setItem('availablePackages', JSON.stringify(packages));
};

// Function to load services and packages from localStorage
export const loadServices = (): ServiceType[] => {
  const savedServices = localStorage.getItem('availableServices');
  return savedServices ? JSON.parse(savedServices) : availableServices;
};

export const loadPackages = (): PackageType[] => {
  const savedPackages = localStorage.getItem('availablePackages');
  return savedPackages ? JSON.parse(savedPackages) : availablePackages;
};
