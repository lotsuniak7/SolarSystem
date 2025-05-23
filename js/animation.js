export function initAnimation
(sun, earth, moon, venus, neptune, mercury, jupiter, mars, pluto, saturn, uranus, camera, renderer, soundControls, clickHandler, scene)
{
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

        // Mise à jour de la camera pour suivre un objet
        clickHandler.updateCamera(camera);

        renderer.render(scene, camera);
    }

    animate()
}