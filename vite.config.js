import { defineConfig } from 'vite';

export default defineConfig({
    root: '.', // Racine du projet
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
        outDir: 'dist', // Dossier de sortie
        assetsDir: 'assets', // Dossier pour les assets
        sourcemap: true, // Pour débogage
    },
    publicDir: 'public', // Dossier pour les textures
});