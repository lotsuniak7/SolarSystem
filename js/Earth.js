import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

export function createEarth(scene)
{
    let earthMaterial;
    const earthGeometry = new THREE.SphereGeometry(0.5, 32, 32);

    // Временный материал до загрузки текстуры
    earthMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff }); // Используем MeshPhongMaterial для лучшего освещения
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);

    // Настройки для теней
    earth.castShadow = true;
    earth.receiveShadow = true;

    // Загрузка текстуры Земли
    textureLoader.load(
        '../textures/earth.jpg',
        (texture) => {
            console.log('Earth texture loaded successfully');
            earthMaterial = new THREE.MeshPhongMaterial({ map: texture });
            earth.material = earthMaterial;
        },
        undefined,
        (error) => {
            console.error('Error loading earth texture:', error);
        }
    );

    // Наклон оси Земли (23.4 градуса)
    earth.rotation.z = (-23.4 * Math.PI) / 180;

    // Добавление Земли в сцену
    scene.add(earth);

    return {
        mesh: earth,
        orbitRadius: 16,
        orbitSpeed: 0.1,
        rotationSpeed: 0.01
    };
}