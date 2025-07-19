/*
  # Add Professional Data for All Services

  1. New Data
    - Add 4-5 professionals for each service category
    - Include Kerala-based names and TVM locations
    - Set realistic rates and availability
    - Add contact information

  2. Professional Details
    - Full names with Kerala naming conventions
    - Service categories matching frontend
    - TVM-based locations (Pattom, Kazhakkoottam, etc.)
    - Hourly rates and availability schedules
    - Contact information and estimated response times
*/

-- Insert professional users first
INSERT INTO profiles (id, email, full_name, phone, role, is_verified, created_at) VALUES
-- Plumbing professionals
('prof-plumb-1', 'anju.r.plumber@example.com', 'Anju R.', '9876543201', 'professional', true, now()),
('prof-plumb-2', 'arun.m.plumber@example.com', 'Arun M.', '9876543202', 'professional', true, now()),
('prof-plumb-3', 'deepa.s.plumber@example.com', 'Deepa S.', '9876543203', 'professional', true, now()),
('prof-plumb-4', 'ravi.k.plumber@example.com', 'Ravi K.', '9876543204', 'professional', true, now()),
('prof-plumb-5', 'maya.p.plumber@example.com', 'Maya P.', '9876543205', 'professional', true, now()),

-- Electrical professionals
('prof-elec-1', 'sunil.t.electrician@example.com', 'Sunil T.', '9876543211', 'professional', true, now()),
('prof-elec-2', 'priya.n.electrician@example.com', 'Priya N.', '9876543212', 'professional', true, now()),
('prof-elec-3', 'jose.m.electrician@example.com', 'Jose M.', '9876543213', 'professional', true, now()),
('prof-elec-4', 'latha.v.electrician@example.com', 'Latha V.', '9876543214', 'professional', true, now()),
('prof-elec-5', 'biju.r.electrician@example.com', 'Biju R.', '9876543215', 'professional', true, now()),

-- AC Repair professionals
('prof-ac-1', 'vinod.k.ac@example.com', 'Vinod K.', '9876543221', 'professional', true, now()),
('prof-ac-2', 'reshma.s.ac@example.com', 'Reshma S.', '9876543222', 'professional', true, now()),
('prof-ac-3', 'thomas.j.ac@example.com', 'Thomas J.', '9876543223', 'professional', true, now()),
('prof-ac-4', 'kavitha.m.ac@example.com', 'Kavitha M.', '9876543224', 'professional', true, now()),
('prof-ac-5', 'rajesh.p.ac@example.com', 'Rajesh P.', '9876543225', 'professional', true, now()),

-- House Cleaning professionals
('prof-clean-1', 'mini.r.cleaner@example.com', 'Mini R.', '9876543231', 'professional', true, now()),
('prof-clean-2', 'suja.k.cleaner@example.com', 'Suja K.', '9876543232', 'professional', true, now()),
('prof-clean-3', 'geetha.m.cleaner@example.com', 'Geetha M.', '9876543233', 'professional', true, now()),
('prof-clean-4', 'radha.s.cleaner@example.com', 'Radha S.', '9876543234', 'professional', true, now()),
('prof-clean-5', 'usha.p.cleaner@example.com', 'Usha P.', '9876543235', 'professional', true, now()),

-- Appliance Repair professionals
('prof-app-1', 'kumar.s.repair@example.com', 'Kumar S.', '9876543241', 'professional', true, now()),
('prof-app-2', 'shanti.r.repair@example.com', 'Shanti R.', '9876543242', 'professional', true, now()),
('prof-app-3', 'mohan.k.repair@example.com', 'Mohan K.', '9876543243', 'professional', true, now()),
('prof-app-4', 'leela.m.repair@example.com', 'Leela M.', '9876543244', 'professional', true, now()),
('prof-app-5', 'babu.t.repair@example.com', 'Babu T.', '9876543245', 'professional', true, now()),

-- Car Repair professionals
('prof-car-1', 'raman.v.car@example.com', 'Raman V.', '9876543251', 'professional', true, now()),
('prof-car-2', 'sree.k.car@example.com', 'Sree K.', '9876543252', 'professional', true, now()),
('prof-car-3', 'hari.s.car@example.com', 'Hari S.', '9876543253', 'professional', true, now()),
('prof-car-4', 'devi.r.car@example.com', 'Devi R.', '9876543254', 'professional', true, now()),
('prof-car-5', 'nair.m.car@example.com', 'Nair M.', '9876543255', 'professional', true, now()),

-- Gardening professionals
('prof-garden-1', 'krishnan.p.garden@example.com', 'Krishnan P.', '9876543261', 'professional', true, now()),
('prof-garden-2', 'suma.r.garden@example.com', 'Suma R.', '9876543262', 'professional', true, now()),
('prof-garden-3', 'raju.k.garden@example.com', 'Raju K.', '9876543263', 'professional', true, now()),
('prof-garden-4', 'mala.s.garden@example.com', 'Mala S.', '9876543264', 'professional', true, now()),
('prof-garden-5', 'venu.m.garden@example.com', 'Venu M.', '9876543265', 'professional', true, now()),

-- Pest Control professionals
('prof-pest-1', 'anand.r.pest@example.com', 'Anand R.', '9876543271', 'professional', true, now()),
('prof-pest-2', 'bindu.k.pest@example.com', 'Bindu K.', '9876543272', 'professional', true, now()),
('prof-pest-3', 'soman.s.pest@example.com', 'Soman S.', '9876543273', 'professional', true, now()),
('prof-pest-4', 'lekha.m.pest@example.com', 'Lekha M.', '9876543274', 'professional', true, now()),
('prof-pest-5', 'ravi.p.pest@example.com', 'Ravi P.', '9876543275', 'professional', true, now()),

-- Caretaker professionals
('prof-care-1', 'mercy.r.care@example.com', 'Mercy R.', '9876543281', 'professional', true, now()),
('prof-care-2', 'james.k.care@example.com', 'James K.', '9876543282', 'professional', true, now()),
('prof-care-3', 'mary.s.care@example.com', 'Mary S.', '9876543283', 'professional', true, now()),
('prof-care-4', 'paul.m.care@example.com', 'Paul M.', '9876543284', 'professional', true, now()),
('prof-care-5', 'anna.p.care@example.com', 'Anna P.', '9876543285', 'professional', true, now()),

-- Cook professionals
('prof-cook-1', 'kamala.r.cook@example.com', 'Kamala R.', '9876543291', 'professional', true, now()),
('prof-cook-2', 'ravi.k.cook@example.com', 'Ravi K.', '9876543292', 'professional', true, now()),
('prof-cook-3', 'sita.s.cook@example.com', 'Sita S.', '9876543293', 'professional', true, now()),
('prof-cook-4', 'kumar.m.cook@example.com', 'Kumar M.', '9876543294', 'professional', true, now()),
('prof-cook-5', 'devi.p.cook@example.com', 'Devi P.', '9876543295', 'professional', true, now()),

-- Maid professionals
('prof-maid-1', 'shoba.r.maid@example.com', 'Shoba R.', '9876543301', 'professional', true, now()),
('prof-maid-2', 'renu.k.maid@example.com', 'Renu K.', '9876543302', 'professional', true, now()),
('prof-maid-3', 'vani.s.maid@example.com', 'Vani S.', '9876543303', 'professional', true, now()),
('prof-maid-4', 'lakshmi.m.maid@example.com', 'Lakshmi M.', '9876543304', 'professional', true, now()),
('prof-maid-5', 'parvathi.p.maid@example.com', 'Parvathi P.', '9876543305', 'professional', true, now()),

-- Laundry professionals
('prof-laundry-1', 'raghu.r.laundry@example.com', 'Raghu R.', '9876543311', 'professional', true, now()),
('prof-laundry-2', 'sunitha.k.laundry@example.com', 'Sunitha K.', '9876543312', 'professional', true, now()),
('prof-laundry-3', 'babu.s.laundry@example.com', 'Babu S.', '9876543313', 'professional', true, now()),
('prof-laundry-4', 'maya.m.laundry@example.com', 'Maya M.', '9876543314', 'professional', true, now()),
('prof-laundry-5', 'rajan.p.laundry@example.com', 'Rajan P.', '9876543315', 'professional', true, now()),

-- Healthcare professionals
('prof-health-1', 'nurse.rita.health@example.com', 'Rita Nurse', '9876543321', 'professional', true, now()),
('prof-health-2', 'dr.suresh.health@example.com', 'Dr. Suresh', '9876543322', 'professional', true, now()),
('prof-health-3', 'physio.maya.health@example.com', 'Maya Physio', '9876543323', 'professional', true, now()),
('prof-health-4', 'nurse.latha.health@example.com', 'Latha Nurse', '9876543324', 'professional', true, now()),
('prof-health-5', 'therapist.ravi.health@example.com', 'Ravi Therapist', '9876543325', 'professional', true, now()),

-- Babysitting professionals
('prof-baby-1', 'asha.r.baby@example.com', 'Asha R.', '9876543331', 'professional', true, now()),
('prof-baby-2', 'meera.k.baby@example.com', 'Meera K.', '9876543332', 'professional', true, now()),
('prof-baby-3', 'suja.s.baby@example.com', 'Suja S.', '9876543333', 'professional', true, now()),
('prof-baby-4', 'rema.m.baby@example.com', 'Rema M.', '9876543334', 'professional', true, now()),
('prof-baby-5', 'nisha.p.baby@example.com', 'Nisha P.', '9876543335', 'professional', true, now()),

-- Tailoring professionals
('prof-tailor-1', 'master.raman.tailor@example.com', 'Master Raman', '9876543341', 'professional', true, now()),
('prof-tailor-2', 'sushila.k.tailor@example.com', 'Sushila K.', '9876543342', 'professional', true, now()),
('prof-tailor-3', 'balan.s.tailor@example.com', 'Balan S.', '9876543343', 'professional', true, now()),
('prof-tailor-4', 'geetha.m.tailor@example.com', 'Geetha M.', '9876543344', 'professional', true, now()),
('prof-tailor-5', 'ravi.p.tailor@example.com', 'Ravi P.', '9876543345', 'professional', true, now())

ON CONFLICT (id) DO NOTHING;

-- Insert professional profiles
INSERT INTO professionals (user_id, services, experience_years, hourly_rate, description, skills, city, areas_served, verification_status, is_available, rating_average, rating_count, total_bookings, completed_bookings) VALUES

-- Plumbing professionals
('prof-plumb-1', ARRAY['plumbing'], 8, 350, 'Expert plumber with 8 years experience in residential and commercial plumbing', ARRAY['Pipe repair', 'Bathroom fitting', 'Water heater service'], 'Trivandrum', ARRAY['Pattom', 'Kowdiar', 'Vazhuthacaud'], 'verified', true, 4.8, 156, 180, 156),
('prof-plumb-2', ARRAY['plumbing'], 5, 300, 'Skilled plumber specializing in modern plumbing solutions', ARRAY['Drainage cleaning', 'Tap repairs', 'Pipeline installation'], 'Trivandrum', ARRAY['Kazhakkoottam', 'Technopark', 'Pallippuram'], 'verified', true, 4.6, 89, 105, 89),
('prof-plumb-3', ARRAY['plumbing'], 12, 400, 'Senior plumber with extensive experience in all types of plumbing work', ARRAY['Complex repairs', 'New installations', 'Emergency services'], 'Trivandrum', ARRAY['Sasthamangalam', 'Ulloor', 'Medical College'], 'verified', true, 4.9, 203, 230, 203),
('prof-plumb-4', ARRAY['plumbing'], 6, 320, 'Reliable plumber known for quality work and punctuality', ARRAY['Bathroom renovation', 'Kitchen plumbing', 'Leak detection'], 'Trivandrum', ARRAY['Nemom', 'Balaramapuram', 'Neyyattinkara'], 'verified', true, 4.7, 134, 150, 134),
('prof-plumb-5', ARRAY['plumbing'], 10, 380, 'Professional plumber with expertise in modern fixtures and fittings', ARRAY['Smart home plumbing', 'Water purifier installation', 'Pressure pumps'], 'Trivandrum', ARRAY['Vattiyoorkavu', 'Kudappanakunnu', 'Peroorkada'], 'verified', true, 4.8, 178, 195, 178),

-- Electrical professionals
('prof-elec-1', ARRAY['electrical'], 7, 320, 'Certified electrician with expertise in residential and commercial wiring', ARRAY['House wiring', 'Switch installation', 'Fan fitting'], 'Trivandrum', ARRAY['Pattom', 'Kowdiar', 'Vazhuthacaud'], 'verified', true, 4.7, 145, 165, 145),
('prof-elec-2', ARRAY['electrical'], 9, 380, 'Expert electrician specializing in modern electrical solutions', ARRAY['Smart switches', 'LED installation', 'Electrical troubleshooting'], 'Trivandrum', ARRAY['Kazhakkoottam', 'Technopark', 'Pallippuram'], 'verified', true, 4.8, 167, 185, 167),
('prof-elec-3', ARRAY['electrical'], 4, 280, 'Young and energetic electrician with modern training', ARRAY['Basic wiring', 'Appliance installation', 'Safety checks'], 'Trivandrum', ARRAY['Sasthamangalam', 'Ulloor', 'Medical College'], 'verified', true, 4.5, 78, 90, 78),
('prof-elec-4', ARRAY['electrical'], 11, 420, 'Senior electrician with industrial and residential experience', ARRAY['Complex wiring', 'Panel installation', 'Motor repairs'], 'Trivandrum', ARRAY['Nemom', 'Balaramapuram', 'Neyyattinkara'], 'verified', true, 4.9, 234, 260, 234),
('prof-elec-5', ARRAY['electrical'], 6, 340, 'Reliable electrician known for safety and quality work', ARRAY['Home automation', 'Security systems', 'Emergency repairs'], 'Trivandrum', ARRAY['Vattiyoorkavu', 'Kudappanakunnu', 'Peroorkada'], 'verified', true, 4.6, 123, 140, 123),

-- AC Repair professionals
('prof-ac-1', ARRAY['ac_repair'], 10, 450, 'AC technician with expertise in all major brands', ARRAY['Split AC service', 'Window AC repair', 'AC installation'], 'Trivandrum', ARRAY['Pattom', 'Kowdiar', 'Vazhuthacaud'], 'verified', true, 4.9, 203, 220, 203),
('prof-ac-2', ARRAY['ac_repair'], 6, 380, 'Skilled AC technician specializing in modern AC systems', ARRAY['Inverter AC service', 'Gas refilling', 'Compressor repair'], 'Trivandrum', ARRAY['Kazhakkoottam', 'Technopark', 'Pallippuram'], 'verified', true, 4.7, 156, 175, 156),
('prof-ac-3', ARRAY['ac_repair'], 8, 420, 'Experienced AC repair specialist with quick service', ARRAY['Emergency repairs', 'Maintenance contracts', 'Energy efficiency'], 'Trivandrum', ARRAY['Sasthamangalam', 'Ulloor', 'Medical College'], 'verified', true, 4.8, 189, 210, 189),
('prof-ac-4', ARRAY['ac_repair'], 5, 350, 'Professional AC technician with modern equipment', ARRAY['Duct cleaning', 'Filter replacement', 'Thermostat repair'], 'Trivandrum', ARRAY['Nemom', 'Balaramapuram', 'Neyyattinkara'], 'verified', true, 4.6, 134, 150, 134),
('prof-ac-5', ARRAY['ac_repair'], 12, 500, 'Senior AC expert with commercial and residential experience', ARRAY['Central AC systems', 'VRF systems', 'Chiller maintenance'], 'Trivandrum', ARRAY['Vattiyoorkavu', 'Kudappanakunnu', 'Peroorkada'], 'verified', true, 4.9, 267, 290, 267),

-- House Cleaning professionals
('prof-clean-1', ARRAY['house_cleaning'], 4, 200, 'Professional house cleaner with attention to detail', ARRAY['Deep cleaning', 'Regular cleaning', 'Organization'], 'Trivandrum', ARRAY['Pattom', 'Kowdiar', 'Vazhuthacaud'], 'verified', true, 4.7, 134, 150, 134),
('prof-clean-2', ARRAY['house_cleaning'], 6, 250, 'Experienced cleaner specializing in eco-friendly cleaning', ARRAY['Green cleaning', 'Carpet cleaning', 'Window cleaning'], 'Trivandrum', ARRAY['Kazhakkoottam', 'Technopark', 'Pallippuram'], 'verified', true, 4.8, 178, 195, 178),
('prof-clean-3', ARRAY['house_cleaning'], 3, 180, 'Reliable cleaner with flexible scheduling', ARRAY['Daily cleaning', 'Kitchen deep clean', 'Bathroom sanitization'], 'Trivandrum', ARRAY['Sasthamangalam', 'Ulloor', 'Medical College'], 'verified', true, 4.5, 89, 105, 89),
('prof-clean-4', ARRAY['house_cleaning'], 8, 280, 'Expert cleaner with commercial and residential experience', ARRAY['Post-construction cleanup', 'Move-in cleaning', 'Disinfection'], 'Trivandrum', ARRAY['Nemom', 'Balaramapuram', 'Neyyattinkara'], 'verified', true, 4.9, 223, 245, 223),
('prof-clean-5', ARRAY['house_cleaning'], 5, 220, 'Professional cleaner with modern equipment and techniques', ARRAY['Steam cleaning', 'Upholstery cleaning', 'Floor polishing'], 'Trivandrum', ARRAY['Vattiyoorkavu', 'Kudappanakunnu', 'Peroorkada'], 'verified', true, 4.6, 145, 165, 145),

-- Appliance Repair professionals
('prof-app-1', ARRAY['appliance_repair'], 9, 350, 'Appliance repair expert with multi-brand experience', ARRAY['Washing machine repair', 'Refrigerator service', 'Microwave repair'], 'Trivandrum', ARRAY['Pattom', 'Kowdiar', 'Vazhuthacaud'], 'verified', true, 4.8, 167, 185, 167),
('prof-app-2', ARRAY['appliance_repair'], 6, 300, 'Skilled technician specializing in kitchen appliances', ARRAY['Mixer grinder repair', 'Induction cooktop', 'Dishwasher service'], 'Trivandrum', ARRAY['Kazhakkoottam', 'Technopark', 'Pallippuram'], 'verified', true, 4.6, 123, 140, 123),
('prof-app-3', ARRAY['appliance_repair'], 11, 400, 'Senior appliance technician with extensive experience', ARRAY['TV repair', 'Home theater setup', 'Smart appliances'], 'Trivandrum', ARRAY['Sasthamangalam', 'Ulloor', 'Medical College'], 'verified', true, 4.9, 234, 260, 234),
('prof-app-4', ARRAY['appliance_repair'], 4, 280, 'Young technician with modern appliance expertise', ARRAY['Water purifier service', 'Air purifier repair', 'Smart home devices'], 'Trivandrum', ARRAY['Nemom', 'Balaramapuram', 'Neyyattinkara'], 'verified', true, 4.5, 78, 90, 78),
('prof-app-5', ARRAY['appliance_repair'], 7, 330, 'Reliable technician with quick turnaround time', ARRAY['Vacuum cleaner repair', 'Iron box service', 'Small appliances'], 'Trivandrum', ARRAY['Vattiyoorkavu', 'Kudappanakunnu', 'Peroorkada'], 'verified', true, 4.7, 156, 175, 156),

-- Car Repair professionals
('prof-car-1', ARRAY['car_repair'], 12, 500, 'Master mechanic with expertise in all car brands', ARRAY['Engine repair', 'Brake service', 'AC repair'], 'Trivandrum', ARRAY['Pattom', 'Kowdiar', 'Vazhuthacaud'], 'verified', true, 4.9, 267, 290, 267),
('prof-car-2', ARRAY['car_repair'], 8, 420, 'Experienced mechanic specializing in modern cars', ARRAY['Electronic diagnostics', 'Hybrid vehicles', 'Transmission repair'], 'Trivandrum', ARRAY['Kazhakkoottam', 'Technopark', 'Pallippuram'], 'verified', true, 4.7, 189, 210, 189),
('prof-car-3', ARRAY['car_repair'], 6, 380, 'Skilled mechanic with quick service guarantee', ARRAY['Oil change', 'Tire service', 'Battery replacement'], 'Trivandrum', ARRAY['Sasthamangalam', 'Ulloor', 'Medical College'], 'verified', true, 4.6, 134, 150, 134),
('prof-car-4', ARRAY['car_repair'], 10, 450, 'Auto expert with commercial vehicle experience', ARRAY['Heavy vehicle repair', 'Fleet maintenance', 'Emergency roadside'], 'Trivandrum', ARRAY['Nemom', 'Balaramapuram', 'Neyyattinkara'], 'verified', true, 4.8, 223, 245, 223),
('prof-car-5', ARRAY['car_repair'], 5, 350, 'Young mechanic with latest technology training', ARRAY['EV maintenance', 'Smart car systems', 'Performance tuning'], 'Trivandrum', ARRAY['Vattiyoorkavu', 'Kudappanakunnu', 'Peroorkada'], 'verified', true, 4.5, 89, 105, 89),

-- Gardening professionals
('prof-garden-1', ARRAY['gardening'], 7, 250, 'Professional gardener with landscape design experience', ARRAY['Garden design', 'Plant care', 'Lawn maintenance'], 'Trivandrum', ARRAY['Pattom', 'Kowdiar', 'Vazhuthacaud'], 'verified', true, 4.8, 178, 195, 178),
('prof-garden-2', ARRAY['gardening'], 5, 220, 'Organic gardening specialist with eco-friendly approach', ARRAY['Organic farming', 'Composting', 'Pest control'], 'Trivandrum', ARRAY['Kazhakkoottam', 'Technopark', 'Pallippuram'], 'verified', true, 4.6, 123, 140, 123),
('prof-garden-3', ARRAY['gardening'], 10, 300, 'Expert gardener with commercial landscaping experience', ARRAY['Tree pruning', 'Irrigation systems', 'Garden renovation'], 'Trivandrum', ARRAY['Sasthamangalam', 'Ulloor', 'Medical College'], 'verified', true, 4.9, 234, 260, 234),
('prof-garden-4', ARRAY['gardening'], 4, 200, 'Young gardener with modern techniques', ARRAY['Indoor plants', 'Terrace gardening', 'Hydroponics'], 'Trivandrum', ARRAY['Nemom', 'Balaramapuram', 'Neyyattinkara'], 'verified', true, 4.5, 78, 90, 78),
('prof-garden-5', ARRAY['gardening'], 8, 280, 'Experienced gardener with maintenance contracts', ARRAY['Regular maintenance', 'Seasonal care', 'Plant diseases'], 'Trivandrum', ARRAY['Vattiyoorkavu', 'Kudappanakunnu', 'Peroorkada'], 'verified', true, 4.7, 156, 175, 156),

-- Pest Control professionals
('prof-pest-1', ARRAY['pest_control'], 6, 300, 'Licensed pest control expert with safe methods', ARRAY['Termite treatment', 'Cockroach control', 'Rodent control'], 'Trivandrum', ARRAY['Pattom', 'Kowdiar', 'Vazhuthacaud'], 'verified', true, 4.7, 145, 165, 145),
('prof-pest-2', ARRAY['pest_control'], 8, 350, 'Professional pest controller with eco-friendly solutions', ARRAY['Organic pest control', 'Preventive treatments', 'Commercial services'], 'Trivandrum', ARRAY['Kazhakkoottam', 'Technopark', 'Pallippuram'], 'verified', true, 4.8, 189, 210, 189),
('prof-pest-3', ARRAY['pest_control'], 4, 280, 'Certified pest control technician with modern equipment', ARRAY['Fumigation', 'Spray treatments', 'Monitoring systems'], 'Trivandrum', ARRAY['Sasthamangalam', 'Ulloor', 'Medical College'], 'verified', true, 4.6, 89, 105, 89),
('prof-pest-4', ARRAY['pest_control'], 10, 380, 'Senior pest control expert with industrial experience', ARRAY['Industrial pest control', 'Food safety compliance', 'Integrated pest management'], 'Trivandrum', ARRAY['Nemom', 'Balaramapuram', 'Neyyattinkara'], 'verified', true, 4.9, 223, 245, 223),
('prof-pest-5', ARRAY['pest_control'], 5, 320, 'Reliable pest controller with guarantee services', ARRAY['Bed bug treatment', 'Ant control', 'Mosquito control'], 'Trivandrum', ARRAY['Vattiyoorkavu', 'Kudappanakunnu', 'Peroorkada'], 'verified', true, 4.5, 112, 125, 112),

-- Caretaker professionals
('prof-care-1', ARRAY['caretaker'], 8, 200, 'Experienced caretaker with medical background', ARRAY['Elder care', 'Patient care', 'Medication management'], 'Trivandrum', ARRAY['Pattom', 'Kowdiar', 'Vazhuthacaud'], 'verified', true, 4.8, 167, 185, 167),
('prof-care-2', ARRAY['caretaker'], 6, 180, 'Compassionate caretaker with nursing experience', ARRAY['Post-surgery care', 'Physiotherapy assistance', 'Daily living support'], 'Trivandrum', ARRAY['Kazhakkoottam', 'Technopark', 'Pallippuram'], 'verified', true, 4.7, 134, 150, 134),
('prof-care-3', ARRAY['caretaker'], 10, 250, 'Senior caretaker with specialized training', ARRAY['Dementia care', 'Stroke rehabilitation', 'Chronic disease management'], 'Trivandrum', ARRAY['Sasthamangalam', 'Ulloor', 'Medical College'], 'verified', true, 4.9, 223, 245, 223),
('prof-care-4', ARRAY['caretaker'], 4, 160, 'Young caretaker with modern training', ARRAY['Companion care', 'Mobility assistance', 'Emergency response'], 'Trivandrum', ARRAY['Nemom', 'Balaramapuram', 'Neyyattinkara'], 'verified', true, 4.5, 78, 90, 78),
('prof-care-5', ARRAY['caretaker'], 7, 220, 'Reliable caretaker with 24/7 availability', ARRAY['Night care', 'Hospital assistance', 'Family support'], 'Trivandrum', ARRAY['Vattiyoorkavu', 'Kudappanakunnu', 'Peroorkada'], 'verified', true, 4.6, 145, 165, 145),

-- Cook professionals
('prof-cook-1', ARRAY['cook'], 6, 180, 'Professional cook specializing in Kerala cuisine', ARRAY['Traditional Kerala food', 'Vegetarian cooking', 'Special diets'], 'Trivandrum', ARRAY['Pattom', 'Kowdiar', 'Vazhuthacaud'], 'verified', true, 4.7, 156, 175, 156),
('prof-cook-2', ARRAY['cook'], 8, 220, 'Expert cook with multi-cuisine experience', ARRAY['North Indian', 'South Indian', 'Continental'], 'Trivandrum', ARRAY['Kazhakkoottam', 'Technopark', 'Pallippuram'], 'verified', true, 4.8, 189, 210, 189),
('prof-cook-3', ARRAY['cook'], 4, 160, 'Home cook with healthy meal expertise', ARRAY['Diabetic meals', 'Weight loss diets', 'Baby food'], 'Trivandrum', ARRAY['Sasthamangalam', 'Ulloor', 'Medical College'], 'verified', true, 4.6, 89, 105, 89),
('prof-cook-4', ARRAY['cook'], 10, 250, 'Master cook with catering experience', ARRAY['Party cooking', 'Bulk cooking', 'Event catering'], 'Trivandrum', ARRAY['Nemom', 'Balaramapuram', 'Neyyattinkara'], 'verified', true, 4.9, 234, 260, 234),
('prof-cook-5', ARRAY['cook'], 5, 200, 'Skilled cook with modern cooking techniques', ARRAY['Fusion cuisine', 'Baking', 'Meal planning'], 'Trivandrum', ARRAY['Vattiyoorkavu', 'Kudappanakunnu', 'Peroorkada'], 'verified', true, 4.5, 112, 125, 112),

-- Maid professionals
('prof-maid-1', ARRAY['maid'], 5, 150, 'Reliable maid with comprehensive house management', ARRAY['House cleaning', 'Cooking', 'Laundry'], 'Trivandrum', ARRAY['Pattom', 'Kowdiar', 'Vazhuthacaud'], 'verified', true, 4.6, 134, 150, 134),
('prof-maid-2', ARRAY['maid'], 7, 180, 'Experienced maid with childcare skills', ARRAY['Childcare', 'House maintenance', 'Elderly assistance'], 'Trivandrum', ARRAY['Kazhakkoottam', 'Technopark', 'Pallippuram'], 'verified', true, 4.7, 167, 185, 167),
('prof-maid-3', ARRAY['maid'], 3, 130, 'Young maid with modern cleaning techniques', ARRAY['Deep cleaning', 'Organization', 'Pet care'], 'Trivandrum', ARRAY['Sasthamangalam', 'Ulloor', 'Medical College'], 'verified', true, 4.4, 67, 80, 67),
('prof-maid-4', ARRAY['maid'], 9, 200, 'Senior maid with full household management', ARRAY['Complete house management', 'Cooking expertise', 'Guest handling'], 'Trivandrum', ARRAY['Nemom', 'Balaramapuram', 'Neyyattinkara'], 'verified', true, 4.8, 201, 225, 201),
('prof-maid-5', ARRAY['maid'], 4, 160, 'Trustworthy maid with flexible timings', ARRAY['Part-time service', 'Weekend cleaning', 'Emergency help'], 'Trivandrum', ARRAY['Vattiyoorkavu', 'Kudappanakunnu', 'Peroorkada'], 'verified', true, 4.5, 89, 105, 89),

-- Laundry professionals
('prof-laundry-1', ARRAY['laundry'], 6, 120, 'Professional laundry service with pickup/delivery', ARRAY['Washing', 'Ironing', 'Dry cleaning'], 'Trivandrum', ARRAY['Pattom', 'Kowdiar', 'Vazhuthacaud'], 'verified', true, 4.6, 123, 140, 123),
('prof-laundry-2', ARRAY['laundry'], 8, 150, 'Expert laundry service with stain removal', ARRAY['Stain treatment', 'Delicate fabrics', 'Express service'], 'Trivandrum', ARRAY['Kazhakkoottam', 'Technopark', 'Pallippuram'], 'verified', true, 4.7, 156, 175, 156),
('prof-laundry-3', ARRAY['laundry'], 4, 100, 'Affordable laundry service with quality guarantee', ARRAY['Basic washing', 'Bulk laundry', 'Student discounts'], 'Trivandrum', ARRAY['Sasthamangalam', 'Ulloor', 'Medical College'], 'verified', true, 4.4, 78, 90, 78),
('prof-laundry-4', ARRAY['laundry'], 10, 180, 'Premium laundry service with eco-friendly methods', ARRAY['Organic detergents', 'Fabric care', 'Luxury items'], 'Trivandrum', ARRAY['Nemom', 'Balaramapuram', 'Neyyattinkara'], 'verified', true, 4.8, 189, 210, 189),
('prof-laundry-5', ARRAY['laundry'], 5, 130, 'Quick laundry service with same-day delivery', ARRAY['Express washing', 'Emergency service', 'Corporate contracts'], 'Trivandrum', ARRAY['Vattiyoorkavu', 'Kudappanakunnu', 'Peroorkada'], 'verified', true, 4.5, 112, 125, 112),

-- Healthcare professionals
('prof-health-1', ARRAY['healthcare'], 12, 400, 'Registered nurse with home healthcare experience', ARRAY['Nursing care', 'Injection administration', 'Wound care'], 'Trivandrum', ARRAY['Pattom', 'Kowdiar', 'Vazhuthacaud'], 'verified', true, 4.9, 234, 260, 234),
('prof-health-2', ARRAY['healthcare'], 8, 350, 'Physiotherapist with home visit services', ARRAY['Physiotherapy', 'Rehabilitation', 'Exercise therapy'], 'Trivandrum', ARRAY['Kazhakkoottam', 'Technopark', 'Pallippuram'], 'verified', true, 4.8, 167, 185, 167),
('prof-health-3', ARRAY['healthcare'], 6, 300, 'Healthcare assistant with elderly care expertise', ARRAY['Elderly care', 'Medication reminders', 'Health monitoring'], 'Trivandrum', ARRAY['Sasthamangalam', 'Ulloor', 'Medical College'], 'verified', true, 4.7, 134, 150, 134),
('prof-health-4', ARRAY['healthcare'], 10, 380, 'Experienced nurse with critical care background', ARRAY['Critical care', 'Post-operative care', 'Medical equipment'], 'Trivandrum', ARRAY['Nemom', 'Balaramapuram', 'Neyyattinkara'], 'verified', true, 4.8, 201, 225, 201),
('prof-health-5', ARRAY['healthcare'], 5, 320, 'Young healthcare professional with modern training', ARRAY['Home diagnostics', 'Health education', 'Preventive care'], 'Trivandrum', ARRAY['Vattiyoorkavu', 'Kudappanakunnu', 'Peroorkada'], 'verified', true, 4.6, 89, 105, 89),

-- Babysitting professionals
('prof-baby-1', ARRAY['babysitting'], 6, 180, 'Experienced babysitter with childcare certification', ARRAY['Infant care', 'Toddler activities', 'Educational games'], 'Trivandrum', ARRAY['Pattom', 'Kowdiar', 'Vazhuthacaud'], 'verified', true, 4.8, 167, 185, 167),
('prof-baby-2', ARRAY['babysitting'], 4, 160, 'Young babysitter with early childhood education', ARRAY['Creative activities', 'Homework help', 'Outdoor play'], 'Trivandrum', ARRAY['Kazhakkoottam', 'Technopark', 'Pallippuram'], 'verified', true, 4.6, 89, 105, 89),
('prof-baby-3', ARRAY['babysitting'], 8, 200, 'Professional nanny with multiple children experience', ARRAY['Multiple children', 'Special needs', 'Meal preparation'], 'Trivandrum', ARRAY['Sasthamangalam', 'Ulloor', 'Medical College'], 'verified', true, 4.9, 201, 225, 201),
('prof-baby-4', ARRAY['babysitting'], 5, 170, 'Caring babysitter with first aid training', ARRAY['First aid', 'Safety protocols', 'Emergency handling'], 'Trivandrum', ARRAY['Nemom', 'Balaramapuram', 'Neyyattinkara'], 'verified', true, 4.7, 123, 140, 123),
('prof-baby-5', ARRAY['babysitting'], 7, 190, 'Experienced childcare provider with flexible hours', ARRAY['Night care', 'Weekend sitting', 'Event babysitting'], 'Trivandrum', ARRAY['Vattiyoorkavu', 'Kudappanakunnu', 'Peroorkada'], 'verified', true, 4.5, 134, 150, 134),

-- Tailoring professionals
('prof-tailor-1', ARRAY['tailoring'], 15, 250, 'Master tailor with traditional and modern expertise', ARRAY['Custom tailoring', 'Alterations', 'Embroidery'], 'Trivandrum', ARRAY['Pattom', 'Kowdiar', 'Vazhuthacaud'], 'verified', true, 4.9, 267, 290, 267),
('prof-tailor-2', ARRAY['tailoring'], 8, 200, 'Skilled tailor specializing in women\'s clothing', ARRAY['Saree blouses', 'Churidar', 'Western wear'], 'Trivandrum', ARRAY['Kazhakkoottam', 'Technopark', 'Pallippuram'], 'verified', true, 4.7, 156, 175, 156),
('prof-tailor-3', ARRAY['tailoring'], 12, 280, 'Expert tailor with designer clothing experience', ARRAY['Designer wear', 'Bridal outfits', 'Party wear'], 'Trivandrum', ARRAY['Sasthamangalam', 'Ulloor', 'Medical College'], 'verified', true, 4.8, 223, 245, 223),
('prof-tailor-4', ARRAY['tailoring'], 6, 180, 'Professional tailor with quick turnaround', ARRAY['Express tailoring', 'Uniform stitching', 'Repairs'], 'Trivandrum', ARRAY['Nemom', 'Balaramapuram', 'Neyyattinkara'], 'verified', true, 4.6, 134, 150, 134),
('prof-tailor-5', ARRAY['tailoring'], 10, 220, 'Experienced tailor with home visit services', ARRAY['Home measurements', 'Fitting services', 'Fabric consultation'], 'Trivandrum', ARRAY['Vattiyoorkavu', 'Kudappanakunnu', 'Peroorkada'], 'verified', true, 4.5, 178, 195, 178)

ON CONFLICT (id) DO NOTHING;