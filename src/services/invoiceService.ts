import axios, { AxiosRequestConfig } from 'axios';
import { InvoiceData } from '@/utils/invoiceUtils';

export interface InvoiceListParams {
  page?: number;
  per_page?: number;
  with_items?: boolean;
  role?: string;
  status?: string;
  user_id?: string | number;
  [key: string]: unknown;
}

export interface InvoicePaginationLinks {
  first?: string | null;
  last?: string | null;
  prev?: string | null;
  next?: string | null;
  [key: string]: unknown;
}

export interface InvoicePaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from?: number | null;
  to?: number | null;
  path?: string;
  links?: Array<{ url: string | null; label: string; active: boolean }>;
  [key: string]: unknown;
}

export interface InvoicePaginator<T = InvoiceData> {
  data: T[];
  links?: InvoicePaginationLinks;
  meta?: InvoicePaginationMeta;
  [key: string]: unknown;
}

const resolveInvoicesEndpoint = () => {
  const baseUrl = import.meta.env.VITE_API_URL;
  return baseUrl ? `${baseUrl}/api/admin/invoices` : '/api/admin/invoices';
};

export async function fetchInvoices<T = InvoiceData>(
  params: InvoiceListParams = {},
  config?: AxiosRequestConfig
): Promise<InvoicePaginator<T>> {
  const url = resolveInvoicesEndpoint();

  const response = await axios.get<InvoicePaginator<T>>(url, {
    params,
    ...config,
  });

  return response.data;
}

export default {
  fetchInvoices,
};
