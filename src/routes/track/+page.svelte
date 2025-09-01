<script>
  import TrackingForm from '$lib/components/TrackingForm.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { trackingStore } from '$lib/stores/trackingStore.js';
  
  let trackingData = null;
  let recentCodes = [];
  let showFAQ = false;
  
  // Subscribe to tracking store
  trackingStore.subscribe((data) => {
    trackingData = data;
    if (data?.trackingCode && !recentCodes.includes(data.trackingCode)) {
      recentCodes = [data.trackingCode, ...recentCodes.slice(0, 4)]; // Keep last 5
    }
  });
  
  function handleTrackingSubmit(event) {
    const trackingCode = event.detail;
    console.log('Tracking submitted from track page:', trackingCode);
  }
  
  function toggleFAQ() {
    showFAQ = !showFAQ;
  }
  
  function clearRecentCodes() {
    recentCodes = [];
  }
</script>

<svelte:head>
  <title>Track Your Shipment | Kier Logics</title>
  <meta name="description" content="Track your precious metals shipment with real-time updates. Monitor your cargo's journey with our advanced tracking system." />
</svelte:head>

<!-- Hero Section -->
<section class="hero">
  <div class="container">
    <div class="hero-content">
      <h1 class="hero-title">Track Your Precious Metals Shipment</h1>
      <p class="hero-subtitle">Enhanced tracking functionality with real-time updates and comprehensive monitoring</p>
    </div>
  </div>
</section>

<!-- Tracking Section -->
<section class="tracking-section">
  <div class="container">
    <div class="tracking-container">
      <div class="tracking-header">
        <h2>Enter Your Tracking Code</h2>
        <p>Monitor your shipment every step of the way</p>
      </div>
      
      <TrackingForm on:submit={handleTrackingSubmit} />
      
      <!-- Tracking Code Helper -->
      <div class="tracking-helper">
        <div class="helper-icon">💡</div>
        <div class="helper-content">
          <h3>Tracking Code Format</h3>
          <p><strong>Format:</strong> XXX-XXXX-XXXX (e.g., KLG-2024-001A)</p>
          <p>Your tracking code should be 12 characters long with hyphens separating each section.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Recent Tracking Codes -->
{#if recentCodes.length > 0}
  <section class="recent-section">
    <div class="container">
      <div class="recent-header">
        <h2>Recent Tracking Codes</h2>
        <button on:click={clearRecentCodes} class="clear-btn">Clear History</button>
      </div>
      
      <div class="recent-grid">
        {#each recentCodes as code}
          <div class="recent-item">
            <div class="recent-code">{code}</div>
            <button 
              on:click={() => {
                // Re-trigger tracking for this code
                const event = new CustomEvent('refreshTracking', { detail: code });
                window.dispatchEvent(event);
              }}
              class="retrack-btn"
            >
              Track Again
            </button>
          </div>
        {/each}
      </div>
    </div>
  </section>
{/if}

<!-- FAQ Section -->
<section class="faq-section">
  <div class="container">
    <div class="faq-header">
      <h2>Frequently Asked Questions</h2>
      <p>Common questions about our tracking system</p>
    </div>
    
    <div class="faq-container">
      <div class="faq-item">
        <button class="faq-question" on:click={() => showFAQ = !showFAQ}>
          <span>How often is tracking updated?</span>
          <span class="faq-icon">{showFAQ ? '−' : '+'}</span>
        </button>
        
        {#if showFAQ}
          <div class="faq-answer">
            <p>Tracking updates are provided in real-time throughout your shipment's journey. GPS coordinates are updated every 15 minutes, and status changes are reflected immediately. You'll receive notifications for all major milestones including pickup, transit checkpoints, and delivery.</p>
          </div>
        {/if}
      </div>
      
      <div class="faq-item">
        <button class="faq-question" on:click={() => showFAQ = !showFAQ}>
          <span>What if my tracking code doesn't work?</span>
          <span class="faq-icon">{showFAQ ? '−' : '+'}</span>
        </button>
        
        {#if showFAQ}
          <div class="faq-answer">
            <p>If your tracking code isn't working, please verify you've entered it correctly. Ensure all hyphens are in place and the code is exactly 12 characters long. If the issue persists, contact our 24/7 support line at +1 (555) 999-GOLD for immediate assistance.</p>
          </div>
        {/if}
      </div>
      
      <div class="faq-item">
        <button class="faq-question" on:click={() => showFAQ = !showFAQ}>
          <span>When will I receive delivery confirmation?</span>
          <span class="faq-icon">{showFAQ ? '−' : '+'}</span>
        </button>
        
        {#if showFAQ}
          <div class="faq-answer">
            <p>Delivery confirmation is sent immediately upon successful delivery and signature verification. You'll receive both an email notification and an SMS alert. The confirmation includes delivery time, recipient signature, and any special handling notes.</p>
          </div>
        {/if}
      </div>
      
      <div class="faq-item">
        <button class="faq-question" on:click={() => showFAQ = !showFAQ}>
          <span>How to set up tracking notifications?</span>
          <span class="faq-icon">{showFAQ ? '−' : '+'}</span>
        </button>
        
        {#if showFAQ}
          <div class="faq-answer">
            <p>To set up tracking notifications, log into your account and navigate to the notification preferences. You can choose to receive updates via email, SMS, or both. You can also set custom notification triggers for specific events like checkpoints or delays.</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>

<!-- Tracking Features -->
<section class="features-section">
  <div class="container">
    <div class="section-header">
      <h2>Advanced Tracking Features</h2>
      <p>Professional monitoring capabilities for your precious cargo</p>
    </div>
    
    <div class="features-grid">
      <div class="feature-item">
        <div class="feature-icon">📍</div>
        <h3>Real-Time GPS</h3>
        <p>Live location tracking with 15-minute update intervals</p>
      </div>
      
      <div class="feature-item">
        <div class="feature-icon">📱</div>
        <h3>Mobile Notifications</h3>
        <p>Instant alerts for status changes and milestones</p>
      </div>
      
      <div class="feature-item">
        <div class="feature-icon">🛡️</div>
        <h3>Security Monitoring</h3>
        <p>24/7 surveillance and tamper detection alerts</p>
      </div>
      
      <div class="feature-item">
        <div class="feature-icon">📊</div>
        <h3>Detailed Reports</h3>
        <p>Comprehensive tracking history and analytics</p>
      </div>
    </div>
  </div>
</section>

<!-- Customer Support -->
<section class="support-section">
  <div class="container">
    <div class="support-content">
      <div class="support-info">
        <h2>Need Help with Tracking?</h2>
        <p>Our customer service team is available 24/7 to assist you with any tracking questions or issues.</p>
        
        <div class="support-contacts">
          <div class="support-item">
            <span class="support-icon">📞</span>
            <div>
              <strong>24/7 Support:</strong> +1 (555) 999-GOLD
            </div>
          </div>
          
          <div class="support-item">
            <span class="support-icon">📧</span>
            <div>
              <strong>Email Support:</strong> tracking@kierlogics.com
            </div>
          </div>
          
          <div class="support-item">
            <span class="support-icon">💬</span>
            <div>
              <strong>Live Chat:</strong> Available on our website
            </div>
          </div>
        </div>
      </div>
      
      <div class="support-cta">
        <h3>Quick Support Request</h3>
        <p>Can't find what you're looking for? Send us a quick message.</p>
        <button class="support-btn" onclick="window.location.href='/contact'">
          Contact Support
        </button>
      </div>
    </div>
  </div>
</section>

<Footer />

<style>
  /* Hero Section */
  .hero {
    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
    color: white;
    padding: 6rem 0 4rem 0;
    text-align: center;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .hero-title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.2;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
    color: #cbd5e1;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
  
  /* Tracking Section */
  .tracking-section {
    padding: 5rem 0;
    background: white;
  }
  
  .tracking-container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .tracking-header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .tracking-header h2 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e3a8a;
    margin-bottom: 1rem;
  }
  
  .tracking-header p {
    font-size: 1.125rem;
    color: #64748b;
  }
  
  /* Tracking Helper */
  .tracking-helper {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-top: 2rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border-radius: 12px;
    border: 1px solid rgba(30, 58, 138, 0.1);
  }
  
  .helper-icon {
    font-size: 2rem;
    color: #fbbf24;
    flex-shrink: 0;
  }
  
  .helper-content h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e3a8a;
    margin-bottom: 0.5rem;
  }
  
  .helper-content p {
    color: #64748b;
    line-height: 1.6;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }
  
  /* Recent Section */
  .recent-section {
    padding: 4rem 0;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }
  
  .recent-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .recent-header h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #1e3a8a;
  }
  
  .clear-btn {
    background: #ef4444;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .clear-btn:hover {
    background: #dc2626;
  }
  
  .recent-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }
  
  .recent-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background: white;
    border-radius: 8px;
    border: 1px solid rgba(30, 58, 138, 0.1);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  
  .recent-code {
    font-family: 'Courier New', monospace;
    font-weight: 600;
    color: #1e3a8a;
    font-size: 1.125rem;
  }
  
  .retrack-btn {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    color: #1e3a8a;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .retrack-btn:hover {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }
  
  /* FAQ Section */
  .faq-section {
    padding: 5rem 0;
    background: white;
  }
  
  .faq-header {
    text-align: center;
    margin-bottom: 4rem;
  }
  
  .faq-header h2 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e3a8a;
    margin-bottom: 1rem;
  }
  
  .faq-header p {
    font-size: 1.125rem;
    color: #64748b;
  }
  
  .faq-container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .faq-item {
    margin-bottom: 1rem;
    border: 1px solid rgba(30, 58, 138, 0.1);
    border-radius: 8px;
    overflow: hidden;
  }
  
  .faq-question {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    color: #1e3a8a;
    transition: all 0.3s ease;
  }
  
  .faq-question:hover {
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  }
  
  .faq-icon {
    font-size: 1.5rem;
    font-weight: bold;
    color: #fbbf24;
  }
  
  .faq-answer {
    padding: 1.5rem;
    background: white;
    border-top: 1px solid rgba(30, 58, 138, 0.1);
  }
  
  .faq-answer p {
    color: #64748b;
    line-height: 1.6;
    margin: 0;
  }
  
  /* Features Section */
  .features-section {
    padding: 5rem 0;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 4rem;
  }
  
  .section-header h2 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e3a8a;
    margin-bottom: 1rem;
  }
  
  .section-header p {
    font-size: 1.125rem;
    color: #64748b;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  
  .feature-item {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    border: 1px solid rgba(30, 58, 138, 0.1);
  }
  
  .feature-item:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    border-color: #fbbf24;
  }
  
  .feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }
  
  .feature-item h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e3a8a;
    margin-bottom: 1rem;
  }
  
  .feature-item p {
    color: #64748b;
    line-height: 1.6;
  }
  
  /* Support Section */
  .support-section {
    padding: 5rem 0;
    background: white;
  }
  
  .support-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 4rem;
    align-items: start;
  }
  
  .support-info h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #1e3a8a;
    margin-bottom: 1rem;
  }
  
  .support-info p {
    color: #64748b;
    line-height: 1.6;
    margin-bottom: 2rem;
  }
  
  .support-contacts {
    space-y: 1rem;
  }
  
  .support-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    color: #475569;
  }
  
  .support-icon {
    font-size: 1.5rem;
    color: #fbbf24;
  }
  
  .support-cta {
    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
    color: white;
    padding: 2rem;
    border-radius: 16px;
    text-align: center;
  }
  
  .support-cta h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }
  
  .support-cta p {
    color: #cbd5e1;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
  
  .support-btn {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    color: #1e3a8a;
    border: none;
    padding: 1rem 2rem;
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
  
  .support-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(251, 191, 36, 0.4);
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }
  
  /* Mobile Responsiveness */
  @media (max-width: 1024px) {
    .features-grid {
      grid-template-columns: 1fr;
    }
    
    .support-content {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }
  
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2rem;
    }
    
    .hero-subtitle {
      font-size: 1rem;
    }
    
    .tracking-header h2 {
      font-size: 2rem;
    }
    
    .section-header h2 {
      font-size: 2rem;
    }
    
    .faq-header h2 {
      font-size: 2rem;
    }
    
    .recent-grid {
      grid-template-columns: 1fr;
    }
    
    .recent-item {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
    
    .tracking-helper {
      flex-direction: column;
      text-align: center;
    }
  }
</style>
