import React, { useState } from 'react';
import { fetchWithAuth } from '../utils/fetchWithAuth';

interface Rating {
  id: number;
  value: number;
  userId: number;
  userName: string; // <-- Add userName to Rating
}

interface Actor {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  description: string;
  ratings: number;
  actors?: Actor[];
  ratingsList?: Rating[];
}

interface MovieListProps {
  movies: Movie[];
  onEdit: (movie: Movie) => void;
  onDelete: (id: number) => void;
  refreshMovies: () => void; // Add this prop to refresh the movie list after rating changes
}

const getAverage = (ratings: Rating[] = []) =>
  ratings.length
    ? (ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length).toFixed(2)
    : 'None';

const MovieList: React.FC<MovieListProps> = ({ movies, onEdit, onDelete, refreshMovies }) => {
  const [openRatings, setOpenRatings] = useState<{ [movieId: number]: boolean }>({});
  const [showAddForm, setShowAddForm] = useState<{ [movieId: number]: boolean }>({});
  const [newRating, setNewRating] = useState<{ [movieId: number]: string }>({});
  const [newUserName, setNewUserName] = useState<{ [movieId: number]: string }>({}); // <-- New state for userName

  const toggleRatings = (movieId: number) => {
    setOpenRatings((prev) => ({
      ...prev,
      [movieId]: !prev[movieId],
    }));
  };

  const toggleAddForm = (movieId: number) => {
    setShowAddForm((prev) => ({
      ...prev,
      [movieId]: !prev[movieId],
    }));
  };

  const handleAddRating = async (movieId: number, e: React.FormEvent) => {
    e.preventDefault();
    await fetchWithAuth(`http://localhost:3001/movies/${movieId}/ratings`, {
      method: 'POST',
      data: {
        value: parseFloat(newRating[movieId]), // Allow float
        userName: newUserName[movieId],
      },
    });
    setNewRating((prev) => ({ ...prev, [movieId]: '' }));
    setNewUserName((prev) => ({ ...prev, [movieId]: '' })); // <-- Clear userName state
    setShowAddForm((prev) => ({ ...prev, [movieId]: false }));
    refreshMovies();
  };

  const handleDeleteRating = async (ratingId: number) => {
    await fetchWithAuth(`http://localhost:3001/movies/ratings/${ratingId}`, {
      method: 'DELETE',
    });
    refreshMovies();
  };

  return (
    <ul className="space-y-4">
      {movies.map((movie) => {
        const ratingsOpen = openRatings[movie.id] === true;
        const addFormOpen = showAddForm[movie.id] === true;
        return (
          <li
            key={movie.id}
            className="bg-white rounded-lg p-6 shadow-md flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-xl relative"
          >
            {/* Top-right action buttons */}
            <div className="absolute top-4 right-4 flex space-x-2 z-10">
              <button
                onClick={() => onEdit(movie)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(movie.id)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
              >
                Delete
              </button>
            </div>
            {/* Card content */}
            <div className="w-full">
              <h2 className="text-2xl font-semibold text-gray-800">{movie.title}</h2>
              <p className="text-gray-600 mb-2">{movie.description}</p>
              <div className="mb-2">
                <button
                  className="text-yellow-600 font-medium focus:outline-none"
                  onClick={() => toggleRatings(movie.id)}
                  aria-expanded={ratingsOpen}
                  aria-controls={`ratings-${movie.id}`}
                >
                  Ratings: {getAverage(movie.ratingsList)}
                  {movie.ratingsList && movie.ratingsList.length > 0 && (
                    <span className="text-gray-500 text-sm ml-2">
                      ({movie.ratingsList.length} rating{movie.ratingsList.length > 1 ? 's' : ''})
                    </span>
                  )}
                  <span className="ml-2">
                    {ratingsOpen ? '▲' : '▼'}
                  </span>
                </button>
                <button
                  className="ml-4 text-green-600 font-medium underline"
                  onClick={() => toggleAddForm(movie.id)}
                >
                  {addFormOpen ? 'Cancel' : 'Add Rating'}
                </button>
                {addFormOpen && (
                  <form
                    onSubmit={e => handleAddRating(movie.id, e)}
                    className="flex space-x-2 mt-2"
                  >
                    <input
                      type="number"
                      min={0}
                      max={10}
                      step={0.1} // Allow floats again
                      value={newRating[movie.id] || ''}
                      onChange={e =>
                        setNewRating(prev => ({ ...prev, [movie.id]: e.target.value }))
                      }
                      className="border p-2"
                      placeholder="Rating"
                      required
                    />
                    <input
                      type="text"
                      value={newUserName[movie.id] || ''}
                      onChange={e =>
                        setNewUserName(prev => ({ ...prev, [movie.id]: e.target.value }))
                      }
                      className="border p-2"
                      placeholder="User Name"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Add
                    </button>
                  </form>
                )}
                {movie.ratingsList && movie.ratingsList.length > 0 && ratingsOpen && (
                  <ul
                    id={`ratings-${movie.id}`}
                    className="mt-2 mb-2 text-gray-700 text-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4"
                  >
                    {movie.ratingsList.map(rating => (
                      <li key={rating.id} className="flex items-center py-1">
                        <span>
                          {rating.userName}: <span className="font-semibold">{rating.value}</span>
                        </span>
                        <button
                          type="button"
                          className="ml-6 bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded transition flex items-center justify-center"
                          onClick={() => handleDeleteRating(rating.id)}
                          title="Delete rating"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-7 0h10"
                            />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {movie.actors && movie.actors.length > 0 && (
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Actors:</span>{' '}
                  {movie.actors.map(actor => actor.name).join(', ')}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default MovieList;