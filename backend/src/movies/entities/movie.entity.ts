import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Actor } from '../../actors/entities/actor.entity';
import { Rating } from '../../ratings/entities/rating.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column('float')
  ratings!: number;

  @ManyToMany(() => Actor, actor => actor.movies, { cascade: true })
  @JoinTable()
  actors!: Actor[];

  @OneToMany(() => Rating, (rating: Rating) => rating.movie, { cascade: true })
  ratingsList!: Rating[];
}