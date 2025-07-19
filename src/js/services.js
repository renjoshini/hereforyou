import { db } from '../lib/supabase.js'

// Services management
let allServices = []
let allProfessionals = []

// Initialize services
export async function initServices() {
  try {
    allServices = await db.getServices()
    renderServices()
  } catch (error) {
    console.error('Error loading services:', error)
    showNotification('Error loading services', 'error')
  }
}

// Render services grid
export function renderServices() {
  const servicesGrid = document.getElementById('servicesGrid')
  if (!servicesGrid || !allServices.length) return
  
  servicesGrid.innerHTML = allServices.map(service => `
    <div class="service-card" onclick="selectService('${service.category}')">
      <i class="${service.icon}"></i>
      <h3>${service.name}</h3>
      <p>${service.description}</p>
      <div class="service-price">
        <span>Starting from ₹${service.base_price_min}</span>
      </div>
    </div>
  `).join('')
}

// Select service and navigate to professionals
export function selectService(serviceCategory) {
  const location = document.getElementById('locationSearch')?.value || 'Trivandrum'
  window.location.href = `service-list.html?service=${serviceCategory}&location=${encodeURIComponent(location)}`
}

// Load professionals for a service
export async function loadProfessionals(serviceCategory, location) {
  try {
    const filters = {
      service: serviceCategory,
      city: location
    }
    
    allProfessionals = await db.getProfessionals(filters)
    renderProfessionals()
    updateServiceInfo(serviceCategory, location)
  } catch (error) {
    console.error('Error loading professionals:', error)
    showNotification('Error loading professionals', 'error')
  }
}

// Render professionals list
function renderProfessionals() {
  const professionalsList = document.getElementById('professionalsList')
  const resultCount = document.getElementById('resultCount')
  const noResults = document.getElementById('noResults')
  
  if (!professionalsList) return
  
  if (allProfessionals.length === 0) {
    professionalsList.style.display = 'none'
    if (noResults) noResults.style.display = 'block'
    if (resultCount) resultCount.textContent = 'Found 0 professionals'
    return
  }
  
  professionalsList.style.display = 'grid'
  if (noResults) noResults.style.display = 'none'
  if (resultCount) resultCount.textContent = `Found ${allProfessionals.length} professionals`
  
  professionalsList.innerHTML = allProfessionals.map(prof => `
    <div class="professional-card">
      <div class="professional-header">
        <div class="professional-avatar">
          ${getInitials(prof.profiles.full_name)}
        </div>
        <div class="professional-info">
          <h3>${prof.profiles.full_name}</h3>
          <p>${prof.city}</p>
          ${prof.verification_status === 'verified' ? '<span class="verified-badge"><i class="fas fa-check-circle"></i> KYC Verified</span>' : ''}
        </div>
        <div class="professional-actions-quick">
          <button class="btn-icon" onclick="saveProfessional('${prof.id}')" title="Save Helper">
            <i class="fas fa-heart"></i>
          </button>
        </div>
      </div>
      <div class="professional-details">
        <div class="rating">
          <div class="stars">
            ${'★'.repeat(Math.floor(prof.rating_average))}${'☆'.repeat(5 - Math.floor(prof.rating_average))}
          </div>
          <span>${prof.rating_average.toFixed(1)} (${prof.rating_count} reviews)</span>
        </div>
        <div class="professional-stats">
          <div class="stat">
            <i class="fas fa-clock"></i>
            <span>${prof.experience_years} years exp</span>
          </div>
          <div class="stat">
            <i class="fas fa-rupee-sign"></i>
            <span>₹${prof.hourly_rate}/hour</span>
          </div>
        </div>
        <div class="specialties">
          <strong>Skills:</strong> ${prof.skills ? prof.skills.slice(0, 2).join(', ') : 'Professional service'}
        </div>
        <div class="availability-indicator">
          <i class="fas fa-circle" style="color: var(--success-color);"></i>
          <span>Available today</span>
        </div>
      </div>
      <div class="professional-actions">
        <button class="btn-outline" onclick="viewProfile('${prof.id}')">
          <i class="fas fa-user"></i> View Profile
        </button>
        <button class="btn-outline" onclick="contactProfessional('${prof.id}')">
          <i class="fas fa-phone"></i> Call
        </button>
        <button class="btn-primary" onclick="bookNow('${prof.id}')">
          <i class="fas fa-calendar"></i> Book Now
        </button>
      </div>
    </div>
  `).join('')
}

// Update service info on service list page
function updateServiceInfo(serviceCategory, location) {
  const serviceTitle = document.getElementById('serviceTitle')
  const locationDisplay = document.getElementById('locationDisplay')
  
  const service = allServices.find(s => s.category === serviceCategory)
  if (service && serviceTitle) {
    serviceTitle.textContent = service.name
  }
  
  if (locationDisplay) {
    locationDisplay.textContent = location
  }
}

// Search services
export async function searchServices() {
  const serviceQuery = document.getElementById('serviceSearch')?.value
  const locationQuery = document.getElementById('locationSearch')?.value || 'Trivandrum'
  
  if (serviceQuery && serviceQuery.trim()) {
    // Find matching service
    const matchedService = allServices.find(s => 
      s.name.toLowerCase().includes(serviceQuery.toLowerCase()) ||
      serviceQuery.toLowerCase().includes(s.name.toLowerCase())
    )
    
    if (matchedService) {
      window.location.href = `service-list.html?service=${matchedService.category}&location=${encodeURIComponent(locationQuery)}`
    } else {
      showNotification('Service not found. Please try a different search term.', 'error')
    }
  } else {
    showNotification('Please enter a service to search for', 'error')
  }
}

// Helper functions
function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

export function viewProfile(professionalId) {
  const urlParams = new URLSearchParams(window.location.search)
  const serviceCategory = urlParams.get('service')
  window.location.href = `professional-profile.html?id=${professionalId}&service=${serviceCategory}`
}

export function contactProfessional(professionalId) {
  showNotification('Contact details will be shared after booking confirmation')
}

export function bookNow(professionalId) {
  if (!window.isAuthenticated()) {
    window.location.href = 'login.html'
    return
  }
  
  const urlParams = new URLSearchParams(window.location.search)
  const serviceCategory = urlParams.get('service')
  window.location.href = `booking.html?professional=${professionalId}&service=${serviceCategory}`
}

export function saveProfessional(professionalId) {
  const savedHelpers = JSON.parse(localStorage.getItem('savedHelpers')) || []
  if (!savedHelpers.includes(professionalId)) {
    savedHelpers.push(professionalId)
    localStorage.setItem('savedHelpers', JSON.stringify(savedHelpers))
    showNotification('Helper saved to your favorites')
    event.target.style.color = 'var(--error-color)'
  } else {
    showNotification('Helper already in your favorites')
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
window.selectService = selectService
window.searchServices = searchServices
window.viewProfile = viewProfile
window.contactProfessional = contactProfessional
window.bookNow = bookNow
window.saveProfessional = saveProfessional