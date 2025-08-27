import { writable } from 'svelte/store';

export const trackingStore = writable(null);

export const mapStore = writable({
  center: [0, 0],
  zoom: 10,
  markers: []
});

// Utility functions
export function updateTrackingData(data) {
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