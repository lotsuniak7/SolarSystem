import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

export function createUranus(scene)
{
    let uranusMaterial;
    const uranusGeometry = new THREE.SphereGeometry(0.9, 32, 32);

    // Временный материал до загрузки текстуры
    uranusMaterial = new THREE.MeshBasicMaterial({ color: 0x87CEEB });
    const uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);

    textureLoader.load(
        '../textures/uranus.jpg',
        (texture) => {
            console.log('uranus texture loaded successfully');
            uranusMaterial = new THREE.MeshBasicMaterial({ map: texture });
            uranus.material = uranusMaterial;
        },
        undefined,
        (error) => {
            console.error('Error loading uranus texture:', error);
        }
    );

    // Creation des Rings of uranus
    const ringsGeometry = new THREE.RingGeometry(1.0, 1.6, 64);
    let ringsMaterial = new THREE.MeshBasicMaterial({ color: 0xC0C0C0, side: THREE.DoubleSide });
    const rings = new THREE.Mesh(ringsGeometry, ringsMaterial);

    textureLoader.load(
        '../textures/uranus_ring.png',
        (texture) => {
            console.log('uranus rings texture loaded successfully');
            ringsMaterial = new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide });
            rings.material = ringsMaterial;
        },
        undefined,
        (error) => {
            console.error('Error loading uranus rings texture:', error);
        }
    );

    rings.rotation.x = Math.PI / 2;
    uranus.add(rings);

    uranus.rotation.z = 0;

    scene.add(uranus);

    return {
        mesh: uranus,
        orbitRadius: 34, // Расстояние от Солнца (орбитальный радиус)
        orbitSpeed: 0.0012, // Скорость орбиты (ускоренная для визуального эффекта)
        rotationSpeed: 0.009 // Скорость вращения вокруг своей оси
    };
}