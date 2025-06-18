import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function initClickHandler(celestialObjects, camera, scene, controls, renderer, uiManager = null)
{
    // Raycaster для определения кликов
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selectedObject = null;
    let isFollowingPlanet = false;
    let isRotatingPlanet = false;
    let labelsVisible = true; // Состояние видимости labels

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
    let hoveredPlanetName = null;
    const outlineObjects = new Map();

    // Создаем HTML элемент для отображения названия планеты
    const planetLabel = document.createElement('div');
    planetLabel.id = 'planet-label';
    planetLabel.style.position = 'absolute';
    planetLabel.style.color = 'white';
    planetLabel.style.fontFamily = 'Arial, sans-serif';
    planetLabel.style.fontSize = '16px';
    planetLabel.style.fontWeight = 'bold';
    planetLabel.style.padding = '6px 12px';
    planetLabel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    planetLabel.style.borderRadius = '15px';
    planetLabel.style.border = '1px solid #00ffff';
    planetLabel.style.pointerEvents = 'none';
    planetLabel.style.display = 'none';
    planetLabel.style.transform = 'translate(-50%, -100%)';
    planetLabel.style.textShadow = '0 0 5px #00ffff';
    planetLabel.style.zIndex = '999';
    planetLabel.style.userSelect = 'none';
    planetLabel.style.whiteSpace = 'nowrap';
    document.body.appendChild(planetLabel);

    // Функция для получения читаемого названия планеты
    function getPlanetDisplayName(planetName) {
        const displayNames = {
            'sun': 'Sun',
            'mercury': 'Mercury',
            'venus': 'Venus',
            'earth': 'Earth',
            'mars': 'Mars',
            'jupiter': 'Jupiter',
            'saturn': 'Saturn',
            'uranus': 'Uranus',
            'neptune': 'Neptune',
            'pluto': 'Pluto',
            'moon': 'Moon'
        };
        return displayNames[planetName.toLowerCase()] || planetName;
    }

    // Функция для получения имени планеты из объекта
    function getPlanetNameFromObject(object) {
        // Сначала проверяем userData у самого объекта
        if (object.userData && object.userData.name) {
            return object.userData.name;
        }

        // Проверяем родительские объекты (для групп как Earth)
        let currentObject = object.parent;
        while (currentObject) {
            if (currentObject.userData && currentObject.userData.name) {
                return currentObject.userData.name;
            }
            currentObject = currentObject.parent;
        }

        // Fallback: определяем по позиции в массиве celestialObjects
        const index = celestialObjects.indexOf(object);
        if (index !== -1) {
            const planetNames = ['sun', 'earth', 'moon', 'venus', 'mercury', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
            return planetNames[index] || null;
        }

        // Последний fallback: определяем по размеру и позиции
        if (object.isMesh && object.geometry && object.geometry.parameters) {
            const radius = object.geometry.parameters.radius;
            const position = object.position;
            const distance = position.length();

            // Сначала по размеру (более надежно)
            if (radius > 4.5) return 'sun';
            if (radius > 2.5) return 'jupiter';
            if (radius > 2.3) return 'saturn';
            if (radius > 1.6) return 'earth';
            if (radius > 1.4) return 'venus';
            if (radius > 0.8) return 'mars';
            if (radius > 0.6) return 'mercury';
            if (radius > 0.5) return 'uranus';
            if (radius > 0.4) return 'neptune';
            if (radius > 0.3) return 'moon';
            return 'pluto';
        }

        return null;
    }

    // Функция для обновления позиции label
    function updateLabelPosition(object) {
        if (!object || !planetLabel || !labelsVisible) return;

        const worldPosition = new THREE.Vector3();
        object.getWorldPosition(worldPosition);

        let offset = 2;
        if (object.isMesh && object.geometry && object.geometry.parameters && object.geometry.parameters.radius) {
            offset = object.geometry.parameters.radius * 1.5;
        } else if (object.isGroup || object.children) {
            const box = new THREE.Box3().setFromObject(object);
            const size = box.getSize(new THREE.Vector3());
            offset = Math.max(size.x, size.y, size.z) * 0.75;
        }

        worldPosition.y += offset;
        const screenPosition = worldPosition.project(currentCamera);

        if (screenPosition.z > 1) return;

        const x = (screenPosition.x * 0.5 + 0.5) * window.innerWidth;
        const y = (1 - (screenPosition.y * 0.5 + 0.5)) * window.innerHeight;

        planetLabel.style.left = x + 'px';
        planetLabel.style.top = (y - 10) + 'px';
    }

    // Создание outline эффекта
    function createOutlineEffect(targetObject) {
        const outlines = [];

        function createOutlineForMesh(mesh, localTransform) {
            if (!mesh.visible || !mesh.geometry) return null;

            if (mesh.name === 'outline_mesh' ||
                mesh.geometry instanceof THREE.RingGeometry ||
                (mesh.material.transparent && mesh.material.opacity < 0.5)) {
                return null;
            }

            try {
                const geometry = mesh.geometry.clone();
                const material = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    side: THREE.BackSide,
                    transparent: true,
                    opacity: 0.7,
                    depthWrite: false
                });

                const outlineMesh = new THREE.Mesh(geometry, material);
                outlineMesh.name = 'outline_mesh';

                if (localTransform) {
                    outlineMesh.position.copy(localTransform.position);
                    outlineMesh.rotation.copy(localTransform.rotation);
                    outlineMesh.scale.copy(localTransform.scale);
                    outlineMesh.scale.multiplyScalar(1.1);
                } else {
                    outlineMesh.scale.multiplyScalar(1.1);
                }

                outlineMesh.renderOrder = -1;
                outlineMesh.userData.originalMesh = mesh;
                outlineMesh.userData.isMainMesh = mesh === targetObject;

                return outlineMesh;
            } catch (e) {
                console.warn('Failed to create outline for mesh:', e);
                return null;
            }
        }

        if (targetObject.isMesh) {
            const outline = createOutlineForMesh(targetObject);
            if (outline) outlines.push(outline);
        } else if (targetObject.isGroup) {
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
                const outlineGroup = new THREE.Group();
                outlineGroup.name = 'outline_group';

                outlines.forEach(outline => {
                    outlineGroup.add(outline);
                });

                scene.add(outlineGroup);

                outlineObjects.set(object, {
                    group: outlineGroup,
                    outlines: outlines,
                    fadeAnimation: null,
                    targetObject: object
                });

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

        if (fadeAnimation) {
            cancelAnimationFrame(fadeAnimation);
        }

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
                scene.remove(group);
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
        // Если мы в режиме просмотра планеты - НЕ обрабатываем hover
        if (isRotatingPlanet || isFollowingPlanet) {
            return; // Просто выходим, не меняем hover состояние
        }

        if (mouseTimer) {
            clearTimeout(mouseTimer);
        }

        mouseTimer = setTimeout(() => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, currentCamera);
            const intersects = raycaster.intersectObjects(celestialObjects, true);

            if (intersects.length > 0) {
                let targetObject = intersects[0].object;

                if (targetObject.name === 'outline_mesh') return;

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

                if (hoveredObject !== foundObject) {
                    if (hoveredObject) {
                        hideOutline(hoveredObject);
                        if (hoveredPlanetName && uiManager) {
                            uiManager.onPlanetUnhovered(hoveredPlanetName);
                        }
                    }

                    hoveredObject = foundObject;
                    hoveredPlanetName = getPlanetNameFromObject(foundObject);

                    showOutline(hoveredObject);
                    renderer.domElement.style.cursor = 'pointer';

                    if (hoveredPlanetName && labelsVisible) {
                        planetLabel.textContent = getPlanetDisplayName(hoveredPlanetName);
                        planetLabel.style.display = 'block';
                        updateLabelPosition(hoveredObject);

                        if (uiManager) {
                            uiManager.onPlanetHovered(hoveredPlanetName);
                        }
                    }
                }
            } else {
                if (hoveredObject) {
                    hideOutline(hoveredObject);
                    if (hoveredPlanetName && uiManager) {
                        uiManager.onPlanetUnhovered(hoveredPlanetName);
                    }
                    hoveredObject = null;
                    hoveredPlanetName = null;
                    renderer.domElement.style.cursor = 'default';
                    planetLabel.style.display = 'none';
                }
            }
        }, 10);
    }

    window.addEventListener('mousemove', onMouseMoveHover);

    function createCloseUpCamera(targetObject) {
        closeUpCamera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        let objectSize = 1;

        if (targetObject.userData && targetObject.userData.name === 'earth') {
            objectSize = 1.8;
        } else if (targetObject.geometry && targetObject.geometry.parameters) {
            objectSize = targetObject.geometry.parameters.radius || 1;
        } else {
            const box = new THREE.Box3().setFromObject(targetObject);
            const size = box.getSize(new THREE.Vector3());
            objectSize = Math.max(size.x, size.y, size.z) / 2;
        }

        const worldPosition = new THREE.Vector3();
        targetObject.getWorldPosition(worldPosition);

        closeUpCamera.position.copy(worldPosition);
        closeUpCamera.position.z += objectSize * 5;
        closeUpCamera.lookAt(worldPosition);

        // Создаем OrbitControls для closeUpCamera
        closeUpControls = new OrbitControls(closeUpCamera, renderer.domElement);
        closeUpControls.enabled = true; // Включаем контролы
        closeUpControls.target.copy(worldPosition);
        closeUpControls.enableDamping = true;
        closeUpControls.dampingFactor = 0.05;
        closeUpControls.minDistance = objectSize * 2;
        closeUpControls.maxDistance = objectSize * 20;

        // Отключаем основные контролы
        controls.enabled = false;

        console.log(`Created close-up camera for object at:`, worldPosition);
    }

    // Функция для фокусировки на планете по имени
    function focusOnPlanet(planetName) {
        console.log(`Trying to focus on: ${planetName}`);

        const targetObject = celestialObjects.find(obj => {
            const objName = getPlanetNameFromObject(obj);
            console.log(`Checking object with name: ${objName}`);
            return objName && objName.toLowerCase() === planetName.toLowerCase();
        });

        console.log(`Found target object:`, targetObject);

        if (targetObject) {
            // Убираем hover подсветку
            if (hoveredObject) {
                hideOutline(hoveredObject);
                hoveredObject = null;
                planetLabel.style.display = 'none';
            }

            selectedObject = targetObject;
            isRotatingPlanet = true;
            isFollowingPlanet = false;
            controls.enabled = false;

            createCloseUpCamera(targetObject);
            currentCamera = closeUpCamera;

            console.log(`Successfully focused on ${planetName}`);
            return true;
        } else {
            console.warn(`Could not find planet: ${planetName}`);
            return false;
        }
    }

    // Прямой метод фокусировки на объекте
    function directFocusOnObject(targetObject, planetName) {
        console.log(`ClickHandler: Direct focus on object for ${planetName}:`, targetObject);

        if (targetObject) {
            // Убираем hover подсветку
            if (hoveredObject) {
                hideOutline(hoveredObject);
                hoveredObject = null;
                planetLabel.style.display = 'none';
            }

            selectedObject = targetObject;
            isRotatingPlanet = true;
            isFollowingPlanet = false;
            controls.enabled = false;

            createCloseUpCamera(targetObject);
            currentCamera = closeUpCamera;

            console.log(`ClickHandler: Successfully focused on ${planetName}`);
            return true;
        }
        return false;
    }

    // Функция сброса камеры
    function resetCamera() {
        isFollowingPlanet = false;
        isRotatingPlanet = false;
        selectedObject = null;

        // Отключаем closeUpControls и включаем основные
        if (closeUpControls) {
            closeUpControls.dispose();
            closeUpControls = null;
        }
        closeUpCamera = null;

        // Включаем основные контролы и устанавливаем основную камеру
        controls.enabled = true;
        currentCamera = camera;

        // Возвращаем камеру в исходное положение
        camera.position.set(0, 75, 125);
        camera.lookAt(0, 0, 0);
        controls.update();

        renderer.domElement.style.cursor = 'default';
        console.log('Camera reset to overview');
    }

    // Функция для установки видимости labels
    function setLabelsVisible(visible) {
        labelsVisible = visible;
        if (!visible && planetLabel) {
            planetLabel.style.display = 'none';
        }
    }

    // Обработчики для вращения планеты мышью (отключены)
    function onMouseDown(event) {
        // Ничего не делаем - пусть OrbitControls обрабатывает
        return;
    }

    function onMouseMove(event) {
        // Ничего не делаем - пусть OrbitControls обрабатывает
        return;
    }

    function onMouseUp() {
        // Ничего не делаем - пусть OrbitControls обрабатывает
        return;
    }

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Основной обработчик кликов
    window.addEventListener('click', (event) => {
        // Если мы в режиме просмотра планеты
        if (isRotatingPlanet || isFollowingPlanet) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, currentCamera);
            const intersects = raycaster.intersectObjects(celestialObjects, true);

            // Выходим только если кликнули ДАЛЕКО от планеты (в пустоту)
            if (intersects.length === 0) {
                resetCamera();
                if (uiManager) {
                    uiManager.hidePlanetInfo();
                }
            }
            // Если кликнули на планету - НЕ выходим из режима просмотра
            return;
        }

        // Обычный режим - обрабатываем клики на планеты
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, currentCamera);
        const intersects = raycaster.intersectObjects(celestialObjects, true);

        if (intersects.length > 0) {
            let targetObject = intersects[0].object;

            if (targetObject.name === 'outline_mesh') return;

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

            const planetName = getPlanetNameFromObject(foundObject);
            if (planetName && uiManager) {
                directFocusOnObject(foundObject, planetName);
                uiManager.onPlanetClicked(planetName);
            }
        }
    });

    // Обработка клавиатуры
    window.addEventListener('keydown', (event) => {
        switch(event.code) {
            case 'KeyI':
                if (selectedObject && uiManager) {
                    const planetName = getPlanetNameFromObject(selectedObject);
                    if (planetName) {
                        const uiState = uiManager.getState();
                        if (uiState.infoVisible) {
                            uiManager.hidePlanetInfo();
                        } else {
                            uiManager.onPlanetClicked(planetName);
                        }
                    }
                }
                break;
            case 'Escape':
                if (isRotatingPlanet || isFollowingPlanet) {
                    resetCamera();
                    if (uiManager) {
                        uiManager.hidePlanetInfo();
                    }
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

        outlineObjects.forEach((data, object) => {
            if (data.fadeAnimation) {
                cancelAnimationFrame(data.fadeAnimation);
            }
            hideOutline(object);
        });

        if (planetLabel.parentNode) {
            planetLabel.parentNode.removeChild(planetLabel);
        }

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
            }

            outlineObjects.forEach((data, object) => {
                if (data && data.group && data.targetObject) {
                    if (data.targetObject.isMesh) {
                        data.group.position.copy(data.targetObject.position);
                        data.group.rotation.copy(data.targetObject.rotation);

                        data.outlines.forEach(outline => {
                            if (outline.userData.isMainMesh) {
                                outline.scale.copy(data.targetObject.scale);
                                outline.scale.multiplyScalar(1.1);
                            }
                        });
                    } else if (data.targetObject.isGroup) {
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

            // Обновляем позицию label если есть наведенный объект
            if (hoveredObject && planetLabel.style.display !== 'none' && labelsVisible) {
                updateLabelPosition(hoveredObject);
            }
        },
        getCurrentCamera: () => currentCamera,
        isUsingCloseUpCamera: () => currentCamera === closeUpCamera,
        getRotationMode: () => isRotatingPlanet,
        focusOnPlanet: focusOnPlanet,
        directFocusOnObject: directFocusOnObject,
        resetCamera: resetCamera,
        setLabelsVisible: setLabelsVisible,
        getCurrentPlanet: () => selectedObject ? getPlanetNameFromObject(selectedObject) : null,
        cleanup: cleanup
    };
}