import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_discord')
export class UserDiscordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'discord_id',
  })
  discordId: string;

  @Column()
  bot: boolean;

  @Column()
  email: string;

  @Column()
  system: boolean;

  @Column()
  flags: number;

  @Column()
  username: string;

  @Column()
  avatar: string;

  @Column()
  discriminator: string;

  @Column()
  verified: boolean;

  @Column({
    name: 'mfa_enabled',
  })
  mfaEnabled: boolean;

  @Column({
    name: 'created_timestamp',
  })
  createdTimestamp: number;

  @Column({
    name: 'default_avatar_url',
  })
  defaultAvatarURL: string;

  @Column()
  tag: string;

  @Column({
    name: 'avatar_url',
  })
  avatarURL: string;

  @Column({
    name: 'display_avatar_url',
  })
  displayAvatarURL: string;

  @Column({
    name: 'access_token',
  })
  accessToken: string;

  @Column({
    name: 'refresh_token',
  })
  refreshToken: string;

  @Column({
    name: 'expire_time',
  })
  expireTime: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
