import { createSun } from './Sun.js';
import { createEarth } from './Earth.js';
import {createMoon} from './Moon.js';
import {createVenus} from './Venus.js';
import {createNeptune} from "./Neptune";
import {createMercury} from "./Mercury";
import {createJupiter} from "./jupiter";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {AdditiveBlending, Mesh, ShaderMaterial, SphereGeometry} from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 30, 50); // Увеличим расстояние для охвата орбиты

const canvas = document.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// Управление камерой
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();


// Creation des obhetc spatiaux
const sun = createSun(scene);
const earth = createEarth(scene);
const moon = createMoon(scene);
const venus = createVenus(scene);
const neptune = createNeptune(scene);
const mercury = createMercury(scene);
const jupiter = createJupiter(scene);


// Опционально: Добавим линию орбиты для наглядности
const orbitGeometry = new THREE.RingGeometry(earth.orbitRadius - 0.1, earth.orbitRadius + 0.0001, 64, 1);
const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x888888, side: THREE.DoubleSide });
const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
orbit.rotation.x = Math.PI / 2; // Повернем орбиту в горизонтальную плоскость
scene.add(orbit);

/* const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffa500,
    transparent: true,
    opacity: 0.4,
    side: THREE.BackSide
});

const glowGeometry = new THREE.SphereGeometry(2.5, 32, 32); // чуть больше Солнца
const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
sun.mesh.add(glowMesh); // ⬅️ sun.mesh, не sun
*/

// Анимация
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    // Вращение Солнца
    sun.mesh.rotation.y += sun.rotationSpeed;

    // Вращение Земли вокруг своей оси
    earth.mesh.rotation.y += earth.rotationSpeed;

    // Орбита Земли вокруг Солнца
    earth.mesh.position.x = Math.cos(time * earth.orbitSpeed) * earth.orbitRadius;
    earth.mesh.position.z = Math.sin(time * earth.orbitSpeed) * earth.orbitRadius;

    // Орбита Луны вокруг Земли
    moon.mesh.position.x = earth.mesh.position.x + Math.cos(time * moon.orbitSpeed) * moon.orbitRadius;
    moon.mesh.position.z = earth.mesh.position.z + Math.sin(time * moon.orbitSpeed) * moon.orbitRadius;
// Вращение Луны вокруг своей оси
    moon.mesh.rotation.y += moon.rotationSpeed;

    venus.mesh.position.x = Math.cos(time * venus.orbitSpeed) * venus.orbitRadius;
    venus.mesh.position.z = Math.sin(time * venus.orbitSpeed) * venus.orbitRadius;

    venus.mesh.rotation.y += venus.rotationSpeed;

    neptune.mesh.position.x = Math.cos(time * neptune.orbitSpeed) * neptune.orbitRadius;
    neptune.mesh.position.z = Math.sin(time * neptune.orbitSpeed) * neptune.orbitRadius;

    neptune.mesh.rotation.y += neptune.rotationSpeed;

    mercury.mesh.position.x = Math.cos(time * mercury.orbitSpeed) * mercury.orbitRadius;
    mercury.mesh.position.z = Math.sin(time * mercury.orbitSpeed) * mercury.orbitRadius;

    mercury.mesh.rotation.y += mercury.rotationSpeed;

    jupiter.mesh.position.x = Math.cos(time * jupiter.orbitSpeed) * jupiter.orbitRadius;
    jupiter.mesh.position.z = Math.sin(time * jupiter.orbitSpeed) * jupiter.orbitRadius;

    jupiter.mesh.rotation.y += jupiter.rotationSpeed;
    
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});