import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('wallets')
export class WalletEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'address' })
  address: string;

  @Column({ name: 'format_address' })
  formatAddress: string;

  @Column({ name: 'private_key' })
  privateKey: string;

  @Column({ name: 'public_key' })
  publicKey: string;

  @Column({ name: 'balance' })
  balance: string;

  @Column({ name: 'status' })
  status: number;

  @Column({ name: 'network' })
  network: number;

  @Column({ name: 'type' })
  type: number;

  @Column({ name: 'note' })
  note: string;

  @Column({ name: 'deploy_tx' })
  deployTx: string;

  @Column({ name: 'map_id' })
  mapId: number;

  @Column({ name: 'event' })
  event: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
