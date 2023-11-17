import { UserRecordModel } from '../models'
import { DBConnection } from '../db'

const userRecordRepository = DBConnection.getRepository(UserRecordModel)

const createUserRecord = async (recordData: Partial<UserRecordModel>): Promise<UserRecordModel> => {
  const record = userRecordRepository.create(recordData)
  return userRecordRepository.save(record)
}

const getUserRecordById = async (id: number): Promise<UserRecordModel | null> => {
  return userRecordRepository.findOneBy({ id })
}

const getUserRecordsByUserId = async (userId: number): Promise<UserRecordModel[]> => {
  return userRecordRepository.find({ where: { userId } })
}

export { createUserRecord, getUserRecordById, getUserRecordsByUserId }
