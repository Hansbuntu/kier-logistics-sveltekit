<script>
  const trustItems = [
    {
      icon: '🛡️',
      title: 'Secure & Insured',
      description: 'Full insurance coverage for your precious cargo'
    },
    {
      icon: '📍',
      title: 'Real-time Tracking',
      description: 'Monitor your shipment every step of the way'
    },
    {
      icon: '🔄',
      title: '24/7 Support',
      description: 'Round-the-clock assistance when you need it'
    },
    {
      icon: '🥇',
      title: 'Precious Metals Specialist',
      description: 'Expert handling of gold and valuable materials'
    }
  ];
</script>

<section class="trust-indicators">
  <div class="container">
    <div class="trust-grid">
      {#each trustItems as item}
        <div class="trust-item">
          <div class="trust-icon">{item.icon}</div>
          <h3 class="trust-title">{item.title}</h3>
          <p class="trust-description">{item.description}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .trust-indicators {
    padding: 4rem 0;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
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
  
  .trust-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e3a8a;
    margin-bottom: 0.75rem;
    line-height: 1.3;
  }
  
  .trust-description {
    color: #64748b;
    line-height: 1.6;
    font-size: 0.875rem;
  }
  
  /* Mobile Responsiveness */
  @media (max-width: 1024px) {
    .trust-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
    
    .trust-item {
      padding: 1.5rem 1rem;
    }
  }
  
  @media (max-width: 640px) {
    .trust-indicators {
      padding: 3rem 0;
    }
    
    .trust-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .trust-item {
      padding: 1.5rem 1rem;
    }
    
    .trust-icon {
      font-size: 2.5rem;
    }
    
    .trust-title {
      font-size: 1.125rem;
    }
  }
</style>
