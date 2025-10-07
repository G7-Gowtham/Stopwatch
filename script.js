let timerDisplay = document.getElementById("timer");
let interval;
let seconds = 0;

function startTimer() {
  if (!interval) {
    interval = setInterval(() => {
      seconds++;
      let mins = Math.floor(seconds / 60);
      let secs = seconds % 60;
      timerDisplay.textContent =
        `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }, 1000);
    timerDisplay.classList.add("running");
  }
}

function stopTimer() {
  clearInterval(interval);
  interval = null;
  timerDisplay.classList.remove("running");
}

function resetTimer() {
  stopTimer();
  seconds = 0;
  timerDisplay.textContent = "00:00";
}

// Clock
const clockDisplay = document.getElementById("clock");
if (clockDisplay) {
  function updateClock() {
    const now = new Date();
    const hrs = now.getHours().toString().padStart(2, "0");
    const mins = now.getMinutes().toString().padStart(2, "0");
    const secs = now.getSeconds().toString().padStart(2, "0");
    clockDisplay.textContent = `${hrs}:${mins}:${secs}`;
  }
  setInterval(updateClock, 1000);
  updateClock();
}

// Navbar toggle
const mobileMenu = document.getElementById("mobile-menu");
const navMenu = document.querySelector(".nav-menu");

if (mobileMenu) {
  mobileMenu.addEventListener("click", () => {
    navMenu.classList.toggle("show");
  });
}
