import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function initScene()
{
    // Creation de la scéne
    const scene = new THREE.Scene();

    // Creation de la camera - увеличиваем far для больших расстояний
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(0, 75, 125); // Увеличиваем расстояние камеры для обзора увеличенной системы
    camera.lookAt(0, 0, 0);

    // Creation d'un rendu (Создание рендера)
    const canvas = document.querySelector('canvas');
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true // Добавляем сглаживание для лучшего качества
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Allumer les ombres
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Более мягкие тени
    renderer.setPixelRatio(window.devicePixelRatio); // Лучшее качество на Retina дисплеях

    // Gestion de la camera (pour pc || on utilise pas pour VR)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Плавное движение камеры
    controls.dampingFactor = 0.05;
    controls.minDistance = 10; // Минимальное расстояние
    controls.maxDistance = 500; // Максимальное расстояние для большой системы
    controls.update();

    // Обработка изменения размера окна
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return { scene, camera, renderer, controls };
}