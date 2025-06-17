import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PlanetInfoDisplay, getPlanetNameFromObject } from './planetInfoDisplay.js';

export function initClickHandler(celestialObjects, camera, scene, controls, renderer)
{
    // Raycaster pour definir les clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selectedObject = null;
    let isFollowingPlanet = false;
    let isRotatingPlanet = false;

    // Système d'affichage d'informations
    const infoDisplay = new PlanetInfoDisplay(scene, camera);

    // Nouvelle камера pour крупного плана планеты
    let closeUpCamera = null;
    let closeUpControls = null;
    let currentCamera = camera; // Текущая активная камера

    // Переменные для вращения планеты мышью
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationSpeed = 0.01;
    let hasDragged = false; // Флаг для отслеживания перетаскивания

    function createCloseUpCamera(targetObject) {
        // Создаем новую камеру для крупного плана
        closeUpCamera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        // Получаем размер объекта
        let objectSize = 1;
        if (targetObject.userData && targetObject.userData.name === 'earth') {
            objectSize = 1.8; // радиус Земли из Earth.js
        } else if (targetObject.geometry && targetObject.geometry.parameters) {
            objectSize = targetObject.geometry.parameters.radius || 1;
        }

        // Позиционируем камеру дальше от объекта
        const worldPosition = new THREE.Vector3();
        targetObject.getWorldPosition(worldPosition);

        closeUpCamera.position.copy(worldPosition);
        closeUpCamera.position.z += objectSize * 5; // Увеличили расстояние с 3 до 5
        closeUpCamera.lookAt(worldPosition);

        // Создаем контролы для новой камеры (отключенные по умолчанию)
        closeUpControls = new OrbitControls(closeUpCamera, renderer.domElement);
        closeUpControls.enabled = false;
        closeUpControls.target.copy(worldPosition);
        closeUpControls.enableDamping = true;
        closeUpControls.dampingFactor = 0.05;
        closeUpControls.minDistance = objectSize * 3; // Увеличили минимальное расстояние
        closeUpControls.maxDistance = objectSize * 15; // Увеличили максимальное расстояние
    }

    // Обработчики событий мыши для вращения планеты
    function onMouseDown(event) {
        if (!isRotatingPlanet || !selectedObject) return;

        isDragging = true;
        hasDragged = false; // Сбрасываем флаг перетаскивания
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    function onMouseMove(event) {
        if (!isDragging || !isRotatingPlanet || !selectedObject) return;

        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y
        };

        // Если мышь двигается, значит идет перетаскивание
        if (Math.abs(deltaMove.x) > 2 || Math.abs(deltaMove.y) > 2) {
            hasDragged = true;
        }

        // Вращаем планету вокруг своих осей
        selectedObject.rotation.y += deltaMove.x * rotationSpeed;
        selectedObject.rotation.x += deltaMove.y * rotationSpeed;

        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    function onMouseUp() {
        isDragging = false;
    }

    // Добавляем обработчики событий мыши
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Основной обработчик кликов
    window.addEventListener('click', (event) => {
        // Если было перетаскивание, игнорируем клик
        if (hasDragged) {
            hasDragged = false;
            return;
        }

        // Если уже выбрана планета, не обрабатываем новые клики по планетам
        if (isRotatingPlanet || isFollowingPlanet) {
            // Проверяем клик по пустому месту для выхода
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, currentCamera);
            const intersects = raycaster.intersectObjects(celestialObjects, true);

            if (intersects.length === 0) {
                // Клик по пустому месту - возврат к основной камере
                isFollowingPlanet = false;
                isRotatingPlanet = false;
                selectedObject = null;
                controls.enabled = true;
                currentCamera = camera;

                // Скрываем информацию о планете
                infoDisplay.hidePlanetInfo();

                // Очищаем камеру крупного плана
                if (closeUpControls) {
                    closeUpControls.dispose();
                    closeUpControls = null;
                }
                closeUpCamera = null;

                console.log('Returned to main camera');
            }
            return;
        }

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, currentCamera);
        const intersects = raycaster.intersectObjects(celestialObjects, true);

        if (intersects.length > 0) {
            let targetObject = intersects[0].object;

            // Находим родительскую группу
            while (targetObject.parent && targetObject.parent.type === 'Group' && targetObject.parent !== scene) {
                targetObject = targetObject.parent;
            }

            // Первый клик - режим вращения планеты и показ информации
            selectedObject = targetObject;
            isRotatingPlanet = true;
            isFollowingPlanet = false;
            controls.enabled = false;

            // Получаем имя планеты и показываем информацию
            const planetName = getPlanetNameFromObject(targetObject);
            if (planetName) {
                const worldPosition = new THREE.Vector3();
                targetObject.getWorldPosition(worldPosition);
                infoDisplay.showPlanetInfo(planetName, worldPosition);
            }

            // Создаем камеру крупного плана
            createCloseUpCamera(targetObject);
            currentCamera = closeUpCamera;

            console.log('Planet rotation mode enabled for:', selectedObject);
        }
    });

    // Обработка клавиатуры для дополнительного управления
    window.addEventListener('keydown', (event) => {
        switch(event.code) {
            case 'KeyI': // Клавиша I для показа/скрытия информации
                if (selectedObject) {
                    if (infoDisplay.isInfoVisible()) {
                        infoDisplay.hidePlanetInfo();
                    } else {
                        const planetName = getPlanetNameFromObject(selectedObject);
                        if (planetName) {
                            const worldPosition = new THREE.Vector3();
                            selectedObject.getWorldPosition(worldPosition);
                            infoDisplay.showPlanetInfo(planetName, worldPosition);
                        }
                    }
                }
                break;
            case 'Escape': // Клавиша Escape для выхода
                if (isRotatingPlanet || isFollowingPlanet) {
                    isFollowingPlanet = false;
                    isRotatingPlanet = false;
                    selectedObject = null;
                    controls.enabled = true;
                    currentCamera = camera;
                    infoDisplay.hidePlanetInfo();

                    if (closeUpControls) {
                        closeUpControls.dispose();
                        closeUpControls = null;
                    }
                    closeUpCamera = null;
                }
                break;
        }
    });

    // Обработка изменения размера окна для обеих камер
    window.addEventListener('resize', () => {
        if (closeUpCamera) {
            closeUpCamera.aspect = window.innerWidth / window.innerHeight;
            closeUpCamera.updateProjectionMatrix();
        }
    });

    return {
        updateCamera: (mainCamera) => {
            if ((isFollowingPlanet || isRotatingPlanet) && selectedObject && closeUpCamera) {
                // Обновляем позицию камеры крупного плана
                const worldPosition = new THREE.Vector3();
                selectedObject.getWorldPosition(worldPosition);

                if (isFollowingPlanet) {
                    // В режиме слежения плавно следуем за планетой
                    closeUpControls.target.lerp(worldPosition, 0.05);
                    closeUpControls.update();
                } else if (isRotatingPlanet) {
                    // В режиме вращения камера остается на месте, но смотрит на планету
                    closeUpControls.target.copy(worldPosition);
                    closeUpControls.update();
                }

                // Обновляем позицию панели информации
                infoDisplay.update(worldPosition);
            }
        },
        getCurrentCamera: () => currentCamera,
        isUsingCloseUpCamera: () => currentCamera === closeUpCamera,
        getRotationMode: () => isRotatingPlanet,
        getInfoDisplay: () => infoDisplay // Добавляем доступ к системе информации
    };
}