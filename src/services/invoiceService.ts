import API_ROUTES from '@/lib/api';

export const fetchInvoiceCsvBlob = async (invoiceId: string | number): Promise<Blob> => {
  const downloadEndpoint = API_ROUTES?.invoices?.adminDownload?.(invoiceId);

  if (!downloadEndpoint) {
    throw new Error('Invoice download endpoint is not configured.');
  }

  const response = await fetch(downloadEndpoint, {
    method: 'GET',
    headers: {
      Accept: 'text/csv',
    },
  });

  if (!response.ok) {
    let errorMessage = `Failed to download invoice ${invoiceId}.`;

    try {
      const errorBody = await response.text();
      if (errorBody) {
        errorMessage = errorBody;
      }
    } catch (error) {
      console.error('Unable to read invoice download error response', error);
    }

    throw new Error(errorMessage);
  }

  return await response.blob();
};
