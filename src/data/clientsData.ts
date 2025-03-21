
import { Client } from '@/types/clients';

// Initial clients data
export const initialClientsData: Client[] = [
  {
    id: '1',
    name: 'Jane Smith',
    company: 'XYZ Realty',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    address: '456 Park Avenue, Somewhere, VA 23456',
    status: 'active',
    shootsCount: 45,
    lastActivity: '2023-05-16',
  },
  {
    id: '2',
    name: 'Robert Wilson',
    company: 'Wilson Realty',
    email: 'robert.wilson@example.com',
    phone: '(555) 234-5678',
    address: '789 Ocean Drive, Beachtown, DC 34567',
    status: 'active',
    shootsCount: 12,
    lastActivity: '2023-05-14',
  },
  {
    id: '3',
    name: 'Emily Davis',
    company: 'Davis Properties',
    email: 'emily.davis@example.com',
    phone: '(555) 345-6789',
    address: '101 River Road, Riverside, MD 45678',
    status: 'inactive',
    shootsCount: 23,
    lastActivity: '2023-05-05',
  },
  {
    id: '4',
    name: 'Michael Johnson',
    company: 'Johnson & Associates',
    email: 'michael.johnson@example.com',
    phone: '(555) 456-7890',
    address: '202 Mountain View, Heights, VA 56789',
    status: 'active',
    shootsCount: 18,
    lastActivity: '2023-05-12',
  },
];
