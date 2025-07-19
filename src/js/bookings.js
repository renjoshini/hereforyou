import { db, auth } from '../lib/supabase.js'

// Booking management
let currentBooking = null
let selectedProfessional = null

// Initialize booking page
export async function initBooking() {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const professionalId = urlParams.get('professional')
    const serviceCategory = urlParams.get('service')
    
    if (professionalId) {
      selectedProfessional = await db.getProfessionalById(professionalId)
      renderBookingForm()
    }
    
    // Pre-fill user information
    const user = await auth.getCurrentUser()
    if (user) {
      const profile = await auth.getUserProfile(user.id)
      prefillUserInfo(profile)
    }
    
    setupBookingForm()
  } catch (error) {
    console.error('Error initializing booking:', error)
    showNotification('Error loading booking page', 'error')
  }
}

// Render booking form with professional info
function renderBookingForm() {
  if (!selectedProfessional) return
  
  const professionalInfo = document.querySelector('.professional-info')
  if (professionalInfo) {
    professionalInfo.innerHTML = `
      <div class="professional-avatar">${getInitials(selectedProfessional.profiles.full_name)}</div>
      <div>
        <h4>${selectedProfessional.profiles.full_name}</h4>
        <p>${selectedProfessional.services.join(', ')}</p>
        <div class="rating">
          <span class="stars">${'★'.repeat(Math.floor(selectedProfessional.rating_average))}${'☆'.repeat(5 - Math.floor(selectedProfessional.rating_average))}</span>
          <span>${selectedProfessional.rating_average.toFixed(1)} (${selectedProfessional.rating_count} reviews)</span>
        </div>
      </div>
    `
  }
  
  const priceAmount = document.querySelector('.price-amount')
  if (priceAmount) {
    priceAmount.textContent = `₹${selectedProfessional.hourly_rate}/hour`
  }
}

// Pre-fill user information
function prefillUserInfo(profile) {
  const contactName = document.getElementById('contactName')
  const contactPhone = document.getElementById('contactPhone')
  
  if (contactName && profile.full_name) {
    contactName.value = profile.full_name
  }
  
  if (contactPhone && profile.phone) {
    contactPhone.value = profile.phone
  }
}

// Setup booking form submission
function setupBookingForm() {
  const bookingForm = document.getElementById('bookingForm')
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleBookingSubmission)
  }
  
  // Setup calendar
  renderBookingCalendar()
}

// Handle booking form submission
async function handleBookingSubmission(event) {
  event.preventDefault()
  
  try {
    if (!window.isAuthenticated()) {
      window.location.href = 'login.html'
      return
    }
    
    const selectedDate = document.querySelector('.calendar-day.selected')
    const selectedTime = document.querySelector('.time-slot.selected')
    
    if (!selectedDate || !selectedTime) {
      showNotification('Please select date and time', 'error')
      return
    }
    
    if (!document.getElementById('agreeTerms').checked) {
      showNotification('Please agree to terms and conditions', 'error')
      return
    }
    
    const user = await auth.getCurrentUser()
    const formData = new FormData(event.target)
    
    // Prepare booking data
    const bookingData = {
      customer_id: user.id,
      professional_id: selectedProfessional.id,
      service_category: selectedProfessional.services[0], // Use first service
      service_description: formData.get('serviceType'),
      scheduled_date: `2025-01-${selectedDate.textContent.padStart(2, '0')}`,
      scheduled_time: convertTo24Hour(selectedTime.textContent),
      address: formData.get('address'),
      city: formData.get('city'),
      pincode: formData.get('pincode'),
      contact_name: formData.get('contactName'),
      contact_phone: formData.get('contactPhone'),
      estimated_cost_min: selectedProfessional.hourly_rate,
      estimated_cost_max: selectedProfessional.hourly_rate * 3,
      payment_method: formData.get('paymentMethod'),
      special_instructions: formData.get('instructions')
    }
    
    // Create booking
    const booking = await db.createBooking(bookingData)
    
    showNotification('Booking confirmed successfully!')
    
    // Redirect to confirmation page
    setTimeout(() => {
      window.location.href = `booking-confirmation.html?id=${booking.id}`
    }, 1500)
    
  } catch (error) {
    console.error('Booking submission error:', error)
    showNotification(error.message || 'Failed to create booking', 'error')
  }
}

// Load user bookings
export async function loadUserBookings() {
  try {
    const user = await auth.getCurrentUser()
    if (!user) {
      window.location.href = 'login.html'
      return
    }
    
    const bookings = await db.getUserBookings(user.id)
    renderBookings(bookings)
  } catch (error) {
    console.error('Error loading bookings:', error)
    showNotification('Error loading bookings', 'error')
  }
}

// Render bookings list
function renderBookings(bookings) {
  const container = document.getElementById('bookingsContainer')
  const emptyState = document.getElementById('emptyState')
  
  if (!container) return
  
  if (bookings.length === 0) {
    container.style.display = 'none'
    if (emptyState) emptyState.style.display = 'block'
    return
  }
  
  container.style.display = 'grid'
  if (emptyState) emptyState.style.display = 'none'
  
  container.innerHTML = bookings.map(booking => `
    <div class="booking-card ${booking.status}">
      <div class="booking-header">
        <div class="booking-service">
          <h3>${booking.service_category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
          <p>${booking.service_description || 'Service booking'}</p>
        </div>
        <div class="booking-status">
          <span class="status-badge ${booking.status}">
            ${getStatusIcon(booking.status)} ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>
      </div>
      
      <div class="booking-details">
        <div class="detail-row">
          <div class="detail-item">
            <i class="fas fa-calendar"></i>
            <span>${formatDate(booking.scheduled_date)}</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-clock"></i>
            <span>${formatTime(booking.scheduled_time)}</span>
          </div>
        </div>
        
        <div class="detail-row">
          <div class="detail-item">
            <i class="fas fa-user"></i>
            <span>${booking.professionals?.profiles?.full_name || 'Professional'}</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-rupee-sign"></i>
            <span>₹${booking.estimated_cost_min} - ₹${booking.estimated_cost_max}</span>
          </div>
        </div>
        
        <div class="detail-row">
          <div class="detail-item full-width">
            <i class="fas fa-map-marker-alt"></i>
            <span>${booking.address}</span>
          </div>
        </div>
        
        <div class="detail-row">
          <div class="detail-item">
            <i class="fas fa-credit-card"></i>
            <span>${formatPaymentMethod(booking.payment_method)}</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-hashtag"></i>
            <span>${booking.booking_id}</span>
          </div>
        </div>
      </div>
      
      <div class="booking-actions">
        ${getBookingActions(booking)}
      </div>
    </div>
  `).join('')
}

// Calendar rendering
function renderBookingCalendar() {
  const calendarContainer = document.getElementById('calendarContainer')
  if (!calendarContainer) return
  
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  
  let calendarHTML = `
    <div class="calendar-header">
      <h4>January 2025</h4>
    </div>
    <div class="calendar-grid">
      <div class="calendar-day-header">Sun</div>
      <div class="calendar-day-header">Mon</div>
      <div class="calendar-day-header">Tue</div>
      <div class="calendar-day-header">Wed</div>
      <div class="calendar-day-header">Thu</div>
      <div class="calendar-day-header">Fri</div>
      <div class="calendar-day-header">Sat</div>
  `
  
  // Add empty cells for previous month
  for (let i = 0; i < firstDay; i++) {
    calendarHTML += '<div class="calendar-day empty"></div>'
  }
  
  // Add days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const isPast = day < today.getDate()
    const isToday = day === today.getDate()
    const isAvailable = !isPast && Math.random() > 0.2 // 80% availability
    
    let classes = 'calendar-day'
    if (isPast) classes += ' past'
    else if (isAvailable) classes += ' available'
    else classes += ' unavailable'
    if (isToday) classes += ' today'
    
    const onclick = isAvailable ? `onclick="selectBookingDate(${day})"` : ''
    
    calendarHTML += `<div class="${classes}" ${onclick}>${day}</div>`
  }
  
  calendarHTML += '</div>'
  calendarContainer.innerHTML = calendarHTML
}

// Select booking date
window.selectBookingDate = function(day) {
  // Remove previous selection
  document.querySelectorAll('.calendar-day').forEach(dayEl => {
    dayEl.classList.remove('selected')
  })
  
  // Add selection to clicked date
  event.target.classList.add('selected')
  
  // Render available time slots
  renderBookingTimeSlots(day)
}

// Render time slots
function renderBookingTimeSlots(day) {
  const timeSlotsContainer = document.getElementById('timeSlotsContainer')
  if (!timeSlotsContainer) return
  
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
  ]
  
  // Randomly make some slots unavailable
  const availableSlots = timeSlots.filter(() => Math.random() > 0.3)
  
  timeSlotsContainer.innerHTML = `
    <h5>Available Time Slots for January ${day}</h5>
    <div class="time-slots">
      ${availableSlots.map(time => `
        <div class="time-slot" onclick="selectBookingTimeSlot('${time}')">
          ${time}
        </div>
      `).join('')}
    </div>
    ${availableSlots.length === 0 ? '<p class="no-slots">No slots available for this date</p>' : ''}
  `
}

// Select time slot
window.selectBookingTimeSlot = function(time) {
  document.querySelectorAll('.time-slot').forEach(slot => {
    slot.classList.remove('selected')
  })
  event.target.classList.add('selected')
}

// Helper functions
function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

function convertTo24Hour(time12h) {
  const [time, modifier] = time12h.split(' ')
  let [hours, minutes] = time.split(':')
  if (hours === '12') {
    hours = '00'
  }
  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12
  }
  return `${hours}:${minutes}:00`
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatTime(timeString) {
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

function formatPaymentMethod(method) {
  const methods = {
    'cash': 'Cash After Service',
    'upi': 'UPI Payment',
    'card': 'Credit/Debit Card',
    'wallet': 'Digital Wallet'
  }
  return methods[method] || method
}

function getStatusIcon(status) {
  const icons = {
    'pending': '<i class="fas fa-clock"></i>',
    'confirmed': '<i class="fas fa-check"></i>',
    'in_progress': '<i class="fas fa-spinner"></i>',
    'completed': '<i class="fas fa-check-circle"></i>',
    'cancelled': '<i class="fas fa-times-circle"></i>'
  }
  return icons[status] || '<i class="fas fa-info-circle"></i>'
}

function getBookingActions(booking) {
  switch (booking.status) {
    case 'pending':
    case 'confirmed':
      return `
        <button class="btn-outline btn-small" onclick="viewBooking('${booking.id}')">
          <i class="fas fa-eye"></i> View Details
        </button>
        <button class="btn-outline btn-small cancel" onclick="cancelBooking('${booking.id}')">
          <i class="fas fa-times"></i> Cancel
        </button>
      `
    case 'completed':
      return `
        <button class="btn-outline btn-small" onclick="viewBooking('${booking.id}')">
          <i class="fas fa-eye"></i> View Details
        </button>
        <button class="btn-primary btn-small" onclick="rateService('${booking.id}')">
          <i class="fas fa-star"></i> Rate Service
        </button>
      `
    default:
      return `
        <button class="btn-outline btn-small" onclick="viewBooking('${booking.id}')">
          <i class="fas fa-eye"></i> View Details
        </button>
      `
  }
}

// Booking actions
window.viewBooking = function(bookingId) {
  window.location.href = `booking-confirmation.html?id=${bookingId}`
}

window.cancelBooking = async function(bookingId) {
  if (confirm('Are you sure you want to cancel this booking? Cancellation charges may apply.')) {
    try {
      const user = await auth.getCurrentUser()
      await db.updateBookingStatus(bookingId, 'cancelled', 'Cancelled by customer', user.id)
      showNotification('Booking cancelled successfully')
      loadUserBookings() // Reload bookings
    } catch (error) {
      console.error('Cancel booking error:', error)
      showNotification('Error cancelling booking', 'error')
    }
  }
}

window.rateService = function(bookingId) {
  const rating = prompt('Rate this service (1-5 stars):')
  if (rating && rating >= 1 && rating <= 5) {
    // TODO: Implement rating functionality
    showNotification('Thank you for your rating!')
  }
}

function showNotification(message, type = 'success') {
  const existingNotifications = document.querySelectorAll('.notification')
  existingNotifications.forEach(notification => notification.remove())
  
  const notification = document.createElement('div')
  notification.className = `notification ${type}`
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    </div>
  `
  
  document.body.appendChild(notification)
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove()
    }
  }, 4000)
  
  notification.addEventListener('click', () => {
    notification.remove()
  })
}

// Make functions globally available
window.initBooking = initBooking
window.loadUserBookings = loadUserBookings