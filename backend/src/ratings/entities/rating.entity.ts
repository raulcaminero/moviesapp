import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('float')
  value!: number;

  @Column()
  userName!: string; // Keep only userName

  @ManyToOne(() => Movie, movie => movie.ratingsList, { onDelete: 'CASCADE' })
  movie!: Movie;
}