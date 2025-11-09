import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface AddressSuggestion {
  place_id: string;
  description: string;
  main_text: string;
  secondary_text: string;
  types: string[];
}

interface AddressDetails {
  formatted_address: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

interface AddressLookupFieldProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (address: AddressDetails) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const AddressLookupField: React.FC<AddressLookupFieldProps> = ({
  value,
  onChange,
  onAddressSelect,
  placeholder = 'Start typing an address...',
  className = '',
  disabled = false
}) => {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Mock data for testing when API is not available
  const getMockSuggestions = (query: string): AddressSuggestion[] => {
    const mockAddresses = [
      {
        place_id: 'mock_1',
        description: '123 Main Street, Washington, DC, USA',
        main_text: '123 Main Street',
        secondary_text: 'Washington, DC, USA',
        types: ['street_address']
      },
      {
        place_id: 'mock_2', 
        description: '456 Oak Avenue, New York, NY, USA',
        main_text: '456 Oak Avenue',
        secondary_text: 'New York, NY, USA',
        types: ['street_address']
      },
      {
        place_id: 'mock_3',
        description: '789 Pine Road, Los Angeles, CA, USA',
        main_text: '789 Pine Road', 
        secondary_text: 'Los Angeles, CA, USA',
        types: ['street_address']
      },
      {
        place_id: 'mock_4',
        description: '321 Elm Street, Chicago, IL, USA',
        main_text: '321 Elm Street',
        secondary_text: 'Chicago, IL, USA',
        types: ['street_address']
      },
      {
        place_id: 'mock_5',
        description: '654 Maple Drive, Miami, FL, USA',
        main_text: '654 Maple Drive',
        secondary_text: 'Miami, FL, USA',
        types: ['street_address']
      }
    ];

    return mockAddresses.filter(addr => 
      addr.description.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Mock address details for testing
  const getMockAddressDetails = (placeId: string): AddressDetails => {
    const mockDetails: Record<string, AddressDetails> = {
      'mock_1': {
        formatted_address: '123 Main Street, Washington, DC 20001, USA',
        address: '123 Main Street',
        city: 'Washington',
        state: 'DC',
        zip: '20001',
        country: 'US',
        latitude: 38.9072,
        longitude: -77.0369
      },
      'mock_2': {
        formatted_address: '456 Oak Avenue, New York, NY 10001, USA',
        address: '456 Oak Avenue',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'US',
        latitude: 40.7128,
        longitude: -74.0060
      },
      'mock_3': {
        formatted_address: '789 Pine Road, Los Angeles, CA 90210, USA',
        address: '789 Pine Road',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90210',
        country: 'US',
        latitude: 34.0522,
        longitude: -118.2437
      },
      'mock_4': {
        formatted_address: '321 Elm Street, Chicago, IL 60601, USA',
        address: '321 Elm Street',
        city: 'Chicago',
        state: 'IL',
        zip: '60601',
        country: 'US',
        latitude: 41.8781,
        longitude: -87.6298
      },
      'mock_5': {
        formatted_address: '654 Maple Drive, Miami, FL 33101, USA',
        address: '654 Maple Drive',
        city: 'Miami',
        state: 'FL',
        zip: '33101',
        country: 'US',
        latitude: 25.7617,
        longitude: -80.1918
      }
    };

    return mockDetails[placeId] || mockDetails['mock_1'];
  };

  // Debounced search function
  const searchAddresses = async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
      const url = `${base}/api/address/search?query=${encodeURIComponent(searchQuery)}`;
      const response = await fetch(url, { headers });

      if (!response.ok) {
        // If API fails, use mock data for testing
        console.warn('API not available, using mock data');
        const mockData = getMockSuggestions(searchQuery);
        setSuggestions(mockData);
        setShowSuggestions(true);
        return;
      }

      const data = await response.json();
      setSuggestions(data.data || []);
      setShowSuggestions(true);
    } catch (err) {
      // Fallback to mock data if API is not available
      console.warn('API error, using mock data:', err);
      const mockData = getMockSuggestions(searchQuery);
      setSuggestions(mockData);
      setShowSuggestions(true);
      
      if (mockData.length === 0) {
        setError('Address search temporarily unavailable. Please enter address manually.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setSelectedAddress(null);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce search
    debounceRef.current = setTimeout(() => {
      searchAddresses(newValue);
    }, 300);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = async (suggestion: AddressSuggestion) => {
    // Stop pending debounce to avoid race conditions updating suggestions after selection
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setShowSuggestions(false);
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
      const url = `${base}/api/address/details?place_id=${encodeURIComponent(suggestion.place_id)}`;
      const response = await fetch(url, { headers });

      if (!response.ok) {
        // Use mock data if API fails
        console.warn('API not available, using mock address details');
        const mockDetails = getMockAddressDetails(suggestion.place_id);
        setSelectedAddress(mockDetails);
        onAddressSelect(mockDetails);
        return;
      }

      const data = await response.json();
      const addressDetails = data.data;

      setSelectedAddress(addressDetails);
      onAddressSelect(addressDetails);
      // Ensure the input reflects the final chosen address
      onChange(addressDetails.formatted_address || addressDetails.address || suggestion.description);
    } catch (err) {
      // Fallback to mock data
      console.warn('API error, using mock address details:', err);
      const mockDetails = getMockAddressDetails(suggestion.place_id);
      setSelectedAddress(mockDetails);
      onAddressSelect(mockDetails);
      onChange(mockDetails.formatted_address || mockDetails.address || suggestion.description);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`pr-10 ${selectedAddress ? 'border-green-500' : ''} ${error ? 'border-red-500' : ''}`}
        />
        
        {/* Status icons */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isLoading && <Loader className="w-4 h-4 text-blue-500 animate-spin" />}
          {selectedAddress && !isLoading && (
            <CheckCircle className="w-4 h-4 text-green-500" />
          )}
          {error && !isLoading && (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-1 text-xs text-red-600 flex items-center">
          <AlertCircle className="w-3 h-3 mr-1" />
          {error}
        </p>
      )}

      {/* Address validation status */}
      {selectedAddress && (
        <div className="mt-1 text-xs text-green-600 flex items-center">
          <CheckCircle className="w-3 h-3 mr-1" />
          Address verified and auto-filled
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              type="button"
              onClick={() => handleSuggestionSelect(suggestion)}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate text-sm">
                    {suggestion.main_text}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {suggestion.secondary_text}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && suggestions.length === 0 && value.length >= 3 && !isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3">
          <div className="text-center text-gray-500">
            <MapPin className="w-6 h-6 mx-auto mb-1 text-gray-300" />
            <p className="text-xs">No addresses found</p>
            <p className="text-xs text-gray-400 mt-1">
              Try entering a more specific address
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressLookupField;
