const textureLoader = new THREE.TextureLoader();

export function createSun(scene)
{
    let sunMaterial;
    const sunGeometry = new THREE.SphereGeometry(2, 32, 32);

    // Временный материал до загрузки текстуры
    sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);

    // Загрузка текстуры Солнца
    textureLoader.load(
        '../textures/sun.jpg',
        (texture) => {
            console.log('Sun texture loaded successfully');
            sunMaterial = new THREE.MeshStandardMaterial({ map: texture, emissive: 0xffa500, emissiveIntensity: 1.0 });
            sun.material = sunMaterial;
        },
        undefined,
        (error) => {
            console.error('Error loading sun texture:', error);
        }
    );

    // Добавление света
    const sunLight = new THREE.PointLight(0xffffff, 5.0, 500);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x808080);
    scene.add(ambientLight);

    // Добавление Солнца в сцену
    scene.add(sun);

    return {
        mesh: sun,
        rotationSpeed: 0.005 // Скорость вращения Солнца
    };
}