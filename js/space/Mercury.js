import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();

export function createMercury(scene)
{
    let mercuryMaterial;
    const mercuryGeometry = new THREE.SphereGeometry(1.0, 32, 32);

    // Временный материал до загрузки текстуры
    mercuryMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
    const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);

    mercury.castShadow = true;
    mercury.needsUpdate = true;

    textureLoader.load(
        '../textures/mercury.jpg',
        (texture) => {
            console.log('Mercury texture loaded successfully');
            mercuryMaterial = new THREE.MeshPhongMaterial({ map: texture });
            mercury.material = mercuryMaterial;
        },
        undefined,
        (error) => {
            console.error('Error loading mercury texture:', error);
        }
    );

    mercury.rotation.z = 0;

    mercury.userData = { name: 'mercury' };

    scene.add(mercury);

    return {
        mesh: mercury,
        orbitRadius: 20, // Расстояние от Солнца (орбитальный радиус)
        orbitSpeed: 1.12, // Скорость орбиты (ускоренная для визуального эффекта)
        rotationSpeed: 0.002 // Скорость вращения вокруг своей оси
    };
}