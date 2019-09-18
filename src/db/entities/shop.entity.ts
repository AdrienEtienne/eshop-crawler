import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Region } from 'nintendo-switch-eshop';
import { Price } from './price.entity';

@Entity({ name: 'shops' })
export class Shop extends BaseEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @CreateDateColumn({
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
    type: 'timestamp',
    transformer: {
      from: (value: Date) => value,
      to: (value: Date) =>
        value ? value.toISOString() : new Date().toISOString(),
    },
  })
  updatedAt!: Date;

  @Column('varchar', { length: 2, unique: true })
  code: string;

  @Column('text')
  country: string;

  @Column('varchar')
  currency: string;

  @Column('int2')
  region: Region;

  @OneToMany(type => Price, price => price.shop)
  prices: Price[];
}
