import { createSun } from './Sun.js';
import { createEarth } from './Earth.js';
import {createMoon} from './Moon.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 30, 50); // Увеличим расстояние для охвата орбиты

const canvas = document.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// Управление камерой
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

// Создание Солнца
const sun = createSun(scene);

// Создание Земли
const earth = createEarth(scene);

const moon = createMoon(scene);

// Опционально: Добавим линию орбиты для наглядности
const orbitGeometry = new THREE.RingGeometry(earth.orbitRadius - 0.1, earth.orbitRadius + 0.0001, 64, 1);
const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x888888, side: THREE.DoubleSide });
const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
orbit.rotation.x = Math.PI / 2; // Повернем орбиту в горизонтальную плоскость
scene.add(orbit);

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