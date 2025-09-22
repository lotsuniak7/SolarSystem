import { defineConfig } from 'vite';

export default defineConfig({
    root: '.', // Racine du projet
    base: '/', // Chemin de base pour Vercel/GitHub Pages
    server: {
        hmr: {
            host: 'localhost',
            protocol: 'ws',
        },
        host: true,
        allowedHosts: ['.ngrok-free.app'],
    },
    build: {
        outDir: 'dist', // Dossier de sortie pour le build
        assetsDir: 'assets', // Dossier pour les assets bundlés
        sourcemap: true, // Utile pour déboguer
    },
    publicDir: 'public', // Dossier pour les fichiers statiques (textures)
});