import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

export function createVenus(scene) {
    let venusMaterial;
    const venusGeometry = new THREE.SphereGeometry(1.2, 32, 32)

    venusMaterial = new THREE.MeshPhongMaterial({ color: 0xffa500 });
    const venus = new THREE.Mesh(venusGeometry, venusMaterial);

    venus.castShadow = true;
    venus.needsUpdate = true;

    console.log('Starting Venus texture load');
    textureLoader.load(
        '../textures/venus.jpg',
        (texture) => {
            console.log('Venus texture loaded successfully');
            venusMaterial = new THREE.MeshPhongMaterial({ map: texture });
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
        orbitRadius: 30,
        orbitSpeed: 0.44,
        rotationSpeed: 0.003,
    };
}