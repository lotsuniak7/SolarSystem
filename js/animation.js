export function initAnimation(sun, earth, moon, venus, neptune, mercury, jupiter, mars, pluto, saturn, uranus, camera, renderer, soundControls, clickHandler, scene) {
    // Анимация
    let time = 0;
    let globalAnimationSpeed = 1; // Глобальная скорость анимации

    function animate() {
        requestAnimationFrame(animate);

        // Применяем глобальную скорость анимации
        time += 0.01 * globalAnimationSpeed;

        // Вращение Солнца
        sun.mesh.rotation.y += sun.rotationSpeed * globalAnimationSpeed;

        // Земля
        if (!clickHandler.getRotationMode()) {
            earth.mesh.rotation.y += earth.rotationSpeed * globalAnimationSpeed;
        }
        earth.mesh.position.x = Math.cos(time * earth.orbitSpeed) * earth.orbitRadius;
        earth.mesh.position.z = Math.sin(time * earth.orbitSpeed) * earth.orbitRadius;

        // Луна
        moon.mesh.position.x = earth.mesh.position.x + Math.cos(time * moon.orbitSpeed) * moon.orbitRadius;
        moon.mesh.position.z = earth.mesh.position.z + Math.sin(time * moon.orbitSpeed) * moon.orbitRadius;
        if (!clickHandler.getRotationMode() || clickHandler.getCurrentCamera() !== moon.mesh) {
            moon.mesh.rotation.y += moon.rotationSpeed * globalAnimationSpeed;
        }

        // Венера
        venus.mesh.position.x = Math.cos(time * venus.orbitSpeed) * venus.orbitRadius;
        venus.mesh.position.z = Math.sin(time * venus.orbitSpeed) * venus.orbitRadius;
        if (!clickHandler.getRotationMode() || clickHandler.getCurrentCamera() !== venus.mesh) {
            venus.mesh.rotation.y += venus.rotationSpeed * globalAnimationSpeed;
        }

        // Нептун
        neptune.mesh.position.x = Math.cos(time * neptune.orbitSpeed) * neptune.orbitRadius;
        neptune.mesh.position.z = Math.sin(time * neptune.orbitSpeed) * neptune.orbitRadius;
        if (!clickHandler.getRotationMode() || clickHandler.getCurrentCamera() !== neptune.mesh) {
            neptune.mesh.rotation.y += neptune.rotationSpeed * globalAnimationSpeed;
        }

        // Меркурий
        mercury.mesh.position.x = Math.cos(time * mercury.orbitSpeed) * mercury.orbitRadius;
        mercury.mesh.position.z = Math.sin(time * mercury.orbitSpeed) * mercury.orbitRadius;
        if (!clickHandler.getRotationMode() || clickHandler.getCurrentCamera() !== mercury.mesh) {
            mercury.mesh.rotation.y += mercury.rotationSpeed * globalAnimationSpeed;
        }

        // Юпитер
        jupiter.mesh.position.x = Math.cos(time * jupiter.orbitSpeed) * jupiter.orbitRadius;
        jupiter.mesh.position.z = Math.sin(time * jupiter.orbitSpeed) * jupiter.orbitRadius;
        if (!clickHandler.getRotationMode() || clickHandler.getCurrentCamera() !== jupiter.mesh) {
            jupiter.mesh.rotation.y += jupiter.rotationSpeed * globalAnimationSpeed;
        }

        // Марс
        mars.mesh.position.x = Math.cos(time * mars.orbitSpeed) * mars.orbitRadius;
        mars.mesh.position.z = Math.sin(time * mars.orbitSpeed) * mars.orbitRadius;
        if (!clickHandler.getRotationMode() || clickHandler.getCurrentCamera() !== mars.mesh) {
            mars.mesh.rotation.y += mars.rotationSpeed * globalAnimationSpeed;
        }

        // Плутон
        pluto.mesh.position.x = Math.cos(time * pluto.orbitSpeed) * pluto.orbitRadius;
        pluto.mesh.position.z = Math.sin(time * pluto.orbitSpeed) * pluto.orbitRadius;
        if (!clickHandler.getRotationMode() || clickHandler.getCurrentCamera() !== pluto.mesh) {
            pluto.mesh.rotation.y += pluto.rotationSpeed * globalAnimationSpeed;
        }

        // Сатурн
        saturn.mesh.position.x = Math.cos(time * saturn.orbitSpeed) * saturn.orbitRadius;
        saturn.mesh.position.z = Math.sin(time * saturn.orbitSpeed) * saturn.orbitRadius;
        if (!clickHandler.getRotationMode() || clickHandler.getCurrentCamera() !== saturn.mesh) {
            saturn.mesh.rotation.y += saturn.rotationSpeed * globalAnimationSpeed;
        }

        // Уран
        uranus.mesh.position.x = Math.cos(time * uranus.orbitSpeed) * uranus.orbitRadius;
        uranus.mesh.position.z = Math.sin(time * uranus.orbitSpeed) * uranus.orbitRadius;
        if (!clickHandler.getRotationMode() || clickHandler.getCurrentCamera() !== uranus.mesh) {
            uranus.mesh.rotation.y += uranus.rotationSpeed * globalAnimationSpeed;
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

    // Функция для установки скорости анимации извне
    function setAnimationSpeed(speed) {
        globalAnimationSpeed = speed;
        console.log(`Global animation speed set to: ${speed}x`);
    }

    // Функция для получения текущей скорости
    function getAnimationSpeed() {
        return globalAnimationSpeed;
    }

    // Функция для паузы/воспроизведения
    function togglePause() {
        if (globalAnimationSpeed === 0) {
            globalAnimationSpeed = 1;
            return false; // не на паузе
        } else {
            globalAnimationSpeed = 0;
            return true; // на паузе
        }
    }

    animate();

    // Возвращаем интерфейс для внешнего управления
    return {
        setAnimationSpeed,
        getAnimationSpeed,
        togglePause,
        getCurrentTime: () => time
    };
}