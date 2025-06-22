
import { DownloadType } from './types';

export const DOWNLOAD_TYPE_OPTIONS: { value: DownloadType; label: string }[] = [
  { value: DownloadType.TRACK, label: 'Track' },
  { value: DownloadType.ALBUM, label: 'Album' },
  { value: DownloadType.PLAYLIST, label: 'Playlist' },
  { value: DownloadType.ARTIST, label: 'Artist Discography' },
];

export const SPOTIFY_URL_PLACEHOLDER = 'https://open.spotify.com/...';