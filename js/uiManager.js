import planetsData from './planetsData.json';

export class UIManager {
    constructor(clickHandler, animationControls) {
        this.clickHandler = clickHandler;
        this.animationControls = animationControls;
        this.isUIVisible = true;
        this.currentPlanet = null;
        this.orbitsVisible = true;
        this.labelsVisible = true;

        this.initializeUI();
        this.bindEvents();
    }

    initializeUI() {
        // Get UI elements
        this.planetNav = document.getElementById('planet-nav');
        this.planetInfo = document.getElementById('planet-info');
        this.satellitesPanel = document.getElementById('satellites-panel');
        this.controlsPanel = document.getElementById('controls-panel');
        this.toggleBtn = document.getElementById('toggle-ui');
        this.loadingScreen = document.getElementById('loading-screen');
        this.planetButtons = document.querySelectorAll('.planet-btn');
        this.closeInfoBtn = document.getElementById('close-info');

        // Controls
        this.resetCameraBtn = document.getElementById('reset-camera');
        this.toggleOrbitsBtn = document.getElementById('toggle-orbits');
        this.toggleLabelsBtn = document.getElementById('toggle-labels');
        this.animationSpeedSlider = document.getElementById('animation-speed');
        this.speedValue = document.getElementById('speed-value');

        console.log('UI Manager initialized');
    }

    bindEvents() {
        // Planet button events
        this.planetButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const planetName = e.target.dataset.planet;
                this.onPlanetClicked(planetName);
            });
        });

        // Satellite button events (динамически добавляемые)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('satellite-btn')) {
                const satelliteName = e.target.dataset.satellite;
                this.onSatelliteClicked(satelliteName);
            }
        });

        // Close info panel
        if (this.closeInfoBtn) {
            this.closeInfoBtn.addEventListener('click', () => {
                this.hidePlanetInfo();
            });
        }

        // Toggle UI visibility
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => {
                this.toggleUIVisibility();
            });
        }

        // Control buttons
        if (this.resetCameraBtn) {
            this.resetCameraBtn.addEventListener('click', () => {
                this.resetCamera();
            });
        }

        if (this.toggleOrbitsBtn) {
            this.toggleOrbitsBtn.addEventListener('click', () => {
                this.toggleOrbits();
            });
        }

        if (this.toggleLabelsBtn) {
            this.toggleLabelsBtn.addEventListener('click', () => {
                this.toggleLabels();
            });
        }

        // Animation speed control
        if (this.animationSpeedSlider && this.speedValue) {
            this.animationSpeedSlider.addEventListener('input', (e) => {
                const speed = parseFloat(e.target.value);
                this.updateAnimationSpeed(speed);
                this.speedValue.textContent = `${speed}x`;
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Close info panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#planet-info') &&
                !e.target.closest('.planet-btn') &&
                !e.target.closest('#satellites-panel') &&
                this.planetInfo && this.planetInfo.classList.contains('show')) {
                this.hidePlanetInfo();
            }
        });
    }

    // Данные о спутниках планет
    getSatelliteData() {
        return {
            earth: [
                { name: 'moon', displayName: '🌙 Moon' }
            ],
            jupiter: [
                { name: 'io', displayName: '🌕 Io' },
                { name: 'europa', displayName: '🌕 Europa' },
                { name: 'ganymede', displayName: '🌕 Ganymede' },
                { name: 'callisto', displayName: '🌕 Callisto' }
            ],
            saturn: [
                { name: 'titan', displayName: '🌕 Titan' },
                { name: 'enceladus', displayName: '🌕 Enceladus' },
                { name: 'mimas', displayName: '🌕 Mimas' }
            ],
            mars: [
                { name: 'phobos', displayName: '🌑 Phobos' },
                { name: 'deimos', displayName: '🌑 Deimos' }
            ],
            uranus: [
                { name: 'miranda', displayName: '🌕 Miranda' },
                { name: 'ariel', displayName: '🌕 Ariel' }
            ],
            neptune: [
                { name: 'triton', displayName: '🌕 Triton' }
            ]
        };
    }

    showPlanetInfo(planetName) {
        const planetData = this.getPlanetData(planetName);
        console.log('🐛 Debug planetData for', planetName, ':', planetData); // ОТЛАДКА

        if (!planetData) {
            console.warn(`No data found for planet: ${planetName}`);
            return;
        }

        // Update planet info content
        this.updatePlanetInfoContent(planetData);

        // Show the info panel
        if (this.planetInfo) {
            this.planetInfo.classList.add('show');
        }
        this.currentPlanet = planetName;

        // Показываем спутники если они есть
        this.showSatellites(planetName);

        console.log(`Showing UI info for ${planetData.name}`);
    }

    hidePlanetInfo() {
        if (this.planetInfo) {
            this.planetInfo.classList.remove('show');
        }

        if (this.satellitesPanel) {
            this.satellitesPanel.classList.remove('show');
        }

        this.currentPlanet = null;
        this.clearActivePlanet();
    }

    showSatellites(planetName) {
        if (!this.satellitesPanel) return;

        const satellitesContent = document.getElementById('satellites-content');
        const satelliteData = this.getSatelliteData();

        if (!satellitesContent) return;

        const satellites = satelliteData[planetName.toLowerCase()];

        if (satellites && satellites.length > 0) {
            let html = '';
            satellites.forEach(satellite => {
                html += `<button class="satellite-btn" data-satellite="${satellite.name}">${satellite.displayName}</button>`;
            });
            satellitesContent.innerHTML = html;
            this.satellitesPanel.classList.add('show');
        } else {
            this.satellitesPanel.classList.remove('show');
        }
    }

    onSatelliteClicked(satelliteName) {
        console.log(`Satellite clicked: ${satelliteName}`);

        // Для луны фокусируемся на ней
        if (satelliteName === 'moon' && this.clickHandler) {
            this.clickHandler.focusOnPlanet('moon');
            this.showPlanetInfo('moon');
            this.setActivePlanet('moon');

            // Активируем кнопку спутника
            const satelliteButtons = document.querySelectorAll('.satellite-btn');
            satelliteButtons.forEach(btn => btn.classList.remove('active'));
            const activeBtn = document.querySelector(`[data-satellite="${satelliteName}"]`);
            if (activeBtn) activeBtn.classList.add('active');
        } else {
            // Для других спутников пока просто показываем информацию
            alert(`${satelliteName} information would be displayed here. This satellite is not yet implemented in the 3D scene.`);
        }
    }

    updatePlanetInfoContent(planetData) {
        const planetName = document.getElementById('planet-name');
        const planetInfoContent = document.getElementById('planet-info-content');

        if (planetName) planetName.textContent = planetData.name;

        if (planetInfoContent) {
            // Проверяем структуру данных и используем правильную
            const info = planetData.info || planetData; // Fallback если нет info секции

            planetInfoContent.innerHTML = `
            <div class="info-section">
                <h4>Basic Information</h4>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Name (French)</strong>
                        ${planetData.nameInFrench || 'N/A'}
                    </div>
                    <div class="info-item">
                        <strong>Diameter</strong>
                        ${info.diameter || 'N/A'}
                    </div>
                    <div class="info-item">
                        <strong>Distance to Sun</strong>
                        ${info.distanceToSun || 'N/A'}
                    </div>
                    <div class="info-item">
                        <strong>Satellites</strong>
                        ${info.satellites || 0}
                    </div>
                    <div class="info-item">
                        <strong>Rotation Duration</strong>
                        ${info.rotationDuration || 'N/A'}
                    </div>
                    <div class="info-item">
                        <strong>Orbital Period</strong>
                        ${info.orbitalPeriod || 'N/A'}
                    </div>
                </div>
            </div>

            <div class="info-section">
                <h4>Description</h4>
                <div class="description">
                    ${info.description || 'No description available'}
                </div>
            </div>

            <div class="info-section">
                <div class="interesting-fact">
                    <h4>💡 Interesting Fact</h4>
                    ${info.interestingFact || 'No interesting fact available'}
                </div>
            </div>
        `;
        }
    }


    getPlanetData(planetName) {
        const normalizedName = planetName.toLowerCase();
        return planetsData[normalizedName] || null;
    }

    setActivePlanet(planetName) {
        // Remove active class from all buttons
        this.planetButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to selected button
        const activeBtn = document.querySelector(`[data-planet="${planetName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    clearActivePlanet() {
        this.planetButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        const satelliteButtons = document.querySelectorAll('.satellite-btn');
        satelliteButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        console.log('Cleared all active planet buttons');
    }

    toggleUIVisibility() {
        this.isUIVisible = !this.isUIVisible;
        const uiContainer = document.getElementById('ui-container');

        if (this.isUIVisible) {
            uiContainer.classList.remove('ui-hidden');
        } else {
            uiContainer.classList.add('ui-hidden');
        }
    }

    resetCamera() {
        if (this.clickHandler && this.clickHandler.resetCamera) {
            this.clickHandler.resetCamera();
            this.hidePlanetInfo(); // Это уже вызывает clearActivePlanet()
        }
        console.log('Camera reset to initial position');
    }


    toggleOrbits() {
        this.orbitsVisible = !this.orbitsVisible;

        // Переключаем видимость орбит в сцене
        if (window.solarSystemScene) {
            window.solarSystemScene.traverse((child) => {
                if (child.name && child.name.includes('orbit')) {
                    child.visible = this.orbitsVisible;
                }
            });
        }

        // Обновляем кнопку
        if (this.toggleOrbitsBtn) {
            if (this.orbitsVisible) {
                this.toggleOrbitsBtn.classList.remove('active');
                this.toggleOrbitsBtn.textContent = '🔄 Hide Orbits';
            } else {
                this.toggleOrbitsBtn.classList.add('active');
                this.toggleOrbitsBtn.textContent = '🔄 Show Orbits';
            }
        }

        console.log(`Orbits ${this.orbitsVisible ? 'shown' : 'hidden'}`);
    }

    toggleLabels() {
        this.labelsVisible = !this.labelsVisible;

        // Переключаем видимость меток
        const planetLabel = document.getElementById('planet-label');
        if (planetLabel && !this.labelsVisible) {
            planetLabel.style.display = 'none';
        }

        // Сохраняем состояние для clickHandler
        if (this.clickHandler && this.clickHandler.setLabelsVisible) {
            this.clickHandler.setLabelsVisible(this.labelsVisible);
        }

        // Обновляем кнопку
        if (this.toggleLabelsBtn) {
            if (this.labelsVisible) {
                this.toggleLabelsBtn.classList.remove('active');
                this.toggleLabelsBtn.textContent = '🏷️ Hide Labels';
            } else {
                this.toggleLabelsBtn.classList.add('active');
                this.toggleLabelsBtn.textContent = '🏷️ Show Labels';
            }
        }

        console.log(`Labels ${this.labelsVisible ? 'shown' : 'hidden'}`);
    }

    updateAnimationSpeed(speed) {
        // Обновляем скорость через глобальный контроллер
        if (window.globalAnimationController && window.globalAnimationController.setAnimationSpeed) {
            window.globalAnimationController.setAnimationSpeed(speed);
        }
        console.log(`Animation speed set to ${speed}x`);
    }

    handleKeyboardShortcuts(event) {
        switch(event.code) {
            case 'KeyH':
                this.toggleUIVisibility();
                break;
            case 'KeyR':
                this.resetCamera();
                break;
            case 'KeyO':
                this.toggleOrbits();
                break;
            case 'KeyL':
                this.toggleLabels();
                break;
            case 'Escape':
                if (this.currentPlanet) {
                    this.hidePlanetInfo();
                }
                break;
            case 'KeyI':
                if (this.currentPlanet) {
                    if (this.planetInfo && this.planetInfo.classList.contains('show')) {
                        this.hidePlanetInfo();
                    } else {
                        this.showPlanetInfo(this.currentPlanet);
                    }
                }
                break;
        }
    }

    showLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.remove('hidden');
        }
    }

    hideLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('hidden');
        }
    }

    updateLoadingProgress(percentage) {
        const progressBar = document.getElementById('loading-progress');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
    }

    // Method to be called when a planet is clicked in 3D scene
    onPlanetClicked(planetName) {
        console.log(`UI: Planet clicked: ${planetName}`);

        // Сначала показываем информацию
        this.showPlanetInfo(planetName);
        this.setActivePlanet(planetName);

        // Затем фокусируемся на планете
        if (this.clickHandler && this.clickHandler.focusOnPlanet) {
            console.log(`UI: Calling focusOnPlanet for: ${planetName}`);
            const success = this.clickHandler.focusOnPlanet(planetName);
            console.log(`UI: Focus result: ${success}`);

            if (!success) {
                console.error(`UI: Failed to focus on planet: ${planetName}`);
                // Попробуем альтернативный способ
                this.focusOnPlanetAlternative(planetName);
            }
        } else {
            console.error('UI: clickHandler or focusOnPlanet method not available');
        }
    }

    focusOnPlanetAlternative(planetName) {
        console.log(`UI: Trying alternative focus method for: ${planetName}`);

        // Получаем объекты через глобальную переменную
        if (window.solarSystemApp && window.solarSystemApp.celestialObjects) {
            const celestialObjects = window.solarSystemApp.celestialObjects;

            const targetObject = celestialObjects.find(obj => {
                // Проверяем userData
                if (obj.userData && obj.userData.name) {
                    return obj.userData.name.toLowerCase() === planetName.toLowerCase();
                }
                return false;
            });

            if (targetObject) {
                console.log(`UI: Found target object for ${planetName}:`, targetObject);

                // Вызываем фокусировку напрямую
                if (this.clickHandler) {
                    this.clickHandler.directFocusOnObject(targetObject, planetName);
                }
            } else {
                console.error(`UI: Could not find object for planet: ${planetName}`);
            }
        }
    }

    // Method to highlight planet button when hovered in 3D scene
    onPlanetHovered(planetName) {
        const btn = document.querySelector(`[data-planet="${planetName}"]`);
        if (btn && !btn.classList.contains('active')) {
            btn.style.background = 'linear-gradient(135deg, rgba(0, 150, 200, 0.6), rgba(0, 100, 150, 0.6))';
        }
    }

    // Method to remove highlight when planet is no longer hovered
    onPlanetUnhovered(planetName) {
        const btn = document.querySelector(`[data-planet="${planetName}"]`);
        if (btn && !btn.classList.contains('active')) {
            btn.style.background = '';
        }
    }

    // Get current UI state
    getState() {
        return {
            isUIVisible: this.isUIVisible,
            currentPlanet: this.currentPlanet,
            infoVisible: this.planetInfo ? this.planetInfo.classList.contains('show') : false
        };
    }
}