import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <div className="max-w-xl text-center">
        <div className="flex items-center justify-center mb-6">
          {/* Stylized 404 illustration (simple) */}
          <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect x="0" y="0" width="160" height="120" rx="12" fill="#F6FFF6" />
            <g transform="translate(12,14)">
              <ellipse cx="68" cy="76" rx="44" ry="10" fill="#E6F6EA" />
              <g transform="translate(28,8)">
                <path d="M12 0 L24 0 L30 10 L6 10 Z" fill="#8DE08D" />
                <circle cx="18" cy="32" r="18" fill="#9FE49A" />
                <rect x="6" y="44" width="24" height="10" rx="4" fill="#CFF6D0" />
              </g>
            </g>
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-sm text-gray-600 mb-6">
          The page you are looking for might have been removed, had its name changed or is temporarily unavailable.
        </p>

        <div className="flex items-center justify-center">
          <Link to="/" className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-6 rounded-full shadow">
            Home Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
