<script>
  import { onMount } from 'svelte';
  import { generateSecureTrackingCode, generateMultipleCodes, validateTrackingCode } from '$lib/utils/codeGenerator.js';
  import { supabase, supabaseHelpers } from '$lib/supabase.js';
  import ImageUpload from '$lib/components/ImageUpload.svelte';
  import LocationSearch from '$lib/components/LocationSearch.svelte';
  
  let shipments = [];
  let loading = true;
  let error = null;
  let trackingCodes = [];
  let newTrackingCode = '';
  let success = '';
  let codeCount = 1;
  let generatedCodes = [];
  let showEditModal = false;
  let editingShipment = null;
  let showCreateForm = false;
  let connectionStatus = 'Unknown';
  let editForm = {
    // Origin Information
    origin_location: {
      latitude: 0,
      longitude: 0,
      address: '',
      city: '',
      country: '',
      facility: ''
    },
    origin_facility: '',
    origin_guardian: '',
    pickup_date: null,
    
    // Current Location
    current_location: {
      latitude: 0,
      longitude: 0,
      address: '',
      city: '',
      country: '',
      facility: ''
    },
    current_facility: '',
    current_guardian: '',
    
    // Destination Information
    destination_location: {
      latitude: 0,
      longitude: 0,
      address: '',
      city: '',
      country: '',
      facility: ''
    },
    destination_facility: '',
    recipient_name: '',
    recipient_contact: '',
    estimated_delivery: null,
    
    // Product Details
    product_details: {
      type: 'Gold Shipment',
      weight: 0,
      weightUnit: 'kg',
      purity: 999.5,
      serialNumber: '',
      photos: [],
      description: ''
    },
    
    // Journey Status
    journey_status: 'pending',
    security_level: 'high',
    verification_status: 'pending'
  };
  
  let createForm = {
    // Origin Information
    origin_location: {
      latitude: 0,
      longitude: 0,
      address: '',
      city: '',
      country: '',
      facility: ''
    },
    origin_facility: '',
    origin_guardian: '',
    pickup_date: null,
    
    // Current Location
    current_location: {
      latitude: 0,
      longitude: 0,
      address: '',
      city: '',
      country: '',
      facility: ''
    },
    current_facility: '',
    current_guardian: '',
    
    // Destination Information
    destination_location: {
      latitude: 0,
      longitude: 0,
      address: '',
      city: '',
      country: '',
      facility: ''
    },
    destination_facility: '',
    recipient_name: '',
    recipient_contact: '',
    estimated_delivery: null,
    
    // Product Details
    product_details: {
      type: 'Gold Shipment',
      weight: 0,
      weightUnit: 'kg',
      purity: 999.5,
      serialNumber: '',
      photos: [],
      description: ''
    },
    
    // Journey Status
    journey_status: 'pending',
    security_level: 'high',
    verification_status: 'pending'
  };

  function resetCreateForm() {
    createForm = {
      origin_location: { latitude: 0, longitude: 0, address: '', city: '', country: '', facility: '' },
      origin_facility: '',
      origin_guardian: '',
      pickup_date: null,
      current_location: { latitude: 0, longitude: 0, address: '', city: '', country: '', facility: '' },
      current_facility: '',
      current_guardian: '',
      destination_location: { latitude: 0, longitude: 0, address: '', city: '', country: '', facility: '' },
      destination_facility: '',
      recipient_name: '',
      recipient_contact: '',
      estimated_delivery: null,
      product_details: {
        type: 'Gold Shipment',
        weight: 0,
        weightUnit: 'kg',
        purity: 999.5,
        serialNumber: '',
        photos: [], // Reset photos array
        description: ''
      },
      journey_status: 'pending',
      security_level: 'high',
      verification_status: 'pending'
    };
    
    // Clear any existing image previews
    const imageUpload = document.getElementById('create-image-upload');
    if (imageUpload) {
      imageUpload.value = '';
    }
  }

  let map = null;
  let mapMarkers = {};

  onMount(async () => {
    await loadTrackingCodes();
    await loadShipments();
    loading = false;
    
    // Initialize maps when modal opens
    if (typeof window !== 'undefined') {
      // Load Leaflet dynamically
      try {
        console.log('🗺️ Loading Leaflet...');
        const L = await import('leaflet');
        await import('leaflet/dist/leaflet.css');
        
        // Make Leaflet globally available
        window.L = L.default;
        console.log('✅ Leaflet loaded successfully:', window.L);
        
        // Initialize maps for each location type
        initializeMap('origin-map', 'origin');
        initializeMap('current-map', 'current');
        initializeMap('destination-map', 'destination');
      } catch (error) {
        console.error('❌ Failed to load Leaflet:', error);
      }
    }
  });

  function initializeMap(mapId, locationType) {
    if (typeof window === 'undefined') return;
    
    try {
      console.log(`🗺️ Initializing ${locationType} map for element:`, mapId);
      const mapContainer = document.getElementById(mapId);
      if (!mapContainer) {
        console.error(`❌ Map container not found: ${mapId}`);
        return;
      }
      
      // Clear existing content
      mapContainer.innerHTML = '';
      
      // Check if Leaflet is available
      if (!window.L) {
        console.error('❌ Leaflet not loaded yet');
        // Show a placeholder with retry button
        mapContainer.innerHTML = `
          <div class="w-full h-full bg-gray-200 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div class="text-center text-gray-500">
              <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"></path>
              </svg>
              <p class="text-sm">Map loading...</p>
              <button onclick="location.reload()" class="mt-2 text-xs text-blue-600 hover:text-blue-800">Retry</button>
            </div>
          </div>
        `;
        return;
      }
      
      console.log(`✅ Leaflet found, creating map for ${locationType}`);
      const L = window.L;
      
      // Create map with default view
      const map = L.map(mapId).setView([0, 0], 2);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      
      // Store map reference
      mapMarkers[locationType] = { map, marker: null };
      
      // Add click handler to set coordinates
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        console.log(`📍 ${locationType} location set to:`, lat, lng);
        
        // Update form coordinates
        if (locationType === 'origin') {
          editForm.origin_location.latitude = lat;
          editForm.origin_location.longitude = lng;
        } else if (locationType === 'current') {
          editForm.current_location.latitude = lat;
          editForm.current_location.longitude = lng;
        } else if (locationType === 'destination') {
          editForm.destination_location.latitude = lat;
          editForm.destination_location.longitude = lng;
        }
        
        // Add or update marker
        if (mapMarkers[locationType].marker) {
          mapMarkers[locationType].marker.setLatLng([lat, lng]);
        } else {
          mapMarkers[locationType].marker = L.marker([lat, lng]).addTo(map);
        }
        
        // Center map on clicked location
        map.setView([lat, lng], 10);
      });
      
      // Set initial view if coordinates exist
      let coords = [0, 0];
      if (locationType === 'origin' && editForm.origin_location.latitude && editForm.origin_location.longitude) {
        coords = [editForm.origin_location.latitude, editForm.origin_location.longitude];
      } else if (locationType === 'current' && editForm.current_location.latitude && editForm.current_location.longitude) {
        coords = [editForm.current_location.latitude, editForm.current_location.longitude];
      } else if (locationType === 'destination' && editForm.destination_location.latitude && editForm.destination_location.longitude) {
        coords = [editForm.destination_location.latitude, editForm.destination_location.longitude];
      }
      
      if (coords[0] !== 0 || coords[1] !== 0) {
        map.setView(coords, 10);
        mapMarkers[locationType].marker = L.marker(coords).addTo(map);
      }
      
      console.log(`✅ ${locationType} map initialized successfully`);
      
    } catch (error) {
      console.error(`❌ Failed to initialize ${locationType} map:`, error);
      // Show error placeholder
      const mapContainer = document.getElementById(mapId);
      if (mapContainer) {
        mapContainer.innerHTML = `
          <div class="w-full h-full bg-red-100 border border-red-300 rounded flex items-center justify-center">
            <div class="text-center text-red-600">
              <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <p class="text-sm">Map failed to load</p>
              <p class="text-xs">Error: ${error.message}</p>
            </div>
          </div>
        `;
      }
    }
  }

  async function loadTrackingCodes() {
    try {
      error = null;
      const { data, error: fetchError } = await supabase
        .from('tracking_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Supabase error:', fetchError);
        if (fetchError.message.includes('Missing Supabase environment variables')) {
          error = 'Database not configured. Please set up your .env file with Supabase credentials.';
        } else {
          error = 'Failed to load tracking codes: ' + fetchError.message;
        }
        return;
      }
      
      trackingCodes = data || [];
    } catch (err) {
      console.error('Error loading tracking codes:', err);
      error = 'Failed to load tracking codes: ' + (err.message || 'Unknown error');
    }
  }

  async function loadShipments() {
    try {
      error = null;
      console.log('🔍 Loading shipments...');
      console.log('🔍 Supabase client:', supabase);
      console.log('🔍 Environment check:', {
        url: import.meta.env.VITE_SUPABASE_URL,
        key: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Loaded' : '❌ Missing'
      });
      
      const { data, error: fetchError } = await supabase
        .from('shipments')
        .select(`
          *,
          tracking_codes (
            code,
            status,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('❌ Supabase error:', fetchError);
        if (fetchError.message.includes('Missing Supabase environment variables')) {
          error = 'Database not configured. Please set up your .env file with Supabase credentials.';
        } else if (fetchError.message.includes('fetch')) {
          error = 'Network error: Failed to connect to database. Check your internet connection and Supabase URL.';
        } else {
          error = 'Failed to load shipments: ' + fetchError.message;
        }
        return;
      }
      
      console.log('✅ Shipments loaded successfully:', data);
      shipments = data || [];
    } catch (err) {
      console.error('❌ Error loading shipments:', err);
      if (err.message.includes('fetch')) {
        error = 'Network error: Failed to connect to database. Please check your Supabase configuration.';
      } else {
        error = 'Failed to load shipments: ' + (err.message || 'Unknown error');
      }
    }
  }

  async function generateTrackingCode() {
    try {
    loading = true;
      error = null;
      
      const newCode = generateSecureTrackingCode();
      console.log('🔑 Generated tracking code:', newCode);
      
      // Validate the generated code
      if (!validateTrackingCode(newCode)) {
        throw new Error('Generated code failed validation');
      }
      
      console.log('✅ Code validation passed');
      
      // Create tracking code record
      const { data: trackingCodeData, error: trackingError } = await supabase
        .from('tracking_codes')
        .insert({
          code: newCode,
          status: 'active',
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (trackingError) {
        console.error('❌ Error creating tracking code:', trackingError);
        throw new Error('Failed to create tracking code: ' + trackingError.message);
      }
      
      console.log('✅ Tracking code created:', trackingCodeData);
      
      // Create shipment record
      const { data: shipmentData, error: shipmentError } = await supabase
        .from('shipments')
        .insert({
          tracking_code: newCode,
          product_details: {
            type: 'Gold Shipment',
            weight: 0,
            weightUnit: 'kg',
            purity: 999.5,
            purityUnit: '999.5',
            serialNumber: 'Pending',
            photos: [],
            description: 'Shipment details pending'
          },
          current_location: {
            latitude: 0,
            longitude: 0,
            address: 'Processing Center',
            city: 'Processing',
            country: 'Processing',
            facility: 'Kier Logistics Hub'
          },
          delivery_info: {
            estimatedDelivery: null,
            currentStatus: 'pending',
            delayReason: null,
            nextLocation: null,
            etaHours: 0
          },
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (shipmentError) {
        console.error('❌ Error creating shipment:', shipmentError);
        throw new Error('Failed to create shipment: ' + shipmentError.message);
      }
      
      console.log('✅ Shipment created:', shipmentData);
      
      newTrackingCode = newCode;
      success = `Tracking code ${newCode} generated successfully!`;
      
      // Reload data
      await loadTrackingCodes();
      await loadShipments();
      
      setTimeout(() => success = '', 3000);
      
    } catch (err) {
      console.error('Error generating tracking code:', err);
      error = err.message || 'Failed to generate tracking code';
    } finally {
      loading = false;
    }
  }

  async function generateMultipleTrackingCodes() {
    try {
      if (codeCount < 1 || codeCount > 100) {
        error = 'Please enter a number between 1 and 100';
        return;
      }
      
      loading = true;
      error = null;
      
      // Generate multiple codes
      generatedCodes = generateMultipleCodes(codeCount);
      
      // Save all codes to database and create shipment records
      for (const code of generatedCodes) {
        await supabaseHelpers.createTrackingCode(code);
        
        // Create enhanced shipment record for this tracking code
        try {
          const { error: enhancedError } = await supabase
            .from('enhanced_shipments')
            .insert([{
              tracking_code: code,
              origin_location: {
                latitude: 0,
                longitude: 0,
                address: 'Processing Center',
                city: 'Processing',
                country: 'Processing'
              },
              origin_facility: 'Kier Logistics Hub',
              origin_guardian: 'System Generated',
              pickup_date: null,
              current_location: {
                latitude: 0,
                longitude: 0,
                address: 'Processing Center',
                city: 'Processing',
                country: 'Processing'
              },
              current_facility: 'Kier Logistics Hub',
              current_guardian: 'System Generated',
              destination_location: {
                latitude: 0,
                longitude: 0,
                address: 'Destination TBD',
                city: 'TBD',
                country: 'TBD'
              },
              destination_facility: 'Destination TBD',
              recipient_name: 'Recipient TBD',
              recipient_contact: 'Contact TBD',
              estimated_delivery: null,
              product_details: {
                type: 'Gold Shipment',
                weight: 0,
                weightUnit: 'kg',
                purity: 999.5,
                serialNumber: 'Pending Assignment',
                description: 'Shipment details pending'
              },
              journey_status: 'pending',
              security_level: 'high',
              verification_status: 'pending'
            }]);
          
          if (enhancedError) {
            console.warn(`Warning: Could not create enhanced shipment record for ${code}:`, enhancedError);
            
            // Fall back to regular shipment creation
            const { error: shipmentError } = await supabase
              .from('shipments')
              .insert([{
                tracking_code: code,
                product_details: {
                  type: 'Gold Shipment',
                  weight: 0,
                  weightUnit: 'kg',
                  purity: 999.5,
                  serialNumber: 'Pending Assignment',
                  photos: [],
                  description: 'Shipment details pending'
                },
                current_location: {
                  latitude: 0,
                  longitude: 0,
                  address: 'Processing Center',
                  city: 'Processing',
                  country: 'Processing',
                  facility: 'Kier Logistics Hub'
                },
                delivery_info: {
                  estimatedDelivery: null,
                  currentStatus: 'pending',
                  delayReason: null,
                  nextLocation: null,
                  etaHours: 0
                },
                status: 'pending'
              }]);
            
            if (shipmentError) {
              console.warn(`Warning: Could not create regular shipment record for ${code}:`, shipmentError);
            }
          }
        } catch (shipmentErr) {
          console.warn(`Warning: Could not create shipment record for ${code}:`, shipmentErr);
        }
      }
      
      success = `${codeCount} tracking codes generated and saved successfully!`;
      newTrackingCode = generatedCodes[0]; // Show first code in main display
      
      // Reload tracking codes
      await loadTrackingCodes();
    } catch (err) {
      console.error('Error generating multiple tracking codes:', err);
      error = 'Failed to generate tracking codes';
    } finally {
      loading = false;
    }
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      success = 'Copied to clipboard!';
      setTimeout(() => success = '', 2000);
    } catch (err) {
      error = 'Failed to copy to clipboard';
    }
  }

  async function copyAllCodes() {
    try {
      const allCodes = generatedCodes.join('\n');
      await navigator.clipboard.writeText(allCodes);
      success = 'All codes copied to clipboard!';
      setTimeout(() => success = '', 2000);
    } catch (err) {
      error = 'Failed to copy codes';
    }
  }

  async function deleteCode(codeId, trackingCode) {
    try {
      // Show confirmation dialog
      if (!confirm(`Are you sure you want to DELETE tracking code "${trackingCode}"? This action cannot be undone and will remove all associated data.`)) {
        return;
      }

      loading = true;
      error = null;

      console.log('🗑️ Deleting tracking code:', trackingCode, 'ID:', codeId);

      // First delete the shipment record (if it exists)
      const { error: shipmentDeleteError } = await supabase
        .from('shipments')
        .delete()
        .eq('tracking_code', trackingCode);

      if (shipmentDeleteError) {
        console.warn('Warning: Could not delete shipment record:', shipmentDeleteError);
        // Continue anyway, as the tracking code might not have a shipment yet
      }

      // Delete the tracking code itself
      const { error: codeDeleteError } = await supabase
        .from('tracking_codes')
        .delete()
        .eq('id', codeId);

      if (codeDeleteError) {
        console.error('Error deleting tracking code:', codeDeleteError);
        throw new Error('Failed to delete tracking code: ' + codeDeleteError.message);
      }

      success = `Tracking code "${trackingCode}" deleted successfully!`;
      console.log('✅ Tracking code deleted successfully');
      
      // Reload the data
      await loadTrackingCodes();
      await loadShipments();
      
      setTimeout(() => success = '', 3000);

    } catch (err) {
      console.error('Error deleting tracking code:', err);
      error = err.message || 'Failed to delete tracking code';
    } finally {
      loading = false;
    }
  }

  async function editShipment(trackingCode) {
    try {
      console.log('🔍 Edit button clicked for tracking code:', trackingCode);
      loading = true;
      error = null;

      // Try to get data from enhanced_shipments first
      let { data, error: fetchError } = await supabase
        .from('enhanced_shipments')
        .select('*')
        .eq('tracking_code', trackingCode)
        .maybeSingle();

      // If no enhanced shipment found, create a new one with default values
      if (!data) {
        console.log('No enhanced shipment found, creating new one...');
        data = {
          tracking_code: trackingCode,
          origin_location: {},
          origin_facility: '',
          origin_guardian: '',
          pickup_date: null,
          current_location: {},
          current_facility: '',
          current_guardian: '',
          destination_location: {},
          destination_facility: '',
          recipient_name: '',
          recipient_contact: '',
          estimated_delivery: null,
          product_details: {
            type: 'Gold Shipment',
            weight: 0,
            weightUnit: 'kg',
            purity: 999.5,
            serialNumber: '',
            description: ''
          },
          journey_status: 'pending',
          security_level: 'high',
          verification_status: 'pending'
        };
      } else if (fetchError) {
        console.error('Error fetching enhanced shipment:', fetchError);
        throw new Error('Failed to load shipment details: ' + fetchError.message);
      }

      if (fetchError) {
        console.error('Supabase error fetching shipment:', fetchError);
        if (fetchError.message.includes('Missing Supabase environment variables')) {
          error = 'Database not configured. Please set up your .env file with Supabase credentials.';
        } else {
          error = 'Failed to load shipment details: ' + fetchError.message;
        }
        return;
      }

      // Populate the edit form with existing data
      editingShipment = data;
      editForm = {
        // Origin Information
        origin_location: {
          latitude: data.origin_location?.latitude || 0,
          longitude: data.origin_location?.longitude || 0,
          address: data.origin_location?.address || '',
          city: data.origin_location?.city || '',
          country: data.origin_location?.country || ''
        },
        origin_facility: data.origin_facility || '',
        origin_guardian: data.origin_guardian || '',
        pickup_date: data.pickup_date || null,
        
        // Current Location
        current_location: {
          latitude: data.current_location?.latitude || 0,
          longitude: data.current_location?.longitude || 0,
          address: data.current_location?.address || '',
          city: data.current_location?.city || '',
          country: data.current_location?.country || ''
        },
        current_facility: data.current_facility || '',
        current_guardian: data.current_guardian || '',
        
        // Destination Information
        destination_location: {
          latitude: data.destination_location?.latitude || 0,
          longitude: data.destination_location?.longitude || 0,
          address: data.destination_location?.address || '',
          city: data.destination_location?.city || '',
          country: data.destination_location?.country || ''
        },
        destination_facility: data.destination_facility || '',
        recipient_name: data.recipient_name || '',
        recipient_contact: data.recipient_contact || '',
        estimated_delivery: data.estimated_delivery || null,
        
        // Product Details
        product_details: {
          type: data.product_details?.type || 'Gold Shipment',
          weight: data.product_details?.weight || 0,
          weightUnit: data.product_details?.weightUnit || 'kg',
          purity: data.product_details?.purity || 999.5,
          serialNumber: data.product_details?.serialNumber || '',
          photos: data.product_details?.photos || [],
          description: data.product_details?.description || ''
        },
        
        // Journey Status
        journey_status: data.journey_status || 'pending',
        security_level: data.security_level || 'high',
        verification_status: data.verification_status || 'pending'
      };

      // Show the edit modal
      showEditModal = true;
      console.log('✅ Modal should now be visible. showEditModal:', showEditModal);
      console.log('✅ editingShipment data:', editingShipment);
      
      // Initialize maps after modal is visible
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          console.log('🗺️ Initializing maps...');
          initializeMap('origin-map', 'origin');
          initializeMap('current-map', 'current');
          initializeMap('destination-map', 'destination');
        }
      }, 200);

    } catch (err) {
      console.error('Error editing shipment:', err);
      error = 'Failed to edit shipment';
    } finally {
      loading = false;
    }
  }

  async function testConnection() {
    try {
      console.log('🔍 Testing Supabase connection...');
      console.log('🔍 Supabase client:', supabase);
      console.log('🔍 Supabase URL:', supabase.supabaseUrl);
      
      // Test enhanced_shipments table
      const { data: enhancedData, error: enhancedError } = await supabase
        .from('enhanced_shipments')
        .select('count')
        .limit(1);
      
      // Test regular shipments table
      const { data: regularData, error: regularError } = await supabase
        .from('shipments')
        .select('count')
        .limit(1);
      
      console.log('🔍 Enhanced shipments table:', { enhancedData, enhancedError });
      console.log('🔍 Regular shipments table:', { regularData, regularError });
      
      if (enhancedError && regularError) {
        console.error('❌ Both tables failed:', { enhancedError, regularError });
        connectionStatus = `Failed: ${enhancedError.message}`;
      } else if (enhancedError) {
        console.log('⚠️ Enhanced table failed, but regular table works:', regularError);
        connectionStatus = 'Connected (regular table only)';
      } else {
        console.log('✅ Connection test successful');
        connectionStatus = 'Connected successfully!';
      }
    } catch (err) {
      console.error('❌ Connection test error:', err);
      connectionStatus = `Error: ${err.message}`;
    }
  }

  async function saveShipment() {
    try {
      loading = true;
      error = null;

      // Store the tracking code before clearing editingShipment
      const trackingCode = editingShipment.tracking_code;

      // Debug Supabase connection
      console.log('🔍 Supabase client:', supabase);
      console.log('🔍 Supabase URL:', supabase.supabaseUrl);
      console.log('🔍 Is mock client?', supabase.from.toString().includes('mock'));
      
      // Test database connection
      const { data: testData, error: testError } = await supabase
        .from('enhanced_shipments')
        .select('count')
        .limit(1);
      
      console.log('🔍 Database connection test:', { testData, testError });
      
      if (testError) {
        console.error('❌ Database connection failed:', testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }

      // Debug logging for photos
      console.log('📸 DEBUG: editForm.product_details:', editForm.product_details);
      console.log('📸 DEBUG: Photos array:', editForm.product_details.photos);
      console.log('📸 DEBUG: Photos length:', editForm.product_details.photos?.length);
      console.log('📸 DEBUG: Photos type:', typeof editForm.product_details.photos);
      console.log('📸 DEBUG: Photos content:', JSON.stringify(editForm.product_details.photos, null, 2));

      // Try to save to enhanced_shipments first, create if doesn't exist
      const enhancedData = {
        tracking_code: trackingCode,
        origin_location: editForm.origin_location,
        origin_facility: editForm.origin_facility,
        origin_guardian: editForm.origin_guardian,
        pickup_date: editForm.pickup_date,
        current_location: editForm.current_location,
        current_facility: editForm.current_facility,
        current_guardian: editForm.current_guardian,
        destination_location: editForm.destination_location,
        destination_facility: editForm.destination_facility,
        recipient_name: editForm.recipient_name,
        recipient_contact: editForm.recipient_contact,
        estimated_delivery: editForm.estimated_delivery,
        product_details: editForm.product_details,
        journey_status: editForm.journey_status,
        security_level: editForm.security_level,
        verification_status: editForm.verification_status
      };

      console.log('🔍 Saving enhanced shipment data:', enhancedData);
      console.log('🔍 Tracking code:', trackingCode);
      console.log('📸 DEBUG: Enhanced data product_details:', enhancedData.product_details);
      console.log('📸 DEBUG: Enhanced data photos:', enhancedData.product_details.photos);

      // First try to update existing record
      let { data: updateResult, error: updateError } = await supabase
        .from('enhanced_shipments')
        .update(enhancedData)
        .eq('tracking_code', trackingCode)
        .select();

      if (updateError) {
        console.log('⚠️ Update failed, trying to insert new record...');
        // If update fails, try to insert new record
        const { data: insertResult, error: insertError } = await supabase
          .from('enhanced_shipments')
          .insert([enhancedData])
          .select();

        if (insertError) {
          console.error('❌ Enhanced shipment save error:', insertError);
          console.log('🔄 Falling back to regular shipments table...');
          
          // Fall back to regular shipments table
          const { data: existingShipment, error: checkError } = await supabase
            .from('shipments')
            .select('id')
            .eq('tracking_code', trackingCode)
            .single();

          if (checkError) {
            console.log('📝 No existing shipment found, creating new one...');
            // Create new shipment record
            const { data: newShipment, error: createError } = await supabase
              .from('shipments')
              .insert([{
                tracking_code: trackingCode,
                product_details: editForm.product_details,
                current_location: editForm.current_location,
                delivery_info: {
                  destination: editForm.destination_location,
                  recipient_name: editForm.recipient_name,
                  recipient_contact: editForm.recipient_contact,
                  estimatedDelivery: editForm.estimated_delivery
                },
                status: editForm.journey_status === 'delivered' ? 'delivered' : 
                       editForm.journey_status === 'in-transit' ? 'in-transit' : 
                       editForm.journey_status === 'pickup' ? 'pickup' : 'pending'
              }])
              .select();

            if (createError) {
              throw new Error(`Failed to create shipment: ${createError.message}`);
            }

            console.log('✅ New shipment created:', newShipment);
            success = 'Shipment created successfully in regular table!';
          } else {
            // Update existing shipment
            const updateData = {
              product_details: editForm.product_details,
              current_location: editForm.current_location,
              delivery_info: {
                destination: editForm.destination_location,
                recipient_name: editForm.recipient_name,
                recipient_contact: editForm.recipient_contact,
                estimatedDelivery: editForm.estimated_delivery
              },
              status: editForm.journey_status === 'delivered' ? 'delivered' : 
                     editForm.journey_status === 'in-transit' ? 'in-transit' : 
                     editForm.journey_status === 'pickup' ? 'pickup' : 'pending'
            };

            const { data: updateResult, error: updateError } = await supabase
              .from('shipments')
              .update(updateData)
              .eq('id', existingShipment.id)
              .select();

            if (updateError) {
              throw new Error(`Failed to update shipment: ${updateError.message}`);
            }

            console.log('✅ Regular shipment updated:', updateResult);
            success = 'Shipment updated successfully in regular table!';
          }
        } else {
          console.log('✅ Enhanced shipment created:', insertResult);
          success = 'Shipment saved successfully to enhanced table!';
        }
      } else {
        console.log('✅ Enhanced shipment updated:', updateResult);
        success = 'Shipment updated successfully!';
      }

      // Close modal and cleanup
      showEditModal = false;
      editingShipment = null;
      
      // Reload shipments to show updated data
      await loadShipments();
      
      // Broadcast refresh event to any open tracking pages
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('adminShipmentUpdated', { 
          detail: { 
            trackingCode: trackingCode,
            message: 'Shipment updated - refresh tracking page to see changes'
          }
        }));
      }
      
      setTimeout(() => success = '', 3000);

    } catch (err) {
      console.error('Error saving shipment:', err);
      error = err.message || 'Failed to save shipment changes';
    } finally {
      loading = false;
    }
  }

  function closeEditModal() {
    showEditModal = false;
    editingShipment = null;
  }

  // Image upload event handlers
  function handleImageUploadSuccess(event) {
    const { images, trackingCode } = event.detail;
    console.log('✅ Images uploaded successfully:', images);
    console.log('📸 DEBUG: Current photos before update:', editForm.product_details.photos);
    
    // Update the form with new images
    editForm.product_details.photos = [...(editForm.product_details.photos || []), ...images];
    
    console.log('📸 DEBUG: Photos after update:', editForm.product_details.photos);
    console.log('📸 DEBUG: Photos length after update:', editForm.product_details.photos.length);
    
    // Show success message
    success = `Successfully uploaded ${images.length} image(s) for tracking code ${trackingCode}`;
    setTimeout(() => success = '', 5000);
  }

  function handleImageUploadError(event) {
    const { error: uploadError } = event.detail;
    console.error('❌ Image upload failed:', uploadError);
    
    // Show error message
    error = `Failed to upload images: ${uploadError}`;
    setTimeout(() => error = '', 5000);
  }

  function handleImageRemove(event) {
    const { imageUrl, trackingCode } = event.detail;
    console.log('🗑️ Removing image:', imageUrl);
    
    // Remove image from the form
    editForm.product_details.photos = (editForm.product_details.photos || []).filter(img => img !== imageUrl);
    
    // Show success message
    success = `Image removed from tracking code ${trackingCode}`;
    setTimeout(() => success = '', 3000);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
  }

  function getStatusColor(status) {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  async function testDatabase() {
    try {
      console.log('🧪 Testing database connection...');
      
      // Test 1: Check if we can read from tracking_codes table
      const { data: testRead, error: readError } = await supabase
        .from('tracking_codes')
        .select('*')
        .limit(1);
      
      if (readError) {
        console.error('❌ Read test failed:', readError);
        error = 'Database read test failed: ' + readError.message;
        return;
      }
      
      console.log('✅ Read test passed:', testRead);
      
      // Test 2: Check if we can update a simple field with valid status
      if (testRead && testRead.length > 0) {
        const testCode = testRead[0];
        console.log('🧪 Testing update with valid status...');
        
        // Use a valid status value from the constraint
        const { data: testUpdate, error: updateError } = await supabase
          .from('tracking_codes')
          .update({ status: 'suspended' }) // Use valid status: 'active', 'inactive', 'suspended'
          .eq('id', testCode.id)
          .select();
        
        if (updateError) {
          console.error('❌ Update test failed:', updateError);
          error = 'Database update test failed: ' + updateError.message;
          return;
        }
        
        console.log('✅ Update test passed:', testUpdate);
        
        // Revert the test change back to original status
        await supabase
          .from('tracking_codes')
          .update({ status: testCode.status })
          .eq('id', testCode.id);
        
        console.log('✅ Test reverted to original status:', testCode.status);
      }
      
      success = 'Database connection test passed!';
      setTimeout(() => success = '', 5000);
      
    } catch (err) {
      console.error('❌ Database test failed:', err);
      error = 'Database test failed: ' + (err.message || 'Unknown error');
    }
  }

  async function testSupabaseConnection() {
    try {
      console.log('🔍 Testing Supabase connection...');
      console.log('🔍 Supabase client:', supabase);
      console.log('🔍 Environment variables:', {
        url: import.meta.env.VITE_SUPABASE_URL,
        key: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Loaded' : '❌ Missing'
      });
      
      // Simple ping test
      const { data, error: connectionError } = await supabase
        .from('tracking_codes')
        .select('count')
        .limit(1);
      
      if (connectionError) {
        console.error('❌ Connection test failed:', connectionError);
        error = 'Connection test failed: ' + connectionError.message;
      } else {
        console.log('✅ Connection test passed:', data);
        success = 'Supabase connection successful!';
        setTimeout(() => success = '', 5000);
      }
      
    } catch (err) {
      console.error('❌ Connection test error:', err);
      error = 'Connection test error: ' + (err.message || 'Unknown error');
    }
  }

  async function findCoordinates(originOrDestination) {
    try {
      let location;
      let address, city, country;
      
      if (originOrDestination === 'origin') {
        location = editForm.origin_location;
        address = editForm.origin_location.address;
        city = editForm.origin_location.city;
        country = editForm.origin_location.country;
      } else if (originOrDestination === 'current') {
        location = editForm.current_location;
        address = editForm.current_location.address;
        city = editForm.current_location.city;
        country = editForm.current_location.country;
      } else if (originOrDestination === 'destination') {
        location = editForm.destination_location;
        address = editForm.destination_location.address;
        city = editForm.destination_location.city;
        country = editForm.destination_location.country;
      }

      if (!address || !city || !country) {
        console.warn(`Missing address information for ${originOrDestination}`);
        return;
      }

      const searchQuery = `${address}, ${city}, ${country}`;
      console.log(`🔍 Searching coordinates for ${originOrDestination}:`, searchQuery);

      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        location.latitude = parseFloat(result.lat);
        location.longitude = parseFloat(result.lon);
        console.log(`✅ Coordinates for ${originOrDestination} found:`, result);
        console.log(`📍 Set ${originOrDestination} coordinates:`, location.latitude, location.longitude);
      } else {
        console.warn(`❌ No coordinates found for ${originOrDestination}:`, searchQuery);
      }
    } catch (error) {
      console.error('❌ Error finding coordinates:', error);
      error = 'Failed to find coordinates: ' + error.message;
    }
  }

  async function createCompleteShipment() {
    try {
      loading = true;
      error = null;
      
      // Generate tracking code first
      const trackingCode = generateSecureTrackingCode();
      console.log('🔑 Generated tracking code:', trackingCode);
      
      // STEP 1: Create tracking code record FIRST
      console.log('📝 Step 1: Creating tracking code record...');
      const { error: codeError } = await supabase
        .from('tracking_codes')
        .insert([{
          code: trackingCode, // Fixed: using 'code' column, not 'tracking_code'
          status: 'active',
          metadata: { created_by: 'admin' }
        }]);
      
      if (codeError) {
        throw new Error(`Failed to create tracking code: ${codeError.message}`);
      }
      console.log('✅ Tracking code record created successfully');
      
      // STEP 2: Prepare complete shipment data
      const completeShipmentData = {
        tracking_code: trackingCode,
        origin_location: createForm.origin_location,
        origin_facility: createForm.origin_facility,
        origin_guardian: createForm.origin_guardian,
        pickup_date: createForm.pickup_date,
        current_location: createForm.current_location,
        current_facility: createForm.current_facility,
        current_guardian: createForm.current_guardian,
        destination_location: createForm.destination_location,
        destination_facility: createForm.destination_facility,
        recipient_name: createForm.recipient_name,
        recipient_contact: createForm.recipient_contact,
        estimated_delivery: createForm.estimated_delivery,
        product_details: createForm.product_details,
        journey_status: createForm.journey_status,
        security_level: createForm.security_level,
        verification_status: createForm.verification_status
      };
      
      console.log('📦 Complete shipment data prepared:', completeShipmentData);
      console.log('📸 PHOTO DEBUG BEFORE SAVING:');
      console.log('📸 Product details:', completeShipmentData.product_details);
      console.log('📸 Photos array:', completeShipmentData.product_details.photos);
      console.log('📸 Photos length:', completeShipmentData.product_details.photos?.length);
      console.log('📸 Photos type:', typeof completeShipmentData.product_details.photos);
      if (completeShipmentData.product_details.photos?.length > 0) {
        console.log('📸 First photo sample:', completeShipmentData.product_details.photos[0].substring(0, 100) + '...');
      }
      
      // STEP 3: Try to save to enhanced_shipments first
      console.log('📝 Step 3: Attempting to save to enhanced_shipments...');
      let { data: enhancedResult, error: enhancedError } = await supabase
        .from('enhanced_shipments')
        .insert([completeShipmentData])
        .select();
      
            if (enhancedError) {
        console.log('⚠️ Enhanced table failed, trying regular shipments table...');
        console.log('❌ Enhanced error:', enhancedError);
        console.log('📸 PHOTO DEBUG - Enhanced save failed');
        
        // Check if it's a schema issue or table doesn't exist
        if (enhancedError.code === '42P01' || enhancedError.message.includes('relation "enhanced_shipments" does not exist')) {
          console.log('📋 Enhanced_shipments table does not exist, using regular table');
        } else if (enhancedError.code === '42703' || enhancedError.message.includes('column') || enhancedError.message.includes('does not exist')) {
          console.log('📋 Enhanced_shipments table schema mismatch, using regular table');
        } else {
          console.log('⚠️ Unknown enhanced table error, falling back to regular table');
        }
        
        // STEP 4: Fall back to regular shipments table
        const regularShipmentData = {
          tracking_code: trackingCode,
          product_details: createForm.product_details,
          current_location: createForm.current_location,
          delivery_info: {
            destination: createForm.destination_location,
            recipient_name: createForm.recipient_name,
            recipient_contact: createForm.recipient_contact,
            estimatedDelivery: createForm.estimated_delivery
          },
          status: createForm.journey_status === 'delivered' ? 'delivered' : 
                 createForm.journey_status === 'in-transit' ? 'in-transit' : 
                 createForm.journey_status === 'pickup' ? 'pickup' : 'pending'
        };
        
        console.log('📝 Step 4: Saving to regular shipments table...');
        const { data: regularResult, error: regularError } = await supabase
          .from('shipments')
          .insert([regularShipmentData])
          .select();
        
        if (regularError) {
          console.error('❌ Regular shipments table also failed:', regularError);
          throw new Error(`Failed to create shipment in both tables: ${regularError.message}`);
        }
        
        console.log('✅ Regular shipment created:', regularResult);
        success = `Shipment created successfully with tracking code: ${trackingCode}`;
      } else {
        console.log('✅ Enhanced shipment created:', enhancedResult);
        console.log('📸 PHOTO DEBUG AFTER SAVE:');
        console.log('📸 Saved product details:', enhancedResult[0]?.product_details);
        console.log('📸 Saved photos:', enhancedResult[0]?.product_details?.photos);
        console.log('📸 Saved photos length:', enhancedResult[0]?.product_details?.photos?.length);
        success = `Enhanced shipment created successfully with tracking code: ${trackingCode}`;
      }
      
      // STEP 5: Close form and reload data
      console.log('📝 Step 5: Finalizing and reloading data...');
      showCreateForm = false;
      cleanupCreateMaps();
      resetCreateForm();
      await loadTrackingCodes();
      await loadShipments();
      
      // Show success with tracking code
      success = `✅ Shipment created successfully! Tracking Code: ${trackingCode}`;
      setTimeout(() => success = '', 5000);
      
    } catch (err) {
      console.error('❌ Error creating complete shipment:', err);
      error = err.message || 'Failed to create shipment';
      
      // If we created a tracking code but failed to create shipment, we should clean up
      if (err.message.includes('Failed to create shipment') && trackingCode) {
        console.log('🧹 Cleaning up orphaned tracking code...');
        try {
          await supabase
            .from('tracking_codes')
            .delete()
            .eq('tracking_code', trackingCode);
          console.log('✅ Orphaned tracking code cleaned up');
        } catch (cleanupError) {
          console.warn('⚠️ Could not clean up orphaned tracking code:', cleanupError);
        }
      }
    } finally {
      loading = false;
    }
  }

  async function findCoordinatesForCreate(locationType) {
    try {
      let address = '';
      let city = '';
      let country = '';
      
      if (locationType === 'origin') {
        address = createForm.origin_location.address;
        city = createForm.origin_location.city;
        country = createForm.origin_location.country;
      } else if (locationType === 'current') {
        address = createForm.current_location.address;
        city = createForm.current_location.city;
        country = createForm.current_location.country;
      } else if (locationType === 'destination') {
        address = createForm.destination_location.address;
        city = createForm.destination_location.city;
        country = createForm.destination_location.country;
      }
      
      if (!address && !city && !country) {
        console.warn(`Missing address information for ${locationType}`);
        return;
      }
      
      const fullAddress = [address, city, country].filter(Boolean).join(', ');
      console.log(`🔍 Searching coordinates for ${locationType}:`, fullAddress);
      
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        console.log(`✅ Coordinates found for ${locationType}:`, lat, lon);
        
        if (locationType === 'origin') {
          createForm.origin_location.latitude = parseFloat(lat);
          createForm.origin_location.longitude = parseFloat(lon);
        } else if (locationType === 'current') {
          createForm.current_location.latitude = parseFloat(lat);
          createForm.current_location.longitude = parseFloat(lon);
        } else if (locationType === 'destination') {
          createForm.destination_location.latitude = parseFloat(lat);
          createForm.destination_location.longitude = parseFloat(lon);
        }
        
        // Update map marker if map exists, don't reinitialize
        if (mapMarkers[`create-${locationType}`] && mapMarkers[`create-${locationType}`].map) {
          const map = mapMarkers[`create-${locationType}`].map;
          const L = window.L;
          
          // Remove existing marker if any
          if (mapMarkers[`create-${locationType}`].marker) {
            map.removeLayer(mapMarkers[`create-${locationType}`].marker);
          }
          
          // Add new marker at found coordinates
          mapMarkers[`create-${locationType}`].marker = L.marker([parseFloat(lat), parseFloat(lon)]).addTo(map);
          map.setView([parseFloat(lat), parseFloat(lon)], 10);
          
          console.log(`📍 Updated ${locationType} map marker at coordinates:`, lat, lon);
        }
        
      } else {
        console.warn(`❌ No coordinates found for ${locationType}:`, fullAddress);
      }
    } catch (error) {
      console.error(`❌ Error finding coordinates for ${locationType}:`, error);
    }
  }

  function initializeCreateMap(mapId, locationType) {
    if (typeof window === 'undefined') return;
    
    try {
      console.log(`🗺️ Initializing create ${locationType} map for element:`, mapId);
      const mapContainer = document.getElementById(mapId);
      if (!mapContainer) {
        console.error(`❌ Create map container not found: ${mapId}`);
        return;
      }
      
      // Check if map is already initialized for this location
      if (mapMarkers[`create-${locationType}`] && mapMarkers[`create-${locationType}`].map) {
        console.log(`✅ Map for ${locationType} already initialized, skipping...`);
        return;
      }
      
      // Clear existing content
      mapContainer.innerHTML = '';
      
      // Check if Leaflet is available
      if (!window.L) {
        console.error('❌ Leaflet not loaded yet for create form');
        return;
      }
      
      console.log(`✅ Leaflet found, creating create map for ${locationType}`);
      const L = window.L;
      
      // Create map with default view
      const map = L.map(mapId).setView([0, 0], 2);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      
      // Add click handler to set coordinates
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        console.log(`📍 ${locationType} location set to:`, lat, lng);
        
        // Update form coordinates
        if (locationType === 'origin') {
          createForm.origin_location.latitude = lat;
          createForm.origin_location.longitude = lng;
        } else if (locationType === 'current') {
          createForm.current_location.latitude = lat;
          createForm.current_location.longitude = lng;
        } else if (locationType === 'destination') {
          createForm.destination_location.latitude = lat;
          createForm.destination_location.longitude = lng;
        }
        
        // Add or update marker
        if (mapMarkers[`create-${locationType}`] && mapMarkers[`create-${locationType}`].marker) {
          mapMarkers[`create-${locationType}`].marker.setLatLng([lat, lng]);
        } else {
          if (!mapMarkers[`create-${locationType}`]) {
            mapMarkers[`create-${locationType}`] = { map, marker: null };
          }
          mapMarkers[`create-${locationType}`].marker = L.marker([lat, lng]).addTo(map);
        }
        
        // Center map on clicked location
        map.setView([lat, lng], 10);
      });
      
      // Store the map reference
      mapMarkers[`create-${locationType}`] = { map, marker: null };
      
      // Set initial view if coordinates exist
      let coords = [0, 0];
      if (locationType === 'origin' && createForm.origin_location.latitude && createForm.origin_location.longitude) {
        coords = [createForm.origin_location.latitude, createForm.origin_location.longitude];
      } else if (locationType === 'current' && createForm.current_location.latitude && createForm.current_location.longitude) {
        coords = [createForm.current_location.latitude, createForm.current_location.longitude];
      } else if (locationType === 'destination' && createForm.destination_location.latitude && createForm.destination_location.longitude) {
        coords = [createForm.destination_location.latitude, createForm.destination_location.longitude];
      }
      
      if (coords[0] !== 0 || coords[1] !== 0) {
        map.setView(coords, 10);
        mapMarkers[`create-${locationType}`].marker = L.marker(coords).addTo(map);
      }
      
      console.log(`✅ Create ${locationType} map initialized successfully`);
      
    } catch (error) {
      console.error(`❌ Failed to initialize create ${locationType} map:`, error);
    }
  }

  async function testDatabaseTables() {
    try {
      console.log('🔍 Testing database tables...');
      
      // Test tracking_codes table
      const { data: trackingCodesTest, error: trackingCodesError } = await supabase
        .from('tracking_codes')
        .select('count')
        .limit(1);
      
      if (trackingCodesError) {
        console.log('❌ tracking_codes table error:', trackingCodesError);
      } else {
        console.log('✅ tracking_codes table accessible');
      }
      
      // Test shipments table
      const { data: shipmentsTest, error: shipmentsError } = await supabase
        .from('shipments')
        .select('count')
        .limit(1);
      
      if (shipmentsError) {
        console.log('❌ shipments table error:', shipmentsError);
      } else {
        console.log('✅ shipments table accessible');
      }
      
      // Test enhanced_shipments table
      const { data: enhancedTest, error: enhancedError } = await supabase
        .from('enhanced_shipments')
        .select('count')
        .limit(1);
      
      if (enhancedError) {
        console.log('❌ enhanced_shipments table error:', enhancedError);
        if (enhancedError.code === '42P01') {
          console.log('📋 Table does not exist');
        } else if (enhancedError.code === '42703') {
          console.log('📋 Schema mismatch');
        }
      } else {
        console.log('✅ enhanced_shipments table accessible');
      }
      
      // Test table schemas
      console.log('🔍 Testing table schemas...');
      
      // Get shipments table info
      try {
        const { data: shipmentsSchema } = await supabase
          .from('shipments')
          .select('*')
          .limit(1);
        console.log('📋 shipments table columns:', shipmentsSchema && shipmentsSchema.length > 0 ? Object.keys(shipmentsSchema[0]) : 'No data');
      } catch (e) {
        console.log('❌ Could not get shipments schema:', e);
      }
      
      // Get tracking_codes table info
      try {
        const { data: trackingSchema } = await supabase
          .from('tracking_codes')
          .select('*')
          .limit(1);
        console.log('📋 tracking_codes table columns:', trackingSchema && trackingSchema.length > 0 ? Object.keys(trackingSchema[0]) : 'No data');
      } catch (e) {
        console.log('❌ Could not get tracking_codes schema:', e);
      }
      
      console.log('✅ Database table test completed');
      
    } catch (error) {
      console.error('❌ Database table test failed:', error);
    }
  }

  // Image handling functions for create form
  function handleCreateImageSelect(event) {
    const files = Array.from(event.target.files);
    handleCreateImageFiles(files);
  }

  function handleCreateImageDrop(event) {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    handleCreateImageFiles(files);
  }

  function handleCreateImageFiles(files) {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('Please select only image files');
      return;
    }

    imageFiles.forEach(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        createForm.product_details.photos = [...(createForm.product_details.photos || []), e.target.result];
        createForm.product_details.photos = createForm.product_details.photos; // Trigger reactivity
      };
      reader.readAsDataURL(file);
    });
  }

  function removeCreateImage(index) {
    createForm.product_details.photos = createForm.product_details.photos.filter((_, i) => i !== index);
  }

  function cleanupCreateMaps() {
    try {
      console.log('🧹 Cleaning up create form maps...');
      
      // Clean up each map instance
      ['origin', 'current', 'destination'].forEach(locationType => {
        const mapKey = `create-${locationType}`;
        if (mapMarkers[mapKey] && mapMarkers[mapKey].map) {
          try {
            // Remove the map instance
            mapMarkers[mapKey].map.remove();
            console.log(`✅ Cleaned up ${locationType} map`);
          } catch (error) {
            console.warn(`⚠️ Error cleaning up ${locationType} map:`, error);
          }
        }
      });
      
      // Clear the map markers object
      mapMarkers = {};
      console.log('✅ All create form maps cleaned up');
      
    } catch (error) {
      console.error('❌ Error cleaning up create form maps:', error);
    }
  }
</script>

<svelte:head>
  <title>Admin - Gold Shipment Tracker</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p class="text-sm text-gray-600">Kier Logistics Management</p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <button
            on:click={() => {
              showCreateForm = true;
              // Initialize maps after form is visible
              setTimeout(() => {
                if (typeof window !== 'undefined' && window.L) {
                  initializeCreateMap('create-origin-map', 'origin');
                  initializeCreateMap('create-current-map', 'current');
                  initializeCreateMap('create-destination-map', 'destination');
                }
              }, 200);
            }}
            disabled={loading}
            class="btn-primary"
            title="Create new shipment with all details"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Create Shipment
          </button>
          <button
            on:click={testDatabase}
            disabled={loading}
            class="btn-secondary"
            title="Test database connection and JSON handling"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Test DB
          </button>
          <button
            on:click={testDatabaseTables}
            disabled={loading}
            class="btn-secondary"
            title="Test database tables and schemas"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 002 2z"></path>
            </svg>
            Test Tables
          </button>
          <button
            on:click={testSupabaseConnection}
            disabled={loading}
            class="btn-secondary"
            title="Test Supabase connection and environment variables"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            Test Connection
          </button>
        <a href="/" class="btn-secondary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
            Back to Tracking
        </a>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Setup Instructions -->
    {#if !supabase || !supabase.from}
      <div class="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-yellow-800">Database Not Configured</h2>
            <p class="text-sm text-yellow-700">Set up Supabase to enable full functionality</p>
          </div>
        </div>
        
        <div class="bg-white border border-yellow-200 rounded-lg p-4 mb-4">
          <h3 class="text-sm font-medium text-yellow-800 mb-2">Quick Setup:</h3>
          <ol class="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
            <li>Create a <code class="bg-yellow-100 px-1 rounded">.env</code> file in your project root</li>
            <li>Add your Supabase credentials:</li>
          </ol>
          <div class="mt-3 bg-gray-100 p-3 rounded font-mono text-xs">
            VITE_SUPABASE_URL=https://your-project-id.supabase.co<br>
            VITE_SUPABASE_ANON_KEY=your_anon_key_here
          </div>
          <p class="text-xs text-yellow-600 mt-2">Restart your dev server after creating the .env file</p>
        </div>
        
        <div class="flex space-x-3">
          <a href="https://supabase.com/docs/guides/getting-started" target="_blank" class="btn-secondary text-sm">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2h-4M10 6a2 2 0 002 2h2a2 2 0 002-2M10 6a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            Supabase Docs
          </a>
          <button on:click={() => window.location.reload()} class="btn-primary text-sm">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Reload Page
          </button>
        </div>
      </div>
    {/if}

    <!-- Success Message -->
    {#if success}
      <div class="fixed top-4 right-4 z-50">
        <div class="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 max-w-sm">
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <div class="flex-1">
              <p class="text-sm font-medium text-green-800">
                {success}
              </p>
            </div>
            <button
              on:click={() => success = ''}
              class="text-green-400 hover:text-green-600 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    {/if}

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Generate Tracking Code -->
      <div class="card">
        <div class="flex items-center space-x-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Generate Secure Tracking Codes</h2>
            <p class="text-sm text-gray-600">Create new XXX-XXXX-XXXX format codes</p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- Single Code Generation -->
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-medium text-gray-900 mb-3">Single Code</h3>
          <button
            on:click={generateTrackingCode}
            disabled={loading}
            class="w-full btn-primary disabled:opacity-50"
          >
            {#if loading}
              <div class="loading-spinner mx-auto"></div>
            {:else}
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
                Generate Single Code
            {/if}
          </button>
          </div>

          <!-- Multiple Code Generation -->
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-medium text-gray-900 mb-3">Multiple Codes</h3>
            <div class="flex space-x-2 mb-3">
              <input
                type="number"
                bind:value={codeCount}
                min="1"
                max="100"
                class="flex-1 input-field"
                placeholder="Number of codes"
              />
              <button
                on:click={generateMultipleTrackingCodes}
                disabled={loading || codeCount < 1 || codeCount > 100}
                class="btn-primary disabled:opacity-50"
              >
                Generate {codeCount} Codes
              </button>
            </div>
            <p class="text-xs text-gray-500">Maximum 100 codes at once</p>
          </div>

          <!-- Generated Code Display -->
          {#if newTrackingCode}
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-sm font-medium text-green-800">
                  {generatedCodes.length > 1 ? `${generatedCodes.length} Codes Generated` : 'Generated Tracking Code'}
                </h3>
                <button
                  on:click={() => copyToClipboard(newTrackingCode)}
                  class="btn-secondary text-sm"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                  Copy
                </button>
              </div>
              
              {#if generatedCodes.length === 1}
                <p class="text-lg font-mono text-green-900 mt-1">{newTrackingCode}</p>
              {:else}
                <div class="space-y-2">
                  <p class="text-sm text-green-700">First code: <span class="font-mono">{newTrackingCode}</span></p>
                  <button
                    on:click={copyAllCodes}
                    class="btn-secondary text-sm w-full"
                  >
                    Copy All {generatedCodes.length} Codes
                  </button>
                </div>
              {/if}
            </div>
          {/if}

          {#if error}
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <p class="text-sm text-red-700">{error}</p>
            </div>
          {/if}

          {#if success}
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <p class="text-sm text-green-700">{success}</p>
            </div>
          {/if}
        </div>
      </div>

      <!-- Code Format Information -->
      <div class="card">
        <div class="flex items-center space-x-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Code Format</h2>
            <p class="text-sm text-gray-600">Secure tracking code specifications</p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 class="text-sm font-medium text-blue-800 mb-2">Format: XXX-XXXX-XXXX</h3>
            <div class="space-y-2 text-sm text-blue-700">
              <p><strong>Example:</strong> ABC-1234-DEF5</p>
              <p><strong>Total Length:</strong> 14 characters (including hyphens)</p>
              <p><strong>Character Set:</strong> A-H, J-N, P-Z, 2-9 (no ambiguous chars)</p>
              <p><strong>Security:</strong> 11^11 possible combinations</p>
            </div>
          </div>

          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-800 mb-2">Security Features</h3>
            <ul class="text-sm text-gray-700 space-y-1">
              <li>• No ambiguous characters (0/O, 1/I, etc.)</li>
              <li>• Hyphen-separated for easy reading</li>
              <li>• Cryptographically secure random generation</li>
              <li>• Unique code validation</li>
              <li>• Format validation with regex</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Tracking Codes List -->
    <div class="card mt-8">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Active Tracking Codes</h2>
            <p class="text-sm text-gray-600">Manage existing tracking codes</p>
          </div>
        </div>
        <button
          on:click={loadTrackingCodes}
          class="btn-secondary"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Refresh
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tracking Code
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Accessed
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Access Count
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each trackingCodes as code}
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="font-mono text-sm text-gray-900">{code.code}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="status-badge status-in-transit">{code.status}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(code.created_at)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(code.last_accessed)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {code.access_count}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    on:click={() => copyToClipboard(code.code)}
                    class="text-gold-600 hover:text-gold-900 mr-3"
                  >
                    Copy
                  </button>
                  <button
                    on:click={() => editShipment(code.code)}
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    on:click={() => deleteCode(code.id, code.code)}
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      {#if trackingCodes.length === 0}
        <div class="text-center py-8">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <p class="text-gray-500">No tracking codes found</p>
        </div>
      {/if}
    </div>

    <!-- Shipment Management Section -->
    <div class="card mt-8">
      <div class="flex items-center space-x-3 mb-6">
        <div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Shipment Management</h2>
          <p class="text-sm text-gray-600">Edit shipment details and tracking information</p>
        </div>
      </div>

      <!-- Database Connection Test -->
      <div class="mb-6 p-4 bg-gray-50 rounded-lg border">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-900">Database Connection</h3>
            <p class="text-sm text-gray-600">Status: <span class="font-mono text-xs">{connectionStatus}</span></p>
          </div>
          <button 
            on:click={testConnection}
            class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
          >
            Test Connection
          </button>
        </div>
      </div>

      <!-- Shipment List -->
      <div class="space-y-4">
        {#each shipments as shipment}
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div>
                <h3 class="text-lg font-medium text-gray-900">
                  Tracking: {shipment.tracking_code}
                </h3>
                <p class="text-sm text-gray-600">
                  Status: {shipment.status} | Type: {shipment.product_details?.type || 'Unknown'}
                </p>
              </div>
              <div class="flex space-x-2">
                <button
                  on:click={() => editShipment(shipment.tracking_code)}
                  class="btn-secondary text-sm"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit
                </button>
                <button
                  on:click={() => deleteCode(shipment.id, shipment.tracking_code)}
                  class="btn-secondary text-sm bg-red-100 text-red-700 hover:bg-red-200 border-red-300"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span class="font-medium text-gray-700">Weight:</span>
                <span class="ml-2">{shipment.product_details?.weight || 0} {shipment.product_details?.weightUnit || 'kg'}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Purity:</span>
                <span class="ml-2">{shipment.product_details?.purity || 0} {shipment.product_details?.purityUnit || ''}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Location:</span>
                <span class="ml-2">{shipment.current_location?.city || 'Unknown'}, {shipment.current_location?.country || 'Unknown'}</span>
              </div>
            </div>
          </div>
        {/each}

        {#if shipments.length === 0}
          <div class="text-center py-8 text-gray-500">
            <p>No shipments found. Generate tracking codes to create shipments.</p>
          </div>
        {/if}
      </div>
    </div>
  </main>

  <!-- Edit Shipment Modal -->
  {#if showEditModal}
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50" style="z-index: 9999;">
      <!-- Debug info -->
      <div class="absolute top-4 left-4 bg-red-500 text-white p-2 rounded text-xs">
        Debug: Modal is visible | showEditModal: {showEditModal} | editingShipment: {editingShipment ? 'exists' : 'null'}
      </div>
      <div class="relative p-8 border w-2/3 shadow-lg rounded-md bg-white">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Edit Shipment: {editingShipment?.tracking_code}</h3>
          <button on:click={closeEditModal} class="text-gray-500 hover:text-gray-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label for="edit-product-type" class="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
            <input
              type="text"
              id="edit-product-type"
              bind:value={editForm.product_details.type}
              class="input-field"
            />
          </div>
          <div>
            <label for="edit-weight" class="block text-sm font-medium text-gray-700 mb-1">Weight</label>
            <div class="flex space-x-2">
              <input
                type="number"
                id="edit-weight"
                bind:value={editForm.product_details.weight}
                class="flex-1 input-field"
              />
              <select
                bind:value={editForm.product_details.weightUnit}
                class="input-field"
              >
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="oz">oz</option>
              </select>
            </div>
          </div>
          <div>
            <label for="edit-purity" class="block text-sm font-medium text-gray-700 mb-1">Purity</label>
            <div class="flex space-x-2">
              <input
                type="number"
                id="edit-purity"
                bind:value={editForm.product_details.purity}
                class="flex-1 input-field"
              />
              <select
                bind:value={editForm.product_details.purityUnit}
                class="input-field"
              >
                <option value="999.5">999.5</option>
                <option value="999">999</option>
                <option value="995">995</option>
              </select>
            </div>
          </div>
          <div>
            <label for="edit-serial-number" class="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
            <input
              type="text"
              id="edit-serial-number"
              bind:value={editForm.product_details.serialNumber}
              class="input-field"
            />
          </div>
          <div>
            <label for="edit-description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="edit-description"
              bind:value={editForm.product_details.description}
              class="input-field"
            ></textarea>
          </div>
        </div>

        <!-- Origin Information -->
        <div class="border-t border-gray-200 pt-4 mb-4">
          <h4 class="text-lg font-medium text-gray-900 mb-3">📍 Origin Information</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="edit-origin-facility" class="block text-sm font-medium text-gray-700 mb-1">Origin Facility</label>
              <input
                type="text"
                id="edit-origin-facility"
                bind:value={editForm.origin_facility}
                class="input-field"
                placeholder="e.g., London Precious Metals Vault"
              />
            </div>
            <div>
              <label for="edit-origin-guardian" class="block text-sm font-medium text-gray-700 mb-1">Origin Guardian</label>
              <input
                type="text"
                id="edit-origin-guardian"
                bind:value={editForm.origin_guardian}
                class="input-field"
                placeholder="e.g., John Smith - Senior Vault Manager"
              />
            </div>
            <div>
              <label for="edit-pickup-date" class="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
              <input
                type="datetime-local"
                id="edit-pickup-date"
                value={editForm.pickup_date ? editForm.pickup_date.slice(0, 16) : ''}
                on:input={(e) => editForm.pickup_date = e.target.value ? new Date(e.target.value).toISOString() : null}
                class="input-field"
              />
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div class="md:col-span-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">Origin Location</label>
              <LocationSearch 
                bind:value={editForm.origin_location}
                onLocationSelect={(location) => {
                  editForm.origin_location = location;
                }}
                placeholder="Search for origin location..."
              />
            </div>
          </div>
          
          <!-- Origin Map Location -->
          <div class="mt-4">
            <div class="block text-sm font-medium text-gray-700 mb-2">📍 Origin Location</div>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div class="flex items-center space-x-2 mb-2">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span class="text-xs text-gray-600">Click on map to set coordinates</span>
              </div>
              <div id="origin-map" class="w-full h-32 bg-gray-200 rounded border-2 border-dashed border-gray-300"></div>
              <div class="mt-2 text-xs text-gray-600">
                Coordinates: {editForm.origin_location.latitude.toFixed(6)}, {editForm.origin_location.longitude.toFixed(6)}
              </div>
            </div>
          </div>
        </div>

        <!-- Current Location -->
        <div class="border-t border-gray-200 pt-4 mb-4">
          <h4 class="text-lg font-medium text-gray-900 mb-3">📍 Current Location</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="edit-current-facility" class="block text-sm font-medium text-gray-700 mb-1">Current Facility</label>
              <input
                type="text"
                id="edit-current-facility"
                bind:value={editForm.current_facility}
                class="input-field"
                placeholder="e.g., Frankfurt Airport Cargo Terminal"
              />
            </div>
            <div>
              <label for="edit-current-guardian" class="block text-sm font-medium text-gray-700 mb-1">Current Guardian</label>
              <input
                type="text"
                id="edit-current-guardian"
                bind:value={editForm.current_guardian}
                class="input-field"
                placeholder="e.g., Maria Schmidt - Cargo Security"
              />
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div class="md:col-span-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
              <LocationSearch 
                bind:value={editForm.current_location}
                onLocationSelect={(location) => {
                  editForm.current_location = location;
                }}
                placeholder="Search for current location..."
              />
            </div>
          </div>
          
          <!-- Current Map Location -->
          <div class="mt-4">
            <div class="block text-sm font-medium text-gray-700 mb-2">📍 Current Location</div>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div class="flex items-center space-x-2 mb-2">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span class="text-xs text-gray-600">Click on map to set coordinates</span>
              </div>
              <div id="current-map" class="w-full h-32 bg-gray-200 rounded border-2 border-dashed border-gray-300"></div>
              <div class="mt-2 text-xs text-gray-600">
                Coordinates: {editForm.current_location.latitude.toFixed(6)}, {editForm.current_location.longitude.toFixed(6)}
              </div>
            </div>
          </div>
        </div>

        <!-- Destination Information -->
        <div class="border-t border-gray-200 pt-4 mb-4">
          <h4 class="text-lg font-medium text-gray-900 mb-3">🎯 Destination Information</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label for="edit-dest-facility" class="block text-sm font-medium text-gray-700 mb-1">Destination Facility</label>
              <input
                type="text"
                id="edit-dest-facility"
                bind:value={editForm.destination_facility}
                class="input-field"
                placeholder="e.g., Zurich Gold Vault"
              />
            </div>
            <div>
              <label for="edit-recipient-name" class="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
              <input
                type="text"
                id="edit-recipient-name"
                bind:value={editForm.recipient_name}
                class="input-field"
                placeholder="e.g., Swiss Bank Corp"
              />
            </div>
            <div>
              <label for="edit-recipient-contact" class="block text-sm font-medium text-gray-700 mb-1">Recipient Contact</label>
              <input
                type="text"
                id="edit-recipient-contact"
                bind:value={editForm.recipient_contact}
                class="input-field"
                placeholder="e.g., +41 44 123 4567"
              />
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div class="md:col-span-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">Destination Location</label>
              <LocationSearch 
                bind:value={editForm.destination_location}
                onLocationSelect={(location) => {
                  editForm.destination_location = location;
                }}
                placeholder="Search for destination location..."
              />
            </div>
          </div>

          <!-- Map Location Selector -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">📍 Location on Map</label>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div class="flex items-center space-x-2 mb-3">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span class="text-sm text-gray-600">Click on map to set exact coordinates</span>
              </div>
              
              <!-- Map Container -->
              <div id="destination-map" class="w-full h-48 bg-gray-200 rounded-lg border-2 border-dashed border-gray-300"></div>
              
              <!-- Coordinate Display -->
              <div class="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div class="bg-white px-3 py-2 rounded border">
                  <span class="font-medium text-gray-700">Latitude:</span> 
                  <span class="text-blue-600 font-mono">{editForm.destination_location.latitude.toFixed(6)}</span>
                </div>
                <div class="bg-white px-3 py-2 rounded border">
                  <span class="font-medium text-gray-700">Longitude:</span> 
                  <span class="text-blue-600 font-mono">{editForm.destination_location.longitude.toFixed(6)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-3">
            <label for="edit-estimated-delivery" class="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery</label>
            <input
              type="date"
              id="edit-estimated-delivery"
              bind:value={editForm.estimated_delivery}
              class="input-field"
            />
          </div>
        </div>

        <!-- Journey Status & Security -->
        <div class="border-t border-gray-200 pt-4 mb-4">
          <h4 class="text-lg font-medium text-gray-900 mb-3">🚚 Journey Status & Security</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label for="edit-journey-status" class="block text-sm font-medium text-gray-700 mb-1">Journey Status</label>
              <select
                bind:value={editForm.journey_status}
                class="input-field"
              >
                <option value="pending">Pending</option>
                <option value="pickup">Pickup</option>
                <option value="in-transit">In Transit</option>
                <option value="customs">Customs</option>
                <option value="delayed">Delayed</option>
                <option value="delivered">Delivered</option>
                <option value="returned">Returned</option>
              </select>
            </div>
            <div>
              <label for="edit-security-level" class="block text-sm font-medium text-gray-700 mb-1">Security Level</label>
              <select
                bind:value={editForm.security_level}
                class="input-field"
              >
                <option value="standard">Standard</option>
                <option value="high">High</option>
                <option value="maximum">Maximum</option>
              </select>
            </div>
            <div>
              <label for="edit-verification-status" class="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
              <select
                bind:value={editForm.verification_status}
                class="input-field"
              >
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Live Progress Status Bar -->
        <div class="border-t border-gray-200 pt-4 mb-4">
          <h4 class="text-lg font-medium text-gray-900 mb-3">📊 Live Progress Status</h4>
          <div class="relative">
            <!-- Progress Bar -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</div>
                <span class="text-sm font-medium">Pickup</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 rounded-full {editForm.journey_status === 'in-transit' || editForm.journey_status === 'customs' || editForm.journey_status === 'delayed' || editForm.journey_status === 'delivered' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'} flex items-center justify-center text-sm font-bold">2</div>
                <span class="text-sm font-medium">In Transit</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 rounded-full {editForm.journey_status === 'delivered' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'} flex items-center justify-center text-sm font-bold">3</div>
                <span class="text-sm font-medium">Delivered</span>
              </div>
            </div>
            
            <!-- Progress Line -->
            <div class="absolute top-4 left-4 right-4 h-0.5 bg-gray-300 -z-10">
              <div class="h-full bg-blue-600 transition-all duration-500" style="width: {
                editForm.journey_status === 'pending' ? '0%' :
                editForm.journey_status === 'pickup' ? '25%' :
                editForm.journey_status === 'in-transit' ? '50%' :
                editForm.journey_status === 'customs' ? '60%' :
                editForm.journey_status === 'delayed' ? '70%' :
                editForm.journey_status === 'delivered' ? '100%' : '0%'
              }"></div>
            </div>
          </div>
          
          <!-- Current Status Display -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <span class="text-sm font-medium text-blue-800">
                Current Status: <span class="font-bold capitalize">{editForm.journey_status}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Image Upload Section -->
        <div class="border-t border-gray-200 pt-4 mb-4">
          <ImageUpload 
            trackingCode={editingShipment?.tracking_code || ''} 
            currentImages={editForm.product_details.photos || []}
            on:uploadSuccess={handleImageUploadSuccess}
            on:uploadError={handleImageUploadError}
            on:removeImage={handleImageRemove}
          />
        </div>

        <!-- Custody Chain Management -->
        <!-- Location Summary -->
        <div class="border-t border-gray-200 pt-4 mb-4">
          <h4 class="text-lg font-medium text-gray-900 mb-3">🗺️ Location Summary</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h5 class="text-sm font-medium text-blue-800 mb-2">📍 Origin</h5>
              <p class="text-xs text-gray-600">{editForm.origin_location.address || 'Not set'}</p>
              <p class="text-xs text-gray-500">{editForm.origin_location.city}, {editForm.origin_location.country}</p>
            </div>
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <h5 class="text-sm font-medium text-yellow-800 mb-2">📍 Current</h5>
              <p class="text-xs text-gray-600">{editForm.current_location.address || 'Not set'}</p>
              <p class="text-xs text-gray-500">{editForm.current_location.city}, {editForm.current_location.country}</p>
            </div>
            <div class="bg-green-50 border border-green-200 rounded-lg p-3">
              <h5 class="text-sm font-medium text-green-800 mb-2">📍 Destination</h5>
              <p class="text-xs text-gray-600">{editForm.destination_location.address || 'Not set'}</p>
              <p class="text-xs text-gray-500">{editForm.destination_location.city}, {editForm.destination_location.country}</p>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button on:click={closeEditModal} class="btn-secondary text-sm">Cancel</button>
          <button on:click={saveShipment} disabled={loading} class="btn-primary disabled:opacity-50 text-sm">
            {#if loading}
              <div class="loading-spinner mx-auto"></div>
            {:else}
              Save Changes
            {/if}
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Create Shipment Modal -->
  {#if showCreateForm}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Create New Shipment</h2>
            <button on:click={() => showCreateForm = false} class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Create Form Content -->
          <div class="space-y-6">
            <!-- Product Details -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="text-lg font-medium text-gray-900 mb-4">📦 Product Details</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                  <input
                    type="text"
                    bind:value={createForm.product_details.type}
                    class="input-field"
                    placeholder="e.g., Gold Bars"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                  <input
                    type="text"
                    bind:value={createForm.product_details.serialNumber}
                    class="input-field"
                    placeholder="e.g., GB-001-2024"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                  <div class="flex space-x-2">
                    <input
                      type="number"
                      bind:value={createForm.product_details.weight}
                      class="flex-1 input-field"
                      placeholder="0.00"
                    />
                    <select bind:value={createForm.product_details.weightUnit} class="input-field">
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="oz">oz</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Purity</label>
                  <input
                    type="number"
                    bind:value={createForm.product_details.purity}
                    class="input-field"
                    placeholder="999.5"
                    step="0.1"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    bind:value={createForm.product_details.description}
                    class="input-field"
                    rows="2"
                    placeholder="Detailed description of the shipment..."
                  ></textarea>
                </div>
              </div>
              
              <!-- Product Images -->
              <div class="mt-6">
                <label class="block text-sm font-medium text-gray-700 mb-3">📸 Product Images</label>
                <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div class="flex items-center space-x-2 mb-3">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"></path>
                    </svg>
                    <span class="text-sm text-gray-600">Upload images of the gold shipment</span>
                  </div>
                  
                  <!-- Image Upload Area -->
                  <div 
                    class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                    on:click={() => document.getElementById('create-image-upload').click()}
                    on:keydown={(e) => e.key === 'Enter' || e.key === ' ' ? document.getElementById('create-image-upload').click() : null}
                    on:dragover={(e) => e.preventDefault()}
                    on:drop={(e) => handleCreateImageDrop(e)}
                    role="button"
                    tabindex="0"
                    aria-label="Drag and drop area for image uploads"
                  >
                    <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <p class="mt-1 text-sm text-gray-600">
                      <span class="font-medium text-blue-600 hover:text-blue-500">Click to upload</span> or drag and drop
                    </p>
                    <p class="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                  </div>
                  
                  <!-- Hidden File Input -->
                  <input
                    id="create-image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    class="hidden"
                    on:change={(e) => handleCreateImageSelect(e)}
                  />
                  
                  <!-- Image Preview Grid -->
                  {#if createForm.product_details.photos && createForm.product_details.photos.length > 0}
                    <div class="mt-4">
                      <h4 class="text-sm font-medium text-gray-700 mb-2">Uploaded Images ({createForm.product_details.photos.length})</h4>
                      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {#each createForm.product_details.photos as photo, index}
                          <div class="relative group">
                            <img 
                              src={photo} 
                              alt="Product image {index + 1}"
                              class="w-full h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              on:click={() => removeCreateImage(index)}
                              class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                              title="Remove image"
                            >
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                            </button>
                          </div>
                        {/each}
                      </div>
                    </div>
                  {/if}
                </div>
              </div>
            </div>

            <!-- Origin Information -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="text-lg font-medium text-gray-900 mb-4">📍 Origin Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Origin Facility</label>
                  <input
                    type="text"
                    bind:value={createForm.origin_facility}
                    class="input-field"
                    placeholder="e.g., London Precious Metals Vault"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Origin Guardian</label>
                  <input
                    type="text"
                    bind:value={createForm.origin_guardian}
                    class="input-field"
                    placeholder="e.g., John Smith - Senior Vault Manager"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
                  <input
                    type="datetime-local"
                    bind:value={createForm.pickup_date}
                    class="input-field"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Origin Address</label>
                  <input
                    type="text"
                    bind:value={createForm.origin_location.address}
                    class="input-field"
                    placeholder="e.g., 123 Vault Street, London"
                    on:blur={() => findCoordinatesForCreate('origin')}
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Origin City</label>
                  <input
                    type="text"
                    bind:value={createForm.origin_location.city}
                    class="input-field"
                    placeholder="e.g., London"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Origin Country</label>
                  <input
                    type="text"
                    bind:value={createForm.origin_location.country}
                    class="input-field"
                    placeholder="e.g., United Kingdom"
                  />
                </div>
              </div>
              
              <!-- Origin Map -->
              <div class="mt-4">
                <div class="block text-sm font-medium text-gray-700 mb-2">📍 Origin Location Map</div>
                <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div class="flex items-center space-x-2 mb-2">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span class="text-xs text-gray-600">Click on map to set coordinates</span>
                  </div>
                  <div id="create-origin-map" class="w-full h-32 bg-gray-200 rounded border-2 border-dashed border-gray-300"></div>
                  <div class="mt-2 text-xs text-gray-600">
                    Coordinates: {createForm.origin_location.latitude.toFixed(6)}, {createForm.origin_location.longitude.toFixed(6)}
                  </div>
                </div>
              </div>
            </div>

            <!-- Current Location -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="text-lg font-medium text-gray-900 mb-4">📍 Current Location</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Current Facility</label>
                  <input
                    type="text"
                    bind:value={createForm.current_facility}
                    class="input-field"
                    placeholder="e.g., Frankfurt Airport Cargo Terminal"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Current Guardian</label>
                  <input
                    type="text"
                    bind:value={createForm.current_guardian}
                    class="input-field"
                    placeholder="e.g., Maria Schmidt - Cargo Security"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Current Address</label>
                  <input
                    type="text"
                    bind:value={createForm.current_location.address}
                    class="input-field"
                    placeholder="e.g., 456 Cargo Street, Frankfurt"
                    on:blur={() => findCoordinatesForCreate('current')}
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Current City</label>
                  <input
                    type="text"
                    bind:value={createForm.current_location.city}
                    class="input-field"
                    placeholder="e.g., Frankfurt"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Current Country</label>
                  <input
                    type="text"
                    bind:value={createForm.current_location.country}
                    class="input-field"
                    placeholder="e.g., Germany"
                  />
                </div>
              </div>
              
              <!-- Current Map -->
              <div class="mt-4">
                <div class="block text-sm font-medium text-gray-700 mb-2">📍 Current Location Map</div>
                <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div class="flex items-center space-x-2 mb-2">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span class="text-xs text-gray-600">Click on map to set coordinates</span>
                  </div>
                  <div id="create-current-map" class="w-full h-32 bg-gray-200 rounded border-2 border-dashed border-gray-300"></div>
                  <div class="mt-2 text-xs text-gray-600">
                    Coordinates: {createForm.current_location.latitude.toFixed(6)}, {createForm.current_location.longitude.toFixed(6)}
                  </div>
                </div>
              </div>
            </div>

            <!-- Destination Information -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="text-lg font-medium text-gray-900 mb-4">🎯 Destination Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Destination Facility</label>
                  <input
                    type="text"
                    bind:value={createForm.destination_facility}
                    class="input-field"
                    placeholder="e.g., Zurich Gold Vault"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    bind:value={createForm.recipient_name}
                    class="input-field"
                    placeholder="e.g., Swiss Bank Corp"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Recipient Contact</label>
                  <input
                    type="text"
                    bind:value={createForm.recipient_contact}
                    class="input-field"
                    placeholder="e.g., +41 44 123 4567"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery</label>
                  <input
                    type="date"
                    bind:value={createForm.estimated_delivery}
                    class="input-field"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Destination Address</label>
                  <input
                    type="text"
                    bind:value={createForm.destination_location.address}
                    class="input-field"
                    placeholder="e.g., 456 Gold Street, Zurich"
                    on:blur={() => findCoordinatesForCreate('destination')}
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Destination City</label>
                  <input
                    type="text"
                    bind:value={createForm.destination_location.city}
                    class="input-field"
                    placeholder="e.g., Zurich"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Destination Country</label>
                  <input
                    type="text"
                    bind:value={createForm.destination_location.country}
                    class="input-field"
                    placeholder="e.g., Switzerland"
                  />
                </div>
              </div>
              
              <!-- Destination Map -->
              <div class="mt-4">
                <div class="block text-sm font-medium text-gray-700 mb-2">📍 Destination Location Map</div>
                <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div class="flex items-center space-x-2 mb-3">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span class="text-sm text-gray-600">Click on map to set exact coordinates</span>
                  </div>
                  
                  <!-- Map Container -->
                  <div id="create-destination-map" class="w-full h-48 bg-gray-200 rounded-lg border-2 border-dashed border-gray-300"></div>
                  
                  <!-- Coordinate Display -->
                  <div class="mt-3 grid grid-cols-2 gap-4 text-sm">
                    <div class="bg-white px-3 py-2 rounded border">
                      <span class="font-medium text-gray-700">Latitude:</span> 
                      <span class="text-blue-600 font-mono">{createForm.destination_location.latitude.toFixed(6)}</span>
                    </div>
                    <div class="bg-white px-3 py-2 rounded border">
                      <span class="font-medium text-gray-700">Longitude:</span> 
                      <span class="text-blue-600 font-mono">{createForm.destination_location.longitude.toFixed(6)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Journey Settings -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="text-lg font-medium text-gray-900 mb-4">🚚 Journey Settings</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label for="create-journey-status" class="block text-sm font-medium text-gray-700 mb-1">Journey Status</label>
                  <select id="create-journey-status" bind:value={createForm.journey_status} class="input-field">
                    <option value="pending">Pending</option>
                    <option value="pickup">Pickup</option>
                    <option value="in-transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
                <div>
                  <label for="create-security-level" class="block text-sm font-medium text-gray-700 mb-1">Security Level</label>
                  <select id="create-security-level" bind:value={createForm.security_level} class="input-field">
                    <option value="standard">Standard</option>
                    <option value="high">High</option>
                    <option value="maximum">Maximum</option>
                  </select>
                </div>
                <div>
                  <label for="create-verification-status" class="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
                  <select id="create-verification-status" bind:value={createForm.verification_status} class="input-field">
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button on:click={() => showCreateForm = false} class="btn-secondary">
              Cancel
            </button>
            <button on:click={createCompleteShipment} disabled={loading} class="btn-primary">
              {#if loading}
                <div class="loading-spinner mx-auto"></div>
              {:else}
                🚀 Create Shipment & Generate Code
              {/if}
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div> 