export interface Location {
  name: string;
  ping: string;
  flag: string;
  hosts: string[];
}

export const initialLocations: Location[] = [
  {
    name: 'Стокгольм',
    ping: '...',
    flag: '/sweden.svg',
    hosts: [
      'https://api.spotify.com/v1/health', // Spotify API
      'https://api.ikea.com/health', // IKEA API
      'https://api.klarna.com/health', // Klarna API
    ],
  },
  {
    name: 'Франкфурт',
    ping: '...',
    flag: '/germany.svg',
    hosts: [
      'https://api.db.com/health', // Deutsche Bank API
      'https://api.commerzbank.de/health', // Commerzbank API
      'https://api.frankfurt-airport.com/health', // Frankfurt Airport API
    ],
  },
  {
    name: 'Нидерланды',
    ping: '...',
    flag: '/netherlands.svg',
    hosts: [
      'https://api.philips.com/health', // Philips API
      'https://api.klm.com/health', // KLM API
      'https://api.tomtom.com/health', // TomTom API
    ],
  },
  {
    name: 'Санкт-Петербург',
    ping: '...',
    flag: '/russia.svg',
    hosts: [
      'https://spb.hh.ru', // HeadHunter СПб
      'https://spb.rutube.ru', // Rutube СПб
      'https://spb.cian.ru', // Циан СПб
    ],
  },
];