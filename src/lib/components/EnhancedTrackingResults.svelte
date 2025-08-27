<script>
  import TrackingMap from './TrackingMap.svelte';
  import CustodyChain from './CustodyChain.svelte';
  import ProductDetails from './ProductDetails.svelte';

  export let trackingData;

  function getStatusColor(status) {
    switch (status) {
      case 'pickup':
        return 'status-pickup';
      case 'in-transit':
        return 'status-in-transit';
      case 'customs':
        return 'status-customs';
      case 'delayed':
        return 'status-delayed';
      case 'delivered':
        return 'status-delivered';
      case 'returned':
        return 'status-returned';
      default:
        return 'status-pending';
    }
  }

  function getStatusIcon(status) {
    switch (status) {
      case 'pickup':
        return 'M13 10V3L4 14h7v7l9-11h-7z';
      case 'in-transit':
        return 'M13 10V3L4 14h7v7l9-11h-7z';
      case 'customs':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'delayed':
        return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'delivered':
        return 'M5 13l4 4L19 7';
      case 'returned':
        return 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6';
      default:
        return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  function formatDate(dateString) {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getProgressPercentage() {
    const statuses = ['pending', 'pickup', 'in-transit', 'customs', 'delivered'];
    const currentIndex = statuses.indexOf(trackingData.journey_status);
    return Math.round(((currentIndex + 1) / statuses.length) * 100);
  }
</script>

<div class="space-y-6">
  <!-- Journey Overview Header -->
  <div class="card">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <div class="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getStatusIcon(trackingData.journey_status)}></path>
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">
            Tracking Code: {trackingData.trackingCode}
          </h2>
          <div class="flex items-center space-x-2 mt-1">
            <span class="status-badge {getStatusColor(trackingData.journey_status)}">
              {trackingData.journey_status.replace('-', ' ').toUpperCase()}
            </span>
            <span class="text-sm text-gray-600">• Security Level: {trackingData.security_level}</span>
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

    <!-- Journey Progress Bar -->
    <div class="mb-6">
      <div class="flex justify-between text-sm text-gray-600 mb-2">
        <span>Journey Progress</span>
        <span>{getProgressPercentage()}% Complete</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div class="bg-gradient-to-r from-gold-400 to-gold-600 h-2 rounded-full transition-all duration-500" 
             style="width: {getProgressPercentage()}%"></div>
      </div>
      <div class="flex justify-between text-xs text-gray-500 mt-1">
        <span>Pickup</span>
        <span>In Transit</span>
        <span>Customs</span>
        <span>Delivered</span>
      </div>
    </div>

    <!-- Journey Route Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Origin -->
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-l-4 border-blue-400">
        <div class="flex items-center space-x-2 mb-3">
          <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <span class="font-semibold text-blue-900">Origin</span>
        </div>
        <h3 class="font-medium text-blue-900 mb-1">{trackingData.origin_facility || 'Origin Facility'}</h3>
        <p class="text-blue-700 text-sm mb-2">
          {trackingData.origin_location?.address || 'Address TBD'}
        </p>
        <p class="text-blue-600 text-xs">
          {trackingData.origin_location?.city || 'City'}, {trackingData.origin_location?.country || 'Country'}
        </p>
        {#if trackingData.pickup_date}
          <p class="text-blue-500 text-xs mt-2">
            📅 Picked up: {formatDate(trackingData.pickup_date)}
          </p>
        {/if}
        {#if trackingData.origin_guardian}
          <p class="text-blue-600 text-xs mt-1">
            👤 Guardian: {trackingData.origin_guardian}
          </p>
        {/if}
      </div>

      <!-- Current Location -->
      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-l-4 border-green-400">
        <div class="flex items-center space-x-2 mb-3">
          <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <span class="font-semibold text-green-900">Current</span>
        </div>
        <h3 class="font-medium text-green-900 mb-1">{trackingData.current_facility || 'Current Location'}</h3>
        <p class="text-green-700 text-sm mb-2">
          {trackingData.current_location?.address || 'Address TBD'}
        </p>
        <p class="text-green-600 text-xs">
          {trackingData.current_location?.city || 'City'}, {trackingData.current_location?.country || 'Country'}
        </p>
        {#if trackingData.current_guardian}
          <p class="text-green-600 text-xs mt-1">
            👤 Guardian: {trackingData.current_guardian}
          </p>
        {/if}
        <p class="text-green-500 text-xs mt-2">
          🕒 Last updated: {formatDate(trackingData.last_updated)}
        </p>
      </div>

      <!-- Destination -->
      <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border-l-4 border-purple-400">
        <div class="flex items-center space-x-2 mb-3">
          <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <span class="font-semibold text-purple-900">Destination</span>
        </div>
        <h3 class="font-medium text-purple-900 mb-1">{trackingData.destination_facility || 'Destination Facility'}</h3>
        <p class="text-purple-700 text-sm mb-2">
          {trackingData.destination_location?.address || 'Address TBD'}
        </p>
        <p class="text-purple-600 text-xs">
          {trackingData.destination_location?.city || 'City'}, {trackingData.destination_location?.country || 'Country'}
        </p>
        {#if trackingData.recipient_name}
          <p class="text-purple-600 text-xs mt-1">
            📦 Recipient: {trackingData.recipient_name}
          </p>
        {/if}
        {#if trackingData.estimated_delivery}
          <p class="text-purple-500 text-xs mt-2">
            🎯 ETA: {formatDate(trackingData.estimated_delivery)}
          </p>
        {/if}
      </div>
    </div>
  </div>

  <!-- Product Details -->
  <ProductDetails {trackingData} />

  <!-- Enhanced Map and Journey Details -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Journey Route Map</h3>
      <TrackingMap {trackingData} />
    </div>

    <div class="card">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Security & Verification</h3>
      <div class="space-y-4">
        <!-- Security Level -->
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span class="text-sm font-medium text-gray-700">Security Level</span>
          <span class="px-3 py-1 text-xs font-medium rounded-full 
            {trackingData.security_level === 'maximum' ? 'bg-red-100 text-red-800' : 
              trackingData.security_level === 'high' ? 'bg-orange-100 text-orange-800' : 
              'bg-green-100 text-green-800'}">
            {trackingData.security_level?.toUpperCase() || 'STANDARD'}
          </span>
        </div>

        <!-- Verification Status -->
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span class="text-sm font-medium text-gray-700">Verification Status</span>
          <span class="px-3 py-1 text-xs font-medium rounded-full 
            {trackingData.verification_status === 'verified' ? 'bg-green-100 text-green-800' : 
              trackingData.verification_status === 'failed' ? 'bg-red-100 text-red-800' : 
              'bg-yellow-100 text-yellow-800'}">
            {trackingData.verification_status?.toUpperCase() || 'PENDING'}
          </span>
        </div>

        <!-- Custody Chain -->
        <div class="border-t border-gray-200 pt-4">
          <h4 class="text-md font-medium text-gray-900 mb-3">Custody Chain</h4>
          <CustodyChain {trackingData} />
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .status-pickup { @apply bg-blue-100 text-blue-800; }
  .status-in-transit { @apply bg-green-100 text-green-800; }
  .status-customs { @apply bg-yellow-100 text-yellow-800; }
  .status-delayed { @apply bg-red-100 text-red-800; }
  .status-delivered { @apply bg-purple-100 text-purple-800; }
  .status-returned { @apply bg-gray-100 text-gray-800; }
  .status-pending { @apply bg-gray-100 text-gray-800; }
</style>
