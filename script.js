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


const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");
const saveBtn = document.getElementById("saveBtn");
const savedList = document.getElementById("savedList");
const noSaves = document.getElementById("no-saves");
const clearAllBtn = document.getElementById("clearAllBtn");

let interval, running = false, ms = 0, saves = [];

function formatTime(msTotal) {
    const mins = Math.floor(msTotal / 60000);
    const secs = Math.floor((msTotal % 60000) / 1000);
    const hundredths = Math.floor((msTotal % 1000) / 10); // 2-digit milliseconds
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${hundredths.toString().padStart(2, "0")}`;
}

function refreshTimerText() {
    if (timerDisplay) timerDisplay.textContent = formatTime(ms);
}

function startTimer() {
    if (running) return;
    running = true;
    interval = setInterval(() => {
        ms += 10;
        refreshTimerText();
    }, 10);
    timerDisplay.classList.add("running");
}

function stopTimer() {
    if (!running) return;
    running = false;
    clearInterval(interval);
    interval = null;
    timerDisplay.classList.remove("running");
}

function resetTimer() {
    stopTimer();
    ms = 0;
    refreshTimerText();
}

function saveTime() {
    const timeStr = formatTime(ms);
    const id = Date.now().toString(36);
    saves.unshift({ id, time: timeStr, name: "Unnamed", editing: false });
    renderSaves();
}

function removeSave(id) {
    saves = saves.filter(s => s.id !== id);
    renderSaves();
}

function clearAllSaves() {
    if (!confirm("Clear all saved times?")) return;
    saves = [];
    renderSaves();
}

function toggleEdit(id) {
    const item = saves.find(s => s.id === id);
    if (!item) return;
    item.editing = !item.editing;
    renderSaves(() => {
        if (item.editing) {
            const input = document.querySelector(`.name-input[data-id='${id}']`);
            if (input) {
                input.focus();
                input.setSelectionRange(input.value.length, input.value.length);
            }
        }
    });
}

function updateName(id, newName) {
    const item = saves.find(s => s.id === id);
    if (!item) return;
    item.name = newName || "Unnamed";
    item.editing = false;
    renderSaves();
}

function renderSaves(cb) {
    if (!savedList || !noSaves) return;
    savedList.innerHTML = "";
    if (saves.length === 0) {
        noSaves.style.display = "block";
        return;
    }
    noSaves.style.display = "none";

    saves.forEach(save => {
        const li = document.createElement("li");
        li.className = "checkpoint-item";

        const left = document.createElement("div");
        left.className = "save-left";

        if (save.editing) {
            const input = document.createElement("input");
            input.type = "text";
            input.value = save.name;
            input.className = "name-input";
            input.setAttribute("data-id", save.id);
            input.addEventListener("keydown", e => {
                if (e.key === "Enter") {
                    updateName(save.id, input.value.trim());
                } else if (e.key === "Escape") {
                    save.editing = false;
                    renderSaves();
                }
            });
            left.appendChild(input);
        } else {
            const nameSpan = document.createElement("div");
            nameSpan.className = "name-text";
            nameSpan.textContent = save.name || "Unnamed";
            left.appendChild(nameSpan);
        }

        const timeSpan = document.createElement("div");
        timeSpan.className = "save-time";
        timeSpan.textContent = save.time;
        left.appendChild(timeSpan);

        const right = document.createElement("div");
        right.className = "save-right";

        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.textContent = save.editing ? "Save" : "Edit";
        editBtn.addEventListener("click", () => {
            if (save.editing) {
                const input = document.querySelector(`.name-input[data-id='${save.id}']`);
                const newName = input ? input.value.trim() : save.name;
                updateName(save.id, newName);
            } else {
                toggleEdit(save.id);
            }
        });

        const removeBtn = document.createElement("button");
        removeBtn.className = "remove-btn";
        removeBtn.textContent = "✕";
        removeBtn.title = "Remove";
        removeBtn.addEventListener("click", () => removeSave(save.id));

        right.appendChild(editBtn);
        right.appendChild(removeBtn);
        li.appendChild(left);
        li.appendChild(right);

        savedList.appendChild(li);
    });

    if (typeof cb === "function") cb();
}


if (startBtn) startBtn.addEventListener("click", startTimer);
if (stopBtn) stopBtn.addEventListener("click", stopTimer);
if (resetBtn) resetBtn.addEventListener("click", resetTimer);
if (saveBtn) saveBtn.addEventListener("click", saveTime);
if (clearAllBtn) clearAllBtn.addEventListener("click", clearAllSaves);

if (timerDisplay) {
    ms = 0;
    refreshTimerText();
    renderSaves();
}
