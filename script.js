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

// Secret code
const SECRET_CODE = "4532";
let secretCodeHints = [
    "The numbers seem important... 4, 5, 3, 2...",
    "I wonder what that mysterious button does?",
    "Some codes are just numbers in sequence...",
    "Have you tried clicking that subtle button in the corner?",
    "The secret might be hiding in plain sight...",
    "4...5...3...2... what could it mean?"
];

// Define all 20 upgrades
const upgrades = [
    {
        id: 1,
        name: "Better Lights",
        description: "Install proper LED lighting",
        cost: 250,
        benefit: "Increase money per customer by $10",
        moneyBoost: 10,
        tier: 1
    },
    {
        id: 2,
        name: "Fresh Paint",
        description: "Paint the walls a brighter color",
        cost: 350,
        benefit: "Increase customer visit rate by 10%",
        rateBoost: 0.9,
        tier: 1
    },
    {
        id: 3,
        name: "New Chairs",
        description: "Replace old furniture",
        cost: 500,
        benefit: "Increase money per customer by $15",
        moneyBoost: 15,
        tier: 1
    },
    {
        id: 4,
        name: "Cleaner Floors",
        description: "Deep clean and polish. (Hint: Some secrets start with 4...)",
        cost: 750,
        benefit: "Increase money per customer by $20",
        moneyBoost: 20,
        tier: 2
    },
    {
        id: 5,
        name: "Quality Menu",
        description: "Print professional menus. (The number 5 might be key...)",
        cost: 1000,
        benefit: "Increase customer visit rate by 15%",
        rateBoost: 0.85,
        tier: 2
    },
    {
        id: 6,
        name: "Music System",
        description: "Install background music. (3 might be the magic number...)",
        cost: 1250,
        benefit: "Increase money per customer by $25",
        moneyBoost: 25,
        tier: 2
    },
    {
        id: 7,
        name: "Better Lighting",
        description: "Upgrade to ambient lighting. (And 2 completes the sequence!)",
        cost: 1500,
        benefit: "Increase customer visit rate by 20%",
        rateBoost: 0.80,
        tier: 2
    },
    {
        id: 8,
        name: "Kitchen Upgrade",
        description: "Modernize the kitchen",
        cost: 2500,
        benefit: "Increase money per customer by $35",
        moneyBoost: 35,
        tier: 3
    },
    {
        id: 9,
        name: "Elegant Decor",
        description: "Add artistic decorations",
        cost: 3000,
        benefit: "Increase money per customer by $40",
        moneyBoost: 40,
        tier: 3
    },
    {
        id: 10,
        name: "Premium Tableware",
        description: "Upgrade to fine china",
        cost: 3500,
        benefit: "Increase customer visit rate by 25%",
        rateBoost: 0.75,
        tier: 3
    },
    {
        id: 11,
        name: "Marble Counters",
        description: "Install elegant marble",
        cost: 5000,
        benefit: "Increase money per customer by $50",
        moneyBoost: 50,
        tier: 3
    },
    {
        id: 12,
        name: "Crystal Chandeliers",
        description: "Add luxurious chandeliers",
        cost: 7500,
        benefit: "Increase customer visit rate by 30%",
        rateBoost: 0.70,
        tier: 4
    },
    {
        id: 13,
        name: "Chef's Table",
        description: "Create exclusive chef's table",
        cost: 10000,
        benefit: "Increase money per customer by $60",
        moneyBoost: 60,
        tier: 4
    },
    {
        id: 14,
        name: "Fine Wine Selection",
        description: "Curate premium wine collection",
        cost: 12500,
        benefit: "Increase money per customer by $75",
        moneyBoost: 75,
        tier: 4
    },
    {
        id: 15,
        name: "Gold Leaf Accents",
        description: "Add gold plating details",
        cost: 15000,
        benefit: "Increase customer visit rate by 35%",
        rateBoost: 0.65,
        tier: 4
    },
    {
        id: 16,
        name: "Michelin Chef",
        description: "Hire a world-class chef",
        cost: 20000,
        benefit: "Increase money per customer by $100",
        moneyBoost: 100,
        tier: 5
    },
    {
        id: 17,
        name: "Platinum Fixtures",
        description: "Install platinum bathroom fixtures",
        cost: 25000,
        benefit: "Increase money per customer by $125",
        moneyBoost: 125,
        tier: 5
    },
    {
        id: 18,
        name: "Private Courtyard",
        description: "Build outdoor dining area",
        cost: 35000,
        benefit: "Increase customer visit rate by 40%",
        rateBoost: 0.60,
        tier: 5
    },
    {
        id: 19,
        name: "Gold Restaurant",
        description: "Cover everything in gold",
        cost: 50000,
        benefit: "Increase money per customer by $200",
        moneyBoost: 200,
        tier: 5
    },
    {
        id: 20,
        name: "Legend Status",
        description: "Become a legendary restaurant. (The secret code is 4532 - try the mystery button!)",
        cost: 100000,
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
        setTimeout(() => alert("💡 Hint: You notice a mysterious button in the bottom right corner..."), 1000);
    } else if (upgrade.id === 10) {
        setTimeout(() => alert("💡 Hint: Some secrets require special codes..."), 1000);
    } else if (upgrade.id === 15) {
        setTimeout(() => alert("💡 Hint: The code might be numbers: 4, 5, 3, 2..."), 1000);
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
    // Show random hint occasionally
    showRandomHint();
    
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
    'restaurant', 'customer', 'kitchen', 'cooking', 'delicious', 'service', 'manager', 'business', 'upgrade', 'profit',
    'menu', 'recipe', 'chef', 'dining', 'table', 'order', 'server', 'food', 'drink', 'special',
    'lunch', 'dinner', 'breakfast', 'appetizer', 'dessert', 'beverage', 'reservation', 'atmosphere', 'ambiance', 'experience',
    'quality', 'fresh', 'ingredients', 'presentation', 'portion', 'value', 'satisfaction', 'review', 'rating', 'recommendation'
];

let currentTypingWord = '';
let typingScore = 0;
let typingTimeLeft = 60;
let typingTimer = null;

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
    typingTimeLeft = 60;
    scoreDisplay.textContent = '0';
    timeDisplay.textContent = typingTimeLeft;
    
    // Start with first word
    nextTypingWord();
    
    // Start timer
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
        input.value = '';
        input.style.borderColor = '#667eea';
        nextTypingWord();
    }
}

function endTypingMinigame() {
    gameState.minigameActive = false;
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

// Secret Code Functions
function openSecretCode() {
    const modal = document.getElementById('secretModal');
    const input = document.getElementById('secretCodeInput');
    const messageDiv = document.getElementById('secretMessage');
    const inputContainer = document.querySelector('.secret-input-container');
    const continueBtn = document.getElementById('continueBtn');
    
    modal.style.display = 'flex';
    input.value = '';
    messageDiv.textContent = '';
    inputContainer.style.display = 'block';
    continueBtn.style.display = 'none';
    input.focus();
    
    // Add Enter key support
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            submitSecretCode();
        }
    };
    
    input.addEventListener('keypress', handleKeyPress);
    
    // Store the handler to remove it later
    input._keyHandler = handleKeyPress;
}

function submitSecretCode() {
    const input = document.getElementById('secretCodeInput');
    const code = input.value.trim();
    const messageDiv = document.getElementById('secretMessage');
    const continueBtn = document.getElementById('continueBtn');
    
    if (code === SECRET_CODE) {
        // Correct code - give reward
        const reward = 2000000; // $2,000,000 bonus
        gameState.money += reward;
        updateDisplay();
        renderUpgrades();
        messageDiv.textContent = `🎉 SECRET CODE ACCEPTED! 🎉\n\nYou've unlocked a special bonus!\n+$${formatNumber(reward)} added to your balance!\n\nKeep playing to discover more secrets...`;
        messageDiv.style.color = '#4caf50';
        // Hide input and buttons on success
        document.querySelector('.secret-input-container').style.display = 'none';
        // Show continue button
        continueBtn.style.display = 'block';
    } else {
        // Wrong code
        input.style.borderColor = '#f44336';
        input.style.boxShadow = '0 0 15px rgba(244, 67, 54, 0.3)';
        setTimeout(() => {
            input.style.borderColor = '#667eea';
            input.style.boxShadow = 'none';
        }, 1000);
        messageDiv.textContent = "❌ Incorrect code. Keep exploring the game for hints!";
        messageDiv.style.color = '#f44336';
    }
}

function closeSecretModal() {
    const modal = document.getElementById('secretModal');
    const input = document.getElementById('secretCodeInput');
    
    // Remove the keypress event listener
    if (input._keyHandler) {
        input.removeEventListener('keypress', input._keyHandler);
        delete input._keyHandler;
    }
    
    modal.style.display = 'none';
}

// Scroll detection for secret button visibility
function updateSecretButtonVisibility() {
    const button = document.getElementById('secretButton');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Show button only when scrolled to bottom (within 100px of bottom)
    const isAtBottom = scrollTop + windowHeight >= documentHeight - 100;
    
    if (isAtBottom) {
        button.style.opacity = '1';
        button.style.pointerEvents = 'auto';
    } else {
        button.style.opacity = '0';
        button.style.pointerEvents = 'none';
    }
}

// Add random hints throughout gameplay
function showRandomHint() {
    if (Math.random() < 0.15) { // 15% chance when spawning customers
        const hint = secretCodeHints[Math.floor(Math.random() * secretCodeHints.length)];
        // Could show as a temporary notification, but for now just console log
        console.log("💡 Hint: " + hint);
    }
}

// Start the game
document.addEventListener('DOMContentLoaded', initGame);

// Add scroll listener for secret button visibility
window.addEventListener('scroll', updateSecretButtonVisibility);
window.addEventListener('resize', updateSecretButtonVisibility);

// Initialize secret button visibility
document.addEventListener('DOMContentLoaded', () => {
    updateSecretButtonVisibility();
});
