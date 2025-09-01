import { writable } from 'svelte/store';

// Define types for better type safety
interface Location {
  latitude: number;
  longitude: number;
}

interface CustodyEntry {
  location: Location;
  guardianName: string;
  timestamp: string;
}

interface DeliveryInfo {
  nextLocation?: Location;
}

interface TrackingData {
  trackingCode: string;
  currentLocation: Location;
  custodyChain: CustodyEntry[];
  delivery: DeliveryInfo;
  product?: any;
}

export const trackingStore = writable<TrackingData | null>(null);

export const mapStore = writable({
  center: [0, 0] as [number, number],
  zoom: 10,
  markers: [] as any[]
});

// Utility functions
export function updateTrackingData(data: TrackingData) {
  trackingStore.set(data);
  
  // Update map center to current location
  mapStore.update(map => ({
    ...map,
    center: [data.currentLocation.latitude, data.currentLocation.longitude],
    markers: [
      {
        id: 'current',
        position: [data.currentLocation.latitude, data.currentLocation.longitude],
        title: 'Current Location',
        type: 'current'
      },
      ...data.custodyChain.map((entry, index) => ({
        id: `custody-${index}`,
        position: [entry.location.latitude, entry.location.longitude],
        title: `${entry.guardianName} - ${entry.timestamp}`,
        type: 'custody'
      })),
      ...(data.delivery.nextLocation ? [{
        id: 'destination',
        position: [data.delivery.nextLocation.latitude, data.delivery.nextLocation.longitude],
        title: 'Next Destination',
        type: 'destination'
      }] : [])
    ]
  }));
}

export function clearTrackingData() {
  trackingStore.set(null);
  mapStore.set({
    center: [0, 0],
    zoom: 10,
    markers: []
  });
} 