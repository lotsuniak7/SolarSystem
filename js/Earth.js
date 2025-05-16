const textureLoader = new THREE.TextureLoader();

export function createEarth(scene) {
    let earthMaterial;
    const earthGeometry = new THREE.SphereGeometry(0.5, 32, 32); // Радиус Земли меньше Солнца

    // Временный материал до загрузки текстуры
    earthMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Синий цвет для теста
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);

    // Загрузка текстуры Земли
    textureLoader.load(
        '../textures/earth.jpg',
        (texture) => {
            console.log('Earth texture loaded successfully');
            earthMaterial = new THREE.MeshStandardMaterial({ map: texture });
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
        orbitRadius: 16, // Расстояние от Солнца (орбитальный радиус)
        orbitSpeed: 0.5, // Скорость орбиты (ускоренная для визуального эффекта)
        rotationSpeed: 0.01 // Скорость вращения Земли вокруг своей оси
    };
}