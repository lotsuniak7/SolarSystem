import * as THREE from "three";

export function createOrbits(planets, scene)
{
    planets.forEach(planet => {
        const planetOrbitGeometry = new THREE.RingGeometry(planet.orbitRadius - 0.01, planet.orbitRadius + 0.01, 64, 1);
        const planetOrbitMaterial = new THREE.LineBasicMaterial({ color: 0x888888, side: THREE.DoubleSide });
        const planetOrbit = new THREE.Mesh(planetOrbitGeometry, planetOrbitMaterial);
        planetOrbit.rotation.x = Math.PI / 2; // Повернем орбиту в горизонтальную плоскость
        scene.add(planetOrbit);
    });
}