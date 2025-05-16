const textureLoader = new THREE.TextureLoader();

export function createMoon(scene) {
    let moonMaterial;
    const moonGeometry = new THREE.SphereGeometry(0.125, 32, 32);

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
        orbitRadius: 1.5, // Расстояние от Земли (в масштабе твоей сцены)
        orbitSpeed: 0.01, // Скорость орбиты вокруг Земли (ускоренная, реальный период — 27.3 дня)
        rotationSpeed: 0.005 // Скорость вращения Луны вокруг своей оси (ускоренная)
    };
}