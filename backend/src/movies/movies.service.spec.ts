import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Actor } from '../actors/entities/actor.entity';
import { Rating } from '../ratings/entities/rating.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { describe, beforeEach, it, expect, jest } from '@jest/globals';


describe('MoviesService', () => {
  let service: MoviesService;
  let movieRepo: Repository<Movie>;
  let actorRepo: Repository<Actor>;
  let ratingRepo: Repository<Rating>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: getRepositoryToken(Movie), useClass: Repository },
        { provide: getRepositoryToken(Actor), useClass: Repository },
        { provide: getRepositoryToken(Rating), useClass: Repository },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    movieRepo = module.get<Repository<Movie>>(getRepositoryToken(Movie));
    actorRepo = module.get<Repository<Actor>>(getRepositoryToken(Actor));
    ratingRepo = module.get<Repository<Rating>>(getRepositoryToken(Rating));
    service['actorsRepository'] = actorRepo;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findAll on the repository', async () => {
    const findSpy = jest.spyOn(movieRepo, 'find').mockResolvedValue([]);
    await service.findAll();
    expect(findSpy).toHaveBeenCalledWith({ relations: ['actors', 'ratingsList'] });
  });

  it('should create a movie', async () => {
    const createSpy = jest.spyOn(movieRepo, 'create').mockReturnValue({ title: 'Test', description: 'Desc', ratings: 5, actors: [] } as any);
    const saveSpy = jest.spyOn(movieRepo, 'save').mockResolvedValue({ id: 1, title: 'Test', description: 'Desc', ratings: 5, actors: [] } as any);
    jest.spyOn(actorRepo, 'find').mockResolvedValue([]); // <-- Add this line

    const result = await service.create({ title: 'Test', description: 'Desc', ratings: 5, actors: [] });
    expect(createSpy).toHaveBeenCalledWith({ title: 'Test', description: 'Desc', ratings: 5 });
    expect(saveSpy).toHaveBeenCalled();
    expect(result).toEqual({ id: 1, title: 'Test', description: 'Desc', ratings: 5, actors: [] });
  });

  it('should find a movie by id', async () => {
    const movie = { id: 1, title: 'Test', description: 'Desc', ratings: 5 } as Movie;
    jest.spyOn(movieRepo, 'findOne').mockResolvedValue(movie);
    const result = await service.findById(1);
    expect(result).toBe(movie);
  });

  it('should throw NotFoundException if movie not found by id', async () => {
    jest.spyOn(movieRepo, 'findOne').mockResolvedValue(null);
    await expect(service.findById(1)).rejects.toThrow(NotFoundException);
  });

  it('should search movies by title', async () => {
    const movies = [{ id: 1, title: 'Test', description: 'Desc', ratings: 5 } as Movie];
    const findSpy = jest.spyOn(movieRepo, 'find').mockResolvedValue(movies);
    const result = await service.searchMovies('Test');
    expect(findSpy).toHaveBeenCalled();
    expect(result).toBe(movies);
  });

  it('should update a movie', async () => {
    const movie = { id: 1, title: 'Old', description: 'Old', ratings: 1, actors: [], ratingsList: [] } as Movie;
    jest.spyOn(movieRepo, 'findOne').mockResolvedValue(movie);
    jest.spyOn(actorRepo, 'find').mockResolvedValue([]);
    jest.spyOn(movieRepo, 'save').mockResolvedValue({ ...movie, title: 'New', description: 'New', ratings: 10 } as Movie);

    const result = await service.update(1, { title: 'New', description: 'New', ratings: 10, actors: [] });
    expect(result.title).toBe('New');
    expect(result.ratings).toBe(10);
  });

  it('should throw NotFoundException if movie not found on update', async () => {
    jest.spyOn(movieRepo, 'findOne').mockResolvedValue(null);
    await expect(service.update(1, { title: '', description: '', ratings: 0, actors: [] })).rejects.toThrow(NotFoundException);
  });

  it('should delete a movie', async () => {
    jest.spyOn(movieRepo, 'findOneBy').mockResolvedValue({ id: 1 } as Movie);
    jest.spyOn(ratingRepo, 'delete').mockResolvedValue({} as any);
    jest.spyOn(movieRepo, 'delete').mockResolvedValue({} as any);
    const result = await service.delete(1);
    expect(result).toEqual({ deleted: true });
  });

  it('should throw NotFoundException if movie not found on delete', async () => {
    jest.spyOn(movieRepo, 'findOneBy').mockResolvedValue(null);
    await expect(service.delete(1)).rejects.toThrow(NotFoundException);
  });

  it('should find all actors', async () => {
    const actors = [{ id: 1, name: 'Actor', movies: [] } as Actor];
    jest.spyOn(actorRepo, 'find').mockResolvedValue(actors);
    const result = await service.findAllActors();
    expect(result).toBe(actors);
  });

  it('should find actor by id', async () => {
    const actor = { id: 1, name: 'Actor', movies: [] } as Actor;
    jest.spyOn(actorRepo, 'findOne').mockResolvedValue(actor);
    const result = await service.findActorById(1);
    expect(result).toBe(actor);
  });

  it('should throw NotFoundException if actor not found by id', async () => {
    jest.spyOn(actorRepo, 'findOne').mockResolvedValue(null);
    await expect(service.findActorById(1)).rejects.toThrow(NotFoundException);
  });

  it('should create an actor', async () => {
    const createSpy = jest.spyOn(actorRepo, 'create').mockReturnValue({ name: 'Actor' } as any);
    const saveSpy = jest.spyOn(actorRepo, 'save').mockResolvedValue({ id: 1, name: 'Actor' } as any);
    const result = await service.createActor({ name: 'Actor' });
    expect(createSpy).toHaveBeenCalledWith({ name: 'Actor' });
    expect(saveSpy).toHaveBeenCalled();
    expect(result).toEqual({ id: 1, name: 'Actor' });
  });

  it('should update an actor', async () => {
    const actor = { id: 1, name: 'Old' } as Actor;
    jest.spyOn(actorRepo, 'findOneBy').mockResolvedValue(actor);
    jest.spyOn(actorRepo, 'save').mockResolvedValue({ ...actor, name: 'New' } as Actor);
    const result = await service.updateActor(1, { name: 'New' });
    expect(result.name).toBe('New');
  });

  it('should throw NotFoundException if actor not found on update', async () => {
    jest.spyOn(actorRepo, 'findOneBy').mockResolvedValue(null);
    await expect(service.updateActor(1, { name: 'New' })).rejects.toThrow(NotFoundException);
  });

  it('should delete an actor', async () => {
    jest.spyOn(actorRepo, 'delete').mockResolvedValue({ affected: 1 } as any);
    const result = await service.deleteActor(1);
    expect(result).toEqual({ deleted: true });
  });

  it('should throw NotFoundException if actor not found on delete', async () => {
    jest.spyOn(actorRepo, 'delete').mockResolvedValue({ affected: 0 } as any);
    await expect(service.deleteActor(1)).rejects.toThrow(NotFoundException);
  });

  it('should get actors in a movie', async () => {
    const movie = { id: 1, actors: [{ id: 1, name: 'Actor' }] } as Movie;
    jest.spyOn(movieRepo, 'findOne').mockResolvedValue(movie);
    const result = await service.getActorsInMovie(1);
    expect(result).toBe(movie.actors);
  });

  it('should return empty array if movie not found in getActorsInMovie', async () => {
    jest.spyOn(movieRepo, 'findOne').mockResolvedValue(null);
    const result = await service.getActorsInMovie(1);
    expect(result).toEqual([]);
  });

  it('should get movies for an actor', async () => {
    const actor = { id: 1, movies: [{ id: 1, title: 'Movie' }] } as Actor;
    jest.spyOn(actorRepo, 'findOne').mockResolvedValue(actor);
    const result = await service.getMoviesForActor(1);
    expect(result).toBe(actor.movies);
  });

  it('should return empty array if actor not found in getMoviesForActor', async () => {
    jest.spyOn(actorRepo, 'findOne').mockResolvedValue(null);
    const result = await service.getMoviesForActor(1);
    expect(result).toEqual([]);
  });

  it('should search actors by name', async () => {
    const actors = [{ id: 1, name: 'Actor', movies: [] } as Actor];
    const findSpy = jest.spyOn(actorRepo, 'find').mockResolvedValue(actors);
    const result = await service.searchActors('Actor');
    expect(findSpy).toHaveBeenCalled();
    expect(result).toBe(actors);
  });

  it('should get ratings for a movie', async () => {
    const movie = { id: 1, ratingsList: [{ id: 1, value: 9, userName: 'Alice' }] } as Movie;
    jest.spyOn(movieRepo, 'findOne').mockResolvedValue(movie);
    const result = await service.getRatingsForMovie(1);
    expect(result).toBe(movie.ratingsList);
  });

  it('should throw NotFoundException if movie not found in getRatingsForMovie', async () => {
    jest.spyOn(movieRepo, 'findOne').mockResolvedValue(null);
    await expect(service.getRatingsForMovie(1)).rejects.toThrow(NotFoundException);
  });

  it('should add a rating to a movie', async () => {
    const movie = { id: 1, title: 'Test', description: 'Test description', ratings: 0, actors: [], ratingsList: [] } as Movie;
    jest.spyOn(movieRepo, 'findOne').mockResolvedValue(movie);
    const createSpy = jest.spyOn(ratingRepo, 'create').mockReturnValue({ value: 9, userName: 'Alice', movie } as any);
    const saveSpy = jest.spyOn(ratingRepo, 'save').mockResolvedValue({ id: 1, value: 9, userName: 'Alice', movie } as any);

    const result = await service.addRating(1, { value: 9, userName: 'Alice' });
    expect(createSpy).toHaveBeenCalledWith({ value: 9, userName: 'Alice', movie });
    expect(saveSpy).toHaveBeenCalled();
    expect(result).toEqual({ id: 1, value: 9, userName: 'Alice', movie });
  });

  it('should throw NotFoundException if movie not found in addRating', async () => {
    jest.spyOn(movieRepo, 'findOne').mockResolvedValue(null);
    await expect(service.addRating(1, { value: 9, userName: 'Alice' })).rejects.toThrow(NotFoundException);
  });

  it('should delete a rating', async () => {
    const deleteSpy = jest.spyOn(ratingRepo, 'delete').mockResolvedValue({} as any);
    await service.deleteRating(1);
    expect(deleteSpy).toHaveBeenCalledWith(1);
  });
});