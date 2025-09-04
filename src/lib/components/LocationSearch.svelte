<script>
  import { onMount } from 'svelte';
  
  export let value = { latitude: 0, longitude: 0, address: '', city: '', country: '' };
  export let onLocationSelect = null;
  export let placeholder = 'Search for a location...';
  
  let searchInput = '';
  let searchResults = [];
  let isSearching = false;
  let showResults = false;
  
  onMount(() => {
    // Initialize with current value if available
    if (value.address) {
      searchInput = value.address;
    }
  });
  
  async function searchLocation() {
    if (!searchInput.trim()) {
      searchResults = [];
      showResults = false;
      return;
    }
    
    isSearching = true;
    
    try {
      // Use Nominatim (OpenStreetMap) geocoding service
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}&limit=5&addressdetails=1`
      );
      
      const data = await response.json();
      
      searchResults = data.map(result => ({
        display_name: result.display_name,
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        address: result.address || {},
        place_id: result.place_id
      }));
      
      showResults = true;
    } catch (error) {
      console.error('Location search error:', error);
      searchResults = [];
    } finally {
      isSearching = false;
    }
  }
  
  function selectLocation(location) {
    const newValue = {
      latitude: location.lat,
      longitude: location.lon,
      address: location.display_name,
      city: location.address.city || location.address.town || location.address.village || '',
      country: location.address.country || ''
    };
    
    value = newValue;
    searchInput = location.display_name;
    showResults = false;
    
    if (onLocationSelect) {
      onLocationSelect(newValue);
    }
  }
  
  function clearLocation() {
    value = { latitude: 0, longitude: 0, address: '', city: '', country: '' };
    searchInput = '';
    showResults = false;
    
    if (onLocationSelect) {
      onLocationSelect(value);
    }
  }
  
  function handleInput() {
    if (searchInput !== value.address) {
      showResults = false;
    }
  }
  
  // Debounce search
  let searchTimeout;
  function handleSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(searchLocation, 300);
  }
</script>

<div class="location-search">
  <div class="search-input-container">
    <input
      type="text"
      bind:value={searchInput}
      on:input={handleInput}
      on:keyup={handleSearch}
      placeholder={placeholder}
      class="search-input"
    />
    {#if isSearching}
      <div class="search-spinner"></div>
    {/if}
    {#if value.address}
      <button type="button" on:click={clearLocation} class="clear-btn" title="Clear location">
        ✕
      </button>
    {/if}
  </div>
  
  {#if showResults && searchResults.length > 0}
    <div class="search-results">
      {#each searchResults as result}
        <button
          type="button"
          on:click={() => selectLocation(result)}
          class="search-result-item"
        >
          <div class="result-name">{result.display_name}</div>
          <div class="result-coords">
            {result.lat.toFixed(6)}, {result.lon.toFixed(6)}
          </div>
        </button>
      {/each}
    </div>
  {/if}
  
  {#if value.address}
    <div class="selected-location">
      <div class="location-info">
        <strong>Selected:</strong> {value.address}
      </div>
      <div class="location-coords">
        <strong>Coordinates:</strong> {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}
      </div>
      {#if value.city || value.country}
        <div class="location-details">
          {#if value.city}<span class="detail-item"><strong>City:</strong> {value.city}</span>{/if}
          {#if value.country}<span class="detail-item"><strong>Country:</strong> {value.country}</span>{/if}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .location-search {
    position: relative;
    width: 100%;
  }
  
  .search-input-container {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.875rem;
    background: white;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  
  .search-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .search-spinner {
    position: absolute;
    right: 2.5rem;
    width: 16px;
    height: 16px;
    border: 2px solid #e5e7eb;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  .clear-btn {
    position: absolute;
    right: 0.75rem;
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    font-size: 0.875rem;
    transition: color 0.2s, background 0.2s;
  }
  
  .clear-btn:hover {
    color: #374151;
    background: #f3f4f6;
  }
  
  .search-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #d1d5db;
    border-top: none;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    z-index: 50;
    max-height: 200px;
    overflow-y: auto;
  }
  
  .search-result-item {
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
    transition: background 0.2s;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .search-result-item:last-child {
    border-bottom: none;
  }
  
  .search-result-item:hover {
    background: #f8fafc;
  }
  
  .result-name {
    font-size: 0.875rem;
    color: #374151;
    margin-bottom: 0.25rem;
  }
  
  .result-coords {
    font-size: 0.75rem;
    color: #6b7280;
    font-family: monospace;
  }
  
  .selected-location {
    margin-top: 0.75rem;
    padding: 0.75rem;
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 8px;
  }
  
  .location-info {
    font-size: 0.875rem;
    color: #1e40af;
    margin-bottom: 0.5rem;
  }
  
  .location-coords {
    font-size: 0.75rem;
    color: #1e40af;
    font-family: monospace;
    margin-bottom: 0.5rem;
  }
  
  .location-details {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .detail-item {
    font-size: 0.75rem;
    color: #1e40af;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (max-width: 768px) {
    .search-input {
      font-size: 1rem; /* Prevent zoom on iOS */
    }
    
    .location-details {
      flex-direction: column;
      gap: 0.25rem;
    }
  }
</style>
