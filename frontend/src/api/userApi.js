import api from './client'

export async function getRegisteredUsers() {
  const { data } = await api.get('/users')

  return data.users
}
