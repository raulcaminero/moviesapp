import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Movie {
  id?: number;
  title: string;
  description: string;
  ratings: number;
  actors?: string[];
}

interface MovieFormProps {
  initialMovie?: Movie;
  onSubmit: (movie: Movie) => void;
  onCancel: () => void;
}

const API_ACTORS = 'http://localhost:3001/actors';

const MovieForm: React.FC<MovieFormProps> = ({ initialMovie, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(initialMovie?.title || '');
  const [description, setDescription] = useState(initialMovie?.description || '');
  const [ratings, setRatings] = useState(initialMovie?.ratings || 0);
  const [actors, setActors] = useState<string[]>(
    initialMovie?.actors
      ? initialMovie.actors.map((a: any) => (typeof a === 'object' ? a.id.toString() : a.toString()))
      : []
  );
  const [allActors, setAllActors] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    axios.get(API_ACTORS)
      .then(res => setAllActors(res.data));
  }, []);

  useEffect(() => {
    if (initialMovie?.actors) {
      setActors(
        initialMovie.actors.map((a: any) =>
          typeof a === 'object' ? a.id.toString() : a.toString()
        )
      );
    }
  }, [initialMovie]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const actorIds = actors.filter(a => a != null).map(a => (a! && typeof a! === 'object' ? (a! as any).id : a!));
    onSubmit({ id: initialMovie?.id, title, description, ratings, actors: actorIds });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <input
          className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <label className="block mb-2 font-semibold">Actors</label>
        <select
          multiple
          className="border border-gray-300 rounded px-3 py-2 w-full"
          value={actors}
          onChange={e =>
            setActors(Array.from(e.target.selectedOptions, option => option.value))
          }
          required
        >
          {allActors.map(actor => (
            <option key={actor.id} value={actor.id.toString()}>
              {actor.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex space-x-2">
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition">
          {initialMovie ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default MovieForm;