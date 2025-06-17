import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PlanetInfoDisplay, getPlanetNameFromObject } from './planetInfoDisplay.js';

export function initClickHandler(celestialObjects, camera, scene, controls, renderer)
{
    // Raycaster для определения кликов
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selectedObject = null;
    let isFollowingPlanet = false;
    let isRotatingPlanet = false;

    // Система отображения информации
    const infoDisplay = new PlanetInfoDisplay(scene, camera);

    // Камера для крупного плана
    let closeUpCamera = null;
    let closeUpControls = null;
    let currentCamera = camera;

    // Переменные для вращения планеты мышью
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationSpeed = 0.01;
    let hasDragged = false;

    // Система подсветки
    let hoveredObject = null;
    const outlineObjects = new Map();
    let animationFrameId = null; // Для отслеживания анимаций

    // Создание outline эффекта
    function createOutlineEffect(targetObject) {
        const outlines = [];

        // Функция для обработки одного меша
        function createOutlineForMesh(mesh, localTransform) {
            if (!mesh.visible || !mesh.geometry) return null;

            // Пропускаем специальные объекты
            if (mesh.name === 'outline_mesh' ||
                mesh.geometry instanceof THREE.RingGeometry ||
                (mesh.material.transparent && mesh.material.opacity < 0.5)) {
                return null;
            }

            try {
                // Клонируем геометрию
                const geometry = mesh.geometry.clone();

                // Создаем материал для outline
                const material = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    side: THREE.BackSide,
                    transparent: true,
                    opacity: 0.7,
                    depthWrite: false
                });

                const outlineMesh = new THREE.Mesh(geometry, material);
                outlineMesh.name = 'outline_mesh';

                // Применяем локальные трансформации если есть
                if (localTransform) {
                    outlineMesh.position.copy(localTransform.position);
                    outlineMesh.rotation.copy(localTransform.rotation);
                    outlineMesh.scale.copy(localTransform.scale);
                    outlineMesh.scale.multiplyScalar(1.1);
                } else {
                    outlineMesh.scale.multiplyScalar(1.1);
                }

                // Устанавливаем renderOrder
                outlineMesh.renderOrder = -1;

                // Сохраняем информацию об оригинальном меше
                outlineMesh.userData.originalMesh = mesh;
                outlineMesh.userData.isMainMesh = mesh === targetObject;

                return outlineMesh;
            } catch (e) {
                console.warn('Failed to create outline for mesh:', e);
                return null;
            }
        }

        // Обрабатываем целевой объект
        if (targetObject.isMesh) {
            // Простой меш (большинство планет)
            const outline = createOutlineForMesh(targetObject);
            if (outline) outlines.push(outline);
        } else if (targetObject.isGroup) {
            // Группа (например, Земля)
            targetObject.traverse((child) => {
                if (child.isMesh && child !== targetObject) {
                    const outline = createOutlineForMesh(child, {
                        position: child.position,
                        rotation: child.rotation,
                        scale: child.scale
                    });
                    if (outline) outlines.push(outline);
                }
            });
        }

        return outlines;
    }

    // Показать подсветку
    function showOutline(object) {
        if (!object || outlineObjects.has(object)) return;

        try {
            const outlines = createOutlineEffect(object);

            if (outlines.length > 0) {
                // Создаем группу для outline
                const outlineGroup = new THREE.Group();
                outlineGroup.name = 'outline_group';

                // Добавляем все outline меши в группу
                outlines.forEach(outline => {
                    outlineGroup.add(outline);
                });

                // Добавляем группу в сцену
                scene.add(outlineGroup);

                // Сохраняем в map
                outlineObjects.set(object, {
                    group: outlineGroup,
                    outlines: outlines,
                    fadeAnimation: null,
                    targetObject: object
                });

                // Анимация появления
                outlines.forEach(outline => {
                    outline.material.opacity = 0;
                });

                const fadeIn = () => {
                    let allComplete = true;
                    outlines.forEach(outline => {
                        if (outline.material.opacity < 0.7) {
                            outline.material.opacity = Math.min(outline.material.opacity + 0.1, 0.7);
                            allComplete = false;
                        }
                    });

                    if (!allComplete) {
                        const data = outlineObjects.get(object);
                        if (data) {
                            data.fadeAnimation = requestAnimationFrame(fadeIn);
                        }
                    }
                };

                fadeIn();
            }
        } catch (e) {
            console.error('Error creating outline:', e);
        }
    }

    // Скрыть подсветку
    function hideOutline(object) {
        if (!object) return;

        const data = outlineObjects.get(object);
        if (!data) return;

        const { group, outlines, fadeAnimation } = data;

        // Отменяем текущую анимацию
        if (fadeAnimation) {
            cancelAnimationFrame(fadeAnimation);
        }

        // Анимация исчезновения
        const fadeOut = () => {
            let allComplete = true;
            let allInvisible = true;

            outlines.forEach(outline => {
                if (outline.material.opacity > 0) {
                    outline.material.opacity = Math.max(outline.material.opacity - 0.15, 0);
                    allComplete = false;
                    if (outline.material.opacity > 0) {
                        allInvisible = false;
                    }
                }
            });

            if (allInvisible) {
                // Удаляем группу из сцены
                scene.remove(group);

                // Очищаем ресурсы
                outlines.forEach(outline => {
                    if (outline.geometry) outline.geometry.dispose();
                    if (outline.material) outline.material.dispose();
                });

                outlineObjects.delete(object);
            } else if (!allComplete) {
                requestAnimationFrame(fadeOut);
            }
        };

        fadeOut();
    }

    // Обработчик движения мыши для hover эффекта
    let mouseTimer = null;
    function onMouseMoveHover(event) {
        // Не показываем hover, если планета уже выбрана
        if (isRotatingPlanet || isFollowingPlanet) return;

        // Очищаем предыдущий таймер
        if (mouseTimer) {
            clearTimeout(mouseTimer);
        }

        // Добавляем небольшую задержку для стабильности
        mouseTimer = setTimeout(() => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, currentCamera);
            const intersects = raycaster.intersectObjects(celestialObjects, true);

            if (intersects.length > 0) {
                let targetObject = intersects[0].object;

                // Пропускаем outline меши
                if (targetObject.name === 'outline_mesh') return;

                // Находим корневой объект планеты
                let foundObject = null;
                let current = targetObject;

                while (current) {
                    if (celestialObjects.includes(current)) {
                        foundObject = current;
                        break;
                    }
                    current = current.parent;
                }

                if (!foundObject) return;

                // Если это новый объект
                if (hoveredObject !== foundObject) {
                    // Убираем подсветку с предыдущего
                    if (hoveredObject) {
                        hideOutline(hoveredObject);
                    }

                    // Добавляем подсветку на новый
                    hoveredObject = foundObject;
                    showOutline(hoveredObject);
                    renderer.domElement.style.cursor = 'pointer';
                }
            } else {
                // Курсор не над планетой
                if (hoveredObject) {
                    hideOutline(hoveredObject);
                    hoveredObject = null;
                    renderer.domElement.style.cursor = 'default';
                }
            }
        }, 10); // 10ms задержка для стабильности
    }

    // Добавляем обработчик движения мыши
    window.addEventListener('mousemove', onMouseMoveHover);

    function createCloseUpCamera(targetObject) {
        closeUpCamera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        let objectSize = 1;

        // Определяем размер объекта
        if (targetObject.userData && targetObject.userData.name === 'earth') {
            objectSize = 1.8;
        } else {
            // Используем bounding box для определения размера
            const box = new THREE.Box3().setFromObject(targetObject);
            const size = box.getSize(new THREE.Vector3());
            objectSize = Math.max(size.x, size.y, size.z) / 2;
        }

        const worldPosition = new THREE.Vector3();
        targetObject.getWorldPosition(worldPosition);

        closeUpCamera.position.copy(worldPosition);
        closeUpCamera.position.z += objectSize * 5;
        closeUpCamera.lookAt(worldPosition);

        closeUpControls = new OrbitControls(closeUpCamera, renderer.domElement);
        closeUpControls.enabled = false;
        closeUpControls.target.copy(worldPosition);
        closeUpControls.enableDamping = true;
        closeUpControls.dampingFactor = 0.05;
        closeUpControls.minDistance = objectSize * 3;
        closeUpControls.maxDistance = objectSize * 15;
    }

    // Обработчики для вращения планеты мышью
    function onMouseDown(event) {
        if (!isRotatingPlanet || !selectedObject) return;

        isDragging = true;
        hasDragged = false;
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

        if (Math.abs(deltaMove.x) > 2 || Math.abs(deltaMove.y) > 2) {
            hasDragged = true;
        }

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

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Основной обработчик кликов
    window.addEventListener('click', (event) => {
        if (hasDragged) {
            hasDragged = false;
            return;
        }

        if (isRotatingPlanet || isFollowingPlanet) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, currentCamera);
            const intersects = raycaster.intersectObjects(celestialObjects, true);

            if (intersects.length === 0) {
                // Выход из режима просмотра
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

                renderer.domElement.style.cursor = 'default';
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

            // Пропускаем outline меши
            if (targetObject.name === 'outline_mesh') return;

            // Находим корневой объект планеты
            let foundObject = null;
            let current = targetObject;

            while (current) {
                if (celestialObjects.includes(current)) {
                    foundObject = current;
                    break;
                }
                current = current.parent;
            }

            if (!foundObject) return;

            // Убираем hover подсветку
            if (hoveredObject) {
                hideOutline(hoveredObject);
                hoveredObject = null;
            }

            selectedObject = foundObject;
            isRotatingPlanet = true;
            isFollowingPlanet = false;
            controls.enabled = false;

            const planetName = getPlanetNameFromObject(foundObject);
            if (planetName) {
                const worldPosition = new THREE.Vector3();
                foundObject.getWorldPosition(worldPosition);
                infoDisplay.showPlanetInfo(planetName, worldPosition);
            }

            createCloseUpCamera(foundObject);
            currentCamera = closeUpCamera;

            console.log('Planet rotation mode enabled for:', selectedObject);
        }
    });

    // Обработка клавиатуры
    window.addEventListener('keydown', (event) => {
        switch(event.code) {
            case 'KeyI':
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
            case 'Escape':
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

                    renderer.domElement.style.cursor = 'default';
                }
                break;
        }
    });

    // Обработка изменения размера окна
    window.addEventListener('resize', () => {
        if (closeUpCamera) {
            closeUpCamera.aspect = window.innerWidth / window.innerHeight;
            closeUpCamera.updateProjectionMatrix();
        }
    });

    // Функция очистки при закрытии
    function cleanup() {
        if (mouseTimer) {
            clearTimeout(mouseTimer);
        }

        // Удаляем все outline объекты
        outlineObjects.forEach((data, object) => {
            if (data.fadeAnimation) {
                cancelAnimationFrame(data.fadeAnimation);
            }
            hideOutline(object);
        });

        // Удаляем обработчики событий
        window.removeEventListener('mousemove', onMouseMoveHover);
        window.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    }

    // Возвращаемый интерфейс
    return {
        updateCamera: (mainCamera) => {
            if ((isFollowingPlanet || isRotatingPlanet) && selectedObject && closeUpCamera) {
                const worldPosition = new THREE.Vector3();
                selectedObject.getWorldPosition(worldPosition);

                if (isFollowingPlanet) {
                    closeUpControls.target.lerp(worldPosition, 0.05);
                    closeUpControls.update();
                } else if (isRotatingPlanet) {
                    closeUpControls.target.copy(worldPosition);
                    closeUpControls.update();
                }

                infoDisplay.update(worldPosition);
            }

            // Обновляем позиции outline для всех планет
            outlineObjects.forEach((data, object) => {
                if (data && data.group && data.targetObject) {
                    // Для простых мешей (большинство планет)
                    if (data.targetObject.isMesh) {
                        // Копируем мировую матрицу целевого объекта
                        data.group.position.copy(data.targetObject.position);
                        data.group.rotation.copy(data.targetObject.rotation);

                        // Обновляем масштаб каждого outline меша
                        data.outlines.forEach(outline => {
                            if (outline.userData.isMainMesh) {
                                outline.scale.copy(data.targetObject.scale);
                                outline.scale.multiplyScalar(1.1);
                            }
                        });
                    }
                    // Для групп (например, Земля)
                    else if (data.targetObject.isGroup) {
                        // Получаем мировую позицию группы
                        const worldPos = new THREE.Vector3();
                        const worldRot = new THREE.Quaternion();
                        const worldScale = new THREE.Vector3();

                        data.targetObject.getWorldPosition(worldPos);
                        data.targetObject.getWorldQuaternion(worldRot);
                        data.targetObject.getWorldScale(worldScale);

                        data.group.position.copy(worldPos);
                        data.group.quaternion.copy(worldRot);
                        data.group.scale.copy(worldScale);
                    }
                }
            });
        },
        getCurrentCamera: () => currentCamera,
        isUsingCloseUpCamera: () => currentCamera === closeUpCamera,
        getRotationMode: () => isRotatingPlanet,
        getInfoDisplay: () => infoDisplay,
        cleanup: cleanup
    };
}