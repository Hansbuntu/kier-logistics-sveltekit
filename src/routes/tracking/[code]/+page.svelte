<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import InteractiveMap from '$lib/components/InteractiveMap.svelte';
  import { trackingStore } from '$lib/stores/trackingStore';
  import Footer from '$lib/components/Footer.svelte';

  let trackingData = null;
  let loading = true;
  let error = null;
  let trackingCode = '';

  onMount(async () => {
    trackingCode = $page.params.code;
    
    try {
      const response = await fetch(`/api/tracking/${trackingCode}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch tracking information');
      }
      
      trackingData = data;
      trackingStore.set(data);
    } catch (err) {
      error = err instanceof Error ? err.message : 'An unexpected error occurred';
      trackingStore.set(null);
    } finally {
      loading = false;
    }
  });
  
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
  
  function getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'in-transit': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }
</script>

<div class="page-container">
  <main class="main-content">
    <!-- Loading State -->
    {#if loading}
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading tracking information...</p>
      </div>
    {/if}

    <!-- Error State -->
    {#if error}
      <div class="error-container">
        <h2>Tracking Error</h2>
        <p>{error}</p>
        <a href="/track" class="retry-link">
              Try Another Code
            </a>
      </div>
    {/if}

    <!-- Tracking Results -->
    {#if trackingData}
      <div class="tracking-details">
        <!-- Tracking Header -->
        <div class="tracking-header">
          <div class="tracking-code-section">
            <h2 class="tracking-code-title">Tracking Code: {trackingData.trackingCode}</h2>
            <div class="status-badge {getStatusColor(trackingData.delivery?.currentStatus)}">
              {trackingData.delivery?.currentStatus || 'Processing'}
            </div>
          </div>
          <div class="last-updated">
            Last Updated: {formatDate(trackingData.lastUpdated)}
          </div>
        </div>
        
        <!-- Map Section -->
        <div class="map-section">
          <InteractiveMap {trackingData} height="500px" />
        </div>
        
        <!-- Details Grid -->
        <div class="details-grid">
          <!-- Product Information -->
          <div class="detail-card">
            <h3 class="card-title">Product Information</h3>
            <div class="info-list">
              <div class="info-row">
                <span class="info-label">Type:</span>
                <span class="info-value">{trackingData.product?.type || 'Precious Metals'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Weight:</span>
                <span class="info-value">{trackingData.product?.weight || 'N/A'} {trackingData.product?.weightUnit || 'kg'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Purity:</span>
                <span class="info-value">{trackingData.product?.purity || 'N/A'} {trackingData.product?.purityUnit || ''}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Serial Number:</span>
                <span class="info-value">{trackingData.product?.serialNumber || 'Pending'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Description:</span>
                <span class="info-value">{trackingData.product?.description || 'Shipment details pending'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Security Level:</span>
                <span class="info-value status-{trackingData.securityLevel || 'high'}">
                  {trackingData.securityLevel || 'High'}
                </span>
              </div>
              <div class="info-row">
                <span class="info-label">Verification:</span>
                <span class="info-value status-{trackingData.verificationStatus || 'pending'}">
                  {trackingData.verificationStatus || 'Pending'}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Product Images -->
          {#if trackingData.product?.photos && trackingData.product.photos.length > 0}
            <div class="detail-card product-images-card">
              <h3 class="card-title">Product Images</h3>
              <div class="images-grid">
                {#each trackingData.product.photos as photo, index}
                  <div class="image-item">
                    <img 
                      src={photo} 
                      alt="Product image {index + 1}" 
                      class="product-image"
                      loading="lazy"
                      on:error={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div class="image-error" style="display: none;">
                      <span class="error-text">Image unavailable</span>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
          
          <!-- Origin Information -->
          {#if trackingData.origin}
            <div class="detail-card">
              <h3 class="card-title">Origin Information</h3>
              <div class="info-list">
                <div class="info-row">
                  <span class="info-label">Address:</span>
                  <span class="info-value">{trackingData.origin.location?.address || 'Origin Location'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">City:</span>
                  <span class="info-value">{trackingData.origin.location?.city || 'Origin City'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Country:</span>
                  <span class="info-value">{trackingData.origin.location?.country || 'Origin Country'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Facility:</span>
                  <span class="info-value">{trackingData.origin.facility || 'Origin Facility'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Guardian:</span>
                  <span class="info-value">{trackingData.origin.guardian || 'Origin Guardian'}</span>
                </div>
                {#if trackingData.origin.pickupDate}
                  <div class="info-row">
                    <span class="info-label">Pickup Date:</span>
                    <span class="info-value">{formatDate(trackingData.origin.pickupDate)}</span>
                  </div>
                {/if}
              </div>
            </div>
          {/if}
          
          <!-- Current Location -->
          <div class="detail-card">
            <h3 class="card-title">Current Location</h3>
            <div class="info-list">
              <div class="info-row">
                <span class="info-label">Address:</span>
                <span class="info-value">{trackingData.currentLocation?.address || 'Processing Center'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">City:</span>
                <span class="info-value">{trackingData.currentLocation?.city || 'Processing'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Country:</span>
                <span class="info-value">{trackingData.currentLocation?.country || 'Processing'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Facility:</span>
                <span class="info-value">{trackingData.currentFacility || 'Kier Logistics Hub'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Guardian:</span>
                <span class="info-value">{trackingData.currentGuardian || 'Current Guardian'}</span>
              </div>
            </div>
          </div>
          
          <!-- Destination Information -->
          {#if trackingData.destination}
            <div class="detail-card">
              <h3 class="card-title">Destination Information</h3>
              <div class="info-list">
                <div class="info-row">
                  <span class="info-label">Address:</span>
                  <span class="info-value">{trackingData.destination.location?.address || 'Destination Address'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">City:</span>
                  <span class="info-value">{trackingData.destination.location?.city || 'Destination City'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Country:</span>
                  <span class="info-value">{trackingData.destination.location?.country || 'Destination Country'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Facility:</span>
                  <span class="info-value">{trackingData.destination.facility || 'Destination Facility'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Recipient:</span>
                  <span class="info-value">{trackingData.destination.recipientName || 'Recipient Name'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Contact:</span>
                  <span class="info-value">{trackingData.destination.recipientContact || 'Recipient Contact'}</span>
          </div>
        </div>
      </div>
    {/if}

          <!-- Delivery Information -->
          <div class="detail-card">
            <h3 class="card-title">Delivery Information</h3>
            <div class="info-list">
              <div class="info-row">
                <span class="info-label">Status:</span>
                <span class="info-value status-{trackingData.journeyStatus || trackingData.delivery?.currentStatus || 'pending'}">
                  {trackingData.journeyStatus || trackingData.delivery?.currentStatus || 'Processing'}
                </span>
              </div>
              {#if trackingData.delivery?.estimatedDelivery}
                <div class="info-row">
                  <span class="info-label">Estimated Delivery:</span>
                  <span class="info-value">{formatDate(trackingData.delivery.estimatedDelivery)}</span>
                </div>
              {/if}
              {#if trackingData.delivery?.etaHours}
                <div class="info-row">
                  <span class="info-label">ETA Hours:</span>
                  <span class="info-value">{trackingData.delivery.etaHours} hours</span>
                </div>
              {/if}
              {#if trackingData.delivery?.delayReason}
                <div class="info-row">
                  <span class="info-label">Delay Reason:</span>
                  <span class="info-value">{trackingData.delivery.delayReason}</span>
                </div>
              {/if}
            </div>
          </div>
          
          <!-- Custody Chain -->
          {#if trackingData.custodyChain && trackingData.custodyChain.length > 0}
            <div class="detail-card custody-chain">
              <h3 class="card-title">Custody Chain</h3>
              <div class="custody-timeline">
                {#each trackingData.custodyChain as entry, index}
                  <div class="custody-entry">
                    <div class="custody-marker">
                      <div class="marker-number">{index + 1}</div>
                    </div>
                    <div class="custody-content">
                      <div class="custody-header">
                        <h4 class="custody-guardian">{entry.guardianName}</h4>
                        <span class="custody-time">{formatDate(entry.timestamp)}</span>
                      </div>
                      <div class="custody-details">
                        <p class="custody-location">
                          <strong>Location:</strong> {entry.location?.address || 'Unknown'}
                        </p>
                        <p class="custody-status">
                          <strong>Status:</strong> 
                          <span class="status-badge {getStatusColor(entry.status)}">
                            {entry.status}
                          </span>
                        </p>
                        {#if entry.notes}
                          <p class="custody-notes">
                            <strong>Notes:</strong> {entry.notes}
                          </p>
                        {/if}
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </main>
  
  <Footer />
</div> 

<style>
  .page-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .main-content {
    flex: 1;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error-container {
    text-align: center;
    padding: 4rem 2rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 12px;
    margin: 2rem 0;
  }
  
  .error-container h2 {
    color: #dc2626;
    margin-bottom: 1rem;
  }
  
  .retry-link {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background: #3b82f6;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 500;
  }
  
  .tracking-details {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .tracking-header {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .tracking-code-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .tracking-code-title {
    font-size: 1.875rem;
    font-weight: 700;
    color: #1e3a8a;
    margin: 0;
  }
  
  .status-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .last-updated {
    color: #6b7280;
    font-size: 0.875rem;
  }
  
  .map-section {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
  }
  
  .detail-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
  }
  
  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e3a8a;
    margin: 0 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e5e7eb;
  }
  
  .info-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .info-label {
    font-weight: 500;
    color: #374151;
    min-width: 120px;
  }
  
  .info-value {
    color: #1f2937;
    text-align: right;
    flex: 1;
  }
  
  .status-high { color: #059669; }
  .status-medium { color: #d97706; }
  .status-low { color: #dc2626; }
  .status-verified { color: #059669; }
  .status-pending { color: #6b7280; }
  
  /* Product Images Styles */
  .product-images-card {
    grid-column: 1 / -1;
  }
  
  .images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .image-item {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    background: white;
    border: 1px solid #e5e7eb;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .product-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: transform 0.3s ease;
    cursor: pointer;
  }
  
  .product-image:hover {
    transform: scale(1.05);
  }
  
  .image-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    background: #f3f4f6;
    color: #6b7280;
  }
  
  .error-text {
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  /* Custody Chain Styles */
  .custody-chain {
    grid-column: 1 / -1;
  }
  
  .custody-timeline {
    position: relative;
    padding-left: 2rem;
  }
  
  .custody-timeline::before {
    content: '';
    position: absolute;
    left: 1rem;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #e5e7eb;
  }
  
  .custody-entry {
    position: relative;
    margin-bottom: 2rem;
  }
  
  .custody-marker {
    position: absolute;
    left: -2rem;
    top: 0;
    width: 2rem;
    height: 2rem;
    background: #3b82f6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .marker-number {
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
  }
  
  .custody-content {
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }
  
  .custody-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .custody-guardian {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e3a8a;
    margin: 0;
  }
  
  .custody-time {
    color: #6b7280;
    font-size: 0.875rem;
  }
  
  .custody-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .custody-location,
  .custody-status {
    margin: 0;
    font-size: 0.875rem;
    color: #4b5563;
  }
  
  .custody-notes {
    font-style: italic;
  }
  
  /* Mobile Responsive */
  @media (max-width: 768px) {
    .main-content {
      padding: 1rem;
    }
    
    .tracking-header {
      flex-direction: column;
      align-items: flex-start;
      padding: 1.5rem;
    }
    
    .tracking-code-title {
      font-size: 1.5rem;
    }
    
    .details-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .info-row {
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .info-label {
      min-width: auto;
    }
    
    .info-value {
      text-align: left;
    }
    
    .custody-timeline {
      padding-left: 1.5rem;
    }
    
    .custody-marker {
      left: -1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }
    
    .marker-number {
      font-size: 0.75rem;
    }
    
    .custody-header {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>