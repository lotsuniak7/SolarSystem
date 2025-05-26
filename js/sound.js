export function initSound() {
    const spaceAudio = document.getElementById('space-audio');
    const sunAudio = document.getElementById('sun-audio');

    // Убедимся, что loop активирован для фонового звука
    spaceAudio.loop = true;
    sunAudio.loop = true; // Зацикливание звука Солнца

    // Начальная громкость
    let spaceVolume = 1.0;
    let sunVolume = 0.0;

    // Автозапуск фоновой музыки при загрузке страницы
    window.addEventListener('load', () => {
        spaceAudio.play().catch(error => {
            console.error('Error playing space audio:', error);
            document.addEventListener('click', () => {
                spaceAudio.play().catch(error => {
                    console.error('Error playing space audio on click:', error);
                });
            }, { once: true });
        });
    });

    // Отладка
    spaceAudio.addEventListener('ended', () => {
        console.log('Space audio ended - should loop');
    });

    // Функция для управления звуком Солнца и фоном
    function toggleSunSound(isNearSun) {
        if (isNearSun) {
            // Приближение к Солнцу: увеличиваем громкость звука Солнца, уменьшаем фон
            sunVolume = Math.min(sunVolume + 0.1, 1.0); // Плавное увеличение до максимума
            spaceVolume = Math.max(spaceVolume - 0.2, 0.2); // Уменьшаем фон, но не до нуля
            sunAudio.volume = sunVolume;
            spaceAudio.volume = spaceVolume;
            if (sunAudio.paused) {
                sunAudio.play().catch(error => {
                    console.error('Error playing sun audio:', error);
                });
            }
        } else {
            // Отдаление от Солнца: уменьшаем громкость звука Солнца, возвращаем фон
            sunVolume = Math.max(sunVolume - 0.1, 0.0); // Плавное уменьшение до нуля
            spaceVolume = Math.min(spaceVolume + 0.2, 1.0); // Возвращаем громкость фона
            sunAudio.volume = sunVolume;
            spaceAudio.volume = spaceVolume;
            if (sunVolume <= 0 && !sunAudio.paused) {
                sunAudio.pause();
                sunAudio.currentTime = 0; // Сброс на начало
            }
        }
    }

    return {
        //playSpace: () => spaceAudio.play(),
        //pauseSpace: () => spaceAudio.pause(),
        setSpaceVolume: (volume) => (spaceAudio.volume = volume),
        toggleSun: toggleSunSound // Экспортируем функцию для звука Солнца
    };
}