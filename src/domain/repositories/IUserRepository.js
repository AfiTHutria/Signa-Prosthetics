/**
 * Puerto del dominio para acceso a usuarios.
 * Las implementaciones viven en infrastructure/repositories.
 */
export class IUserRepository {
  async getCurrentUser() {
    throw new Error('IUserRepository.getCurrentUser must be implemented')
  }
}
