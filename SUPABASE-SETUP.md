# 🚀 Supabase Setup Guide for Kier Logistics

## **📋 Prerequisites**
- ✅ Supabase account created
- ✅ Project created in Supabase dashboard
- ✅ Node.js and npm installed

## **🔑 Step 1: Get Your Supabase Credentials**

1. **Go to your Supabase project dashboard**
2. **Navigate to Settings → API**
3. **Copy these values:**
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   
   - **Anon/Public Key** (starts with `eyJ...`)
   

## **⚙️ Step 2: Configure Environment Variables**

Create a `.env` file in your project root with:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Application Configuration
NODE_ENV=development
```

**⚠️ Important:** Replace the placeholder values with your actual Supabase credentials!

## **🗄️ Step 3: Set Up Database Schema**

1. **Go to your Supabase dashboard**
2. **Navigate to SQL Editor**
3. **Copy and paste the entire content of `supabase-schema.sql`**
4. **Click "Run" to execute the schema**

This will create:
- ✅ `tracking_codes` table
- ✅ `shipments` table  
- ✅ `custody_chain` table
- ✅ `users` table
- ✅ `audit_log` table
- ✅ Sample data for testing

## **🔐 Step 4: Configure Authentication (Optional)**

1. **Go to Authentication → Settings**
2. **Enable Email auth if you want user login**
3. **Configure your domain in Site URL**

## **🧪 Step 5: Test the Integration**

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Test tracking codes:**
   - Go to `/admin` and generate new codes
   - Try tracking `ABC-1234-DEF5` or `XYZ-5678-9ABC`
   - Check if data loads from database

3. **Check browser console for any errors**

## **🔧 Step 6: Verify Database Connection**

1. **Go to Supabase → Table Editor**
2. **Check if tables were created:**
   - `tracking_codes`
   - `shipments`
   - `custody_chain`
   - `users`
   - `audit_log`

3. **Verify sample data exists**

## **🚨 Troubleshooting**

### **Error: "Missing Supabase environment variables"**
- ✅ Check your `.env` file exists
- ✅ Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- ✅ Restart your dev server after adding `.env`

### **Error: "Failed to fetch"**
- ✅ Check your Supabase URL is correct
- ✅ Verify your anon key is correct
- ✅ Check if your database schema was created

### **Error: "Table doesn't exist"**
- ✅ Run the `supabase-schema.sql` in SQL Editor
- ✅ Check if tables were created in Table Editor

### **Error: "Permission denied"**
- ✅ Check Row Level Security (RLS) policies
- ✅ Verify your user has correct permissions

## **📊 Database Schema Overview**

### **tracking_codes**
- `id`: Unique identifier
- `code`: XXX-XXXX-XXXX format tracking code
- `status`: active/inactive/suspended
- `metadata`: JSON data about the code
- `created_at`: Creation timestamp
- `last_accessed`: Last access timestamp
- `access_count`: Number of times accessed

### **shipments**
- `id`: Unique identifier
- `tracking_code`: References tracking_codes.code
- `product_details`: JSON product information
- `current_location`: JSON location data
- `delivery_info`: JSON delivery information
- `status`: shipment status
- `requires_verification`: Boolean flag

### **custody_chain**
- `id`: Unique identifier
- `tracking_code`: References tracking_codes.code
- `guardian_id`: Security guard identifier
- `guardian_name`: Security guard name
- `location`: JSON location data
- `status`: custody status
- `timestamp`: When this entry was created
- `notes`: Additional information

## **🔒 Security Features**

- ✅ **Row Level Security (RLS)** enabled on all tables
- ✅ **Public read access** to active tracking codes
- ✅ **Admin-only write access** to sensitive data
- ✅ **Input validation** with regex patterns
- ✅ **SQL injection protection** via Supabase client

## **📈 Next Steps After Setup**

1. **Test all functionality:**
   - Code generation
   - Tracking lookup
   - Admin panel operations

2. **Add real data:**
   - Create actual shipments
   - Add real custody chain entries

3. **Implement authentication:**
   - User login system
   - Role-based access control

4. **Add monitoring:**
   - Database performance metrics
   - Error logging and alerts

## **📞 Support**

If you encounter issues:
1. Check the browser console for errors
2. Verify your Supabase credentials
3. Check the database schema was created correctly
4. Ensure your `.env` file is properly configured

## **🎯 Success Indicators**

✅ **Environment variables configured**
✅ **Database schema created**
✅ **Sample data inserted**
✅ **Admin panel generates codes**
✅ **Tracking lookup works**
✅ **No console errors**

---

**🚀 Your Kier Logistics application is now connected to a real database!**
