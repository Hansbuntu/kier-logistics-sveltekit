<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase.js';
  
  let envStatus = {};
  let supabaseStatus = 'Unknown';
  let isVercel = false;
  
  onMount(() => {
    // Check if running on Vercel
    isVercel = window.location.hostname.includes('vercel.app');
    
    // Check environment variables
    envStatus = {
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing',
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
      NODE_ENV: import.meta.env.NODE_ENV || 'Unknown',
      MODE: import.meta.env.MODE || 'Unknown',
      DEV: import.meta.env.DEV ? 'Yes' : 'No',
      BASE_URL: import.meta.env.BASE_URL || 'Unknown'
    };
    
    // Test Supabase connection
    testSupabase();
  });
  
  async function testSupabase() {
    try {
      const { data, error } = await supabase
        .from('enhanced_shipments')
        .select('count')
        .limit(1);
      
      if (error) {
        supabaseStatus = `❌ Error: ${error.message}`;
      } else {
        supabaseStatus = '✅ Connected successfully';
      }
    } catch (err) {
      supabaseStatus = `❌ Exception: ${err.message}`;
    }
  }
</script>

<div class="debug-page">
  <div class="container">
    <h1>🔍 Debug Information</h1>
    
    <div class="debug-section">
      <h2>Environment Information</h2>
      <div class="info-grid">
        {#each Object.entries(envStatus) as [key, value]}
          <div class="info-item">
            <span class="key">{key}:</span>
            <span class="value">{value}</span>
          </div>
        {/each}
      </div>
    </div>
    
    <div class="debug-section">
      <h2>Deployment Information</h2>
      <div class="info-item">
        <span class="key">Platform:</span>
        <span class="value">{isVercel ? '🌐 Vercel' : '💻 Local'}</span>
      </div>
      <div class="info-item">
        <span class="key">Hostname:</span>
        <span class="value">{window.location.hostname}</span>
      </div>
    </div>
    
    <div class="debug-section">
      <h2>Supabase Connection</h2>
      <div class="info-item">
        <span class="key">Status:</span>
        <span class="value">{supabaseStatus}</span>
      </div>
      <button on:click={testSupabase} class="test-btn">
        Test Connection
      </button>
    </div>
    
    {#if !envStatus.VITE_SUPABASE_URL.includes('✅') || !envStatus.VITE_SUPABASE_ANON_KEY.includes('✅')}
      <div class="warning">
        <h3>⚠️ Environment Variables Missing</h3>
        <p>To fix this on Vercel:</p>
        <ol>
          <li>Go to your Vercel project dashboard</li>
          <li>Navigate to Settings → Environment Variables</li>
          <li>Add these variables:</li>
          <ul>
            <li><code>VITE_SUPABASE_URL</code> - Your Supabase project URL</li>
            <li><code>VITE_SUPABASE_ANON_KEY</code> - Your Supabase anon key</li>
          </ul>
          <li>Redeploy your project</li>
        </ol>
      </div>
    {/if}
    
    <div class="debug-section">
      <h2>Quick Actions</h2>
      <div class="action-buttons">
        <a href="/admin" class="btn">Go to Admin</a>
        <a href="/track" class="btn">Go to Track</a>
        <a href="/" class="btn">Go to Home</a>
      </div>
    </div>
  </div>
</div>

<style>
  .debug-page {
    min-height: 100vh;
    background: #f8fafc;
    padding: 2rem 0;
  }
  
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #1e3a8a;
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .debug-section {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1rem;
  }
  
  .info-grid {
    display: grid;
    gap: 0.75rem;
  }
  
  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .info-item:last-child {
    border-bottom: none;
  }
  
  .key {
    font-weight: 500;
    color: #374151;
    font-family: monospace;
  }
  
  .value {
    color: #1f2937;
    font-family: monospace;
  }
  
  .test-btn {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    margin-top: 1rem;
  }
  
  .test-btn:hover {
    background: #2563eb;
  }
  
  .warning {
    background: #fef3c7;
    border: 1px solid #f59e0b;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .warning h3 {
    color: #92400e;
    margin-bottom: 0.5rem;
  }
  
  .warning p, .warning li {
    color: #92400e;
    margin-bottom: 0.5rem;
  }
  
  .warning code {
    background: #fbbf24;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-family: monospace;
  }
  
  .action-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .btn {
    background: #1e3a8a;
    color: white;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    transition: background 0.2s;
  }
  
  .btn:hover {
    background: #1e40af;
  }
  
  @media (max-width: 768px) {
    .container {
      padding: 0 0.5rem;
    }
    
    .action-buttons {
      flex-direction: column;
    }
    
    .btn {
      text-align: center;
    }
  }
</style>
