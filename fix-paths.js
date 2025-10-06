// fix-paths.js - Автоматическое исправление путей после сборки Vite
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Fixing paths in dist/index.html...');

const indexPath = path.join(__dirname, 'dist', 'index.html');

// Проверяем существует ли файл
if (!fs.existsSync(indexPath)) {
    console.error('❌ Error: dist/index.html not found!');
    console.error('   Run "npm run build" first');
    process.exit(1);
}

// Читаем содержимое
let content = fs.readFileSync(indexPath, 'utf-8');

// Подсчет замен
let replacements = 0;

// Функция для замены и подсчета
function replaceAndCount(pattern, replacement) {
    const matches = content.match(pattern);
    if (matches) {
        replacements += matches.length;
        content = content.replace(pattern, replacement);
    }
}

// Исправляем все абсолютные пути на относительные
replaceAndCount(/src="\/assets\//g, 'src="./assets/');
replaceAndCount(/href="\/assets\//g, 'href="./assets/');
replaceAndCount(/src="\/sounds\//g, 'src="./sounds/');
replaceAndCount(/href="\/sounds\//g, 'href="./sounds/');
replaceAndCount(/src="\/textures\//g, 'src="./textures/');
replaceAndCount(/href="\/textures\//g, 'href="./textures/');

// Дополнительные исправления для стилей
replaceAndCount(/url\(\/assets\//g, 'url(./assets/');

// Сохраняем исправленный файл
fs.writeFileSync(indexPath, content, 'utf-8');

console.log(`✅ Fixed ${replacements} path(s) in dist/index.html`);
console.log('');
console.log('Changes made:');
console.log('  /assets/     → ./assets/');
console.log('  /sounds/     → ./sounds/');
console.log('  /textures/   → ./textures/');
console.log('');
console.log('✨ Ready to deploy! Copy dist/ folder to your server.');

// Дополнительная проверка
const finalContent = fs.readFileSync(indexPath, 'utf-8');
const stillHasAbsolutePaths = /src="\/[^h]/.test(finalContent); // Исключаем https://

if (stillHasAbsolutePaths) {
    console.warn('⚠️  Warning: Some absolute paths may still exist');
    console.warn('   Please check dist/index.html manually');
}

process.exit(0);