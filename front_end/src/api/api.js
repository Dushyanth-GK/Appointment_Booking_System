const BASE_URL = 'http://localhost:3000';

/**
 * Log in a user and store the token
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} user data or error
 */
export async function login(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
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
    const response = await fetch(`${BASE_URL}/signup`, {
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
 * Fetch data (e.g. appointments) for a specific date
 * @param {string} date - Format: YYYY-MM-DD
 * @returns {Promise<object>} data or error
 */
export async function fetchDataByDate(date) {
  try {
    const response = await fetch(`http://localhost:3000/data?date=${date}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Book an appointment
 * @param {object} bookingData - { date, startTime, name, department }
 * @returns {Promise<object>} success or error
 */
export async function bookAppointment(bookingData) {
  try {
    const response = await fetch(`http://localhost:3000/book`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData)
    });

    if (!response.ok) {
      throw new Error('Booking failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Cancel an appointment
 * @param {number|string} appointmentId
 * @returns {Promise<object>} success or error
 */
export async function cancelAppointment(appointmentId) {
  try {
    const response = await fetch(`http://localhost:3000/cancel/${appointmentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Cancellation failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message };
  }
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