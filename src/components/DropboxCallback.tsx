// DropboxCallback.tsx - Create this as a separate component/page
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const DropboxCallback: React.FC = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        // Send error message to parent window
        if (window.opener) {
          window.opener.postMessage({
            type: 'DROPBOX_AUTH_ERROR',
            error: error
          }, window.location.origin);
        }
        return;
      }

      if (code) {
        try {
          // Exchange code for access token
          const response = await fetch('/api/auth/dropbox/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code })
          });

          if (!response.ok) {
            throw new Error('Failed to exchange code for token');
          }

          const data = await response.json();
          
          // Send success message to parent window
          if (window.opener) {
            window.opener.postMessage({
              type: 'DROPBOX_AUTH_SUCCESS',
              accessToken: data.access_token
            }, window.location.origin);
          }
        } catch (error) {
          console.error('Token exchange error:', error);
          if (window.opener) {
            window.opener.postMessage({
              type: 'DROPBOX_AUTH_ERROR',
              error: 'Failed to complete authentication'
            }, window.location.origin);
          }
        }
      }
    };

    handleCallback();
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing Dropbox authentication...</p>
      </div>
    </div>
  );
};

export default DropboxCallback;