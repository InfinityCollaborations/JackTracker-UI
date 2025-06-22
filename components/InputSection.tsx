
import React from 'react';
import { DownloadType } from '../types';
import { DOWNLOAD_TYPE_OPTIONS, SPOTIFY_URL_PLACEHOLDER } from '../constants';
import { DownloadIcon } from './icons/DownloadIcon';
import { Spinner } from './Spinner';

interface InputSectionProps {
  spotifyUrl: string;
  onSpotifyUrlChange: (url: string) => void;
  downloadType: DownloadType;
  onDownloadTypeChange: (type: DownloadType) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({
  spotifyUrl,
  onSpotifyUrlChange,
  downloadType,
  onDownloadTypeChange,
  onSubmit,
  isLoading,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="spotifyUrl" className="block text-sm font-medium text-gray-300 mb-1">
          Spotify URL
        </label>
        <input
          type="url"
          id="spotifyUrl"
          name="spotifyUrl"
          value={spotifyUrl}
          onChange={(e) => onSpotifyUrlChange(e.target.value)}
          placeholder={SPOTIFY_URL_PLACEHOLDER}
          required
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-100 placeholder-gray-500 transition duration-150 ease-in-out"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="downloadType" className="block text-sm font-medium text-gray-300 mb-1">
          Download Type
        </label>
        <select
          id="downloadType"
          name="downloadType"
          value={downloadType}
          onChange={(e) => onDownloadTypeChange(e.target.value as DownloadType)}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-100 transition duration-150 ease-in-out appearance-none bg-no-repeat bg-right-4"
          style={{ backgroundImage: 'url(\'data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22/%3E%3C/svg%3E\')', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
          disabled={isLoading}
        >
          {DOWNLOAD_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} className="bg-gray-700 text-gray-100">
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-green-500 to-purple-600 hover:from-green-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {isLoading ? (
          <>
            <Spinner className="w-5 h-5 mr-2" />
            Processing...
          </>
        ) : (
          <>
            <DownloadIcon className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-150" />
            Download
          </>
        )}
      </button>
    </form>
  );
};
