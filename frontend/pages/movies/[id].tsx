import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/movies';

const MovieActorsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [actors, setActors] = useState([]);
  const [movie, setMovie] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [newRating, setNewRating] = useState('');
  const [newUserName, setNewUserName] = useState(''); // 1. Add state

  useEffect(() => {
    if (!id) return;
    axios.get(`${API_URL}/${id}/actors`).then(res => setActors(res.data));
    axios.get(`${API_URL}/${id}`).then(res => setMovie(res.data));
    axios.get(`${API_URL}/${id}/ratings`).then(res => setRatings(res.data));
  }, [id]);

  const handleAddRating = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/${id}/ratings`, {
      value: Number(newRating),
      userName: newUserName, // 3. Send userName
    });
    setNewRating('');
    setNewUserName('');
    axios.get(`${API_URL}/${id}/ratings`).then(res => setRatings(res.data));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Actors in Movie: {movie?.title || '...'}
      </h1>
      <ul>
        {actors.map(actor => (
          <li key={actor.id}>{actor.name}</li>
        ))}
      </ul>
      <h2 className="text-xl font-bold mt-6">Ratings</h2>
      <ul>
        {ratings.map(rating => (
          <li key={rating.id}>
            {rating.userName}: Value: {rating.value}
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddRating} className="mt-2 flex flex-col sm:flex-row items-center gap-2">
        <input
          type="number"
          min={0}
          max={10}
          step={0.1}
          value={newRating}
          onChange={e => setNewRating(e.target.value)}
          className="border p-2"
          placeholder="Add rating"
          required
        />
        <input
          type="text"
          value={newUserName}
          onChange={e => setNewUserName(e.target.value)}
          className="border p-2"
          placeholder="User Name"
          required
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2">
          Add Rating
        </button>
      </form>
    </div>
  );
};

export default MovieActorsPage;