import React from 'react';
import AddressLookupDemo from '../components/AddressLookupDemo';

const AddressLookupTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Address Lookup Testing
          </h1>
          <p className="text-gray-600">
            Test the address lookup functionality without authentication
          </p>
        </div>
        
        <AddressLookupDemo />
        
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Testing Instructions</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mr-3 mt-0.5">1</span>
                <p>Start typing an address in the search box above</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mr-3 mt-0.5">2</span>
                <p>Select an address from the dropdown suggestions</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mr-3 mt-0.5">3</span>
                <p>View the parsed address details and service area status</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mr-3 mt-0.5">4</span>
                <p>If in service area, you can proceed with booking</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">Note:</h3>
              <p className="text-sm text-yellow-700">
                This demo currently works without Google Places API key by using mock data. 
                To enable full functionality, configure your Google Places API key in the backend.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressLookupTest;