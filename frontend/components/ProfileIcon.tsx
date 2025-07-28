import React from 'react';

const ProfileIcon = () => (
  <button
    className="ml-4 flex items-center justify-center w-10 h-10 rounded-full bg-yellow-400 hover:bg-yellow-500 transition"
    aria-label="Profile"
    onClick={() => alert('Sign in coming soon!')}
  >
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
  </button>
);

export default ProfileIcon;