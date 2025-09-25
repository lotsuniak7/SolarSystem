export default {
  "sun": {
    "name": "Sun",
    "displayName": "☀️ Sun",
    "nameInFrench": "Soleil",
    "3d": {
      "radius": 5,
      "segments": 32,
      "texture": "../textures/sun.jpg",
      "material": "MeshBasicMaterial",
      "orbitRadius": 0,
      "orbitSpeed": 0,
      "rotationSpeed": 0.005,
      "position": [0, 0, 0],
      "rotation": [0, 0, 0],
      "castShadow": false,
      "receiveShadow": false,
      "hasLight": true,
      "lightIntensity": 4000
    },
    "info": {
      "diameter": "1,392,700 km",
      "distanceToSun": "0 km",
      "satellites": 0,
      "rotationDuration": "25-35 days",
      "orbitalPeriod": "N/A",
      "description": "The Sun is the star at the center of our Solar System. It is a nearly perfect sphere of hot plasma, with internal convective motion that generates a magnetic field.",
      "interestingFact": "The Sun's core temperature reaches 15 million degrees Celsius!"
    }
  },
  "mercury": {
    "name": "Mercury",
    "displayName": "☿ Mercury",
    "nameInFrench": "Mercure",
    "3d": {
      "radius": 0.6,
      "segments": 32,
      "texture": "../textures/mercury.jpg",
      "material": "MeshPhongMaterial",
      "orbitRadius": 25,
      "orbitSpeed": 0.2,
      "rotationSpeed": 0.005,
      "position": [25, 0, 0],
      "rotation": [0, 0, 0],
      "castShadow": true,
      "receiveShadow": true
    },
    "info": {
      "diameter": "4,879 km",
      "distanceToSun": "57,909,175 km",
      "satellites": 0,
      "rotationDuration": "58 days and 15 hours",
      "orbitalPeriod": "88 days",
      "description": "The closest planet to the Sun. Mercury rotates three times on its axis every two revolutions around the Sun. It is called spin-orbit resonance.",
      "interestingFact": "Mercury has extreme temperature variations: 427°C during the day and -173°C at night!"
    }
  },
  "venus": {
    "name": "Venus",
    "displayName": "♀ Venus",
    "nameInFrench": "Vénus",
    "3d": {
      "radius": 1.2,
      "segments": 32,
      "texture": "../textures/venus.jpg",
      "material": "MeshPhongMaterial",
      "orbitRadius": 35,
      "orbitSpeed": 0.12,
      "rotationSpeed": 0.003,
      "position": [35, 0, 0],
      "rotation": [0, 0, 0],
      "castShadow": true,
      "receiveShadow": true
    },
    "info": {
      "diameter": "12,104 km",
      "distanceToSun": "108,208,930 km",
      "satellites": 0,
      "rotationDuration": "243 days",
      "orbitalPeriod": "225 days",
      "description": "Venus is the hottest planet in our solar system due to its thick atmosphere of carbon dioxide. It rotates backwards compared to most planets.",
      "interestingFact": "A day on Venus is longer than its year!"
    }
  },
  "earth": {
    "name": "Earth",
    "displayName": "🌍 Earth",
    "nameInFrench": "Terre",
    "3d": {
      "radius": 1.8,
      "segments": 64,
      "texture": "../textures/earth.jpg",
      "material": "MeshPhongMaterial",
      "orbitRadius": 40,
      "orbitSpeed": 0.08,
      "rotationSpeed": 0.01,
      "position": [40, 0, 0],
      "rotation": [0, 0, -0.408],
      "castShadow": true,
      "receiveShadow": true,
      "isGroup": true,
      "layers": [
        {
          "type": "clouds",
          "texture": "../textures/earth_clouds.jpg",
          "alphaMap": "../textures/earth_clouds.jpg",
          "scale": 1.03,
          "opacity": 1,
          "renderOrder": 2
        },
        {
          "type": "nightLights",
          "texture": "../textures/earth_nightmap.jpg",
          "blending": "AdditiveBlending",
          "renderOrder": 1
        }
      ]
    },
    "info": {
      "diameter": "12,756 km",
      "distanceToSun": "149,597,870 km",
      "satellites": 1,
      "rotationDuration": "24 hours",
      "orbitalPeriod": "365.25 days",
      "description": "The only known planet to harbor life. Earth has liquid water, a protective atmosphere, and a suitable temperature for life to thrive.",
      "interestingFact": "Earth is the only planet not named after a Roman or Greek god!"
    },
    "satellites": ["moon"]
  },
  "moon": {
    "name": "Moon",
    "displayName": "🌙 Moon",
    "nameInFrench": "Lune",
    "3d": {
      "radius": 0.4,
      "segments": 32,
      "texture": "../textures/moon.jpg",
      "material": "MeshPhongMaterial",
      "orbitRadius": 3,
      "orbitSpeed": 2.5,
      "rotationSpeed": 0.008,
      "position": [43, 0, 0],
      "rotation": [0, 0, 0],
      "castShadow": true,
      "receiveShadow": true,
      "parent": "earth"
    },
    "info": {
      "diameter": "3,474 km",
      "distanceToSun": "149,597,870 km (same as Earth)",
      "satellites": 0,
      "rotationDuration": "27.3 days",
      "orbitalPeriod": "27.3 days (around Earth)",
      "description": "Earth's only natural satellite. The Moon influences Earth's tides and has been a source of wonder and inspiration throughout human history.",
      "interestingFact": "The Moon is moving away from Earth at a rate of about 3.8 cm per year!"
    }
  },
  "mars": {
    "name": "Mars",
    "displayName": "♂ Mars",
    "nameInFrench": "Mars",
    "3d": {
      "radius": 0.675,
      "segments": 32,
      "texture": "../textures/mars.jpg",
      "material": "MeshLambertMaterial",
      "orbitRadius": 45,
      "orbitSpeed": 0.053,
      "rotationSpeed": 0.01,
      "position": [45, 0, 0],
      "rotation": [0, 0, 0],
      "castShadow": true,
      "receiveShadow": true
    },
    "info": {
      "diameter": "6,792 km",
      "distanceToSun": "227,936,640 km",
      "satellites": 2,
      "rotationDuration": "24 hours and 37 minutes",
      "orbitalPeriod": "687 days",
      "description": "Known as the Red Planet due to iron oxide on its surface. Mars has the largest volcano in the solar system, Olympus Mons.",
      "interestingFact": "Mars has seasons similar to Earth because it has a similar axial tilt!"
    }
  },
  "jupiter": {
    "name": "Jupiter",
    "displayName": "♃ Jupiter",
    "nameInFrench": "Jupiter",
    "3d": {
      "radius": 2.75,
      "segments": 32,
      "texture": "../textures/jupiter.jpg",
      "material": "MeshPhongMaterial",
      "orbitRadius": 55,
      "orbitSpeed": 0.0084,
      "rotationSpeed": 0.015,
      "position": [55, 0, 0],
      "rotation": [0, 0, 0],
      "castShadow": true,
      "receiveShadow": true
    },
    "info": {
      "diameter": "142,984 km",
      "distanceToSun": "778,412,010 km",
      "satellites": 95,
      "rotationDuration": "9 hours and 56 minutes",
      "orbitalPeriod": "12 years",
      "description": "The largest planet in our solar system. Jupiter is a gas giant with a Great Red Spot that is a storm larger than Earth.",
      "interestingFact": "Jupiter acts as a cosmic vacuum cleaner, protecting inner planets from asteroids and comets!"
    }
  },
  "saturn": {
    "name": "Saturn",
    "displayName": "♄ Saturn",
    "nameInFrench": "Saturne",
    "3d": {
      "radius": 2.3,
      "segments": 32,
      "texture": "../textures/saturn.jpg",
      "material": "MeshPhongMaterial",
      "orbitRadius": 70,
      "orbitSpeed": 0.006,
      "rotationSpeed": 0.012,
      "position": [70, 0, 0],
      "rotation": [0, 0, 0],
      "castShadow": true,
      "receiveShadow": true,
      "hasRings": true,
      "rings": {
        "innerRadius": 2.5,
        "outerRadius": 4.2,
        "texture": "../textures/saturn_rings.png",
        "opacity": 0.8
      }
    },
    "info": {
      "diameter": "120,536 km",
      "distanceToSun": "1,426,725,400 km",
      "satellites": 146,
      "rotationDuration": "10 hours and 42 minutes",
      "orbitalPeriod": "29 years",
      "description": "Famous for its spectacular ring system made of ice and rock particles. Saturn is less dense than water.",
      "interestingFact": "Saturn would float in water if there was a bathtub big enough!"
    }
  },
  "uranus": {
    "name": "Uranus",
    "displayName": "♅ Uranus",
    "nameInFrench": "Uranus",
    "3d": {
      "radius": 1.6,
      "segments": 32,
      "texture": "../textures/uranus.jpg",
      "material": "MeshPhongMaterial",
      "orbitRadius": 85,
      "orbitSpeed": 0.004,
      "rotationSpeed": 0.008,
      "position": [85, 0, 0],
      "rotation": [0, 0, 1.71],
      "castShadow": true,
      "receiveShadow": true
    },
    "info": {
      "diameter": "51,118 km",
      "distanceToSun": "2,870,972,200 km",
      "satellites": 27,
      "rotationDuration": "17 hours and 14 minutes",
      "orbitalPeriod": "84 years",
      "description": "An ice giant that rotates on its side. Uranus has a unique tilted axis of rotation and faint rings.",
      "interestingFact": "Uranus rotates on its side with an axial tilt of 98 degrees!"
    }
  },
  "neptune": {
    "name": "Neptune",
    "displayName": "♆ Neptune",
    "nameInFrench": "Neptune",
    "3d": {
      "radius": 1.55,
      "segments": 32,
      "texture": "../textures/neptune.jpg",
      "material": "MeshPhongMaterial",
      "orbitRadius": 100,
      "orbitSpeed": 0.003,
      "rotationSpeed": 0.009,
      "position": [100, 0, 0],
      "rotation": [0, 0, 0],
      "castShadow": true,
      "receiveShadow": true
    },
    "info": {
      "diameter": "49,528 km",
      "distanceToSun": "4,498,252,900 km",
      "satellites": 16,
      "rotationDuration": "16 hours and 7 minutes",
      "orbitalPeriod": "165 years",
      "description": "The windiest planet with speeds reaching 2,100 km/h. Neptune is a deep blue ice giant with a dynamic atmosphere.",
      "interestingFact": "Neptune has the strongest winds in the solar system, reaching up to 2,100 km/h!"
    }
  },
  "pluto": {
    "name": "Pluto",
    "displayName": "♇ Pluto",
    "nameInFrench": "Pluton",
    "3d": {
      "radius": 0.3,
      "segments": 32,
      "texture": "../textures/pluto.jpg",
      "material": "MeshPhongMaterial",
      "orbitRadius": 115,
      "orbitSpeed": 0.002,
      "rotationSpeed": 0.006,
      "position": [115, 0, 0],
      "rotation": [0, 0, 0],
      "castShadow": true,
      "receiveShadow": true
    },
    "info": {
      "diameter": "2,376 km",
      "distanceToSun": "5,906,376,200 km",
      "satellites": 5,
      "rotationDuration": "6 days and 9 hours",
      "orbitalPeriod": "248 years",
      "description": "Once the ninth planet, now classified as a dwarf planet. Pluto has a heart-shaped plain and a complex relationship with its moon Charon.",
      "interestingFact": "Pluto and its moon Charon are tidally locked and always show the same face to each other!"
    }
  }
}