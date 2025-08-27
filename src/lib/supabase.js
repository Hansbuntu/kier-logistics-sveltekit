import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔍 Environment Check:')
console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Loaded' : '❌ Missing')
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Loaded' : '❌ Missing')
console.log('NODE_ENV:', import.meta.env.NODE_ENV)
console.log('DEV:', import.meta.env.DEV)

// Create mock client for development when environment variables are missing
const createMockClient = () => ({
  from: () => ({
    select: () => ({ 
      order: () => ({ data: [], error: null }),
      eq: () => ({ single: () => ({ data: null, error: null }) }),
      limit: () => ({ data: [], error: null })
    }),
    insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
    update: () => ({ eq: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }) })
  })
})

const createMockHelpers = () => ({
  generateTrackingCode: async () => 'MOCK-CODE-1234',
  createTrackingCode: async () => ({ id: 'mock-id', code: 'MOCK-CODE-1234' }),
  getTrackingCode: async () => null,
  updateTrackingCodeStatus: async () => null,
  getAllTrackingCodes: async () => [],
  addCustodyChainEntry: async () => null
})

// Check if environment variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Please create a .env file with:')
  console.error('VITE_SUPABASE_URL=https://your-project-id.supabase.co')
  console.error('VITE_SUPABASE_ANON_KEY=your_anon_key_here')
  
  // Use mock client for development
  if (import.meta.env.DEV) {
    console.warn('⚠️ Using mock Supabase client for development')
  } else {
    throw new Error('Missing Supabase environment variables. Please check your .env file.')
  }
}

// Export the appropriate client based on environment
export const supabase = (!supabaseUrl || !supabaseAnonKey) && import.meta.env.DEV 
  ? createMockClient() 
  : createClient(supabaseUrl, supabaseAnonKey)

// Export the appropriate helpers based on environment
export const supabaseHelpers = (!supabaseUrl || !supabaseAnonKey) && import.meta.env.DEV
  ? createMockHelpers()
  : {
      // Generate a secure tracking code
      async generateTrackingCode() {
        const { data, error } = await supabase
          .from('tracking_codes')
          .select('code')
          .limit(1000)
        
        if (error) throw error
        
        const existingCodes = data.map(row => row.code)
        
        // Import the code generator
        const { generateUniqueCode } = await import('./utils/codeGenerator.js')
        return generateUniqueCode(existingCodes)
      },

      // Create a new tracking code
      async createTrackingCode(code, metadata = {}) {
        const { data, error } = await supabase
          .from('tracking_codes')
          .insert([{
            code,
            status: 'active',
            metadata,
            created_at: new Date().toISOString()
          }])
          .select()
          .single()
        
        if (error) throw error
        return data
      },

      // Get tracking code details
      async getTrackingCode(code) {
        const { data, error } = await supabase
          .from('tracking_codes')
          .select(`
            *,
            shipments (
              *,
              custody_chain (
                *
              )
            )
          `)
          .eq('code', code)
          .single()
        
        if (error) throw error
        return data
      },

      // Update tracking code status
      async updateTrackingCodeStatus(code, status, metadata = {}) {
        const { data, error } = await supabase
          .from('tracking_codes')
          .update({
            status,
            metadata,
            updated_at: new Date().toISOString()
          })
          .eq('code', code)
          .select()
          .single()
        
        if (error) throw error
        return data
      },

      // Get all tracking codes (admin)
      async getAllTrackingCodes() {
        const { data, error } = await supabase
          .from('tracking_codes')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        return data
      },

      // Add custody chain entry
      async addCustodyChainEntry(trackingCode, entry) {
        const { data, error } = await supabase
          .from('custody_chain')
          .insert([{
            tracking_code: trackingCode,
            guardian_id: entry.guardianId,
            guardian_name: entry.guardianName,
            location: entry.location,
            status: entry.status,
            notes: entry.notes,
            timestamp: new Date().toISOString(),
            verified: true
          }])
          .select()
          .single()
        
        if (error) throw error
        return data
      }
    }
