<script>
  import Footer from '$lib/components/Footer.svelte';
  
  let activeTab = 'tracking';
  
  const faqs = {
    tracking: [
      {
        question: "How do I track my gold shipment?",
        answer: "Enter your 12-digit tracking code in the tracking form on the homepage. The code should be in the format AU-7B2N9X4L."
      },
      {
        question: "What does the tracking status mean?",
        answer: "In-transit: Your shipment is moving between locations. Customs: Shipment is being inspected. Delivered: Successfully reached destination. Delayed: Shipment is behind schedule."
      },
      {
        question: "How often is tracking updated?",
        answer: "Tracking information is updated in real-time as your shipment moves through the custody chain. Updates occur whenever the shipment changes hands or location."
      }
    ],
    security: [
      {
        question: "How secure is my shipment?",
        answer: "Each shipment is tracked through a verified custody chain with professional security personnel. Every handover is documented and verified."
      },
      {
        question: "What happens if my shipment is lost?",
        answer: "All shipments are fully insured. In the rare event of loss, our claims team will process your insurance claim within 24 hours."
      },
      {
        question: "Can I verify the authenticity of tracking updates?",
        answer: "Yes, each tracking update includes verification codes and guardian signatures that can be independently verified through our system."
      }
    ],
    delivery: [
      {
        question: "How long does delivery take?",
        answer: "Delivery times vary by destination and customs processing. Typical delivery takes 3-7 business days for international shipments."
      },
      {
        question: "What if I'm not home for delivery?",
        answer: "We require signature confirmation for all deliveries. If you're unavailable, we'll attempt delivery again or hold at a secure facility."
      },
      {
        question: "Can I change my delivery address?",
        answer: "Address changes can be made up to 24 hours before delivery. Contact our support team for assistance."
      }
    ]
  };
</script>

<svelte:head>
  <title>Help & Support - Kier Logistics</title>
  <meta name="description" content="Get help with tracking your shipments and find answers to frequently asked questions." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-50 via-gold-50 to-gray-100">
  <!-- Header -->
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Help & Support</h1>
            <p class="text-sm text-gray-600">Get assistance with tracking</p>
          </div>
        </div>
        <a href="/" class="btn-secondary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Tracker
        </a>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-4">
        How Can We Help You?
      </h2>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        Find answers to common questions and get support for your gold shipment tracking
      </p>
    </div>

    <!-- Contact Support -->
    <div class="card max-w-2xl mx-auto mb-8">
      <div class="text-center">
        <div class="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Need More Help?</h3>
        <p class="text-gray-600 mb-4">Can't find what you're looking for? Contact our support team</p>
        <div class="space-y-3">
          <div class="flex items-center justify-center space-x-2 text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span>support@goldtracker.com</span>
          </div>
          <div class="flex items-center justify-center space-x-2 text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            <span>+1 (555) 123-4567</span>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ Tabs -->
    <div class="max-w-4xl mx-auto">
      <!-- Tab Navigation -->
      <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
        <button
          class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 {activeTab === 'tracking' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
          on:click={() => activeTab = 'tracking'}
        >
          Tracking
        </button>
        <button
          class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 {activeTab === 'security' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
          on:click={() => activeTab = 'security'}
        >
          Security
        </button>
        <button
          class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 {activeTab === 'delivery' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
          on:click={() => activeTab = 'delivery'}
        >
          Delivery
        </button>
      </div>

      <!-- FAQ Content -->
      <div class="space-y-4">
        {#each faqs[activeTab] as faq, index}
          <div class="card">
            <button
              class="w-full text-left"
              on:click={() => faq.expanded = !faq.expanded}
            >
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900">
                  {faq.question}
                </h3>
                <svg class="w-5 h-5 text-gray-500 transform transition-transform duration-200 {faq.expanded ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </button>
            <div class="mt-4 pt-4 border-t border-gray-200">
              <p class="text-gray-700">{faq.answer}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </main>

  <!-- Footer -->
  <Footer />
</div> 