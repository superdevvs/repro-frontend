// src/api/api.ts

const BASE_URL = import.meta.env.VITE_API_URL;

export const API_ROUTES = {
  services: {
    all: `${BASE_URL}/api/services`,
    create: `${BASE_URL}/api/admin/services`,
    show: (id: number | string) => `${BASE_URL}/api/services/${id}`,
    update: (id: number | string) => `${BASE_URL}/api/admin/services/${id}`,
    delete: (id: number | string) => `${BASE_URL}/api/admin/services/${id}`,
  },
  clients: {
    adminList: `${BASE_URL}/api/admin/clients`,
    create: `${BASE_URL}/api/admin/users`, // create user with role=client
  },
  people: {
    photographers: `${BASE_URL}/api/photographers`,
    adminPhotographers: `${BASE_URL}/api/admin/photographers`,
  },
  photographerAvailability: {
    list: (photographerId: number | string) => `${BASE_URL}/api/photographer/availability/${photographerId}`,
    create: `${BASE_URL}/api/photographer/availability`,
    bulk: `${BASE_URL}/api/photographer/availability/bulk`,
    update: (id: number | string) => `${BASE_URL}/api/photographer/availability/${id}`,
    delete: (id: number | string) => `${BASE_URL}/api/photographer/availability/${id}`,
    clear: (photographerId: number | string) => `${BASE_URL}/api/photographer/availability/clear/${photographerId}`,
    check: `${BASE_URL}/api/photographer/availability/check`,
    availablePhotographers: `${BASE_URL}/api/photographer/availability/available-photographers`,
  },
  
  // Add more groups as needed, for example:
  // users: {
  //   login: `${BASE_URL}/login`,
  //   profile: `${BASE_URL}/profile`,
  // }

};

export default API_ROUTES;
