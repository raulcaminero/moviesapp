import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MovieList from './MovieList';

const movies = [
  {
    id: 1,
    title: 'Test Movie',
    description: 'A test movie',
    ratings: 5,
    actors: [{ id: 1, name: 'Actor 1' }],
    ratingsList: [
      { id: 1, value: 8, userId: 1, userName: 'Alice' },
      { id: 2, value: 7, userId: 2, userName: 'Bob' },
    ],
  },
];

describe('MovieList', () => {
  it('renders movie titles and actors', () => {
    render(
      <MovieList
        movies={movies}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        refreshMovies={jest.fn()}
      />
    );
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText(/Actors:/i)).toBeInTheDocument();
    expect(screen.getByText('Actor 1')).toBeInTheDocument();
  });

  it('shows ratings when Ratings button is clicked', () => {
    render(
      <MovieList
        movies={movies}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        refreshMovies={jest.fn()}
      />
    );
    // Use a regex to match the Ratings button (e.g., "Ratings: 2")
    const ratingsButton = screen.getByRole('button', { name: /Ratings:/i });
    fireEvent.click(ratingsButton);
    expect(screen.getByText('Alice:')).toBeInTheDocument();
    expect(screen.getByText('Bob:')).toBeInTheDocument();
  });

  it('calls onEdit when Edit button is clicked', () => {
    const onEdit = jest.fn();
    render(
      <MovieList
        movies={movies}
        onEdit={onEdit}
        onDelete={jest.fn()}
        refreshMovies={jest.fn()}
      />
    );
    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith(movies[0]);
  });

  it('calls onDelete when Delete button is clicked', () => {
    const onDelete = jest.fn();
    render(
      <MovieList
        movies={movies}
        onEdit={jest.fn()}
        onDelete={onDelete}
        refreshMovies={jest.fn()}
      />
    );
    fireEvent.click(screen.getByText('Delete'));
    expect(onDelete).toHaveBeenCalledWith(movies[0].id);
  });
});