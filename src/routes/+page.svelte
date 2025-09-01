<script>
  import TrackingForm from '$lib/components/TrackingForm.svelte';
  import TrustIndicators from '$lib/components/TrustIndicators.svelte';
  import ServicesOverview from '$lib/components/ServicesOverview.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { trackingStore } from '$lib/stores/trackingStore.js';

  let trackingData = null;
  let loading = false;
  let error = null;
  let notification = null;

  // Subscribe to tracking store
  trackingStore.subscribe((data) => {
    trackingData = data;
    console.log('📊 Tracking data updated:', data);
  });

  async function handleTrackingSubmit(event) {
    const trackingCode = event.detail;
    console.log('🔍 Tracking submitted:', trackingCode);
    
    // The TrackingForm component now handles the API call
    // We just need to handle the result display
    if (trackingData) {
      showNotification('Tracking information loaded successfully!', 'success');
    }
  }

  function showNotification(message, type = 'info') {
    notification = { message, type, timestamp: Date.now() };
    setTimeout(() => notification = null, 5000);
  }
</script>

<svelte:head>
  <title>Kier Logics - Precision in Every Precious Journey</title>
  <meta name="description" content="Professional logistics solutions for gold and precious metals. Secure vault-to-vault transport with real-time tracking and full insurance coverage." />
</svelte:head>

<!-- Hero Section -->
<section class="hero">
  <div class="hero-container">
    <div class="hero-content">
      <h1 class="hero-title">
        <span class="hero-main">Kier Logics</span>
        <span class="hero-tagline">Precision in Every Precious Journey</span>
      </h1>
      <p class="hero-description">
        Professional logistics solutions for gold, precious metals, and high-value cargo. 
        Secure vault-to-vault transport with real-time tracking and comprehensive insurance coverage.
      </p>
      
      <!-- Tracking Form Section -->
      <div class="tracking-section">
        <h2 class="tracking-title">Track Your Precious Cargo</h2>
        <p class="tracking-subtitle">Enter your tracking code to monitor your shipment in real-time</p>
        <TrackingForm on:submit={handleTrackingSubmit} />
              </div>
            </div>
    
    <div class="hero-visual">
      <div class="hero-image">
        <div class="gold-bars">🥇</div>
        <div class="security-shield">🛡️</div>
        <div class="global-network">🌍</div>
        </div>
    </div>
  </div>
</section>

<!-- Trust Indicators -->
<TrustIndicators />

<!-- Services Overview -->
<ServicesOverview />

<!-- Why Choose Us Section -->
<section class="why-choose-us">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Why Choose Kier Logics?</h2>
      <p class="section-subtitle">
        Decades of experience in precious metals logistics with unmatched security and reliability
      </p>
    </div>

    <div class="features-grid">
      <div class="feature-item">
        <div class="feature-icon">🔒</div>
        <h3>Maximum Security</h3>
        <p>Multi-layered security protocols with armed escorts and 24/7 surveillance</p>
    </div>
    
      <div class="feature-item">
        <div class="feature-icon">⚡</div>
        <h3>Real-time Updates</h3>
        <p>Track your shipment every step of the way with our advanced monitoring system</p>
      </div>
      
      <div class="feature-item">
        <div class="feature-icon">🌍</div>
        <h3>Global Reach</h3>
        <p>Worldwide logistics network with local expertise and regulatory compliance</p>
      </div>
      
      <div class="feature-item">
        <div class="feature-icon">💎</div>
        <h3>Specialized Handling</h3>
        <p>Expert care for precious metals with temperature control and chain of custody</p>
      </div>
          </div>
        </div>
</section>

<!-- Call to Action Section -->
<section class="cta-section">
  <div class="container">
    <div class="cta-content">
      <h2 class="cta-title">Ready to Secure Your Precious Cargo?</h2>
      <p class="cta-description">
        Get a custom quote for your gold and precious metals transport needs. 
        Our experts are ready to provide you with a secure, reliable solution.
      </p>
      <div class="cta-buttons">
        <button class="cta-primary">Get Free Quote</button>
        <button class="cta-secondary">Contact Sales</button>
      </div>
    </div>
  </div>
</section>

<!-- Notification Display -->
{#if notification}
  <div class="notification {notification.type}">
    {notification.message}
    </div>
  {/if}

  <Footer />

<style>
  /* Hero Section */
  .hero {
    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
    color: white;
    padding: 4rem 0 6rem 0;
    position: relative;
    overflow: hidden;
  }
  
  .hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
  }
  
  .hero-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    position: relative;
    z-index: 1;
  }
  
  .hero-content {
    z-index: 2;
  }
  
  .hero-title {
    margin-bottom: 1.5rem;
  }
  
  .hero-main {
    display: block;
    font-size: 3.5rem;
    font-weight: 800;
    color: #fbbf24;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    margin-bottom: 0.5rem;
    line-height: 1.1;
  }
  
  .hero-tagline {
    display: block;
    font-size: 1.5rem;
    font-weight: 400;
    color: #e5e7eb;
    margin-bottom: 1rem;
    line-height: 1.3;
  }
  
  .hero-description {
    font-size: 1.125rem;
    line-height: 1.6;
    color: #cbd5e1;
    margin-bottom: 2rem;
    max-width: 500px;
  }
  
  /* Tracking Section */
  .tracking-section {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .tracking-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: white;
  }
  
  .tracking-subtitle {
    color: #cbd5e1;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
  }
  
  /* Hero Visual */
  .hero-visual {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  
  .hero-image {
    position: relative;
    width: 300px;
    height: 300px;
  }
  
  .gold-bars,
  .security-shield,
  .global-network {
    position: absolute;
    font-size: 4rem;
    animation: float 6s ease-in-out infinite;
  }
  
  .gold-bars {
    top: 20%;
    left: 20%;
    animation-delay: 0s;
  }
  
  .security-shield {
    top: 50%;
    right: 20%;
    animation-delay: 2s;
  }
  
  .global-network {
    bottom: 20%;
    left: 50%;
    animation-delay: 4s;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  
  /* Why Choose Us Section */
  .why-choose-us {
    padding: 5rem 0;
    background: #f8fafc;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 4rem;
  }
  
  .section-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e3a8a;
    margin-bottom: 1rem;
    line-height: 1.2;
  }
  
  .section-subtitle {
    font-size: 1.125rem;
    color: #64748b;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  
  .feature-item {
    background: white;
    padding: 2rem;
    border-radius: 16px;
    text-align: center;
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
    font-size: 0.875rem;
  }
  
  /* CTA Section */
  .cta-section {
    padding: 5rem 0;
    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
    color: white;
  }
  
  .cta-content {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .cta-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.2;
  }
  
  .cta-description {
    font-size: 1.125rem;
    color: #cbd5e1;
    margin-bottom: 2rem;
    line-height: 1.6;
  }
  
  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .cta-primary,
  .cta-secondary {
    padding: 1rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: none;
  }
  
  .cta-primary {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    color: #1e3a8a;
    box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
  }
  
  .cta-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(251, 191, 36, 0.4);
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }
  
  .cta-secondary {
    background: transparent;
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }
  
  .cta-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: white;
  }
  
  /* Mobile Responsiveness */
  @media (max-width: 1024px) {
    .hero-container {
      grid-template-columns: 1fr;
      gap: 2rem;
      text-align: center;
    }
    
    .features-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .hero-visual {
      order: -1;
    }
  }
  
  @media (max-width: 768px) {
    .hero {
      padding: 3rem 0 4rem 0;
    }
    
    .hero-main {
      font-size: 2.5rem;
    }
    
    .hero-tagline {
      font-size: 1.25rem;
    }
    
    .hero-description {
      font-size: 1rem;
    }
    
    .tracking-section {
      padding: 1.5rem;
    }
    
    .section-title {
      font-size: 2rem;
    }
    
    .cta-title {
      font-size: 2rem;
    }
    
    .cta-buttons {
      flex-direction: column;
      align-items: center;
    }
    
    .cta-primary,
    .cta-secondary {
      width: 100%;
      max-width: 300px;
    }
  }
  
  @media (max-width: 480px) {
    .hero-main {
      font-size: 2rem;
    }
    
    .hero-tagline {
      font-size: 1.125rem;
    }
    
    .tracking-section {
      padding: 1.25rem;
    }
    
    .section-title {
      font-size: 1.75rem;
    }
    
    .cta-title {
      font-size: 1.75rem;
    }
    
    .hero-image {
      width: 250px;
      height: 250px;
    }
    
    .gold-bars,
    .security-shield,
    .global-network {
      font-size: 3rem;
    }
  }
  
  /* Notification Styles */
  .notification {
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 1001;
    animation: slideIn 0.3s ease;
    max-width: 400px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
  
  .notification.success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }
  
  .notification.error {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  }
  
  .notification.info {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    .notification {
      right: 10px;
      left: 10px;
      max-width: none;
    }
  }
</style> 