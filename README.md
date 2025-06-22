
# 🎵 JackTracker – Spotify Music Downloader

JackTracker lets you download songs, albums, playlists, or artist discographies from Spotify with just a link. No command-line skills needed!

---

## 🚀 How to Use (Simple Steps)

### 1. Install Requirements

Before running JackTracker, make sure you have these installed:

- [Node.js (v18 or higher)](https://nodejs.org/)
- [Python 3](https://www.python.org/downloads/)
- `ffmpeg` (used to convert songs to MP3)
- `spotDL` Python tool:

```bash
pip install spotdl
```

---

### 2. Start the App

```bash
# Install dependencies
npm install

# Start the backend server
node server.js
```

Once the server is running, it will start on:  
**http://localhost:5000**

---

### 3. Use the App

- Open the frontend (`index.html`) in a browser or integrate it into a frontend framework.
- Paste your Spotify URL and click **Download**.
- The app will fetch and convert your music.

---

## 🔒 Notes

- Your system needs access to the internet to fetch and download Spotify content.
- All files are stored temporarily and deleted afterward.

---

## 👨‍💻 Tech Stack

- Node.js + Express (Backend)
- Python + `spotDL` (Music downloader)
- ffmpeg (MP3 conversion)
- Basic React UI

---

Created with ❤️ by [Your Name Here]
# JackTracker-UI
# JackTracker-UI
