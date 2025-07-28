import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, In } from 'typeorm';
import { Movie } from '../movies/entities/movie.entity';
import { Actor } from '../actors/entities/actor.entity';
import { Rating } from '../ratings/entities/rating.entity';
import { CreateActorDto } from '../actors/dtos/actor.dto';
import { CreateRatingDto } from '../ratings/dtos/rating.dto';
import { CreateMovieDto } from './dtos/movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    @InjectRepository(Actor)
    private actorsRepository: Repository<Actor>,
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
  ) {}

  // --- MOVIES CRUD ---

  async findAll(): Promise<Movie[]> {
    return this.moviesRepository.find({ relations: ['actors', 'ratingsList'] });
  }

  async findById(id: number): Promise<Movie> {
    const movie = await this.moviesRepository.findOne({
      where: { id },
      relations: ['actors', 'ratingsList'],
    });
    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }

  async searchMovies(title: string): Promise<Movie[]> {
    return this.moviesRepository.find({
      where: { title: ILike(`%${title}%`) },
      relations: ['actors', 'ratingsList'],
    });
  }

  async searchActors(name: string): Promise<Actor[]> {
    return this.actorsRepository.find({
      where: { name: ILike(`%${name}%`) },
      relations: ['movies'],
    });
  }

  async getActorsInMovie(movieId: number): Promise<Actor[]> {
    const movie = await this.moviesRepository.findOne({
      where: { id: movieId },
      relations: ['actors'],
    });
    return movie ? movie.actors : [];
  }

  async getMoviesForActor(actorId: number): Promise<Movie[]> {
    const actor = await this.actorsRepository.findOne({
      where: { id: actorId },
      relations: ['movies'],
    });
    return actor ? actor.movies : [];
  }

  async create(movieData: CreateMovieDto): Promise<Movie> {
    const { actors, ...rest } = movieData;
    const movie = this.moviesRepository.create(rest);

    // Fetch actors by IDs and assign to movie
    if (actors && Array.isArray(actors)) {
      const actorIds = actors.map(id => typeof id === 'string' ? parseInt(id, 10) : id);
      const actorEntities = await this.actorsRepository.find({
        where: { id: In(actorIds) }
      });
      movie.actors = actorEntities;
    }

    return this.moviesRepository.save(movie);
  }

  async update(
    id: number,
    movieData: { title: string; description: string; ratings: number; actors: string[] }
  ): Promise<Movie> {
    const movie = await this.moviesRepository.findOne({
      where: { id },
      relations: ['actors', 'ratingsList'],
    });
    if (!movie) throw new NotFoundException('Movie not found');

    movie.title = movieData.title;
    movie.description = movieData.description;
    movie.ratings = movieData.ratings;

    // Convert actor IDs to Actor entities
    if (movieData.actors) {
      const actorIds = movieData.actors.map(id => typeof id === 'string' ? parseInt(id, 10) : id);
      const actors = await this.actorsRepository.find({
        where: { id: In(actorIds) }
      });
      movie.actors = actors;
    }

    return this.moviesRepository.save(movie);
  }

  async delete(id: number): Promise<{ deleted: boolean }> {
    const movie = await this.moviesRepository.findOneBy({ id });
    if (!movie) throw new NotFoundException('Movie not found');
    // Delete ratings first
    await this.ratingsRepository.delete({ movie: { id } });
    const result = await this.moviesRepository.delete(id);
    return { deleted: true };
  }

  // --- ACTORS CRUD ---

  async findAllActors(): Promise<Actor[]> {
    return this.actorsRepository.find({ relations: ['movies'] });
  }

  async findActorById(id: number): Promise<Actor> {
    const actor = await this.actorsRepository.findOne({
      where: { id },
      relations: ['movies'],
    });
    if (!actor) throw new NotFoundException('Actor not found');
    return actor;
  }

  async createActor(actorDto: CreateActorDto): Promise<Actor> {
    const actor = this.actorsRepository.create(actorDto);
    return this.actorsRepository.save(actor);
  }

  async updateActor(id: number, actorDto: CreateActorDto): Promise<Actor> {
    const actor = await this.actorsRepository.findOneBy({ id });
    if (!actor) throw new NotFoundException('Actor not found');
    Object.assign(actor, actorDto);
    return this.actorsRepository.save(actor);
  }

  async deleteActor(id: number): Promise<{ deleted: boolean }> {
    const result = await this.actorsRepository.delete(id);
    if (result.affected !== 1) throw new NotFoundException('Actor not found');
    return { deleted: true };
  }

  // --- RATINGS CRUD ---

  async getRatingsForMovie(movieId: number): Promise<Rating[]> {
    const movie = await this.moviesRepository.findOne({
      where: { id: movieId },
      relations: ['ratingsList'],
    });
    if (!movie) throw new NotFoundException('Movie not found');
    return movie.ratingsList;
  }

  async addRating(movieId: number, ratingDto: CreateRatingDto): Promise<Rating> {
    const movie = await this.moviesRepository.findOne({
      where: { id: movieId },
      relations: ['ratingsList'],
    });
    if (!movie) throw new NotFoundException('Movie not found');
    const rating = this.ratingsRepository.create({ ...ratingDto, movie });
    return this.ratingsRepository.save(rating);
  }

  async deleteRating(id: number): Promise<void> {
    await this.ratingsRepository.delete(id);
  }

  async getAllRatings(): Promise<Rating[]> {
    console.log('asdfasfasdf');
    return this.ratingsRepository.find({ relations: ['movie'] });
  }
}