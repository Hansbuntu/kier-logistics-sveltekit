<script>
  import { trackingStore } from '$lib/stores/trackingStore';
  import { goto } from '$app/navigation';
  
  let trackingData = null;
  
  // Subscribe to tracking store
  trackingStore.subscribe((data) => {
    trackingData = data;
  });
  
  // Define shipment stages
  const shipmentStages = [
    { id: 'package-received', name: 'Package Received', icon: '📦' },
    { id: 'security-verification', name: 'Security Verification', icon: '🔒' },
    { id: 'in-transit', name: 'In Transit', icon: '🚚' },
    { id: 'customs', name: 'Customs', icon: '🏛️' },
    { id: 'out-for-delivery', name: 'Out for Delivery', icon: '🚛' },
    { id: 'delivered', name: 'Delivered', icon: '✅' }
  ];
  
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
      case 'security-verification': return 'text-yellow-600 bg-yellow-100';
      case 'package-received': return 'text-purple-600 bg-purple-100';
      case 'customs': return 'text-orange-600 bg-orange-100';
      case 'out-for-delivery': return 'text-indigo-600 bg-indigo-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }
  
  function getCurrentStageIndex() {
    if (!trackingData) return 0;
    const currentStatus = trackingData.journeyStatus || trackingData.delivery?.currentStatus || 'pending';
    return shipmentStages.findIndex(stage => stage.id === currentStatus) || 0;
  }
  
  function getNextUpdateTime() {
    if (!trackingData) return null;
    const currentStatus = trackingData.journeyStatus || trackingData.delivery?.currentStatus || 'pending';
    
    switch (currentStatus) {
      case 'package-received':
        return 'Next update expected within 2-4 hours during security verification';
      case 'security-verification':
        return 'Next update expected within 4-6 hours when transit begins';
      case 'in-transit':
        return 'Next update expected every 6-8 hours during transit';
      case 'customs':
        return 'Next update expected within 12-24 hours after customs clearance';
      case 'out-for-delivery':
        return 'Next update expected within 1-2 hours upon delivery';
      default:
        return 'Regular updates every 6-8 hours';
    }
  }
  
  function getConfidenceLevel() {
    if (!trackingData) return 'Low';
    const currentStatus = trackingData.journeyStatus || trackingData.delivery?.currentStatus || 'pending';
    
    switch (currentStatus) {
      case 'delivered':
        return '100%';
      case 'out-for-delivery':
        return '95%';
      case 'in-transit':
        return '85%';
      case 'customs':
        return '70%';
      case 'security-verification':
        return '60%';
      default:
        return '50%';
    }
  }
  
  function shareTracking() {
    if (!trackingData) return;
    const shareUrl = `${window.location.origin}/tracking/${trackingData.trackingCode}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Track Your Shipment - Kier Logistics',
        text: `Track your shipment ${trackingData.trackingCode} with Kier Logistics`,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Tracking link copied to clipboard!');
    }
  }
  
  function viewFullDetails() {
    if (trackingData?.trackingCode) {
      goto(`/tracking/${trackingData.trackingCode}`);
    }
  }
  
  function getSpecialHandlingNotes() {
    if (!trackingData) return [];
    const notes = [];
    
    if (trackingData.securityLevel === 'maximum') {
      notes.push('🔒 Maximum security protocol - Armed escort required');
    }
    if (trackingData.product?.type?.toLowerCase().includes('gold')) {
      notes.push('🥇 High-value precious metals - Special handling required');
    }
    if (trackingData.verificationStatus === 'verified') {
      notes.push('✅ Security verification completed');
    }
    if (trackingData.product?.weight > 1) {
      notes.push('⚖️ Heavy package - Special transport arrangements');
    }
    
    return notes;
  }
</script>

{#if trackingData}
  <div class="enhanced-tracking-results">
    <!-- Header with Tracking Code and Status -->
    <div class="tracking-header">
      <div class="header-left">
        <h3 class="tracking-code">Tracking: {trackingData.trackingCode}</h3>
        <div class="status-badge {getStatusColor(trackingData.journeyStatus || trackingData.delivery?.currentStatus)}">
          {trackingData.journeyStatus || trackingData.delivery?.currentStatus || 'Processing'}
        </div>
      </div>
      <div class="header-right">
        <button class="share-btn" on:click={shareTracking}>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
          </svg>
          Share
        </button>
      </div>
    </div>
    
    <!-- Progress Timeline -->
    <div class="progress-section">
      <h4 class="section-title">Shipment Progress</h4>
      <div class="progress-timeline">
        {#each shipmentStages as stage, index}
          {@const isCompleted = index <= getCurrentStageIndex()}
          {@const isCurrent = index === getCurrentStageIndex()}
          <div class="timeline-step {isCompleted ? 'completed' : ''} {isCurrent ? 'current' : ''}">
            <div class="step-marker">
              <div class="step-icon">{stage.icon}</div>
            </div>
            <div class="step-content">
              <div class="step-name">{stage.name}</div>
              {#if isCurrent}
                <div class="step-status">Current Status</div>
              {:else if isCompleted}
                <div class="step-status">Completed</div>
              {/if}
            </div>
            {#if index < shipmentStages.length - 1}
              <div class="step-connector {isCompleted ? 'completed' : ''}"></div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
    
    <!-- Current Status Details -->
    <div class="status-details">
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">Current Location:</span>
          <span class="detail-value">{trackingData.currentLocation?.address || 'Processing Center'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Facility:</span>
          <span class="detail-value">{trackingData.currentFacility || trackingData.currentLocation?.facility || 'Kier Logistics Hub'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Guardian:</span>
          <span class="detail-value">{trackingData.currentGuardian || 'Security Team'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Last Updated:</span>
          <span class="detail-value">{formatDate(trackingData.lastUpdated)}</span>
        </div>
      </div>
    </div>
    
    <!-- Next Update Information -->
    <div class="next-update">
      <div class="update-info">
        <h4 class="update-title">Next Update Expected</h4>
        <p class="update-text">{getNextUpdateTime()}</p>
      </div>
    </div>
    
    <!-- Delivery Information -->
    {#if trackingData.delivery?.estimatedDelivery}
      <div class="delivery-info">
        <div class="delivery-header">
          <h4 class="delivery-title">Estimated Delivery</h4>
          <div class="confidence-badge">
            {getConfidenceLevel()} Confidence
          </div>
        </div>
        <div class="delivery-details">
          <div class="delivery-date">
            {formatDate(trackingData.delivery.estimatedDelivery)}
          </div>
          {#if trackingData.destination?.recipientName}
            <div class="recipient-info">
              <strong>Recipient:</strong> {trackingData.destination.recipientName}
            </div>
          {/if}
          {#if trackingData.destination?.location?.address}
            <div class="delivery-address">
              <strong>Delivery Address:</strong> {trackingData.destination.location.address}
            </div>
          {/if}
        </div>
      </div>
    {/if}
    
    <!-- Special Handling Notes -->
    {#if getSpecialHandlingNotes().length > 0}
      <div class="special-handling">
        <h4 class="handling-title">Special Handling Notes</h4>
        <div class="handling-notes">
          {#each getSpecialHandlingNotes() as note}
            <div class="handling-note">{note}</div>
          {/each}
        </div>
      </div>
    {/if}
    
    <!-- Customer Service -->
    <div class="customer-service">
      <h4 class="service-title">Need Help?</h4>
      <div class="service-options">
        <div class="service-item">
          <span class="service-icon">📞</span>
          <div class="service-details">
            <div class="service-name">Call Customer Service</div>
            <div class="service-info">+1 (234) 567-890</div>
          </div>
        </div>
        <div class="service-item">
          <span class="service-icon">💬</span>
          <div class="service-details">
            <div class="service-name">Live Chat</div>
            <div class="service-info">Available 24/7</div>
          </div>
        </div>
        <div class="service-item">
          <span class="service-icon">📧</span>
          <div class="service-details">
            <div class="service-name">Email Support</div>
            <div class="service-info">support@kierlogics.com</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="action-buttons">
      <button class="btn-primary" on:click={viewFullDetails}>
        View Full Details & Map
      </button>
      <button class="btn-secondary" on:click={shareTracking}>
        Share Tracking Link
      </button>
    </div>
  </div>
{/if}

<style>
  .enhanced-tracking-results {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(30, 58, 138, 0.1);
    margin-top: 2rem;
  }
  
  .tracking-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f3f4f6;
  }
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .tracking-code {
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
  
  .share-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #f3f4f6;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    color: #4b5563;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .share-btn:hover {
    background: #e5e7eb;
    color: #1e3a8a;
  }
  
  .progress-section {
    margin-bottom: 2rem;
  }
  
  .section-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e3a8a;
    margin: 0 0 1rem 0;
  }
  
  .progress-timeline {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: relative;
  }
  
  .timeline-step {
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
  }
  
  .step-marker {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f3f4f6;
    border: 3px solid #e5e7eb;
    transition: all 0.3s ease;
    flex-shrink: 0;
  }
  
  .step-icon {
    font-size: 1.25rem;
  }
  
  .timeline-step.completed .step-marker {
    background: #10b981;
    border-color: #059669;
    color: white;
  }
  
  .timeline-step.current .step-marker {
    background: #3b82f6;
    border-color: #2563eb;
    color: white;
    animation: pulse 2s infinite;
  }
  
  .step-content {
    flex: 1;
  }
  
  .step-name {
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }
  
  .step-status {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .step-connector {
    position: absolute;
    left: 1.5rem;
    top: 3rem;
    width: 2px;
    height: 1rem;
    background: #e5e7eb;
    transition: all 0.3s ease;
  }
  
  .step-connector.completed {
    background: #10b981;
  }
  
  .status-details {
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
  }
  
  .detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .detail-label {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
  }
  
  .detail-value {
    font-size: 0.875rem;
    color: #1f2937;
    font-weight: 600;
  }
  
  .next-update {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
  }
  
  .update-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1e40af;
    margin: 0 0 0.5rem 0;
  }
  
  .update-text {
    color: #1e40af;
    margin: 0;
    font-size: 0.875rem;
  }
  
  .delivery-info {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
  }
  
  .delivery-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .delivery-title {
    font-size: 1rem;
    font-weight: 600;
    color: #065f46;
    margin: 0;
  }
  
  .confidence-badge {
    background: #059669;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
  }
  
  .delivery-date {
    font-size: 1.125rem;
    font-weight: 700;
    color: #065f46;
    margin-bottom: 0.5rem;
  }
  
  .recipient-info,
  .delivery-address {
    font-size: 0.875rem;
    color: #047857;
    margin-bottom: 0.25rem;
  }
  
  .special-handling {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
  }
  
  .handling-title {
    font-size: 1rem;
    font-weight: 600;
    color: #92400e;
    margin: 0 0 1rem 0;
  }
  
  .handling-notes {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .handling-note {
    font-size: 0.875rem;
    color: #92400e;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 6px;
  }
  
  .customer-service {
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
  }
  
  .service-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1e3a8a;
    margin: 0 0 1rem 0;
  }
  
  .service-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .service-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }
  
  .service-icon {
    font-size: 1.25rem;
  }
  
  .service-name {
    font-weight: 600;
    color: #1f2937;
    font-size: 0.875rem;
  }
  
  .service-info {
    color: #6b7280;
    font-size: 0.75rem;
  }
  
  .action-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    color: #1e3a8a;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    flex: 1;
    min-width: 200px;
  }
  
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(251, 191, 36, 0.4);
  }
  
  .btn-secondary {
    background: #1e3a8a;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    flex: 1;
    min-width: 200px;
  }
  
  .btn-secondary:hover {
    background: #1e40af;
    transform: translateY(-1px);
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  /* Mobile Responsive */
  @media (max-width: 768px) {
    .enhanced-tracking-results {
      padding: 1.5rem;
    }
    
    .tracking-header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }
    
    .header-left {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
    
    .tracking-code {
      font-size: 1.25rem;
    }
    
    .detail-grid {
      grid-template-columns: 1fr;
    }
    
    .service-options {
      grid-template-columns: 1fr;
    }
    
    .action-buttons {
      flex-direction: column;
    }
    
    .btn-primary,
    .btn-secondary {
      min-width: auto;
    }
  }
</style>