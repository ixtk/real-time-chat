import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
})

export async function getRegisteredUsers() {
  const { data } = await api.get('/users')

  return data.users
}
