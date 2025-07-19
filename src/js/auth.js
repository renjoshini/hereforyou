import { auth, db } from '../lib/supabase.js'

// Authentication state management
let currentUser = null
let userProfile = null

// Initialize auth state
export async function initAuth() {
  try {
    const user = await auth.getCurrentUser()
    if (user) {
      currentUser = user
      userProfile = await auth.getUserProfile(user.id)
      updateUIForAuthenticatedUser()
    } else {
      updateUIForUnauthenticatedUser()
    }
  } catch (error) {
    console.error('Auth initialization error:', error)
    updateUIForUnauthenticatedUser()
  }
}

// Sign up function
export async function signUp(formData) {
  try {
    const userData = {
      full_name: `${formData.firstName} ${formData.lastName}`,
      phone: formData.phone,
      role: 'customer'
    }

    const { user } = await auth.signUp(formData.email, formData.password, userData)
    
    showNotification('Account created successfully! Please check your email to verify your account.')
    
    // Redirect to login page
    setTimeout(() => {
      window.location.href = 'login.html'
    }, 2000)
    
    return user
  } catch (error) {
    console.error('Sign up error:', error)
    showNotification(error.message, 'error')
    throw error
  }
}

// Sign in function
export async function signIn(email, password) {
  try {
    const { user } = await auth.signIn(email, password)
    currentUser = user
    userProfile = await auth.getUserProfile(user.id)
    
    showNotification('Login successful!')
    
    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = 'dashboard.html'
    }, 1000)
    
    return user
  } catch (error) {
    console.error('Sign in error:', error)
    showNotification(error.message, 'error')
    throw error
  }
}

// Sign out function
export async function signOut() {
  try {
    await auth.signOut()
    currentUser = null
    userProfile = null
    
    showNotification('Logged out successfully')
    
    setTimeout(() => {
      window.location.href = 'index.html'
    }, 1000)
  } catch (error) {
    console.error('Sign out error:', error)
    showNotification('Error signing out', 'error')
  }
}

// Get current user
export function getCurrentUser() {
  return currentUser
}

// Get user profile
export function getUserProfile() {
  return userProfile
}

// Check if user is authenticated
export function isAuthenticated() {
  return currentUser !== null
}

// Redirect to login if not authenticated
export function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html'
    return false
  }
  return true
}

// Update UI for authenticated user
function updateUIForAuthenticatedUser() {
  const navLinks = document.querySelector('.nav-links')
  if (navLinks && userProfile) {
    navLinks.innerHTML = `
      <a href="dashboard.html" class="nav-link">Dashboard</a>
      <a href="bookings.html" class="nav-link">My Bookings</a>
      <a href="profile.html" class="nav-link">Profile</a>
      <span class="user-greeting">Hi, ${userProfile.full_name.split(' ')[0]}!</span>
      <button class="btn-secondary" onclick="signOut()">Logout</button>
    `
  }
}

// Update UI for unauthenticated user
function updateUIForUnauthenticatedUser() {
  const navLinks = document.querySelector('.nav-links')
  if (navLinks) {
    navLinks.innerHTML = `
      <a href="#services" class="nav-link">Services</a>
      <a href="about.html" class="nav-link">About</a>
      <a href="contact.html" class="nav-link">Contact</a>
      <button class="btn-secondary" onclick="window.location.href='login.html'">Login</button>
      <button class="btn-primary" onclick="window.location.href='signup.html'">Sign Up</button>
    `
  }
}

// Notification function
function showNotification(message, type = 'success') {
  // Remove existing notifications
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
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove()
    }
  }, 4000)
  
  // Add click to dismiss
  notification.addEventListener('click', () => {
    notification.remove()
  })
}

// Make functions globally available
window.signUp = signUp
window.signIn = signIn
window.signOut = signOut
window.getCurrentUser = getCurrentUser
window.getUserProfile = getUserProfile
window.isAuthenticated = isAuthenticated
window.requireAuth = requireAuth