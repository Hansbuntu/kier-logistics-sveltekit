<script>
  import { onMount, onDestroy } from 'svelte';
  
  export let trackingData = null;
  export let height = '400px';
  export let editable = false;
  export let onLocationChange = null;
  
  let mapContainer;
  let map = null;
  let markers = [];
  let polylines = [];
  
  onMount(() => {
    if (typeof window !== 'undefined') {
      loadLeaflet();
    }
  });
  
  onDestroy(() => {
    if (map) {
      map.remove();
    }
  });
  
  async function loadLeaflet() {
    // Dynamically load Leaflet CSS and JS
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    css.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    css.crossOrigin = '';
    document.head.appendChild(css);
    
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.onload = initializeMap;
    document.head.appendChild(script);
  }
  
  function initializeMap() {
    if (!mapContainer || !window.L) return;
    
    // Initialize map centered on a default location
    const defaultCenter = [40.7128, -74.0060]; // New York
    map = window.L.map(mapContainer).setView(defaultCenter, 2);
    
    // Add OpenStreetMap tiles
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map);
    
    // Add markers and route if tracking data exists
    if (trackingData) {
      updateMapWithTrackingData();
    }
    
    // Add click handler for editable maps
    if (editable && onLocationChange) {
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        onLocationChange({ latitude: lat, longitude: lng });
      });
    }
  }
  
  function updateMapWithTrackingData() {
    if (!map || !trackingData) return;
    
    // Clear existing markers and polylines
    markers.forEach(marker => map.removeLayer(marker));
    polylines.forEach(polyline => map.removeLayer(polyline));
    markers = [];
    polylines = [];
    
    const routePoints = [];
    
    // Add origin marker
    if (trackingData.origin?.location) {
      const origin = trackingData.origin.location;
      const originMarker = window.L.marker([origin.latitude, origin.longitude])
        .addTo(map)
        .bindPopup(`
          <div class="map-popup">
            <h4>Origin</h4>
            <p><strong>Location:</strong> ${origin.address || 'Unknown'}</p>
            <p><strong>City:</strong> ${origin.city || 'Unknown'}</p>
            <p><strong>Country:</strong> ${origin.country || 'Unknown'}</p>
            <p><strong>Facility:</strong> ${trackingData.origin.facility || 'Unknown'}</p>
            <p><strong>Guardian:</strong> ${trackingData.origin.guardian || 'Unknown'}</p>
          </div>
        `);
      markers.push(originMarker);
      routePoints.push([origin.latitude, origin.longitude]);
    }
    
    // Add current location marker
    if (trackingData.currentLocation) {
      const current = trackingData.currentLocation;
      const currentMarker = window.L.marker([current.latitude, current.longitude], {
        icon: window.L.divIcon({
          className: 'current-location-marker',
          html: '<div class="current-marker">📍</div>',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        })
      })
        .addTo(map)
        .bindPopup(`
          <div class="map-popup">
            <h4>Current Location</h4>
            <p><strong>Location:</strong> ${current.address || 'Unknown'}</p>
            <p><strong>City:</strong> ${current.city || 'Unknown'}</p>
            <p><strong>Country:</strong> ${current.country || 'Unknown'}</p>
            <p><strong>Facility:</strong> ${trackingData.currentFacility || 'Unknown'}</p>
            <p><strong>Guardian:</strong> ${trackingData.currentGuardian || 'Unknown'}</p>
            <p><strong>Status:</strong> ${trackingData.journeyStatus || 'Unknown'}</p>
          </div>
        `);
      markers.push(currentMarker);
      routePoints.push([current.latitude, current.longitude]);
    }
    
    // Add destination marker
    if (trackingData.destination?.location) {
      const destination = trackingData.destination.location;
      const destMarker = window.L.marker([destination.latitude, destination.longitude], {
        icon: window.L.divIcon({
          className: 'destination-marker',
          html: '<div class="destination-marker-icon">🏁</div>',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        })
      })
        .addTo(map)
        .bindPopup(`
          <div class="map-popup">
            <h4>Destination</h4>
            <p><strong>Location:</strong> ${destination.address || 'Unknown'}</p>
            <p><strong>City:</strong> ${destination.city || 'Unknown'}</p>
            <p><strong>Country:</strong> ${destination.country || 'Unknown'}</p>
            <p><strong>Facility:</strong> ${trackingData.destination.facility || 'Unknown'}</p>
            <p><strong>Recipient:</strong> ${trackingData.destination.recipientName || 'Unknown'}</p>
          </div>
        `);
      markers.push(destMarker);
      routePoints.push([destination.latitude, destination.longitude]);
    }
    
    // Add route polyline
    if (routePoints.length > 1) {
      const routePolyline = window.L.polyline(routePoints, {
        color: '#3b82f6',
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 10'
      }).addTo(map);
      polylines.push(routePolyline);
    }
    
    // Add custody chain markers
    if (trackingData.custodyChain && trackingData.custodyChain.length > 0) {
      trackingData.custodyChain.forEach((entry, index) => {
        if (entry.location) {
          const custodyMarker = window.L.marker([entry.location.latitude, entry.location.longitude], {
            icon: window.L.divIcon({
              className: 'custody-marker',
              html: `<div class="custody-marker-icon">${index + 1}</div>`,
              iconSize: [25, 25],
              iconAnchor: [12, 12]
            })
          })
            .addTo(map)
            .bindPopup(`
              <div class="map-popup">
                <h4>Custody Point ${index + 1}</h4>
                <p><strong>Guardian:</strong> ${entry.guardianName || 'Unknown'}</p>
                <p><strong>Location:</strong> ${entry.location.address || 'Unknown'}</p>
                <p><strong>Status:</strong> ${entry.status || 'Unknown'}</p>
                <p><strong>Time:</strong> ${new Date(entry.timestamp).toLocaleString()}</p>
                ${entry.notes ? `<p><strong>Notes:</strong> ${entry.notes}</p>` : ''}
              </div>
            `);
          markers.push(custodyMarker);
        }
      });
    }
    
    // Fit map to show all markers
    if (markers.length > 0) {
      const group = new window.L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }
  
  // Watch for tracking data changes
  $: if (map && trackingData) {
    updateMapWithTrackingData();
  }
</script>

<div class="interactive-map-container">
  <div class="map-header">
    <h3>Shipment Journey Map</h3>
    <div class="map-legend">
      <div class="legend-item">
        <span class="legend-marker origin">📍</span>
        <span>Origin</span>
      </div>
      <div class="legend-item">
        <span class="legend-marker current">📍</span>
        <span>Current</span>
      </div>
      <div class="legend-item">
        <span class="legend-marker destination">🏁</span>
        <span>Destination</span>
      </div>
      <div class="legend-item">
        <span class="legend-marker custody">1</span>
        <span>Custody Points</span>
      </div>
    </div>
  </div>
  
  <div 
    bind:this={mapContainer} 
    class="map-container"
    style="height: {height};"
  ></div>
  
  {#if editable}
    <div class="map-instructions">
      <p>Click anywhere on the map to set the location</p>
    </div>
  {/if}
</div>

<style>
  .interactive-map-container {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .map-header {
    padding: 1rem 1.5rem;
    background: #f8fafc;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .map-header h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e3a8a;
  }
  
  .map-legend {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .legend-marker {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
  }
  
  .legend-marker.origin {
    background: #10b981;
    color: white;
  }
  
  .legend-marker.current {
    background: #3b82f6;
    color: white;
  }
  
  .legend-marker.destination {
    background: #ef4444;
    color: white;
  }
  
  .legend-marker.custody {
    background: #f59e0b;
    color: white;
  }
  
  .map-container {
    width: 100%;
    position: relative;
  }
  
  .map-instructions {
    padding: 0.75rem 1.5rem;
    background: #fef3c7;
    border-top: 1px solid #f59e0b;
    font-size: 0.875rem;
    color: #92400e;
  }
  
  /* Leaflet marker styles */
  :global(.current-location-marker) {
    background: none !important;
    border: none !important;
  }
  
  :global(.current-marker) {
    font-size: 1.5rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }
  
  :global(.destination-marker) {
    background: none !important;
    border: none !important;
  }
  
  :global(.destination-marker-icon) {
    font-size: 1.5rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }
  
  :global(.custody-marker) {
    background: none !important;
    border: none !important;
  }
  
  :global(.custody-marker-icon) {
    width: 25px;
    height: 25px;
    background: #f59e0b;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  :global(.map-popup) {
    font-family: system-ui, -apple-system, sans-serif;
  }
  
  :global(.map-popup h4) {
    margin: 0 0 0.5rem 0;
    color: #1e3a8a;
    font-size: 1rem;
  }
  
  :global(.map-popup p) {
    margin: 0.25rem 0;
    font-size: 0.875rem;
    color: #374151;
  }
  
  @media (max-width: 768px) {
    .map-header {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .map-legend {
      justify-content: flex-start;
    }
  }
</style>
