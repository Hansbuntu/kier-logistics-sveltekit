<script>
  import { onMount } from 'svelte';
  
  let hasError = false;
  let errorMessage = '';
  let isMobile = false;
  
  onMount(() => {
    // Detect mobile devices
    isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Add global error handler for mobile
    if (isMobile) {
      window.addEventListener('error', handleError);
      window.addEventListener('unhandledrejection', handlePromiseError);
    }
  });
  
  function handleError(event) {
    console.error('Mobile error caught:', event.error);
    hasError = true;
    errorMessage = event.error?.message || 'An error occurred';
  }
  
  function handlePromiseError(event) {
    console.error('Mobile promise error caught:', event.reason);
    hasError = true;
    errorMessage = event.reason?.message || 'A promise error occurred';
  }
  
  function retry() {
    hasError = false;
    errorMessage = '';
    window.location.reload();
  }
  
  function goHome() {
    window.location.href = '/';
  }
</script>

{#if hasError && isMobile}
  <div class="mobile-error-overlay">
    <div class="mobile-error-card">
      <div class="error-icon">⚠️</div>
      <h2 class="error-title">Mobile Compatibility Issue</h2>
      <p class="error-message">
        We encountered an issue on your mobile device. This might be due to:
      </p>
      <ul class="error-list">
        <li>• Browser compatibility</li>
        <li>• Network connection</li>
        <li>• JavaScript runtime error</li>
      </ul>
      <div class="error-actions">
        <button on:click={retry} class="btn-primary">
          🔄 Try Again
        </button>
        <button on:click={goHome} class="btn-secondary">
          🏠 Go Home
        </button>
      </div>
      <div class="error-details">
        <details>
          <summary>Technical Details</summary>
          <code class="error-code">{errorMessage}</code>
        </details>
      </div>
    </div>
  </div>
{/if}

<style>
  .mobile-error-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
  }
  
  .mobile-error-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    max-width: 400px;
    width: 100%;
    text-align: center;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }
  
  .error-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  .error-title {
    font-size: 20px;
    font-weight: 600;
    color: #dc2626;
    margin-bottom: 16px;
  }
  
  .error-message {
    color: #6b7280;
    margin-bottom: 16px;
    line-height: 1.5;
  }
  
  .error-list {
    text-align: left;
    color: #6b7280;
    margin-bottom: 24px;
    padding-left: 20px;
  }
  
  .error-list li {
    margin-bottom: 8px;
  }
  
  .error-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
  }
  
  .error-actions button {
    width: 100%;
    min-height: 48px;
    font-size: 16px;
  }
  
  .error-details {
    border-top: 1px solid #e5e7eb;
    padding-top: 16px;
  }
  
  .error-details summary {
    color: #6b7280;
    cursor: pointer;
    font-size: 14px;
    margin-bottom: 8px;
  }
  
  .error-code {
    background: #f3f4f6;
    padding: 8px;
    border-radius: 4px;
    font-size: 12px;
    color: #374151;
    word-break: break-all;
    text-align: left;
    display: block;
  }
  
  /* Mobile-specific styles */
  @media (max-width: 480px) {
    .mobile-error-card {
      padding: 20px;
      margin: 10px;
    }
    
    .error-title {
      font-size: 18px;
    }
    
    .error-message {
      font-size: 14px;
    }
  }
</style>
