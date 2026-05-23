export class IUserRepository {
  async getCurrentUser() {
    throw new Error('IUserRepository.getCurrentUser must be implemented')
  }
}
