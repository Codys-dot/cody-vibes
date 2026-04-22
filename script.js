// Game state
const gameState = {
    money: 100,
    tier: 1,
    upgrades: [],
    purchasedUpgrades: 0,
    customerCount: 0,
    moneyPerCustomer: 25,
    customerVisitRate: 3000, // milliseconds
    restaurantElement: null,
    customerSpawnInterval: null,
    minigameActive: false,
    minigameCooldownEnd: 0 // Timestamp when cooldown expires
};

// Define all 20 upgrades
const upgrades = [
    {
        id: 1,
        name: "Better Lights",
        description: "Install proper LED lighting",
        cost: 750,
        benefit: "Increase money per customer by $10",
        moneyBoost: 10,
        tier: 1
    },
    {
        id: 2,
        name: "Fresh Paint",
        description: "Paint the walls a brighter color",
        cost: 1050,
        benefit: "Increase customer visit rate by 10%",
        rateBoost: 0.9,
        tier: 1
    },
    {
        id: 3,
        name: "New Chairs",
        description: "Replace old furniture",
        cost: 1500,
        benefit: "Increase money per customer by $15",
        moneyBoost: 15,
        tier: 1
    },
    {
        id: 4,
        name: "Cleaner Floors",
        description: "Deep clean and polish.",
        cost: 2250,
        benefit: "Increase money per customer by $20",
        moneyBoost: 20,
        tier: 2
    },
    {
        id: 5,
        name: "Quality Menu",
        description: "Print professional menus.",
        cost: 3000,
        benefit: "Increase customer visit rate by 15%",
        rateBoost: 0.85,
        tier: 2
    },
    {
        id: 6,
        name: "Music System",
        description: "Install background music.",
        cost: 3750,
        benefit: "Increase money per customer by $25",
        moneyBoost: 25,
        tier: 2
    },
    {
        id: 7,
        name: "Better Lighting",
        description: "Upgrade to ambient lighting.",
        cost: 4500,
        benefit: "Increase customer visit rate by 20%",
        rateBoost: 0.80,
        tier: 2
    },
    {
        id: 8,
        name: "Kitchen Upgrade",
        description: "Modernize the kitchen",
        cost: 7500,
        benefit: "Increase money per customer by $35",
        moneyBoost: 35,
        tier: 3
    },
    {
        id: 9,
        name: "Elegant Decor",
        description: "Add artistic decorations",
        cost: 9000,
        benefit: "Increase money per customer by $40",
        moneyBoost: 40,
        tier: 3
    },
    {
        id: 10,
        name: "Premium Tableware",
        description: "Upgrade to fine china",
        cost: 10500,
        benefit: "Increase customer visit rate by 25%",
        rateBoost: 0.75,
        tier: 3
    },
    {
        id: 11,
        name: "Marble Counters",
        description: "Install elegant marble",
        cost: 15000,
        benefit: "Increase money per customer by $50",
        moneyBoost: 50,
        tier: 3
    },
    {
        id: 12,
        name: "Crystal Chandeliers",
        description: "Add luxurious chandeliers",
        cost: 22500,
        benefit: "Increase customer visit rate by 30%",
        rateBoost: 0.70,
        tier: 4
    },
    {
        id: 13,
        name: "Chef's Table",
        description: "Create exclusive chef's table",
        cost: 30000,
        benefit: "Increase money per customer by $60",
        moneyBoost: 60,
        tier: 4
    },
    {
        id: 14,
        name: "Fine Wine Selection",
        description: "Curate premium wine collection",
        cost: 37500,
        benefit: "Increase money per customer by $75",
        moneyBoost: 75,
        tier: 4
    },
    {
        id: 15,
        name: "Gold Leaf Accents",
        description: "Add gold plating details",
        cost: 45000,
        benefit: "Increase customer visit rate by 35%",
        rateBoost: 0.65,
        tier: 4
    },
    {
        id: 16,
        name: "Michelin Chef",
        description: "Hire a world-class chef",
        cost: 60000,
        benefit: "Increase money per customer by $100",
        moneyBoost: 100,
        tier: 5
    },
    {
        id: 17,
        name: "Platinum Fixtures",
        description: "Install platinum bathroom fixtures",
        cost: 75000,
        benefit: "Increase money per customer by $125",
        moneyBoost: 125,
        tier: 5
    },
    {
        id: 18,
        name: "Private Courtyard",
        description: "Build outdoor dining area",
        cost: 105000,
        benefit: "Increase customer visit rate by 40%",
        rateBoost: 0.60,
        tier: 5
    },
    {
        id: 19,
        name: "Gold Restaurant",
        description: "Cover everything in gold",
        cost: 150000,
        benefit: "Increase money per customer by $200",
        moneyBoost: 200,
        tier: 5
    },
    {
        id: 20,
        name: "Legend Status",
        description: "Become a legendary restaurant.",
        cost: 300000,
        benefit: "Increase customer visit rate by 50%",
        rateBoost: 0.50,
        tier: 5
    }
];

const tierNames = {
    1: "Dusty Diner",
    2: "Cozy Café",
    3: "Fine Dining",
    4: "Upscale Restaurant",
    5: "Luxury Gold Restaurant"
};

// Initialize game
function initGame() {
    gameState.upgrades = upgrades.map(u => ({
        ...u,
        purchased: false
    }));

    gameState.restaurantElement = document.getElementById('restaurant');
    renderUpgrades();
    updateDisplay();
    startCustomerSpawning();
}

// Update display
function updateDisplay() {
    // Update money
    document.getElementById('money').textContent = '$' + formatNumber(gameState.money);

    // Update restaurant tier and visuals
    updateRestaurantVisuals();

    // Update progress
    const purchasedCount = gameState.upgrades.filter(u => u.purchased).length;
    document.getElementById('progress').textContent = `Progress: ${purchasedCount}/20 Upgrades`;
    document.getElementById('progressBar').style.width = (purchasedCount / 20 * 100) + '%';

    // Update money per customer
    document.getElementById('moneyPerCustomer').textContent = '$' + formatNumber(gameState.moneyPerCustomer);

    // Update customer rate
    const rateInSeconds = (gameState.customerVisitRate / 1000).toFixed(1);
    document.getElementById('customerRate').textContent = `1 per ${rateInSeconds}s`;
}

// Update restaurant visuals
function updateRestaurantVisuals() {
    const purchasedCount = gameState.upgrades.filter(u => u.purchased).length;
    
    let newTier = 1;
    if (purchasedCount >= 15) newTier = 5;
    else if (purchasedCount >= 12) newTier = 4;
    else if (purchasedCount >= 8) newTier = 3;
    else if (purchasedCount >= 4) newTier = 2;

    gameState.tier = newTier;

    // Update tier display
    document.getElementById('currentTier').textContent = `Tier: ${gameState.tier} - ${tierNames[gameState.tier]}`;

    // Update building visual
    const building = document.querySelector('.building');
    
    // Remove old tier classes
    for (let i = 1; i <= 5; i++) {
        building.parentElement.classList.remove(`tier-${i}`);
    }
    
    // Add new tier class
    building.parentElement.classList.add(`tier-${gameState.tier}`);

    // Update restaurant name
    document.getElementById('restaurantName').textContent = tierNames[gameState.tier];
}

// Render upgrades
function renderUpgrades() {
    const upgradesList = document.getElementById('upgradesList');
    upgradesList.innerHTML = '';

    gameState.upgrades.forEach(upgrade => {
        const card = document.createElement('div');
        card.className = 'upgrade-card';
        
        if (upgrade.purchased) {
            card.classList.add('purchased');
        }

        const canAfford = gameState.money >= upgrade.cost && !upgrade.purchased;
        
        card.innerHTML = `
            <div class="upgrade-title">${upgrade.name}</div>
            <div class="upgrade-description">${upgrade.description}</div>
            <div class="upgrade-cost">$${formatNumber(upgrade.cost)}</div>
            <div class="upgrade-benefit">${upgrade.benefit}</div>
            <button class="buy-button ${upgrade.purchased ? 'purchased' : ''}" 
                    onclick="purchaseUpgrade(${upgrade.id})"
                    ${upgrade.purchased ? 'disabled' : ''}>
                ${upgrade.purchased ? '✓ Purchased' : canAfford ? 'Buy Now' : 'Not Enough Money'}
            </button>
        `;

        if (!canAfford && !upgrade.purchased) {
            card.style.opacity = '0.7';
        }

        upgradesList.appendChild(card);
    });
}

// Purchase upgrade
function purchaseUpgrade(upgradeId) {
    const upgrade = gameState.upgrades.find(u => u.id === upgradeId);
    
    if (upgrade.purchased) return;
    if (gameState.money < upgrade.cost) return;

    // Deduct cost
    gameState.money -= upgrade.cost;

    // Mark as purchased
    upgrade.purchased = true;

    // Apply benefits
    if (upgrade.moneyBoost) {
        gameState.moneyPerCustomer += upgrade.moneyBoost;
    }

    if (upgrade.rateBoost) {
        gameState.customerVisitRate = Math.max(500, gameState.customerVisitRate * upgrade.rateBoost);
        
        // Restart customer spawning with new rate
        clearInterval(gameState.customerSpawnInterval);
        startCustomerSpawning();
    }

    // Show hints at certain milestones 
    if (upgrade.id === 4) {
        setTimeout(() => alert("💡 Clue unlocked: first code digit is 4."), 1000);
    } else if (upgrade.id === 10) {
        setTimeout(() => alert("💡 Clue unlocked: second code digit is 5."), 1000);
    } else if (upgrade.id === 15) {
        setTimeout(() => alert("💡 Clue unlocked: third digit is tied to the third tier.") , 1000);
    } else if (upgrade.id === 19) {
        setTimeout(() => alert("💡 Clue unlocked: final digit is one less than the number of fingers on one hand."), 1000);
    }

    // Update display
    updateDisplay();
    renderUpgrades();
}

// Customer spawning and transactions
function startCustomerSpawning() {
    gameState.customerSpawnInterval = setInterval(() => {
        spawnCustomer();
    }, gameState.customerVisitRate);
}

function spawnCustomer() {
    const customerArea = document.getElementById('customerArea');
    const customer = document.createElement('div');
    customer.className = 'customer';
    customer.textContent = '👤';
    customer.style.cursor = 'pointer';
    
    const randomLeft = Math.random() * (customerArea.offsetWidth - 40);
    customer.style.left = randomLeft + 'px';
    customer.style.top = Math.random() * (customerArea.offsetHeight - 40) + 'px';

    let customerClicked = false;
    let timeoutId = null;

    // Click handler for customer interactions
    customer.addEventListener('click', (e) => {
        if (customerClicked) return;
        
        customerClicked = true;
        
        // Calculate bonus payment (150% of normal payment)
        const bonusPayment = Math.floor(gameState.moneyPerCustomer * 1.5);
        gameState.money += bonusPayment;

        // Show floating text with bonus amount
        const floatingText = document.createElement('div');
        floatingText.className = 'floating-money';
        floatingText.textContent = `+$${formatNumber(bonusPayment)}`;
        floatingText.style.left = (randomLeft + 15) + 'px';
        floatingText.style.top = customer.style.top;
        customerArea.appendChild(floatingText);

        // Change customer appearance to show interaction
        customer.style.background = '#4caf50';
        customer.style.transform = 'scale(1.2)';
        customer.textContent = '😊';

        // Remove floating text after animation
        setTimeout(() => floatingText.remove(), 800);

        // Make customer leave immediately
        if (timeoutId) clearTimeout(timeoutId);
        if (customer.parentElement) {
            customer.classList.add('leaving');
            
            setTimeout(() => {
                gameState.customerCount--;
                document.getElementById('customerCount').textContent = `Customers in restaurant: ${gameState.customerCount}`;
                updateDisplay();
                renderUpgrades();
                customer.remove();
            }, 500);
        }
    });

    customerArea.appendChild(customer);
    gameState.customerCount++;

    // Update customer count
    document.getElementById('customerCount').textContent = `Customers in restaurant: ${gameState.customerCount}`;

    // Customer stays for a random time then leaves without payment if not clicked
    timeoutId = setTimeout(() => {
        if (customer.parentElement && !customerClicked) {
            customer.classList.add('leaving');
            
            setTimeout(() => {
                gameState.customerCount--;
                document.getElementById('customerCount').textContent = `Customers in restaurant: ${gameState.customerCount}`;
                updateDisplay();
                renderUpgrades();
                customer.remove();
            }, 500);
        }
    }, 2000 + Math.random() * 3000);
}

// Utility function to format numbers
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Cooking Minigame Functions
function startCookingMinigame() {
    if (gameState.minigameActive) return;
    
    // Check if cooldown is active
    const now = Date.now();
    if (now < gameState.minigameCooldownEnd) {
        const remainingSeconds = Math.ceil((gameState.minigameCooldownEnd - now) / 1000);
        alert(`Minigame on cooldown! Wait ${remainingSeconds} more seconds.`);
        return;
    }
    
    gameState.minigameActive = true;
    const modal = document.getElementById('minigameModal');
    const gameArea = document.getElementById('minigameArea');
    const scoreDisplay = document.getElementById('minigameScore');
    const timeDisplay = document.getElementById('minigameTime');
    const closeBtn = document.getElementById('closeMinigameBtn');
    
    modal.style.display = 'flex';
    closeBtn.style.display = 'none';
    gameArea.innerHTML = '';
    
    let score = 0;
    let timeLeft = 10;
    const panCount = 6;
    
    // Create initial pans
    function createPans() {
        gameArea.innerHTML = '';
        for (let i = 0; i < panCount; i++) {
            const pan = document.createElement('div');
            pan.className = 'cooking-pan';
            pan.textContent = '🍳';
            pan.onclick = (e) => {
                e.stopPropagation();
                score++;
                scoreDisplay.textContent = score;
                pan.style.animation = 'none';
                setTimeout(() => {
                    if (gameArea.contains(pan)) {
                        pan.style.animation = '';
                    }
                }, 10);
            };
            gameArea.appendChild(pan);
        }
    }
    
    createPans();
    scoreDisplay.textContent = '0';
    timeDisplay.textContent = timeLeft;
    
    // Timer countdown
    const timerInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endMinigame(score);
        }
    }, 1000);
}

function endMinigame(score) {
    gameState.minigameActive = false;
    // Set cooldown for 45 seconds
    gameState.minigameCooldownEnd = Date.now() + (45 * 1000);
    
    const modal = document.getElementById('minigameModal');
    const gameArea = document.getElementById('minigameArea');
    const closeBtn = document.getElementById('closeMinigameBtn');
    
    // Calculate reward based on score (10 per click - reduced reward)
    const reward = score * 10;
    gameState.money += reward;
    
    // Start cooldown timer on button
    updateCookingButtonCooldown();
    
    gameArea.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h3 style="font-size: 2em; margin-bottom: 20px;">🎉 Game Over!</h3>
            <p style="font-size: 1.5em; color: #667eea; margin-bottom: 20px;">Score: ${score}</p>
            <p style="font-size: 1.3em; color: #4caf50;">Earned: $${formatNumber(reward)}</p>
        </div>
    `;
    
    closeBtn.style.display = 'block';
    updateDisplay();
    renderUpgrades();
}

function updateCookingButtonCooldown() {
    const button = document.getElementById('cookingButton');
    const now = Date.now();
    const cooldownEnd = gameState.minigameCooldownEnd;
    
    if (now >= cooldownEnd) {
        // Cooldown expired
        button.classList.remove('on-cooldown');
        button.textContent = '🍳 Start Cooking';
        button.disabled = false;
        return;
    }
    
    // Cooldown still active
    button.classList.add('on-cooldown');
    button.disabled = true;
    
    const remainingMs = cooldownEnd - now;
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    button.textContent = `⏱️ Cooldown: ${remainingSeconds}s`;
    
    // Schedule next update
    setTimeout(updateCookingButtonCooldown, 100);
}

function closeCookingMinigame() {
    const modal = document.getElementById('minigameModal');
    modal.style.display = 'none';
}

// Typing Minigame Functions
const typingWords = [
    'gastronomy', 'connoisseur', 'culinary', 'artisanal', 'sophisticated', 'sustainability', 'farm-to-table', 'delectable', 'mouthwatering', 'meticulous',
    'hospitality', 'presentation', 'ambiance', 'ambidextrous', 'palate', 'marinade', 'fermentation', 'zestful', 'umami', 'decadent',
    'gastronomic', 'roasted', 'caramelization', 'sauteing', 'bouillabaisse', 'mise-en-place', 'hierarchy', 'accompaniment', 'epicurean', 'bouquet',
    'umami', 'patisserie', 'flambé', 'velvety', 'truffle', 'infusion', 'charcuterie', 'nougat', 'tenderloin', 'champagne'
];

let currentTypingWord = '';
let typingScore = 0;
let typingTimeLeft = 60;
let typingTimer = null;
let typingInTransition = false;

function startTypingMinigame() {
    if (gameState.minigameActive) return;
    
    // Check if cooldown is active
    const now = Date.now();
    if (now < gameState.minigameCooldownEnd) {
        const remainingSeconds = Math.ceil((gameState.minigameCooldownEnd - now) / 1000);
        alert(`Minigame on cooldown! Wait ${remainingSeconds} more seconds.`);
        return;
    }
    
    gameState.minigameActive = true;
    const modal = document.getElementById('typingModal');
    const wordDisplay = document.getElementById('wordDisplay');
    const input = document.getElementById('typingInput');
    const scoreDisplay = document.getElementById('typingScore');
    const timeDisplay = document.getElementById('typingTime');
    const closeBtn = document.getElementById('closeTypingBtn');
    
    modal.style.display = 'flex';
    closeBtn.style.display = 'none';
    input.value = '';
    input.focus();
    
    typingScore = 0;
    typingTimeLeft = 30;
    typingInTransition = false; // Reset transition flag
    scoreDisplay.textContent = '0';
    timeDisplay.textContent = typingTimeLeft;
    
    // Start with first word
    nextTypingWord();
    
    // Start timer (30-second round)
    typingTimer = setInterval(() => {
        typingTimeLeft--;
        timeDisplay.textContent = typingTimeLeft;
        
        if (typingTimeLeft <= 0) {
            clearInterval(typingTimer);
            endTypingMinigame();
        }
    }, 1000);
    
    // Handle input
    input.addEventListener('input', handleTypingInput);
}

function nextTypingWord() {
    currentTypingWord = typingWords[Math.floor(Math.random() * typingWords.length)];
    document.getElementById('wordDisplay').textContent = currentTypingWord;
}

function handleTypingInput(e) {
    if (typingInTransition) return; // Skip processing during word transition
    
    const input = e.target;
    const typedText = input.value.toLowerCase();
    const targetWord = currentTypingWord.toLowerCase();
    
    // Check if typed text matches the beginning of the word
    if (targetWord.startsWith(typedText)) {
        // Correct so far - change color to green
        input.style.borderColor = '#4caf50';
    } else {
        // Wrong - end game
        clearInterval(typingTimer);
        endTypingMinigame();
        return;
    }
    
    // Check if word is complete
    if (typedText === targetWord) {
        typingScore++;
        document.getElementById('typingScore').textContent = typingScore;
        typingInTransition = true; // Prevent listener from firing during clear
        input.value = '';
        input.style.borderColor = '#667eea';
        nextTypingWord();
        setTimeout(() => {
            typingInTransition = false; // Re-enable after transition
        }, 10);
    }
}

function endTypingMinigame() {
    gameState.minigameActive = false;
    typingInTransition = false; // Reset transition flag
    // Set cooldown for 45 seconds
    gameState.minigameCooldownEnd = Date.now() + (45 * 1000);
    
    const modal = document.getElementById('typingModal');
    const typingArea = document.getElementById('typingArea');
    const closeBtn = document.getElementById('closeTypingBtn');
    const input = document.getElementById('typingInput');
    
    // Remove input listener
    input.removeEventListener('input', handleTypingInput);
    
    // Calculate reward based on score (15 per word - good reward for typing)
    const reward = typingScore * 15;
    gameState.money += reward;
    
    // Start cooldown timer on buttons
    updateCookingButtonCooldown();
    updateTypingButtonCooldown();
    
    typingArea.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h3 style="font-size: 2em; margin-bottom: 20px;">⌨️ Typing Complete!</h3>
            <p style="font-size: 1.5em; color: #667eea; margin-bottom: 20px;">Words Typed: ${typingScore}</p>
            <p style="font-size: 1.3em; color: #4caf50;">Earned: $${formatNumber(reward)}</p>
        </div>
    `;
    
    closeBtn.style.display = 'block';
    updateDisplay();
    renderUpgrades();
}

function updateTypingButtonCooldown() {
    const button = document.getElementById('typingButton');
    const now = Date.now();
    const cooldownEnd = gameState.minigameCooldownEnd;
    
    if (now >= cooldownEnd) {
        // Cooldown expired
        button.classList.remove('on-cooldown');
        button.textContent = '⌨️ Speed Typing';
        button.disabled = false;
        return;
    }
    
    // Cooldown still active
    button.classList.add('on-cooldown');
    button.disabled = true;
    
    const remainingMs = cooldownEnd - now;
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    button.textContent = `⏱️ Cooldown: ${remainingSeconds}s`;
    
    // Schedule next update
    setTimeout(updateTypingButtonCooldown, 100);
}

function closeTypingMinigame() {
    const modal = document.getElementById('typingModal');
    modal.style.display = 'none';
}

// Start the game
document.addEventListener('DOMContentLoaded', initGame);
