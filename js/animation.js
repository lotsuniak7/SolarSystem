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

        // Только если не в режиме ручного вращения, продолжаем автоматическое вращение
        if (!clickHandler.getRotationMode()) {
            earth.mesh.rotation.y += earth.rotationSpeed;
        }
        earth.mesh.position.x = Math.cos(time * earth.orbitSpeed) * earth.orbitRadius;
        earth.mesh.position.z = Math.sin(time * earth.orbitSpeed) * earth.orbitRadius;

        moon.mesh.position.x = earth.mesh.position.x + Math.cos(time * moon.orbitSpeed) * moon.orbitRadius;
        moon.mesh.position.z = earth.mesh.position.z + Math.sin(time * moon.orbitSpeed) * moon.orbitRadius;
        if (!clickHandler.getRotationMode() || clickHandler.getCurrentCamera() !== moon.mesh) {
            moon.mesh.rotation.y += moon.rotationSpeed;
        }

        venus.mesh.position.x = Math.cos(time * venus.orbitSpeed) * venus.orbitRadius;
        venus.mesh.position.z = Math.sin(time * venus.orbitSpeed) * venus.orbitRadius;
        if (!clickHandler.getRotationMode() || clickHandler.getCurrentCamera() !== venus.mesh) {
            venus.mesh.rotation.y += venus.rotationSpeed;
        }

        neptune.mesh.position.x = Math.cos(time * neptune.orbitSpeed) * neptune.orbitRadius;
        neptune.mesh.position.z = Math.sin(time * neptune.orbitSpeed) * neptune.orbitRadius;
        if (!clickHandler.getRotationMode() || clickHandler.getCurrentCamera() !== neptune.mesh) {
            neptune.mesh.rotation.y += neptune.rotationSpeed;
        }

        mercury.mesh.position.x = Math.cos(time * mercury.orbitSpeed) * mercury.orbitRadius;
        mercury.mesh.position.z = Math.sin(time * mercury.orbitSpeed) * mercury.orbitRadius;
        if (!clickHandler.getRotationMode() || clickHandler.getCurrentCamera() !== mercury.mesh) {
            mercury.mesh.rotation.y += mercury.rotationSpeed;
        }

        jupiter.mesh.position.x = Math.cos(time * jupiter.orbitSpeed) * jupiter.orbitRadius;
        jupiter.mesh.position.z = Math.sin(time * jupiter.orbitSpeed) * jupiter.orbitRadius;
        if (!clickHandler.getRotationMode() || clickHandler.getCurrentCamera() !== jupiter.mesh) {
            jupiter.mesh.rotation.y += jupiter.rotationSpeed;
        }

        mars.mesh.position.x = Math.cos(time * mars.orbitSpeed) * mars.orbitRadius;
        mars.mesh.position.z = Math.sin(time * mars.orbitSpeed) * mars.orbitRadius;
        if (!clickHandler.getRotationMode() || clickHandler.getCurrentCamera() !== mars.mesh) {
            mars.mesh.rotation.y += mars.rotationSpeed;
        }

        pluto.mesh.position.x = Math.cos(time * pluto.orbitSpeed) * pluto.orbitRadius;
        pluto.mesh.position.z = Math.sin(time * pluto.orbitSpeed) * pluto.orbitRadius;
        if (!clickHandler.getRotationMode() || clickHandler.getCurrentCamera() !== pluto.mesh) {
            pluto.mesh.rotation.y += pluto.rotationSpeed;
        }

        saturn.mesh.position.x = Math.cos(time * saturn.orbitSpeed) * saturn.orbitRadius;
        saturn.mesh.position.z = Math.sin(time * saturn.orbitSpeed) * saturn.orbitRadius;
        if (!clickHandler.getRotationMode() || clickHandler.getCurrentCamera() !== saturn.mesh) {
            saturn.mesh.rotation.y += saturn.rotationSpeed;
        }

        uranus.mesh.position.x = Math.cos(time * uranus.orbitSpeed) * uranus.orbitRadius;
        uranus.mesh.position.z = Math.sin(time * uranus.orbitSpeed) * uranus.orbitRadius;
        if (!clickHandler.getRotationMode() || clickHandler.getCurrentCamera() !== uranus.mesh) {
            uranus.mesh.rotation.y += uranus.rotationSpeed;
        }

        // Управление звуком
        const currentCamera = clickHandler.getCurrentCamera();
        const distanceToSun = currentCamera.position.distanceTo(sun.mesh.position);
        const proximityThreshold = 30;
        soundControls.toggleSun(distanceToSun < proximityThreshold);

        // Обновление камеры
        clickHandler.updateCamera(camera);

        // Рендеринг с текущей камерой
        renderer.render(scene, currentCamera);
    }

    animate()
}