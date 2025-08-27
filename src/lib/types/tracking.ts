export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
  facility?: string;
}

export interface CustodyEntry {
  id: string;
  guardianId: string;
  guardianName: string;
  timestamp: string;
  location: Location;
  status: 'handover' | 'in-transit' | 'secured' | 'delivered';
  notes?: string;
  verified: boolean;
}

export interface ProductDetails {
  id: string;
  type: string;
  weight: number;
  weightUnit: 'kg' | 'g' | 'oz';
  purity: number;
  purityUnit: '999.9' | '999.5' | '999';
  serialNumber: string;
  photos: string[];
  description?: string;
}

export interface DeliveryInfo {
  estimatedDelivery: string;
  currentStatus: 'in-transit' | 'customs' | 'delayed' | 'delivered' | 'secured';
  delayReason?: string;
  nextLocation?: Location;
  etaHours?: number;
}

export interface TrackingData {
  trackingCode: string;
  product: ProductDetails;
  currentLocation: Location;
  custodyChain: CustodyEntry[];
  delivery: DeliveryInfo;
  lastUpdated: string;
}

export interface TrackingError {
  error: string;
  code: string;
  retryAfter?: number;
} 