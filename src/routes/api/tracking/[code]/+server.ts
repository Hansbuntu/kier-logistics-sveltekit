import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase.js';

export const GET = async ({ params }) => {
  try {
    console.log('🔍 Tracking request for code:', params.code);
    
    const { code } = params;

    // Fetch tracking data from Supabase
    console.log('📡 Fetching tracking code from database...');
    const { data: trackingCode, error: codeError } = await supabase
      .from('tracking_codes')
      .select('*')
      .eq('code', code)
      .eq('status', 'active')
      .single();

    if (codeError) {
      console.error('❌ Database error fetching tracking code:', codeError);
      return json(
        { error: 'Database connection error' },
        { status: 500 }
      );
    }

    if (!trackingCode) {
      console.log('❌ Tracking code not found or inactive:', code);
      
      // For testing purposes, allow a test code
      if (code === 'TEST-1234-5678') {
        console.log('🧪 Using test tracking code for demonstration');
        const testResponse = {
          trackingCode: code,
          product: {
            id: 'test-shipment',
            type: 'Gold Bars',
            weight: 1.5,
            weightUnit: 'kg',
            purity: 999.9,
            purityUnit: '999.9',
            serialNumber: 'GB-2024-001',
            photos: [],
            description: 'Test gold shipment for demonstration - High-value precious metals requiring special handling'
          },
          origin: {
            location: {
              latitude: 51.5074,
              longitude: -0.1278,
              address: '1 Threadneedle Street',
              city: 'London',
              country: 'United Kingdom',
              facility: 'London Bullion Market Association'
            },
            facility: 'LBMA Vault',
            guardian: 'Sarah Johnson',
            pickupDate: new Date(Date.now() - 259200000).toISOString() // 3 days ago
          },
          currentLocation: {
            latitude: 40.7128,
            longitude: -74.0060,
            address: '123 Wall Street',
            city: 'New York',
            country: 'USA',
            facility: 'Kier Logistics NYC Hub'
          },
          currentFacility: 'NYC Security Vault',
          currentGuardian: 'Michael Chen',
          destination: {
            location: {
              latitude: 34.0522,
              longitude: -118.2437,
              address: '456 Main Street',
              city: 'Los Angeles',
              country: 'USA',
              facility: 'LA Precious Metals Exchange'
            },
            facility: 'LA Exchange Vault',
            recipientName: 'Robert Williams',
            recipientContact: '+1 (555) 123-4567'
          },
          journeyStatus: 'in-transit',
          securityLevel: 'maximum',
          verificationStatus: 'verified',
          custodyChain: [
            {
              id: 'custody-1',
              guardianId: 'guardian-1',
              guardianName: 'Sarah Johnson',
              timestamp: new Date(Date.now() - 259200000).toISOString(),
              location: {
                latitude: 51.5074,
                longitude: -0.1278,
                address: '1 Threadneedle Street',
                city: 'London',
                country: 'United Kingdom',
                facility: 'LBMA Vault'
              },
              status: 'package-received',
              notes: 'Package received and initial security verification completed',
              verified: true
            },
            {
              id: 'custody-2',
              guardianId: 'guardian-2',
              guardianName: 'David Brown',
              timestamp: new Date(Date.now() - 172800000).toISOString(),
              location: {
                latitude: 40.7128,
                longitude: -74.0060,
                address: '123 Wall Street',
                city: 'New York',
                country: 'USA',
                facility: 'Kier Logistics NYC Hub'
              },
              status: 'security-verification',
              notes: 'Security verification completed, package cleared for transit',
              verified: true
            },
            {
              id: 'custody-3',
              guardianId: 'guardian-3',
              guardianName: 'Michael Chen',
              timestamp: new Date(Date.now() - 86400000).toISOString(),
              location: {
                latitude: 40.7128,
                longitude: -74.0060,
                address: '123 Wall Street',
                city: 'New York',
                country: 'USA',
                facility: 'NYC Security Vault'
              },
              status: 'in-transit',
              notes: 'Package in secure transit with armed escort',
              verified: true
            }
          ],
          delivery: {
            estimatedDelivery: new Date(Date.now() + 172800000).toISOString(),
            currentStatus: 'in-transit',
            delayReason: null,
            nextLocation: {
              latitude: 34.0522,
              longitude: -118.2437,
              address: '456 Main Street',
              city: 'Los Angeles',
              country: 'USA',
              facility: 'LA Precious Metals Exchange'
            },
            etaHours: 48
          },
          lastUpdated: new Date().toISOString()
        };
        return json(testResponse);
      }
      
      return json(
        { error: 'Tracking code not found or inactive' },
        { status: 404 }
      );
    }

    console.log('✅ Tracking code found:', trackingCode);

    // Fetch shipment details (optional - don't fail if missing)
    console.log('📦 Fetching shipment details...');
    
    // First try to get data from enhanced_shipments (newer table)
    let { data: enhancedShipment, error: enhancedError } = await supabase
      .from('enhanced_shipments')
      .select('*')
      .eq('tracking_code', code)
      .single();

    if (enhancedError) {
      console.log('⚠️ No enhanced shipment data found, trying regular shipments table...');
    } else {
      console.log('✅ Enhanced shipment data fetched:', enhancedShipment);
      console.log('📊 Product details:', enhancedShipment.product_details);
      console.log('📍 Current location:', enhancedShipment.current_location);
    }

    // If no enhanced shipment, try regular shipments table
    let shipment = null;
    
    if (!enhancedShipment) {
      const { data: regularShipment, error: regularError } = await supabase
        .from('shipments')
        .select('*')
        .eq('tracking_code', code)
        .single();

      if (regularError) {
        console.log('⚠️ No regular shipment data found either, using defaults');
      } else {
        console.log('✅ Regular shipment data fetched:', regularShipment);
        console.log('📊 Product details:', regularShipment.product_details);
        console.log('📍 Current location:', regularShipment.current_location);
        console.log('🚚 Delivery info:', regularShipment.delivery_info);
        shipment = regularShipment;
      }
    } else {
      // Convert enhanced shipment to regular format for compatibility
      shipment = {
        id: enhancedShipment.id,
        product_details: enhancedShipment.product_details,
        current_location: enhancedShipment.current_location,
        delivery_info: {
          destination: enhancedShipment.destination_location,
          recipient_name: enhancedShipment.recipient_name,
          recipient_contact: enhancedShipment.recipient_contact,
          estimatedDelivery: enhancedShipment.estimated_delivery,
          currentStatus: enhancedShipment.journey_status,
          security_level: enhancedShipment.security_level
        },
        status: enhancedShipment.journey_status,
        created_at: enhancedShipment.created_at,
        updated_at: enhancedShipment.updated_at
      };
    }

    // Fetch custody chain (optional - don't fail if missing)
    console.log('🔗 Fetching custody chain...');
    const { data: custodyChain, error: chainError } = await supabase
      .from('custody_chain')
      .select('*')
      .eq('tracking_code', code)
      .order('timestamp', { ascending: true });

    if (chainError) {
      console.log('⚠️ No custody chain data found, using defaults');
    }

    // Update access count and last accessed time
    console.log('📊 Updating access count...');
    await supabase
      .from('tracking_codes')
      .update({ 
        access_count: (trackingCode.access_count || 0) + 1,
        last_accessed: new Date().toISOString()
      })
      .eq('code', code);

    // Create default data if shipment doesn't exist
    const defaultShipment = {
      id: 'default-shipment',
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
      status: 'pending'
    };

    // Use actual shipment data or defaults
    const finalShipment = shipment || defaultShipment;
    const finalCustodyChain = custodyChain || [];

    // Debug logging for photos
    console.log('📸 PHOTO DEBUG INFO:');
    console.log('📸 Data source:', enhancedShipment ? 'enhanced_shipments' : shipment ? 'shipments' : 'defaults');
    console.log('📸 Shipment product_details:', finalShipment.product_details);
    console.log('📸 Photos array:', finalShipment.product_details?.photos);
    console.log('📸 Photos length:', finalShipment.product_details?.photos?.length);
    console.log('📸 Photos type:', typeof finalShipment.product_details?.photos);

    // Format the response to match the expected structure with all admin fields
    const response = {
      trackingCode: code,
      product: {
        id: finalShipment.id,
        type: finalShipment.product_details?.type || 'Gold Shipment',
        weight: finalShipment.product_details?.weight || 0,
        weightUnit: finalShipment.product_details?.weightUnit || 'kg',
        purity: finalShipment.product_details?.purity || 999.5,
        purityUnit: finalShipment.product_details?.purityUnit || '999.5',
        serialNumber: finalShipment.product_details?.serialNumber || 'Pending',
        photos: finalShipment.product_details?.photos || [],
        description: finalShipment.product_details?.description || 'Shipment details pending'
      },
      // Origin Information (from admin)
      origin: {
        location: {
          latitude: finalShipment.origin_location?.latitude || 0,
          longitude: finalShipment.origin_location?.longitude || 0,
          address: finalShipment.origin_location?.address || 'Origin Location',
          city: finalShipment.origin_location?.city || 'Origin City',
          country: finalShipment.origin_location?.country || 'Origin Country',
          facility: finalShipment.origin_location?.facility || 'Origin Facility'
        },
        facility: finalShipment.origin_facility || 'Origin Facility',
        guardian: finalShipment.origin_guardian || 'Origin Guardian',
        pickupDate: finalShipment.pickup_date || null
      },
      // Current Location
      currentLocation: {
        latitude: finalShipment.current_location?.latitude || 0,
        longitude: finalShipment.current_location?.longitude || 0,
        address: finalShipment.current_location?.address || 'Processing Center',
        city: finalShipment.current_location?.city || 'Processing',
        country: finalShipment.current_location?.country || 'Processing',
        facility: finalShipment.current_location?.facility || 'Kier Logistics Hub'
      },
      currentFacility: finalShipment.current_facility || 'Current Facility',
      currentGuardian: finalShipment.current_guardian || 'Current Guardian',
      // Destination Information (from admin)
      destination: {
        location: {
          latitude: finalShipment.destination_location?.latitude || 0,
          longitude: finalShipment.destination_location?.longitude || 0,
          address: finalShipment.destination_location?.address || 'Destination Address',
          city: finalShipment.destination_location?.city || 'Destination City',
          country: finalShipment.destination_location?.country || 'Destination Country',
          facility: finalShipment.destination_location?.facility || 'Destination Facility'
        },
        facility: finalShipment.destination_facility || 'Destination Facility',
        recipientName: finalShipment.recipient_name || 'Recipient Name',
        recipientContact: finalShipment.recipient_contact || 'Recipient Contact'
      },
      // Journey Status (from admin)
      journeyStatus: finalShipment.journey_status || 'pending',
      securityLevel: finalShipment.security_level || 'high',
      verificationStatus: finalShipment.verification_status || 'pending',
      custodyChain: finalCustodyChain.map(entry => ({
        id: entry.id,
        guardianId: entry.guardian_id,
        guardianName: entry.guardian_name,
        timestamp: entry.timestamp,
        location: {
          latitude: entry.location?.latitude || 0,
          longitude: entry.location?.longitude || 0,
          address: entry.location?.address || 'Unknown',
          city: entry.location?.city || 'Unknown',
          country: entry.location?.country || 'Unknown',
          facility: entry.location?.facility || 'Unknown'
        },
        status: entry.status,
        notes: entry.notes || '',
        verified: entry.verified || false
      })),
      delivery: {
        estimatedDelivery: finalShipment.delivery_info?.estimatedDelivery || finalShipment.estimated_delivery || null,
        currentStatus: finalShipment.delivery_info?.currentStatus || finalShipment.journey_status || 'pending',
        delayReason: finalShipment.delivery_info?.delayReason || null,
        nextLocation: finalShipment.delivery_info?.nextLocation || null,
        etaHours: finalShipment.delivery_info?.etaHours || 0
      },
      lastUpdated: finalShipment.updated_at || finalShipment.created_at || new Date().toISOString()
    };

    console.log('✅ Successfully formatted response');
    console.log('📤 Final response data:', response);
    return json(response);

  } catch (error) {
    console.error('❌ Tracking API error:', error);
    return json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}; 