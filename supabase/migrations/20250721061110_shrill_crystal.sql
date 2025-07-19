/*
  # Initial Schema Setup for HereForYou Platform

  1. New Tables
    - `profiles` - Extended user profiles with addresses and preferences
    - `professionals` - Service provider profiles and verification
    - `services` - Available service categories
    - `bookings` - Service bookings and appointments
    - `reviews` - Customer reviews and ratings
    - `support_tickets` - Customer support requests

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure data access based on user roles

  3. Features
    - User authentication (handled by Supabase Auth)
    - Professional verification system
    - Booking management
    - Review and rating system
    - Support ticket system
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('customer', 'professional', 'admin');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE payment_method AS ENUM ('cash', 'upi', 'card', 'wallet');
CREATE TYPE service_category AS ENUM ('plumbing', 'electrical', 'ac_repair', 'appliance_repair', 'house_cleaning', 'car_repair', 'gardening', 'pest_control', 'caretaker', 'cook', 'maid', 'laundry', 'healthcare', 'babysitting', 'tailoring', 'other');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text UNIQUE,
  role user_role DEFAULT 'customer',
  avatar_url text,
  date_of_birth date,
  gender text,
  bio text,
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User addresses
CREATE TABLE IF NOT EXISTS user_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text DEFAULT 'home',
  address text NOT NULL,
  city text NOT NULL,
  state text DEFAULT 'Kerala',
  pincode text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category service_category NOT NULL,
  description text,
  icon text,
  base_price_min integer DEFAULT 200,
  base_price_max integer DEFAULT 1000,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Professionals table
CREATE TABLE IF NOT EXISTS professionals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  services service_category[] NOT NULL,
  experience_years integer NOT NULL DEFAULT 0,
  hourly_rate integer NOT NULL,
  description text,
  skills text[],
  city text NOT NULL,
  areas_served text[],
  verification_status verification_status DEFAULT 'pending',
  is_available boolean DEFAULT true,
  rating_average decimal(3,2) DEFAULT 0,
  rating_count integer DEFAULT 0,
  total_bookings integer DEFAULT 0,
  completed_bookings integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Professional documents
CREATE TABLE IF NOT EXISTS professional_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid REFERENCES professionals(id) ON DELETE CASCADE,
  document_type text NOT NULL, -- 'aadhar', 'pan', 'certificate', etc.
  document_url text NOT NULL,
  is_verified boolean DEFAULT false,
  uploaded_at timestamptz DEFAULT now()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id text UNIQUE NOT NULL,
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  professional_id uuid REFERENCES professionals(id) ON DELETE CASCADE,
  service_category service_category NOT NULL,
  service_description text,
  scheduled_date date NOT NULL,
  scheduled_time time NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  pincode text NOT NULL,
  contact_name text NOT NULL,
  contact_phone text NOT NULL,
  estimated_cost_min integer,
  estimated_cost_max integer,
  actual_cost integer,
  payment_method payment_method NOT NULL,
  status booking_status DEFAULT 'pending',
  special_instructions text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Booking timeline/status updates
CREATE TABLE IF NOT EXISTS booking_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  status booking_status NOT NULL,
  note text,
  updated_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  professional_id uuid REFERENCES professionals(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Support tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id text UNIQUE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  category text NOT NULL,
  subject text NOT NULL,
  description text NOT NULL,
  priority text DEFAULT 'medium',
  status text DEFAULT 'open',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- User addresses policies
CREATE POLICY "Users can manage own addresses" ON user_addresses
  FOR ALL USING (auth.uid() = user_id);

-- Services policies (public read)
CREATE POLICY "Anyone can view services" ON services
  FOR SELECT USING (is_active = true);

-- Professionals policies
CREATE POLICY "Anyone can view verified professionals" ON professionals
  FOR SELECT USING (verification_status = 'verified' AND is_available = true);

CREATE POLICY "Professionals can update own profile" ON professionals
  FOR ALL USING (auth.uid() = user_id);

-- Professional documents policies
CREATE POLICY "Professionals can manage own documents" ON professional_documents
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM professionals WHERE id = professional_id
    )
  );

-- Bookings policies
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (
    auth.uid() = customer_id OR 
    auth.uid() IN (SELECT user_id FROM professionals WHERE id = professional_id)
  );

CREATE POLICY "Customers can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update own bookings" ON bookings
  FOR UPDATE USING (
    auth.uid() = customer_id OR 
    auth.uid() IN (SELECT user_id FROM professionals WHERE id = professional_id)
  );

-- Booking timeline policies
CREATE POLICY "Users can view booking timeline" ON booking_timeline
  FOR SELECT USING (
    booking_id IN (
      SELECT id FROM bookings WHERE 
      customer_id = auth.uid() OR 
      professional_id IN (SELECT id FROM professionals WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can add timeline entries" ON booking_timeline
  FOR INSERT WITH CHECK (
    booking_id IN (
      SELECT id FROM bookings WHERE 
      customer_id = auth.uid() OR 
      professional_id IN (SELECT id FROM professionals WHERE user_id = auth.uid())
    )
  );

-- Reviews policies
CREATE POLICY "Anyone can view public reviews" ON reviews
  FOR SELECT USING (is_public = true);

CREATE POLICY "Customers can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = customer_id);

-- Support tickets policies
CREATE POLICY "Users can view own tickets" ON support_tickets
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can create support tickets" ON support_tickets
  FOR INSERT WITH CHECK (true);

-- Functions to automatically update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professionals_updated_at BEFORE UPDATE ON professionals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate booking ID
CREATE OR REPLACE FUNCTION generate_booking_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.booking_id = 'BK' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(EXTRACT(EPOCH FROM NOW())::text, 10, '0');
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_booking_id_trigger BEFORE INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION generate_booking_id();

-- Function to generate support ticket ID
CREATE OR REPLACE FUNCTION generate_ticket_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ticket_id = 'TK' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(EXTRACT(EPOCH FROM NOW())::text, 10, '0');
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_ticket_id_trigger BEFORE INSERT ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION generate_ticket_id();

-- Insert default services
INSERT INTO services (name, category, description, icon, base_price_min, base_price_max) VALUES
('Plumbing', 'plumbing', 'Pipe repairs, leaks, installations', 'fas fa-wrench', 250, 800),
('AC Repair', 'ac_repair', 'AC service, installation, maintenance', 'fas fa-snowflake', 350, 1200),
('Car Repair', 'car_repair', 'Auto service, repairs, maintenance', 'fas fa-car', 400, 2000),
('Appliance Repair', 'appliance_repair', 'Home appliance repairs', 'fas fa-tools', 300, 1000),
('Electrical', 'electrical', 'Wiring, repairs, installations', 'fas fa-bolt', 300, 1000),
('Caretaker', 'caretaker', 'Elder care, patient care', 'fas fa-user-nurse', 150, 500),
('Maid Service', 'maid', 'House cleaning, maintenance', 'fas fa-broom', 150, 400),
('Cook', 'cook', 'Home cooking, meal preparation', 'fas fa-utensils', 200, 600),
('Gardening', 'gardening', 'Garden maintenance, landscaping', 'fas fa-seedling', 200, 800),
('Home Cleaning', 'house_cleaning', 'Deep cleaning, regular cleaning', 'fas fa-home', 300, 1500),
('Car Cleaning', 'car_repair', 'Car wash, detailing', 'fas fa-spray-can', 200, 800),
('Pest Control', 'pest_control', 'Termite, insects, rodents', 'fas fa-bug', 500, 2000),
('Laundry', 'laundry', 'Washing, ironing, dry cleaning', 'fas fa-tshirt', 100, 300),
('Healthcare', 'healthcare', 'Nurses, physiotherapy', 'fas fa-heartbeat', 300, 800),
('Babysitting', 'babysitting', 'Child care, nanny services', 'fas fa-baby', 150, 400),
('Tailoring', 'tailoring', 'Stitching, alterations, repairs', 'fas fa-cut', 100, 500);