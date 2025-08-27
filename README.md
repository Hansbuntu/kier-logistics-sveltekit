# Kier Logistics - Secure Shipment Tracker

A professional shipment tracking application built with SvelteKit, featuring real-time location updates, custody chain verification, and secure delivery management.

## Features

- **Secure Tracking Codes**: XXX-XXXX-XXXX format with enhanced security
- **Real-time Updates**: Live shipment status and location tracking
- **Custody Chain**: Complete audit trail of shipment guardians
- **Interactive Maps**: Leaflet-based location visualization
- **Admin Panel**: Secure code generation and management
- **Responsive Design**: Mobile-first Tailwind CSS styling

## Tech Stack

- **Frontend**: SvelteKit + Svelte
- **Styling**: Tailwind CSS
- **Maps**: Leaflet.js
- **Validation**: Zod
- **Language**: JavaScript/TypeScript

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Access the application**:
   - Main tracker: `http://localhost:5173/`
   - Admin panel: `http://localhost:5173/admin`
   - Tracking history: `http://localhost:5173/tracking-history`
   - Help & support: `http://localhost:5173/help`

## Admin Access

The admin panel is located at `/admin` and provides:
- Secure tracking code generation
- Batch code creation (up to 100 codes)
- Code management and monitoring
- System administration tools

## Security Features

- **Character Set**: [A-HJ-NP-Z0-9] (no ambiguous characters)
- **Format**: XXX-XXXX-XXXX with hyphen separation
- **Validation**: Regex-based format verification
- **Uniqueness**: Collision-resistant code generation

## Project Structure

```
src/
├── lib/
│   ├── components/          # Reusable UI components
│   ├── stores/             # Svelte stores for state
│   └── utils/              # Utility functions
├── routes/                 # SvelteKit routing
│   ├── admin/             # Admin panel
│   ├── api/               # Backend API endpoints
│   ├── tracking/          # Individual tracking pages
│   ├── tracking-history/  # Tracking history
│   └── help/              # Help & support
└── app.css                # Global styles
```

## Development

- **Build**: `npm run build`
- **Preview**: `npm run preview`
- **Type checking**: `npm run check`

## License

Private - All rights reserved by Kier Logistics 