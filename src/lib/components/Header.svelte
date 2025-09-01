<script>
  import { onMount } from 'svelte';
  
  let isMenuOpen = false;
  let isScrolled = false;
  
  onMount(() => {
    const handleScroll = () => {
      isScrolled = window.scrollY > 10;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
  
  function closeMenu() {
    isMenuOpen = false;
  }
</script>

<header class="header {isScrolled ? 'scrolled' : ''}">
  <div class="header-container">
    <!-- Logo/Brand -->
    <div class="logo">
      <a href="/" class="logo-link">
        <span class="logo-text">Kier Logics</span>
        <span class="logo-tagline">Precision in Every Precious Journey</span>
      </a>
    </div>
    
    <!-- Desktop Navigation -->
    <nav class="nav-desktop">
      <a href="/" class="nav-link">Home</a>
      <a href="/services" class="nav-link">Services</a>
      <a href="/track" class="nav-link">Track Shipment</a>
      <a href="/contact" class="nav-link">Contact</a>
    </nav>
    
    <!-- Right Side - Contact & CTA -->
    <div class="header-right">
      <div class="phone-number">
        <span class="phone-icon">📞</span>
        <a href="tel:+1234567890" class="phone-link">+1 (234) 567-890</a>
      </div>
      <a href="/contact" class="cta-button">
        Get Quote
      </a>
    </div>
    
    <!-- Mobile Menu Button -->
    <button class="mobile-menu-btn" on:click={toggleMenu} aria-label="Toggle menu">
      <span class="hamburger {isMenuOpen ? 'open' : ''}"></span>
    </button>
  </div>
  
  <!-- Mobile Navigation Menu -->
  <div class="mobile-menu {isMenuOpen ? 'open' : ''}">
    <nav class="nav-mobile">
      <a href="/" class="nav-link-mobile" on:click={closeMenu}>Home</a>
      <a href="/services" class="nav-link-mobile" on:click={closeMenu}>Services</a>
      <a href="/track" class="nav-link-mobile" on:click={closeMenu}>Track Shipment</a>
      <a href="/contact" class="nav-link-mobile" on:click={closeMenu}>Contact</a>
      <div class="mobile-contact">
        <div class="phone-number-mobile">
          <span class="phone-icon">📞</span>
          <a href="tel:+1234567890" class="phone-link">+1 (234) 567-890</a>
        </div>
        <a href="/contact" class="cta-button-mobile">
          Get Quote
        </a>
      </div>
    </nav>
  </div>
</header>

<style>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
    color: white;
    z-index: 1000;
    transition: all 0.3s ease;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  }
  
  .header.scrolled {
    background: rgba(30, 58, 138, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15);
  }
  
  .header-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80px;
  }
  
  /* Logo Styles */
  .logo-link {
    text-decoration: none;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .logo-text {
    font-size: 1.75rem;
    font-weight: 700;
    color: #fbbf24;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .logo-tagline {
    font-size: 0.75rem;
    color: #e5e7eb;
    font-weight: 400;
    margin-top: -2px;
  }
  
  /* Desktop Navigation */
  .nav-desktop {
    display: flex;
    gap: 2rem;
    align-items: center;
  }
  
  .nav-link {
    color: white;
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: all 0.3s ease;
    position: relative;
  }
  
  .nav-link:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fbbf24;
  }
  
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: #fbbf24;
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }
  
  .nav-link:hover::after {
    width: 80%;
  }
  
  /* Header Right Side */
  .header-right {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  
  .phone-number {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
  }
  
  .phone-icon {
    font-size: 1.25rem;
  }
  
  .phone-link {
    color: white;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .phone-link:hover {
    color: #fbbf24;
  }
  
  /* CTA Button */
  .cta-button {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    color: #1e3a8a;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-decoration: none;
    display: inline-block;
  }
  
  .cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(251, 191, 36, 0.4);
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }
  
  .cta-button:active {
    transform: translateY(0);
  }
  
  /* Mobile Menu Button */
  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    flex-direction: column;
    justify-content: space-around;
    width: 30px;
    height: 30px;
  }
  
  .hamburger {
    width: 25px;
    height: 3px;
    background: white;
    border-radius: 2px;
    transition: all 0.3s ease;
    position: relative;
  }
  
  .hamburger.open {
    background: transparent;
  }
  
  .hamburger.open::before {
    transform: rotate(45deg);
  }
  
  .hamburger.open::after {
    transform: rotate(-45deg);
  }
  
  .hamburger::before,
  .hamburger::after {
    content: '';
    position: absolute;
    width: 25px;
    height: 3px;
    background: white;
    border-radius: 2px;
    transition: all 0.3s ease;
  }
  
  .hamburger::before {
    transform: translateY(-8px);
  }
  
  .hamburger::after {
    transform: translateY(8px);
  }
  
  .hamburger.open::before {
    transform: rotate(45deg);
  }
  
  .hamburger.open::after {
    transform: rotate(-45deg);
  }
  
  /* Mobile Menu */
  .mobile-menu {
    display: none;
    background: rgba(30, 58, 138, 0.98);
    backdrop-filter: blur(10px);
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    padding: 1rem;
    transform: translateY(-100%);
    opacity: 0;
    transition: all 0.3s ease;
  }
  
  .mobile-menu.open {
    transform: translateY(0);
    opacity: 1;
  }
  
  .nav-mobile {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-link-mobile {
    color: white;
    text-decoration: none;
    font-weight: 500;
    padding: 1rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .nav-link-mobile:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #fbbf24;
  }
  
  .mobile-contact {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .phone-number-mobile {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    font-weight: 500;
  }
  
  .cta-button-mobile {
    width: 100%;
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    color: #1e3a8a;
    border: none;
    padding: 1rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-decoration: none;
    display: inline-block;
    text-align: center;
  }
  
  .cta-button-mobile:hover {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .nav-desktop,
    .header-right {
      display: none;
    }
    
    .mobile-menu-btn {
      display: flex;
    }
    
    .mobile-menu {
      display: block;
    }
    
    .header-container {
      height: 70px;
      padding: 0 1rem;
    }
    
    .logo-text {
      font-size: 1.5rem;
    }
    
    .logo-tagline {
      font-size: 0.7rem;
    }
  }
  
  @media (max-width: 480px) {
    .header-container {
      padding: 0 0.75rem;
    }
    
    .logo-text {
      font-size: 1.25rem;
    }
    
    .logo-tagline {
      font-size: 0.65rem;
    }
  }
</style>
