import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import Modal from '../components/Modal';

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
  const [showModal, setShowModal] = useState(false);
  const [editingActor, setEditingActor] = useState<Actor | null>(null);
  const [actorName, setActorName] = useState('');

  const fetchActors = async (query = '') => {
    setLoading(true);
    try {
      const url = query ? `${API_URL}/search?query=${encodeURIComponent(query)}` : API_URL;
      const data = await fetchWithAuth(url);
      if (Array.isArray(data)) {
        setActors(data);
      } else {
        setActors([]);
      }
    } catch {
      setActors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActors();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchActors(search);
  };

  const handleCreate = () => {
    setEditingActor(null);
    setActorName('');
    setShowModal(true);
  };

  const handleEdit = (actor: Actor) => {
    setEditingActor(actor);
    setActorName(actor.name);
    setShowModal(true);
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
        data: { name: actorName },
      });
    } else {
      await fetchWithAuth(API_URL, {
        method: 'POST',
        data: { name: actorName },
      });
    }
    setShowModal(false);
    fetchActors(search);
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingActor(null);
    setActorName('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 w-full px-4 md:px-8 lg:px-16">
      <h1 className="text-4xl font-extrabold mb-2 text-center text-blue-700 drop-shadow-lg tracking-wide uppercase">
        <span className="bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-500 bg-clip-text text-transparent">
          Actors
        </span>
      </h1>
      <div className="w-full border-b-2 border-blue-300 mb-6"></div>
      <div className="w-full">
        <form onSubmit={handleSearch} className="mb-6 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
          <input
            className="border border-gray-300 rounded px-2 py-1 text-sm w-full md:w-96"
            placeholder="Search actors..."
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
            Add Actor
          </button>
          <button
            type="button"
            className="bg-blue-900 hover:bg-blue-950 text-white px-3 py-1 rounded text-sm transition order-last"
            onClick={() => {
              setSearch('');
              fetchActors('');
            }}
          >
            Clear
          </button>
        </form>
        <Modal
          isOpen={showModal}
          onClose={handleCancel}
          title={editingActor ? "Edit Actor" : "Create Actor"}
        >
          <form onSubmit={handleFormSubmit} className="mb-6 bg-white p-2 rounded-lg shadow-none w-full max-w-md">
            <div className="mb-4">
              <input
                className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
                placeholder="Actor Name"
                value={actorName}
                onChange={e => setActorName(e.target.value)}
                required
              />
            </div>
            <div className="flex space-x-2">
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition">
                {editingActor ? 'Update' : 'Create'}
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
            {actors.map(actor => (
              <li
                key={actor.id}
                className="bg-white rounded-xl p-8 shadow-lg flex flex-col justify-between relative hover:shadow-2xl h-80 w-96 mx-auto overflow-hidden"
              >
                <div className="flex flex-col items-start h-full">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3 truncate w-full">{actor.name}</h2>
                  <div className="font-semibold text-sm text-gray-700 mb-1">Movies:</div>
                  <div className="mb-2 w-full">
                    {actor.movies && actor.movies.length > 0 ? (
                      <ul className="list-disc ml-4 text-sm overflow-hidden" style={{maxHeight: '4.5rem'}}>
                        {actor.movies.map(movie => (
                          <li key={movie.id} className="truncate">{movie.title}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="ml-2 text-gray-500 text-sm">No movies</div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => handleEdit(actor)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm transition mr-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(actor.id)}
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

export default ActorsPage;