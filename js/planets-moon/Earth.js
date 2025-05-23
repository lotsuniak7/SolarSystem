import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

export function createEarth(scene)
{
    let earthMaterial, cloudsMaterial, lightsMaterial;
    const earthGeometry = new THREE.SphereGeometry(0.5, 32, 32);

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
        opacity: 0.8,
        alphaMap: textureLoader.load("../textures/earth_clouds.jpg"),
    });
    const cloudsMesh = new THREE.Mesh(earthGeometry, cloudsMaterial);
    cloudsMesh.scale.setScalar(1.003); // Чуть больше радиус для облаков
    cloudsMesh.castShadow = true;
    cloudsMesh.receiveShadow = true;
    cloudsMesh.renderOrder = 2; // Поверх Земли и ночного слоя
    earthGroup.add(cloudsMesh);

    lightsMaterial = new THREE.MeshBasicMaterial({
        map: textureLoader.load('../textures/earth_nightmap.jpg'), // Текстура ночных огней
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8,
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
        orbitRadius: 16,
        orbitSpeed: 0.1,
        rotationSpeed: 0.01
    };
}