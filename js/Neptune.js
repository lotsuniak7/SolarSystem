import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

export function createNeptune(scene)
{
    let neptuneMaterial;
    const neptuneGeometry = new THREE.SphereGeometry(0.7, 32, 32);

    neptuneMaterial = new THREE.MeshBasicMaterial({ color: 0x000080});
    const neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);

    textureLoader.load(
        './textures/neptune.jpg',
        (texture) => {
            console.log('Neptune loaded');
            neptuneMaterial = new THREE.MeshBasicMaterial({ map: texture });
            neptune.material = neptuneMaterial;
        },
        undefined,
        (error) => {
            console.error('Error loading Neptune texture:', error);
        }
    )

    neptune.rotation.z = 0;

    scene.add(neptune);

    return {
        mesh: neptune,
        orbitRadius: 30, // Расстояние от Солнца (орбитальный радиус)
        orbitSpeed: 0.00061, // Скорость орбиты (ускоренная для визуального эффекта)
        rotationSpeed: 0.008 // Скорость вращения Земли вокруг своей оси
    };
}