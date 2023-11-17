import { DBConnection } from '../db'
import { UserModel } from '../models'

const userRepository = DBConnection.getRepository(UserModel)

const createUser = async (userData: Partial<UserModel>): Promise<UserModel> => {
  const user = userRepository.create(userData)
  return userRepository.save(user)
}

const getUserById = async (id: number): Promise<UserModel | null> => {
  return userRepository.findOneBy({ id })
}

const getUserByTwitterId = async (twitterId: string): Promise<UserModel | null> => {
  return userRepository.findOneBy({ twitterId })
}

export { createUser, getUserById, getUserByTwitterId }
