<script>
  import { onMount, onDestroy } from 'svelte';

  export let trackingData = null;
  export let height = '400px';

  let mapContainer;
  let map = null;
  let markers = [];

  onMount(async () => {
    if (!trackingData) return;
    
    try {
      // Dynamically import Leaflet
      const L = await import('leaflet');
      
      // Initialize map
      map = L.map(mapContainer).setView([40.7128, -74.0060], 4);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      
      // Add markers for tracking locations
      addTrackingMarkers(L);
      
    } catch (error) {
      console.error('Error loading map:', error);
    }
  });
  
  onDestroy(() => {
    if (map) {
      map.remove();
    }
  });
  
  function addTrackingMarkers(L) {
    if (!trackingData || !map) return;
    
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

      // Add current location marker
    if (trackingData.currentLocation) {
      const currentMarker = L.marker([trackingData.currentLocation.latitude, trackingData.currentLocation.longitude], {
        icon: L.divIcon({
          className: 'custom-marker current-location',
          html: '<div class="marker-content"><div class="marker-icon">📍</div><div class="marker-label">Current</div></div>',
          iconSize: [40, 40],
          iconAnchor: [20, 40]
        })
      }).addTo(map);

      currentMarker.bindPopup(`
        <div class="popup-content">
          <h4>Current Location</h4>
          <p><strong>Address:</strong> ${trackingData.currentLocation.address}</p>
          <p><strong>City:</strong> ${trackingData.currentLocation.city}</p>
          <p><strong>Facility:</strong> ${trackingData.currentLocation.facility}</p>
          <p><strong>Status:</strong> ${trackingData.delivery?.currentStatus || 'Unknown'}</p>
        </div>
      `);

      markers.push(currentMarker);
    }

      // Add custody chain markers
    if (trackingData.custodyChain && trackingData.custodyChain.length > 0) {
      trackingData.custodyChain.forEach((entry, index) => {
        if (entry.location) {
          const custodyMarker = L.marker([entry.location.latitude, entry.location.longitude], {
            icon: L.divIcon({
              className: 'custom-marker custody-location',
              html: `<div class="marker-content"><div class="marker-icon">${index + 1}</div><div class="marker-label">Checkpoint</div></div>`,
              iconSize: [35, 35],
              iconAnchor: [17, 35]
          })
        }).addTo(map);

          const date = new Date(entry.timestamp).toLocaleDateString();
          custodyMarker.bindPopup(`
            <div class="popup-content">
              <h4>Checkpoint ${index + 1}</h4>
              <p><strong>Guardian:</strong> ${entry.guardianName}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Status:</strong> ${entry.status}</p>
              <p><strong>Location:</strong> ${entry.location.address}</p>
              ${entry.notes ? `<p><strong>Notes:</strong> ${entry.notes}</p>` : ''}
          </div>
        `);

          markers.push(custodyMarker);
        }
      });
    }

      // Add destination marker if available
    if (trackingData.delivery?.nextLocation) {
      const destMarker = L.marker([trackingData.delivery.nextLocation.latitude, trackingData.delivery.nextLocation.longitude], {
        icon: L.divIcon({
            className: 'custom-marker destination',
          html: '<div class="marker-content"><div class="marker-icon">🎯</div><div class="marker-label">Destination</div></div>',
          iconSize: [40, 40],
          iconAnchor: [20, 40]
          })
        }).addTo(map);

        destMarker.bindPopup(`
        <div class="popup-content">
          <h4>Next Destination</h4>
          <p><strong>Address:</strong> ${trackingData.delivery.nextLocation.address}</p>
          <p><strong>City:</strong> ${trackingData.delivery.nextLocation.city}</p>
          <p><strong>Facility:</strong> ${trackingData.delivery.nextLocation.facility}</p>
          ${trackingData.delivery.estimatedDelivery ? `<p><strong>ETA:</strong> ${new Date(trackingData.delivery.estimatedDelivery).toLocaleDateString()}</p>` : ''}
          </div>
        `);

        markers.push(destMarker);
      }

      // Fit map to show all markers
    if (markers.length > 0) {
      const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
      }
    }
  
  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<div class="tracking-map-container">
  <div class="map-header">
    <h3 class="map-title">Shipment Journey Map</h3>
    <p class="map-subtitle">Track your shipment's progress across locations</p>
  </div>
  
  <div class="map-legend">
    <div class="legend-item">
      <div class="legend-marker current-location">📍</div>
      <span>Current Location</span>
    </div>
    <div class="legend-item">
      <div class="legend-marker custody-location">1</div>
      <span>Checkpoints</span>
    </div>
    <div class="legend-item">
      <div class="legend-marker destination">🎯</div>
      <span>Destination</span>
    </div>
  </div>
  
  <div class="map-wrapper">
    <div bind:this={mapContainer} class="tracking-map" style="height: {height};"></div>
  </div>
  
  {#if trackingData}
    <div class="map-info">
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Current Status:</span>
          <span class="info-value status-{trackingData.delivery?.currentStatus || 'pending'}">
            {trackingData.delivery?.currentStatus || 'Processing'}
          </span>
        </div>
        <div class="info-item">
          <span class="info-label">Last Updated:</span>
          <span class="info-value">{formatDate(trackingData.lastUpdated)}</span>
        </div>
        {#if trackingData.delivery?.estimatedDelivery}
          <div class="info-item">
            <span class="info-label">Estimated Delivery:</span>
            <span class="info-value">{formatDate(trackingData.delivery.estimatedDelivery)}</span>
          </div>
        {/if}
        {#if trackingData.delivery?.etaHours}
          <div class="info-item">
            <span class="info-label">ETA Hours:</span>
            <span class="info-value">{trackingData.delivery.etaHours} hours</span>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .tracking-map-container {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(30, 58, 138, 0.1);
  }
  
  .map-header {
    margin-bottom: 1rem;
  }
  
  .map-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e3a8a;
    margin: 0 0 0.5rem 0;
  }
  
  .map-subtitle {
    color: #6b7280;
    margin: 0;
    font-size: 0.875rem;
  }
  
  .map-legend {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #4b5563;
  }
  
  .legend-marker {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
  }
  
  .legend-marker.current-location {
    background: #10b981;
    color: white;
  }
  
  .legend-marker.custody-location {
    background: #3b82f6;
    color: white;
  }
  
  .legend-marker.destination {
    background: #f59e0b;
    color: white;
  }
  
  .map-wrapper {
    border-radius: 12px;
    overflow: hidden;
    border: 2px solid #e5e7eb;
  }
  
  .tracking-map {
    width: 100%;
    border-radius: 12px;
  }
  
  .map-info {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .info-label {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
  }
  
  .info-value {
    font-size: 0.875rem;
    color: #1f2937;
    font-weight: 600;
  }
  
  .status-delivered {
    color: #059669;
  }
  
  .status-in-transit {
    color: #2563eb;
  }
  
  .status-processing {
    color: #d97706;
  }
  
  .status-pending {
    color: #6b7280;
  }
  
  /* Custom marker styles */
  :global(.custom-marker) {
    background: transparent;
    border: none;
  }
  
  :global(.marker-content) {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  :global(.marker-icon) {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 600;
    color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
  
  :global(.current-location .marker-icon) {
    background: #10b981;
  }
  
  :global(.custody-location .marker-icon) {
    background: #3b82f6;
  }
  
  :global(.destination .marker-icon) {
    background: #f59e0b;
  }
  
  :global(.marker-label) {
    font-size: 0.625rem;
    color: #374151;
    font-weight: 500;
    margin-top: 2px;
    background: white;
    padding: 1px 4px;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  :global(.popup-content) {
    min-width: 200px;
  }
  
  :global(.popup-content h4) {
    margin: 0 0 0.5rem 0;
    color: #1e3a8a;
    font-size: 1rem;
  }
  
  :global(.popup-content p) {
    margin: 0.25rem 0;
    font-size: 0.875rem;
    color: #4b5563;
  }
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    .tracking-map-container {
      padding: 1rem;
    }
    
    .map-legend {
      gap: 0.75rem;
    }
    
    .legend-item {
      font-size: 0.75rem;
    }
    
    .info-grid {
      grid-template-columns: 1fr;
    }
  }
</style> 