import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('accounts')
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_name' })
  userName: string;

  @Column({ name: 'root_address' })
  rootAddress: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'avatar' })
  avatar: string;

  @Column({ name: 'discord_uid' })
  discordUid: string;

  @Column({ name: 'discord_username' })
  discordUsername: string;

  @Column({ name: 'twitter_name' })
  twitterName: string;

  @Column({ name: 'twitter_username' })
  twitterUsername: string;

  @Column({ name: 'twitter_uid' })
  twitterUid: string;

  @Column({ name: 'telegram_url' })
  telegramUrl: string;

  @Column({ name: 'telegram_uid' })
  telegramUid: string;

  @Column({ name: 'telegram_username' })
  telegramUsername: string;

  @Column({ name: 'ip_address' })
  ipAddress: string;

  @Column({ name: 'invite_code' })
  inviteCode: string;

  @Column({ name: 'referral_code' })
  referralCode: string;

  @Column({
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
  })
  updatedAt: Date;
}
