import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

export function createSaturn(scene)
{
    let saturnMaterial;
    const saturnGeometry = new THREE.SphereGeometry(2.25, 32, 32);

    // Временный материал до загрузки текстуры
    saturnMaterial = new THREE.MeshPhongMaterial({ color: 0xF4A460 });
    const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);

    saturn.castShadow = true;
    saturn.needsUpdate = true;

    textureLoader.load(
        '../textures/saturn.jpg',
        (texture) => {
            console.log('saturn texture loaded successfully');
            saturnMaterial = new THREE.MeshPhongMaterial({ map: texture });
            saturn.material = saturnMaterial;
        },
        undefined,
        (error) => {
            console.error('Error loading saturn texture:', error);
        }
    );

    // Creation des Rings of Saturn
    const ringsGeometry = new THREE.RingGeometry(1.2, 2.0, 64);
    let ringsMaterial = new THREE.MeshPhongMaterial({ color: 0xD3D3D3, side: THREE.DoubleSide });
    const rings = new THREE.Mesh(ringsGeometry, ringsMaterial);

    rings.castShadow = true;
    rings.needsUpdate = true;

    textureLoader.load(
        '../textures/saturn_ring.png',
        (texture) => {
            console.log('Saturn rings texture loaded successfully');
            ringsMaterial = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide });
            rings.material = ringsMaterial;
        },
        undefined,
        (error) => {
            console.error('Error loading saturn rings texture:', error);
        }
    );

    rings.rotation.x = Math.PI / 2;
    saturn.add(rings);

    saturn.rotation.z = 0;

    scene.add(saturn);

    return {
        mesh: saturn,
        orbitRadius: 65, // Расстояние от Солнца (орбитальный радиус)
        orbitSpeed: 0.0034, // Скорость орбиты (ускоренная для визуального эффекта)
        rotationSpeed: 0.012 // Скорость вращения вокруг своей оси
    };
}