import React, { useState } from 'react';
import { useRouter } from 'next/router';

const SigninPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    // Add authentication logic here
    router.push('/movies');
  };

  const handleCreateAccount = () => {
    router.push('/create-user');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-500 px-4">
      <h1 className="text-5xl font-extrabold text-center text-white drop-shadow-lg tracking-wide uppercase mb-6">
        Movies Catalog
      </h1>
      <p className="text-lg text-blue-100 text-center mb-8 max-w-xl">
        Welcome to the Movies Catalog! Discover movies, actors, ratings, and more in a modern and easy-to-use interface.
      </p>
      <form
        onSubmit={handleContinue}
        className="bg-white bg-opacity-10 rounded-xl shadow-lg p-8 flex flex-col items-center w-full max-w-sm"
      >
        <label className="text-white font-semibold mb-2 w-full text-left">Username</label>
        <input
          type="text"
          className="mb-4 px-3 py-2 rounded w-full border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <label className="text-white font-semibold mb-2 w-full text-left">Password</label>
        <input
          type="password"
          className="mb-6 px-3 py-2 rounded w-full border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <div className="flex w-full justify-end">
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-900 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition"
          >
            Sign In
          </button>
        </div>
        <div className="mt-6 w-full text-center">
          <span className="text-white text-sm">
            New to Cinema Catalog?{' '}
            <button
              type="button"
              onClick={handleCreateAccount}
              className="text-blue-200 underline hover:text-blue-400 font-semibold"
            >
              Create account
            </button>
          </span>
        </div>
      </form>
    </div>
  );
};

export default SigninPage;