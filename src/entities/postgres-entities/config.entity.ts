import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('config')
export class ConfigEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'key_config' })
  keyConfig: string;

  @Column({ name: 'value_config' })
  valueConfig: string;

  @Column({
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
  })
  updatedAt: Date;
}
