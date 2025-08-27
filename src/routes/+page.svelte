<script>
  import TrackingForm from '$lib/components/TrackingForm.svelte';
  import TrackingResults from '$lib/components/TrackingResults.svelte';
  import { trackingStore } from '$lib/stores/trackingStore';
  import Footer from '$lib/components/Footer.svelte';

  let trackingData = null;
  let loading = false;
  let error = null;
  let notification = null;

  trackingStore.subscribe((data) => {
    trackingData = data;
    console.log('📊 Tracking data updated:', data);
    if (data?.product?.photos) {
      console.log('📸 PHOTOS RECEIVED IN STORE:');
      console.log('📸 Photos array:', data.product.photos);
      console.log('📸 Photos length:', data.product.photos.length);
      console.log('📸 Photos type:', typeof data.product.photos);
    } else {
      console.log('❌ NO PHOTOS FOUND IN TRACKING DATA');
    }
  });

  async function handleTrackingSubmit(trackingCode) {
    loading = true;
    error = null;
    
    try {
      console.log('🔍 Fetching tracking data for:', trackingCode);
      console.log('🔗 API URL:', `/api/tracking/${trackingCode}`);
      
      const response = await fetch(`/api/tracking/${trackingCode}`);
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      const data = await response.json();
      console.log('📊 Raw response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch tracking information');
      }
      
      console.log('✅ Tracking data received:', data);
      console.log('📸 PHOTO DEBUG IN MAIN PAGE:');
      console.log('📸 Data structure:', JSON.stringify(data, null, 2));
      console.log('📸 Product photos:', data?.product?.photos);
      console.log('📸 Photos length:', data?.product?.photos?.length);
      console.log('📸 Photos type:', typeof data?.product?.photos);
      trackingStore.set(data);
      
      // Show success notification
      showNotification('Tracking information loaded successfully!', 'success');
      
    } catch (err) {
      console.error('❌ Tracking error:', err);
      console.error('❌ Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      error = err instanceof Error ? err.message : 'An unexpected error occurred';
      trackingStore.set(null);
      showNotification(error, 'error');
    } finally {
      loading = false;
    }
  }

  function showNotification(message, type = 'info') {
    notification = { message, type, timestamp: Date.now() };
    setTimeout(() => notification = null, 5000);
  }

  // Listen for refresh events from tracking results
  function handleRefreshTracking(event) {
    const trackingCode = event.detail;
    if (trackingCode) {
      console.log('🔄 Refreshing tracking data for:', trackingCode);
      handleTrackingSubmit(trackingCode);
    }
  }

  // Listen for admin updates
  function handleAdminUpdate(event) {
    const { trackingCode, message } = event.detail;
    if (trackingCode && trackingData?.trackingCode === trackingCode) {
      // Auto-refresh if this tracking code is currently displayed
      console.log('🔄 Admin update detected, refreshing data...');
      handleTrackingSubmit(trackingCode);
      showNotification(message || 'Shipment updated successfully!', 'success');
    }
  }

  // Add event listeners when component mounts
  if (typeof window !== 'undefined') {
    window.addEventListener('refreshTracking', handleRefreshTracking);
    window.addEventListener('adminShipmentUpdated', handleAdminUpdate);
  }
</script>

<svelte:head>
  <title>Kier Logistics - Secure Gold Shipment Tracking</title>
  <meta name="description" content="Track your gold shipments securely with real-time location updates, custody chain verification, and high-resolution product images." />
  <meta name="keywords" content="gold tracking, shipment tracking, logistics, security, custody chain" />
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
            <h1 class="text-2xl font-bold text-gray-900">Kier Logistics</h1>
            <p class="text-sm text-gray-600">Secure shipment tracking</p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <a href="/tracking-history" class="btn-secondary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            History
          </a>
          <a href="/help" class="btn-secondary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Help
          </a>
        </div>
      </div>
      
      <!-- Notification Banner -->
      {#if notification}
        <div class="pb-4">
          <div class="bg-green-50 border border-green-200 rounded-md p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-green-800">{notification.message}</p>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Hero Section -->
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold text-gray-900 mb-4">
        Secure Gold Shipment Tracking
      </h2>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        Track your valuable gold shipments with military-grade security, real-time updates, and complete custody chain verification.
      </p>
    </div>

    <!-- Tracking Form -->
    <div class="max-w-2xl mx-auto mb-8">
      <TrackingForm on:submit={({ detail }) => handleTrackingSubmit(detail)} />
    </div>
    
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
        </div>
      </div>
    {/if}

    <!-- Tracking Results -->
    {#if trackingData}
      <TrackingResults {trackingData} />
    {/if}

    <!-- Features Section -->
    {#if !trackingData}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Secure Tracking</h3>
          <p class="text-gray-600">Military-grade encryption and secure tracking codes</p>
        </div>
        
        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Real-time Updates</h3>
          <p class="text-gray-600">Live location tracking and status updates</p>
        </div>
        
        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Complete Documentation</h3>
          <p class="text-gray-600">Full custody chain and product verification</p>
        </div>
      </div>
    {/if}
  </main>

  <!-- Notification Toast -->
  {#if notification}
    <div class="fixed top-4 right-4 z-50">
      <div class="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm transform transition-all duration-300 {notification.type === 'error' ? 'border-red-200 bg-red-50' : notification.type === 'success' ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}">
        <div class="flex items-center space-x-3">
          {#if notification.type === 'success'}
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          {:else if notification.type === 'error'}
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          {:else}
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          {/if}
          <div class="flex-1">
            <p class="text-sm font-medium {notification.type === 'error' ? 'text-red-800' : notification.type === 'success' ? 'text-green-800' : 'text-blue-800'}">
              {notification.message}
            </p>
          </div>
          <button
            on:click={() => notification = null}
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Footer -->
  <Footer />
</div> 