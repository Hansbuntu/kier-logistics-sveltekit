<script>
  import Footer from '$lib/components/Footer.svelte';
  
  const services = [
    {
      icon: '🥇',
      title: 'Gold Transportation',
      description: 'Secure gold bar and coin shipping',
      features: [
        'Vault-to-vault transfers',
        'International gold logistics',
        'Armed security escorts',
        'Temperature-controlled transport'
      ]
    },
    {
      icon: '💎',
      title: 'Precious Metals Shipping',
      description: 'Silver, platinum, palladium transport',
      features: [
        'Certified precious metals handling',
        'Temperature-controlled storage options',
        'Chain of custody documentation',
        'Multi-modal transportation'
      ]
    },
    {
      icon: '🛡️',
      title: 'High-Value Insurance',
      description: 'Coverage up to $10 million per shipment',
      features: [
        'Lloyd\'s of London underwritten policies',
        'Comprehensive risk management',
        'All-risk coverage included',
        'Fast claims processing'
      ]
    },
    {
      icon: '📍',
      title: 'Real-Time Tracking',
      description: 'GPS monitoring throughout journey',
      features: [
        'Secure chain of custody documentation',
        'Instant status notifications',
        '24/7 shipment monitoring',
        'Mobile app access'
      ]
    },
    {
      icon: '⚡',
      title: 'Custom Solutions',
      description: 'Tailored logistics for unique requirements',
      features: [
        'White-glove delivery service',
        'Emergency shipping options',
        'Specialized handling protocols',
        'Dedicated account management'
      ]
    }
  ];
  
  let contactForm = {
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
    // In a real app, this would send to your backend
    console.log('Service inquiry submitted:', contactForm);
    submitted = true;
    
    // Reset form after 3 seconds
    setTimeout(() => {
      submitted = false;
      contactForm = {
        name: '',
        company: '',
        email: '',
        phone: '',
        service: '',
        value: '',
        message: ''
      };
    }, 3000);
  }
</script>

<svelte:head>
  <title>Our Services | Kier Logics</title>
  <meta name="description" content="Professional precious metals logistics services including gold transportation, secure vault-to-vault transfers, and comprehensive insurance coverage." />
</svelte:head>

<!-- Hero Section -->
<section class="hero">
  <div class="container">
    <div class="hero-content">
      <h1 class="hero-title">Precious Metals Logistics Services</h1>
      <p class="hero-subtitle">Specialized shipping solutions for valuable materials</p>
    </div>
  </div>
</section>

<!-- Services Grid -->
<section class="services-section">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Our Premium Services</h2>
      <p class="section-subtitle">
        Professional logistics solutions designed specifically for precious metals and high-value cargo
      </p>
    </div>
    
    <div class="services-grid">
      {#each services as service}
        <div class="service-card">
          <div class="service-header">
            <div class="service-icon">{service.icon}</div>
            <h3 class="service-title">{service.title}</h3>
          </div>
          <p class="service-description">{service.description}</p>
          <ul class="service-features">
            {#each service.features as feature}
              <li class="feature-item">
                <span class="feature-check">✓</span>
                {feature}
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Trust Indicators -->
<section class="trust-section">
  <div class="container">
    <div class="trust-grid">
      <div class="trust-item">
        <div class="trust-icon">🛡️</div>
        <h3>Secure & Insured</h3>
        <p>Military-grade security protocols and full insurance coverage</p>
      </div>
      
      <div class="trust-item">
        <div class="trust-icon">📍</div>
        <h3>Real-time Tracking</h3>
        <p>Live updates and location tracking throughout transit</p>
      </div>
      
      <div class="trust-item">
        <div class="trust-icon">🔄</div>
        <h3>24/7 Support</h3>
        <p>Round-the-clock customer service and monitoring</p>
      </div>
      
      <div class="trust-item">
        <div class="trust-icon">🥇</div>
        <h3>Precious Metals Specialist</h3>
        <p>Specialized expertise in gold and precious materials logistics</p>
      </div>
    </div>
  </div>
</section>

<!-- Contact Form Section -->
<section class="contact-section">
  <div class="container">
    <div class="contact-content">
      <div class="contact-info">
        <h2>Get Your Custom Quote</h2>
        <p>Ready to secure your precious cargo? Our experts are here to help.</p>
        
        <div class="contact-details">
          <div class="contact-item">
            <span class="contact-icon">📞</span>
            <div>
              <strong>Phone:</strong> +1 (555) 123-4567
            </div>
          </div>
          
          <div class="contact-item">
            <span class="contact-icon">📧</span>
            <div>
              <strong>Email:</strong> info@kierlogics.com
            </div>
          </div>
          
          <div class="contact-item">
            <span class="contact-icon">🆘</span>
            <div>
              <strong>Emergency:</strong> +1 (555) 999-GOLD
            </div>
          </div>
        </div>
      </div>
      
      <div class="contact-form">
        {#if submitted}
          <div class="success-message">
            <h3>Thank You!</h3>
            <p>Your service inquiry has been submitted. We'll respond within 2 hours during business hours.</p>
          </div>
        {:else}
          <form on:submit|preventDefault={handleSubmit}>
            <div class="form-grid">
              <div class="form-group">
                <label for="name">Full Name *</label>
                <input 
                  id="name" 
                  type="text" 
                  bind:value={contactForm.name} 
                  required 
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label for="company">Company Name</label>
                <input 
                  id="company" 
                  type="text" 
                  bind:value={contactForm.company} 
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label for="email">Email Address *</label>
                <input 
                  id="email" 
                  type="email" 
                  bind:value={contactForm.email} 
                  required 
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input 
                  id="phone" 
                  type="tel" 
                  bind:value={contactForm.phone} 
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label for="service">Service Needed</label>
                <select id="service" bind:value={contactForm.service} class="form-input">
                  <option value="">Select a service</option>
                  <option value="gold">Gold Shipping</option>
                  <option value="precious-metals">Precious Metals</option>
                  <option value="insurance">Insurance Quote</option>
                  <option value="custom">Custom Solution</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="value">Shipment Value Range</label>
                <select id="value" bind:value={contactForm.value} class="form-input">
                  <option value="">Select value range</option>
                  <option value="under-100k">Under $100K</option>
                  <option value="100k-500k">$100K-$500K</option>
                  <option value="500k-1m">$500K-$1M</option>
                  <option value="1m-5m">$1M-$5M</option>
                  <option value="over-5m">Over $5M</option>
                </select>
              </div>
            </div>
            
            <div class="form-group full-width">
              <label for="message">Message/Details *</label>
              <textarea 
                id="message" 
                bind:value={contactForm.message} 
                required 
                rows="4"
                class="form-input"
                placeholder="Please describe your shipping needs..."
              ></textarea>
            </div>
            
            <button type="submit" class="submit-btn">
              Request Quote
            </button>
          </form>
        {/if}
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
  
  /* Services Section */
  .services-section {
    padding: 5rem 0;
    background: white;
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
  
  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }
  
  .service-card {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 1px solid rgba(30, 58, 138, 0.1);
    border-radius: 16px;
    padding: 2rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .service-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  .service-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    border-color: #fbbf24;
  }
  
  .service-card:hover::before {
    transform: scaleX(1);
  }
  
  .service-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .service-icon {
    font-size: 2.5rem;
    flex-shrink: 0;
  }
  
  .service-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e3a8a;
    line-height: 1.3;
  }
  
  .service-description {
    color: #64748b;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
  }
  
  .service-features {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .feature-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #475569;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }
  
  .feature-check {
    color: #10b981;
    font-weight: bold;
    font-size: 1rem;
  }
  
  /* Trust Section */
  .trust-section {
    padding: 4rem 0;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }
  
  .trust-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
  
  .trust-item {
    text-align: center;
    padding: 2rem 1rem;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    border: 1px solid rgba(30, 58, 138, 0.1);
  }
  
  .trust-item:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    border-color: #fbbf24;
  }
  
  .trust-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }
  
  .trust-item h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e3a8a;
    margin-bottom: 0.75rem;
    line-height: 1.3;
  }
  
  .trust-item p {
    color: #64748b;
    line-height: 1.6;
    font-size: 0.875rem;
  }
  
  /* Contact Section */
  .contact-section {
    padding: 5rem 0;
    background: white;
  }
  
  .contact-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: start;
  }
  
  .contact-info h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #1e3a8a;
    margin-bottom: 1rem;
  }
  
  .contact-info p {
    color: #64748b;
    line-height: 1.6;
    margin-bottom: 2rem;
  }
  
  .contact-details {
    space-y: 1rem;
  }
  
  .contact-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    color: #475569;
  }
  
  .contact-icon {
    font-size: 1.5rem;
    color: #fbbf24;
  }
  
  /* Form Styles */
  .contact-form {
    background: #f8fafc;
    padding: 2rem;
    border-radius: 16px;
    border: 1px solid rgba(30, 58, 138, 0.1);
  }
  
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-group.full-width {
    grid-column: 1 / -1;
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
  
  .submit-btn {
    width: 100%;
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
  
  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(251, 191, 36, 0.4);
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }
  
  .success-message {
    text-align: center;
    padding: 2rem;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border-radius: 16px;
  }
  
  .success-message h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  /* Mobile Responsiveness */
  @media (max-width: 1024px) {
    .services-grid {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }
    
    .trust-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .contact-content {
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
    
    .section-title {
      font-size: 2rem;
    }
    
    .services-grid {
      grid-template-columns: 1fr;
    }
    
    .trust-grid {
      grid-template-columns: 1fr;
    }
    
    .form-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
