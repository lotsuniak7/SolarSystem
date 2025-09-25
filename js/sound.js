// js/sound.js - Исправленная система управления звуками

export function initSound() {
    console.log('🎵 Initializing sound system...');

    // Получаем аудио элементы из HTML (они должны быть там)
    const spaceAudio = document.getElementById('space-audio');
    const sunAudio = document.getElementById('sun-audio');

    // Проверяем наличие элементов
    if (!spaceAudio || !sunAudio) {
        console.warn('Audio elements not found in HTML');
        return createDummySoundControls();
    }

    console.log('✅ Audio elements found:', { spaceAudio, sunAudio });

    // Переменные для управления воспроизведением
    let isSpacePlaying = false;
    let isSunPlaying = false;
    let spaceVolume = 0.3;
    let sunVolume = 0.2;

    // Настройка начальных параметров
    spaceAudio.loop = true;
    spaceAudio.volume = spaceVolume;
    sunAudio.loop = true;
    sunAudio.volume = sunVolume;

    // Функция для безопасного воспроизведения
    function safePlay(audio, name) {
        if (!audio) return Promise.reject('Audio element not found');

        return audio.play().then(() => {
            console.log(`${name} audio started successfully`);
        }).catch(error => {
            console.warn(`Failed to play ${name} audio:`, error);
            // Создаем событие клика для разблокировки аудио
            createAudioUnlockHandler(audio, name);
        });
    }

    // Функция для создания обработчика разблокировки аудио
    function createAudioUnlockHandler(audio, name) {
        const unlockAudio = () => {
            audio.play().then(() => {
                console.log(`${name} audio unlocked and started`);
                document.removeEventListener('click', unlockAudio);
            }).catch(() => {
                console.warn(`Still can't play ${name} audio after user interaction`);
            });
        };

        document.addEventListener('click', unlockAudio, { once: true });
        console.log(`Click handler created to unlock ${name} audio`);
    }

    // Запуск фоновой космической музыки
    function startSpaceAudio() {
        if (!isSpacePlaying) {
            safePlay(spaceAudio, 'space');
            isSpacePlaying = true;
        }
    }

    // Остановка космической музыки
    function stopSpaceAudio() {
        if (isSpacePlaying && spaceAudio) {
            spaceAudio.pause();
            spaceAudio.currentTime = 0;
            isSpacePlaying = false;
            console.log('Space audio stopped');
        }
    }

    // Управление звуком Солнца
    function toggleSun(shouldPlay) {
        if (!sunAudio) return;

        if (shouldPlay && !isSunPlaying) {
            safePlay(sunAudio, 'sun');
            isSunPlaying = true;
        } else if (!shouldPlay && isSunPlaying) {
            sunAudio.pause();
            sunAudio.currentTime = 0;
            isSunPlaying = false;
            console.log('Sun audio stopped');
        }
    }

    // Установка громкости космической музыки
    function setSpaceVolume(volume) {
        spaceVolume = Math.max(0, Math.min(1, volume));
        if (spaceAudio) {
            spaceAudio.volume = spaceVolume;
        }
    }

    // Установка громкости звука Солнца
    function setSunVolume(volume) {
        sunVolume = Math.max(0, Math.min(1, volume));
        if (sunAudio) {
            sunAudio.volume = sunVolume;
        }
    }

    // Очистка ресурсов
    function cleanup() {
        stopSpaceAudio();
        if (isSunPlaying) {
            toggleSun(false);
        }
        console.log('🧹 Sound system cleaned up');
    }

    // Автозапуск космической музыки через небольшую задержку
    setTimeout(() => {
        startSpaceAudio();
    }, 1000);

    // Возвращаем интерфейс управления
    return {
        startSpaceAudio,
        stopSpaceAudio,
        toggleSun,
        setSpaceVolume,
        setSunVolume,
        cleanup,
        isSpacePlaying: () => isSpacePlaying,
        isSunPlaying: () => isSunPlaying
    };
}

// Создаем заглушку для случая, когда аудио недоступно
function createDummySoundControls() {
    console.warn('🔇 Audio not available, using dummy controls');

    return {
        startSpaceAudio: () => console.log('Dummy: Space audio would start'),
        stopSpaceAudio: () => console.log('Dummy: Space audio would stop'),
        toggleSun: () => console.log('Dummy: Sun audio would toggle'),
        setSpaceVolume: (vol) => console.log(`Dummy: Space volume set to ${vol}`),
        setSunVolume: (vol) => console.log(`Dummy: Sun volume set to ${vol}`),
        cleanup: () => console.log('Dummy: Cleanup done'),
        isSpacePlaying: () => false,
        isSunPlaying: () => false
    };
}