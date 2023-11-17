import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { UserRecordModel } from './record.model'

@Entity({ name: 'user_model' })
export class UserModel {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number

  @Column({ name: 'twitter_id', unique: true })
  twitterId!: string

  @Column({ name: 'photo_url' })
  photoUrl!: string

  @Column({ name: 'username' })
  username!: string

  @Column({ name: 'display_name' })
  displayName!: string

  @OneToMany(() => UserRecordModel, (records) => records.user)
  records!: UserRecordModel[]

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt!: Date
}
