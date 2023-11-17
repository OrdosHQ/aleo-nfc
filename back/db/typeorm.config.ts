import { config } from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm'

import { UserModel, UserRecordModel } from '../src/models'

config()

const url = process.env.DB_URL
const ca = process.env.CA_CERT

if (!url) {
  throw new Error('Not found env DB_URL')
}

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url,
  synchronize: true,
  entities: [UserModel, UserRecordModel],
  migrations: [],
  ssl: ca ? { ca } : false,
}

const dataSource = new DataSource(dataSourceOptions)

export default dataSource
