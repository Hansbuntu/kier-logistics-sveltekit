<script>
  import { onMount } from 'svelte';
  import { trackingStore } from '$lib/stores/trackingStore';
  import Footer from '$lib/components/Footer.svelte';

  let trackingHistory = [];
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      // Mock tracking history data
      trackingHistory = [
        {
          id: 'TRACK-001',
          trackingCode: 'ABC-1234-DEF5',
          status: 'delivered',
          origin: 'London, UK',
          destination: 'Zurich, Switzerland',
          deliveredAt: '2024-01-16T08:00:00Z',
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: 'TRACK-002',
          trackingCode: 'XYZ-5678-9ABC',
          status: 'in-transit',
          origin: 'Zurich, Switzerland',
          destination: 'Dubai, UAE',
          estimatedDelivery: '2024-01-18T12:00:00Z',
          createdAt: '2024-01-17T14:00:00Z'
        }
      ];
      loading = false;
    } catch (err) {
      error = 'Failed to load tracking history';
      loading = false;
    }
  });

  function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
  }

  function getStatusColor(status) {
    switch (status) {
      case 'in-transit':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      case 'customs':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

<svelte:head>
  <title>Tracking History - Kier Logistics</title>
  <meta name="description" content="View your complete tracking history and shipment status updates." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-50 via-gold-50 to-gray-100">
  <!-- Header -->
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Tracking History</h1>
            <p class="text-sm text-gray-600">Your shipment tracking records</p>
          </div>
        </div>
        <a href="/" class="btn-secondary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Tracker
        </a>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-4">
        Your Tracking History
      </h2>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        View all your previous shipments and their current status
      </p>
    </div>

    <!-- Loading State -->
    {#if loading}
      <div class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="loading-spinner mx-auto mb-4"></div>
          <p class="text-gray-600">Loading tracking history...</p>
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
        </div>
      </div>
    {/if}

    <!-- Tracking History List -->
    {#if trackingHistory.length > 0}
      <div class="space-y-4">
        {#each trackingHistory as item}
          <div class="card hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getStatusIcon(item.status)}></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    {item.trackingCode}
                  </h3>
                  <div class="flex items-center space-x-2 mt-1">
                    <span class="status-badge {getStatusColor(item.status)}">
                      {item.status.replace('-', ' ').toUpperCase()}
                    </span>
                    <span class="text-sm text-gray-500">
                      {item.origin} → {item.destination}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="text-right">
                <p class="text-sm text-gray-500">
                  {item.status === 'delivered' ? 'Delivered' : 'Created'}
                </p>
                <p class="text-sm font-medium text-gray-900">
                  {formatDate(item.status === 'delivered' ? item.deliveredAt : item.createdAt)}
                </p>
              </div>
            </div>
            
            <div class="mt-4 pt-4 border-t border-gray-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <a href="/tracking/{item.trackingCode}" class="btn-primary">
                    View Details
                  </a>
                  <button class="btn-secondary">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    Copy Code
                  </button>
                </div>
                
                {#if item.status === 'delivered'}
                  <div class="flex items-center space-x-2 text-green-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="text-sm font-medium">Successfully Delivered</span>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    {:else if !loading}
      <div class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No tracking history yet</h3>
        <p class="text-gray-500 mb-6">Start tracking your first shipment to see it here</p>
        <a href="/" class="btn-primary">
          Track a Shipment
        </a>
      </div>
    {/if}
  </main>

  <!-- Footer -->
  <Footer />
</div> 