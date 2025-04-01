
export interface ServiceType {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
}

export interface PackageType {
  id: string;
  name: string;
  description: string;
  price: number;
  services: string[]; // Array of service IDs included in the package
  featured?: boolean;
}
