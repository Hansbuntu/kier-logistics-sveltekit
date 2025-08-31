<script>
  const services = [
    {
      icon: '🥇',
      title: 'Gold & Precious Metals Shipping',
      description: 'Specialized handling and transport of gold, silver, platinum, and other precious metals with maximum security protocols.',
      features: ['Temperature controlled', 'Armed escorts available', 'Chain of custody tracking']
    },
    {
      icon: '🏦',
      title: 'Secure Vault-to-Vault Transport',
      description: 'End-to-end security from origin vault to destination with real-time monitoring and verification at every checkpoint.',
      features: ['Multi-layer security', 'GPS tracking', '24/7 surveillance']
    },
    {
      icon: '🛡️',
      title: 'Insurance Coverage up to $50M',
      description: 'Comprehensive insurance policies covering theft, damage, and loss with quick claim processing and full value protection.',
      features: ['All-risk coverage', 'Fast claims', 'Full value protection']
    },
    {
      icon: '🌍',
      title: 'Global Logistics Network',
      description: 'Worldwide coverage with local expertise, customs clearance, and compliance with international precious metals regulations.',
      features: ['Global reach', 'Local expertise', 'Regulatory compliance']
    }
  ];
</script>

<section class="services-overview">
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
    
    <div class="services-cta">
      <p class="cta-text">Ready to secure your precious cargo?</p>
      <button class="cta-button">
        Get Your Custom Quote
      </button>
    </div>
  </div>
</section>

<style>
  .services-overview {
    padding: 5rem 0;
    background: white;
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
  
  .services-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-bottom: 4rem;
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
  
  .services-cta {
    text-align: center;
    padding: 3rem;
    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
    border-radius: 16px;
    color: white;
  }
  
  .cta-text {
    font-size: 1.25rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
    color: #e5e7eb;
  }
  
  .cta-button {
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
  }
  
  .cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(251, 191, 36, 0.4);
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }
  
  /* Mobile Responsiveness */
  @media (max-width: 1024px) {
    .services-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .service-card {
      padding: 1.5rem;
    }
  }
  
  @media (max-width: 768px) {
    .services-overview {
      padding: 3rem 0;
    }
    
    .section-title {
      font-size: 2rem;
    }
    
    .section-subtitle {
      font-size: 1rem;
    }
    
    .services-cta {
      padding: 2rem 1.5rem;
    }
    
    .cta-text {
      font-size: 1.125rem;
    }
  }
  
  @media (max-width: 480px) {
    .section-title {
      font-size: 1.75rem;
    }
    
    .service-card {
      padding: 1.25rem;
    }
    
    .service-icon {
      font-size: 2rem;
    }
    
    .service-title {
      font-size: 1.125rem;
    }
  }
</style>
