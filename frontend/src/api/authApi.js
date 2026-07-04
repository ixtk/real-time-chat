import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
})

export async function registerUser(credentials) {
  const { data } = await api.post('/auth/register', credentials)

  return data.user
}

export async function loginUser(credentials) {
  const { data } = await api.post('/auth/login', credentials)

  return data.user
}

export async function getCurrentUser() {
  const { data } = await api.get('/auth/me')

  return data.user
}

export async function logoutUser() {
  await api.post('/auth/logout')
}
