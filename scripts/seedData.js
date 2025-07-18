const mongoose = require('mongoose');
const Service = require('../models/Service');
const User = require('../models/User');
const Professional = require('../models/Professional');
require('dotenv').config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hereforyou');

const seedServices = async () => {
  try {
    // Clear existing services
    await Service.deleteMany({});

    const services = [
      {
        id: 'plumbing',
        name: 'Plumbing',
        description: 'Pipe repairs, leaks, installations',
        icon: 'fas fa-wrench',
        category: 'home-maintenance',
        subcategories: [
          { id: 'pipe-repair', name: 'Pipe Repair', description: 'Fix leaks and pipe issues', basePrice: { min: 300, max: 800 } },
          { id: 'bathroom-fitting', name: 'Bathroom Fitting', description: 'Install bathroom fixtures', basePrice: { min: 500, max: 1500 } },
          { id: 'water-heater', name: 'Water Heater Service', description: 'Install and repair water heaters', basePrice: { min: 400, max: 1200 } }
        ],
        pricing: { baseRate: { min: 250, max: 500 } },
        duration: { min: 1, max: 4 },
        availability: { cities: ['Trivandrum', 'Kochi', 'Thrissur', 'Kozhikode'], isEmergencyService: true }
      },
      {
        id: 'ac-repair',
        name: 'AC Repair',
        description: 'AC service, installation, maintenance',
        icon: 'fas fa-snowflake',
        category: 'repair',
        subcategories: [
          { id: 'ac-service', name: 'AC Service', description: 'Regular AC maintenance', basePrice: { min: 400, max: 800 } },
          { id: 'ac-installation', name: 'AC Installation', description: 'Install new AC units', basePrice: { min: 1000, max: 3000 } },
          { id: 'ac-repair', name: 'AC Repair', description: 'Fix AC problems', basePrice: { min: 500, max: 1500 } }
        ],
        pricing: { baseRate: { min: 350, max: 600 } },
        duration: { min: 1, max: 3 },
        availability: { cities: ['Trivandrum', 'Kochi', 'Thrissur', 'Kozhikode'] }
      },
      {
        id: 'house-cleaning',
        name: 'House Cleaning',
        description: 'Deep cleaning, regular cleaning',
        icon: 'fas fa-broom',
        category: 'cleaning',
        subcategories: [
          { id: 'deep-cleaning', name: 'Deep Cleaning', description: 'Thorough house cleaning', basePrice: { min: 800, max: 2000 } },
          { id: 'regular-cleaning', name: 'Regular Cleaning', description: 'Daily/weekly cleaning', basePrice: { min: 300, max: 800 } },
          { id: 'post-construction', name: 'Post Construction Cleaning', description: 'Clean after construction work', basePrice: { min: 1500, max: 4000 } }
        ],
        pricing: { baseRate: { min: 200, max: 400 } },
        duration: { min: 2, max: 8 },
        availability: { cities: ['Trivandrum', 'Kochi', 'Thrissur', 'Kozhikode', 'Kollam'] }
      },
      {
        id: 'electrical',
        name: 'Electrical',
        description: 'Wiring, repairs, installations',
        icon: 'fas fa-bolt',
        category: 'home-maintenance',
        subcategories: [
          { id: 'wiring', name: 'Electrical Wiring', description: 'House wiring and rewiring', basePrice: { min: 500, max: 2000 } },
          { id: 'switch-repair', name: 'Switch & Socket Repair', description: 'Fix electrical switches and sockets', basePrice: { min: 200, max: 600 } },
          { id: 'fan-installation', name: 'Fan Installation', description: 'Install ceiling and wall fans', basePrice: { min: 300, max: 800 } }
        ],
        pricing: { baseRate: { min: 300, max: 500 } },
        duration: { min: 1, max: 6 },
        availability: { cities: ['Trivandrum', 'Kochi', 'Thrissur', 'Kozhikode'], isEmergencyService: true }
      },
      {
        id: 'car-repair',
        name: 'Car Repair',
        description: 'Auto service, repairs, maintenance',
        icon: 'fas fa-car',
        category: 'automotive',
        subcategories: [
          { id: 'car-service', name: 'Car Service', description: 'Regular car maintenance', basePrice: { min: 800, max: 2500 } },
          { id: 'car-wash', name: 'Car Wash', description: 'Car cleaning and detailing', basePrice: { min: 200, max: 800 } },
          { id: 'car-repair', name: 'Car Repair', description: 'Fix car problems', basePrice: { min: 500, max: 5000 } }
        ],
        pricing: { baseRate: { min: 400, max: 800 } },
        duration: { min: 1, max: 8 },
        availability: { cities: ['Trivandrum', 'Kochi', 'Thrissur', 'Kozhikode'] }
      },
      {
        id: 'caretaker',
        name: 'Caretaker',
        description: 'Elder care, patient care',
        icon: 'fas fa-user-nurse',
        category: 'care',
        subcategories: [
          { id: 'elder-care', name: 'Elder Care', description: 'Care for elderly people', basePrice: { min: 1000, max: 3000 } },
          { id: 'patient-care', name: 'Patient Care', description: 'Care for patients', basePrice: { min: 1200, max: 3500 } },
          { id: 'companion-care', name: 'Companion Care', description: 'Companionship services', basePrice: { min: 800, max: 2000 } }
        ],
        pricing: { baseRate: { min: 150, max: 300 } },
        duration: { min: 4, max: 24 },
        availability: { cities: ['Trivandrum', 'Kochi', 'Thrissur', 'Kozhikode', 'Kollam'] }
      }
    ];

    await Service.insertMany(services);
    console.log('✅ Services seeded successfully');

  } catch (error) {
    console.error('❌ Error seeding services:', error);
  }
};

const seedUsers = async () => {
  try {
    // Create sample users (customers)
    const customers = [
      {
        name: 'Renjini Xavier',
        email: 'renjini@example.com',
        phone: '9876543210',
        password: 'password123',
        role: 'customer',
        isVerified: true,
        verification: {
          emailVerified: true,
          phoneVerified: true
        },
        profile: {
          addresses: [{
            type: 'home',
            address: '123 Rose Garden',
            city: 'Trivandrum',
            state: 'Kerala',
            pincode: '695001',
            isDefault: true
          }]
        }
      },
      {
        name: 'Arjun Nair',
        email: 'arjun@example.com',
        phone: '9876543211',
        password: 'password123',
        role: 'customer',
        isVerified: true,
        verification: {
          emailVerified: true,
          phoneVerified: true
        }
      }
    ];

    for (const customerData of customers) {
      const existingUser = await User.findOne({ email: customerData.email });
      if (!existingUser) {
        const user = new User(customerData);
        await user.save();
      }
    }

    // Create sample professionals
    const professionals = [
      {
        name: 'Suresh Kumar',
        email: 'suresh@example.com',
        phone: '9876543220',
        password: 'password123',
        role: 'professional',
        isVerified: true,
        verification: {
          emailVerified: true,
          phoneVerified: true
        }
      },
      {
        name: 'Meera Kumari',
        email: 'meera@example.com',
        phone: '9876543221',
        password: 'password123',
        role: 'professional',
        isVerified: true,
        verification: {
          emailVerified: true,
          phoneVerified: true
        }
      },
      {
        name: 'Anil Devi',
        email: 'anil@example.com',
        phone: '9876543222',
        password: 'password123',
        role: 'professional',
        isVerified: true,
        verification: {
          emailVerified: true,
          phoneVerified: true
        }
      }
    ];

    for (const profData of professionals) {
      const existingUser = await User.findOne({ email: profData.email });
      if (!existingUser) {
        const user = new User(profData);
        await user.save();
      }
    }

    console.log('✅ Users seeded successfully');

  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
};

const seedProfessionals = async () => {
  try {
    // Get professional users
    const suresh = await User.findOne({ email: 'suresh@example.com' });
    const meera = await User.findOne({ email: 'meera@example.com' });
    const anil = await User.findOne({ email: 'anil@example.com' });

    const professionalProfiles = [
      {
        user: suresh._id,
        services: ['plumbing'],
        experience: { years: 8, description: 'Experienced plumber with expertise in residential and commercial plumbing' },
        skills: [
          { name: 'Pipe Repair', level: 'expert' },
          { name: 'Bathroom Fitting', level: 'expert' },
          { name: 'Water Heater Installation', level: 'intermediate' }
        ],
        pricing: { hourlyRate: 300, minimumCharge: 200 },
        availability: {
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
          workingHours: { start: '08:00', end: '18:00' },
          isAvailable: true
        },
        location: {
          city: 'Trivandrum',
          areas: ['Eastfort', 'Thampanoor', 'Palayam'],
          serviceRadius: 15
        },
        verification: {
          status: 'verified',
          documents: {
            aadhar: { number: '123456789012', verified: true },
            pan: { number: 'ABCDE1234F', verified: true },
            bankAccount: { accountNumber: '1234567890', ifscCode: 'SBIN0001234', accountHolderName: 'Suresh Kumar', verified: true }
          },
          backgroundCheck: { status: 'completed', completedAt: new Date() }
        },
        ratings: { average: 4.8, count: 156, breakdown: { 5: 125, 4: 23, 3: 6, 2: 2, 1: 0 } },
        statistics: { totalBookings: 180, completedBookings: 156, cancelledBookings: 8, totalEarnings: 45000 },
        portfolio: {
          description: 'Professional plumber with 8 years of experience. Specializes in residential plumbing, bathroom renovations, and emergency repairs.',
          images: [],
          workSamples: []
        }
      },
      {
        user: meera._id,
        services: ['house-cleaning'],
        experience: { years: 6, description: 'Professional house cleaner with attention to detail' },
        skills: [
          { name: 'Deep Cleaning', level: 'expert' },
          { name: 'Regular Cleaning', level: 'expert' },
          { name: 'Organization', level: 'intermediate' }
        ],
        pricing: { hourlyRate: 200, minimumCharge: 300 },
        availability: {
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
          workingHours: { start: '09:00', end: '17:00' },
          isAvailable: true
        },
        location: {
          city: 'Trivandrum',
          areas: ['Pattom', 'Kowdiar', 'Vazhuthacaud'],
          serviceRadius: 12
        },
        verification: {
          status: 'verified',
          documents: {
            aadhar: { number: '123456789013', verified: true },
            pan: { number: 'ABCDE1234G', verified: true },
            bankAccount: { accountNumber: '1234567891', ifscCode: 'SBIN0001234', accountHolderName: 'Meera Kumari', verified: true }
          },
          backgroundCheck: { status: 'completed', completedAt: new Date() }
        },
        ratings: { average: 4.7, count: 134, breakdown: { 5: 98, 4: 28, 3: 6, 2: 2, 1: 0 } },
        statistics: { totalBookings: 150, completedBookings: 134, cancelledBookings: 5, totalEarnings: 32000 },
        portfolio: {
          description: 'Experienced house cleaner providing quality cleaning services for homes and offices.',
          images: [],
          workSamples: []
        }
      },
      {
        user: anil._id,
        services: ['ac-repair'],
        experience: { years: 10, description: 'AC technician with expertise in all brands' },
        skills: [
          { name: 'Split AC Service', level: 'expert' },
          { name: 'Window AC Repair', level: 'expert' },
          { name: 'AC Installation', level: 'expert' }
        ],
        pricing: { hourlyRate: 400, minimumCharge: 300 },
        availability: {
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
          workingHours: { start: '08:00', end: '19:00' },
          isAvailable: true
        },
        location: {
          city: 'Trivandrum',
          areas: ['Vazhuthacaud', 'Medical College', 'Pattom'],
          serviceRadius: 20
        },
        verification: {
          status: 'verified',
          documents: {
            aadhar: { number: '123456789014', verified: true },
            pan: { number: 'ABCDE1234H', verified: true },
            bankAccount: { accountNumber: '1234567892', ifscCode: 'SBIN0001234', accountHolderName: 'Anil Devi', verified: true }
          },
          backgroundCheck: { status: 'completed', completedAt: new Date() }
        },
        ratings: { average: 4.9, count: 203, breakdown: { 5: 178, 4: 20, 3: 4, 2: 1, 1: 0 } },
        statistics: { totalBookings: 220, completedBookings: 203, cancelledBookings: 7, totalEarnings: 78000 },
        portfolio: {
          description: 'Expert AC technician with 10 years of experience. Certified for all major AC brands.',
          images: [],
          workSamples: []
        }
      }
    ];

    for (const profData of professionalProfiles) {
      const existingProf = await Professional.findOne({ user: profData.user });
      if (!existingProf) {
        const professional = new Professional(profData);
        await professional.save();
      }
    }

    console.log('✅ Professional profiles seeded successfully');

  } catch (error) {
    console.error('❌ Error seeding professionals:', error);
  }
};

const runSeed = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await seedServices();
    await seedUsers();
    await seedProfessionals();
    
    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  runSeed();
}

module.exports = { seedServices, seedUsers, seedProfessionals };