const API_BASE = '/.netlify/functions';

export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE}/auth-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
};

export const signupUser = async (name: string, email: string, password: string) => {
  const response = await fetch(`${API_BASE}/auth-signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Signup failed');
  }

  return response.json();
};

export const getCases = async (userId: string) => {
  const response = await fetch(`${API_BASE}/get-cases?userId=${userId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch cases');
  }

  return response.json();
};
