<script>
  import TrackingForm from '$lib/components/TrackingForm.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { trackingStore } from '$lib/stores/trackingStore';
  
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
  
  function toggleFAQ() {
    showFAQ = !showFAQ;
  }
  
  function handleTrackingSubmit(event) {
    const trackingCode = event.detail;
    console.log('Tracking submitted from track page:', trackingCode);
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

<!-- Tracking Section -->
<section class="tracking-section">
  <div class="container">
    <div class="tracking-container">
      <div class="tracking-form-wrapper">
        <h2>Enter Your Tracking Code</h2>
        <p class="tracking-subtitle">Track your shipment with our secure, real-time monitoring system</p>
        
        <TrackingForm on:submit={handleTrackingSubmit} />
        
        <div class="tracking-helper">
          <h3>📋 Tracking Code Format</h3>
          <p><strong>Format:</strong> XXX-XXXX-XXXX (e.g., KLG-2024-001A)</p>
          <p class="helper-note">Your tracking code should be 12 characters long with hyphens separating each section</p>
        </div>
      </div>
      
      {#if recentCodes.length > 0}
        <div class="recent-codes">
          <h3>🔍 Recent Tracking Codes</h3>
          <div class="codes-list">
            {#each recentCodes as code}
              <button class="recent-code-btn" on:click={() => window.location.href = `/?code=${code}`}>
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
            <p>Tracking updates occur in real-time with GPS coordinates updated every 15 minutes during transit. Major status changes (pickup, delivery, custody transfers) are updated immediately.</p>
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
            <p>If your tracking code isn't working, please verify the format (XXX-XXXX-XXXX) and check for any typos. If the issue persists, contact our 24/7 support line at +1 (555) 999-GOLD.</p>
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
            <p>Delivery confirmation is sent immediately upon successful delivery and signature verification. You'll receive an email notification and can download the delivery report from your tracking page.</p>
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
            <p>To receive tracking notifications, simply enter your tracking code and click "Enable Notifications" on the tracking results page. You'll receive updates via email and SMS for all major status changes.</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>

<!-- Tracking Features Section -->
<section class="features-section">
  <div class="container">
    <div class="section-header">
      <h2>Advanced Tracking Features</h2>
      <p>Professional-grade tracking capabilities for your precious cargo</p>
    </div>
    
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">📍</div>
        <h3>Real-Time GPS Tracking</h3>
        <p>Live location updates with precise coordinates and estimated arrival times</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">🔒</div>
        <h3>Chain of Custody</h3>
        <p>Complete documentation of every handoff and transfer throughout the journey</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">📱</div>
        <h3>Mobile Notifications</h3>
        <p>Instant alerts for status changes, delays, and delivery confirmations</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">📊</div>
        <h3>Detailed Reports</h3>
        <p>Comprehensive tracking reports with timestamps and location history</p>
      </div>
    </div>
  </div>
</section>

<!-- Customer Support Section -->
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
              <strong>Live Chat:</strong> Available on tracking results page
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
    padding: 5rem 0;
    background: white;
  }
  
  .tracking-container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .tracking-form-wrapper {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .tracking-form-wrapper h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #1e3a8a;
    margin-bottom: 1rem;
  }
  
  .tracking-subtitle {
    color: #64748b;
    font-size: 1.125rem;
    margin-bottom: 2rem;
    line-height: 1.6;
  }
  
  .tracking-helper {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 1px solid rgba(30, 58, 138, 0.1);
    border-radius: 16px;
    padding: 2rem;
    margin-top: 2rem;
    text-align: left;
  }
  
  .tracking-helper h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e3a8a;
    margin-bottom: 1rem;
  }
  
  .tracking-helper p {
    color: #374151;
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }
  
  .helper-note {
    color: #6b7280;
    font-size: 0.875rem;
    font-style: italic;
  }
  
  /* Recent Codes */
  .recent-codes {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 1px solid rgba(30, 58, 138, 0.1);
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
  }
  
  .recent-codes h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e3a8a;
    margin-bottom: 1.5rem;
  }
  
  .codes-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }
  
  .recent-code-btn {
    background: white;
    border: 2px solid rgba(30, 58, 138, 0.2);
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    color: #1e3a8a;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: monospace;
    font-size: 0.875rem;
  }
  
  .recent-code-btn:hover {
    border-color: #fbbf24;
    background: #fef3c7;
    transform: translateY(-2px);
  }
  
  /* FAQ Section */
  .faq-section {
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
    font-weight: 500;
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
    border-top: 1px solid #e5e7eb;
  }
  
  /* Features Section */
  .features-section {
    padding: 5rem 0;
    background: white;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  
  .feature-card {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 1px solid rgba(30, 58, 138, 0.1);
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
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
    padding: 5rem 0;
    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
    color: white;
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
    font-size: 1.25rem;
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
    text-decoration: none;
    display: inline-block;
  }
  
  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: white;
    transform: translateY(-2px);
  }
  
  /* Mobile Responsiveness */
  @media (max-width: 1024px) {
    .features-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
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
    
    .section-header h2 {
      font-size: 2rem;
    }
    
    .tracking-form-wrapper h2 {
      font-size: 1.75rem;
    }
    
    .support-info h2 {
      font-size: 1.75rem;
    }
    
    .codes-list {
      flex-direction: column;
      align-items: center;
    }
    
    .recent-code-btn {
      width: 100%;
      max-width: 300px;
    }
  }
  
  @media (max-width: 480px) {
    .hero-title {
      font-size: 1.75rem;
    }
    
    .section-header h2 {
      font-size: 1.75rem;
    }
    
    .tracking-form-wrapper h2 {
      font-size: 1.5rem;
    }
    
    .support-info h2 {
      font-size: 1.5rem;
    }
    
    .tracking-helper {
      padding: 1.5rem;
    }
    
    .recent-codes {
      padding: 1.5rem;
    }
    
    .feature-card {
      padding: 1.5rem;
    }
    
    .support-cta {
      padding: 1.5rem;
    }
  }
</style>
