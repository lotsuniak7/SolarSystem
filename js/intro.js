import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function initIntroAnimation(scene, camera, renderer, onComplete) {
    // Initialize GLTFLoader
    const gltfLoader = new GLTFLoader();
    let universeModel = null;

    // Load the .glb model
    gltfLoader.load(
        '../assets/models/space_nebula.glb',
        (gltf) => {
            universeModel = gltf.scene;
            // Scale and position the model to act as a skybox
            universeModel.scale.set(500, 500, 500); // Adjust scale to make it large
            universeModel.position.set(0, 0, 0); // Center at origin
            // Ensure materials render on the inside (like a skybox)
            universeModel.traverse((child) => {
                if (child.isMesh) {
                    child.material.side = THREE.BackSide;
                }
            });
            scene.add(universeModel);
            console.log('Universe model loaded successfully');
        },
        undefined,
        (error) => {
            console.error('Error loading universe model:', error);
            // Fallback to a basic sphere if model fails to load
            const fallbackGeometry = new THREE.SphereGeometry(500, 64, 64);
            const fallbackMaterial = new THREE.MeshBasicMaterial({ color: 0x000033, side: THREE.BackSide });
            universeModel = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
            scene.add(universeModel);
        }
    );

    // Hyperspace particles
    const particleCount = 1000;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 100; // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100; // y
        positions[i * 3 + 2] = -Math.random() * 200 - 10; // z (behind camera)
        velocities[i * 3] = 0; // vx
        velocities[i * 3 + 1] = 0; // vy
        velocities[i * 3 + 2] = -Math.random() * 5 - 2; // vz (move toward camera)
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.8
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    particles.visible = false; // Hidden until hyperspace starts
    scene.add(particles);

    // Preload textures
    const textureLoader = new THREE.TextureLoader();
    const texturesToLoad = [
        '../textures/sun.jpg',
        '../textures/earth.jpg',
        '../textures/moon.jpg',
        '../textures/venus.jpg',
        '../textures/neptune.jpg',
        '../textures/mercury.jpg',
        '../textures/jupiter.jpg',
        '../textures/mars.jpg',
        '../textures/pluto.jpg',
        '../textures/saturn.jpg',
        '../textures/uranus.jpg'
    ];

    let texturesLoaded = 0;
    const totalTextures = texturesToLoad.length;
    const loadedTextures = {};

    texturesToLoad.forEach(url => {
        textureLoader.load(
            url,
            (texture) => {
                loadedTextures[url] = texture;
                texturesLoaded++;
            },
            undefined,
            (error) => {
                console.error(`Error loading texture ${url}:`, error);
                texturesLoaded++; // Continue even if a texture fails
            }
        );
    });

    // Intro animation state
    let isAnimating = false;
    let startTime = null;
    const minAnimationDuration = 4000; // 4 seconds in milliseconds
    const initialCameraPos = camera.position.clone(); // Starting position (0, 30, 50)
    const targetCameraPos = new THREE.Vector3(0, 0, 10); // Closer to model center

    // Click to start animation
    window.addEventListener('click', () => {
        if (!isAnimating && universeModel) {
            isAnimating = true;
            startTime = Date.now();
            particles.visible = true; // Show hyperspace particles
            universeModel.visible = false; // Hide universe model during hyperspace
        }
    });

    // Animation loop for intro
    function animateIntro() {
        if (!isAnimating) {
            renderer.render(scene, camera);
            requestAnimationFrame(animateIntro);
            return;
        }

        // Update camera position (zoom toward universe)
        const elapsedTime = Date.now() - startTime;
        const t = Math.min(elapsedTime / minAnimationDuration, 1); // Normalize to [0, 1]
        camera.position.lerpVectors(initialCameraPos, targetCameraPos, t);

        // Update particles for hyperspace effect
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3 + 2] += velocities[i * 3 + 2]; // Move particles toward camera
            if (positions[i * 3 + 2] > 10) { // Reset particles when they pass camera
                positions[i * 3] = (Math.random() - 0.5) * 100;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
                positions[i * 3 + 2] = -200;
            }
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // Check if textures are loaded and minimum duration has passed
        if (texturesLoaded >= totalTextures && elapsedTime >= minAnimationDuration) {
            // Clean up intro objects
            if (universeModel) scene.remove(universeModel);
            scene.remove(particles);
            // Call onComplete to transition to solar system
            onComplete(loadedTextures);
            return;
        }

        renderer.render(scene, camera);
        requestAnimationFrame(animateIntro);
    }

    // Start intro animation loop
    animateIntro();

    return {
        getTextures: () => loadedTextures
    };
}