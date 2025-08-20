let timer;
let seconds = 0;

function updateDisplay() {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `${mins}:${secs}`;
}

function bounceKnobs() {
    const knobs = document.querySelectorAll('.knob');
    knobs.forEach(knob => {
        knob.classList.remove('bounce'); // Reset animation
        void knob.offsetWidth; // Trigger reflow to restart animation
        knob.classList.add('bounce');
    });
}

function startTimer() {
    if (!timer) {
        document.getElementById('timer').classList.add('running');
        bounceKnobs();
        timer = setInterval(() => {
            seconds++;
            updateDisplay();
        }, 1000);
    }
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
    document.getElementById('timer').classList.remove('running');
}

function resetTimer() {
    stopTimer();
    seconds = 0;
    updateDisplay();
    bounceKnobs();
}

updateDisplay(); // Initial display
