import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

export function createJupiter(scene)
{
    let jupiterMaterial;
    const jupiterGeometry = new THREE.SphereGeometry(1.2, 32, 32); // Радиус Земли меньше Солнца

    // Временный материал до загрузки текстуры
    jupiterMaterial = new THREE.MeshPhongMaterial({ color: 0xDAA520 });
    const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);

    jupiter.castShadow = true;
    jupiter.needsUpdate = true;

    textureLoader.load(
        '../textures/jupiter.jpg',
        (texture) => {
            console.log('jupiter texture loaded successfully');
            jupiterMaterial = new THREE.MeshPhongMaterial({ map: texture });
            jupiter.material = jupiterMaterial;
        },
        undefined,
        (error) => {
            console.error('Error loading jupiter texture:', error);
        }
    );

    // Наклон оси Земли (23.4 градуса)
    jupiter.rotation.z = 0;

    // Добавление Земли в сцену
    scene.add(jupiter);

    return {
        mesh: jupiter,
        orbitRadius: 22, // Расстояние от Солнца (орбитальный радиус)
        orbitSpeed: 0.0084, // Скорость орбиты (ускоренная для визуального эффекта)
        rotationSpeed: 0.015 // Скорость вращения вокруг своей оси
    };
}