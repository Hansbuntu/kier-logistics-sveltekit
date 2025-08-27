<script>
  import '../../app.css';
  
  // Simple admin authentication check
  let isAuthenticated = false;
  
  // For demo purposes, you can set this to true
  // In production, implement proper authentication
  isAuthenticated = true;
</script>

{#if isAuthenticated}
  <slot />
{:else}
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900">Admin Access Required</h2>
        <p class="mt-2 text-sm text-gray-600">Please authenticate to access the admin panel.</p>
      </div>
      
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Admin Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                required
                class="input-field"
                placeholder="Enter admin password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="w-full btn-primary"
            >
              Access Admin Panel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if} 