// ---- Load state ----
var saved = localStorage.getItem("petState");

var pet = {// 0 to 100
  hunger: 20,       
  energy: 80,      
  happiness: 75,   
  sleeping: false  // true/false
};

if (saved) {
  try {
    var data = JSON.parse(saved);

    // Only set values if they exist 
    if (data.hunger !== undefined) pet.hunger = data.hunger;
    if (data.energy !== undefined) pet.energy = data.energy;
    if (data.happiness !== undefined) pet.happiness = data.happiness;
    if (data.sleeping !== undefined) pet.sleeping = data.sleeping;
  } catch (e) {
    // If something goes wrong, use default pet object
  }
}

// ---- DOM elements ----
var petBox = document.getElementById("pet");
var moodBadge = document.getElementById("moodBadge");
var mouth = document.getElementById("mouth");
var tipText = document.getElementById("tipText");

var moodText = document.getElementById("moodText");
var healthText = document.getElementById("healthText");
var hungerText = document.getElementById("hungerText");
var energyText = document.getElementById("energyText");
var happyText = document.getElementById("happyText");
var sleepText = document.getElementById("sleepText");

var healthBar = document.getElementById("healthBar");
var hungerBar = document.getElementById("hungerBar");
var energyBar = document.getElementById("energyBar");
var happyBar = document.getElementById("happyBar");

// ---- Buttons ----
document.getElementById("feedBtn").addEventListener("click", feed);
document.getElementById("playBtn").addEventListener("click", play);
document.getElementById("sleepBtn").addEventListener("click", sleepWake);
document.getElementById("resetBtn").addEventListener("click", resetPet);

// ---- Helper ----
function keepInRange() {
  if (pet.hunger < 0) pet.hunger = 0;
  if (pet.hunger > 100) pet.hunger = 100;

  if (pet.energy < 0) pet.energy = 0;
  if (pet.energy > 100) pet.energy = 100;

  if (pet.happiness < 0) pet.happiness = 0;
  if (pet.happiness > 100) pet.happiness = 100;
}

// ---- Mood ----
function getMood() {
  if (pet.sleeping) return "sleeping";
  if (pet.hunger >= 70) return "hungry";
  if (pet.energy <= 25) return "sleepy";
  if (pet.happiness <= 25) return "bored";
  return "happy";
}

// ---- Health ----
function getHealth() {
  var health = 100;

  // hunger hurts if it is high
  if (pet.hunger > 40) health = health - (pet.hunger - 40);

  // low energy hurts
  if (pet.energy < 45) health = health - (45 - pet.energy);

  // low happiness hurts
  if (pet.happiness < 45) health = health - (45 - pet.happiness);

  // keep health in 0-100
  if (health < 0) health = 0;
  if (health > 100) health = 100;

  return Math.round(health);
}

// ---- Save ----
function savePet() {
  localStorage.setItem("petState", JSON.stringify(pet));
}

// ---- Render ----
function render() {
  keepInRange();

  var mood = getMood();
  var health = getHealth();

  moodText.textContent = mood;
  moodBadge.textContent = mood;

  hungerText.textContent = pet.hunger;
  energyText.textContent = pet.energy;
  happyText.textContent = pet.happiness;

  healthText.textContent = health;
  sleepText.textContent = pet.sleeping ? "yes" : "no";

  // bars
  hungerBar.style.width = pet.hunger + "%";
  energyBar.style.width = pet.energy + "%";
  happyBar.style.width = pet.happiness + "%";
  healthBar.style.width = health + "%";

  // reset sleeping class every render
  petBox.classList.remove("sleeping");

  // pet look changes
  if (mood === "happy") {
    petBox.style.filter = "saturate(1.05) brightness(1.02)";
    mouth.textContent = "ᴗ";
    tipText.textContent = "baby is happy ";
  } else if (mood === "hungry") {
    petBox.style.filter = "saturate(0.95) brightness(0.98)";
    mouth.textContent = "ω";
    tipText.textContent = "feed me plsss ❍ º";
  } else if (mood === "sleepy") {
    petBox.style.filter = "saturate(0.9) brightness(0.95)";
    mouth.textContent = "–";
    tipText.textContent = "i tired… let me sleep ❍ º";
  } else if (mood === "bored") {
    petBox.style.filter = "saturate(0.95) brightness(0.98)";
    mouth.textContent = "o";
    tipText.textContent = "play with me ahaaa ❍ º";
  } else { // sleeping
    petBox.classList.add("sleeping");
    petBox.style.filter = "saturate(0.85) brightness(0.95)";
    mouth.textContent = "z";
    tipText.textContent = "zzz…";
  }
}

// ---- Actions ----
function feed() {
  if (pet.sleeping) {
    if (window.$ && $("#pet").effect) $("#pet").effect("shake", { times: 1, distance: 6 }, 200);
    return;
  }

  pet.hunger = pet.hunger - 20;
  pet.happiness = pet.happiness + 5;

  keepInRange();
  savePet();
  render();

  if (window.$ && $("#pet").effect) $("#pet").effect("bounce", { times: 1, distance: 10 }, 250);
}

function play() {
  if (pet.sleeping) {
    if (window.$ && $("#pet").effect) $("#pet").effect("shake", { times: 1, distance: 6 }, 200);
    return;
  }

  pet.happiness = pet.happiness + 18;
  pet.energy = pet.energy - 10;
  pet.hunger = pet.hunger + 6;

  keepInRange();
  savePet();
  render();

  if (window.$ && $("#pet").effect) $("#pet").effect("pulsate", { times: 1 }, 220);
}

function sleepWake() {
  pet.sleeping = !pet.sleeping;

  savePet();
  render();
}

function resetPet() {
  pet.hunger = 20;
  pet.energy = 80;
  pet.happiness = 75;
  pet.sleeping = false;

  savePet();
  render();
}

// ---- Time-based updates ----
setInterval(function () {
  // over time hunger goes up, energy/happiness go down
  if (pet.sleeping) {
    pet.energy = pet.energy + 8;
    pet.hunger = pet.hunger + 2;
    pet.happiness = pet.happiness - 1;

    // auto wake when fully rested
    if (pet.energy >= 100) {
      pet.energy = 100;
      pet.sleeping = false;
    }
  } else {
    pet.hunger = pet.hunger + 4;
    pet.energy = pet.energy - 3;
    pet.happiness = pet.happiness - 2;
  }

  keepInRange();
  savePet();
  render();
}, 4000);

// first time
render();
