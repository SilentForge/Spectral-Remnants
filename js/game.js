class Game {
    constructor() {
        this.dungeon = new Dungeon(this);
        this.hero = new Hero();
        this.renderer = new Renderer();
        this.messageBox = document.getElementById('message-box');
        this.level = 1;
        this.inCombat = false;
        this.currentEnemy = null;
        this.exitReached = false;
        this.setupGameUI();
        this.setupCombatUI();
        this.setupEventListeners();
        this.init();
        this.tooltipElement = this.createTooltipElement();
        document.body.appendChild(this.tooltipElement);
        this.playedSounds = {};
        this.lastPlayerPosition = { x: -1, y: -1 };
        this.mainThemeAudio = null;
        this.setupAudioContext();
        this.inCombat = false;
        this.currentEnemy = null;
        this.attackCooldown = false;
        this.isModalOpen = false;
        this.hideTimeout = null;
        this.showMainMenu();

    }



    startNewGame() {
        // Remove the Main Menu
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) {
            document.body.removeChild(mainMenu);
        }

        // Show the game container
        document.getElementById('game-container').style.display = 'block';

        // Initialize or reset game variables
        this.init(); // Call the Init Method to Start A New Game
    }

    // Legame Method here
    quitGame() {
        if (confirm("Are you sure you want to quit the game ?")) {
            window.close(); //  Close the browser window (only works for tabs opened by script)
        }
    }
    showMainMenu() {
        document.getElementById('game-container').style.display = 'none';

        const mainMenu = document.createElement('div');
        mainMenu.id = 'main-menu';
        mainMenu.innerHTML = `
            <div class="logo-container">
                <div class="skull"></div>
                <h1 id="game-title" data-text="Spectral Remnants">
                    <span class="spectral">Spectral</span><br>
                    <span class="remnants">Remnants</span>
                </h1>
                <div id="particles"></div>
            </div>
            <div class="main-menu-button-container"></div>
        `;
        document.body.appendChild(mainMenu);

        // CUSTOM Buttons CREATE
        const buttonContainer = mainMenu.querySelector('.main-menu-button-container');

        // New Game Button
        const newGameButton = document.createElement('div');
        newGameButton.classList.add('main-menu-button');
        newGameButton.innerHTML = `<span class="btn-content">New Game</span><div class="btn-particles"></div>`;
        newGameButton.addEventListener('click', () => {
            this.startNewGame();
            this.hideMainMenu();
            this.setupGameUI();
        });
        buttonContainer.appendChild(newGameButton);

        // Led button
        const quitGameButton = document.createElement('div');
        quitGameButton.classList.add('main-menu-button');
        quitGameButton.innerHTML = `<span class="btn-content">Quit</span><div class="btn-particles"></div>`;
        quitGameButton.addEventListener('click', () => this.quitGame());
        buttonContainer.appendChild(quitGameButton);


        // Add all necessary styles
        const style = document.createElement('style');
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Almendra+Display&family=Cinzel:wght@700&display=swap');
    
            #main-menu {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: url('assets/img/background/menu bg.png');
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                background-color: #000;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: white;
                perspective: 1000px;
            }
    
            #main-menu::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 2;
            }
    
            #main-menu h1, #main-menu .main-menu-button {
                position: relative;
                z-index: 2;
            }
    
            .logo-container {
                position: relative;
                margin-bottom: 40px;
            }
    
            #game-title {
                font-family: 'Almendra Display', cursive;
                font-size: 4.5em;
                text-align: center;
                color: #e0e0e0;
                text-shadow: 
                    0 0 10px rgba(0, 255, 255, 0.7),
                    0 0 20px rgba(0, 255, 255, 0.5),
                    0 0 30px rgba(0, 255, 255, 0.3);
                animation: textGlow 4s ease-in-out infinite alternate, floatText 6s ease-in-out infinite;
                letter-spacing: 4px;
            }
    
            #game-title::before {
                content: attr(data-text);
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(45deg, transparent 45%, rgba(0, 255, 255, 0.1) 50%, transparent 55%);
                background-size: 200% 200%;
                animation: shine 4s infinite;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
    
            .spectral, .remnants {
                position: relative;
                display: inline-block;
                transition: transform 0.3s ease;
            }
    
            .spectral {
                font-size: 1.2em;
                letter-spacing: 5px;
            }
    
            .remnants {
                font-size: 0.8em;
                letter-spacing: 10px;
                opacity: 0.7;
            }
    
            .skull {
                position: absolute;
                width: 100px;
                height: 100px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                opacity: 0.2;
                z-index: -1;
                animation: pulseSkull 4s ease-in-out infinite;
            }
    
            .skull::before, .skull::after {
                content: '';
                position: absolute;
                background: rgba(0, 255, 255, 0.1);
                border-radius: 50%;
            }
    
            .skull::before {
                width: 40px;
                height: 40px;
                top: 20px;
                left: 15px;
                box-shadow: 45px 0 0 rgba(0, 255, 255, 0.1);
            }
    
            .skull::after {
                width: 60px;
                height: 30px;
                bottom: 15px;
                left: 20px;
                border-bottom-left-radius: 30px;
                border-bottom-right-radius: 30px;
            }
    
            @keyframes textGlow {
                0%, 100% { text-shadow: 0 0 10px rgba(0, 255, 255, 0.7), 0 0 20px rgba(0, 255, 255, 0.5), 0 0 30px rgba(0, 255, 255, 0.3); }
                50% { text-shadow: 0 0 20px rgba(0, 255, 255, 0.9), 0 0 30px rgba(0, 255, 255, 0.7), 0 0 40px rgba(0, 255, 255, 0.5); }
            }
    
            @keyframes shine {
                0% { background-position: 200% 50%; }
                100% { background-position: -200% 50%; }
            }
    
            @keyframes floatText {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
    
            @keyframes pulseSkull {
                0%, 100% { opacity: 0.2; }
                50% { opacity: 0.4; }
            }
    
            .main-menu-button-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                z-index: 2;
            }
    
            .main-menu-button {
                font-family: 'Cinzel', serif;
                font-size: 1.5em;
                margin: 15px;
                padding: 20px 40px;
                background-color: rgba(0, 255, 255, 0.1);
                color: #e0e0e0;
                border: 2px solid rgba(0, 255, 255, 0.3);
                cursor: pointer;
                transition: all 0.3s ease;
                border-radius: 5px;
                text-transform: uppercase;
                letter-spacing: 2px;
                position: relative;
                overflow: hidden;
                box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
                animation: pulsate 3s infinite;
            }
    
            .main-menu-button::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 200%;
                height: 100%;
                background: linear-gradient(120deg, transparent, rgba(0, 255, 255, 0.4), transparent);
                transition: all 0.5s;
            }
    
            .main-menu-button:hover::before {
                left: 100%;
            }
    
            .main-menu-button:hover {
                background-color: rgba(0, 255, 255, 0.2);
                color: white;
                text-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
                transform: scale(1.05);
                box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
            }
    
            .btn-content {
                position: relative;
                z-index: 1;
            }
    
            .btn-particles {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
    
            .btn-particle {
                position: absolute;
                background-color: rgba(0, 255, 255, 0.5);
                width: 2px;
                height: 2px;
                border-radius: 50%;
                opacity: 0;
                animation: particleAnimation 2s ease-in-out infinite;
            }
    
            @keyframes particleAnimation {
                0% {
                    transform: translateY(0) scale(0);
                    opacity: 0;
                }
                50% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-20px) scale(1);
                    opacity: 0;
                }
            }
    
            @keyframes pulsate {
                0% { box-shadow: 0 0 15px rgba(0, 255, 255, 0.3); }
                50% { box-shadow: 0 0 25px rgba(0, 255, 255, 0.7); }
                100% { box-shadow: 0 0 15px rgba(0, 255, 255, 0.3); }
            }
    
            .main-menu-button:active {
                transform: scale(0.95);
            }
    
            #particles {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
            }
    
            .particle {
                position: absolute;
                width: 5px;
                height: 5px;
                background-color: rgba(0, 255, 255, 0.5);
                border-radius: 50%;
                animation: float 3s infinite ease-in-out;
                box-shadow: var(--light-position-x) var(--light-position-y) 10px rgba(0, 255, 255, 0.5);
            }
    
            @keyframes float {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(180deg); }
            }
        `;
        document.head.appendChild(style);

        // Parallax Effect
        let spectralElement = document.querySelector('.spectral');
        let remnantsElement = document.querySelector('.remnants');
        let spectralExists = !!spectralElement;
        let remnantsExists = !!remnantsElement;

        document.addEventListener('mousemove', (e) => {
            if (spectralExists) {
                const depth = 5;
                const moveX = (e.clientX - window.innerWidth / 2) / depth;
                const moveY = (e.clientY - window.innerHeight / 2) / depth;

                if (spectralElement) {
                    spectralElement.style.transform = `translateX(${moveX}px) translateY(${moveY}px)`;
                } else {
                    spectralExists = false;
                }
            }

            if (remnantsExists) {
                const depth = 5;
                const moveX = (e.clientX - window.innerWidth / 2) / depth;
                const moveY = (e.clientY - window.innerHeight / 2) / depth;

                if (remnantsElement) {
                    remnantsElement.style.transform = `translateX(${-moveX}px) translateY(${-moveY}px)`;
                } else {
                    remnantsExists = false;
                }
            }
        });


        // Dynamic Lighting Effect for the Title
        const title = document.getElementById('game-title');
        title.addEventListener('mousemove', (e) => {
            const bounds = title.getBoundingClientRect();
            const mouseX = e.clientX - bounds.left;
            const mouseY = e.clientY - bounds.top;
            title.style.setProperty('--light-position-x', `${mouseX}px`);
            title.style.setProperty('--light-position-y', `${mouseY}px`);
        });

        // Dynamic Lighting Effect for Particles
        const particlesContainer = document.getElementById('particles');
        particlesContainer.addEventListener('mousemove', (e) => {
            const bounds = particlesContainer.getBoundingClientRect();
            const mouseX = e.clientX - bounds.left;
            const mouseY = e.clientY - bounds.top;
            particlesContainer.style.setProperty('--light-position-x', `${mouseX}px`);
            particlesContainer.style.setProperty('--light-position-y', `${mouseY}px`);
            const particles = particlesContainer.querySelectorAll('.particle');
            particles.forEach(particle => {
                particle.style.setProperty('--light-position-x', `${mouseX}px`);
                particle.style.setProperty('--light-position-y', `${mouseY}px`);
            });
        });

        // Animation party
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
                particle.style.animationDelay = `${Math.random() * 2}s`;
                particlesContainer.appendChild(particle);
            }
        }
        createParticles();
    }



    init() {
        this.generateNewDungeon();
        // Music Will Start After the First User Interaction
    }


    generateNewDungeon() {
        this.dungeon.generate(this.hero.level);
        this.dungeon.placeEnemies(this.hero.level);
        this.renderer.renderDungeon(this.dungeon);
        this.renderer.renderEnemies(this.dungeon.enemies);

        const startPos = this.dungeon.startPosition;
        this.hero.setStartPosition(startPos);
        this.showMessage(`Reach the next chamber!`);
        this.updateStatsDisplay();
    }


    hideMainMenu() {
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) {
            mainMenu.remove();  // Remove the Main Menu from the DOM
        }
        document.getElementById('game-container').style.display = 'block';  // Display The Game
    }

    setupGameUI() {
        // Create the container for the game ui buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'game-ui-buttons';
        buttonContainer.classList.add('in-game-ui');  // Class to style the game ui
        buttonContainer.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            display: flex;
            gap: 10px;
        `;

        // Create The Inventory Button
        const inventoryButton = this.createButton('Inventory', () => this.showInventory());

        // Create the equipment button
        const equipmentButton = this.createButton('Equipment', () => this.showEquipment());

        // Add the buttons to the container
        buttonContainer.appendChild(inventoryButton);
        buttonContainer.appendChild(equipmentButton);

        // Add the container to the document of the document
        document.body.appendChild(buttonContainer);

        // Create the Mute/Unmute button in the form of an icon and position it at the bottom left
        const muteButton = this.createIconButton('🔊', () => this.toggleSound(muteButton), 'mute-button');
        muteButton.style.position = 'fixed';
        muteButton.style.bottom = '10px';
        muteButton.style.left = '10px';
        muteButton.style.zIndex = '101';
        document.body.appendChild(muteButton);

        // Create the display of statistics
        this.statsDisplay = document.createElement('div');
        this.statsDisplay.id = 'stats-display';
        document.body.appendChild(this.statsDisplay);
        this.updateStatsDisplay();

        // Create the equipment window
        const equipmentWindow = document.createElement('div');
        equipmentWindow.id = 'equipment';
        equipmentWindow.style.display = 'none';
        equipmentWindow.innerHTML = `
            <h2>Equipment </h2>
            <div id="equipment-list"></div>
            <button onclick="document.getElementById('equipment').style.display='none'">Close</button>
        `;
        document.body.appendChild(equipmentWindow);
    }

    createButton(text, onClick, id) {
        const button = document.createElement('button');
        button.textContent = text;
        button.id = id;
        button.addEventListener('click', onClick);
        button.style.cssText = `
            padding: 10px 20px;
            background: linear-gradient(135deg, #4a3f2f, #2a2520);
            color: #d4af37;
            border: 1px solid #5a4f3f;
            border-radius: 5px;
            font-family: 'Trajan Pro', 'Cinzel', serif;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        `;

        button.addEventListener('mouseover', () => {
            button.style.background = 'linear-gradient(135deg, #5a4f3f, #3a3530)';
            button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        });

        button.addEventListener('mouseout', () => {
            button.style.background = 'linear-gradient(135deg, #4a3f2f, #2a2520)';
            button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        });

        return button;
    }

    // Create a button with an icon
    createIconButton(icon, onClick, id) {
        const button = document.createElement('button');
        button.id = id;
        button.innerHTML = icon;  // Use an icon for the button
        button.addEventListener('click', onClick);
        button.style.cssText = `
            padding: 8px;
            background: transparent;
            color: #d4af37;
            border: none;
            font-size: 24px; /* Taille de l'icône */
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        button.addEventListener('mouseover', () => {
            button.style.color = '#ffffff';  // Changes the color in the overflight
        });

        button.addEventListener('mouseout', () => {
            button.style.color = '#d4af37';  // Icon color
        });

        return button;
    }

    // Function to mutate/DEMUTE THE SOUND
    // Function to mute/unmute all sounds
    toggleSound(button) {
        this.globalMute = !this.globalMute; // Toggle the global mute state

        // Mute or unmute the main theme
        if (this.mainThemeAudio) {
            this.mainThemeAudio.muted = this.globalMute;
        }

        // Mute or unmute all other audio elements (sound effects)
        document.querySelectorAll('audio').forEach(audio => {
            audio.muted = this.globalMute;
        });

        // Update the button icon based on the mute state
        button.innerHTML = this.globalMute ? '🔇' : '🔊';  // Toggle loudspeaker icon
    }



    showEquipment() {
        const equipmentList = document.getElementById('equipment-list');
        equipmentList.innerHTML = '';

        // Close the inventory if it is open
        const inventoryWindow = document.getElementById('inventory');
        if (inventoryWindow.style.display === 'block') {
            inventoryWindow.style.display = 'none';
        }

        const weapon = this.hero.currentWeapon ? ITEMS[this.hero.currentWeapon] : null;
        const armor = this.hero.currentArmor ? ITEMS[this.hero.currentArmor] : null;
        const artifacts = this.hero.currentArtifacts.map(slot => slot ? ITEMS[slot] : null);


        if (!weapon && !armor && artifacts.every(a => !a)) {
            equipmentList.innerHTML = '<div class="equipment-empty">No equipment currently equipped.</div>';
        } else {
            if (weapon) {
                equipmentList.innerHTML += `
                    <div class="equipment-item">
                        <div class="equipment-details">
                            <h3 class="equipment-name">${weapon.name} <span>(Arme)</span></h3>
                            <p class="equipment-stats">ATK +${weapon.attackBoost}, CRIT +${weapon.critChanceBoost || 0}%, DEF +${weapon.defenseBoost || 0}</p>
                        </div>
                        <button class="unequip-button" onclick="game.unequipWeapon()">Unequip</button>
                    </div>`;
            } else {
                equipmentList.innerHTML += '<div class="equipment-empty">Weapon : None</div>';
            }

            if (armor) {
                equipmentList.innerHTML += `
                    <div class="equipment-item">
                        <div class="equipment-details">
                            <h3 class="equipment-name">${armor.name} <span>(Armor)</span></h3>
                            <p class="equipment-stats">DEF +${armor.defenseBoost}, HP +${armor.hpBoost || 0}, CRIT RES +${armor.critResistanceBoost || 0}%</p>
                        </div>
                        <button class="unequip-button" onclick="game.unequipArmor()">Unequip</button>
                    </div>`;
            } else {
                equipmentList.innerHTML += '<div class="equipment-empty">Armor : None</div>';
            }

            // Show equipped artefacts
            artifacts.forEach((artifact, index) => {
                if (artifact) {
                    equipmentList.innerHTML += `
                    <div class="equipment-item">
                        <div class="equipment-details">
                            <h3 class="equipment-name">${artifact.name} <span>(Artefact Slot ${index + 1})</span></h3>
                            <p class="equipment-stats">Effet : ${artifact.effectDescription || 'Unknow'}</p>
                        </div>
                        <button class="unequip-button" onclick="game.unequipArtifact(${index})">Unequip</button>
                    </div>`;
                } else {
                    equipmentList.innerHTML += `<div class="equipment-empty">Artefact Slot ${index + 1} : No effect</div>`;
                }
            });
        }

        // Afficher la fenêtre d'équipement sur le jeu, comme pour l'inventaire
        const equipmentWindow = document.getElementById('equipment');
        equipmentWindow.style.display = 'block';
        equipmentWindow.style.position = 'fixed';
        equipmentWindow.style.top = '50px';
        equipmentWindow.style.left = '50%';
        equipmentWindow.style.transform = 'translateX(-50%)';
        equipmentWindow.style.backgroundColor = '#333';
        equipmentWindow.style.padding = '20px';
        equipmentWindow.style.border = '1px solid #444';
        equipmentWindow.style.borderRadius = '10px';
        equipmentWindow.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
        equipmentWindow.style.zIndex = '1000';
    }



    unequipWeapon() {
        if (this.hero.currentWeapon) {
            const oldWeapon = this.hero.currentWeapon;
            this.hero.equipWeapon(null);  // Desk the weapon

            // Return the weapon to the inventory
            if (this.hero.inventory[oldWeapon]) {
                this.hero.inventory[oldWeapon].quantity++;
            } else {
                this.hero.inventory[oldWeapon] = { quantity: 1 };
            }

            this.updateStatsDisplay(); // Updates the display of statistics
            this.showEquipment();      // Update the equipment window

        }
    }


    unequipArmor() {
        if (this.hero.currentArmor) {
            const oldArmor = this.hero.currentArmor;
            this.hero.equipArmor(null);  // Desk the armor

            // Return the armor in the inventory
            if (this.hero.inventory[oldArmor]) {
                this.hero.inventory[oldArmor].quantity++;
            } else {
                this.hero.inventory[oldArmor] = { quantity: 1 };
            }

            this.updateStatsDisplay(); // Updates the display of statistics
            this.showEquipment();      // Update the equipment window
            // L'inventaire est mis à jour en arrière-plan, sans être réaffiché
        }
    }

    unequipArtifact(slot, showEquipment = true) {
        if (this.hero.currentArtifacts[slot]) {
            const oldArtifact = this.hero.currentArtifacts[slot];
            const oldArtifactData = ITEMS[oldArtifact];

            // Remove the effects of the old artefact
            this.hero.removeArtifactEffects(oldArtifactData);

            // Desk the artifact of the specified slot
            this.hero.currentArtifacts[slot] = null;

            // Returns the artifact in the inventory
            if (this.hero.inventory[oldArtifact]) {
                this.hero.inventory[oldArtifact].quantity++;
            } else {
                this.hero.inventory[oldArtifact] = { quantity: 1 };
            }

            this.updateStatsDisplay(); // Updates the display of statistics
            if (showEquipment) {
                this.showEquipment(); // Update the equipment window
            }
            this.showInventory(false); // Update the inventory without opening/closing
        }
    }


    updateInventoryDisplay() {
        // Make sure this.inventory exists and contains the necessary data
        if (this.inventory && Array.isArray(this.inventory)) {
            // Creates a container to limit the height and allow scrolling
            this.inventoryDisplay.innerHTML = `
            <h3>Inventory</h3>
            <div class="inventory-content">
                <ul>
                    ${this.inventory.map(item => `<li>${item.name} - Quantity: ${item.quantity}</li>`).join('')}
                </ul>
            </div>
        `;
        } else {
            this.inventoryDisplay.innerHTML = '<p>The inventory is empty.</p>';
        }
    }



    updateStatsDisplay() {
        requestAnimationFrame(() => {
            const stats = this.hero.getStats();
            const xpPercentage = (stats.xp / stats.xpToNextLevel) * 100;
            const hpPercentage = (stats.hp / stats.maxHp) * 100;
            const manaPercentage = (stats.mana / stats.maxMana) * 100;

            this.statsDisplay.innerHTML = `
            <div class="stats-container">
                <h3 class="stats-title">HERO</h3>
                <div class="stat-row">
                    <span class="stat-label">LEVEL</span>
                    <span class="stat-value">${stats.level}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">XP</span>
                    <div class="progress-bar">
                        <div class="progress-fill xp-fill" style="width: ${xpPercentage}%"></div>
                    </div>
                    <span class="stat-value">${stats.xp}/${stats.xpToNextLevel}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">LIFE</span>
                    <div class="progress-bar">
                        <div class="progress-fill hp-fill" style="width: ${hpPercentage}%"></div>
                    </div>
                    <span class="stat-value">${stats.hp}/${stats.maxHp}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">MANA</span>
                    <div class="progress-bar">
                        <div class="progress-fill mana-fill" style="width: ${manaPercentage}%"></div>
                    </div>
                    <span class="stat-value">${stats.mana}/${stats.maxMana}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">GOLD</span>
                    <span class="stat-value">${stats.gold}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">ATTACK</span>
                    <span class="stat-value">${stats.attack}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">DEFENSE</span>
                    <span class="stat-value">${stats.defense}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">CRIT CHANCE</span>
                    <span class="stat-value">${stats.critChance}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">CRIT DAMAGE</span>
                    <span class="stat-value">+${stats.critDamage}</span>
                </div>
            </div>
        `;
        });
    }



    setupCombatUI() {
        this.combatUI = document.createElement('div');
        this.combatUI.id = 'combat-ui';
        this.combatUI.style.display = 'none';
        document.body.appendChild(this.combatUI);
    }

    showInventory(open = true) {
        let inventoryGrid = document.getElementById('inventory-grid');
        if (!inventoryGrid) {
            inventoryGrid = document.createElement('div');
            inventoryGrid.id = 'inventory-grid';
            inventoryGrid.className = 'inventory-grid';
            document.getElementById('inventory').appendChild(inventoryGrid);
        } else {
            inventoryGrid.innerHTML = ''; // Empty the existing grid if it already exists
        }

        // Create the container for the basket and the Close button
        let controlsContainer = document.getElementById('inventory-controls');
        if (!controlsContainer) {
            controlsContainer = document.createElement('div');
            controlsContainer.id = 'inventory-controls';
            controlsContainer.className = 'inventory-controls';
            document.getElementById('inventory').appendChild(controlsContainer);
        }

        // Create the basket
        let trashBin = document.getElementById('trash-bin');
        if (!trashBin) {
            trashBin = document.createElement('div');
            trashBin.id = 'trash-bin';
            trashBin.className = 'trash-bin';
            trashBin.textContent = "Trash";
            controlsContainer.appendChild(trashBin);

            trashBin.addEventListener('dragover', (event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'move'; // Provides a correct travel icon
            });

            trashBin.addEventListener('dragenter', (event) => {
                event.preventDefault();
                trashBin.classList.add('over');
            });

            trashBin.addEventListener('dragleave', () => {
                trashBin.classList.remove('over');
            });

            trashBin.addEventListener('drop', (event) => {
                event.preventDefault();
                const itemKey = event.dataTransfer.getData('text');
                this.dropItem(itemKey);
                trashBin.classList.remove('over');
            });
        }

        // Create the Close button
        let closeButton = document.getElementById('close-inventory');
        if (!closeButton) {
            closeButton = document.createElement('button');
            closeButton.id = 'close-inventory';
            closeButton.className = 'close-inventory';
            closeButton.textContent = "Close";
            controlsContainer.appendChild(closeButton);

            closeButton.addEventListener('click', () => {
                this.closeInventory();
            });
        }

        const inventoryEntries = Object.entries(this.hero.inventory);
        const totalSlots = 20; // Total number of inventory slots
        let currentSlot = 0; // Counter for filled slots

        inventoryEntries.forEach(([itemKey, itemEntry]) => {
            const item = ITEMS[itemKey];

            for (let j = 0; j < itemEntry.quantity; j++) {
                if (currentSlot >= totalSlots) break; // Stop if the slots are filled

                const slotDiv = document.createElement('div');
                slotDiv.className = 'inventory-slot';
                slotDiv.draggable = true; // Slips this element
                slotDiv.setAttribute('data-item-key', itemKey); // Stores the item identifier in the element

                const img = document.createElement('img');
                img.src = item.imageUrl;
                img.alt = item.name;
                slotDiv.appendChild(img);

                slotDiv.addEventListener('dragstart', (event) => {
                    event.dataTransfer.setData('text', itemKey);
                    slotDiv.classList.add('dragging');
                });

                slotDiv.addEventListener('dragend', () => {
                    slotDiv.classList.remove('dragging');
                });

                slotDiv.addEventListener('mouseover', (e) => {
                    const rect = slotDiv.getBoundingClientRect();
                    const tooltipText = `<strong>${item.name}</strong><br>Effet : ${item.effectDescription || 'Inconnu'}`;
                    const tooltipX = rect.left + rect.width / 2;
                    const tooltipY = rect.top - 10;
                    this.showTooltip(tooltipText, tooltipX, tooltipY);
                });

                slotDiv.addEventListener('mouseout', () => {
                    this.hideTooltip();
                });

                let buttonHTML = '';

                if (this.inCombat) {
                    if (item.type === 'consumable') {
                        // Assures that the button calls `usemandcloseinventory '
                        buttonHTML = `<button class="inventory-button" onclick="game.useItemAndCloseInventory('${itemKey}')">Use</button>`;
                    }
                } else {
                    if (item.type === 'consumable') {
                        buttonHTML = `<button class="inventory-button" onclick="game.useItem('${itemKey}')">Use</button>`;
                    } else if (item.type === 'spell') {
                        buttonHTML = `<button class="inventory-button" onclick="game.useItem('${itemKey}')">Learn</button>`;
                    } else if (item.type === 'weapon' && this.hero.currentWeapon !== itemKey) {
                        buttonHTML = `<button class="inventory-button" onclick="game.equipWeapon('${itemKey}')">Equip</button>`;
                    } else if (item.type === 'armor' && this.hero.currentArmor !== itemKey) {
                        buttonHTML = `<button class="inventory-button" onclick="game.equipArmor('${itemKey}')">Wear</button>`;
                    } else if (item.type === 'artifact') {
                        for (let k = 0; k < this.hero.currentArtifacts.length; k++) {
                            if (this.hero.currentArtifacts[k] === null) {
                                buttonHTML += `<button class="inventory-button" onclick="game.equipArtifact('${itemKey}', false)">Equip Slot ${k + 1}</button>`;
                                break;
                            }
                        }
                        if (buttonHTML === '') {
                            buttonHTML = `<button class="inventory-button" disabled>Slots pleins</button>`;
                        }
                    }
                }

                slotDiv.innerHTML += buttonHTML;
                inventoryGrid.appendChild(slotDiv);
                currentSlot++;
            }
        });

        // Add empty slots if necessary
        for (let i = currentSlot; i < totalSlots; i++) {
            const slotDiv = document.createElement('div');
            slotDiv.className = 'inventory-slot';
            slotDiv.innerHTML = `<div class="empty-slot">Empty</div>`;
            inventoryGrid.appendChild(slotDiv);
        }

        if (open) {
            document.getElementById('equipment').style.display = 'none';
            document.getElementById('inventory').style.display = 'block';
        }
    }



    dropItem(itemKey) {
        this.hero.removeItemFromInventory(itemKey);
        this.showInventory(); // Refresh the display of the inventory after throwing the object
    }

    createTooltipElement() {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.style.cssText = `
            position: fixed;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px;
            border-radius: 4px;
            white-space: nowrap;
            z-index: 999999999999;
            opacity: 0;
            transition: opacity 0.2s ease, transform 0.2s ease;
            pointer-events: none;
            font-size: 18px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            transform: translate(-50%, -40%);
            margin-top: 5px;
        `;
        return tooltip;
    }


    showTooltip(text, x, y) {
        clearTimeout(this.hideTimeout);
        this.tooltipElement.innerHTML = text;
        this.tooltipElement.style.top = `${y}px`;
        this.tooltipElement.style.left = `${x}px`;
        this.tooltipElement.style.opacity = '1';

        this.tooltipElement.addEventListener('mouseover', this.resetHideTimeout.bind(this));
        this.tooltipElement.addEventListener('mouseout', this.startHideTimeout.bind(this));

        this.startHideTimeout();
    }

    resetHideTimeout() {
        clearTimeout(this.hideTimeout);
    }

    startHideTimeout() {
        this.hideTimeout = setTimeout(() => {
            this.hideTooltip();
        }, 2000);
    }

    hideTooltip() {
        this.tooltipElement.style.opacity = '0';
        this.tooltipElement.removeEventListener('mouseover', this.resetHideTimeout);
        this.tooltipElement.removeEventListener('mouseout', this.startHideTimeout);
    }

    useItem(itemKey) {
        const itemEntry = this.hero.inventory[itemKey];
        if (!itemEntry) {
            console.error(`Item ${itemKey} not found in inventory`);
            return;
        }

        const item = ITEMS[itemKey];
        if (!item) {
            console.error(`Item ${itemKey} not found in ITEMS`);
            return;
        }

        let message = '';

        // Logic for consumable objects
        if (item.type === 'consumable') {
            if (item.effect === 'heal') {
                const healAmount = Math.min(item.value, this.hero.stats.maxHp - this.hero.stats.hp);
                this.hero.stats.hp += healAmount;
                message = `You used ${item.name}. HP restored by ${healAmount}.`;
            } else if (item.effect === 'restoreMana') {
                const manaAmount = Math.min(item.value, this.hero.stats.maxMana - this.hero.stats.mana);
                this.hero.stats.mana += manaAmount;
                message = `You used ${item.name}. Mana restored by ${manaAmount}.`;
            } else {
                message = `You used ${item.name}, but nothing happened.`;
            }

            // Reduce the quantity of the object used
            itemEntry.quantity--;
            if (itemEntry.quantity <= 0) {
                delete this.hero.inventory[itemKey];
            }
        } else if (item.type === 'spell') {  // Logic for Objects of the Type Sort
            if (!this.hero.spells.includes(item.spell)) {
                this.hero.spells.push(item.spell);
                message = `You have learned a new spell: ${SPELLS[item.spell].name}!`;
                delete this.hero.inventory[itemKey];
            } else {
                message = `You already know the spell: ${SPELLS[item.spell].name}.`;
            }
        } else {
            message = `Cannot use ${item.name}. It's not a consumable or a spell.`;
        }

        this.showMessage(message);

        // Interface update after using the object
        this.updateStatsDisplay();

        // Close the inventory according to the state of the fight
        if (this.inCombat) {
            this.closeInventory();
            this.updateCombatUI();
            // Immediately trigger the enemy's attack after using the object
            if (typeof this.enemyAttack === 'function') {
                this.enemyAttack();
            }
        } else {
            this.closeInventory();  // Closing out inventory out of combat
            this.renderer.renderDungeon(this.dungeon);  // Update the dungeon
            this.renderer.renderEnemies(this.dungeon.enemies);  // Update enemies
            this.showInventory();  // Refresh the display of the out of combat inventory
        }
    }



    interactWithMerchant(merchant) {
        this.currentEnemy = merchant;
        const inventory = merchant.stats.inventory;

        if (!inventory || inventory.length === 0) {
            this.showMessage("The merchant has nothing for sale.");
            return;
        }

        const updateMerchantUI = () => {
            let merchantUI = `
                <div class="merchant-container">
                    <h3 class="merchant-title">Marchand</h3>
                    <div class="merchant-content">
                        <div class="merchant-section">
                            <h4 class="section-title">Acheter</h4>
                            <div class="scrollable-content">
                                ${inventory.map(item => {
                const itemDetails = ITEMS[item.item];
                if (!itemDetails) {
                    console.error(`Item avec la clé ${item.item} introuvable dans ITEMS.`);
                    return '';
                }
                return `
                                        <div class="merchant-item">
                                            <div class="item-info">
                                                <span class="item-name">${itemDetails.name}</span>
                                                <span class="item-price">${item.price} gold</span>
                                            </div>
                                            <button class="buy-button" onclick="game.buyItem('${item.item}', ${item.price})">Buy</button>
                                        </div>
                                    `;
            }).join('')}
                            </div>
                        </div>
                        <div class="merchant-section">
                            <h4 class="section-title">Sell</h4>
                            <div class="scrollable-content">
                                ${Object.entries(this.hero.inventory).map(([itemKey, itemEntry]) => {
                const item = ITEMS[itemKey];
                if (!item) {
                    console.error(`Item avec la clé ${itemKey} introuvable dans ITEMS.`);
                    return '';
                }
                const sellPrice = Math.floor(item.goldValue * 0.3);
                return `
                                        <div class="merchant-item">
                                            <div class="item-info">
                                                <span class="item-name">${item.name} (x${itemEntry.quantity})</span>
                                                <span class="item-price">${sellPrice} gold</span>
                                            </div>
                                            <button class="sell-button" onclick="game.sellItem('${itemKey}')">Sell</button>
                                        </div>
                                    `;
            }).join('')}
                            </div>
                        </div>
                    </div>
                    <button class="close-button" onclick="game.closeMerchant()">Close</button>
                </div>
            `;

            const merchantContainer = document.getElementById('merchant-container');
            merchantContainer.innerHTML = merchantUI;
            merchantContainer.style.display = 'block';
        };

        this.buyItem = (itemKey, price) => {
            if (this.hero.stats.gold >= price) {
                this.hero.stats.gold -= price;
                this.hero.addItemToInventory(itemKey);
                this.showMessage(`You purchased ${ITEMS[itemKey].name} for ${price} gold.`);
                this.updateStatsDisplay();
                updateMerchantUI();
            } else {
                this.showMessage("You do not have enough gold.");
            }
        };

        this.sellItem = (itemKey) => {
            const item = ITEMS[itemKey];
            const sellPrice = Math.floor(item.goldValue * 0.3);

            if (this.hero.inventory[itemKey] && this.hero.inventory[itemKey].quantity > 0) {
                this.hero.stats.gold += sellPrice;
                this.hero.inventory[itemKey].quantity--;

                if (this.hero.inventory[itemKey].quantity <= 0) {
                    delete this.hero.inventory[itemKey];
                }

                this.showMessage(`You sold ${item.name} for ${sellPrice} gold.`);
                this.updateStatsDisplay();
                updateMerchantUI();
            } else {
                this.showMessage("You do not have this item to sell.");
            }
        };

        updateMerchantUI();
    }

    closeMerchant() {
        document.getElementById('merchant-container').style.display = 'none';
    }

    generateMerchantInventory() {
        const inventory = [];
        const items = Object.values(ITEMS);

        items.forEach(item => {
            const rarityMultiplier = this.getRarityMultiplier(item.rarity);
            if (Math.random() < rarityMultiplier) {
                // Find the key corresponding to this item
                const itemKey = Object.keys(ITEMS).find(key => ITEMS[key] === item);
                if (itemKey) {
                    inventory.push({ item: itemKey, price: item.goldValue });
                }
            }
        });

        if (inventory.length === 0) {
            const defaultItemKey = Object.keys(ITEMS).find(key => ITEMS[key].rarity === 'common');
            if (defaultItemKey) {
                inventory.push({ item: defaultItemKey, price: ITEMS[defaultItemKey].goldValue });
            }
        }

        // Limit the number of items for sale to avoid a too large inventory
        return inventory.slice(0, Math.floor(Math.random() * 4) + 2); // Par exemple, 2 à 5 items aléatoires
    }



    getRarityMultiplier(rarity) {
        switch (rarity) {
            case 'common':
                return 0.5; // 50% chance to appear
            case 'uncommon':
                return 0.3; // 30% chance to appear
            case 'rare':
                return 0.1; // 10% chance to appear
            case 'legendary':
                return 0; // Legendary items are not sold by the mercant
            default:
                return 0.5; // Default to Common Rarity
        }
    }



    promptItemReplacement(newItemKey) {
        // Open the inventory and allow the player to select an object to replace
        this.showInventory(false);

        const inventoryGrid = document.getElementById('inventory-grid');

        const replaceMessage = document.createElement('p');
        replaceMessage.textContent = `Select an item to replace with ${ITEMS[newItemKey].name}:`;
        inventoryGrid.prepend(replaceMessage);

        const inventoryEntries = Object.entries(this.hero.inventory);

        inventoryEntries.forEach(([itemKey, itemEntry]) => {
            const itemSlot = inventoryGrid.querySelector(`[data-item-key="${itemKey}"]`);

            if (itemSlot) {
                const replaceButton = document.createElement('button');
                replaceButton.textContent = 'Change';
                replaceButton.onclick = () => {
                    this.replaceItemInInventory(itemKey, newItemKey);
                };
                itemSlot.appendChild(replaceButton);
            }
        });

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.onclick = () => {
            document.getElementById('inventory').style.display = 'none';
            console.log(`L'objet ${ITEMS[newItemKey].name} a été rejeté.`);
        };
        inventoryGrid.appendChild(cancelButton);
    }


    replaceItemInInventory(oldItemKey, newItemKey) {
        // Delete the old object of the inventory
        delete this.hero.inventory[oldItemKey];

        // Add the new object to the inventory
        this.hero.inventory[newItemKey] = { key: newItemKey, quantity: 1 };

        console.log(`You have replaced ${ITEMS[oldItemKey].name} with ${ITEMS[newItemKey].name}.`);

        // Update the inventory display
        this.showInventory();
    }


    buyItem(itemKey, price) {
        if (this.hero.stats.gold >= price) {
            this.hero.stats.gold -= price;
            this.hero.addItemToInventory(itemKey);
            this.showMessage(`You bought a ${ITEMS[itemKey].name} for ${price} gold.`);
            this.updateStatsDisplay();  // To refresh the display of gold
        } else {
            this.showMessage("You don't have enough gold.");
        }
    }

    sellItem(itemKey) {
        const item = ITEMS[itemKey];
        const sellPrice = Math.floor(item.goldValue * 0.3); // 70% cheaper

        if (this.hero.inventory[itemKey] && this.hero.inventory[itemKey].quantity > 0) {
            this.hero.stats.gold += sellPrice;
            this.hero.inventory[itemKey].quantity--;

            if (this.hero.inventory[itemKey].quantity <= 0) {
                delete this.hero.inventory[itemKey]; // Deletes the object if the quantity falls to 0
            }

            this.showMessage(`You sold ${item.name} for ${sellPrice} gold.`);
            this.updateStatsDisplay(); // Updates the stats after the sale
            this.updateMerchantUI(); // Updates the merchant interface
        } else {
            this.showMessage("ou do not have this item for sale.");
        }
    }




    equipWeapon(itemKey) {
        const message = this.hero.equipWeapon(itemKey);
        this.showMessage(message);
        this.showInventory();
        this.updateStatsDisplay();
    }

    equipArmor(itemKey) {
        const message = this.hero.equipArmor(itemKey);
        this.showMessage(message);
        this.showInventory();
        this.updateStatsDisplay();
    }

    // Méthode pour équiper un artefact, s'il y a un slot disponible
    equipArtifact(itemKey, showEquipment = true) {
        const emptySlot = this.hero.currentArtifacts.findIndex(slot => slot === null);

        if (emptySlot !== -1) { // If there is an empty slot
            this.hero.equipArtifact(itemKey, emptySlot);
            this.updateStatsDisplay();
            if (showEquipment) {
                this.showEquipment(); // Equipment update
            }
            this.showInventory(false); // Update the inventory without opening/closing
        } else {
            console.log('All artifact slots are full');
        }
    }




    closeInventory() {
        const inventoryElement = document.getElementById('inventory'); // Select the inventory container
        if (this.inCombat && inventoryElement) {  // Close only if in combat
            inventoryElement.style.display = 'none';  // Hide the inventory
        }
    }




    setupEventListeners() {
        document.addEventListener('keydown', (event) => {
            console.log(`Key pressed: ${event.key}`);
            if (this.inCombat) {
                this.handleCombatInput(event.key);
            } else {
                this.handleMovement(event.key);
                if (event.key.toLowerCase() === 'i') {  // Open inventory with 'i'
                    this.showInventory();
                }
            }
        });
    }




    handleMovement(key) {
        let dx = 0, dy = 0;
        switch (key) {
            case 'ArrowUp': dy = -1; break;
            case 'ArrowDown': dy = 1; break;
            case 'ArrowLeft': dx = -1; break;
            case 'ArrowRight': dx = 1; break;
        }
        if (dx !== 0 || dy !== 0) {
            this.moveHero(dx, dy);
        }
    }

    moveHero(dx, dy) {
        // PREVENT MOVEMENT IF A MODAL IS ALREADY OPEN
        if (this.isModalOpen) return;

        if (this.exitReached) return;

        const newX = this.hero.x + dx;
        const newY = this.hero.y + dy;
        const enemy = this.dungeon.getEnemyAt(newX, newY);

        console.log(`Hero position: (${this.hero.x}, ${this.hero.y})`);
        console.log(`New position: (${newX}, ${newY})`);
        console.log(`Enemy found: `, enemy);

        this.checkForBreakableWall(newX, newY);

        const tileType = this.dungeon.getTileAt(newX, newY);

        if (tileType === 'breakable-wall' || tileType === 'hidden-breakable-wall') {
            this.handleBreakableWall(newX, newY);
        } else if (tileType === 'warriorStatue' || tileType === 'hidden-warriorStatue') {
            // Call Randomevents Function to Interact with the statue
            RandomEvents.interactWithStatue(this.hero, this.dungeon, this, newX, newY);
        } else if (tileType === 'Azkorth' || tileType === 'hidden-Azkorth') {
            // Interact with Azkorth via Randomevents
            RandomEvents.interactWithAzkorth();  // Make sure the Randomevents Object is accessible
        } else if (enemy) {
            console.log(`Interacting with: ${enemy.type}`);
            switch (enemy.type) {
                case 'chest':
                    this.openChest(enemy);
                    break;
                case 'merchant':
                    this.interactWithMerchant(enemy);
                    break;
                case 'manaFountain':
                    this.useManaFountain(enemy);
                    break;
                case 'lifeFountain':
                    this.useLifeFountain(enemy);
                    break;
                default:
                    this.startCombat(enemy);
            }
        } else if (!tileType.startsWith('hidden-')) {
            const reachedExit = this.hero.move(dx, dy, this.dungeon);
            if (reachedExit) {
                this.exitReached = true;
                this.hero.gainXP(50);
                this.showMessage("You have reached the exit! You now enter the next chamber..");
                this.level++;
                setTimeout(() => {
                    this.exitReached = false;
                    this.generateNewDungeon();
                }, 2000);
            }
        }

        this.updateStatsDisplay();
    }




    handleBreakableWall(x, y) {
        if (this.isModalOpen) {
            return;
        }

        this.isModalOpen = true;

        const modal = document.createElement('div');
        RandomEvents.setupModal(modal, "Breakable Wall");

        modal.innerHTML = `
            <h2>Breakable Wall</h2>
            <p>This wall seems fragile and could be broken to reveal a passage to a special room.</p>
            <p>Ancient techno-mages often hid treasures and dangers behind such walls.</p>
            <button id="breakWall">Break the wall</button>
            <button id="closeModal">Cancel</button>
        `;

        const closeModal = () => {
            document.body.removeChild(modal);
            this.isModalOpen = false;
        };

        modal.querySelector('#breakWall').addEventListener('click', () => {
            // Change the cashable wall to floor
            this.dungeon.map[y][x] = 'floor';

            // Reveal the hidden elements of the room
            this.dungeon.revealHiddenElements(x, y);

            this.showMessage("You broke the wall and discovered a special room!");
            closeModal();

            // Update the rendering of the dungeon and enemies
            this.renderer.renderDungeon(this.dungeon);
            this.renderer.renderEnemies(this.dungeon.enemies);
        });

        modal.querySelector('#closeModal').addEventListener('click', () => {
            closeModal();
            this.showMessage("Action cancelled");
        });

        document.body.appendChild(modal);
    }


    revealHiddenRoom(x, y) {
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (let [dx, dy] of directions) {
            let nx = x + dx;
            let ny = y + dy;
            if (this.dungeon.map[ny] && this.dungeon.map[ny][nx] === 'hidden-special-floor') {
                this.floodFillReveal(nx, ny);
                break;
            }
        }
    }

    floodFillReveal(x, y) {
        if (x < 0 || y < 0 || x >= this.dungeon.map[0].length || y >= this.dungeon.map.length) return;
        if (this.dungeon.map[y][x] !== 'hidden-special-floor') return;

        this.dungeon.map[y][x] = 'special-floor';

        this.floodFillReveal(x - 1, y);
        this.floodFillReveal(x + 1, y);
        this.floodFillReveal(x, y - 1);
        this.floodFillReveal(x, y + 1);
    }

    isBlockingWall(x, y) {
        return this.dungeon.map[y][x] === 'blocking-wall';
    }

    interactWithBlockingWall(x, y) {
        const confirmBreak = confirm("You have found a mysterious wall, Would you like to try to break it?");
        if (confirmBreak) {
            this.breakBlockingWall(x, y);
        }
    }

    breakBlockingWall(x, y) {
        this.dungeon.map[y][x] = 'floor';
        this.showMessage("You broke the wall and revealed a secret passage!");
    }


    getRarityMessage(rarity) {
        switch (rarity) {
            case 'legendary': return 'Legendary!';
            case 'rare': return 'Rare !';
            case 'uncommon': return 'Uncommon !';
            default: return 'Common';
        }
    }

    setupAudioContext() {
        // Add an overall earpiece for the first user interaction
        const startAudio = () => {
            this.playMainTheme(); // Play the main theme
            document.removeEventListener('click', startAudio); // Remove the earphone after the first interaction
            document.removeEventListener('keydown', startAudio); // Remove the earphone after the first interaction
        };

        document.addEventListener('click', startAudio); // Listen to a click
        document.addEventListener('keydown', startAudio); // Listen to a keyboard key
    }


    playSound(soundKey) {
        const audio = new Audio(`./assets/sound/fx/${soundKey}.flac`);
        audio.play();
    }

    playSoundOnce(soundKey) {
        if (!this.playedSounds[soundKey]) {
            this.playSound(soundKey);
            this.playedSounds[soundKey] = true;
        }
    }

    // Method for playing the main theme with volume control
    playMainTheme(volume = 0.1) {
        if (this.mainThemeAudio) {
            this.mainThemeAudio.pause(); // Stop any preceding background music
            this.mainThemeAudio.currentTime = 0; // Reset the track time
        }
        this.mainThemeAudio = new Audio('./assets/sound/music/maintheme.mp3');
        this.mainThemeAudio.loop = true; // Loop
        this.mainThemeAudio.volume = volume; // Set the volume (value between 0 and 1)

        // Mute the audio if global mute is enabled
        this.mainThemeAudio.muted = this.globalMute || false;

        this.mainThemeAudio.play().catch((error) => console.log("Erreur de lecture audio : ", error));
    }


    // Method to adjust the main theme volume
    setMainThemeVolume(volume) {
        if (this.mainThemeAudio) {
            this.mainThemeAudio.volume = volume; // Régler le volume (valeur entre 0 et 1)
        }
    }

    checkForBreakableWall(x, y) {
        // Check the adjacent boxes
        const adjacentTiles = [
            { x: x - 1, y: y },
            { x: x + 1, y: y },
            { x: x, y: y - 1 },
            { x: x, y: y + 1 }
        ];

        for (let tile of adjacentTiles) {
            if (this.dungeon.map[tile.y] && this.dungeon.map[tile.y][tile.x] === 'breakable-wall') {
                this.playSoundOnce('breakable');
                return true;
            }
        }
        return false;
    }


    openChest(chest) {
        if (chest.isOpened) {
            return;
        }

        chest.isOpened = true;
        this.showMessage("You have found a mysterious chest..");

        setTimeout(() => {
            this.renderer.playChestOpeningAnimation(chest.element);
            this.playSoundOnce('chest');

            setTimeout(() => {
                const selectedItemKey = selectRandomItemFromChest();

                if (ITEMS[selectedItemKey]) {
                    this.hero.addItemToInventory(selectedItemKey);
                    const itemRarity = ITEMS[selectedItemKey].rarity;
                    this.renderer.playItemFoundAnimation(selectedItemKey, itemRarity);
                    this.playSoundOnce('item-found');

                    const rarityMessage = this.getRarityMessage(itemRarity);
                    this.showMessage(`Incredible! You found a ${ITEMS[selectedItemKey].name} (${rarityMessage}) !`);

                    if (itemRarity === "common") {
                        consecutiveCommonOpens++;
                    } else {
                        consecutiveCommonOpens = 0;
                    }
                } else {
                    console.error(`Item with key ${selectedItemKey} not found in ITEMS.`);
                }

                this.dungeon.removeEnemy(chest);
                this.renderer.removeEnemyElement(chest.element);
            }, 2000);
        }, 1000);
    }


    useManaFountain(fountain) {
        // Fully restore mana
        this.hero.stats.mana = this.hero.stats.maxMana;

        // Increase the maximum mana of 10 points definitively
        this.hero.stats.maxMana += 10;
        this.hero.stats.mana = this.hero.stats.maxMana;

        this.showMessage("You drank from the Mana Fountain. Your mana has been restored and your max mana increased by 10 points!");

        this.dungeon.removeEnemy(fountain);
        this.renderer.removeEnemyElement(fountain.element);

        this.updateStatsDisplay();
    }

    useLifeFountain(fountain) {
        // Fully restore points of life
        this.hero.stats.hp = this.hero.stats.maxHp;

        // Increase the maximum life points of 10 points definitively
        this.hero.stats.maxHp += 10;
        this.hero.stats.hp = this.hero.stats.maxHp;

        this.showMessage("You drank from the Life Fountain. Your mana has been restored and your life mana increased by 10 points!");

        // Optionnel : supprimer la fontaine après utilisation
        this.dungeon.removeEnemy(fountain);
        this.renderer.removeEnemyElement(fountain.element);

        this.updateStatsDisplay();
    }



    startCombat(enemy) {
        this.inCombat = true;
        this.currentEnemy = enemy;
        this.showMessage(`You engage in combat with ${enemy.type} !`);
        this.showCombatUI();
    }

    showCombatUI() {
        // Resetting the container of the combat IU
        this.combatUI.innerHTML = '';

        // Main container
        const combatContainer = document.createElement('div');
        combatContainer.className = 'combat-container';

        // Combat title
        const combatTitle = document.createElement('h3');
        combatTitle.className = 'combat-title';
        combatTitle.innerHTML = 'Fight vs <span id="enemy-type"></span>';
        combatContainer.appendChild(combatTitle);

        // Combatant statistics container
        const combatantsStats = document.createElement('div');
        combatantsStats.className = 'combatants-stats';

        // Hero section
        const heroStats = document.createElement('div');
        heroStats.className = 'hero-stats';
        heroStats.innerHTML = `
            <h4>Hero</h4>
            <div class="stat-bar hero-hp-bar">
                <div id="hero-hp-fill" class="hp-fill"></div>
                <span id="hero-hp-text" class="hp-text"></span>
            </div>
            <div class="stat-bar hero-mana-bar">
                <div id="hero-mana-fill" class="mana-fill"></div>
                <span id="hero-mana-text" class="mana-text"></span>
            </div>
            <div class="status-effects" id="hero-status-effects">
                <!-- Buffs et debuffs  -->
            </div>
        `;
        combatantsStats.appendChild(heroStats);

        // Enemy section
        const enemyStats = document.createElement('div');
        enemyStats.className = 'enemy-stats';
        enemyStats.innerHTML = `
            <h4>Ennemy</h4>
            <div class="stat-bar enemy-hp-bar">
                <div id="enemy-hp-fill" class="hp-fill"></div>
                <span id="enemy-hp-text" class="hp-text"></span>
            </div>
            <div class="enemy-attributes">
                <span id="enemy-attack" class="attribute"><i class="fas fa-sword"></i> Attack: </span>
                <span id="enemy-defense" class="attribute"><i class="fas fa-shield"></i> Defense: </span>
            </div>
            <div class="status-effects" id="enemy-status-effects">
                <!-- Buffs et debuffs de l'ennemi seront affichés ici -->
            </div>
        `;
        combatantsStats.appendChild(enemyStats);

        combatContainer.appendChild(combatantsStats);

        // Container of combat actions
        const combatActions = document.createElement('div');
        combatActions.id = 'combat-actions';
        combatActions.className = 'combat-actions';

        // Combat action buttons
        const attackButton = document.createElement('button');
        attackButton.className = 'action-btn';
        attackButton.innerHTML = '⚔️ Attaque de base';
        attackButton.onclick = () => game.performBasicAttack();
        combatActions.appendChild(attackButton);

        const spellsButton = document.createElement('button');
        spellsButton.className = 'action-btn';
        spellsButton.innerHTML = '📖 Spells';
        spellsButton.onclick = () => game.showSpells();
        combatActions.appendChild(spellsButton);

        const itemsButton = document.createElement('button');
        itemsButton.className = 'action-btn';
        itemsButton.innerHTML = '🛡️ Objets';
        itemsButton.onclick = () => game.showCombatInventory();
        combatActions.appendChild(itemsButton);

        combatContainer.appendChild(combatActions);

        // Container for spells and objects
        const spellsContainer = document.createElement('div');
        spellsContainer.id = 'spells-container';
        spellsContainer.className = 'spells-container hidden';
        combatContainer.appendChild(spellsContainer);

        const inventoryContainer = document.createElement('div');
        inventoryContainer.id = 'inventory-container';
        inventoryContainer.className = 'inventory-container hidden';
        combatContainer.appendChild(inventoryContainer);

        // Add the main container to the IU
        this.combatUI.appendChild(combatContainer);
        this.combatUI.style.display = 'block';

        // Update the IU after initialization
        this.updateCombatUI();
    }

    showCombatInventory() {
        const inventoryElement = document.getElementById('inventory');

        // Ensures that the inventory container is visible
        inventoryElement.style.display = 'block';

        // Calls existing logic to display the content of the inventory
        this.showInventory();  // This function should manage the display of the inventory
    }




    useItemAndCloseInventory(itemKey) {
        console.log(`Attempting to use item: ${itemKey}`);  // Log for debugging
        this.useItem(itemKey);

        // Check if the combat inventory is open and close it
        if (this.isCombatInventoryOpen()) {
            this.closeCombatInventory();
        } else {
            this.closeInventory();
        }
    }

    closeCombatInventory() {
        const inventoryContainer = document.getElementById('inventory-container');
        if (inventoryContainer) {
            inventoryContainer.style.display = 'none';  // Hide the combat inventory container
            console.log('Combat inventory closed.');
        } else {
            console.warn('Inventory container not found!');
        }
    }


    isCombatInventoryOpen() {
        const inventoryContainer = document.getElementById('inventory-container');
        return inventoryContainer && inventoryContainer.style.display === 'block';  // Check if the container is displayed
    }


    closeInventory() {
        const inventoryElement = document.getElementById('inventory'); // Select the inventory container
        if (inventoryElement) {
            inventoryElement.style.display = 'none';  // Hide the inventory
        }
    }



    showSpells() {
        const spellsContainer = document.getElementById('spells-container');

        // TOGGLE THE VISIBILITY OF THE SPELLS Container
        if (spellsContainer.classList.contains('hidden')) {
            spellsContainer.classList.remove('hidden');

            const availableSpells = this.hero.getAvailableSpells(); // Get the list of available spells

            if (availableSpells.length > 0) {
                spellsContainer.innerHTML = availableSpells.map((spell, index) => {
                    if (spell) {  // Check if the spell is defined
                        return `
                            <button class="action-btn spell-btn" onclick="game.castSpell('${this.hero.spells[index]}')">
                                ${spell.name} <span class="mana-cost">(Mana: ${spell.manaCost})</span>
                            </button>`;
                    } else {
                        console.error(`Spell at index ${index} is undefined.`);
                        return '';
                    }
                }).join('');
            } else {
                spellsContainer.innerHTML = "<p>No spells learned.</p>";
            }
        } else {
            spellsContainer.classList.add('hidden');
        }
    }



    performBasicAttack() {
        // Check if there is an active attack cooldown
        if (this.attackCooldown) {
            return; // Do nothing if the cooldown is active
        }

        if (this.inCombat && this.currentEnemy) {
            const damage = this.hero.attack(this.currentEnemy);
            this.showMessage(`You deal ${damage.damage} damage to the enemy!`);


            // Launch the attack sound and activate the cooldown
            this.playSoundWithCooldown('attack', 500);

            // Apply damage to the enemy
            applyDamageAnimation('enemy');

            // Update the interface after the hero's attack
            this.updateCombatUI();

            if (this.currentEnemy.stats.hp <= 0) {
                this.defeatEnemy(this.currentEnemy);
            } else {
                // Wait a short time before the enemy attack on a better user experience
                setTimeout(() => {
                    this.enemyAttack();
                }, 300); // 0.3 Second delay
            }
        }
    }


    // Method for playing sound with Cooldown management
    // Method for playing sound with Cooldown management
    playSoundWithCooldown(soundKey, cooldownDuration) {
        if (!this.globalMute) { // Only play sound if not globally muted
            this.attackCooldown = true; // Activate the cooldown

            // Play sound
            const audio = new Audio(`./assets/sound/fx/${soundKey}.mp3`);
            audio.play();

            // Disable Cooldown after the specified period
            setTimeout(() => {
                this.attackCooldown = false; // Deactivate the cooldown
            }, cooldownDuration);
        }
    }



    castSpell(spellKey) {
        // Check if there is an active spell launch cooldown
        if (this.spellCastCooldown) {
            return; // Do nothing if the cooldown is active
        }

        if (!this.inCombat || !this.currentEnemy) {
            console.warn("Attempt to cast a spell outside of combat or without an enemy");
            this.spellCastCooldown = false; // Reset the cooldown if we are not in combat
            return;
        }

        const spell = SPELLS[spellKey];
        if (!spell) {
            console.warn(`Unknown spell : ${spellKey}`);
            return;
        }

        if (this.hero.stats.mana < spell.manaCost) {
            this.showMessage("You do not have enough mana to launch the spell.");
            return;
        }

        // Activate the cooldown de lancement de sort
        this.spellCastCooldown = true;

        // Consume Mana to launch the spell
        this.hero.stats.mana -= spell.manaCost;
        let message = `You use ${spell.name}!`;
        let damage = spell.damage || 0;

        switch (spellKey) {
            case 'healingLight':
                const healAmount = 30;
                this.hero.stats.hp = Math.min(this.hero.stats.maxHp, this.hero.stats.hp + healAmount);
                message += ` You recover ${healAmount} health points`;
                break;

            case 'arcaneAegis':
                this.hero.addBuff('Arcane Aegis', { turns: 3, counterEffect: (dmg) => dmg * 0.5 });
                message += " You have activated Arcane Aegis!";
                break;

            case 'lightning':
                if (Math.random() < 0.2) {
                    damage *= 2;
                    message += " Critical hit!";
                }
                break;

            case 'iceSpike':
                this.currentEnemy.addDebuff('Defense Down', { defenseReduction: 2, turns: 3 });
                message += " The enemy's defense is reduced!";
                break;

            case 'earthquake':
                if (Math.random() < 0.2) {
                    this.currentEnemy.addDebuff('Stunned', { turns: 1 });
                    message += "The enemy is stunned!";
                }
                break;

            case 'gust':
                this.currentEnemy.addDebuff('Attack Down', { attackReduction: 2, turns: 3 });
                message += " The enemy's attack is reduced!";
                break;

            case 'arcanespark':
                if (Math.random() * 100 < this.hero.stats.critChance) {
                    damage = Math.floor(damage * this.hero.stats.critDamage);
                    message += " Critical hit!";
                }
                break;

            case 'poisonCloud':
                this.currentEnemy.addDebuff('Poison', { damagePerTurn: 5, turns: 3 });
                message += " The enemy is poisoned!";
                break;

            default:
                console.warn(`No spell logic defined for: ${spellKey}`);
        }

        if (damage > 0) {
            damage = Math.max(0, damage - this.currentEnemy.stats.defense);
            this.currentEnemy.stats.hp -= damage;
            message += ` You deal ${damage} damage to the enemy!`;

            if (this.currentEnemy.stats.hp <= 0) {
                this.defeatEnemy(this.currentEnemy);
            }
        }

        this.showMessage(message);
        this.updateCombatUI();

        this.disableCombatActions();

        if (this.currentEnemy.stats.hp > 0 && !this.currentEnemy.isStunned()) {
            setTimeout(() => {
                this.enemyAttack();
                this.enableCombatActions();
                this.spellCastCooldown = false;
            }, 500);
        } else {
            setTimeout(() => {
                this.spellCastCooldown = false;
                this.enableCombatActions();
            }, 500);
        }
    }


    disableCombatActions() {
        const actionsContainer = document.getElementById('combat-actions');
        actionsContainer.querySelectorAll('button').forEach(button => button.disabled = true);
    }

    enableCombatActions() {
        const actionsContainer = document.getElementById('combat-actions');
        actionsContainer.querySelectorAll('button').forEach(button => button.disabled = false);
    }

    enemyAttack() {
        if (!this.inCombat || !this.currentEnemy) return;

        const baseDamage = this.currentEnemy.stats.attack;
        const damage = Math.ceil(this.hero.calculateDamageAfterDefense(baseDamage, this.hero.stats.defense));

        this.hero.stats.hp -= damage;
        applyDamageAnimation('hero');
        this.showMessage(`The enemy deals ${damage} damage to you!`);

        // Check for arcane aegis buff on the hero
        const arcaneAegisBuff = this.hero.buffs.find(buff => buff.name === 'Arcane Aegis');

        if (arcaneAegisBuff) {
            // Calculate Reflected Damage Using the Buff's Countereffect Method
            const reflectedDamage = arcaneAegisBuff.counterEffect ? arcaneAegisBuff.counterEffect(damage) : 0;
            if (reflectedDamage > 0) {
                this.currentEnemy.stats.hp -= reflectedDamage;
                this.showMessage(`You reflect ${reflectedDamage} magical damage back to the enemy!`);

                // Check if the enemy is defahed
                if (this.currentEnemy.stats.hp <= 0) {
                    this.defeatEnemy(this.currentEnemy);
                    return; // Exit early to avoid enabling actions or Further Attacks
                }
            }
        }

        this.updateCombatUI();

        if (this.hero.stats.hp <= 0) {
            this.gameOver();
        } else {
            this.enableCombatActions(); // Re-Enable Player Actions After Enemy Turn
        }
    }

    useItem(itemKey) {
        const itemEntry = this.hero.inventory[itemKey];
        if (!itemEntry) {
            console.error(`Item ${itemKey} not found in inventory`);
            return;
        }

        const item = ITEMS[itemKey];
        if (!item) {
            console.error(`Item ${itemKey} not found in ITEMS`);
            return;
        }

        let message = '';

        if (item.type === 'consumable') {
            if (item.effect === 'heal') {
                const healAmount = Math.min(item.value, this.hero.stats.maxHp - this.hero.stats.hp);
                this.hero.stats.hp += healAmount;
                message = `You used ${item.name}. HP restored by ${healAmount}.`;
            } else if (item.effect === 'restoreMana') {
                const manaAmount = Math.min(item.value, this.hero.stats.maxMana - this.hero.stats.mana);
                this.hero.stats.mana += manaAmount;
                message = `You used ${item.name}. Mana restored by ${manaAmount}.`;
            } else {
                message = `You used ${item.name}, but nothing happened.`;
            }

            itemEntry.quantity--;
            if (itemEntry.quantity <= 0) {
                delete this.hero.inventory[itemKey];
            }
        } else if (item.type === 'spell') {
            if (!this.hero.spells.includes(item.spell)) {
                this.hero.spells.push(item.spell);
                message = `You have learned a new spell: ${SPELLS[item.spell].name}!`;
                delete this.hero.inventory[itemKey];
            } else {
                message = `You already know the spell: ${SPELLS[item.spell].name}.`;
            }
        } else {
            message = `Cannot use ${item.name}. It's not a consumable or a spell.`;
        }

        this.showMessage(message);

        this.updateStatsDisplay();

        if (this.inCombat) {
            this.updateCombatUI();
            if (typeof this.enemyAttack === 'function') {
                this.enemyAttack();
            }
        } else {
            this.renderer.renderDungeon(this.dungeon);
            this.renderer.renderEnemies(this.dungeon.enemies);
            this.showInventory();
        }
    }




    updateCombatUI() {
        if (!this.currentEnemy) {
            console.warn("Attempting to update combat interface without an active enemy");
            return;
        }

        this.updateEnemyStatsUI();
        this.updateHeroStatsUI();
        this.updateCombatActionsUI();
        this.updateSpellButtons();
        this.updateStatsDisplay();
    }

    updateEnemyStatsUI(applyDamageAnimation = false) {
        const enemy = this.currentEnemy;
        const enemyHpPercentage = Math.round((enemy.stats.hp / enemy.stats.maxHp) * 100);

        const enemyHpFill = document.getElementById('enemy-hp-fill');
        const enemyHpText = document.getElementById('enemy-hp-text');

        document.getElementById('enemy-type').textContent = enemy.type;
        enemyHpFill.style.width = `${enemyHpPercentage}%`;
        enemyHpText.textContent = `${Math.round(enemy.stats.hp)} / ${Math.round(enemy.stats.maxHp)}`;
        document.getElementById('enemy-attack').innerHTML = `<i class="fas fa-sword"></i> Attack: ${Math.round(enemy.stats.attack)}`;
        document.getElementById('enemy-defense').innerHTML = `<i class="fas fa-shield"></i> Defense: ${Math.round(enemy.stats.defense)}`;

        // Addition of 'Low-HP' class for pulsation animation
        enemyHpFill.classList.toggle('low-hp', enemyHpPercentage < 20);

        if (applyDamageAnimation) {
            this.applyDamageAnimation('enemy');
        }
    }

    updateHeroStatsUI() {
        const hero = this.hero;
        const heroHpPercentage = Math.round((hero.stats.hp / hero.stats.maxHp) * 100);
        const heroManaPercentage = Math.round((hero.stats.mana / hero.stats.maxMana) * 100);

        const heroHpFill = document.getElementById('hero-hp-fill');
        const heroHpText = document.getElementById('hero-hp-text');
        if (heroHpFill && heroHpText) {
            heroHpFill.style.width = `${heroHpPercentage}%`;
            heroHpText.textContent = `${Math.round(hero.stats.hp)} / ${Math.round(hero.stats.maxHp)}`;
            // Addition of 'Low-HP' class for pulsation animation
            heroHpFill.classList.toggle('low-hp', heroHpPercentage < 20);
        }

        const heroManaFill = document.getElementById('hero-mana-fill');
        const heroManaText = document.getElementById('hero-mana-text');
        if (heroManaFill && heroManaText) {
            heroManaFill.style.width = `${heroManaPercentage}%`;
            heroManaText.textContent = `${Math.round(hero.stats.mana)} / ${Math.round(hero.stats.maxMana)}`;
        }
    }

    updateCombatActionsUI() {
        const actionsContainer = document.getElementById('combat-actions');
        if (actionsContainer) {
            actionsContainer.innerHTML = `
                <button class="action-btn" onclick="game.performBasicAttack()">Basic Attack</button>
                <button class="action-btn" onclick="game.showSpells()">Spells</button>
                <button class="action-btn" onclick="game.showCombatInventory()">Objects</button>
            `;
        }
    }


    updateSpellButtons() {
        const spellButtons = document.querySelectorAll('.spell-btn');
        spellButtons.forEach(button => {
            const spellCost = parseInt(button.getAttribute('data-mana-cost'));
            if (this.hero.stats.mana < spellCost) {
                button.disabled = true;
                button.classList.add('disabled');
            } else {
                button.disabled = false;
                button.classList.remove('disabled');
            }
        });
    }

    defeatEnemy(enemy) {
        this.hero.gainXP(enemy.stats.xp);
        const droppedItems = enemy.dropItems(this.hero);

        let messages = [`You defeated ${enemy.type}! You gained ${enemy.stats.xp} XP.`];

        if (droppedItems.length > 0) {
            droppedItems.forEach(itemKey => {
                this.hero.addItemToInventory(itemKey);
                messages.push(`You received a ${ITEMS[itemKey].name}!`);
            });
        }

        this.displayMessages(messages);

        this.dungeon.removeEnemy(enemy);
        this.renderer.removeEnemyElement(enemy.element);
        this.updateStatsDisplay(); // Add the call here
        this.endCombat();
    }



    displayMessages(messages) {
        if (messages.length > 0) {
            const message = messages.shift();
            this.showMessage(message);
            setTimeout(() => {
                this.displayMessages(messages);
            }, 3000);  // Show each message for 3 seconds
        }
    }

    heroAttack() {
        const baseDamage = this.hero.stats.attack;

        // Calculation of damage after reduction by the defense of the enemy
        const damage = Math.ceil(this.hero.calculateDamageAfterDefense(baseDamage, this.currentEnemy.stats.defense));

        this.currentEnemy.stats.hp -= damage;
        applyDamageAnimation('enemy');
        this.showMessage(`You deal ${damage}  to the enemy !`);

        this.updateCombatUI();

        if (this.currentEnemy.stats.hp <= 0) {
            this.victoryScreen();
        }
    }

    createItem(itemKey, x, y) {
        return {
            type: itemKey,
            x: x,
            y: y,
            element: this.createItemElement(itemKey, x, y)
        };
    }

    createItemElement(itemKey, x, y) {
        const itemElement = document.createElement('div');
        itemElement.className = `item ${itemKey}`;
        itemElement.style.left = `${x * CONFIG.TILE_SIZE}px`;
        itemElement.style.top = `${y * CONFIG.TILE_SIZE}px`;
        return itemElement;
    }

    endCombat() {
        this.inCombat = false;
        this.currentEnemy = null;
        this.combatUI.style.display = 'none';

        // Reset the Cooldown of spells
        this.spellCastCooldown = false;

        // Reactivate combat actions
        this.enableCombatActions();

        // User interface update
        this.updateCombatUI();
    }

    gameOver() {
        this.showMessage("Game Over! You have died. Restarting...");

        setTimeout(() => {
            // Reset the Game State
            this.level = 1;
            this.hero = new Hero(); // Reinitialize the hero with default stats
            this.dungeon = new Dungeon(); // Reinitialize The Dungeon
            this.inCombat = false;
            this.currentEnemy = null;

            // Restart The Game
            window.location.reload();

            this.init();
        }, 3000); // Wait for 3 seconds to show the game over message beforestarting
    }


    showMessage(text) {
        this.messageBox.textContent = text;
        this.messageBox.classList.remove('hidden');
        this.messageBox.classList.add('visible');
        clearTimeout(this.messageTimeout);
        this.messageTimeout = setTimeout(() => {
            this.messageBox.classList.remove('visible');
            this.messageBox.classList.add('hidden');
        }, 3000);
    }
}


let consecutiveCommonOpens = 0;

function selectRandomItemFromChest() {
    const weightedItems = [];

    // Define basic weights for each rarity
    let rarityWeights = {
        "common": 75,    // Common items have a high probability
        "uncommon": 20,  // Non -common items are less likely
        "rare": 4,       // Rare items are even less likely
        "legendary": 1   // Legendary items are very rare
    };

    // Gradually increase the chances of rarity if many common objects are obtained
    if (consecutiveCommonOpens > 5) {
        rarityWeights.uncommon += 2;  // Increases the chance of "uncommon" objects
        rarityWeights.rare += 1;      // Slightly increases the chance of "rare" objects
        rarityWeights.legendary += 0.5; // Very slightly increases the chance of "legendary" objects
    }

    // Fill the weighted list according to the adjusted weights
    for (const itemKey in ITEMS) {
        const item = ITEMS[itemKey];
        const weight = rarityWeights[item.rarity] || 0;
        for (let i = 0; i < weight; i++) {
            weightedItems.push(itemKey);
        }
    }

    // Select an item at random from the weighted items
    const randomIndex = Math.floor(Math.random() * weightedItems.length);
    const selectedItem = weightedItems[randomIndex];

    // Reset or adjust the chances according to the result
    if (ITEMS[selectedItem].rarity === "common") {
        consecutiveCommonOpens++;
    } else {
        consecutiveCommonOpens = 0; // Reset progression if a rare or legendary item is obtained
        if (ITEMS[selectedItem].rarity === "legendary") {
            rarityWeights.legendary = 1; // Brings back the chances of legendary to their initial level
        }
    }

    return selectedItem;
}



function applyDamageAnimation(target) {
    const hpFill = document.getElementById(`${target}-hp-fill`);
    const hpText = document.getElementById(`${target}-hp-text`);

    if (hpFill && hpText) {
        hpFill.classList.add('damage');
        hpText.classList.add('damage');

        setTimeout(() => {
            hpFill.classList.remove('damage');
            hpText.classList.remove('damage');
        }, 500);
    }
}


// Start the game
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
