import DownloadButton from './DownloadButton';

import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { InputSection } from './components/InputSection';
import { StatusDisplay } from './components/StatusDisplay';
import { DownloadType } from './types';
// import { InfoIcon } from './components/icons/InfoIcon'; // No longer needed for the removed note

// Helper to attempt to get filename from Content-Disposition header
function getFilenameFromContentDisposition(contentDisposition: string | null): string | null {
  if (!contentDisposition) return null;

  // Handles filename="filename.ext"
  let match = contentDisposition.match(/filename="(.+?)"/i);
  if (match && match[1]) {
    return match[1];
  }

  // Handles filename*=UTF-8''filename.ext (URL encoded)
  match = contentDisposition.match(/filename\*=UTF-8''([\w%.-]+)/i);
  if (match && match[1]) {
    try {
      return decodeURIComponent(match[1]);
    } catch (e) {
      // If decoding fails, fallback or return the raw value
      return match[1];
    }
  }
  return null;
}


const App: React.FC = () => {
  const [spotifyUrl, setSpotifyUrl] = useState<string>('');
  const [downloadType, setDownloadType] = useState<DownloadType>(DownloadType.TRACK);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDownload = useCallback(async () => {
    if (!spotifyUrl.trim()) {
      setErrorMessage('Please enter a valid Spotify URL.');
      setStatusMessage(null);
      return;
    }
    if (!spotifyUrl.startsWith('https://open.spotify.com/')) {
        setErrorMessage('Invalid Spotify URL. It should start with "https://open.spotify.com/".');
        setStatusMessage(null);
        return;
    }

    setIsLoading(true);
    setStatusMessage('Initiating download... Please wait.');
    setErrorMessage(null);

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spotifyUrl,
          downloadType, 
        }),
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        const contentDisposition = response.headers.get('content-disposition');
        
        if (contentType && (contentType.startsWith('audio/') || contentType === 'application/zip' || contentType === 'application/octet-stream')) {
          setStatusMessage('Download successful! Preparing file...');
          const blob = await response.blob();
          const filename = getFilenameFromContentDisposition(contentDisposition) || 
                           (downloadType === DownloadType.ALBUM || downloadType === DownloadType.PLAYLIST || downloadType === DownloadType.ARTIST ? 'download.zip' : 'track.mp3');
          
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
          setStatusMessage(`Download complete: ${filename}`);
        } else {
          // Handle cases where the server sends a JSON response even on success (e.g., a message)
          const data = await response.json().catch(() => null);
          if(data && data.message) {
            setStatusMessage(data.message);
          } else if (data && data.error) { // Server might send error as JSON with 200 OK
            setErrorMessage(data.error);
            setStatusMessage(null);
          }
           else {
            setStatusMessage('Request processed, but no downloadable file received as expected. Content might be unavailable.');
          }
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Download failed. Unknown server error or non-JSON response.' }));
        setErrorMessage(errorData.error || `Download failed with status: ${response.status}. ${errorData.details || ''}`);
        setStatusMessage(null);
      }
    } catch (error) {
      console.error('Download error:', error);
      setErrorMessage(`An error occurred: ${error instanceof Error ? error.message : 'Network error or backend unavailable.'}`);
      setStatusMessage(null);
    } finally {
      setIsLoading(false);
    }
  }, [spotifyUrl, downloadType]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl bg-gray-800 bg-opacity-70 backdrop-blur-md shadow-2xl rounded-xl p-6 md:p-10 transform transition-all duration-500 hover:scale-[1.01]">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-500">
              JackTracker Music Downloader
            </h1>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              Enter a Spotify URL to download tracks, albums, playlists, or artist discographies.
            </p>
          </div>

          <InputSection
            spotifyUrl={spotifyUrl}
            onSpotifyUrlChange={setSpotifyUrl}
            downloadType={downloadType}
            onDownloadTypeChange={setDownloadType}
            onSubmit={handleDownload}
            isLoading={isLoading}
          />

          <StatusDisplay
            statusMessage={statusMessage}
            errorMessage={errorMessage}
            isLoading={isLoading}
          />
          
          {/* Important Note section has been removed */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;