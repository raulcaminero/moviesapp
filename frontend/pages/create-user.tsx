import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const API_URL = 'http://localhost:3001/users';

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'reviewer', label: 'Reviewer' },
  { value: 'viewer', label: 'Viewer' },
];

const statuses = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const CreateUserPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    role: 'viewer',
    status: 'active',
    profile_address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(API_URL, form);
      router.push('/signin');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error creating user');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/signin');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-500 px-4">
      <h1 className="text-4xl font-extrabold text-center text-white drop-shadow-lg tracking-wide uppercase mb-6">
        Create Account
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-10 rounded-xl shadow-lg p-8 flex flex-col items-center w-full max-w-md"
      >
        <button
          type="button"
          onClick={handleBack}
          className="mb-4 self-start bg-blue-700 hover:bg-blue-900 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
        >
          Back
        </button>
        <label className="text-white font-semibold mb-2 w-full text-left">First Name</label>
        <input
          type="text"
          name="firstName"
          className="mb-4 px-3 py-2 rounded w-full border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.firstName}
          onChange={handleChange}
          required
        />
        <label className="text-white font-semibold mb-2 w-full text-left">Last Name</label>
        <input
          type="text"
          name="lastName"
          className="mb-4 px-3 py-2 rounded w-full border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.lastName}
          onChange={handleChange}
          required
        />
        <label className="text-white font-semibold mb-2 w-full text-left">Username</label>
        <input
          type="text"
          name="username"
          className="mb-4 px-3 py-2 rounded w-full border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.username}
          onChange={handleChange}
          required
        />
        <label className="text-white font-semibold mb-2 w-full text-left">Password</label>
        <input
          type="password"
          name="password"
          className="mb-4 px-3 py-2 rounded w-full border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.password}
          onChange={handleChange}
          required
        />
        <label className="text-white font-semibold mb-2 w-full text-left">Role</label>
        <select
          name="role"
          className="mb-4 px-3 py-2 rounded w-full border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.role}
          onChange={handleChange}
        >
          {roles.map(role => (
            <option key={role.value} value={role.value}>{role.label}</option>
          ))}
        </select>
        <label className="text-white font-semibold mb-2 w-full text-left">Status</label>
        <select
          name="status"
          className="mb-4 px-3 py-2 rounded w-full border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.status}
          onChange={handleChange}
        >
          {statuses.map(status => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
        <label className="text-white font-semibold mb-2 w-full text-left">Profile Picture Address</label>
        <input
          type="text"
          name="profile_address"
          className="mb-6 px-3 py-2 rounded w-full border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.profile_address}
          onChange={handleChange}
        />
        {error && <div className="text-red-200 mb-4">{error}</div>}
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-900 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition w-full"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default CreateUserPage;