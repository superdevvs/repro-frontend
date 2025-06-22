// src/api/api.ts

const BASE_URL = import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_URL}/api`;

export const API_ROUTES = {
  services: {
    all: `${BASE_URL}/services`,
    create: `${BASE_URL}/admin/services`,
    show: (id: number | string) => `${BASE_URL}/services/${id}`,
    update: (id: number | string) => `${BASE_URL}/services/${id}`,
    delete: (id: number | string) => `${BASE_URL}/services/${id}`,
  },
  
  // Add more groups as needed, for example:
  // users: {
  //   login: `${BASE_URL}/login`,
  //   profile: `${BASE_URL}/profile`,
  // }

};

export default API_ROUTES;
