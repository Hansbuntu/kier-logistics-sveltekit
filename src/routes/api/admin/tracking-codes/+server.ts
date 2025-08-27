import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  try {
    // Mock data - replace with actual database query
    const mockTrackingCodes = [
      {
        code: 'AU7B2N9X4L',
        status: 'active',
        createdAt: '2024-01-15T10:00:00Z',
        lastAccessed: '2024-01-15T16:30:00Z',
        accessCount: 5
      },
      {
        code: 'BR9K2M5P8Q',
        status: 'active',
        createdAt: '2024-01-14T14:30:00Z',
        lastAccessed: '2024-01-15T12:15:00Z',
        accessCount: 3
      },
      {
        code: 'CD3N7R1T4W',
        status: 'inactive',
        createdAt: '2024-01-13T09:45:00Z',
        lastAccessed: '2024-01-14T18:20:00Z',
        accessCount: 12
      }
    ];

    // In a real implementation, you would query the database:
    // const { data, error } = await supabase
    //   .from('tracking_codes')
    //   .select('*')
    //   .order('created_at', { ascending: false });

    // if (error) {
    //   console.error('Failed to fetch tracking codes:', error);
    //   return json(
    //     { error: 'Failed to fetch tracking codes' },
    //     { status: 500 }
    //   );
    // }

    return json(mockTrackingCodes);

  } catch (error) {
    console.error('Fetch tracking codes error:', error);
    return json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}; 