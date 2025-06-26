import React from 'react';
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../utils/fetchWithAuth';

const API_URL = 'http://localhost:3001/actors';

interface Actor {
  id: number;
  name: string;
  movies?: { id: number; title: string }[];
}

const ActorsPage = () => {
  const [actors, setActors] = useState<Actor[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingActor, setEditingActor] = useState<Actor | null>(null);
  const [actorName, setActorName] = useState('');

  const fetchActors = async (query = '') => {
    setLoading(true);
    try {
      const url = query ? `${API_URL}/search?query=${encodeURIComponent(query)}` : API_URL;
      const data = await fetchWithAuth(url); // Axios returns data directly
      if (Array.isArray(data)) {
        data.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
      }
      setActors(data);
    } catch {
      setActors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchActors(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchActors(search);
  };

  const handleCreate = () => {
    setEditingActor(null);
    setActorName('');
    setShowForm(true);
  };

  const handleEdit = (actor: Actor) => {
    setEditingActor(actor);
    setActorName(actor.name);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    await fetchWithAuth(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchActors(search);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingActor) {
      await fetchWithAuth(`${API_URL}/${editingActor.id}`, {
        method: 'PUT',
        data: { name: actorName }, // <-- pass plain object, not JSON.stringify
      });
    } else {
      await fetchWithAuth(API_URL, {
        method: 'POST',
        data: { name: actorName }, // <-- pass plain object, not JSON.stringify
      });
    }
    setShowForm(false);
    fetchActors(search);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingActor(null);
    setActorName('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Actors</h1>
        <form onSubmit={handleSearch} className="mb-6 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
          <input
            className="border border-gray-300 rounded px-3 py-2 flex-1"
            placeholder="Search actors..."
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
            Add Actor
          </button>
          <button
            type="button"
            className="bg-blue-900 hover:bg-blue-950 text-white px-4 py-2 rounded transition order-last"
            onClick={() => {
              setSearch('');
              fetchActors('');
            }}
          >
            Clear
          </button>
        </form>
        {showForm && (
          <form onSubmit={handleFormSubmit} className="mb-6 bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <input
                className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
                placeholder="Actor name"
                value={actorName}
                onChange={e => setActorName(e.target.value)}
                required
              />
            </div>
            <div className="flex space-x-2">
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition">
                {editingActor ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={handleCancel} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition">
                Cancel
              </button>
            </div>
          </form>
        )}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul className="space-y-4">
            {actors.map(actor => (
              <li
                key={actor.id}
                className="bg-white rounded-lg p-6 shadow-md flex flex-col relative hover:shadow-xl"
              >
                {/* Top-right action buttons */}
                <div className="absolute top-4 right-4 flex space-x-2 z-10">
                  <button
                    onClick={() => handleEdit(actor)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(actor.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
                  >
                    Delete
                  </button>
                </div>
                <div className="w-full">
                  <div className="text-2xl font-semibold text-gray-800">{actor.name}</div>
                  {actor.movies && actor.movies.length > 0 ? (
                    <ul className="ml-4 mt-2 list-disc">
                      {actor.movies.map(movie => (
                        <li key={movie.id}>{movie.title}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="ml-4 text-gray-500">No movies</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ActorsPage;