
export const availableServices = [
  'HDR Photos',
  '25 HDR Photo + Walkthough Video',
  'Just Drone Photos Package',
  '2D Floor plans',
  'HDR Photos + Video',
  '10 Exterior HDR Photos',
  'HDR Photo + iGuide',
  '35 HDR Photos',
  '25 HDR Photos',
  'Digital Dusk/Twilight',
  '30 HDR Photos + 2D Floor Plans*',
  'HDR Photo + Video + iGuide',
  '3 Twilight Photos',
  '15 HDR -Rental Listings only',
  '25 Flash Photos',
  '5 Flash Photos',
  '45 HDR Photos',
  'Drone Boundary Lines -Photos',
  'On site Cancellation/Reschedule Fee',
  'Virtual staging(price is per image)',
  'Add on - 10 HDR Photos',
  'Silver Drone Package',
  'Travel Fee 60 miles',
  'Travel fee 120 Miles',
  '2 Minute Bio Video & Head shots shoot'
];

export const getServicesList = () => {
  return availableServices;
};

export const getServiceCategories = () => {
  const categories = {
    'Photos': [
      'HDR Photos',
      '25 HDR Photos',
      '35 HDR Photos',
      '45 HDR Photos',
      '25 Flash Photos',
      '5 Flash Photos',
      '10 Exterior HDR Photos',
      '15 HDR -Rental Listings only',
      'Digital Dusk/Twilight',
      '3 Twilight Photos',
    ],
    'Video': [
      'HDR Photos + Video',
      '25 HDR Photo + Walkthough Video',
      'HDR Photo + Video + iGuide',
      '2 Minute Bio Video & Head shots shoot'
    ],
    'Drone': [
      'Just Drone Photos Package',
      'Silver Drone Package',
      'Drone Boundary Lines -Photos',
    ],
    'Floor Plans': [
      '2D Floor plans',
      '30 HDR Photos + 2D Floor Plans*',
    ],
    'Tours': [
      'HDR Photo + iGuide',
      'HDR Photo + Video + iGuide',
    ],
    'Add-ons': [
      'Virtual staging(price is per image)',
      'Add on - 10 HDR Photos',
      'Travel Fee 60 miles',
      'Travel fee 120 Miles',
      'On site Cancellation/Reschedule Fee',
    ],
  };

  return categories;
};
