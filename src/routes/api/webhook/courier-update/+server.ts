import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';

// Webhook validation schema
const webhookSchema = z.object({
  tracking_code: z.string().regex(/^[A-Z0-9]{12}$/, 'Invalid tracking code format'),
  status: z.enum(['in-transit', 'customs', 'delayed', 'delivered', 'secured']),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    address: z.string(),
    city: z.string(),
    country: z.string(),
    facility: z.string().optional()
  }),
  timestamp: z.string().datetime(),
  courier: z.string(),
  estimated_delivery: z.string().datetime().optional(),
  guardian_id: z.string().optional(),
  guardian_name: z.string().optional(),
  notes: z.string().optional()
});

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    
    // Validate webhook payload
    const validation = webhookSchema.safeParse(body);
    if (!validation.success) {
      console.error('Webhook validation failed:', validation.error);
      return json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }

    const {
      tracking_code,
      status,
      location,
      timestamp,
      courier,
      estimated_delivery,
      guardian_id,
      guardian_name,
      notes
    } = validation.data;

    // In a real implementation, you would:
    // 1. Verify the webhook signature (if provided by courier)
    // 2. Update the shipment record in the database
    // 3. Add the new custody entry
    // 4. Send notifications if needed

    console.log('Webhook received:', {
      tracking_code,
      status,
      location,
      courier,
      timestamp
    });

    // Mock database update
    // const { error } = await supabase
    //   .from('shipments')
    //   .update({
    //     current_status: status,
    //     current_location: location,
    //     estimated_delivery: estimated_delivery,
    //     last_updated: timestamp,
    //     courier: courier
    //   })
    //   .eq('tracking_code', tracking_code);

    // if (error) {
    //   console.error('Database update failed:', error);
    //   return json(
    //     { error: 'Failed to update shipment' },
    //     { status: 500 }
    //   );
    // }

    // Add custody entry if guardian information is provided
    if (guardian_id && guardian_name) {
      // const { error: custodyError } = await supabase
      //   .from('custody_chain')
      //   .insert({
      //     tracking_code,
      //     guardian_id,
      //     guardian_name,
      //     location,
      //     status,
      //     timestamp,
      //     notes,
      //     verified: true
      //   });

      // if (custodyError) {
      //   console.error('Custody chain update failed:', custodyError);
      // }
    }

    // Return success response
    return json({
      success: true,
      message: 'Shipment updated successfully',
      tracking_code,
      updated_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}; 