import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();

export function createMercury(scene)
{
    let mercuryMaterial;
    const mercuryGeometry = new THREE.SphereGeometry(0.3, 32, 32);

    // Временный материал до загрузки текстуры
    mercuryMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
    const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);

    textureLoader.load(
        '../textures/mercury.jpg',
        (texture) => {
            console.log('Mercury texture loaded successfully');
            mercuryMaterial = new THREE.MeshBasicMaterial({ map: texture });
            mercury.material = mercuryMaterial;
        },
        undefined,
        (error) => {
            console.error('Error loading mercury texture:', error);
        }
    );

    mercury.rotation.z = 0;

    scene.add(mercury);

    return {
        mesh: mercury,
        orbitRadius: 8, // Расстояние от Солнца (орбитальный радиус)
        orbitSpeed: 0.0004, // Скорость орбиты (ускоренная для визуального эффекта)
        rotationSpeed: 0.002 // Скорость вращения Земли вокруг своей оси
    };
}