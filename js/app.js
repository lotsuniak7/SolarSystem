import * as THREE from 'three';
import {initScene} from "./initScene";
import {initClickHandler} from "./clickHandler";
import { createSun } from './space/Sun.js';
import { createEarth} from './space/Earth.js';
import {createMoon} from './space/Moon.js';
import {createVenus} from './space/Venus.js';
import {createNeptune} from "./space/Neptune";
import {createMercury} from "./space/Mercury";
import {createJupiter} from "./space/jupiter";
import {createMars} from "./space/Mars";
import {createPluto} from "./space/Pluto";
import {createSaturn} from "./space/saturn";
import {createUranus} from "./space/Uranus";
import {createOrbits} from "./space/orbits";
import {createStars} from "./space/Stars";
import {initSound} from "./sound";
import {initAnimation} from "./animation";
import {AdditiveBlending, Mesh, ShaderMaterial, SphereGeometry} from "three";
import {lights, objectRadius} from "three/tsl";


// Initialisation de la scene, de la caméra, du rendu et des contrôles
const { scene, camera, renderer, controls } = initScene();

// l'Ajout des etoiles
createStars(scene);

// Musique
const soundControls = initSound();
soundControls.setSpaceVolume(0.4);


// Creation des objets spatiaux
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


// La ligne d'orbite || Линия орбиты для наглядности
const planets = [earth, venus, neptune, mercury, jupiter, mars, pluto, saturn, uranus];
createOrbits(planets, scene);

// Initialisation du traitement des clics || Инициализация обработки кликов
const clickHandler = initClickHandler(celestialObjects, camera, scene, controls);

// Initialisation de l'animation
initAnimation(sun, earth, moon, venus, neptune, mercury, jupiter, mars, pluto, saturn, uranus, camera, renderer, soundControls, clickHandler, scene);
