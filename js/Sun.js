import * as THREE from 'three';

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
            sunMaterial = new THREE.MeshBasicMaterial({
                map: texture,
            });
            sun.material = sunMaterial;
        },
        undefined,
        (error) => {
            console.error('Error loading sun texture:', error);
        }
    );

    // Настройка освещения с тенями
    const sunLight = new THREE.DirectionalLight(0xffffff, 3, 100);
    sunLight.position.set(10, 10, 10); // Позиционируем свет подальше от центра
    sunLight.target.position.set(0, 0, 0); // Направляем на центр (Солнце)

    // Включаем тени для света
    sunLight.castShadow = true;

    // Настройки карты теней
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.1;
    sunLight.shadow.camera.far = 200;
    sunLight.shadow.camera.left = -100;
    sunLight.shadow.camera.right = 100;
    sunLight.shadow.camera.top = 100;
    sunLight.shadow.camera.bottom = -100;

    scene.add(sunLight);
    scene.add(sunLight.target);

    // Увеличиваем ambient light чтобы планеты не были совсем черными
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    // Добавление Солнца в сцену
    scene.add(sun);

    return {
        mesh: sun,
        rotationSpeed: 0.005,
        light: sunLight // Возвращаем ссылку на свет для возможных дальнейших настроек
    };
}