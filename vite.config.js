// vite.config.js
import { defineConfig } from 'vite';
// Vite typically infers the framework from project structure or plugins,
// but for a plain React setup without a specific Vite React plugin like @vitejs/plugin-react,
// make sure your index.html and index.tsx are correctly set up for ESM.
// If you were using @vitejs/plugin-react, you would import and use it here.
// For the current setup using import maps and direct ESM, a React plugin might not be strictly needed for Vite's core functionality,
// but it's good practice for larger projects or if HMR features are desired.

// Assuming a standard React setup, you'd typically have:
// import react from '@vitejs/plugin-react'

export default defineConfig({
  // plugins: [react()], // Uncomment if you install and use @vitejs/plugin-react
  server: {
    // Port for the Vite development server (frontend)
    // port: 5173, // Default is 5173, uncomment to change

    // Proxy API requests to the backend server
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Address of your backend server (server.js)
        changeOrigin: true, // Recommended for virtual hosted sites and to avoid CORS issues
        // secure: false, // Set to false if your backend is HTTP and not HTTPS (usually for local dev)
        // rewrite: (path) => path.replace(/^\/api/, '') // Use if your backend doesn't expect the /api prefix
      },
    },
  },
  // If not using a specific React plugin, ensure build options are suitable if you plan to build for production.
  // For development with direct ESM, this basic server proxy config is the most critical part from this file.
});
