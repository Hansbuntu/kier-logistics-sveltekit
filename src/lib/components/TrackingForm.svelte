<script>
  import { createEventDispatcher } from 'svelte';
  import { trackingStore } from '$lib/stores/trackingStore.js';
  
  const dispatch = createEventDispatcher();

  let trackingCode = '';
  let isValid = false;
  let error = '';
  let loading = false;

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

  async function handleSubmit() {
    if (!isValid) {
      error = 'Please enter a valid tracking code in format: XXX-XXXX-XXXX';
      return;
    }
    
    loading = true;
    error = '';
    
    try {
      console.log('🔍 Fetching tracking data for:', trackingCode);
      const response = await fetch(`/api/tracking/${trackingCode}`);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch tracking information');
      }
      
      const data = await response.json();
      console.log('✅ Tracking data received:', data);
      
      // Update the store
      trackingStore.set(data);
      
      // Dispatch event for parent component
      dispatch('submit', trackingCode);
      
    } catch (err) {
      console.error('❌ Tracking error:', err);
      error = err instanceof Error ? err.message : 'An unexpected error occurred';
      trackingStore.set(null);
    } finally {
      loading = false;
    }
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }
</script>

<div class="card">
  <div class="text-center mb-6">
    <div class="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
          style="color: #1f2937 !important; background-color: white !important; border: 2px solid #d1d5db !important;"
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
      disabled={!isValid || loading}
      class="btn-primary w-full {loading ? 'opacity-75 cursor-not-allowed' : ''}"
    >
      {#if loading}
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading...
      {:else}
        Track Shipment
      {/if}
    </button>
  </form>
</div>

<style>
  .card {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(30, 58, 138, 0.1);
  }
  
  .input-field {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #d1d5db;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background-color: white;
    color: #1f2937;
  }
  
  .input-field:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .input-field::placeholder {
    color: #9ca3af;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    color: #1e3a8a;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
    min-height: 48px;
  }
  
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(251, 191, 36, 0.4);
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }
  
  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  /* Mobile improvements */
  @media (max-width: 768px) {
    .card {
      padding: 1.5rem;
    }
    
    .input-field {
      font-size: 16px; /* Prevents zoom on iOS */
      min-height: 48px;
    }
    
    .btn-primary {
      min-height: 48px;
      padding: 1rem 1.5rem;
    }
  }
</style> 