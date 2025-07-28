import React from 'react';
import Link from 'next/link';
import ProfileIcon from './ProfileIcon';

const linkClass =
  "font-bold text-base hover:text-yellow-400 transition px-2 py-1 rounded"; // Smaller size

const Headbar = () => (
  <nav className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between shadow">
    {/* Movies Catalog title on the far left */}
    <div className="font-extrabold text-2xl text-yellow-400">Movies Catalog</div>
    <div className="flex items-center">
      <div className="flex items-center space-x-6">
        <Link href="/movies" className={linkClass}>
          Movies
        </Link>
        <Link href="/actors" className={linkClass}>
          Actors
        </Link>
        <Link href="/ratings" className={linkClass}>
          Ratings
        </Link>
      </div>
      <div className="mx-4 h-8 border-l border-gray-400"></div>
      <ProfileIcon />
    </div>
  </nav>
);

export default Headbar;