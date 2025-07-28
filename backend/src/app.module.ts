import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesModule } from './movies/movies.module';
import { Movie } from './movies/entities/movie.entity';
import { RatingsModule } from './ratings/ratings.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TYPEORM_HOST,
      port: parseInt(process.env.TYPEORM_PORT ?? '5432', 10),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [Movie],
      synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
      autoLoadEntities: true,
    }),
    MoviesModule,
    RatingsModule, // <-- Only import the module!
  ],
  // Remove these lines:
  // controllers: [RatingsController],
  // providers: [RatingsService],
})
export class AppModule {}