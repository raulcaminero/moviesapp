import {
  Body, Controller, Get, Post, Put, Delete, Param, Query,
  UseGuards, UsePipes, ValidationPipe, NotFoundException, BadRequestException
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { Actor } from '../actors/entities/actor.entity';
import { Rating } from '../ratings/entities/rating.entity';
import { ApiKeyGuard } from '../common/api-key.guard';
import { CreateMovieDto } from './dtos/movie.dto';
import { CreateActorDto } from '../actors/dtos/actor.dto';
import { CreateRatingDto } from '../ratings/dtos/rating.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async getAllMovies(): Promise<Movie[]> {
    return this.moviesService.findAll();
  }

  @Get('search')
  async searchMovies(@Query('query') query: string): Promise<Movie[]> {
    return this.moviesService.searchMovies(query);
  }

  @Get(':id/actors')
  async getActorsInMovie(@Param('id') id: number): Promise<Actor[]> {
    console.log('666666');

    const actors = await this.moviesService.getActorsInMovie(Number(id));
    if (!actors) throw new NotFoundException('Movie not found');
    return actors;
  }

  @Get(':id')
  async getMovieById(@Param('id') id: number): Promise<Movie> {
    console.log('7777777');
    const movie = await this.moviesService.findById(Number(id));
    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }

  // CREATE
  @Post()
  @UseGuards(ApiKeyGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createMovie(@Body() movie: CreateMovieDto): Promise<Movie> {
    try {
      return await this.moviesService.create(movie); // <-- Pass the full object, including actors
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  // UPDATE
  @Put(':id')
  @UseGuards(ApiKeyGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateMovie(
    @Param('id') id: number,
    @Body() movie: CreateMovieDto
  ): Promise<Movie> {
    const updated = await this.moviesService.update(Number(id), movie);
    console.log('888888');

    if (!updated) throw new NotFoundException('Movie not found');
    return updated;
  }

  // DELETE
  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  async deleteMovie(@Param('id') id: number): Promise<{ deleted: boolean }> {
    console.log('9999999');
    const result = await this.moviesService.delete(Number(id));
    if (!result.deleted) throw new NotFoundException('Movie not found');
    return result;
  }

  // --- RATINGS ENDPOINTS ---

  @Get(':id/ratings')
  async getRatingsForMovie(@Param('id') id: number): Promise<Rating[]> {
    const ratings = await this.moviesService.getRatingsForMovie(Number(id));
    if (!ratings) throw new NotFoundException('Movie not found');
    return ratings;
  }

  @Post(':id/ratings')
  @UseGuards(ApiKeyGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async addRating(
    @Param('id') id: number,
    @Body() ratingDto: CreateRatingDto
  ): Promise<Rating> {
    try {
      console.log('asdf88888888888888asdf');
      return await this.moviesService.addRating(Number(id), ratingDto);
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  @Delete('ratings/:ratingId')
  @UseGuards(ApiKeyGuard)
  async deleteRating(@Param('ratingId') ratingId: number) {
    console.log('555555');

    await this.moviesService.deleteRating(Number(ratingId));
    return { deleted: true };
  }

  @Get('ratings')
  async getAllRatings(): Promise<Rating[]> {
    console.log('123123123');
    return this.moviesService.getAllRatings();
  }
}

@Controller('actors')
export class ActorsController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async getAllActors(): Promise<Actor[]> {
    return this.moviesService.findAllActors();
  }

  @Get('search')
  async searchActors(@Query('query') query: string): Promise<Actor[]> {
    return this.moviesService.searchActors(query);
  }

  @Get(':id/movies')
  async getMoviesForActor(@Param('id') id: number): Promise<Movie[]> {
    return this.moviesService.getMoviesForActor(Number(id));
  }

  @Get(':id')
  async getActorById(@Param('id') id: number): Promise<Actor> {

    console.log('101010101010101');
    const actor = await this.moviesService.findActorById(Number(id));
    if (!actor) throw new NotFoundException('Actor not found');
    return actor;
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createActor(@Body() actorDto: CreateActorDto): Promise<Actor> {
    try {
      return await this.moviesService.createActor(actorDto);
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  @Put(':id')
  @UseGuards(ApiKeyGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateActor(
    @Param('id') id: number,
    @Body() actorDto: CreateActorDto
  ): Promise<Actor> {
    console.log('565656565656');
    const updated = await this.moviesService.updateActor(Number(id), actorDto);
    if (!updated) throw new NotFoundException('Actor not found');
    return updated;
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  async deleteActor(@Param('id') id: number): Promise<{ deleted: boolean }> {
    const result = await this.moviesService.deleteActor(Number(id));
    if (!result.deleted) throw new NotFoundException('Actor not found');
    return result;
  }
}