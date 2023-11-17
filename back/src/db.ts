import DBConnection from '../db/typeorm.config'

export const StartDB = async (): Promise<void> => {
  await DBConnection.initialize()
    .then(() => {
      console.log(`DB has been initialized`)
    })
    .catch((err) => {
      console.error(`DB initialization error`, err)
      return process.exit(1)
    })
}

export { DBConnection }
