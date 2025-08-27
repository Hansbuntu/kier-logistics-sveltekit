<script>
  export let trackingData;

  let selectedPhotoIndex = 0;

  function formatWeight(weight, unit) {
    if (unit === 'kg') {
      return `${weight} kg`;
    } else if (unit === 'g') {
      return `${weight * 1000} g`;
    } else if (unit === 'oz') {
      return `${weight * 35.274} oz`;
    }
    return `${weight} ${unit}`;
  }

  function formatPurity(purity, unit) {
    return `${purity} (${unit})`;
  }

  // Debug logging for images
  $: if (trackingData?.product?.photos) {
    console.log('📸 Product photos detected:', trackingData.product.photos);
  }
</script>

<div class="card">
  <div class="flex items-center space-x-3 mb-6">
    <div class="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
      </svg>
    </div>
    <div>
      <h3 class="text-lg font-semibold text-gray-900">Product Details</h3>
      <p class="text-sm text-gray-600">Gold shipment specifications & images</p>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Product Information -->
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center space-x-2 mb-2">
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
            </svg>
            <span class="text-sm font-medium text-gray-700">Type</span>
          </div>
          <p class="text-lg font-semibold text-gray-900">{trackingData.product.type}</p>
        </div>

        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center space-x-2 mb-2">
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
            </svg>
            <span class="text-sm font-medium text-gray-700">Weight</span>
          </div>
          <p class="text-lg font-semibold text-gray-900">
            {formatWeight(trackingData.product.weight, trackingData.product.weightUnit)}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center space-x-2 mb-2">
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm font-medium text-gray-700">Purity</span>
          </div>
          <p class="text-lg font-semibold text-gold-600">
            {formatPurity(trackingData.product.purity, trackingData.product.purityUnit)}
          </p>
        </div>

        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center space-x-2 mb-2">
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
            </svg>
            <span class="text-sm font-medium text-gray-700">Serial Number</span>
          </div>
          <p class="text-sm font-mono text-gray-900">
            {trackingData.product.serialNumber}
          </p>
        </div>
      </div>

      {#if trackingData.product.description}
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center space-x-2 mb-2">
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span class="text-sm font-medium text-gray-700">Description</span>
          </div>
          <p class="text-gray-700">{trackingData.product.description}</p>
        </div>
      {/if}
    </div>

    <!-- Product Photos -->
    <div class="space-y-4">
      <div class="flex items-center space-x-2 mb-4">
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <span class="text-lg font-medium text-gray-700">Product Photos</span>
        {#if trackingData.product.photos && trackingData.product.photos.length > 0}
          <span class="bg-gold-100 text-gold-800 text-xs font-medium px-2 py-1 rounded-full">
            {trackingData.product.photos.length} photo{trackingData.product.photos.length !== 1 ? 's' : ''}
          </span>
        {/if}
      </div>

      {#if trackingData.product.photos && trackingData.product.photos.length > 0}
        <div class="space-y-4">
          <!-- Main Photo -->
          <div class="relative group">
            <img
              src={trackingData.product.photos[selectedPhotoIndex]}
              alt="Gold shipment product photo {selectedPhotoIndex + 1}"
              class="w-full h-80 object-cover rounded-xl border-2 border-gray-200 shadow-lg transition-all duration-300 group-hover:scale-[1.02]"
              on:error={(e) => {
                console.error('❌ Image failed to load:', e.target.src);
                e.target.src = 'https://via.placeholder.com/400x300/FFD700/000000?text=Image+Failed+to+Load';
              }}
            />
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-xl"></div>
          </div>

          <!-- Photo Thumbnails -->
          {#if trackingData.product.photos.length > 1}
            <div class="flex space-x-3 overflow-x-auto pb-2">
              {#each trackingData.product.photos as photo, index}
                <button
                  on:click={() => selectedPhotoIndex = index}
                  class="flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all duration-200 hover:scale-105 {selectedPhotoIndex === index ? 'border-gold-500 ring-2 ring-gold-200' : 'border-gray-200 hover:border-gray-300'}"
                >
                  <img
                    src={photo}
                    alt="Thumbnail {index + 1}"
                    class="w-full h-full object-cover"
                    on:error={(e) => {
                      console.error('❌ Thumbnail failed to load:', e.target.src);
                      e.target.src = 'https://via.placeholder.com/80x80/FFD700/000000?text=Error';
                    }}
                  />
                </button>
              {/each}
            </div>
          {/if}
        </div>
      {:else}
        <div class="w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
          <div class="text-center text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p class="text-lg font-medium mb-2">No Photos Available</p>
            <p class="text-sm text-gray-400">Product images will appear here when uploaded</p>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div> 