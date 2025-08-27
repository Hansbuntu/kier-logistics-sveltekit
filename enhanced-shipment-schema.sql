-- Enhanced Gold Shipment Tracking Schema
-- This creates a comprehensive tracking system like DHL/FedEx for gold shipments

-- Enhanced shipments table with journey tracking
CREATE TABLE IF NOT EXISTS enhanced_shipments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tracking_code VARCHAR(14) REFERENCES tracking_codes(code) ON DELETE CASCADE,
  
  -- Origin Information
  origin_location JSONB NOT NULL DEFAULT '{}',
  origin_facility VARCHAR(100),
  origin_guardian VARCHAR(100),
  pickup_date TIMESTAMP WITH TIME ZONE,
  
  -- Current Location
  current_location JSONB NOT NULL DEFAULT '{}',
  current_facility VARCHAR(100),
  current_guardian VARCHAR(100),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Destination Information
  destination_location JSONB NOT NULL DEFAULT '{}',
  destination_facility VARCHAR(100),
  recipient_name VARCHAR(100),
  recipient_contact VARCHAR(100),
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  
  -- Product Details
  product_details JSONB NOT NULL DEFAULT '{}',
  
  -- Journey Status
  journey_status VARCHAR(50) DEFAULT 'pending' CHECK (
    journey_status IN (
      'pending', 'pickup', 'in-transit', 'customs', 'delayed', 'delivered', 'returned'
    )
  ),
  
  -- Security & Verification
  security_level VARCHAR(20) DEFAULT 'high' CHECK (
    security_level IN ('standard', 'high', 'maximum')
  ),
  requires_verification BOOLEAN DEFAULT true,
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (
    verification_status IN ('pending', 'verified', 'failed')
  ),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced custody chain for detailed journey tracking
CREATE TABLE IF NOT EXISTS enhanced_custody_chain (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tracking_code VARCHAR(14) REFERENCES tracking_codes(code) ON DELETE CASCADE,
  
  -- Location Details
  location JSONB NOT NULL DEFAULT '{}',
  facility_name VARCHAR(100),
  facility_type VARCHAR(50), -- 'vault', 'airport', 'customs', 'delivery_center'
  
  -- Guardian Information
  guardian_id VARCHAR(50) NOT NULL,
  guardian_name VARCHAR(100) NOT NULL,
  guardian_company VARCHAR(100),
  guardian_contact VARCHAR(100),
  guardian_verification_code VARCHAR(20),
  
  -- Status & Actions
  action_type VARCHAR(50) NOT NULL CHECK (
    action_type IN (
      'pickup', 'handover', 'in-transit', 'customs_clearance', 
      'security_check', 'delivery_attempt', 'delivered'
    )
  ),
  status VARCHAR(50) NOT NULL CHECK (
    status IN (
      'pending', 'in_progress', 'completed', 'failed', 'verified'
    )
  ),
  
  -- Security Details
  security_checks JSONB DEFAULT '{}',
  verification_method VARCHAR(50), -- 'biometric', 'code', 'document', 'face_recognition'
  verification_result BOOLEAN,
  
  -- Timestamps
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  estimated_duration_hours INTEGER,
  actual_duration_hours INTEGER,
  
  -- Notes & Documentation
  notes TEXT,
  documents JSONB DEFAULT '{}',
  photos JSONB DEFAULT '{}'
);

-- Journey checkpoints for route visualization
CREATE TABLE IF NOT EXISTS journey_checkpoints (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tracking_code VARCHAR(14) REFERENCES tracking_codes(code) ON DELETE CASCADE,
  
  -- Checkpoint Details
  checkpoint_name VARCHAR(100) NOT NULL,
  checkpoint_type VARCHAR(50) CHECK (
    checkpoint_type IN (
      'origin', 'transit', 'customs', 'security', 'destination'
    )
  ),
  
  -- Location
  location JSONB NOT NULL DEFAULT '{}',
  facility_name VARCHAR(100),
  
  -- Timing
  estimated_arrival TIMESTAMP WITH TIME ZONE,
  actual_arrival TIMESTAMP WITH TIME ZONE,
  estimated_departure TIMESTAMP WITH TIME ZONE,
  actual_departure TIMESTAMP WITH TIME ZONE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (
    status IN ('pending', 'in_progress', 'completed', 'delayed', 'skipped')
  ),
  
  -- Order in journey
  sequence_order INTEGER NOT NULL,
  
  -- Additional info
  notes TEXT,
  requirements JSONB DEFAULT '{}'
);

-- Security verification logs
CREATE TABLE IF NOT EXISTS security_verifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tracking_code VARCHAR(14) REFERENCES tracking_codes(code) ON DELETE CASCADE,
  
  -- Verification Details
  verification_type VARCHAR(50) NOT NULL CHECK (
    verification_type IN (
      'guardian_identity', 'facility_access', 'package_integrity', 
      'route_verification', 'delivery_confirmation'
    )
  ),
  
  -- Verification Method
  method VARCHAR(50),
  result BOOLEAN NOT NULL,
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  
  -- Performed By
  verified_by VARCHAR(100),
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Details
  details JSONB DEFAULT '{}',
  notes TEXT
);

-- Create indexes for performance
CREATE INDEX idx_enhanced_shipments_tracking_code ON enhanced_shipments(tracking_code);
CREATE INDEX idx_enhanced_shipments_journey_status ON enhanced_shipments(journey_status);
CREATE INDEX idx_enhanced_custody_chain_tracking_code ON enhanced_custody_chain(tracking_code);
CREATE INDEX idx_enhanced_custody_chain_timestamp ON enhanced_custody_chain(timestamp);
CREATE INDEX idx_journey_checkpoints_tracking_code ON journey_checkpoints(tracking_code);
CREATE INDEX idx_journey_checkpoints_sequence ON journey_checkpoints(sequence_order);
CREATE INDEX idx_security_verifications_tracking_code ON security_verifications(tracking_code);

-- Create triggers for updated_at
CREATE TRIGGER update_enhanced_shipments_updated_at 
  BEFORE UPDATE ON enhanced_shipments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample enhanced shipment data
INSERT INTO enhanced_shipments (
  tracking_code,
  origin_location,
  origin_facility,
  origin_guardian,
  pickup_date,
  current_location,
  current_facility,
  current_guardian,
  destination_location,
  destination_facility,
  recipient_name,
  estimated_delivery,
  product_details,
  journey_status,
  security_level
) VALUES (
  'ABC-1234-DEF5',
  '{"latitude": 51.5074, "longitude": -0.1278, "address": "London Vault", "city": "London", "country": "United Kingdom"}',
  'London Precious Metals Vault',
  'John Smith - Senior Vault Manager',
  NOW() - INTERVAL '2 days',
  '{"latitude": 50.1109, "longitude": 8.6821, "address": "Frankfurt Airport", "city": "Frankfurt", "country": "Germany"}',
  'Frankfurt International Airport',
  'Hans Mueller - Customs Officer',
  '{"latitude": 47.3769, "longitude": 8.5417, "address": "Zurich Private Vault", "city": "Zurich", "country": "Switzerland"}',
  'Zurich Private Vault Services',
  'Maria Rodriguez',
  NOW() + INTERVAL '1 day',
  '{"type": "Gold Bars", "weight": 1.5, "weightUnit": "kg", "purity": 999.5, "serialNumber": "GB-2024-001-9995", "description": "Investment grade gold bars"}',
  'in-transit',
  'maximum'
);

-- Insert sample journey checkpoints
INSERT INTO journey_checkpoints (
  tracking_code,
  checkpoint_name,
  checkpoint_type,
  location,
  facility_name,
  estimated_arrival,
  estimated_departure,
  sequence_order
) VALUES 
('ABC-1234-DEF5', 'London Vault', 'origin', 
 '{"latitude": 51.5074, "longitude": -0.1278, "address": "London Vault", "city": "London", "country": "United Kingdom"}',
 'London Precious Metals Vault', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '2 hours', 1),
 
('ABC-1234-DEF5', 'London Heathrow Airport', 'transit',
 '{"latitude": 51.4700, "longitude": -0.4543, "address": "London Heathrow Airport", "city": "London", "country": "United Kingdom"}',
 'Heathrow Airport Security', NOW() - INTERVAL '2 days' + INTERVAL '2 hours', NOW() - INTERVAL '2 days' + INTERVAL '4 hours', 2),
 
('ABC-1234-DEF5', 'Frankfurt Airport', 'customs',
 '{"latitude": 50.1109, "longitude": 8.6821, "address": "Frankfurt Airport", "city": "Frankfurt", "country": "Germany"}',
 'Frankfurt Customs Office', NOW() - INTERVAL '1 day', NOW() + INTERVAL '6 hours', 3),
 
('ABC-1234-DEF5', 'Zurich Vault', 'destination',
 '{"latitude": 47.3769, "longitude": 8.5417, "address": "Zurich Private Vault", "city": "Zurich", "country": "Switzerland"}',
 'Zurich Private Vault Services', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '2 hours', 4);
