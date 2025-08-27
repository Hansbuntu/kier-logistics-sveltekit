<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import TrackingResults from '$lib/components/TrackingResults.svelte';
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
      <TrackingResults {trackingData} />
    {/if}
  </main>
</div> 