import { Service, AreaCharge } from '@/types';

export const services: Service[] = [
  {
    id: 'injection',
    name: 'Injection',
    description: 'Professional intramuscular or subcutaneous injections administered by trained nurses',
    basePrice: 3000,
    estimatedTime: '15-20 min',
    icon: 'Syringe',
  },
  {
    id: 'iv-drip',
    name: 'IV Drip',
    description: 'Intravenous fluid therapy and medication administration',
    basePrice: 3000,
    estimatedTime: '45-90 min',
    icon: 'Droplets',
  },
  {
    id: 'dressing',
    name: 'Dressing / Wound Care',
    description: 'Professional wound cleaning, dressing change, and care',
    basePrice: 3000,
    estimatedTime: '20-40 min',
    icon: 'Bandage',
  },
  {
    id: 'iv-line',
    name: 'IV Line Insertion',
    description: 'Cannula insertion for intravenous access',
    basePrice: 3000,
    estimatedTime: '15-25 min',
    icon: 'Activity',
  },
  {
    id: 'lab-sample',
    name: 'Lab Sample Collection',
    description: 'Blood, urine, or other sample collection for laboratory testing',
    basePrice: 3000,
    estimatedTime: '10-20 min',
    icon: 'TestTube',
  },
];

export const areaCharges: AreaCharge[] = [
  { area: 'Rawalpindi', charge: 800 },
  { area: 'Islamabad', charge: 1000 },
];

export const CONTACT_NUMBER = '03357873568';

export const paymentMethods = {
  jazzCash: {
    name: 'JazzCash',
    number: '03047070016',
  },
  easyPaisa: {
    name: 'EasyPaisa',
    number: '03406829891',
  },
};
