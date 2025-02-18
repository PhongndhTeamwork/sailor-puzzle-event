import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_twitter')
export class UserTwitterEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sortindex: number;

  @Column()
  timestamp: number;

  @Column()
  username: string;

  @Column({ name: 'twitter_id' })
  twitterId: string;

  @Column({ name: 'access_token' })
  accessToken: string;

  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @Column({ name: 'name' })
  name: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
