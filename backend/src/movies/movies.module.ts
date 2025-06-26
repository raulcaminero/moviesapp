import { Module } from '@nestjs/common';
import { MoviesController, ActorsController } from './movies.controller';
import { Movie } from './entities/movie.entity';
import { Actor } from '../actors/entities/actor.entity';
import { Rating } from '../ratings/entities/rating.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesService } from './movies.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie, Actor, Rating])
  ],
  controllers: [MoviesController, ActorsController],
  providers: [MoviesService],
})
export class MoviesModule {}