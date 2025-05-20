import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

export function createStars(scene)
{
    const starsTexture = textureLoader.load('../textures/stars.jpg');

    const sphereGeometry = new THREE.SphereGeometry(1000, 64, 64);
    const starsMaterial = new THREE.MeshBasicMaterial({
        map: starsTexture,
        side: THREE.BackSide
    });
    const backgroundStars = new THREE.Mesh(sphereGeometry, starsMaterial);
    scene.add(backgroundStars);

    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 2000
    const positions = new Float32Array(starCount * 3)

    for (let i = 0; i < starCount * 3; i+= 3) {
        const radius = Math.random() * 800 + 200;
        const theta = Math.random() * Math.PI * 2; // Угол вокруг Оси
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i] = radius * Math.sin(phi) * Math.cos(theta); // x
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
        positions[i + 2] = radius * Math.cos(phi); // z
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1.5,
        sizeAttenuation: true
    });

    const pointStars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(pointStars);
}