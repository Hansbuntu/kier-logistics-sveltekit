<script>
  import Footer from '$lib/components/Footer.svelte';
  
  let formData = {
    name: '',
    company: '',
    email: '',
    phone: '',
    service: '',
    value: '',
    message: ''
  };

  let submitted = false;

  function handleSubmit() {
    submitted = true;
    console.log('Contact form submitted:', formData);
  }
</script>

<svelte:head>
  <title>Contact Us | Kier Logics</title>
  <meta name="description" content="Contact Kier Logics for secure precious metals shipping. Get in touch for professional logistics services and custom quotes." />
</svelte:head>

<!-- Hero Section -->
<section class="hero">
  <div class="container">
    <div class="hero-content">
      <h1 class="hero-title">Contact Kier Logics</h1>
      <p class="hero-subtitle">Get in touch for secure precious metals shipping</p>
    </div>
  </div>
</section>

<!-- Contact Information Section -->
<section class="contact-info-section">
  <div class="container">
    <div class="contact-grid">
      <div class="contact-card">
        <div class="contact-icon">📞</div>
        <h3>Phone</h3>
        <p class="contact-detail">+1 (555) 123-4567</p>
        <p class="contact-note">Main business line</p>
      </div>
      
      <div class="contact-card">
        <div class="contact-icon">✉️</div>
        <h3>Email</h3>
        <p class="contact-detail">info@kierlogics.com</p>
        <p class="contact-note">General inquiries</p>
      </div>
      
      <div class="contact-card emergency">
        <div class="contact-icon">🆘</div>
        <h3>Emergency Line</h3>
        <p class="contact-detail">+1 (555) 999-GOLD</p>
        <p class="contact-note">24/7 urgent support</p>
      </div>
      
      <div class="contact-card">
        <div class="contact-icon">🕒</div>
        <h3>Business Hours</h3>
        <p class="contact-detail">Monday-Friday 8AM-6PM EST</p>
        <p class="contact-note">Saturday 9AM-2PM EST</p>
      </div>
    </div>
    
    <div class="address-section">
      <div class="address-card">
        <div class="address-icon">🏢</div>
        <div class="address-content">
          <h3>Business Address</h3>
          <p class="address">Kier Logics International</p>
          <p class="address">123 Financial District Plaza</p>
          <p class="address">Suite 1500</p>
          <p class="address">New York, NY 10005</p>
          <p class="address">United States</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Contact Form Section -->
<section class="contact-form-section">
  <div class="container">
    <div class="form-container">
      <div class="form-header">
        <h2>Send Us a Message</h2>
        <p>We respond within 2 hours during business hours</p>
      </div>
      
      {#if submitted}
        <div class="success-message">
          <div class="success-icon">✅</div>
          <h3>Message Sent Successfully!</h3>
          <p>Thank you for contacting Kier Logics. We'll respond within 2 hours during business hours.</p>
          <button class="btn-secondary" on:click={() => submitted = false}>
            Send Another Message
          </button>
        </div>
      {:else}
        <form on:submit|preventDefault={handleSubmit} class="contact-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Full Name *</label>
              <input 
                id="name" 
                type="text" 
                bind:value={formData.name} 
                required 
                class="form-input"
                placeholder="Enter your full name"
              />
            </div>
            
            <div class="form-group">
              <label for="company">Company Name</label>
              <input 
                id="company" 
                type="text" 
                bind:value={formData.company} 
                class="form-input"
                placeholder="Enter company name"
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="email">Email Address *</label>
              <input 
                id="email" 
                type="email" 
                bind:value={formData.email} 
                required 
                class="form-input"
                placeholder="Enter your email address"
              />
            </div>
            
            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input 
                id="phone" 
                type="tel" 
                bind:value={formData.phone} 
                class="form-input"
                placeholder="Enter phone number"
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="service">Service Needed</label>
              <select id="service" bind:value={formData.service} class="form-input">
                <option value="">Select Service</option>
                <option value="gold-shipping">Gold Shipping</option>
                <option value="precious-metals">Precious Metals</option>
                <option value="insurance-quote">Insurance Quote</option>
                <option value="custom-solution">Custom Solution</option>
                <option value="general-inquiry">General Inquiry</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="value">Shipment Value Range</label>
              <select id="value" bind:value={formData.value} class="form-input">
                <option value="">Select Range</option>
                <option value="under-100k">Under $100K</option>
                <option value="100k-500k">$100K-$500K</option>
                <option value="500k-1m">$500K-$1M</option>
                <option value="1m-5m">$1M-$5M</option>
                <option value="over-5m">Over $5M</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label for="message">Message/Details *</label>
            <textarea 
              id="message" 
              bind:value={formData.message} 
              required 
              rows="5"
              class="form-input"
              placeholder="Tell us about your shipping needs, questions, or requirements..."
            ></textarea>
          </div>
          
          <button type="submit" class="btn-primary">
            Send Message
          </button>
        </form>
      {/if}
    </div>
  </div>
</section>

<!-- Why Choose Us Section -->
<section class="why-choose-section">
  <div class="container">
    <div class="section-header">
      <h2>Why Choose Kier Logics?</h2>
      <p>Professional expertise and proven track record in precious metals logistics</p>
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

<!-- Security Certifications -->
<section class="certifications-section">
  <div class="container">
    <div class="section-header">
      <h2>Security Certifications</h2>
      <p>Industry-recognized standards and compliance</p>
    </div>
    
    <div class="certifications-grid">
      <div class="certification-item">
        <div class="cert-icon">🛡️</div>
        <h3>ISO 28000</h3>
        <p>Supply Chain Security Management</p>
      </div>
      
      <div class="certification-item">
        <div class="cert-icon">🔐</div>
        <h3>C-TPAT</h3>
        <p>Customs-Trade Partnership Against Terrorism</p>
      </div>
      
      <div class="certification-item">
        <div class="cert-icon">📋</div>
        <h3>Lloyd's Approved</h3>
        <p>Insurance Underwriter Certification</p>
      </div>
      
      <div class="certification-item">
        <div class="cert-icon">🌐</div>
        <h3>IATA</h3>
        <p>International Air Transport Association</p>
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
  
  /* Contact Info Section */
  .contact-info-section {
    padding: 4rem 0;
    background: white;
  }
  
  .contact-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    margin-bottom: 3rem;
  }
  
  .contact-card {
    text-align: center;
    padding: 2rem 1rem;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 1px solid rgba(30, 58, 138, 0.1);
    border-radius: 16px;
    transition: all 0.3s ease;
  }
  
  .contact-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    border-color: #fbbf24;
  }
  
  .contact-card.emergency {
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    border-color: #fca5a5;
  }
  
  .contact-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }
  
  .contact-card h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e3a8a;
    margin-bottom: 0.75rem;
  }
  
  .contact-detail {
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
  }
  
  .contact-note {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  /* Address Section */
  .address-section {
    text-align: center;
  }
  
  .address-card {
    display: inline-flex;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem;
    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
    color: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
  
  .address-icon {
    font-size: 3rem;
    color: #fbbf24;
  }
  
  .address-content h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .address {
    margin: 0.25rem 0;
    font-size: 1rem;
  }
  
  /* Contact Form Section */
  .contact-form-section {
    padding: 5rem 0;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }
  
  .form-container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    border-radius: 16px;
    padding: 3rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(30, 58, 138, 0.1);
  }
  
  .form-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .form-header h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #1e3a8a;
    margin-bottom: 0.5rem;
  }
  
  .form-header p {
    color: #6b7280;
    font-size: 1rem;
  }
  
  /* Form Styles */
  .contact-form {
    space-y: 1.5rem;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    display: block;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
  }
  
  .form-input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #d1d5db;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background-color: white;
    color: #1f2937;
  }
  
  .form-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .form-input::placeholder {
    color: #9ca3af;
  }
  
  textarea.form-input {
    resize: vertical;
    min-height: 120px;
  }
  
  /* Buttons */
  .btn-primary {
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
    width: 100%;
    min-height: 48px;
  }
  
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(251, 191, 36, 0.4);
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }
  
  .btn-secondary {
    background: #6b7280;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
  }
  
  .btn-secondary:hover {
    background: #4b5563;
  }
  
  /* Success Message */
  .success-message {
    text-align: center;
    padding: 3rem;
  }
  
  .success-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  .success-message h3 {
    color: #166534;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
  
  .success-message p {
    color: #166534;
    margin-bottom: 1.5rem;
    font-size: 1.125rem;
  }
  
  /* Why Choose Section */
  .why-choose-section {
    padding: 5rem 0;
    background: white;
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
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  
  .feature-item {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 1px solid rgba(30, 58, 138, 0.1);
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
    transition: all 0.3s ease;
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
  
  /* Certifications Section */
  .certifications-section {
    padding: 4rem 0;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }
  
  .certifications-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
  
  .certification-item {
    text-align: center;
    padding: 2rem 1rem;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    border: 1px solid rgba(30, 58, 138, 0.1);
  }
  
  .certification-item:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    border-color: #fbbf24;
  }
  
  .cert-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }
  
  .certification-item h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e3a8a;
    margin-bottom: 0.75rem;
  }
  
  .certification-item p {
    color: #64748b;
    line-height: 1.6;
    font-size: 0.875rem;
  }
  
  /* Mobile Responsiveness */
  @media (max-width: 1024px) {
    .contact-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
    
    .certifications-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
    
    .features-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .form-row {
      grid-template-columns: 1fr;
    }
    
    .address-card {
      flex-direction: column;
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
    
    .contact-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .certifications-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .form-container {
      padding: 2rem 1.5rem;
    }
    
    .address-card {
      padding: 1.5rem;
    }
  }
  
  @media (max-width: 480px) {
    .hero-title {
      font-size: 1.75rem;
    }
    
    .section-header h2 {
      font-size: 1.75rem;
    }
    
    .contact-card {
      padding: 1.5rem 1rem;
    }
    
    .feature-item {
      padding: 1.5rem;
    }
    
    .certification-item {
      padding: 1.5rem 1rem;
    }
  }
</style>
