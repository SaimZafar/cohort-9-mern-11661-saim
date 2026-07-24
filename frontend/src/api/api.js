const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
// Reads the saved token (if any) and builds request options with the
// Authorization header automatically attached. Every function below
// funnels through this so we only write the auth-header logic once.
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    // Backend always sends { success: false, message: '...' } on errors
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// ---- Auth ----

export function signup(name, email, password) {
  return apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export function login(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// ---- Notes ----

export function getNotes() {
  return apiRequest('/notes');
}

export function getNote(id) {
  return apiRequest(`/notes/${id}`);
}

export function createNote(title, content) {
  return apiRequest('/notes', {
    method: 'POST',
    body: JSON.stringify({ title, content }),
  });
}

export function updateNote(id, title, content) {
  return apiRequest(`/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, content }),
  });
}

export function deleteNote(id) {
  return apiRequest(`/notes/${id}`, {
    method: 'DELETE',
  });
}