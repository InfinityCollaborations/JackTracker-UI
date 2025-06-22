
import React from 'react';
import { SpotifyIcon } from './icons/SpotifyIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 bg-opacity-30 backdrop-blur-sm shadow-lg py-4">
      <div className="container mx-auto px-4 flex items-center justify-center sm:justify-start">
        <SpotifyIcon className="w-10 h-10 text-green-500 mr-3" />
        <h1 className="text-2xl font-semibold text-gray-100">JackTracker <span className="text-sm text-purple-400 font-normal">UI</span></h1>
      </div>
    </header>
  );
};