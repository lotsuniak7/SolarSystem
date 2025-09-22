import {initScene} from "./initScene.js";
import {initClickHandler} from "./clickHandler.js";
import { UIManager } from "./uiManager.js";
import { createAllPlanets } from "./createPlanets.js";
import {createOrbits} from "./space/orbits.js";
import {createStars} from "./space/Stars.js";
import {initSound} from "./sound.js";
import {initAnimation} from "./animation.js";

// Инициализация сцены, камеры, рендера и контролов
const { scene, camera, renderer, controls } = initScene();

// Сохраняем ссылку на сцену для доступа из UI
window.solarSystemScene = scene;

// Добавление звезд
createStars(scene);

// Инициализация музыки
let soundControls = null;
try {
    soundControls = initSound();
    if (soundControls && soundControls.setSpaceVolume) {
        soundControls.setSpaceVolume(0.4);
    }
} catch (error) {
    console.log('Sound system not available:', error.message);
    soundControls = {
        toggleSun: () => {},
        cleanup: () => {}
    };
}

// 🚀 СОЗДАНИЕ ВСЕХ ПЛАНЕТ ОДНОЙ ФУНКЦИЕЙ
const allPlanets = createAllPlanets(scene);

// Извлекаем планеты для совместимости со старым кодом
const sun = allPlanets.sun;
const earth = allPlanets.earth;
const moon = allPlanets.moon;
const venus = allPlanets.venus;
const neptune = allPlanets.neptune;
const mercury = allPlanets.mercury;
const jupiter = allPlanets.jupiter;
const mars = allPlanets.mars;
const pluto = allPlanets.pluto;
const saturn = allPlanets.saturn;
const uranus = allPlanets.uranus;

// Массив всех космических объектов для взаимодействия
const celestialObjects = [
    sun.mesh,
    earth.mesh,
    moon.mesh,
    venus.mesh,
    mercury.mesh,
    mars.mesh,
    jupiter.mesh,
    saturn.mesh,
    uranus.mesh,
    neptune.mesh,
    pluto.mesh
];

// Создание орбит
const planets = [earth, venus, neptune, mercury, jupiter, mars, pluto, saturn, uranus];
createOrbits(planets, scene);

// Простой объект для animationControls
const simpleAnimationControls = {
    setSpeed: () => {},
    toggleOrbits: () => {},
    toggleLabels: () => {}
};

// Инициализация UI Manager
const uiManager = new UIManager(null, simpleAnimationControls);

// Инициализация обработчика кликов с передачей UI Manager
const clickHandler = initClickHandler(celestialObjects, camera, scene, controls, renderer, uiManager);

// Связываем UI Manager с click handler
uiManager.clickHandler = clickHandler;

// Инициализация анимации
const globalAnimationController = initAnimation(sun, earth, moon, venus, neptune, mercury, jupiter, mars, pluto, saturn, uranus, camera, renderer, soundControls, clickHandler, scene);

// Сохраняем глобальный контроллер для доступа из UI
window.globalAnimationController = globalAnimationController;

// Скрываем экран загрузки через 2 секунды
setTimeout(() => {
    uiManager.hideLoadingScreen();
}, 2000);

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Обработка ошибок
window.addEventListener('error', (event) => {
    console.error('Application error:', event.error);
});

// Глобальные горячие клавиши
window.addEventListener('keydown', (event) => {
    switch(event.code) {
        case 'Space':
            event.preventDefault();
            if (globalAnimationController && globalAnimationController.togglePause) {
                const isPaused = globalAnimationController.togglePause();
                console.log(isPaused ? 'Animation paused' : 'Animation resumed');
            }
            break;
        case 'F11':
            event.preventDefault();
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(console.error);
            } else {
                document.exitFullscreen().catch(console.error);
            }
            break;
    }
});

// Очистка ресурсов при закрытии страницы
window.addEventListener('beforeunload', () => {
    if (clickHandler && clickHandler.cleanup) {
        clickHandler.cleanup();
    }
    if (soundControls && soundControls.cleanup) {
        soundControls.cleanup();
    }
});

// Экспорт для доступа из консоли разработчика
window.solarSystemApp = {
    scene,
    camera,
    renderer,
    controls,
    clickHandler,
    uiManager,
    globalAnimationController,
    celestialObjects,
    allPlanets // Добавляем новый объект с планетами
};

console.log('🌟 Solar System Explorer loaded successfully!');
console.log('💡 Tips:');
console.log('  - Click on planet buttons to view information and focus camera');
console.log('  - Use satellite panel when available for moons');
console.log('  - Press H to toggle UI visibility');
console.log('  - Press Space to pause/resume animation');
console.log('  - Press O to toggle orbits, L to toggle labels');
console.log('  - Use animation speed slider for time control');