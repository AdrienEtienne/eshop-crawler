import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Region } from 'nintendo-switch-eshop';

@Entity({ name: 'shops' })
export class Shop extends BaseEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    readonly: true,
    transformer: {
      from: (value: Date) => value,
      to: (value: Date) =>
        value ? value.toISOString() : new Date().toISOString(),
    },
  })
  createdAt: Date = new Date();

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    transformer: {
      from: (value: Date) => value,
      to: (value: Date) =>
        value ? value.toISOString() : new Date().toISOString(),
    },
  })
  updatedAt!: Date;

  @Column('varchar', { length: 2 })
  code: string;

  @Column('text')
  country: string;

  @Column('varchar')
  currency: string;

  @Column('int2')
  region: Region;
}
