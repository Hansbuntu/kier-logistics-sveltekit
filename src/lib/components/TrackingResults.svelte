<script>
  import { trackingStore } from '$lib/stores/trackingStore';
  import { goto } from '$app/navigation';
  
  let trackingData = null;
  
  // Subscribe to tracking store
  trackingStore.subscribe((data) => {
    trackingData = data;
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
  
  function viewFullDetails() {
    if (trackingData?.trackingCode) {
      goto(`/tracking/${trackingData.trackingCode}`);
    }
  }
</script>

{#if trackingData}
  <div class="tracking-results">
    <div class="results-header">
      <h3 class="results-title">Tracking Results</h3>
      <div class="tracking-code-badge">
        {trackingData.trackingCode}
      </div>
    </div>
    
    <div class="results-content">
      <!-- Product Information -->
      <div class="info-section">
        <h4 class="section-title">Product Information</h4>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Type:</span>
            <span class="info-value">{trackingData.product?.type || 'Gold Shipment'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Weight:</span>
            <span class="info-value">{trackingData.product?.weight || 0} {trackingData.product?.weightUnit || 'kg'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Purity:</span>
            <span class="info-value">{trackingData.product?.purity || 999.5} {trackingData.product?.purityUnit || '999.5'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Serial Number:</span>
            <span class="info-value">{trackingData.product?.serialNumber || 'Pending'}</span>
          </div>
        </div>
      </div>
      
      <!-- Current Status -->
      <div class="info-section">
        <h4 class="section-title">Current Status</h4>
        <div class="status-container">
          <div class="status-badge {getStatusColor(trackingData.delivery?.currentStatus)}">
            {trackingData.delivery?.currentStatus || 'Processing'}
          </div>
          <div class="status-details">
            <p class="status-location">
              <strong>Location:</strong> {trackingData.currentLocation?.address || 'Processing Center'}
            </p>
            <p class="status-facility">
              <strong>Facility:</strong> {trackingData.currentLocation?.facility || 'Kier Logistics Hub'}
            </p>
            {#if trackingData.delivery?.estimatedDelivery}
              <p class="status-eta">
                <strong>Estimated Delivery:</strong> {formatDate(trackingData.delivery.estimatedDelivery)}
              </p>
            {/if}
          </div>
        </div>
      </div>
      
      <!-- Recent Activity -->
      {#if trackingData.custodyChain && trackingData.custodyChain.length > 0}
        <div class="info-section">
          <h4 class="section-title">Recent Activity</h4>
          <div class="activity-list">
            {#each trackingData.custodyChain.slice(-3) as entry}
              <div class="activity-item">
                <div class="activity-time">{formatDate(entry.timestamp)}</div>
                <div class="activity-description">
                  <strong>{entry.guardianName}</strong> - {entry.location?.address || 'Unknown Location'}
                </div>
                <div class="activity-status {getStatusColor(entry.status)}">
                  {entry.status}
    </div>
        </div>
            {/each}
      </div>
        </div>
        {/if}
      </div>

    <div class="results-actions">
      <button class="btn-secondary" on:click={viewFullDetails}>
        View Full Details
      </button>
    </div>
  </div>
{/if}

<style>
  .tracking-results {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(30, 58, 138, 0.1);
    margin-top: 2rem;
  }
  
  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f3f4f6;
  }
  
  .results-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e3a8a;
    margin: 0;
  }
  
  .tracking-code-badge {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    color: #1e3a8a;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.875rem;
    letter-spacing: 0.5px;
  }
  
  .results-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .info-section {
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
  }
  
  .section-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e3a8a;
    margin: 0 0 1rem 0;
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
    font-size: 1rem;
    color: #1f2937;
    font-weight: 600;
  }
  
  .status-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .status-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    width: fit-content;
  }
  
  .status-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .status-location,
  .status-facility,
  .status-eta {
    margin: 0;
    font-size: 0.875rem;
    color: #4b5563;
  }
  
  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .activity-item {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .activity-time {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 500;
  }
  
  .activity-description {
    font-size: 0.875rem;
    color: #1f2937;
  }
  
  .activity-status {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    width: fit-content;
  }
  
  .results-actions {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 2px solid #f3f4f6;
    display: flex;
    justify-content: center;
  }
  
  .btn-secondary {
    background: #1e3a8a;
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .btn-secondary:hover {
    background: #1e40af;
    transform: translateY(-1px);
  }
  
  /* Mobile Responsive */
  @media (max-width: 768px) {
    .tracking-results {
      padding: 1.5rem;
      margin-top: 1.5rem;
    }
    
    .results-header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }
    
    .info-grid {
      grid-template-columns: 1fr;
    }
    
    .status-container {
      gap: 0.75rem;
    }
    
    .activity-item {
      padding: 0.75rem;
    }
  }
</style>