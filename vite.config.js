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
        rollupOptions: {
            external: [], // Assure que 'three' n'est pas externalisé
        },
    },
    publicDir: 'public',
    optimizeDeps: {
        include: [
            'three',
            'three/examples/jsm/controls/OrbitControls.js',
            'three/examples/jsm/loaders/GLTFLoader.js', // Si utilisé
        ],
        force: true, // Force la ré-optimisation des dépendances
    },
    resolve: {
        alias: {
            three: 'three', // Résout explicitement le module three
        },
    },
});