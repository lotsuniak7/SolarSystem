import { defineConfig } from 'vite';

export default defineConfig({
    root: '.',
    base: '/', // Chemin de base pour Vercel
    server: {
        hmr: {
            host: 'localhost',
            protocol: 'ws',
        },
        host: true,
        allowedHosts: ['.ngrok-free.app'],
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true,
    },
    publicDir: 'public',
    optimizeDeps: {
        include: [
            'three',  // Bundle three.js principal
            'three/examples/jsm/controls/OrbitControls'  // Bundle OrbitControls et autres examples
        ],
    },
});