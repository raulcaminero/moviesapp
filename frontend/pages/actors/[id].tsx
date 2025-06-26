import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/actors';

const ActorMoviesPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [movies, setMovies] = useState([]);
  const [actor, setActor] = useState(null);

  useEffect(() => {
    if (!id) return;
    axios.get(`${API_URL}/${id}/movies`).then(res => setMovies(res.data));
    axios.get(`${API_URL}/${id}`).then(res => setActor(res.data));
  }, [id]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Movies for Actor: {actor?.name || '...'}
      </h1>
      <ul>
        {movies.map(movie => (
          <li key={movie.id}>
            {movie.title}
            {/* Add a button to view actors in this movie */}
            <button
              className="ml-2 text-blue-600 underline"
              onClick={() => window.location.href = `/movies/${movie.id}`}
            >
              View Actors
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActorMoviesPage;