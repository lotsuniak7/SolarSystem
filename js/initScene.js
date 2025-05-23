import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function initScene()
{
    // Creation de la scéne
    const scene = new THREE.Scene();

    // Creation de la camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1300);
    camera.position.set(0, 30, 50); // Augmentons la distance pour voir l'orbite
    camera.lookAt(0, 0, 0);

    // Creation d'un rendu (Создание рендера)
    const canvas = document.querySelector('canvas');
    const renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Allumer les ombres
    renderer.shadowMap.type = 2; // Ombres douces

    // Gestion de la camera (pour pc || on utilise pas pour VR)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    // Обработка изменения размера окна
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return { scene, camera, renderer, controls };
}