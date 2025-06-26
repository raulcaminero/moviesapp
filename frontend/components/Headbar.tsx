import React from 'react';
import Link from 'next/link';

const linkClass =
  "font-bold text-xl hover:text-yellow-400 transition px-2 py-1 rounded";

const Headbar = () => (
  <nav className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between shadow">
    <div className="flex items-center space-x-6">
      <Link href="/" className={linkClass}>
        Movies
      </Link>
      <Link href="/actors" className={linkClass}>
        Actors
      </Link>
    </div>
  </nav>
);

export default Headbar;