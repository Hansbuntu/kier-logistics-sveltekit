<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  let trackingCode = '';
  let isValid = false;
  let error = '';

  // Enhanced validation for new format: XXX-XXXX-XXXX
  // Character set: [A-HJ-NP-Z0-9] (no ambiguous chars like 0/O)
  function validateTrackingCode(code) {
    const pattern = /^[A-HJ-NP-Z0-9]{3}-[A-HJ-NP-Z0-9]{4}-[A-HJ-NP-Z0-9]{4}$/;
    return pattern.test(code);
  }

  function handleInput() {
    // Convert to uppercase and remove spaces
    trackingCode = trackingCode.toUpperCase().replace(/\s/g, '');
    
    // Auto-insert hyphens at correct positions
    if (trackingCode.length >= 3 && !trackingCode.includes('-')) {
      trackingCode = trackingCode.slice(0, 3) + '-' + trackingCode.slice(3);
    }
    if (trackingCode.length >= 8 && trackingCode.split('-').length === 2) {
      trackingCode = trackingCode.slice(0, 8) + '-' + trackingCode.slice(8);
    }
    
    // Limit total length to 14 (including hyphens)
    if (trackingCode.length > 14) {
      trackingCode = trackingCode.slice(0, 14);
    }
    
    isValid = validateTrackingCode(trackingCode);
    error = '';
  }

  function handleSubmit() {
    if (!isValid) {
      error = 'Please enter a valid tracking code in format: XXX-XXXX-XXXX';
      return;
    }
    
    dispatch('submit', trackingCode);
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }
</script>

<div class="card">
  <div class="text-center mb-6">
    <div class="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
    </div>
    <h3 class="text-xl font-semibold text-gray-900 mb-2">Enter Tracking Code</h3>
    <p class="text-gray-600">Format: XXX-XXXX-XXXX (e.g., ABC-1234-DEF5)</p>
  </div>

  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label for="tracking-code" class="block text-sm font-medium text-gray-700 mb-2">
        Tracking Code
      </label>
      <div class="relative">
        <input
          id="tracking-code"
          type="text"
          bind:value={trackingCode}
          on:input={handleInput}
          on:keypress={handleKeyPress}
          placeholder="ABC-1234-DEF5"
          class="input-field pr-12 {isValid ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''}"
          maxlength="14"
          autocomplete="off"
        />
        {#if isValid}
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        {/if}
      </div>
      {#if error}
        <p class="mt-2 text-sm text-red-600">{error}</p>
      {/if}
      <p class="mt-2 text-sm text-gray-500">
        Enter the 12-digit tracking code provided with your shipment
      </p>
    </div>

    <button
      type="submit"
      disabled={!isValid}
      class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span class="flex items-center justify-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        Track Shipment
      </span>
    </button>
  </form>
</div> 