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
    if (data && !recentCodes.includes(data.trackingCode)) {
      recentCodes = [data.trackingCode, ...recentCodes.slice(0, 4)];
    }
  });
  
  function handleTrackingSubmit(event) {
    const trackingCode = event.detail;
    console.log('Tracking submitted:', trackingCode);
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
      <p class="hero-subtitle">Monitor your cargo's journey with real-time updates and secure chain of custody tracking</p>
    </div>
  </div>
</section>

<!-- Main Tracking Section -->
<section class="tracking-section">
  <div class="container">
    <div class="tracking-container">
      <div class="tracking-main">
        <div class="tracking-header">
          <h2>Enter Your Tracking Code</h2>
          <p>Format: XXX-XXXX-XXXX (e.g., KLG-2024-001A)</p>
        </div>
        
        <TrackingForm on:submit={handleTrackingSubmit} />
      </div>
      
      <!-- Recent Tracking Codes -->
      {#if recentCodes.length > 0}
        <div class="recent-codes">
          <div class="recent-header">
            <h3>Recent Tracking Codes</h3>
            <button class="clear-btn" on:click={clearRecentCodes}>Clear</button>
          </div>
          <div class="codes-list">
            {#each recentCodes as code}
              <button class="code-item" on:click={() => window.location.href = `/?code=${code}`}>
                {code}
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
</section>

<!-- FAQ Section -->
<section class="faq-section">
  <div class="container">
    <div class="section-header">
      <h2>Frequently Asked Questions</h2>
      <p>Everything you need to know about tracking your precious metals shipment</p>
    </div>
    
    <div class="faq-container">
      <div class="faq-item">
        <button class="faq-question" on:click={() => showFAQ = !showFAQ}>
          <span>How often is tracking updated?</span>
          <span class="faq-icon">{showFAQ ? '−' : '+'}</span>
        </button>
        {#if showFAQ}
          <div class="faq-answer">
            <p>Tracking is updated in real-time throughout your shipment's journey. GPS coordinates are refreshed every 15 minutes, and status updates are provided at each checkpoint. You'll receive instant notifications for any significant events or delays.</p>
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
            <p>If your tracking code isn't working, please verify you've entered it correctly. Tracking codes are case-sensitive and must include hyphens. If the issue persists, contact our 24/7 support line at +1 (555) 999-GOLD for immediate assistance.</p>
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
            <p>Delivery confirmation is sent immediately upon successful delivery and signature verification. You'll receive an email confirmation, SMS notification, and can download a digital delivery report. Physical documentation is also provided upon request.</p>
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
            <p>To set up tracking notifications, simply enter your tracking code and click "Enable Notifications" in the tracking results. You can choose to receive updates via email, SMS, or both. Notifications are sent for status changes, delays, and delivery confirmation.</p>
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
      <p>Professional tracking capabilities for your precious cargo</p>
    </div>
    
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">📍</div>
        <h3>Real-Time GPS</h3>
        <p>Live location tracking with precise coordinates and route visualization</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">📱</div>
        <h3>Instant Notifications</h3>
        <p>Get alerts for status changes, delays, and important milestones</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">🔒</div>
        <h3>Chain of Custody</h3>
        <p>Complete documentation of every handoff and security checkpoint</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">📊</div>
        <h3>Detailed Reports</h3>
        <p>Download comprehensive tracking reports for your records</p>
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
        
        <div class="support-options">
          <div class="support-option">
            <span class="support-icon">📞</span>
            <div>
              <strong>24/7 Support:</strong> +1 (555) 999-GOLD
            </div>
          </div>
          
          <div class="support-option">
            <span class="support-icon">✉️</span>
            <div>
              <strong>Email Support:</strong> tracking@kierlogics.com
            </div>
          </div>
          
          <div class="support-option">
            <span class="support-icon">💬</span>
            <div>
              <strong>Live Chat:</strong> Available during business hours
            </div>
          </div>
        </div>
      </div>
      
      <div class="support-cta">
        <h3>Track Another Shipment</h3>
        <p>Have multiple shipments? Track them all from one place.</p>
        <button class="btn-secondary" on:click={() => window.location.href = '/'}>
          Go to Homepage
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
    padding: 4rem 0;
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
    padding: 4rem 0;
    background: white;
  }
  
  .tracking-container {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 3rem;
    align-items: start;
  }
  
  .tracking-main {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-radius: 16px;
    padding: 2rem;
    border: 1px solid rgba(30, 58, 138, 0.1);
  }
  
  .tracking-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .tracking-header h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #1e3a8a;
    margin-bottom: 0.5rem;
  }
  
  .tracking-header p {
    color: #6b7280;
    font-size: 1rem;
  }
  
  /* Recent Codes */
  .recent-codes {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(30, 58, 138, 0.1);
  }
  
  .recent-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .recent-header h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e3a8a;
  }
  
  .clear-btn {
    background: none;
    border: none;
    color: #6b7280;
    font-size: 0.875rem;
    cursor: pointer;
    text-decoration: underline;
  }
  
  .clear-btn:hover {
    color: #374151;
  }
  
  .codes-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .code-item {
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 0.75rem;
    text-align: left;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: monospace;
    font-size: 0.875rem;
  }
  
  .code-item:hover {
    background: #e5e7eb;
    border-color: #d1d5db;
  }
  
  /* FAQ Section */
  .faq-section {
    padding: 4rem 0;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .section-header h2 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e3a8a;
    margin-bottom: 1rem;
    line-height: 1.2;
  }
  
  .section-header p {
    font-size: 1.125rem;
    color: #64748b;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
  
  .faq-container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .faq-item {
    background: white;
    border-radius: 12px;
    margin-bottom: 1rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }
  
  .faq-question {
    width: 100%;
    background: none;
    border: none;
    padding: 1.5rem;
    text-align: left;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e3a8a;
    transition: background-color 0.3s ease;
  }
  
  .faq-question:hover {
    background-color: #f8fafc;
  }
  
  .faq-icon {
    font-size: 1.5rem;
    font-weight: bold;
    color: #fbbf24;
  }
  
  .faq-answer {
    padding: 0 1.5rem 1.5rem;
    color: #64748b;
    line-height: 1.6;
  }
  
  /* Features Section */
  .features-section {
    padding: 4rem 0;
    background: white;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
  
  .feature-card {
    text-align: center;
    padding: 2rem 1rem;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 1px solid rgba(30, 58, 138, 0.1);
    border-radius: 16px;
    transition: all 0.3s ease;
  }
  
  .feature-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    border-color: #fbbf24;
  }
  
  .feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }
  
  .feature-card h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e3a8a;
    margin-bottom: 1rem;
  }
  
  .feature-card p {
    color: #64748b;
    line-height: 1.6;
    font-size: 0.875rem;
  }
  
  /* Support Section */
  .support-section {
    padding: 4rem 0;
    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
    color: white;
  }
  
  .support-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 3rem;
    align-items: center;
  }
  
  .support-info h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.2;
  }
  
  .support-info p {
    color: #cbd5e1;
    line-height: 1.6;
    margin-bottom: 2rem;
    font-size: 1.125rem;
  }
  
  .support-options {
    space-y: 1rem;
  }
  
  .support-option {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    backdrop-filter: blur(10px);
  }
  
  .support-icon {
    font-size: 1.5rem;
    color: #fbbf24;
  }
  
  .support-cta {
    text-align: center;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .support-cta h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .support-cta p {
    color: #cbd5e1;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
  
  /* Buttons */
  .btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: white;
  }
  
  /* Mobile Responsiveness */
  @media (max-width: 1024px) {
    .tracking-container {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    
    .features-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
    
    .support-content {
      grid-template-columns: 1fr;
      gap: 2rem;
      text-align: center;
    }
  }
  
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2rem;
    }
    
    .hero-subtitle {
      font-size: 1rem;
    }
    
    .section-header h2 {
      font-size: 2rem;
    }
    
    .tracking-header h2 {
      font-size: 1.75rem;
    }
    
    .features-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .faq-question {
      font-size: 1rem;
      padding: 1.25rem;
    }
    
    .faq-answer {
      padding: 0 1.25rem 1.25rem;
    }
  }
  
  @media (max-width: 480px) {
    .hero-title {
      font-size: 1.75rem;
    }
    
    .section-header h2 {
      font-size: 1.75rem;
    }
    
    .tracking-header h2 {
      font-size: 1.5rem;
    }
    
    .tracking-main {
      padding: 1.5rem;
    }
    
    .feature-card {
      padding: 1.5rem 1rem;
    }
    
    .support-cta {
      padding: 1.5rem;
    }
  }
</style>
