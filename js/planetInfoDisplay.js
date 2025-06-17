import * as THREE from 'three';
import planetsData from './planetsData.json';

export class PlanetInfoDisplay {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.currentInfoSprite = null;
        this.currentInfoGroup = null;
        this.isVisible = false;

        // Créer le canvas pour le texte
        this.canvas = document.createElement('canvas');
        this.canvas.width = 1024;
        this.canvas.height = 768;
        this.context = this.canvas.getContext('2d');

        // Style par défaut
        this.style = {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: '#00ffff',
            borderWidth: 4,
            textColor: '#ffffff',
            titleColor: '#00ffff',
            font: 'Arial',
            fontSize: 28,
            titleFontSize: 36,
            padding: 30,
            lineHeight: 35
        };
    }

    // Obtenir les données d'une planète
    getPlanetData(planetName) {
        // Convertir le nom de la planète pour correspondre aux clés JSON
        const normalizedName = planetName.toLowerCase();
        return planetsData[normalizedName] || null;
    }

    // Créer la texture du texte
    createTextTexture(planetData) {
        const ctx = this.context;
        const canvas = this.canvas;

        // Nettoyer le canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dessiner le fond avec bordure
        ctx.fillStyle = this.style.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Dessiner la bordure
        ctx.strokeStyle = this.style.borderColor;
        ctx.lineWidth = this.style.borderWidth;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        // Configuration du texte
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        let y = this.style.padding;
        const x = this.style.padding;
        const maxWidth = canvas.width - (this.style.padding * 2);

        // Titre de la planète
        ctx.fillStyle = this.style.titleColor;
        ctx.font = `bold ${this.style.titleFontSize}px ${this.style.font}`;
        ctx.fillText(planetData.name, x, y);
        y += this.style.titleFontSize + 20;

        // Nom en français
        ctx.fillStyle = this.style.textColor;
        ctx.font = `italic ${this.style.fontSize}px ${this.style.font}`;
        ctx.fillText(`(${planetData.nameInFrench})`, x, y);
        y += this.style.fontSize + 25;

        // Informations détaillées
        ctx.font = `${this.style.fontSize}px ${this.style.font}`;

        const info = [
            `Diameter: ${planetData.diameter}`,
            `Distance to Sun: ${planetData.distanceToSun}`,
            `Satellites: ${planetData.satellites}`,
            `Rotation Duration: ${planetData.rotationDuration}`,
            `Orbital Period: ${planetData.orbitalPeriod}`
        ];

        info.forEach(line => {
            ctx.fillText(line, x, y);
            y += this.style.lineHeight;
        });

        y += 15;

        // Description
        ctx.fillStyle = this.style.titleColor;
        ctx.font = `bold ${this.style.fontSize}px ${this.style.font}`;
        ctx.fillText('Description:', x, y);
        y += this.style.lineHeight;

        ctx.fillStyle = this.style.textColor;
        ctx.font = `${this.style.fontSize}px ${this.style.font}`;

        // Diviser la description en lignes
        const descriptionLines = this.wrapText(planetData.description, maxWidth);
        descriptionLines.forEach(line => {
            ctx.fillText(line, x, y);
            y += this.style.lineHeight;
        });

        y += 15;

        // Fait intéressant
        ctx.fillStyle = this.style.titleColor;
        ctx.font = `bold ${this.style.fontSize}px ${this.style.font}`;
        ctx.fillText('Interesting Fact:', x, y);
        y += this.style.lineHeight;

        ctx.fillStyle = '#ffff00'; // Jaune pour le fait intéressant
        ctx.font = `italic ${this.style.fontSize}px ${this.style.font}`;

        const factLines = this.wrapText(planetData.interestingFact, maxWidth);
        factLines.forEach(line => {
            ctx.fillText(line, x, y);
            y += this.style.lineHeight;
        });

        // Créer la texture
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        return texture;
    }

    // Fonction pour diviser le texte en lignes
    wrapText(text, maxWidth) {
        const ctx = this.context;
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    // Afficher les informations d'une planète
    showPlanetInfo(planetName, planetPosition) {
        // Cacher l'info actuelle si elle existe
        this.hidePlanetInfo();

        const planetData = this.getPlanetData(planetName);
        if (!planetData) {
            console.warn(`No data found for planet: ${planetName}`);
            return;
        }

        // Créer la texture du texte
        const textTexture = this.createTextTexture(planetData);

        // Créer le matériau du sprite
        const spriteMaterial = new THREE.SpriteMaterial({
            map: textTexture,
            transparent: true,
            opacity: 0.95
        });

        // Créer le sprite
        this.currentInfoSprite = new THREE.Sprite(spriteMaterial);

        // Taille du sprite (ajustée pour être lisible)
        const scale = 15;
        this.currentInfoSprite.scale.set(
            scale * (this.canvas.width / this.canvas.height),
            scale,
            1
        );

        // Créer un groupe pour le sprite et le positionner
        this.currentInfoGroup = new THREE.Group();
        this.currentInfoGroup.add(this.currentInfoSprite);

        // Positionner le panneau d'information à côté de la planète
        const offset = new THREE.Vector3(12, 8, 0);
        this.currentInfoGroup.position.copy(planetPosition).add(offset);

        // Ajouter à la scène
        this.scene.add(this.currentInfoGroup);
        this.isVisible = true;

        console.log(`Showing info for ${planetData.name}`);
    }

    // Cacher les informations
    hidePlanetInfo() {
        if (this.currentInfoGroup) {
            this.scene.remove(this.currentInfoGroup);
            this.currentInfoGroup = null;
            this.currentInfoSprite = null;
            this.isVisible = false;
        }
    }

    // Mettre à jour la position du panneau d'info pour qu'il reste face à la caméra
    update(planetPosition = null) {
        if (this.currentInfoGroup && this.isVisible) {
            if (planetPosition) {
                // Mettre à jour la position si la planète bouge
                const offset = new THREE.Vector3(12, 8, 0);
                this.currentInfoGroup.position.copy(planetPosition).add(offset);
            }

            // Le sprite se tourne automatiquement vers la caméra
            // mais on peut ajuster la position pour qu'il reste visible
            this.currentInfoSprite.lookAt(this.camera.position);
        }
    }

    // Vérifier si les informations sont actuellement affichées
    isInfoVisible() {
        return this.isVisible;
    }

    // Changer le style d'affichage
    setStyle(newStyle) {
        this.style = { ...this.style, ...newStyle };
    }
}

// Fonction utilitaire pour obtenir le nom de la planète à partir d'un objet 3D
export function getPlanetNameFromObject(object) {
    // Vérifier les userData de l'objet et de ses parents
    let currentObject = object;
    while (currentObject) {
        if (currentObject.userData && currentObject.userData.name) {
            return currentObject.userData.name;
        }
        currentObject = currentObject.parent;
    }

    // Fallback basé sur le nom de l'objet
    if (object.name) {
        return object.name.toLowerCase();
    }

    return null;
}