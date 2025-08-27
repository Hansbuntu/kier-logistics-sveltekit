<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  export let trackingCode = '';
  export let currentImages = [];
  
  let uploading = false;
  let uploadProgress = 0;
  let selectedFiles = [];
  let dragActive = false;
  
  // Handle file selection
  function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    selectedFiles = [...selectedFiles, ...files];
  }
  
  // Handle drag and drop
  function handleDragOver(event) {
    event.preventDefault();
    dragActive = true;
  }
  
  function handleDragLeave() {
    dragActive = false;
  }
  
  function handleDrop(event) {
    event.preventDefault();
    dragActive = false;
    
    const files = Array.from(event.dataTransfer.files);
    selectedFiles = [...selectedFiles, ...files];
  }
  
  // Remove selected file
  function removeFile(index) {
    selectedFiles = selectedFiles.filter((_, i) => i !== index);
  }
  
  // Upload images
  async function uploadImages() {
    if (selectedFiles.length === 0) return;
    
    uploading = true;
    uploadProgress = 0;
    
    try {
      const formData = new FormData();
      formData.append('trackingCode', trackingCode);
      
      selectedFiles.forEach((file, index) => {
        formData.append(`images`, file);
      });
      
      const response = await fetch('/api/upload-images', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const result = await response.json();
      
      // Dispatch success event
      dispatch('uploadSuccess', {
        images: result.images,
        trackingCode: trackingCode
      });
      
      // Reset form
      selectedFiles = [];
      uploadProgress = 0;
      
    } catch (error) {
      console.error('Upload error:', error);
      dispatch('uploadError', { error: error.message });
    } finally {
      uploading = false;
    }
  }
  
  // Remove existing image
  function removeImage(imageUrl) {
    dispatch('removeImage', { imageUrl, trackingCode });
  }
</script>

<div class="image-upload-container">
  <h3 class="text-lg font-semibold mb-4">Gold Shipment Images</h3>
  
  <!-- Current Images Display -->
  {#if currentImages && currentImages.length > 0}
    <div class="current-images mb-6">
      <h4 class="text-md font-medium mb-3">Current Images:</h4>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        {#each currentImages as imageUrl}
          <div class="relative group">
            <img 
              src={imageUrl} 
              alt="Gold shipment" 
              class="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
            />
            <button
              on:click={() => removeImage(imageUrl)}
              class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remove image"
            >
              ×
            </button>
          </div>
        {/each}
      </div>
    </div>
  {/if}
  
  <!-- Upload Area -->
  <div class="upload-area mb-4">
    <div 
      class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors {dragActive ? 'border-blue-400 bg-blue-50' : 'hover:border-gray-400'}"
      on:dragover={handleDragOver}
      on:dragleave={handleDragLeave}
      on:drop={handleDrop}
      role="button"
      tabindex="0"
      aria-label="Drag and drop area for image uploads"
    >
      <div class="text-gray-600">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <p class="text-lg font-medium">Upload Gold Shipment Images</p>
        <p class="text-sm text-gray-500 mt-2">
          Drag and drop images here, or click to select files
        </p>
        <input
          type="file"
          multiple
          accept="image/*"
          on:change={handleFileSelect}
          class="hidden"
          id="file-input-{trackingCode}"
        />
        <label
          for="file-input-{trackingCode}"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          Select Images
        </label>
      </div>
    </div>
  </div>
  
  <!-- Selected Files Preview -->
  {#if selectedFiles.length > 0}
    <div class="selected-files mb-4">
      <h4 class="text-md font-medium mb-3">Selected Files:</h4>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        {#each selectedFiles as file, index}
          <div class="relative">
            <img 
              src={URL.createObjectURL(file)} 
              alt="Preview" 
              class="w-full h-20 object-cover rounded border"
            />
            <button
              on:click={() => removeFile(index)}
              class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              ×
            </button>
            <p class="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
          </div>
        {/each}
      </div>
    </div>
    
    <!-- Upload Button -->
    <button
      on:click={uploadImages}
      disabled={uploading}
      class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {#if uploading}
        <span class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Uploading... {uploadProgress}%
        </span>
      {:else}
        Upload {selectedFiles.length} Image{selectedFiles.length !== 1 ? 's' : ''}
      {/if}
    </button>
  {/if}
</div>

<!-- Styles are handled by Tailwind CSS classes -->
