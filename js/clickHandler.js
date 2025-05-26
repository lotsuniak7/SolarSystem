import * as THREE from "three";

export function initClickHandler(celestialObjects, camera, scene, controls)
{
    // Raycaster pour definir les clicks || Raycaster для определения кликов
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selectedObject = null; // Planète choisie
    let isFollowingPlanet = false; // Режим слежения
    // const initialCameraPosition = new THREE.Vector3(0, 30, 50); // on sauvegarde la position initial
    // const initialCameraTarget = new THREE.Vector3(0, 0, 0); // Сохраняем начальную цель

    window.addEventListener('click', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(celestialObjects, true);

        if (intersects.length > 0) {
            // Находим родительскую группу или сам объект
            let targetObject = intersects[0].object;

            // Если кликнули на дочерний объект группы, поднимаемся к родителю
            while (targetObject.parent && targetObject.parent.type === 'Group' && targetObject.parent !== scene) {
                targetObject = targetObject.parent;
            }

            selectedObject = targetObject;
            isFollowingPlanet = true;
            controls.enabled = false;

            console.log('Selected object:', selectedObject);
            console.log('Object position:', selectedObject.position);

        } else if (isFollowingPlanet) {
            // Клик по пустому месту
            isFollowingPlanet = false;
            selectedObject = null;
            controls.enabled = true; // Включаем OrbitControls
        }
    });

    return {
        // getSelectedObject: () => selectedObject,
        // getIsFollowingPlanet: () => isFollowingPlanet,
        updateCamera: (camera) => {
            if (isFollowingPlanet && selectedObject) {
                // Получаем мировую позицию объекта
                const worldPosition = new THREE.Vector3();
                selectedObject.getWorldPosition(worldPosition);

                // Определяем размер объекта для правильного смещения
                let objectSize = 1; // значение по умолчанию
                if (selectedObject.userData && selectedObject.userData.name === 'earth') {
                    objectSize = 0.5; // радиус Земли
                } else if (selectedObject.geometry && selectedObject.geometry.parameters) {
                    objectSize = selectedObject.geometry.parameters.radius || 1;
                }

                // Смещение камеры
                const offset = new THREE.Vector3(
                    objectSize * 4, // Вправо
                    objectSize * 2, // Вверх
                    objectSize * 6  // Отдаление
                );

                // Целевая позиция камеры
                const targetPosition = new THREE.Vector3().copy(worldPosition).add(offset);

                // Плавное перемещение камеры
                camera.position.lerp(targetPosition, 0.05); // Уменьшил скорость для плавности

                // Камера смотрит на объект
                camera.lookAt(worldPosition);
            }
        }
    };
}