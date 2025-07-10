function showPopupMessage(message, duration = 2000) {
  const popup = document.getElementById('popup-message');
  popup.textContent = message;
  popup.classList.remove('hidden');
  popup.classList.add('visible');

  // Automatically hide the popup after the specified duration
  setTimeout(() => {
    popup.classList.remove('visible');
    popup.classList.add('hidden');
  }, duration);
}



let energy = 100;
let strength = 15;
let speed = 15;
let IQ = 15;
let luck = 0;
let currentHealth = 125;
currentHealth = Math.max(currentHealth, 0);
let maxHealth = 125;
let maxNRG = 100;
let cash = 25000;
let level = 1;
let currentXP = 0;
let maxXP = 250;
let inventory = {};
let nrgRegenInterval;
let healInterval;


const items = [
  { name: "Mysterious Gem", image: "/assets/rpg-images/gem.png" },
  { name: "5-leaf Clover", image: "/assets/rpg-images/5clover.png" },
  { name: "Medkit", image: "/assets/rpg-images/medkit.png" },
  { name: "NRG Vial", image: "/assets/rpg-images/NRGvial.png" }

]

startItems();
updateBars();
console.log(inventory)

function startItems() {
  addToInventory("Medkit", "/assets/rpg-images/medkit.png", 5);
  addToInventory("NRG Vial", "/assets/rpg-images/NRGvial.png", 10);
}

function updateBars() {
  updateHealthBar();
  updateXPBar();
  updateNRGBar();
  updateRestButtonState();
  updateActionButtons();
}

function updateActionButtons() {
  const trainButton = document.getElementById("train-button");
  const exploreButton = document.getElementById("explore-button");
  const huntButton = document.getElementById("hunt-button");

  if (currentHealth <= 0) {
    trainButton.disabled = true;
    exploreButton.disabled = true;
    huntButton.disabled = true;

    trainButton.classList.add("disabled");
    exploreButton.classList.add("disabled");
    huntButton.classList.add("disabled");
  } else {
    trainButton.disabled = false;
    exploreButton.disabled = false;
    huntButton.disabled = false;

    trainButton.classList.remove("disabled");
    exploreButton.classList.remove("disabled");
    huntButton.classList.remove("disabled");
  }
}



function encounterEnemy() {
  const modal = document.getElementById('battle-modal');
  const battleLog = document.getElementById('battle-log');
  const attackButton = document.getElementById('attack');
  const runButton = document.getElementById('flee');
  const useMedkitButton = document.getElementById('use-medkit');

  // Enemy stats
  const enemyLevel = Math.floor(level / 1) + 1;// Enemy level is based on the player's level
  let enemyHealth = (50 * enemyLevel) + 100; // Enemy starting health
  let enemyMaxHealth = enemyHealth; // Enemy maximum health
  let enemyDamage = Math.floor(Math.random() * 5 * enemyLevel) + 100; //incr dmg based on lvl


  // Show the modal and reset log
  modal.classList.remove('hidden');
  battleLog.innerHTML = "An enemy approaches! Prepare for battle.<br>";




  // Attack logic
  attackButton.onclick = () => {
    const playerAtk = Math.floor(Math.random() * 15) + strength; // Player atk based on lvl
    const enemyAtk = Math.floor(Math.random() * enemyDamage) + 8; // Enmy atk based on lvl
    //dogde chance with speed stat
    const dogdeChance = Math.min(speed * 2, 60);
    const dogded = Math.random() * 100 < dogdeChance;

    //Player lands hit
    enemyHealth -= playerAtk;
    battleLog.innerHTML += `You dealt ${playerAtk} damage to the enemy.<br>`;
    if (!dogded) {
      currentHealth -= enemyAtk; //enemy lands hit
      battleLog.innerHTML += `The enemy dealt ${enemyAtk} damage to you.<br>`;
      updateBars()
    } else {
      battleLog.innerHTML += `You dodged the enemy's attack!<br>`;
    }
    // Update battle log
    battleLog.innerHTML += `Enemy HP: ${Math.max(0, enemyHealth)}/${enemyMaxHealth}<br>`;
    battleLog.innerHTML += `Your HP: ${Math.max(0, currentHealth)}/${maxHealth}<br>`;
    battleLog.scrollTop = battleLog.scrollHeight;
    updateBars();
    // Check for battle outcomes
    if (enemyHealth <= 0) {
      battleLog.innerHTML += "You defeated the enemy!<br>";

      //scale rewards
      const rewardXP = 50 * enemyLevel;
      const rewardCash = 1500 * enemyLevel;

      cash += rewardCash; // Reward for defeating the enemy
      gainXP(rewardXP); // XP reward
      setTimeout(() => {
        showPopupMessage(`You won the battle! Rewards: $${rewardCash} and ${rewardXP} XP.`);
        modal.classList.add('hidden');
        updateStats();
      }, 500); // Delay to show logs
    } else if (currentHealth <= 0) {
      battleLog.innerHTML += "You were defeated in battle.<br>";
      setTimeout(() => {
        showPopupMessage("You were defeated! You lost the battle.");
        modal.classList.add('hidden');
        energy = maxNRG / 2; // Lose half your energy
        updateStats();
      }, 500);
    }
  };

  // Run logic
  runButton.onclick = () => {
    battleLog.innerHTML += "You fled the battle!<br>";
    setTimeout(() => {
      showPopupMessage("You ran away safely.");
      modal.classList.add('hidden');
    }, 500);
  };

  // Use Medkit logic
  useMedkitButton.onclick = () => {
    useMedkit();
  }

}
function battleEnd(result) {
  const modal = document.getElementById('battle-modal');
  modal.classList.add('hidden');

  //UpdateStats based on result
  if (result == "defeat") {
    updateLog("You were defeated!");
    //add a knockout time
  } else if (result == "run") {
    updateLog("You fled the battle!");
  }
}

function hunt() {
  if (energy >= 40) {
    energy -= 40;
    let IQGain = Math.floor(Math.random() * 5) + 3;
    IQ += IQGain;
    encounterEnemy();
  }
  else {
    showPopupMessage("You don't have enough energy to hunt!")
  }
}

function useMedkit() {
  //heal logic
  // useMedkitButton.onclick = () => {
  updateInventory();

  if (inventory["Medkit"] !== undefined && inventory["Medkit"].count >= 0) {
    const healAmount = Math.min(maxHealth - currentHealth, 100);
    currentHealth += healAmount;
    // inventory["Medkit"].count -= 1;
    rmvFromInventory("Medkit");
    showPopupMessage("You used a Medkit and healed 100 HP!");
    updateHealthBar();
    updateBars();
  } else {
    showPopupMessage("You don't have any Medkits left! Explore to find more.");
  }
  // }
}

function useNRGVial() {
  updateInventory();
  // useMedkitButton.onclick = () => {
  if (inventory["NRG Vial"].count >= 0) {
    energy = Math.min(energy + 50, maxNRG);
    rmvFromInventory("NRG Vial");
    showPopupMessage("You used a NRG Vial and gained 50 NRG!");
    updateBars();
  } else {
    showPopupMessage("You don't have any NRG Vial's left! Explore to find more.");
  }
  // }
}

function train(energyCost, xpReward) {
  if (energy >= energyCost) {
    energy -= energyCost;

    updateNRGBar()
    let strengthGain = Math.floor(Math.random() * 5) + 3;
    let speedGain = Math.floor(Math.random() * 3) + 1;

    strength += strengthGain;
    speed += speedGain;

    gainXP(xpReward)
    updateStats();
    showPopupMessage(`You gained ${strengthGain} strength and ${speedGain} speed | ${xpReward} XP.`);
  } else {
    showPopupMessage("Not enough energy to train.");
  }
}

function gainXP(xp) {
  currentXP += xp;
  while (currentXP >= maxXP) {
    currentXP -= maxXP;
    levelUp();
  }
  updateXPBar();
}

function addToInventory(itemName, imgSrc, num) {
  if (inventory[itemName]) {
    inventory[itemName].count++;
  } else {
    inventory[itemName] = { count: num, image: imgSrc };
  }
  updateInventory();
}

function rmvFromInventory(itemName) {
  if (inventory[itemName]) {
    if (inventory[itemName].count > 0) {
      inventory[itemName].count--;

      //if count is 0, remove the item from the inventory
      if (inventory[itemName].count === 0) {
        delete inventory[itemName];
        // showPopupMessage(itemName + " has been removed from your inventory.")
      }
    } else {
      showPopupMessage(itemName + " is not in your inventory.");
    }
  }
  updateInventory();
}
function updateInventory() {
  const inventoryElement = document.getElementById('inventory');
  inventoryElement.innerHTML = "Inventory: ";

  console.log("Updating inventory: " + inventory);

  Object.keys(inventory).forEach(itemName => {
    const item = inventory[itemName];
    const itemElement = document.createElement('div');
    itemElement.classList.add('inventory-item');

    const itemImage = document.createElement('img');
    itemImage.src = item.image;
    itemImage.alt = itemName;

    const itemLabel = document.createElement('div');
    itemLabel.textContent = `${itemName} x(${item.count})`;

    const useButton = document.createElement('button');
    useButton.textContent = "use";
    useButton.onclick = () => useItem(itemName)

    itemElement.appendChild(itemImage);
    itemElement.appendChild(itemLabel);
    itemElement.appendChild(useButton);
    inventoryElement.appendChild(itemElement); //add to display
  })
}

function useItem(itemName) {
  if (!inventory[itemName] || inventory[itemName].count <= 0) {
    showPopupMessage(`You don't have ${itemName} in your inventory.`);
    return;
  }

  switch (itemName) {
    case "Medkit":
      useMedkit();
      break;
    case "NRG Vial":
      useNRGVial();
      break;
    case "Mysterious Gem":
      showPopupMessage("It's a rare item, but it's not useful yet.");
      break;
    case "5-leaf Clover":
      luck += 5;
      rmvFromInventory("5-leaf Clover");
      showPopupMessage("Your luck has increased!");
  }
}

function explore(energyCost) {


  if (energy >= energyCost) {
    energy -= energyCost;
    updateNRGBar();
    let event = Math.random();
    if (event < 0.7) {
      let foundCash = Math.floor(Math.random() * 50 + 1)
      cash += foundCash;
      let xpGain = Math.floor(Math.random() * 25 + 1)
      gainXP(xpGain);
      showPopupMessage(`Explored and found ${foundCash} cash and gained ${xpGain}.`);
    } else if (event < 0.95) {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      addToInventory(randomItem.name, randomItem.image, 1);
      showPopupMessage(`You found a ${randomItem.name}.`);
    } else {
      // let enemy = "Goblin";
      // let enemyHealth = 50;
      // updateLog(`You encountered a ${enemy}!`);
      encounterEnemy();
      // while(enemyHealth > 0){
      //   let action = prompt("What will you do? (attack/run)");
      //   if(action === "attack"){
      //     let damage = Math.floor(Math.random() * 10 + 1);
      //     enemyHealth -= damage;
      //     updateLog(`You dealt ${damage} damage to the ${enemy}.`);
      //     if(enemyHealth <= 0){
      //       updateLog(`You defeated the ${enemy}!`);
      //       let reward = Math.floor(Math.random() * 50 + 1);
      //       cash += reward;
      //       gainXP(100)
      //       updateLog(`You earned 100 XP and ${reward} cash.`);
      //       break;
      //     }
      //   } else if(action === "run"){
      //     updateLog("You ran away from the battle.");
      //     break;
      //   } else{
      //     updateLog("Invalid action. Try again.");
      //   }
    }
    updateStats();
  } else {
    showPopupMessage("Not enough energy to explore.");
  }
}
function updateRestButtonState() {
  const restButton = document.getElementById("rest-button"); // Ensure your button has this ID
  if (energy >= maxNRG && currentHealth >= maxHealth) {
    restButton.disabled = true; // Disable the button
    restButton.classList.add("disabled"); // Add a class to style the disabled state
  } else {
    restButton.disabled = false; // Enable the button
    restButton.classList.remove("disabled"); // Remove the disabled styling
  }
}


function rest() {
  //adds 30 net instantly but doesn't exceed the max
  if (energy < maxNRG && currentHealth < maxHealth) {
    energy = Math.min(energy + 30, maxNRG);
    currentHealth = Math.min(currentHealth + 75, maxHealth);
    updateBars();
    showPopupMessage("You rested, healed, and regained 30 energy.");
    updateStats();
  } else {
    showPopupMessage("You are already fully rested.")
  }
  //start gradual nrg regeneration if not already running
  // if (!nrgRegenInterval) {
  //   nrgRegenInterval = setInterval(() => {
  //     if (energy < maxNRG) {
  //       energy = Math.min(energy + 10, maxNRG); //regen 10 every 2 mins
  //       showPopupMessage("You regenerated 10 energy.");

  //     } else {
  //       clearInterval(nrgRegenInterval);
  //       nrgRegenInterval = null;
  //     }
  //   }, 2 * 60 * 1000); // Regenerate every second
  //   updateBars();
  // }

  //start gradually regaining health if not full.
  // if (currentHealth < maxHealth) {
  //   let healInterval = setInterval(() => {
  //     if (currentHealth < maxHealth) {
  //       currentHealth = Math.min(currentHealth + 25, maxHealth); //heal 5 every 2 mins
  //       showPopupMessage("You healed 5 health.");
  //       updateStats();
  //     } else {
  //       clearInterval(healInterval);
  //     }
  //   }, 2 * 60 * 1000); // Heal every second
  // }
  updateBars();
}



function updateStats() {
  document.getElementById("strength").innerHTML = "Strenght: " + strength;
  document.getElementById("speed").innerHTML = "Speed: " + speed;
  // document.getElementById("nrg").innerHTML = "Energy: " + energy;
  document.getElementById("cash").innerHTML = "Cash: $" + cash;
  // document.getElementById("lvl").innerHTML = "Level: " + level;
  // document.getElementById("exp").innerHTML = "XP: " + currentXP;
  // document.getElementById('inventory').innerText = inventory.length > 0 ? "Inventory: " + inventory.join(", ") : "Inventory: Empty";
  document.getElementById("intelligence").innerHTML = "IQ: " + IQ;
  updateInventory();
}

function updateXPBar() {
  const expBar = document.getElementById("exp-bar");
  const levelDisplay = document.getElementById("level");
  const expText = document.getElementById("exp-percentage");


  //update the xp bar width
  const progress = (currentXP / maxXP) * 100;
  expBar.style.width = `${progress}%`
  //update the level display
  levelDisplay.innerText = `Level ${level}`;
  expText.textContent = `${currentXP}/${maxXP} XP`;
}

function updateHealthBar() {
  const healthBar = document.getElementById("health-bar");
  const healthDisplay = document.getElementById("health");
  const healthPercentage = document.getElementById("health-percentage");

  //update the health bar width
  const juice = (currentHealth / maxHealth) * 100;
  healthBar.style.width = `${Math.max(juice, 0)}%`
  //update the health display
  healthDisplay.innerText = `Health ${Math.max(currentHealth, 0)}`;
  healthPercentage.textContent = `${Math.max(juice.toFixed(2), 0)}%`
}

function updateNRGBar() {
  const nrgBar = document.getElementById("nrg-bar");
  // const nrgDisplay = document.getElementById("nrg");
  const nrgCount = document.getElementById("nrg-count");

  //update the nrg bar width
  const nrgLeft = (energy / maxNRG) * 100;
  nrgBar.style.width = `${nrgLeft}%`;
  //update the nrg display
  // nrgDisplay.innerText = `MAX NRG ${energy}`;
  nrgCount.textContent = `${energy} / ${maxNRG} NRG`;
}
function levelUp() {
  level++;
  maxXP += 50;
  if (level % 5 === 0) {
    maxHealth += 25;
    maxNRG += 5;
  }
  // maxNRG += 5;
  // energy = maxNRG;
  updateStats();
  showPopupMessage(`Congratulations! You leveled up to level ${level}!`);
  energy = maxNRG;
  currentHealth = maxHealth;
  updateBars()
}


function updateLog(message) {
  const log = document.getElementById('log');

  //Create a new paragraph element
  const logEntry = document.createElement('p');
  logEntry.textContent = message;
  //Append the paragraph to the log
  log.appendChild(logEntry);
  //Scroll to the bottom of the log
  log.scrollTop = log.scrollHeight;
  //Remove log after 20 secs
  setTimeout(() => {
    logEntry.remove();
  }, 20000)

}