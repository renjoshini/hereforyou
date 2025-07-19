import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const auth = {
  // Sign up new user
  async signUp(email, password, userData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    if (error) throw error
    
    // Create profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email,
          full_name: userData.full_name,
          phone: userData.phone,
          role: userData.role || 'customer'
        })
      
      if (profileError) throw profileError
    }
    
    return data
  },

  // Sign in user
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  // Sign out user
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Get user profile
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  }
}

// Database helpers
export const db = {
  // Services
  async getServices() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('name')
    
    if (error) throw error
    return data
  },

  // Professionals
  async getProfessionals(filters = {}, userLocation = null) {
    let query = supabase
      .from('professionals')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url,
          phone
        )
      `)
      .eq('verification_status', 'verified')
      .eq('is_available', true)

    if (filters.service) {
      query = query.contains('services', [filters.service])
    }
    
    if (filters.city) {
      query = query.eq('city', filters.city)
    }

    if (filters.area) {
      query = query.contains('areas_served', [filters.area])
    }

    if (filters.minRating) {
      query = query.gte('rating_average', filters.minRating)
    }

    if (filters.maxPrice) {
      query = query.lte('hourly_rate', filters.maxPrice)
    }

    const { data, error } = await query.order('rating_average', { ascending: false })
    
    if (error) throw error
    
    // Add estimated distance if user location is provided
    if (userLocation && data) {
      return data.map(prof => ({
        ...prof,
        estimated_distance: calculateDistance(userLocation, prof.city),
        estimated_time: Math.ceil(calculateDistance(userLocation, prof.city) * 2) // 2 minutes per km
      }))
    }
    
    return data
  },

  async getProfessionalById(id) {
    const { data, error } = await supabase
      .from('professionals')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url,
          phone,
          email
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Bookings
  async createBooking(bookingData) {
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single()
    
    if (error) throw error
    
    // Add initial timeline entry
    await supabase
      .from('booking_timeline')
      .insert({
        booking_id: data.id,
        status: 'confirmed',
        note: 'Booking confirmed',
        updated_by: bookingData.customer_id
      })
    
    return data
  },

  async getUserBookings(userId) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        professionals (
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        )
      `)
      .eq('customer_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getProfessionalBookings(professionalId) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        profiles:customer_id (
          full_name,
          phone,
          avatar_url
        )
      `)
      .eq('professional_id', professionalId)
      .order('scheduled_date', { ascending: true })
    
    if (error) throw error
    return data
  },

  async updateBookingStatus(bookingId, status, note, userId) {
    // Update booking status
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', bookingId)
    
    if (bookingError) throw bookingError

    // Add timeline entry
    const { error: timelineError } = await supabase
      .from('booking_timeline')
      .insert({
        booking_id: bookingId,
        status,
        note,
        updated_by: userId
      })
    
    if (timelineError) throw timelineError
  },

  // Reviews
  async createReview(reviewData) {
    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewData)
      .select()
      .single()
    
    if (error) throw error
    
    // Update professional rating
    await this.updateProfessionalRating(reviewData.professional_id)
    
    return data
  },

  async getProfessionalReviews(professionalId) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles:customer_id (
          full_name,
          avatar_url
        ),
        bookings (
          service_category,
          scheduled_date
        )
      `)
      .eq('professional_id', professionalId)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async updateProfessionalRating(professionalId) {
    // Get all reviews for this professional
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('professional_id', professionalId)
      .eq('is_public', true)
    
    if (error) throw error
    
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = totalRating / reviews.length
      
      // Update professional rating
      await supabase
        .from('professionals')
        .update({
          rating_average: averageRating,
          rating_count: reviews.length
        })
        .eq('id', professionalId)
    }
  },

  // Location-based search
  async searchProfessionalsByLocation(serviceCategory, userLocation, radius = 10) {
    const { data, error } = await supabase
      .from('professionals')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url,
          phone
        )
      `)
      .contains('services', [serviceCategory])
      .eq('verification_status', 'verified')
      .eq('is_available', true)
      .order('rating_average', { ascending: false })
    
    if (error) throw error
    
    // Filter by location and add distance calculations
    return data
      .map(prof => ({
        ...prof,
        estimated_distance: calculateDistance(userLocation, prof.city),
        estimated_time: Math.ceil(calculateDistance(userLocation, prof.city) * 2)
      }))
      .filter(prof => prof.estimated_distance <= radius)
      .sort((a, b) => a.estimated_distance - b.estimated_distance)
  },

  // Get professional availability
  async getProfessionalAvailability(professionalId, date) {
    const { data, error } = await supabase
      .from('bookings')
      .select('scheduled_time')
      .eq('professional_id', professionalId)
      .eq('scheduled_date', date)
      .in('status', ['confirmed', 'in_progress'])
    
    if (error) throw error
    
    // Return booked time slots
    return data.map(booking => booking.scheduled_time)
  },

  // Support
  async createSupportTicket(ticketData) {
    const { data, error } = await supabase
      .from('support_tickets')
      .insert(ticketData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // User addresses
  async getUserAddresses(userId) {
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
    
    if (error) throw error
    return data
  },

  async addUserAddress(addressData) {
    const { data, error } = await supabase
      .from('user_addresses')
      .insert(addressData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Helper function to calculate distance (simplified)
function calculateDistance(location1, location2) {
  // Simplified distance calculation for demo
  // In production, use proper geolocation APIs
  const distances = {
    'Pattom': 2,
    'Kowdiar': 3,
    'Vazhuthacaud': 4,
    'Kazhakkoottam': 8,
    'Technopark': 10,
    'Pallippuram': 12,
    'Sasthamangalam': 5,
    'Ulloor': 6,
    'Medical College': 4,
    'Nemom': 15,
    'Balaramapuram': 18,
    'Neyyattinkara': 25,
    'Vattiyoorkavu': 7,
    'Kudappanakunnu': 9,
    'Peroorkada': 11
  }
  
  return distances[location2] || 5 // Default 5km if not found
}

// Real-time subscriptions
export const subscriptions = {
  // Subscribe to booking updates
  subscribeToBookings(userId, callback) {
    return supabase
      .channel('booking_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `customer_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  },

  // Subscribe to professional booking updates
  subscribeToProfessionalBookings(professionalId, callback) {
    return supabase
      .channel('professional_booking_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `professional_id=eq.${professionalId}`
        },
        callback
      )
      .subscribe()
  }
}