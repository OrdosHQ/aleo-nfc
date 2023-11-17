import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { UserModel } from './user.model'

@Entity({ name: 'user_record' })
export class UserRecordModel {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number

  @Column({ name: 'record_id' })
  recordId!: string

  @Column({ name: 'checksum' })
  checksum!: string

  @Column({ name: 'value' })
  value!: string

  @Column({ name: 'user_id' })
  userId!: number

  @ManyToOne(() => UserModel, (user) => user.records)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user!: UserModel[]

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt!: Date
}
