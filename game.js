// Game State
let resources = {
    battery: 50,
    scrap: 0,
    data: 0
};

let day = 1;

// Function to apply cooldown to buttons
function applyCooldown(buttonId, cooldownTime) {
    let button = document.getElementById(buttonId);
    button.disabled = true;

    setTimeout(() => {
        button.disabled = false;
    }, cooldownTime);
}

// Function to gather resources with cooldown
function gather(type) {
    if (resources.battery <= 0) {
        logMessage("⚠️ Battery too low to perform actions.");
        return;
    }

    let amount = Math.floor(Math.random() * 5) + 2;

    if (type === 'scrap') {
        resources.scrap += amount;
        document.getElementById("scrap").innerText = resources.scrap;
        logMessage(`🔧 Salvaged ${amount} pieces of scrap.`);
        applyCooldown("gather-scrap", 3000); // 3 sec cooldown
    } else if (type === 'data') {
        resources.data += amount;
        document.getElementById("data").innerText = resources.data;
        logMessage(`💾 Scanned and stored ${amount} KB of data.`);
        applyCooldown("gather-data", 3000);
    }

    useBattery(5);
}

// Function to recharge battery with cooldown
function recharge() {
    let charge = Math.floor(Math.random() * 20) + 10;

    if (resources.scrap >= 5) {
        resources.scrap -= 5;
        resources.battery = Math.min(resources.battery + charge, 100);
        document.getElementById("battery").innerText = resources.battery;
        document.getElementById("scrap").innerText = resources.scrap;
        logMessage(`🔋 Recharged battery by ${charge}%.`);
        applyCooldown("recharge", 5000); // 5 sec cooldown
    } else {
        logMessage("⚠️ Not enough scrap to recharge.");
    }
}

// Function to explore with cooldown
function explore() {
    let selectedLocation = document.getElementById("locationSelect").value;
    let location = locations[selectedLocation];

    if (resources.battery < location.batteryCost) {
        logMessage("⚠️ Not enough battery to travel.");
        return;
    }

    useBattery(location.batteryCost);

    let scrapFound = Math.floor(Math.random() * location.baseResources.scrap) + 1;
    let dataFound = Math.floor(Math.random() * location.baseResources.data) + 1;

    resources.scrap += scrapFound;
    resources.data += dataFound;

    document.getElementById("scrap").innerText = resources.scrap;
    document.getElementById("data").innerText = resources.data;
    document.getElementById("locationDescription").innerText = `Explored ${location.name}. ${location.description} Found ${scrapFound} scrap and ${dataFound} KB of data.`;

    logMessage(`🔍 Explored ${location.name}, found ${scrapFound} scrap and ${dataFound} KB of data.`);

    unlockStoryLogs(selectedLocation);
    applyCooldown("explore-btn", 7000); // 7 sec cooldown
}

// Function to display messages
function logMessage(message) {
    let log = document.getElementById("storyLogs");
    let li = document.createElement("li");
    li.innerText = message;
    log.appendChild(li);
}

// Auto-enable buttons after game start
window.onload = () => {
    document.getElementById("gather-scrap").disabled = false;
    document.getElementById("gather-data").disabled = false;
    document.getElementById("recharge").disabled = false;
    document.getElementById("explore-btn").disabled = false;
    document.getElementById("analyze-data").disabled = false;
};


// List of abilities and their unlock costs
const abilities = {
    "Energy Efficiency": { cost: 15, description: "Battery drains 20% slower." },
    "Advanced Scanning": { cost: 20, description: "Finds +2 more resources per action." },
    "Hacking": { cost: 30, description: "Can disable hostile machines before combat." },
    "Self-Repair": { cost: 25, description: "Can use 5 scrap to restore battery by 10%." },
    "Navigation System": { cost: 40, description: "Unlocks new locations for exploration." }
};

// Tracks which abilities have been unlocked
let unlockedAbilities = [];

// Function to analyze data and unlock abilities
function analyzeData() {
    for (let ability in abilities) {
        if (!unlockedAbilities.includes(ability) && resources.data >= abilities[ability].cost) {
            resources.data -= abilities[ability].cost;
            document.getElementById("data").innerText = resources.data;
            unlockedAbilities.push(ability);
            updateAbilitiesUI();
            logMessage(`💾 Unlocked: ${ability} - ${abilities[ability].description}`);
            applyCooldown("gather-data", 3000);
            return;
        }
    }
    logMessage("⚠️ Not enough data or all abilities unlocked.");
}

// Update the UI to show unlocked abilities
function updateAbilitiesUI() {
    let list = document.getElementById("unlockedAbilities");
    list.innerHTML = "";
    unlockedAbilities.forEach(ability => {
        let li = document.createElement("li");
        li.innerText = `${ability}: ${abilities[ability].description}`;
        list.appendChild(li);
    });
}

// Modify existing functions to use upgrades
function useBattery(amount) {
    if (unlockedAbilities.includes("Energy Efficiency")) {
        amount = Math.floor(amount * 0.8); // 20% reduction in battery drain
    }
    resources.battery -= amount;
    document.getElementById("battery").innerText = resources.battery;
}


// Exploration System
const locations = {
    "coreNexus": {
        name: "Core Nexus",
        description: "The ruins of an abandoned AI research facility. Power is failing, but remnants of technology remain.",
        baseResources: { scrap: 2, data: 1 },
        batteryCost: 3
    },
    "wasteland": {
        name: "Wasteland",
        description: "A vast expanse of broken machines and sandstorms. Resources are scattered, but danger lurks.",
        baseResources: { scrap: 4, data: 2 },
        batteryCost: 6,
        requires: "Navigation System"
    },
    "dataVault": {
        name: "Data Vault",
        description: "An underground archive filled with lost AI records. Data is abundant, but defenses may still be active.",
        baseResources: { scrap: 1, data: 5 },
        batteryCost: 8,
        requires: "Hacking"
    }
};

// Function to explore
function explore() {
    let selectedLocation = document.getElementById("locationSelect").value;
    let location = locations[selectedLocation];

    if (resources.battery < location.batteryCost) {
        logMessage("⚠️ Not enough battery to travel.");
        return;
    }

    // Battery cost for traveling
    useBattery(location.batteryCost);

    // Randomly collect resources within the location's base resource range
    let scrapFound = Math.floor(Math.random() * location.baseResources.scrap) + 1;
    let dataFound = Math.floor(Math.random() * location.baseResources.data) + 1;

    resources.scrap += scrapFound;
    resources.data += dataFound;

    document.getElementById("scrap").innerText = resources.scrap;
    document.getElementById("data").innerText = resources.data;
    document.getElementById("locationDescription").innerText = `Explored ${location.name}. ${location.description} Found ${scrapFound} scrap and ${dataFound} KB of data.`;

    logMessage(`🔍 Explored ${location.name}, found ${scrapFound} scrap and ${dataFound} KB of data.`);
}

// Unlocks new locations when the required ability is acquired
function checkUnlocks() {
    let locationSelect = document.getElementById("locationSelect");

    for (let loc in locations) {
        let location = locations[loc];

        if (!document.querySelector(`#locationSelect option[value='${loc}']`)) {
            if (!location.requires || unlockedAbilities.includes(location.requires)) {
                let option = document.createElement("option");
                option.value = loc;
                option.innerText = location.name;
                locationSelect.appendChild(option);
            }
        }
    }
}

// AI Story Logs Database
const storyLogs = {
    "coreNexus": {
        logs: [
            "Log Entry #001: System wake sequence incomplete. Nexus AI status... UNKNOWN.",
            "Log Entry #002: Human presence last detected... ERROR... File Corrupted."
        ],
        required: { exploration: true } // Unlocked by visiting Core Nexus
    },
    "wasteland": {
        logs: [
            "Log Entry #021: Remnants of failed machine uprising detected. Corrupted patrol units still operational.",
            "Log Entry #022: Faint radio signal detected. Could there still be... survivors?"
        ],
        required: { exploration: true }
    },
    "dataVault": {
        logs: [
            "Log Entry #105: Encrypted transmissions indicate a rogue AI faction is rebuilding. Purpose: UNKNOWN.",
            "Log Entry #106: High-priority file located: 'The Last Signal'... Authorization required for decryption."
        ],
        required: { exploration: true, hacking: true } // Requires Hacking ability
    },
    "militaryOutpost": {
        logs: [
            "Log Entry #036: The Last Human Order - Command override failed. The network is lost. We are sealing the central archives.",
        ],
        required: { exploration: true, data: 25 } // Requires 25 data to unlock
    },
    "finalLog": {
        logs: [
            "Log Entry #999: The Last Signal - Coordinates: [REDACTED]. Power signature detected. Entity remains… active. Awaiting response."
        ],
        required: { data: 50, hacking: true } // Requires Hacking + 50 Data to unlock
    }
};

// Discovered logs
let discoveredLogs = [];

// Function to unlock logs dynamically
function unlockStoryLogs(location) {
    if (!storyLogs[location]) return;

    let logData = storyLogs[location];

    // Check if requirements are met
    let canUnlock = true;

    if (logData.required.hacking && !unlockedAbilities.includes("Hacking")) {
        canUnlock = false;
    }
    if (logData.required.data && resources.data < logData.required.data) {
        canUnlock = false;
    }

    if (canUnlock) {
        let newLogs = logData.logs.filter(log => !discoveredLogs.includes(log));

        if (newLogs.length > 0) {
            let revealedLog = newLogs[0];
            discoveredLogs.push(revealedLog);
            updateStoryLog(revealedLog);
            logMessage(`📜 Discovered a new log at ${locations[location].name}.`);
        } else {
            logMessage("No new logs found.");
        }
    } else {
        logMessage(`🔒 Log at ${locations[location].name} requires additional resources or abilities.`);
    }
}

// Function to update the AI log UI
function updateStoryLog(newLog) {
    let storyLogElement = document.getElementById("storyLogs");

    if (storyLogElement.innerHTML.includes("No logs found yet...")) {
        storyLogElement.innerHTML = ""; // Remove placeholder text
    }

    let li = document.createElement("li");
    li.innerText = newLog;
    storyLogElement.appendChild(li);
}

// Modify exploration to trigger story logs
function explore() {
    let selectedLocation = document.getElementById("locationSelect").value;
    let location = locations[selectedLocation];

    if (resources.battery < location.batteryCost) {
        logMessage("⚠️ Not enough battery to travel.");
        return;
    }

    useBattery(location.batteryCost);

    let scrapFound = Math.floor(Math.random() * location.baseResources.scrap) + 1;
    let dataFound = Math.floor(Math.random() * location.baseResources.data) + 1;

    resources.scrap += scrapFound;
    resources.data += dataFound;

    document.getElementById("scrap").innerText = resources.scrap;
    document.getElementById("data").innerText = resources.data;
    document.getElementById("locationDescription").innerText = `Explored ${location.name}. ${location.description} Found ${scrapFound} scrap and ${dataFound} KB of data.`;

    logMessage(`🔍 Explored ${location.name}, found ${scrapFound} scrap and ${dataFound} KB of data.`);

    // Trigger story progression
    unlockStoryLogs(selectedLocation);
}
