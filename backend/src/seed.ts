import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Movie } from './movies/entities/movie.entity';
import { Actor } from './actors/entities/actor.entity';
import { Rating } from './ratings/entities/rating.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.TYPEORM_PORT ?? '5432', 10),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: [Movie, Actor, Rating],
  synchronize: true, // Don't drop schema, just insert data
});

async function seed() {
  await AppDataSource.initialize();
  const movieRepo = AppDataSource.getRepository(Movie);
  const actorRepo = AppDataSource.getRepository(Actor);
  const ratingRepo = AppDataSource.getRepository(Rating);

  // Seed Actors
  const actorsData = [
    { name: 'Leonardo DiCaprio' },
    { name: 'Keanu Reeves' },
    { name: 'Matthew McConaughey' },
    { name: 'Carrie-Anne Moss' },
    { name: 'Anne Hathaway' },
  ];
  const actors = [];
  for (const data of actorsData) {
    const actor = actorRepo.create(data);
    actors.push(await actorRepo.save(actor));
  }

  // Seed Movies with Actors
  const moviesData = [
    {
      title: 'Inception',
      description: 'A mind-bending thriller',
      ratings: 8.8,
      actors: [actors[0]], // Leonardo DiCaprio
    },
    {
      title: 'The Matrix',
      description: 'A hacker discovers reality',
      ratings: 8.7,
      actors: [actors[1], actors[3]], // Keanu Reeves, Carrie-Anne Moss
    },
    {
      title: 'Interstellar',
      description: 'A journey through space and time',
      ratings: 8.6,
      actors: [actors[0], actors[2], actors[4]], // Leonardo, Matthew, Anne
    },
  ];
  const movies = [];
  for (const data of moviesData) {
    const { actors: movieActors, ...movieFields } = data;
    const movie = movieRepo.create(movieFields);
    movie.actors = movieActors;
    movies.push(await movieRepo.save(movie));
  }

  // Seed Ratings for Movies
  const ratingsData = [
    { value: 9, userName: 'Alice', movie: movies[0] },
    { value: 8, userName: 'Bob', movie: movies[0] },
    { value: 10, userName: 'Charlie', movie: movies[1] },
    { value: 7.5, userName: 'Diana', movie: movies[2] },
  ];
  for (const data of ratingsData) {
    const rating = ratingRepo.create(data);
    await ratingRepo.save(rating);
  }

  // Print out seeded data for verification
  const allMovies = await movieRepo.find({ relations: ['actors', 'ratingsList'] });
  const allActors = await actorRepo.find({ relations: ['movies'] });
  const allRatings = await ratingRepo.find({ relations: ['movie'] });

  console.log('Seeded Movies:', JSON.stringify(allMovies, null, 2));
  console.log('Seeded Actors:', JSON.stringify(allActors, null, 2));
  console.log('Seeded Ratings:', JSON.stringify(allRatings, null, 2));

  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});