import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

export function createVenus(scene) {
    let venusMaterial;
    const venusGeometry = new THREE.SphereGeometry(0.6, 32, 32)

    venusMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500 });
    const venus = new THREE.Mesh(venusGeometry, venusMaterial);

    console.log('Starting Venus texture load');
    textureLoader.load(
        '../textures/venus.jpg',
        (texture) => {
            console.log('Venus texture loaded successfully');
            venusMaterial = new THREE.MeshStandardMaterial({ map: texture });
            venus.material = venusMaterial;
        },
        undefined,
        (error) => {
            console.error('Error loading Venus texture:', error);
        }
    );
    console.log('Finished Venus texture load attempt');

    venus.rotation.z = 0;
    scene.add(venus);

    return {
        mesh: venus,
        orbitRadius: 12,
        orbitSpeed: 0.3,
        rotationSpeed: 0.003,
    };
}