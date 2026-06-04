import 'dotenv/config';
import { createDb } from './db';
import { cities } from './schema/tables';

const POPULAR_CITIES = [
  { name: 'London', country: 'United Kingdom', countryCode: 'GB', lat: 51.5074, lng: -0.1278, timezone: 'Europe/London' },
  { name: 'Paris', country: 'France', countryCode: 'FR', lat: 48.8566, lng: 2.3522, timezone: 'Europe/Paris' },
  { name: 'New York', country: 'United States', countryCode: 'US', lat: 40.7128, lng: -74.006, timezone: 'America/New_York' },
  { name: 'Tokyo', country: 'Japan', countryCode: 'JP', lat: 35.6762, lng: 139.6503, timezone: 'Asia/Tokyo' },
  { name: 'Sydney', country: 'Australia', countryCode: 'AU', lat: -33.8688, lng: 151.2093, timezone: 'Australia/Sydney' },
  { name: 'Berlin', country: 'Germany', countryCode: 'DE', lat: 52.52, lng: 13.405, timezone: 'Europe/Berlin' },
  { name: 'Madrid', country: 'Spain', countryCode: 'ES', lat: 40.4168, lng: -3.7038, timezone: 'Europe/Madrid' },
  { name: 'Rome', country: 'Italy', countryCode: 'IT', lat: 41.9028, lng: 12.4964, timezone: 'Europe/Rome' },
  { name: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', lat: 52.3676, lng: 4.9041, timezone: 'Europe/Amsterdam' },
  { name: 'Lisbon', country: 'Portugal', countryCode: 'PT', lat: 38.7223, lng: -9.1393, timezone: 'Europe/Lisbon' },
  { name: 'Dublin', country: 'Ireland', countryCode: 'IE', lat: 53.3498, lng: -6.2603, timezone: 'Europe/Dublin' },
  { name: 'Vienna', country: 'Austria', countryCode: 'AT', lat: 48.2082, lng: 16.3738, timezone: 'Europe/Vienna' },
  { name: 'Brussels', country: 'Belgium', countryCode: 'BE', lat: 50.8503, lng: 4.3517, timezone: 'Europe/Brussels' },
  { name: 'Zurich', country: 'Switzerland', countryCode: 'CH', lat: 47.3769, lng: 8.5417, timezone: 'Europe/Zurich' },
  { name: 'Stockholm', country: 'Sweden', countryCode: 'SE', lat: 59.3293, lng: 18.0686, timezone: 'Europe/Stockholm' },
  { name: 'Oslo', country: 'Norway', countryCode: 'NO', lat: 59.9139, lng: 10.7522, timezone: 'Europe/Oslo' },
  { name: 'Copenhagen', country: 'Denmark', countryCode: 'DK', lat: 55.6761, lng: 12.5683, timezone: 'Europe/Copenhagen' },
  { name: 'Helsinki', country: 'Finland', countryCode: 'FI', lat: 60.1699, lng: 24.9384, timezone: 'Europe/Helsinki' },
  { name: 'Warsaw', country: 'Poland', countryCode: 'PL', lat: 52.2297, lng: 21.0122, timezone: 'Europe/Warsaw' },
  { name: 'Prague', country: 'Czech Republic', countryCode: 'CZ', lat: 50.0755, lng: 14.4378, timezone: 'Europe/Prague' },
  { name: 'Budapest', country: 'Hungary', countryCode: 'HU', lat: 47.4979, lng: 19.0402, timezone: 'Europe/Budapest' },
  { name: 'Athens', country: 'Greece', countryCode: 'GR', lat: 37.9838, lng: 23.7275, timezone: 'Europe/Athens' },
  { name: 'Istanbul', country: 'Turkey', countryCode: 'TR', lat: 41.0082, lng: 28.9784, timezone: 'Europe/Istanbul' },
  { name: 'Moscow', country: 'Russia', countryCode: 'RU', lat: 55.7558, lng: 37.6173, timezone: 'Europe/Moscow' },
  { name: 'Beijing', country: 'China', countryCode: 'CN', lat: 39.9042, lng: 116.4074, timezone: 'Asia/Shanghai' },
  { name: 'Shanghai', country: 'China', countryCode: 'CN', lat: 31.2304, lng: 121.4737, timezone: 'Asia/Shanghai' },
  { name: 'Seoul', country: 'South Korea', countryCode: 'KR', lat: 37.5665, lng: 126.978, timezone: 'Asia/Seoul' },
  { name: 'Singapore', country: 'Singapore', countryCode: 'SG', lat: 1.3521, lng: 103.8198, timezone: 'Asia/Singapore' },
  { name: 'Bangkok', country: 'Thailand', countryCode: 'TH', lat: 13.7563, lng: 100.5018, timezone: 'Asia/Bangkok' },
  { name: 'Mumbai', country: 'India', countryCode: 'IN', lat: 19.076, lng: 72.8777, timezone: 'Asia/Kolkata' },
  { name: 'Delhi', country: 'India', countryCode: 'IN', lat: 28.7041, lng: 77.1025, timezone: 'Asia/Kolkata' },
  { name: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', lat: 25.2048, lng: 55.2708, timezone: 'Asia/Dubai' },
  { name: 'Cairo', country: 'Egypt', countryCode: 'EG', lat: 30.0444, lng: 31.2357, timezone: 'Africa/Cairo' },
  { name: 'Cape Town', country: 'South Africa', countryCode: 'ZA', lat: -33.9249, lng: 18.4241, timezone: 'Africa/Johannesburg' },
  { name: 'Nairobi', country: 'Kenya', countryCode: 'KE', lat: -1.2921, lng: 36.8219, timezone: 'Africa/Nairobi' },
  { name: 'Lagos', country: 'Nigeria', countryCode: 'NG', lat: 6.5244, lng: 3.3792, timezone: 'Africa/Lagos' },
  { name: 'Buenos Aires', country: 'Argentina', countryCode: 'AR', lat: -34.6037, lng: -58.3816, timezone: 'America/Argentina/Buenos_Aires' },
  { name: 'Sao Paulo', country: 'Brazil', countryCode: 'BR', lat: -23.5505, lng: -46.6333, timezone: 'America/Sao_Paulo' },
  { name: 'Mexico City', country: 'Mexico', countryCode: 'MX', lat: 19.4326, lng: -99.1332, timezone: 'America/Mexico_City' },
  { name: 'Bogota', country: 'Colombia', countryCode: 'CO', lat: 4.711, lng: -74.0721, timezone: 'America/Bogota' },
  { name: 'Lima', country: 'Peru', countryCode: 'PE', lat: -12.0464, lng: -77.0428, timezone: 'America/Lima' },
  { name: 'Santiago', country: 'Chile', countryCode: 'CL', lat: -33.4489, lng: -70.6693, timezone: 'America/Santiago' },
  { name: 'Toronto', country: 'Canada', countryCode: 'CA', lat: 43.6532, lng: -79.3832, timezone: 'America/Toronto' },
  { name: 'Vancouver', country: 'Canada', countryCode: 'CA', lat: 49.2827, lng: -123.1207, timezone: 'America/Vancouver' },
  { name: 'Los Angeles', country: 'United States', countryCode: 'US', lat: 34.0522, lng: -118.2437, timezone: 'America/Los_Angeles' },
  { name: 'Chicago', country: 'United States', countryCode: 'US', lat: 41.8781, lng: -87.6298, timezone: 'America/Chicago' },
  { name: 'Miami', country: 'United States', countryCode: 'US', lat: 25.7617, lng: -80.1918, timezone: 'America/New_York' },
  { name: 'San Francisco', country: 'United States', countryCode: 'US', lat: 37.7749, lng: -122.4194, timezone: 'America/Los_Angeles' },
  { name: 'Hong Kong', country: 'China', countryCode: 'HK', lat: 22.3193, lng: 114.1694, timezone: 'Asia/Hong_Kong' },
  { name: 'Taipei', country: 'Taiwan', countryCode: 'TW', lat: 25.033, lng: 121.5654, timezone: 'Asia/Taipei' },
];

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  const db = createDb(databaseUrl);

  console.log(`Seeding ${POPULAR_CITIES.length} cities...`);

  for (const city of POPULAR_CITIES) {
    await db.insert(cities).values(city).onConflictDoNothing();
  }

  console.log('Seeding complete!');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});