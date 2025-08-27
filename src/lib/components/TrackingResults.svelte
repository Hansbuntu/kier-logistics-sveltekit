<script>
  import TrackingMap from './TrackingMap.svelte';
  import CustodyChain from './CustodyChain.svelte';
  import ProductDetails from './ProductDetails.svelte';

  export let trackingData;

  function getStatusColor(status) {
    switch (status) {
      case 'in-transit':
        return 'status-in-transit';
      case 'delivered':
        return 'status-delivered';
      case 'delayed':
        return 'status-delayed';
      case 'customs':
        return 'status-customs';
      default:
        return 'status-in-transit';
    }
  }

  function getStatusIcon(status) {
    switch (status) {
      case 'in-transit':
        return 'M13 10V3L4 14h7v7l9-11h-7z';
      case 'delivered':
        return 'M5 13l4 4L19 7';
      case 'delayed':
        return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'customs':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      default:
        return 'M13 10V3L4 14h7v7l9-11h-7z';
    }
  }
</script>

<div class="space-y-6">
  <!-- Status Header -->
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div class="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getStatusIcon(trackingData.delivery.currentStatus)}></path>
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">
            Tracking Code: {trackingData.trackingCode}
          </h2>
          <div class="flex items-center space-x-2 mt-1">
            <span class="status-badge {getStatusColor(trackingData.delivery.currentStatus)}">
              {trackingData.delivery.currentStatus.replace('-', ' ').toUpperCase()}
            </span>
            {#if trackingData.delivery.delayReason}
              <span class="text-sm text-red-600">• Delayed</span>
            {/if}
          </div>
        </div>
      </div>
      
      <!-- Refresh Button -->
      <button
        on:click={() => window.dispatchEvent(new CustomEvent('refreshTracking', { detail: trackingData.trackingCode }))}
        class="btn-secondary text-sm"
        title="Refresh tracking data"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Refresh
      </button>
    </div>

    <!-- Current Location -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="flex items-center space-x-2 mb-2">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span class="font-medium text-gray-900">Current Location</span>
        </div>
        <p class="text-gray-700">
          {trackingData.currentLocation.address}
        </p>
        <p class="text-sm text-gray-600 mt-1">
          {trackingData.currentLocation.city}, {trackingData.currentLocation.country}
        </p>
      </div>

      <div class="bg-gray-50 rounded-lg p-4">
        <div class="flex items-center space-x-2 mb-2">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="font-medium text-gray-900">Estimated Delivery</span>
        </div>
        <p class="text-gray-700">{trackingData.delivery.estimatedDelivery}</p>
        {#if trackingData.delivery.etaHours}
          <p class="text-sm text-gray-600 mt-1">
            ~{trackingData.delivery.etaHours} hours remaining
          </p>
        {/if}
      </div>

      <div class="bg-gray-50 rounded-lg p-4">
        <div class="flex items-center space-x-2 mb-2">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <span class="font-medium text-gray-900">Last Custodian</span>
        </div>
        <p class="text-gray-700">
          {trackingData.custodyChain[trackingData.custodyChain.length - 1]?.guardianName}
        </p>
        <p class="text-sm text-gray-600 mt-1">
          Verified {trackingData.custodyChain[trackingData.custodyChain.length - 1]?.timestamp}
        </p>
      </div>
    </div>
  </div>

  <!-- Product Details -->
  <ProductDetails {trackingData} />

  <!-- Map and Custody Chain -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Live Location Map</h3>
      <TrackingMap {trackingData} />
    </div>

    <div class="card">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Custody Chain</h3>
      <CustodyChain {trackingData} />
    </div>
  </div>
</div> 