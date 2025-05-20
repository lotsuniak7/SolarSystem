import { createSun } from './Sun.js';
import { createEarth } from './Earth.js';
import {createMoon} from './Moon.js';
import {createVenus} from './Venus.js';
import {createNeptune} from "./Neptune";
import {createMercury} from "./Mercury";
import {createJupiter} from "./jupiter";
import {createMars} from "./Mars";
import {createPluto} from "./Pluto";
import {createSaturn} from "./saturn";
import {createUranus} from "./Uranus";
import {createStars} from "./Stars";
import {initSound} from "./sound";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {AdditiveBlending, Mesh, ShaderMaterial, SphereGeometry} from "three";
import {objectRadius} from "three/tsl";

const scene = new THREE.Scene();
createStars(scene);

const soundControls = initSound();
soundControls.setSpaceVolume(0.4);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1300);
camera.position.set(0, 30, 50); // Увеличим расстояние для охвата орбиты
camera.lookAt(0, 0, 0);

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
const mars = createMars(scene);
const pluto = createPluto(scene);
const saturn = createSaturn(scene);
const uranus = createUranus(scene);


const celestialObjects = [
    sun.mesh,
    earth.mesh,
    moon.mesh,
    venus.mesh,
    mercury.mesh,
    mars.mesh,
    jupiter.mesh,
    saturn.mesh,
    uranus.mesh,
    neptune.mesh,
    pluto.mesh
];


// Линия орбиты для наглядности
const planets = [earth, venus, neptune, mercury, jupiter, mars, pluto, saturn, uranus];
planets.forEach(planet => {
    const planetOrbitGeometry = new THREE.RingGeometry(planet.orbitRadius - 0.01, planet.orbitRadius + 0.01, 64, 1);
    const planetOrbitMaterial = new THREE.LineBasicMaterial({ color: 0x888888, side: THREE.DoubleSide });
    const planetOrbit = new THREE.Mesh(planetOrbitGeometry, planetOrbitMaterial);
    planetOrbit.rotation.x = Math.PI / 2; // Повернем орбиту в горизонтальную плоскость
    scene.add(planetOrbit);
});

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


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedObject = null; // Выбранная планета
let isFollowingPlanet = false; // Режим слежения
const initialCameraPosition = new THREE.Vector3(0, 30, 50); // Сохраняем начальную позицию
const initialCameraTarget = new THREE.Vector3(0, 0, 0); // Сохраняем начальную цель

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(celestialObjects);

    if (intersects.length > 0) {
        // Клик по планете
        selectedObject = intersects[0].object;
        isFollowingPlanet = true;
        controls.enabled = false; // Отключаем OrbitControls
    } else if (isFollowingPlanet) {
        // Клик по пустому месту
        isFollowingPlanet = false;
        selectedObject = null;
        controls.enabled = true; // Включаем OrbitControls
    }
});


// Анимация
let time = localStorage.getItem('animationTime') ? parseFloat(localStorage.getItem('animationTime')) : 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    localStorage.setItem('animationTime', time);

    // Вращение и орбиты (без изменений)
    sun.mesh.rotation.y += sun.rotationSpeed;

    earth.mesh.rotation.y += earth.rotationSpeed;
    earth.mesh.position.x = Math.cos(time * earth.orbitSpeed) * earth.orbitRadius;
    earth.mesh.position.z = Math.sin(time * earth.orbitSpeed) * earth.orbitRadius;

    moon.mesh.position.x = earth.mesh.position.x + Math.cos(time * moon.orbitSpeed) * moon.orbitRadius;
    moon.mesh.position.z = earth.mesh.position.z + Math.sin(time * moon.orbitSpeed) * moon.orbitRadius;
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

    mars.mesh.position.x = Math.cos(time * mars.orbitSpeed) * mars.orbitRadius;
    mars.mesh.position.z = Math.sin(time * mars.orbitSpeed) * mars.orbitRadius;
    mars.mesh.rotation.y += mars.rotationSpeed;

    pluto.mesh.position.x = Math.cos(time * pluto.orbitSpeed) * pluto.orbitRadius;
    pluto.mesh.position.z = Math.sin(time * pluto.orbitSpeed) * pluto.orbitRadius;
    pluto.mesh.rotation.y += pluto.rotationSpeed;

    saturn.mesh.position.x = Math.cos(time * saturn.orbitSpeed) * saturn.orbitRadius;
    saturn.mesh.position.z = Math.sin(time * saturn.orbitSpeed) * saturn.orbitRadius;
    saturn.mesh.rotation.y += saturn.rotationSpeed;

    uranus.mesh.position.x = Math.cos(time * uranus.orbitSpeed) * uranus.orbitRadius;
    uranus.mesh.position.z = Math.sin(time * uranus.orbitSpeed) * uranus.orbitRadius;
    uranus.mesh.rotation.y += uranus.rotationSpeed;

    // Управление звуком
    const distanceToSun = camera.position.distanceTo(sun.mesh.position);
    const proximityThreshold = 10;
    soundControls.toggleSun(distanceToSun < proximityThreshold);

    // Управление камерой
    if (isFollowingPlanet && selectedObject) {
        // Радиус планеты
        const planetRadius = selectedObject.geometry.parameters.radius || 1;
        // Смещение камеры для позиционирования планеты в правом нижнем углу
        const offset = new THREE.Vector3(
            planetRadius * 2,   // Вправо
            -planetRadius * 1.5, // Вниз
            planetRadius * 4    // Отдаление
        );

        // Целевая позиция камеры
        const targetPosition = new THREE.Vector3().copy(selectedObject.position).add(offset);

        // Плавное перемещение камеры
        camera.position.lerp(targetPosition, 0.1);

        // Камера смотрит на планету
        camera.lookAt(selectedObject.position);
    } else {
        // Свободное управление камерой через OrbitControls
        controls.enabled = true;
        controls.update();
    }

    renderer.render(scene, camera);
}
animate();

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});