const normalizeUrl = (url: string) => url.replace(/\/$/, '');

const PRIVATE_LAN_HOST_REGEX =
  /^(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})$/;

const envApiPort = import.meta.env?.VITE_API_PORT?.trim();
const DEV_BACKEND_PORT = envApiPort && envApiPort.length > 0 ? envApiPort : '8000';

const resolveDefaultBase = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  const origin = normalizeUrl(window.location.origin);
  const { hostname, protocol } = window.location;

  const isLocalHost =
    !hostname ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    PRIVATE_LAN_HOST_REGEX.test(hostname);

  if (import.meta.env.DEV && isLocalHost) {
    const devBase = `${protocol}//${hostname || 'localhost'}:${DEV_BACKEND_PORT}`;
    return normalizeUrl(devBase);
  }

  return origin;
};

const envBase = import.meta.env?.VITE_API_URL?.trim();

export const API_BASE_URL =
  envBase && envBase.length > 0 ? normalizeUrl(envBase) : resolveDefaultBase();

export const withApiBase = (path: string) =>
  path.startsWith('http')
    ? path
    : `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;

export const OPEN_WEATHER_API_KEY = import.meta.env?.VITE_OPEN_WEATHER_API_KEY;

export const ACCU_WEATHER_API_KEY = import.meta.env?.VITE_ACCU_WEATHER_API_KEY;

export const WEATHER_API_KEY = import.meta.env?.VITE_WEATHER_API_KEY;

// Square Payment Configuration
// These are optional - if not set, the component will fetch from backend
export const SQUARE_APPLICATION_ID =
  import.meta.env?.VITE_SQUARE_APPLICATION_ID?.trim() || '';

export const SQUARE_LOCATION_ID =
  import.meta.env?.VITE_SQUARE_LOCATION_ID?.trim() || '';

