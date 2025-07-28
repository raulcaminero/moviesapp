import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { Rating } from './entities/rating.entity';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Get()
  async getAllRatings(): Promise<Rating[]> {
    return this.ratingsService.getAllRatings();
  }

  @Get(':id')
  async getRatingById(@Param('id') id: number): Promise<Rating> {
    return this.ratingsService.getRatingById(id);
  }

  @Post()
  async createRating(@Body() ratingData: Partial<Rating>): Promise<Rating> {
    return this.ratingsService.createRating(ratingData);
  }

  @Put(':id')
  async updateRating(@Param('id') id: number, @Body() ratingData: Partial<Rating>): Promise<Rating> {
    return this.ratingsService.updateRating(id, ratingData);
  }

  @Delete(':id')
  async deleteRating(@Param('id') id: number): Promise<void> {
    return this.ratingsService.deleteRating(id);
  }
}
