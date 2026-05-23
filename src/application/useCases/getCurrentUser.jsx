import { User } from '@/domain/entities/User'

export async function getCurrentUser(userRepository) {
  const data = await userRepository.getCurrentUser()
  if (!data) return null
  return new User(data)
}
