import * as THREE from 'three';
import planetsData from './planetsData.js';

const textureLoader = new THREE.TextureLoader();

// Создание материала
function createMaterial(materialType, texture, config = {}) {
    const baseConfig = { map: texture, ...config };

    switch (materialType) {
        case 'MeshBasicMaterial':
            return new THREE.MeshBasicMaterial(baseConfig);
        case 'MeshPhongMaterial':
            return new THREE.MeshPhongMaterial(baseConfig);
        case 'MeshLambertMaterial':
            return new THREE.MeshLambertMaterial(baseConfig);
        case 'MeshStandardMaterial':
            return new THREE.MeshStandardMaterial(baseConfig);
        default:
            return new THREE.MeshPhongMaterial(baseConfig);
    }
}

// Создание одной планеты
function createSinglePlanet(planetKey, scene) {
    const planetInfo = planetsData[planetKey];
    if (!planetInfo) {
        console.error(`Planet ${planetKey} not found in data`);
        return null;
    }

    const config = planetInfo['3d'];
    console.log(`Creating ${planetInfo.name}...`);

    const geometry = new THREE.SphereGeometry(config.radius, config.segments, config.segments);

    // Временный материал с цветом по умолчанию
    const tempColors = {
        sun: 0xffff00,
        mercury: 0x808080,
        venus: 0xffa500,
        earth: 0x0000ff,
        mars: 0xFF4500,
        jupiter: 0xDAA520,
        saturn: 0xF4A460,
        uranus: 0x87CEEB,
        neptune: 0x000080,
        pluto: 0x8A2BE2,
        moon: 0xcccccc
    };

    let tempMaterial = createMaterial(config.material, null, {
        color: tempColors[planetKey] || 0xffffff
    });
    const planet = new THREE.Mesh(geometry, tempMaterial);

    // Настройки теней
    planet.castShadow = config.castShadow !== undefined ? config.castShadow : true;
    planet.receiveShadow = config.receiveShadow !== undefined ? config.receiveShadow : true;
    planet.userData = { name: planetKey };

    // Загружаем текстуру
    textureLoader.load(
        config.texture,
        (texture) => {
            console.log(`${planetInfo.name} texture loaded successfully`);
            planet.material = createMaterial(config.material, texture);
        },
        undefined,
        (error) => {
            console.error(`Error loading ${planetInfo.name} texture:`, error);
        }
    );

    let planetObject = planet;

    // Если планета сложная (Земля с облаками)
    if (config.isGroup && config.layers) {
        const group = new THREE.Group();
        group.add(planet);
        group.userData = { name: planetKey };

        // Добавляем слои
        config.layers.forEach(layer => {
            let layerMaterial;

            if (layer.type === 'clouds') {
                layerMaterial = new THREE.MeshStandardMaterial({
                    transparent: true,
                    opacity: layer.opacity || 1
                });
            } else if (layer.type === 'nightLights') {
                layerMaterial = new THREE.MeshBasicMaterial({
                    blending: THREE.AdditiveBlending
                });
            }

            const layerMesh = new THREE.Mesh(geometry, layerMaterial);
            if (layer.scale) layerMesh.scale.setScalar(layer.scale);
            if (layer.renderOrder !== undefined) layerMesh.renderOrder = layer.renderOrder;
            layerMesh.castShadow = true;
            layerMesh.receiveShadow = true;

            // Загружаем текстуру слоя
            textureLoader.load(layer.texture, (texture) => {
                if (layer.type === 'clouds') {
                    layerMesh.material = new THREE.MeshStandardMaterial({
                        map: texture,
                        transparent: true,
                        opacity: layer.opacity || 1,
                        alphaMap: layer.alphaMap ? texture : undefined
                    });
                } else if (layer.type === 'nightLights') {
                    layerMesh.material = new THREE.MeshBasicMaterial({
                        map: texture,
                        blending: THREE.AdditiveBlending
                    });
                }
            });

            group.add(layerMesh);
        });

        // Поворот группы
        if (config.rotation) {
            group.rotation.set(...config.rotation);
        }

        planetObject = group;
    }

    // Добавляем кольца если есть (Сатурн, Уран)
    if (config.hasRings && config.rings) {
        const ringsGeometry = new THREE.RingGeometry(
            config.rings.innerRadius,
            config.rings.outerRadius,
            64
        );

        let ringsMaterial = new THREE.MeshPhongMaterial({
            color: 0xD3D3D3,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: config.rings.opacity || 0.8
        });

        const rings = new THREE.Mesh(ringsGeometry, ringsMaterial);
        rings.rotation.x = Math.PI / 2;
        rings.castShadow = true;

        // Загружаем текстуру колец
        textureLoader.load(config.rings.texture, (texture) => {
            rings.material = new THREE.MeshPhongMaterial({
                map: texture,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: config.rings.opacity || 0.8
            });
        });

        planet.add(rings);
    }

    // Добавляем освещение для Солнца
    if (config.hasLight) {
        const light = new THREE.PointLight(0xffffff, config.lightIntensity || 4000);
        light.position.set(0, 0, 0);
        scene.add(light);

        const ambientLight = new THREE.AmbientLight(0x404040, 0.1);
        scene.add(ambientLight);
    }

    // Устанавливаем позицию если указана
    if (config.position) {
        planetObject.position.set(...config.position);
    }

    // Устанавливаем вращение если указано (и это не группа)
    if (config.rotation && !config.isGroup) {
        planetObject.rotation.set(...config.rotation);
    }

    scene.add(planetObject);

    return {
        mesh: planetObject,
        orbitRadius: config.orbitRadius || 0,
        orbitSpeed: config.orbitSpeed || 0,
        rotationSpeed: config.rotationSpeed || 0,
        data: planetInfo // Добавляем полные данные планеты
    };
}

// Главная функция создания всех планет
export function createAllPlanets(scene) {
    console.log('🌍 Creating all planets from JSON data...');

    const planets = {};

    // Создаем планеты в нужном порядке
    const planetOrder = ['sun', 'mercury', 'venus', 'earth', 'moon', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

    planetOrder.forEach(planetKey => {
        if (planetsData[planetKey]) {
            const planet = createSinglePlanet(planetKey, scene);
            if (planet) {
                planets[planetKey] = planet;
            }
        }
    });

    console.log('✅ All planets created from JSON!');
    console.log('📊 Available planets:', Object.keys(planets));
    return planets;
}

// Экспорт отдельных функций для совместимости со старым кодом
export function createSun(scene) {
    return createSinglePlanet('sun', scene);
}

export function createEarth(scene) {
    return createSinglePlanet('earth', scene);
}

export function createMars(scene) {
    return createSinglePlanet('mars', scene);
}

export function createJupiter(scene) {
    return createSinglePlanet('jupiter', scene);
}

export function createMercury(scene) {
    return createSinglePlanet('mercury', scene);
}

export function createVenus(scene) {
    return createSinglePlanet('venus', scene);
}

export function createNeptune(scene) {
    return createSinglePlanet('neptune', scene);
}

export function createMoon(scene) {
    return createSinglePlanet('moon', scene);
}

export function createPluto(scene) {
    return createSinglePlanet('pluto', scene);
}

export function createSaturn(scene) {
    return createSinglePlanet('saturn', scene);
}

export function createUranus(scene) {
    return createSinglePlanet('uranus', scene);
}

// Вспомогательная функция для получения данных планеты
export function getPlanetData(planetKey) {
    return planetsData[planetKey] || null;
}

// Функция для получения всех данных
export function getAllPlanetsData() {
    return planetsData;
}