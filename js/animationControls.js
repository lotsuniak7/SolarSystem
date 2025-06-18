// animationControls.js - Контроллер для управления анимацией через UI

export class AnimationControls {
    constructor(planets, scene) {
        this.planets = planets;
        this.scene = scene;
        this.speed = 1;
        this.orbitsVisible = true;
        this.labelsVisible = true;
        this.orbitLines = [];
        this.planetLabels = [];

        // Сохраняем оригинальные скорости
        this.originalSpeeds = {};
        this.planets.forEach(planet => {
            if (planet.mesh && planet.mesh.userData && planet.mesh.userData.name) {
                this.originalSpeeds[planet.mesh.userData.name] = {
                    orbitSpeed: planet.orbitSpeed,
                    rotationSpeed: planet.rotationSpeed
                };
            }
        });

        this.findOrbitLines();
    }

    // Найти линии орбит в сцене
    findOrbitLines() {
        this.scene.traverse((child) => {
            if (child.name && child.name.includes('orbit')) {
                this.orbitLines.push(child);
            }
        });
    }

    // Установить скорость анимации
    setSpeed(newSpeed) {
        this.speed = newSpeed;

        // Обновляем скорости всех планет
        this.planets.forEach(planet => {
            if (planet.mesh && planet.mesh.userData && planet.mesh.userData.name) {
                const planetName = planet.mesh.userData.name;
                if (this.originalSpeeds[planetName]) {
                    planet.orbitSpeed = this.originalSpeeds[planetName].orbitSpeed * newSpeed;
                    planet.rotationSpeed = this.originalSpeeds[planetName].rotationSpeed * newSpeed;
                }
            }
        });

        console.log(`Animation speed set to: ${newSpeed}x`);
    }

    // Переключить видимость орбит
    toggleOrbits() {
        this.orbitsVisible = !this.orbitsVisible;

        this.orbitLines.forEach(orbitLine => {
            orbitLine.visible = this.orbitsVisible;
        });

        console.log(`Orbits visibility: ${this.orbitsVisible}`);
        return this.orbitsVisible;
    }

    // Переключить видимость меток планет
    toggleLabels() {
        this.labelsVisible = !this.labelsVisible;

        // Здесь можно управлять видимостью меток планет
        // Если у вас есть система меток, добавьте логику здесь

        console.log(`Labels visibility: ${this.labelsVisible}`);
        return this.labelsVisible;
    }

    // Получить текущее состояние
    getState() {
        return {
            speed: this.speed,
            orbitsVisible: this.orbitsVisible,
            labelsVisible: this.labelsVisible
        };
    }

    // Сбросить все настройки к значениям по умолчанию
    reset() {
        this.setSpeed(1);
        if (!this.orbitsVisible) {
            this.toggleOrbits();
        }
        if (!this.labelsVisible) {
            this.toggleLabels();
        }
        console.log('Animation controls reset to default');
    }

    // Пауза/воспроизведение анимации
    togglePause() {
        if (this.speed === 0) {
            this.setSpeed(1);
            return false; // не на паузе
        } else {
            this.setSpeed(0);
            return true; // на паузе
        }
    }

    // Установить время анимации (для синхронизации)
    setTime(time) {
        // Эта функция может быть использована для синхронизации времени
        // между различными компонентами анимации
        this.currentTime = time;
    }

    // Очистка ресурсов
    cleanup() {
        this.orbitLines = [];
        this.planetLabels = [];
        this.originalSpeeds = {};
    }
}