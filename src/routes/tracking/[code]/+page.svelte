<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import TrackingMap from '$lib/components/TrackingMap.svelte';
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

<svelte:head>
  <title>Tracking {trackingCode} - Kier Logistics</title>
  <meta name="description" content="Track your shipment with real-time location updates and custody chain verification." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-50 via-gold-50 to-gray-100">
  <!-- Header -->
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Tracking Details</h1>
            <p class="text-sm text-gray-600">Code: {trackingCode}</p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <a href="/tracking-history" class="btn-secondary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            History
          </a>
          <a href="/" class="btn-secondary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            New Track
          </a>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    {#if loading}
      <div class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="loading-spinner mx-auto mb-4"></div>
          <p class="text-gray-600">Retrieving tracking information...</p>
        </div>
      </div>
    {/if}

    <!-- Error State -->
    {#if error}
      <div class="max-w-2xl mx-auto">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="text-sm font-medium text-red-800">Error</h3>
          </div>
          <p class="mt-2 text-sm text-red-700">{error}</p>
          <div class="mt-4">
            <a href="/" class="btn-primary">
              Try Another Code
            </a>
          </div>
        </div>
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
          <TrackingMap {trackingData} height="500px" />
        </div>
        
        <!-- Details Grid -->
        <div class="details-grid">
          <!-- Product Information -->
          <div class="detail-card">
            <h3 class="card-title">Product Information</h3>
            <div class="info-list">
              <div class="info-row">
                <span class="info-label">Type:</span>
                <span class="info-value">{trackingData.product?.type || 'Gold Shipment'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Weight:</span>
                <span class="info-value">{trackingData.product?.weight || 0} {trackingData.product?.weightUnit || 'kg'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Purity:</span>
                <span class="info-value">{trackingData.product?.purity || 999.5} {trackingData.product?.purityUnit || '999.5'}</span>
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
          </div>
          
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
                <span class="info-value">{trackingData.currentLocation?.facility || 'Kier Logistics Hub'}</span>
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
  .tracking-details {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .tracking-header {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(30, 58, 138, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .tracking-code-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .tracking-code-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e3a8a;
    margin: 0;
  }
  
  .status-badge {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .last-updated {
    color: #6b7280;
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .map-section {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(30, 58, 138, 0.1);
  }
  
  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .detail-card {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(30, 58, 138, 0.1);
  }
  
  .detail-card.custody-chain {
    grid-column: 1 / -1;
  }
  
  .card-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e3a8a;
    margin: 0 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #f3f4f6;
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
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
    min-width: 120px;
  }
  
  .info-value {
    font-size: 0.875rem;
    color: #1f2937;
    font-weight: 600;
    text-align: right;
    flex: 1;
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
  
  /* Custody Chain Styles */
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
    display: flex;
    gap: 1rem;
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .marker-number {
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
  }
  
  .custody-content {
    flex: 1;
    background: #f8fafc;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }
  
  .custody-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .custody-guardian {
    font-size: 1rem;
    font-weight: 600;
    color: #1e3a8a;
    margin: 0;
  }
  
  .custody-time {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 500;
  }
  
  .custody-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .custody-location,
  .custody-status,
  .custody-notes {
    margin: 0;
    font-size: 0.875rem;
    color: #4b5563;
  }
  
  .custody-notes {
    font-style: italic;
  }
  
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
  
  /* Mobile Responsive */
  @media (max-width: 768px) {
    .tracking-header {
      flex-direction: column;
      align-items: flex-start;
      padding: 1.5rem;
    }
    
    .tracking-code-section {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
    
    .tracking-code-title {
      font-size: 1.25rem;
    }
    
    .details-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .detail-card {
      padding: 1rem;
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