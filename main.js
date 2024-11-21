let wakeLockObj 

// Request a screen wake lock:
navigator.wakeLock.request('screen')
.then(wakeLock => {
    // Store the wake lock object for later use
    wakeLockObj = wakeLock;

    // Wake lock is active
    console.log('Wake lock is active.');

    // ... Your working code ...

    // Release the wake lock when no longer needed
    wakeLockObj.release();
})
.catch(err => {
    // Handle error, e.g., user denied the request
    console.error('Failed to acquire wake lock:', err);
});

// Sleep the clock

function sleepMode() {
    if (wakeLockObj) { // Check if wakeLockObj is defined
        wakeLockObj.release()
            .then(() => {
                console.log('Wake lock released successfully.');
            })
            .catch(err => {
                console.error('Error releasing wake lock:', err);
            });
    }
}



    // Configuration
    const START_TIME = 5; // 5:00 AM
    const PEAK_TIME = 16; // 4:00 PM
    const END_TIME = 18.5; // 6:30 PM
    const TICK_INTERVAL = 1000; // 1 second in real time
    const MAX_SPEED = 5; // Maximum speed multiplier at peak
    const RANDOM_MIN_INTERVAL = 60000; // Min 5 seconds for random switch
    const RANDOM_MAX_INTERVAL = 150000; // Max 15 seconds for random switch

    // State variables
    let currentTime = new Date(); // Start with the current real-world time
    let paused = false;
    let linearMode = true; // Linear progression initially
    let randomModeActive = false;
    let chartData = [];
    let interval;
    let randomInterval;

    // Utility Functions
    function calculateSpeedMultiplier(hour) {
        if (hour < START_TIME || hour > END_TIME) return 1; // Real-world speed
        const normalizedTime = (hour - START_TIME) / (END_TIME - START_TIME);
        if (hour <= PEAK_TIME) {
            return linearMode
                ? 1 + normalizedTime * (MAX_SPEED - 1) // Linear speed-up
                : 1 + (Math.exp(normalizedTime) - 1) * (MAX_SPEED - 1); // Exponential speed-up
        } else {
            const reverseTime = (END_TIME - hour) / (END_TIME - PEAK_TIME);
            return linearMode
                ? 1 + reverseTime * (MAX_SPEED - 1) // Linear slow-down
                : 1 + (Math.exp(reverseTime) - 1) * (MAX_SPEED - 1); // Exponential slow-down
        }
    }

    function updateClock() {
        if (paused) {
            renderClock(new Date()); // Show real-world time when paused
            return;
        }

        const currentHour = currentTime.getHours() + currentTime.getMinutes() / 60;
        const speedMultiplier = currentHour >= START_TIME && currentHour <= END_TIME
            ? calculateSpeedMultiplier(currentHour) // Progressive speed
            : 1; // Real-world speed

        chartData.push(speedMultiplier);
        renderChart();

        currentTime = new Date(currentTime.getTime() + TICK_INTERVAL * speedMultiplier);
        renderClock(currentTime);
    }

    function renderClock(time) {
        let hours = time.getHours();
        const minutes = time.getMinutes().toString().padStart(2, '0');
        const seconds = time.getSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format
        document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
    }

    function renderChart() {
        const chart = document.getElementById('chart');
        chart.innerHTML = ''; // Clear previous lines
        const maxWidth = chart.offsetWidth;
        const maxHeight = chart.offsetHeight;
        const maxSpeed = Math.max(...chartData, MAX_SPEED);
        chartData.forEach((speed, index) => {
            const line = document.createElement('div');
            line.className = 'line';
            line.style.width = `${maxWidth / chartData.length}px`;
            line.style.left = `${(index / chartData.length) * maxWidth}px`;
            line.style.height = `${(speed / maxSpeed) * maxHeight}px`;
            chart.appendChild(line);
        });
    }

    function togglePause() {
        paused = !paused;
        if (paused) {
            alert('Paused: Showing real-world time.');
        } else {
            alert('Resumed: Returning to accelerated/progressive time.');
            currentTime = new Date(); // Sync with real-world time
        }
    }

    function toggleMode() {
        linearMode = !linearMode;
        alert(`Switched to ${linearMode ? 'Linear' : 'Exponential'} mode.`);
    }

    function enableRandomMode() {
        if (randomModeActive) {
            clearInterval(randomInterval);
            randomModeActive = false;
            alert('Random mode disabled.');
        } else {
            randomModeActive = true;
            alert('Random mode enabled.');
            scheduleRandomSwitch();
        }
    }

    function scheduleRandomSwitch() {
        if (!randomModeActive) return;

        const randomTime = Math.random() * (RANDOM_MAX_INTERVAL - RANDOM_MIN_INTERVAL) + RANDOM_MIN_INTERVAL;
        randomInterval = setTimeout(() => {
            linearMode = !linearMode;
            alert(`Random mode switched to ${linearMode ? 'Linear' : 'Exponential'} mode.`);
            scheduleRandomSwitch();
        }, randomTime);
    }

    // Initialization: Determine mode based on real-world time
    const currentHour = currentTime.getHours() + currentTime.getMinutes() / 60;
    if (currentHour < START_TIME || currentHour > END_TIME) {
        // Outside working hours: Use real-world time
        currentTime = new Date();
    }

    // Start the clock
    renderClock(currentTime);
    interval = setInterval(updateClock, TICK_INTERVAL);

    const adminBtn = document.getElementById("admin-btn");
    const adminSection = document.getElementById("admin-section");

    adminBtn.addEventListener("click", () => {
    const password = prompt("Enter Admin Password:");
    if (password === "intribe") {
       
        adminSection.classList.remove("hidden");
        adminBtn.classList.add("hidden");
    } else {
        alert("Incorrect Password");
    }
    });
  

