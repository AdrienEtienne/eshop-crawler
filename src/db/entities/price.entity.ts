import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  Unique,
} from 'typeorm';
import { Game } from './game.entity';
import { Shop } from './shop.entity';

@Entity({ name: 'prices' })
@Unique(['game', 'shop'])
export class Price extends BaseEntity {
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

  @Column('text', { name: 'gameId' })
  gameId: string;
  @ManyToOne(type => Game, game => game.prices, { nullable: false })
  game: Game;

  @Column('text', { name: 'shopId' })
  shopId: string;
  @ManyToOne(type => Shop, shop => shop.prices, { nullable: false })
  shop: Shop;

  @Column('text')
  currency: string;

  @Column('text')
  amount: string;

  @Column('real')
  amountValue: number;

  @Column('bool', { default: false })
  onSale: boolean;

  @Column('text', { nullable: true })
  discountAmount: string | null;

  @Column('real', { nullable: true })
  discountAmountValue: number | null;
}
