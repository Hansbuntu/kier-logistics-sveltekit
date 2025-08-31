<script>
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
  import MobileErrorBoundary from '$lib/components/MobileErrorBoundary.svelte';
</script>

<MobileErrorBoundary />

<Header />

<!-- Add spacing for fixed header -->
<div class="header-spacer"></div>

<slot />

<style>
  .header-spacer {
    height: 80px; /* Match header height */
  }
  
  @media (max-width: 768px) {
    .header-spacer {
      height: 70px; /* Match mobile header height */
    }
  }
</style> 