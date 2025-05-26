import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

export function createMars(scene)
{
    let marsMaterial;
    const marsGeometry = new THREE.SphereGeometry(0.675, 32, 32);

    // Временный материал до загрузки текстуры
    marsMaterial = new THREE.MeshLambertMaterial({ color: 0xFF4500 });
    const mars = new THREE.Mesh(marsGeometry, marsMaterial);



    textureLoader.load(
        '../textures/mars.jpg',
        (texture) => {
            console.log('mars texture loaded successfully');
            marsMaterial = new THREE.MeshLambertMaterial({ map: texture });
            mars.material = marsMaterial;
        },
        undefined,
        (error) => {
            console.error('Error loading mars texture:', error);
        }
    );

    mars.rotation.z = 0;

    scene.add(mars);

    return {
        mesh: mars,
        orbitRadius: 45, // Расстояние от Солнца (орбитальный радиус)
        orbitSpeed: 0.053, // Скорость орбиты (ускоренная для визуального эффекта)
        rotationSpeed: 0.01 // Скорость вращения вокруг своей оси
    };
}