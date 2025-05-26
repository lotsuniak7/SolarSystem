import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

export function createEarth(scene)
{
    let earthMaterial, cloudsMaterial, lightsMaterial;
    // Увеличиваем размер Земли в 2.5 раза и улучшаем качество
    const earthGeometry = new THREE.SphereGeometry(1.8, 64, 64); // Больше сегментов для лучшего качества

    // Группа для объединения земли, фонарей, облаков
    const earthGroup = new THREE.Group();

    // Временный материал до загрузки текстуры
    earthMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff }); // Используем MeshPhongMaterial для лучшего освещения
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    // Настройки для теней
    earth.castShadow = true;
    earth.receiveShadow = true;
    earth.renderOrder = 0

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

    earthGroup.add(earth);

    cloudsMaterial = new THREE.MeshStandardMaterial({
        map: textureLoader.load("../textures/earth_clouds.jpg"),
        transparent: true,
        opacity: 1,
        alphaMap: textureLoader.load("../textures/earth_clouds.jpg"),
    });
    const cloudsMesh = new THREE.Mesh(earthGeometry, cloudsMaterial);
    cloudsMesh.scale.setScalar(1.03); // Чуть больше радиус для облаков
    cloudsMesh.castShadow = true;
    cloudsMesh.receiveShadow = true;
    cloudsMesh.renderOrder = 2; // Поверх Земли и ночного слоя
    earthGroup.add(cloudsMesh);

    lightsMaterial = new THREE.MeshBasicMaterial({
        map: textureLoader.load('../textures/earth_nightmap.jpg'), // Текстура ночных огней
        blending: THREE.AdditiveBlending,
    });
    const lightsMesh = new THREE.Mesh(earthGeometry, lightsMaterial);
    lightsMesh.renderOrder = 1;
    earthGroup.add(lightsMesh);

    // Наклон оси Земли (23.4 градуса)
    earthGroup.rotation.z = (-23.4 * Math.PI) / 180;

    // Добавление Земли в сцену
    scene.add(earthGroup);

    earthGroup.userData = { name: 'earth' };

    return {
        mesh: earthGroup,
        orbitRadius: 40, // Увеличили орбиту в 2.5 раза
        orbitSpeed: 0.08, // Немного уменьшили скорость для более реалистичного движения
        rotationSpeed: 0.01
    };
}