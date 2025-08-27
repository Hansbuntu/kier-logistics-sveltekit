<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  export let trackingData;

  let mapContainer;
  let map;
  let markers = [];
  let L;

  onMount(async () => {
    // Only import Leaflet on the client side
    if (browser) {
      // Dynamically load Leaflet CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);

      // Import Leaflet JavaScript
      L = await import('leaflet');
      
      // Initialize map
      map = L.default.map(mapContainer).setView(
        [trackingData.currentLocation.latitude, trackingData.currentLocation.longitude],
        12
      );

      // Add OpenStreetMap tiles
      L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add current location marker
      const currentMarker = L.default.marker([trackingData.currentLocation.latitude, trackingData.currentLocation.longitude], {
        icon: L.default.divIcon({
          className: 'custom-marker current',
          html: '<div class="w-6 h-6 bg-gold-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center"><div class="w-3 h-3 bg-white rounded-full"></div></div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        })
      }).addTo(map);

      currentMarker.bindPopup(`
        <div class="text-sm">
          <strong>Current Location</strong><br>
          ${trackingData.currentLocation.address}<br>
          ${trackingData.currentLocation.city}, ${trackingData.currentLocation.country}
        </div>
      `);

      markers.push(currentMarker);

      // Add custody chain markers
      trackingData.custodyChain.forEach((entry, index) => {
        const marker = L.default.marker([entry.location.latitude, entry.location.longitude], {
          icon: L.default.divIcon({
            className: 'custom-marker custody',
            html: `<div class="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center"><span class="text-xs text-white font-bold">${index + 1}</span></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          })
        }).addTo(map);

        marker.bindPopup(`
          <div class="text-sm">
            <strong>Custody Point ${index + 1}</strong><br>
            Guardian: ${entry.guardianName}<br>
            Time: ${entry.timestamp}<br>
            ${entry.location.city}, ${entry.location.country}
          </div>
        `);

        markers.push(marker);
      });

      // Add destination marker if available
      if (trackingData.delivery.nextLocation) {
        const destMarker = L.default.marker([trackingData.delivery.nextLocation.latitude, trackingData.delivery.nextLocation.longitude], {
          icon: L.default.divIcon({
            className: 'custom-marker destination',
            html: '<div class="w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center"><svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg></div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          })
        }).addTo(map);

        destMarker.bindPopup(`
          <div class="text-sm">
            <strong>Next Destination</strong><br>
            ${trackingData.delivery.nextLocation.address}<br>
            ${trackingData.delivery.nextLocation.city}, ${trackingData.delivery.nextLocation.country}
          </div>
        `);

        markers.push(destMarker);
      }

      // Fit map to show all markers
      if (markers.length > 1) {
        const group = new L.default.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
      }
    }
  });

  onDestroy(() => {
    if (map && browser) {
      map.remove();
    }
  });
</script>

<div bind:this={mapContainer} class="w-full h-80 rounded-lg"></div>

<style>
  :global(.custom-marker) {
    background: transparent;
    border: none;
  }
  
  :global(.custom-marker.current) {
    animation: pulse-slow 2s infinite;
  }
  
  :global(.custom-marker.destination) {
    animation: bounce-slow 2s infinite;
  }
</style> 