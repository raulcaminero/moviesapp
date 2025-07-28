import React from 'react';

interface Rating {
  id: number;
  value: number;
  userId: number;
  userName: string; 
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
  refreshMovies: () => void;
}

const getAverage = (ratings: Rating[] = []) =>
  ratings.length
    ? (ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length).toFixed(2)
    : 'None';

const MovieList: React.FC<MovieListProps> = ({ movies, onEdit, onDelete, refreshMovies }) => {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full">
      {movies.map((movie) => (
        <li
          key={movie.id}
          className="bg-white rounded-xl p-8 shadow-lg flex flex-col justify-between relative hover:shadow-2xl h-80 w-96 mx-auto overflow-hidden"
        >
          {/* Card content */}
          <div className="flex flex-col items-start h-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-3 truncate w-full">{movie.title}</h2>
            <p className="text-gray-600 mb-4 text-base overflow-hidden text-ellipsis w-full" style={{maxHeight: '3.5rem'}}>
              {movie.description}
            </p>
            <div className="mb-4 w-full flex flex-wrap items-center">
              <span className="text-yellow-600 font-semibold text-base mr-2">
                Ratings: {getAverage(movie.ratingsList)}
              </span>
              {movie.ratingsList && movie.ratingsList.length > 0 && (
                <span className="text-gray-500 text-sm">
                  ({movie.ratingsList.length} rating{movie.ratingsList.length > 1 ? 's' : ''})
                </span>
              )}
            </div>
            {movie.actors && movie.actors.length > 0 && (
              <div className="mb-2 w-full">
                <span className="font-semibold text-sm text-gray-700">Actors:</span>
                <span className="text-sm text-gray-600 ml-1 truncate w-full">
                  {movie.actors.map(actor => actor.name).join(', ')}
                </span>
              </div>
            )}
          </div>
          {/* Bottom right action buttons */}
          <div className="flex justify-end mt-4">
            <button
              onClick={() => onEdit(movie)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm transition mr-1"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(movie.id)}
              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm transition"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default MovieList;