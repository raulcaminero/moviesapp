import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from './entities/rating.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
  ) {}

  async getAllRatings(): Promise<Rating[]> {
    return this.ratingsRepository.find({ relations: ['movie'] });
  }

  async getRatingById(id: number): Promise<Rating> {
    const rating = await this.ratingsRepository.findOne({ where: { id }, relations: ['movie'] });
    if (!rating) {
      throw new Error(`Rating with id ${id} not found.`);
    }
    return rating;
  }

  async createRating(ratingData: Partial<Rating>): Promise<Rating> {
    const rating = this.ratingsRepository.create(ratingData);
    return this.ratingsRepository.save(rating);
  }

  async updateRating(id: number, ratingData: Partial<Rating>): Promise<Rating> {
    await this.ratingsRepository.update(id, ratingData);
    return this.getRatingById(id);
  }

  async deleteRating(id: number): Promise<void> {
    await this.ratingsRepository.delete(id);
  }
}
