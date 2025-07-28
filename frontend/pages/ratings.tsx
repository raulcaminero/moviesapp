import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import axios from 'axios';
import Modal from '../components/Modal';

const API_URL = 'http://localhost:3001/ratings';
const MOVIES_API_URL = 'http://localhost:3001/movies';

const RatingsPage = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRating, setEditingRating] = useState(null);
  const [movieId, setMovieId] = useState('');
  const [userName, setUserName] = useState('');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [movies, setMovies] = useState([]);

  // Fetch all movies for dropdown
  useEffect(() => {
    axios.get(MOVIES_API_URL).then(res => setMovies(res.data));
  }, []);

  const fetchRatings = async (query = '') => {
    setLoading(true);
    try {
      const url = query ? `${API_URL}?query=${encodeURIComponent(query)}` : API_URL;
      const data = await fetchWithAuth(url);
      setRatings(data);
    } catch {
      setRatings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRatings(search);
  };

  const handleCreate = () => {
    setEditingRating(null);
    setMovieId('');
    setUserName('');
    setValue('');
    setDescription('');
    setShowModal(true);
  };

  const handleEdit = (rating: any) => {
    setEditingRating(rating);
    setMovieId(rating.movieId);
    setUserName(rating.userName);
    setValue(rating.value);
    setDescription(rating.description || '');
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    await fetchWithAuth(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchRatings(search);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { movieId, userName, value: parseFloat(value), description };
    if (editingRating) {
      await fetchWithAuth(`${API_URL}/${editingRating.id}`, {
        method: 'PUT',
        data: payload,
      });
    } else {
      await fetchWithAuth(API_URL, {
        method: 'POST',
        data: payload,
      });
    }
    setShowModal(false);
    fetchRatings(search);
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingRating(null);
    setMovieId('');
    setUserName('');
    setValue('');
    setDescription('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 w-full px-4 md:px-8 lg:px-16">
      <h1 className="text-4xl font-extrabold mb-2 text-center text-blue-700 drop-shadow-lg tracking-wide uppercase">
        <span className="bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-500 bg-clip-text text-transparent">
          Ratings
        </span>
      </h1>
      <div className="w-full border-b-2 border-blue-300 mb-6"></div>
      <div className="w-full">
        <form onSubmit={handleSearch} className="mb-6 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
          <input
            className="border border-gray-300 rounded px-2 py-1 text-sm w-full md:w-96"
            placeholder="Search ratings by user or movie..."
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
            Add Rating
          </button>
          <button
            type="button"
            className="bg-blue-900 hover:bg-blue-950 text-white px-3 py-1 rounded text-sm transition order-last"
            onClick={() => {
              setSearch('');
              fetchRatings('');
            }}
          >
            Clear
          </button>
        </form>
        <Modal
          isOpen={showModal}
          onClose={handleCancel}
          title={editingRating ? "Edit Rating" : "Create Rating"}
        >
          <form onSubmit={handleFormSubmit} className="mb-6 bg-white p-2 rounded-lg shadow-none w-full max-w-md">
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold text-gray-700">Movie</label>
              <select
                className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
                value={movieId}
                onChange={e => setMovieId(e.target.value)}
                required
              >
                <option value="">Select a movie</option>
                {movies.map((movie: any) => (
                  <option key={movie.id} value={movie.id}>
                    {movie.title}
                  </option>
                ))}
              </select>
              <input
                className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
                placeholder="User Name"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                required
              />
              <input
                className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
                placeholder="Rating"
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={value}
                onChange={e => setValue(e.target.value)}
                required
              />
              <textarea
                className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="flex space-x-2">
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition">
                {editingRating ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={handleCancel} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded text-sm transition">
                Cancel
              </button>
            </div>
          </form>
        </Modal>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full">
            {ratings.map((rating: any) => (
              <li
                key={rating.id}
                className="bg-white rounded-xl p-8 shadow-lg flex flex-col justify-between relative hover:shadow-2xl h-80 w-96 mx-auto overflow-hidden"
              >
                {/* Card header: Profile icon + user name */}
                <div className="flex items-center mb-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-400 mr-3">
                    <svg
                      className="w-6 h-6 text-gray-800"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 20c0-2.2 3.6-4 6-4s6 1.8 6 4"
                      />
                    </svg>
                  </span>
                  <h2 className="text-xl font-bold text-gray-800 truncate">{rating.userName}</h2>
                </div>
                {/* Movie name */}
                <div className="text-gray-700 text-base mb-2 font-semibold">
                  {rating.movie?.title || `Movie ID: ${rating.movieId}`}
                </div>
                {/* Rating value */}
                <div className="text-yellow-600 font-bold text-sm mb-2">
                  Rating: {rating.value}
                </div>
                {/* Description */}
                <div className="text-gray-600 text-base mb-2 overflow-hidden text-ellipsis w-full" style={{maxHeight: '3.5rem'}}>
                  {rating.description && rating.description.trim() !== '' ? rating.description : 'Review...'}
                </div>
                {/* Bottom right action buttons */}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => handleEdit(rating)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm transition mr-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(rating.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RatingsPage;