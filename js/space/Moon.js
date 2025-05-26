import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

export function createMoon(scene) {
    let moonMaterial;
    // Увеличиваем размер Луны в 2.5 раза и улучшаем качество
    const moonGeometry = new THREE.SphereGeometry(0.31, 64, 64); // Больше сегментов для лучшего качества

    moonMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Синий цвет для теста
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);

    textureLoader.load(
        '../textures/moon.jpg',
        (texture) => {
            console.log('Moon texture loaded successfully');
            moonMaterial = new THREE.MeshStandardMaterial({ map: texture });
            moon.material = moonMaterial;
        },
        undefined,
        (error) => {
            console.error('Error loading Moon texture:', error);
        }
    );

    // Наклон оси Луны (5.145° для реализма, увеличим до 10° для заметности)
    moon.rotation.z = (10 * Math.PI) / 180;

    // Добавление Луны в сцену
    scene.add(moon);

    // Возвращаем параметры Луны
    return {
        mesh: moon,
        orbitRadius: 3.75, // Увеличили орбиту относительно Земли в 2.5 раза
        orbitSpeed: 0.08, // Немного уменьшили скорость
        rotationSpeed: 0.005 // Скорость вращения Луны вокруг своей оси (ускоренная)
    };
}