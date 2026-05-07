'use client';

export const INITIAL_CROPS = [
  { id: 1, name: 'Paddy / நெல்', season: 'Samba', seeds: 'Available', fertilizer: 'Available', price: '₹2200/quintal' },
  { id: 2, name: 'Groundnut / நிலக்கடலை', season: 'Thai Pattam', seeds: 'Out of Stock', fertilizer: 'Available', price: '₹6000/quintal' },
  { id: 3, name: 'Sugarcane / கரும்பு', season: 'Annual', seeds: 'Available', fertilizer: 'Limited', price: '₹2850/ton' },
];

export const INITIAL_COMPLAINTS = [
  { id: 1, user: 'Arun Kumar', category: 'Water', description: 'Low pressure in Main Tank A-12.', status: 'Pending', date: '01/04/2026', email: 'arun@example.com', reply: '' },
  { id: 2, user: 'Selvi Mani', category: 'Healthcare', description: 'Requesting more doctors for the polio camp.', status: 'In Progress', date: '02/04/2026', email: 'selvi@example.com', reply: '' },
];

export const INITIAL_WATER_TANKS = [
  { id: 1, name: 'Main North Tank', location: 'Section A-12', level: 78, trend: 'up', lastUpdated: '10 mins ago' },
  { id: 2, name: 'West Layout Tank', location: 'Near Temple', level: 45, trend: 'down', lastUpdated: '25 mins ago' },
  { id: 3, name: 'Lake Side Tank', location: 'Lake View', level: 88, trend: 'stable', lastUpdated: '5 mins ago' },
];

export const INITIAL_SCHEMES = [
  { id: 1, name: 'Farmer Crop Insurance', category: 'Agriculture', status: 'Active', deadline: '30/05/2026' },
  { id: 2, name: 'Old Age Pension', category: 'Social', status: 'Active', deadline: 'Ongoing' },
];
