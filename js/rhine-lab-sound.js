(function () {
    'use strict';

    const STORAGE_KEY = 'rhineLabSoundEnabled';
    let enabled = localStorage.getItem(STORAGE_KEY) !== 'false';
    let context = null;
    let master = null;
    let lastPlayedAt = 0;

    function getContext() {
        if (!context) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return null;
            context = new AudioContextClass();
            const compressor = context.createDynamicsCompressor();
            compressor.threshold.value = -22;
            compressor.knee.value = 18;
            compressor.ratio.value = 5;
            compressor.attack.value = 0.004;
            compressor.release.value = 0.2;
            master = context.createGain();
            master.gain.value = 0.9;
            master.connect(compressor);
            compressor.connect(context.destination);
        }
        if (context.state === 'suspended') context.resume().catch(function () {});
        return context;
    }

    function envelope(gain, start, duration, volume, attack) {
        const rise = Math.min(attack || 0.008, duration * 0.35);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(Math.max(volume, 0.0002), start + rise);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    }

    function tone(audio, options) {
        const source = audio.createOscillator();
        const gain = audio.createGain();
        const filter = audio.createBiquadFilter();
        const start = options.start;
        const duration = options.duration;
        source.type = options.type || 'sine';
        source.frequency.setValueAtTime(options.frequency, start);
        if (options.endFrequency) source.frequency.exponentialRampToValueAtTime(options.endFrequency, start + duration);
        filter.type = options.filterType || 'lowpass';
        filter.frequency.value = options.filter || 5200;
        filter.Q.value = options.q || 0.7;
        envelope(gain, start, duration, options.volume, options.attack);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        source.start(start);
        source.stop(start + duration + 0.03);
    }

    function noise(audio, options) {
        const duration = options.duration;
        const frameCount = Math.max(1, Math.ceil(audio.sampleRate * duration));
        const buffer = audio.createBuffer(1, frameCount, audio.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length * 0.35);
        const source = audio.createBufferSource();
        const filter = audio.createBiquadFilter();
        const gain = audio.createGain();
        source.buffer = buffer;
        filter.type = options.filterType || 'bandpass';
        filter.frequency.value = options.filter || 2400;
        filter.Q.value = options.q || 1.2;
        envelope(gain, options.start, duration, options.volume, options.attack || 0.004);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        source.start(options.start);
        source.stop(options.start + duration + 0.02);
    }

    function relay(audio, start, pitch, volume) {
        noise(audio, { start: start, duration: 0.034, volume: volume || 0.026, filter: 3100, q: 2.4 });
        tone(audio, { start: start, duration: 0.052, volume: (volume || 0.026) * 0.72, frequency: pitch || 180, endFrequency: 118, type: 'triangle', filter: 1500 });
    }

    function animateButton(duration) {
        const button = document.getElementById('soundToggle');
        if (!button) return;
        button.classList.remove('is-sounding');
        void button.offsetWidth;
        button.classList.add('is-sounding');
        window.setTimeout(function () { button.classList.remove('is-sounding'); }, duration || 360);
    }

    function begin(kind) {
        if (!enabled) return null;
        const nowMs = performance.now();
        if (kind !== 'end-day' && nowMs - lastPlayedAt < 48) return null;
        lastPlayedAt = nowMs;
        const audio = getContext();
        if (!audio) return null;
        return { audio: audio, now: audio.currentTime + 0.008 };
    }

    function playPage(view) {
        const session = begin('page-' + view);
        if (!session) return;
        const audio = session.audio;
        const t = session.now;
        relay(audio, t, 170, 0.03);

        if (view === 'experiments') {
            noise(audio, { start: t + 0.025, duration: 0.1, volume: 0.018, filter: 4200, q: 2.8 });
            tone(audio, { start: t + 0.035, duration: 0.16, volume: 0.034, frequency: 610, endFrequency: 1220, type: 'sine' });
            tone(audio, { start: t + 0.14, duration: 0.13, volume: 0.023, frequency: 1380, endFrequency: 820, type: 'triangle' });
        } else if (view === 'mice') {
            noise(audio, { start: t + 0.02, duration: 0.18, volume: 0.017, filter: 780, filterType: 'lowpass' });
            [294, 392, 494].forEach(function (frequency, index) {
                tone(audio, { start: t + 0.035 + index * 0.055, duration: 0.16, volume: 0.025 - index * 0.003, frequency: frequency, endFrequency: frequency * 1.04, type: 'sine', filter: 1800 });
            });
        } else if (view === 'reagents') {
            [880, 1320, 1760].forEach(function (frequency, index) {
                tone(audio, { start: t + 0.028 + index * 0.045, duration: 0.17 - index * 0.018, volume: 0.027 - index * 0.004, frequency: frequency, endFrequency: frequency * 1.08, type: index === 1 ? 'sine' : 'triangle', filter: 4800 });
            });
            noise(audio, { start: t + 0.09, duration: 0.065, volume: 0.012, filter: 5600, q: 3.1 });
        } else if (view === 'cells') {
            [262, 330, 392].forEach(function (frequency, index) {
                tone(audio, { start: t + 0.025 + index * 0.055, duration: 0.22, volume: 0.028 - index * 0.003, frequency: frequency, endFrequency: frequency * 1.025, type: 'sine', filter: 1500, attack: 0.025 });
            });
            noise(audio, { start: t + 0.02, duration: 0.22, volume: 0.01, filter: 900, filterType: 'lowpass', attack: 0.03 });
        } else if (view === 'samples') {
            noise(audio, { start: t + 0.02, duration: 0.12, volume: 0.018, filter: 6500, q: 3.4 });
            [1047, 1397, 2093].forEach(function (frequency, index) {
                tone(audio, { start: t + 0.035 + index * 0.052, duration: 0.19, volume: 0.023 - index * 0.003, frequency: frequency, endFrequency: frequency * 1.12, type: 'sine', filter: 7200, attack: 0.012 });
            });
        } else if (view === 'protocols') {
            [440, 554, 659].forEach(function (frequency, index) {
                relay(audio, t + 0.03 + index * 0.07, 150 + index * 22, 0.016);
                tone(audio, { start: t + 0.03 + index * 0.07, duration: 0.13, volume: 0.023, frequency: frequency, endFrequency: frequency * 1.03, type: 'triangle', filter: 2600 });
            });
        } else if (view === 'schedule') {
            [0, 0.075, 0.15].forEach(function (offset, index) { relay(audio, t + offset, 190 + index * 34, 0.023); });
            tone(audio, { start: t + 0.04, duration: 0.24, volume: 0.024, frequency: 360, endFrequency: 720, type: 'sine', filter: 2500 });
        } else {
            tone(audio, { start: t + 0.025, duration: 0.2, volume: 0.03, frequency: 174, endFrequency: 261, type: 'triangle', filter: 1200 });
            tone(audio, { start: t + 0.09, duration: 0.18, volume: 0.022, frequency: 522, endFrequency: 784, type: 'sine', filter: 3200 });
            noise(audio, { start: t + 0.02, duration: 0.15, volume: 0.012, filter: 1800, q: 1.8 });
        }
        animateButton(430);
    }

    function play(kind) {
        const session = begin(kind);
        if (!session) return;
        const audio = session.audio;
        const t = session.now;

        if (kind === 'open') {
            relay(audio, t, 175, 0.026);
            tone(audio, { start: t + 0.025, duration: 0.18, volume: 0.032, frequency: 320, endFrequency: 720, type: 'triangle', filter: 2800 });
            tone(audio, { start: t + 0.1, duration: 0.13, volume: 0.019, frequency: 880, endFrequency: 1040, type: 'sine' });
        } else if (kind === 'confirm') {
            relay(audio, t, 205, 0.022);
            [523, 659, 784].forEach(function (frequency, index) {
                tone(audio, { start: t + 0.035 + index * 0.055, duration: 0.2, volume: 0.029 - index * 0.004, frequency: frequency, endFrequency: frequency * 1.035, type: 'sine', filter: 4200 });
            });
        } else if (kind === 'warning') {
            noise(audio, { start: t, duration: 0.16, volume: 0.018, filter: 760, filterType: 'lowpass' });
            tone(audio, { start: t, duration: 0.23, volume: 0.036, frequency: 225, endFrequency: 148, type: 'triangle', filter: 1000 });
            tone(audio, { start: t + 0.06, duration: 0.16, volume: 0.022, frequency: 338, endFrequency: 220, type: 'sawtooth', filter: 1300 });
        } else if (kind === 'end-day') {
            noise(audio, { start: t, duration: 0.72, volume: 0.021, filter: 620, filterType: 'lowpass', attack: 0.08 });
            tone(audio, { start: t, duration: 0.7, volume: 0.037, frequency: 130, endFrequency: 196, type: 'triangle', filter: 900, attack: 0.04 });
            [392, 523, 659, 784, 1047].forEach(function (frequency, index) {
                tone(audio, { start: t + 0.16 + index * 0.15, duration: 0.5 - index * 0.035, volume: 0.036 - index * 0.003, frequency: frequency, endFrequency: frequency * 1.045, type: index % 2 ? 'triangle' : 'sine', filter: 5600, attack: 0.018 });
            });
            noise(audio, { start: t + 0.58, duration: 0.24, volume: 0.016, filter: 5200, q: 3.6 });
            relay(audio, t + 1.05, 245, 0.026);
            tone(audio, { start: t + 1.08, duration: 0.34, volume: 0.027, frequency: 1047, endFrequency: 1568, type: 'sine', filter: 6800 });
        } else {
            relay(audio, t, 190, 0.022);
            tone(audio, { start: t + 0.012, duration: 0.085, volume: 0.024, frequency: 690, endFrequency: 510, type: 'triangle', filter: 2600 });
        }
        animateButton(kind === 'end-day' ? 1500 : 380);
    }

    function label() {
        const source = enabled ? '关闭界面音效' : '开启界面音效';
        return window.RhineLabI18n ? window.RhineLabI18n.t(source) : source;
    }

    function updateButton() {
        const button = document.getElementById('soundToggle');
        if (!button) return;
        const text = label();
        button.setAttribute('aria-label', text);
        button.setAttribute('title', text);
        button.setAttribute('aria-pressed', String(enabled));
        button.dataset.soundEnabled = enabled ? 'true' : 'false';
    }

    function toggle() {
        enabled = !enabled;
        localStorage.setItem(STORAGE_KEY, String(enabled));
        updateButton();
        if (enabled) play('confirm');
        return enabled;
    }

    function classify(control) {
        const signature = [control.className || '', control.id || '', Array.from(control.attributes || []).map(function (attribute) {
            return attribute.name + '=' + attribute.value;
        }).join(' ')].join(' ').toLowerCase();
        if (/danger|delete|remove|clear|删除|清空/.test(signature)) return 'warning';
        if (/save|submit|confirm|finish|complete|保存|确认|完成/.test(signature)) return 'confirm';
        if (/data-add|data-open|open-|dialog|detail/.test(signature)) return 'open';
        return 'tap';
    }

    function bind() {
        const toggleButton = document.getElementById('soundToggle');
        if (toggleButton) toggleButton.addEventListener('click', toggle);
        document.addEventListener('click', function (event) {
            const control = event.target.closest('button, a[href], [role="button"]');
            if (!control || control === toggleButton || control.disabled || control.getAttribute('aria-disabled') === 'true') return;
            if (control.id === 'endDayButton') return;
            const targetView = control.dataset.view || control.dataset.viewTarget || control.dataset.resultView || control.dataset.notificationView;
            if (targetView) {
                playPage(targetView === 'results' ? 'experiments' : targetView);
                return;
            }
            play(classify(control));
        }, true);
        window.addEventListener('rhine:languagechange', updateButton);
        updateButton();
    }

    window.RhineLabSound = {
        play: play,
        playPage: playPage,
        toggle: toggle,
        isEnabled: function () { return enabled; }
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, { once: true });
    else bind();
}());
