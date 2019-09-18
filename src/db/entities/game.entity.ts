import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { kebabCase, merge } from 'lodash';
import { Price } from './price.entity';

@Entity({ name: 'games' })
export class Game extends BaseEntity {
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

  @Column('text')
  title: string;
  @Column('text', { unique: true })
  titleSlug: string;

  // Id
  @Column('text', { nullable: true })
  euId: string | null;
  @Column('text', { nullable: true })
  americaId: string | null;
  @Column('text', { nullable: true })
  jpId: string | null;

  // Description
  @Column('text', { nullable: true })
  description: string | null;
  @Column('text', { nullable: true })
  descriptionShort: string | null;

  // Release date
  @Column('text', { nullable: true })
  euReleaseDate: string | null;
  @Column('text', { nullable: true })
  americaReleaseDate: string | null;
  @Column('text', { nullable: true })
  jpReleaseDate: string | null;

  // URL
  @Column('text', { nullable: true })
  euUrl: string | null;
  @Column('text', { nullable: true })
  euImageUrl: string | null;
  @Column('text', { nullable: true })
  americaUrl: string | null;
  @Column('text', { nullable: true })
  japanUrl: string | null;

  @OneToMany(type => Price, price => price.game)
  prices: Price[];

  update(data: Partial<Game>) {
    merge(this, data);
    return this;
  }

  static createOne(title: string) {
    const result = new Game();
    result.title = title;
    result.titleSlug = Game.titleSlug(title);
    return result;
  }

  static titleSlug(title: string) {
    let tmp = title.replace(/™/, '');
    tmp = tmp.replace(/®/, '');
    tmp = tmp.replace('UNO® for Nintendo Switch', 'UNO');

    return kebabCase(tmp).toLowerCase();
  }
}
