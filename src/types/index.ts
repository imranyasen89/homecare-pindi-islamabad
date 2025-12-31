export interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  estimatedTime: string;
  icon: string;
}

export interface ServiceRequest {
  id: string;
  patientName: string;
  mobileNumber: string;
  services: string[];
  preferredDate: string;
  preferredTime: string;
  address: string;
  area: 'Rawalpindi' | 'Islamabad';
  notes?: string;
  estimatedPrice: number;
  finalPrice?: number;
  status: 'pending' | 'accepted' | 'on_the_way' | 'completed' | 'rejected';
  assignedStaff?: string;
  paymentReceived: boolean;
  createdAt: string;
}

export interface AreaCharge {
  area: 'Rawalpindi' | 'Islamabad';
  charge: number;
}
