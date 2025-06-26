import React from 'react';
import { useEffect, useState } from 'react';
import MovieList from '../components/MovieList';
import MovieForm from '../components/MovieForm';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import axios from 'axios';

const API_URL = 'http://localhost:3001/movies';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMovie, setEditingMovie] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const fetchMovies = async (query = '') => {
    setLoading(true);
    try {
      const url = query ? `${API_URL}/search?query=${encodeURIComponent(query)}` : API_URL;
      const { data } = await axios.get(url);
      if (Array.isArray(data)) {
        // Sort movies by title (case-insensitive)
        data.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
      }
      setMovies(data);
    } catch (error) {
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleCreate = () => {
    setEditingMovie(null);
    setShowForm(true);
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await fetchWithAuth(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchMovies(search);
  };

  const handleFormSubmit = async (movie) => {
    if (movie.id) {
      const { id, ...movieData } = movie;
      await fetchWithAuth(`${API_URL}/${id}`, {
        method: 'PUT',
        data: movieData,
      });
    } else {
      await fetchWithAuth(API_URL, {
        method: 'POST',
        data: movie,
      });
    }
    setShowForm(false);
    fetchMovies(search);
  };

  const handleCancel = () => setShowForm(false);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMovies(search);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Raúl's Movies </h1>
        <form onSubmit={handleSearch} className="mb-6 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
          <input
            className="border border-gray-300 rounded px-3 py-2 flex-1"
            placeholder="Search movies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition">
            Search
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
          >
            Add Movie
          </button>
          <button
            type="button"
            className="bg-blue-900 hover:bg-blue-950 text-white px-4 py-2 rounded transition order-last"
            onClick={() => {
              setSearch('');
              fetchMovies('');
            }}
          >
            Clear
          </button>
        </form>
        {showForm && (
          <MovieForm
            initialMovie={editingMovie}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        )}
        <MovieList
          movies={movies}
          onEdit={handleEdit}
          onDelete={handleDelete}
          refreshMovies={fetchMovies}
        />
      </div>
    </div>
  );
};

export default Home;