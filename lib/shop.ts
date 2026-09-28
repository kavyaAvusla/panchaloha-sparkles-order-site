// Demo shop details for the one-page order site.
// DEMO DATA: the shop, address and hours are illustrative.
export const SHOP = {
  name: 'Panchaloha Sparkles Jewellery',
  categories: [
    'Panchloham',
    'One-gram gold',
    'Imitation',
    'GJ',
    'Gold covering',
    'Beads',
  ],
  // Curated "new this week" strip, by exact item name. The price shown comes
  // from the items table, so a price lives in exactly one place.
  newArrivals: [
    'Antique Jhumka (pair)',
    'Kundan Choker Set',
    'Pearl Bangles (set of 6)',
    'Oxidised Necklace',
    'AD Stone Earrings',
    'Bridal Combo Set',
    'Everyday Studs',
    'Maang Tikka',
  ],
  owner: 'Sravanthi',
  hours: 'Mon–Sat 10:00 AM – 8:00 PM · Sun 10:00 AM – 2:00 PM',
  phone: '9398616024',
  phoneDisplay: '+91 93986 16024',
  // WhatsApp needs the country code (India = 91).
  whatsapp: '919398616024',
  address: 'Main Road, Narayanakhed, Telangana 502286',
  mapUrl: 'https://maps.google.com/?q=Main+Road%2C+Narayanakhed%2C+Telangana+502286',
  maker: 'ConnectUs AI Agency',
} as const;
