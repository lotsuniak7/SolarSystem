import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

export function createPluto(scene)
{
    let plutoMaterial;
    const plutoGeometry = new THREE.SphereGeometry(0.25, 32, 32);

    // Временный материал до загрузки текстуры
    plutoMaterial = new THREE.MeshPhongMaterial({ color: 0x8A2BE2 });
    const pluto = new THREE.Mesh(plutoGeometry, plutoMaterial);

    pluto.castShadow = true;
    pluto.needsUpdate = true;

    textureLoader.load(
        '../textures/pluto.jpg',
        (texture) => {
            console.log('pluto texture loaded successfully');
            plutoMaterial = new THREE.MeshPhongMaterial({ map: texture });
            pluto.material = plutoMaterial;
        },
        undefined,
        (error) => {
            console.error('Error loading pluto texture:', error);
        }
    );

    pluto.rotation.z = 0;

    pluto.userData = { name: 'pluto' };

    scene.add(pluto);

    return {
        mesh: pluto,
        orbitRadius: 100, // Расстояние от Солнца (орбитальный радиус)
        orbitSpeed: 0.00041, // Скорость орбиты (ускоренная для визуального эффекта)
        rotationSpeed: 0.004 // Скорость вращения вокруг своей оси
    };
}