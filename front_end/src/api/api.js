const BASE_URL = 'http://localhost:3000';

/**
 * Log in a user and store the token
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} user data or error
 */
export async function login(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();

    // Store token and user info
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.user.id);
    localStorage.setItem('userName', data.user.name);
    localStorage.setItem('userDepartment', data.user.department);

    return data;
  } catch (error) {
    console.log('Error logging in:', error.message);
    return { error: error.message };
  }
}

/**
 * Sign up a new user
 * @param {object} userData - { name, email, department, password }
 * @returns {Promise<object>} success or error
 */
export async function signup(userData) {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error('Signup failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Log out the current user
 */
export function logout() {
  localStorage.clear(); // Clear token and user info
}

/**
 * Get authenticated headers
 * @returns {object} headers with Authorization
 */
export function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

/**
 * Fetch available slots for a given date
 * @param {string} date - in YYYY-MM-DD format
 * @returns {Promise<object>} slots or error
 */
export async function fetchSlotsByDate(date) {
  try {
    const res = await fetch(`${BASE_URL}/bookings/slots?date=${date}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch slots');
    const data = await res.json();
    return data;
  } catch (err) {
    return { error: err.message };
  }
}

/**
 * Book an appointment
 * @param {object} bookingData - { date, slot_time, name, department }
 * @returns {Promise<object>} success or error
 */
export async function bookAppointment({ booking_date, slot_time }) {
  try {
    const res = await fetch(`${BASE_URL}/bookings/book`, {
      method: 'POST',
      headers: getAuthHeaders(), // ✅ includes JWT token
      body: JSON.stringify({ booking_date, slot_time }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to book');
    }
    return await res.json();
  } catch (err) {
    return { error: err.message };
  }
}

/**
 * Cancel an appointment
 * @param {string} bookingId
 * @returns {Promise<object>} success or error
 */
export async function cancelAppointment(bookingId) {
  try {
    const res = await fetch(`${BASE_URL}/bookings/cancel/${bookingId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to cancel');
    }
    return await res.json();
  } catch (err) {
    return { error: err.message };
  }
}