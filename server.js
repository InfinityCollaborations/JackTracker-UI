// server.js (REAL DOWNLOADS - SPOTIFY CREDENTIALS & PORT HARDCODED)
const express = require('express');
const cors = require('cors');
// const dotenv = require('dotenv'); // No longer needed as port and Spotify creds are hardcoded
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const archiver = require('archiver');
const tmp = require('tmp'); // For creating temporary directories

// dotenv.config(); // No longer needed

const app = express();
const PORT = 5000; // Hardcoded port

// --- Hardcoded Spotify Credentials ---
const HARDCODED_SPOTIPY_CLIENT_ID = "d0a7ab816a91455cb517f569fba956fa";
const HARDCODED_SPOTIPY_CLIENT_SECRET = "664262426fd24df8bbced9269309e8a8";

// --- Middleware ---
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// --- Helper function to sanitize filename ---
function sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9\s._-]+/g, '').replace(/\s+/g, '_');
}

// --- Routes ---
app.post('/api/download', (req, res) => {
    const { spotifyUrl, downloadType } = req.body;

    if (!spotifyUrl) {
        return res.status(400).json({ error: 'Spotify URL is required' });
    }
    if (!spotifyUrl.startsWith('https://open.spotify.com/')) {
        return res.status(400).json({ error: 'Invalid Spotify URL format. It must start with "https://open.spotify.com/"' });
    }

    console.log(`Attempting download for: ${spotifyUrl} (Type: ${downloadType || 'Track'})`);

    tmp.dir({ unsafeCleanup: true }, (err, tempDirPath, cleanupCallback) => {
        if (err) {
            console.error('Failed to create temporary directory:', err);
            return res.status(500).json({ error: 'Server error: Could not create temporary directory.' });
        }
        console.log('Temporary directory created:', tempDirPath);

        const spotdlCommand = `spotdl "${spotifyUrl}" --output "${tempDirPath}"`;
        
        console.log(`Executing command: ${spotdlCommand}`);

        exec(spotdlCommand, {
            env: { ...process.env, PATH: process.env.PATH + ":/usr/bin:/usr/local/bin" }, 
            maxBuffer: 1024 * 1024 * 10, // Increased maxBuffer
            env: {
                ...process.env, // Pass existing environment variables (like PATH)
                SPOTIPY_CLIENT_ID: HARDCODED_SPOTIPY_CLIENT_ID,
                SPOTIPY_CLIENT_SECRET: HARDCODED_SPOTIPY_CLIENT_SECRET,
            }
        }, (error, stdout, stderr) => {
            if (error) {
                console.error(`spotDL execution error: ${error.message}`);
                console.error(`spotDL stderr: ${stderr}`);
                console.error(`spotDL stdout: ${stdout}`);
                cleanupCallback(); 
                let userErrorMessage = 'Download failed. Check server logs for details.';
                if (stderr.includes("Invalid Spotify URL")) {
                    userErrorMessage = "Invalid or unsupported Spotify URL provided.";
                } else if (stderr.includes("Could not find any tracks") || stdout.includes("Skipping")) {
                    userErrorMessage = "Could not find a match for the provided Spotify URL on YouTube Music, or the content is unavailable.";
                } else if (stderr.includes("ffmpeg") && stderr.includes("not found")) {
                    userErrorMessage = "Server configuration error: ffmpeg not found. Please ensure ffmpeg is installed and in PATH.";
                } else if (stderr.includes("SpotipyClientCredentialsError")) {
                    userErrorMessage = "Spotify API credentials error. Please check the hardcoded credentials in server.js.";
                }
                return res.status(500).json({ error: userErrorMessage, details: stderr || stdout });
            }

            console.log(`spotDL stdout: ${stdout}`);
            if (stderr) console.warn(`spotDL stderr: ${stderr}`);

            fs.readdir(tempDirPath, (fsErr, files) => {
                if (fsErr) {
                    console.error('Error reading temporary directory:', fsErr);
                    cleanupCallback();
                    return res.status(500).json({ error: 'Server error: Could not read download directory.' });
                }

                let downloadedItems = [];
                function findAudioFiles(dir) {
                    const items = fs.readdirSync(dir);
                    items.forEach(item => {
                        const itemPath = path.join(dir, item);
                        if (fs.statSync(itemPath).isDirectory()) {
                            findAudioFiles(itemPath);
                        } else if (/\.(mp3|m4a|flac|ogg|opus|wav)$/i.test(item)) {
                            downloadedItems.push(itemPath);
                        }
                    });
                }
                findAudioFiles(tempDirPath);

                if (downloadedItems.length === 0) {
                    console.log('No audio files found in output directory. stdout:', stdout);
                    if (stdout.includes("Skipping") && stdout.includes("already exists")) {
                        cleanupCallback();
                        return res.status(409).json({ error: "Track(s) may have been skipped by spotDL (e.g., already exists or no match found)." });
                    }
                    cleanupCallback();
                    return res.status(404).json({ error: 'No downloadable files found. The content might be unavailable or unsupported.' });
                }

                if (downloadedItems.length === 1) {
                    const filePath = downloadedItems[0];
                    const fileName = path.basename(filePath);
                    console.log(`Sending single file: ${fileName}`);
                    res.download(filePath, sanitizeFilename(fileName), (downloadErr) => {
                        if (downloadErr) {
                            console.error('Error sending file:', downloadErr);
                        }
                        cleanupCallback();
                    });
                } else { 
                    const zipFileName = sanitizeFilename(`JackTracker_${downloadType || 'Download'}_${Date.now()}.zip`);
                    const archive = archiver('zip', { zlib: { level: 9 } });
                    res.attachment(zipFileName);
                    archive.pipe(res);
                    downloadedItems.forEach(filePath => {
                        archive.file(filePath, { name: sanitizeFilename(path.basename(filePath)) });
                    });
                    archive.finalize()
                        .then(() => console.log(`Zip archive ${zipFileName} sent.`))
                        .catch(zipErr => console.error('Error creating or sending zip archive:', zipErr))
                        .finally(() => cleanupCallback());
                    res.on('close', () => {
                        if (!res.writableEnded) {
                           console.warn('Client closed connection during zip streaming.');
                           archive.abort(); 
                           cleanupCallback();
                        }
                    });
                    archive.on('error', (archiveErr) => {
                        console.error('Archiver error:', archiveErr);
                        cleanupCallback();
                    });
                }
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`JackTracker REAL Backend Server listening on hardcoded port ${PORT}`);
    console.log('This server uses spotDL to download music.');
    console.log('Spotify API credentials are HARDCODED in server.js for this version.');
    console.log('Ensure Python, spotDL, and ffmpeg are installed and in PATH.');
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    process.exit(0);
});
app.get('/api/list-files', (req, res) => {
    const dir = req.query.dir;
    if (!fs.existsSync(dir)) {
        return res.status(404).json({ error: "Directory not found" });
    }
    const files = fs.readdirSync(dir).map(file => ({
        name: file,
        path: path.join(dir, file),
    }));
    res.json({ files });
});

app.get('/files', (req, res) => {
    const filePath = req.query.path;
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found');
    }
    res.download(filePath);
});
