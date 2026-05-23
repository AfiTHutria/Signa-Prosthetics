import { IUserRepository } from '@/domain/repositories/IUserRepository'
import { supabaseClient } from '@/infrastructure/supabase/supabaseClient'

export class SupabaseUserRepository extends IUserRepository {
  async getCurrentUser() {
    if (!supabaseClient) {
      return null
    }

    const { data, error } = await supabaseClient.auth.getUser()

    if (error || !data.user) {
      return null
    }

    return {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name ?? data.user.email,
    }
  }
}
