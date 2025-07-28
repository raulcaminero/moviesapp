import React, { useEffect, useState } from 'react';
import MovieList from '../components/MovieList';
import MovieForm from '../components/MovieForm';
import Modal from '../components/Modal';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import axios from 'axios';

const API_URL = 'http://localhost:3001/movies';

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMovie, setEditingMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  const fetchMovies = async (query = '') => {
    setLoading(true);
    try {
      const url = query ? `${API_URL}/search?query=${encodeURIComponent(query)}` : API_URL;
      const { data } = await axios.get(url);
      if (Array.isArray(data)) {
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
    setShowModal(true);
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setShowModal(true);
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
    setShowModal(false);
    fetchMovies(search);
  };

  const handleCancel = () => setShowModal(false);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMovies(search);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 w-full px-4 md:px-8 lg:px-16">
      <h1 className="text-4xl font-extrabold mb-2 text-center text-blue-700 drop-shadow-lg tracking-wide uppercase">
        <span className="bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-500 bg-clip-text text-transparent">
          Movies
        </span>
      </h1>
      <div className="w-full border-b-2 border-blue-300 mb-6"></div>
      <div className="w-full">
        <form onSubmit={handleSearch} className="mb-6 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
          <input
            className="border border-gray-300 rounded px-2 py-1 text-sm w-full md:w-96"
            placeholder="Search movies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition">
            Search
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition"
          >
            Add Movie
          </button>
          <button
            type="button"
            className="bg-blue-900 hover:bg-blue-950 text-white px-3 py-1 rounded text-sm transition order-last"
            onClick={() => {
              setSearch('');
              fetchMovies('');
            }}
          >
            Clear
          </button>
        </form>
        {/* Modal for Create/Edit */}
        <Modal
          isOpen={showModal}
          onClose={handleCancel}
          title={editingMovie ? "Edit Movie" : "Add Movie"}
        >
          <MovieForm
            initialMovie={editingMovie}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Modal>
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

export default MoviesPage;