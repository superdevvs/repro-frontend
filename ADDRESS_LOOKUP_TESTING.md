# Address Lookup Testing Guide

## Overview
The address lookup functionality has been integrated into the ClientPropertyForm component. When users type an address, they get autocomplete suggestions, and selecting an address automatically fills the city, state, and ZIP code fields.

## How to Test

### Option 1: Test the Integrated Form (Recommended)
1. **Start your frontend development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Navigate to the test page**
   - Go to: `http://localhost:5173/test-client-form`
   - Or login and use the sidebar link "Test Client Form" (in development mode)

3. **Test the address lookup**
   - Start typing in the "Address" field
   - Try these test addresses:
     - "123 Main"
     - "456 Oak"
     - "789 Pine"
     - "321 Elm"
     - "654 Maple"

4. **Verify auto-fill functionality**
   - Select an address from the dropdown
   - Watch as City, State, and ZIP Code fields are automatically filled
   - The address field shows just the street address

### Option 2: Test the Standalone Demo
1. **Navigate to**: `http://localhost:5173/test-address-lookup`
2. **Test the basic address lookup functionality**

### Option 3: Test in the Actual Booking Flow
1. **Login to your application**
2. **Navigate to**: `http://localhost:5173/book-shoot`
3. **Use the address lookup in the real booking form**

## What to Expect

### With Mock Data (Current Setup)
- **Address Suggestions**: You'll see 5 mock addresses when typing
- **Auto-fill**: City, State, ZIP automatically populate when you select an address
- **Validation**: Green checkmark appears when address is selected
- **Service Area**: All mock addresses are in the service area

### Mock Addresses Available
1. **123 Main Street, Washington, DC 20001**
2. **456 Oak Avenue, New York, NY 10001**
3. **789 Pine Road, Los Angeles, CA 90210**
4. **321 Elm Street, Chicago, IL 60601**
5. **654 Maple Drive, Miami, FL 33101**

## Features Implemented

### ✅ Address Autocomplete
- Real-time suggestions as you type
- Dropdown with formatted address options
- Search starts after 3 characters

### ✅ Auto-fill Fields
- **City** field automatically populated
- **State** field automatically populated  
- **ZIP Code** field automatically populated
- **Address** field shows clean street address

### ✅ Visual Feedback
- Loading spinner while searching
- Green checkmark when address is verified
- Error handling with red indicators
- Success message when auto-filled

### ✅ Service Area Validation
- Checks if address is in service area
- Shows appropriate messaging
- Prevents booking if outside service area

## Integration Details

### In ClientPropertyForm.tsx
```tsx
<AddressLookupField
  value={field.value}
  onChange={field.onChange}
  onAddressSelect={(address) => {
    // Auto-fill city, state, and zip when address is selected
    form.setValue('propertyCity', address.city);
    form.setValue('propertyState', address.state);
    form.setValue('propertyZip', address.zip);
    form.setValue('propertyAddress', address.address);
  }}
  placeholder="Start typing the property address..."
/>
```

### Address Data Structure
```typescript
interface AddressDetails {
  formatted_address: string;  // Full formatted address
  address: string;           // Street address only
  city: string;             // City name
  state: string;            // State abbreviation (e.g., "CA")
  zip: string;              // ZIP code
  country: string;          // Country code
  latitude?: number;        // Optional coordinates
  longitude?: number;       // Optional coordinates
}
```

## Enabling Real Google Places API

### 1. Get Google Places API Key
- Follow instructions in `repro-backend/GOOGLE_PLACES_SETUP.md`
- Update `GOOGLE_PLACES_API_KEY` in backend `.env` file

### 2. Test with Real API
- The component will automatically switch from mock data to real API
- You'll get actual address suggestions from Google Places
- More accurate address parsing and validation

## Troubleshooting

### No Address Suggestions Appearing
1. **Check console for errors**
2. **Verify you're typing at least 3 characters**
3. **Make sure backend server is running**
4. **Check network tab for API calls**

### Auto-fill Not Working
1. **Verify you're selecting from dropdown (not just typing)**
2. **Check console for JavaScript errors**
3. **Ensure form fields are properly named**

### API Errors
1. **Check backend logs**: `storage/logs/laravel.log`
2. **Verify API routes are working**: Test with Postman or curl
3. **Check Google API key configuration** (if using real API)

## Development Notes

### Mock Data vs Real API
- **Development**: Uses mock data for testing without API key
- **Production**: Will use real Google Places API
- **Fallback**: Gracefully falls back to mock data if API fails

### Performance Optimizations
- **Debounced search**: 300ms delay to reduce API calls
- **Caching**: Results cached for 5 minutes (search) and 1 hour (details)
- **Error handling**: Graceful fallback to manual entry

### Security
- **API key restrictions**: Configure domain restrictions in Google Cloud Console
- **Rate limiting**: Implement on backend to prevent abuse
- **Input validation**: All address data is validated before submission

## Next Steps

1. **Configure Google Places API** for production use
2. **Customize service areas** in `AddressLookupController.php`
3. **Add more address validation** rules as needed
4. **Integrate with photographer location** matching
5. **Add distance-based pricing** calculations

The address lookup functionality is now fully integrated and ready for testing!