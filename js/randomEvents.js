const RandomEvents = {


    interactWithStatue(hero, dungeon, game, x, y) {
        const introModal = document.createElement('div');
        this.setupModal(introModal, "In Front of the Warrior Statue.");

        introModal.innerHTML = `
                <h2>In Front of the Warrior Statue.</h2>
                <p>
                You stand before an imposing statue of an ancient techno-mage warrior. 
                This monument, erected to honor the protectors of the ancient secrets of Technoclyss,
                    exudes a powerful aura. The techno-mages of old used these statues not only as guardians
                    but also as channels of energy for those who dared to connect with them. However,
                    any attempt to extract this power carries risks.
                </p>
                <button id="continueToChoices">Continue</button>
            `;

        introModal.querySelector('#continueToChoices').addEventListener('click', () => {
            document.body.removeChild(introModal);
            this.showStatueInteractionChoices(hero, dungeon, game);
        });

        document.body.appendChild(introModal);
    },

    showStatueInteractionChoices(hero, dungeon, game) {
        const modal = document.createElement('div');
        this.setupModal(modal, "Interaction with the Statue");

        modal.innerHTML = `
                <h2>Choose Your Interaction</h2>
                <p>What do you want to do with the statue?</p>
                <button id="offerGold">1. Offer gold.</button>
                <button id="prayStatue">2. Pray to the gods.</button>
                <button id="absorbPower">3. Try to absorb the power of the statue.</button>
                <button id="destroyStatue">4. Destroy the statue.</button>
                <button id="closeModal">Cancel</button>
            `;

        modal.querySelector('#offerGold').addEventListener('click', () => {
            this.offerGold(hero);
            document.body.removeChild(modal);
        });

        modal.querySelector('#prayStatue').addEventListener('click', () => {
            this.prayAtStatue(hero);
            document.body.removeChild(modal);
        });

        modal.querySelector('#absorbPower').addEventListener('click', () => {
            this.absorbPower(hero, dungeon, game);
            document.body.removeChild(modal);
        });

        modal.querySelector('#destroyStatue').addEventListener('click', () => {
            this.destroyStatue(hero);
            document.body.removeChild(modal);
        });

        modal.querySelector('#closeModal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.body.appendChild(modal);
    },

    offerGold(hero) {
        const goldCost = 50;
        if (hero.stats.gold < goldCost) {
            // Display error in a modal instead of alert
            const errorModal = document.createElement('div');
            this.setupModal(errorModal, "Not Enough Gold");

            errorModal.innerHTML = `
                <h2>Not Enough Gold</h2>
                <p>You don't have enough gold to make an offering.</p>
                <button id="closeErrorModal">Close</button>
            `;

            errorModal.querySelector('#closeErrorModal').addEventListener('click', () => {
                document.body.removeChild(errorModal);
            });

            document.body.appendChild(errorModal);
            return;
        }

        const modal = document.createElement('div');
        this.setupModal(modal, "Offer golds");

        modal.innerHTML = `
            <h2>Offer golds</h2>
            <p>Where will you place the gold?</p>
            <button id="buffHp">1. In the statue's left hand.</button>
            <button id="buffMana">2. In the statue's right hand.</button>
            <button id="closeModal">Cancel</button>
        `;

        modal.querySelector('#buffHp').addEventListener('click', () => {
            hero.stats.maxHp += 10;
            hero.stats.hp = Math.min(hero.stats.hp + 10, hero.stats.maxHp);
            hero.stats.gold -= goldCost;

            // Create a result modal for HP buff
            const resultModal = document.createElement('div');
            this.setupModal(resultModal, "Offering Result");

            resultModal.innerHTML = `
                <h2>Offering Result</h2>
                <p>Your maximum Life has increased by 10!</p>
                <button id="closeResultModal">Close</button>
            `;

            resultModal.querySelector('#closeResultModal').addEventListener('click', () => {
                document.body.removeChild(resultModal);
            });

            document.body.appendChild(resultModal);
            document.body.removeChild(modal);
        });

        modal.querySelector('#buffMana').addEventListener('click', () => {
            hero.stats.maxMana += 10;
            hero.stats.mana = Math.min(hero.stats.mana + 10, hero.stats.maxMana);
            hero.stats.gold -= goldCost;

            // Create a result modal for Mana buff
            const resultModal = document.createElement('div');
            this.setupModal(resultModal, "Offering Result");

            resultModal.innerHTML = `
                <h2>Offering Result</h2>
                <p>Your maximum Mana has increased by 10!</p>
                <button id="closeResultModal">Close</button>
            `;

            resultModal.querySelector('#closeResultModal').addEventListener('click', () => {
                document.body.removeChild(resultModal);
            });

            document.body.removeChild(modal);
            document.body.appendChild(resultModal);
        });

        modal.querySelector('#closeModal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.body.appendChild(modal);
    },


    showAzkorthBet() {
        const betModal = document.createElement('div');
        this.setupModal(betModal, "Azkorth's Bet");

        betModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Azkorth's Bet</h2>
                <button class="azkorth-close-button">&times;</button>
            </div>
            <div class="azkorth-dialogue">
                <strong>Azkorth:</strong> "Ah, a brave soul indeed. But what are you willing to risk? Your life force... or your worldly possessions?"
            </div>
            <div class="bet-options">
                <button id="betHP" class="bet-button">Bet HP</button>
                <button id="betGold" class="bet-button">Bet Gold</button>
            </div>
            <div id="betAmount" style="display: none;">
                <div id="goldOptions" style="display: none;"></div>
                <div id="hpOption" style="display: none;">
                    <div class="bet-input-container">
                        <input type="number" id="betValue" min="1" class="bet-input">
                        <span id="betUnit" class="bet-unit"></span>
                    </div>
                    <button id="placeBet" class="bet-button">Place Bet</button>
                </div>
            </div>
        </div>
        `;

        document.body.appendChild(betModal);

        betModal.querySelector('.azkorth-close-button').addEventListener('click', () => {
            document.body.removeChild(betModal);
        });

        const betHP = betModal.querySelector('#betHP');
        betHP.style.display = 'none';
        const betGold = betModal.querySelector('#betGold');
        const betAmount = betModal.querySelector('#betAmount');
        const goldOptions = betModal.querySelector('#goldOptions');
        const hpOption = betModal.querySelector('#hpOption');
        const betValue = betModal.querySelector('#betValue');
        const betUnit = betModal.querySelector('#betUnit');
        const placeBet = betModal.querySelector('#placeBet');

        let betType = '';

        const self = this;

        betHP.addEventListener('click', () => {
            betType = 'HP';
            betAmount.style.display = 'flex';
            goldOptions.style.display = 'none';
            hpOption.style.display = 'flex';
            const maxHPBet = Math.floor(window.game.hero.stats.hp / 2);
            betValue.max = maxHPBet;
            betValue.placeholder = `1-${maxHPBet}`;
            betUnit.textContent = 'HP';
            updateButtonStates();
        });

        betGold.addEventListener('click', () => {
            betType = 'Gold';
            betAmount.style.display = 'flex';
            goldOptions.style.display = 'flex';
            hpOption.style.display = 'none';
            updateGoldOptions();
            updateButtonStates();
        });

        function showErrorMessage(message) {
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(200, 0, 0, 0.9);
                color: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
                z-index: 1000;
                text-align: center;
                font-size: 18px;
            `;
            errorDiv.textContent = message;
            document.body.appendChild(errorDiv);
            setTimeout(() => {
                document.body.removeChild(errorDiv);
            }, 3000);
        }

        function updateGoldOptions() {
            const heroGold = window.game.hero.stats.gold;
            const maxBet = Math.floor(heroGold * 1.0);
            const betOptions = [10, 25, 50, 100, 200];

            goldOptions.innerHTML = betOptions.map(option =>
                `<button class="gold-bet-option" data-amount="${option}" ${option > heroGold ? 'disabled' : ''}>${option} Gold</button>`
            ).join('');

            goldOptions.querySelectorAll('.gold-bet-option').forEach(button => {
                const amount = parseInt(button.dataset.amount);
                if (amount <= heroGold) {
                    button.addEventListener('click', (e) => {
                        console.log(`Gold before the bet: ${heroGold}`);
                        console.log('Bet set:', { type: 'Gold', amount });
                        self.startDiceGame('Gold', amount);
                        try {
                            document.body.removeChild(betModal);
                        } catch (error) {
                            console.warn("Unable to remove betModal, it may have already been removed.");
                        }
                    });
                } else {
                    button.classList.add('disabled');
                    button.title = `You do not have enough gold for this bet. (Current gold: ${heroGold})`;
                }
            });
        }

        function updateButtonStates() {
            betHP.classList.toggle('active', betType === 'HP');
            betGold.classList.toggle('active', betType === 'Gold');
        }

        betValue.addEventListener('input', () => {
            const amount = parseInt(betValue.value);
            placeBet.disabled = isNaN(amount) || amount < 1 || amount > parseInt(betValue.max);
        });

        placeBet.addEventListener('click', () => {
            const amount = parseInt(betValue.value);
            if (isNaN(amount) || amount < 1 || amount > parseInt(betValue.max)) {
                showErrorMessage("Invalid bet amount!");
                return;
            }

            if (amount > window.game.hero.stats.hp) {
                showErrorMessage("You do not have enough health points for this bet!");
                return;
            }

            console.log(`HP before the bet: ${window.game.hero.stats.hp}`);
            console.log('Bet set:', { type: 'HP', amount });
            self.startDiceGame('HP', amount);

            try {
                document.body.removeChild(betModal);
            } catch (error) {
                console.warn("Unable to remove betModal, it may have already been removed.");
            }
        });



        const style = `
            .bet-button {
                padding: 10px 20px;
                margin: 5px;
                font-size: 16px;
                cursor: pointer;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 5px;
                transition: background-color 0.3s;
            }
            .bet-button:hover {
                background-color: #45a049;
            }
            .bet-button.active {
                background-color: #45a049;
            }
            .bet-button:disabled {
                background-color: #cccccc;
                cursor: not-allowed;
            }
            .bet-options {
                display: flex;
                justify-content: center;
                margin-bottom: 20px;
            }
            .bet-input-container {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
            }
            .bet-input {
                width: 100px;
                padding: 5px;
                font-size: 16px;
                margin-right: 5px;
            }
            .bet-unit {
                font-size: 16px;
                font-weight: bold;
            }
            
            
            .azkorth-close-button {
            position: absolute;
                top: -5px;
            right: 10px;
            font-size: 24px;
            background: none;
            border: none;
            cursor: pointer;
            }

            #betAmount {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = style;
        document.head.appendChild(styleElement);
    },



    startDiceGame(betType, amount) {
        if (typeof this.showDiceGameModal === 'function') {
            this.showDiceGameModal(betType, amount);
        } else if (typeof window.game.showDiceGameModal === 'function') {
            window.game.showDiceGameModal(betType, amount);
        } else {
            console.error('showDiceGameModal is not defined');
        }
    },


    resolveBet(betType, betAmount, diceResult) {
        let winAmount = 0;
        let resultMessage = "";
        console.log(`HP before resolveBet: ${window.game.hero.stats.hp}, Gold before resolveBet: ${window.game.hero.stats.gold}`);

        // Deduct the bet amount here  
        if (betType === 'HP') {
            window.game.hero.stats.hp = Math.max(1, window.game.hero.stats.hp - betAmount);
        } else { // Gold
            window.game.hero.stats.gold = Math.max(0, window.game.hero.stats.gold - betAmount);
        }

        switch (diceResult) {
            case 1: // Fire - Total loss of bet
                winAmount = 0; // No additional gain, the loss has already been applied
                resultMessage = "Ah... Fire has spoken, and it knows only the language of destruction. It takes all and leaves nothing but ashes and burning breath. But sometimes, to rise from one's own ashes, one must first be consumed entirely. Will you dare to face the flames again?";
                break;
            case 2: // Water - No gain
                winAmount = betAmount; // Return the bet amount
                resultMessage = "Water is the mirror of the world, cold and impassive. Today, it reflects your hesitation. Neither gain nor loss... only the silence of a motionless lake. But remember, it is in calm waters that the greatest storm is born. Would you dive into the unknown again?";
                break;
            case 3: // Earth - Moderate gain
                winAmount = Math.floor(betAmount * 1.5); // Gain of 50% plus the bet amount
                resultMessage = "Earth is ancient and wise. It grants its blessings slowly, to those who know how to wait and persevere. A small step forward, a seed planted waiting to grow. Will you take root here, or will you seek further into its unfathomable depths?";
                break;
            case 4: // Air - Double gain
                winAmount = betAmount * 2; // Double the bet amount
                resultMessage = "Air, free and capricious, has chosen you to dance in its currents. A breath of luck lifts you, but the wind can change at any moment. Will it continue to carry you to the heights or will it precipitate you into the abyss? Do you wish to continue your dance with destiny?";
                break;
            case 5: // Lightning - Triple gain
                winAmount = betAmount * 3; // Triple the bet amount
                resultMessage = "Lightning, fleeting and terrible, has struck you with its celestial brilliance. A thunderbolt that happens only once, swift and relentless. Do you feel the adrenaline coursing through you? The thrill of the unexpected? The sky calls to you again... do you dare brave the storm once more?";
                break;
            case 6: // Mystic Eclipse - Quintuple gain with Challenge
                winAmount = betAmount * 5; // Quintuple the bet amount
                resultMessage = "The Mystic Eclipse... a rare and dangerous alignment, where light hides and shadows dance in silence. An unfathomable force has granted you a unique gift, but know that all light is born from the deepest shadow. Are you ready to pay the price to see what the darkness hides?";
                break;
        }

        // Apply the result of the bet
        if (betType === 'HP') {
            window.game.hero.stats.hp = Math.max(1, Math.min(window.game.hero.stats.maxHp, window.game.hero.stats.hp + winAmount));
        } else { // Gold
            window.game.hero.stats.gold = Math.max(0, window.game.hero.stats.gold + winAmount);
        }

        // Update the stats display after the update
        window.game.updateStatsDisplay();

        console.log(`HP after resolveBet: ${window.game.hero.stats.hp}, Gold after resolveBet: ${window.game.hero.stats.gold}`);

        this.showBetResult(betType, betAmount, winAmount - betAmount, diceResult, resultMessage);
    },

    showBetResult(betType, betAmount, winAmount, diceResult, resultMessage) {
        const resultModal = document.createElement('div');
        this.setupModal(resultModal, "Azkorth's Judgment");

        let outcomeMessage = "";
        if (winAmount > 0) {
            outcomeMessage = `You have gained ${winAmount} ${betType}!`;
        } else if (winAmount < 0) {
            outcomeMessage = `You have lost ${Math.abs(winAmount)} ${betType}!`;
        } else {
            outcomeMessage = "Your bet remains unchanged.";
        }

        resultModal.innerHTML = `
            <div class="azkorth-dialogue">
                <strong>Azkorth:</strong> "${resultMessage}"
            </div>
            <p>${outcomeMessage}</p>
            <button id="closeBetResult">Continue</button>
        `;

        document.body.appendChild(resultModal);

        resultModal.querySelector('#closeBetResult').addEventListener('click', () => {
            document.body.removeChild(resultModal);
            window.game.updateStatsDisplay();
        });
    }
    ,

    interactWithAzkorth() {
        // Create a modal for the initial introduction of the room
        const azkorthModal = document.createElement('div');
        this.setupModal(azkorthModal, "Mystic Room Encounter");

        // Step 1: Description of the mystical room
        azkorthModal.innerHTML = `
            <h2>Mystic Room Encounter</h2>
            <p>You stand before a massive door, engraved with mystical runes and bathed in a bluish light. As you cross the threshold, you enter a dark room illuminated only by the flickering blue flames from four braziers placed in the corners of the room. At the center, dice float slowly in the air, etched with ancient symbols representing the elements. The atmosphere is heavy with ancient magic and mystery, a mix of wonder and dread. A cold breath passes over the back of your neck, sending shivers down your spine.</p>
            <button id="nextStep1">Continue</button>
        `;

        // Add the modal to the page
        document.body.appendChild(azkorthModal);

        // Proceed to the next step after clicking "Continue"
        azkorthModal.querySelector('#nextStep1').addEventListener('click', () => {
            document.body.removeChild(azkorthModal);
            this.showAzkorthAppearance();
        });
    },


    showAzkorthAppearance() {

        // Create a new modal for the appearance of Azkorth
        const azkorthAppearanceModal = document.createElement('div');
        this.setupModal(azkorthAppearanceModal, "Azkorth Appears");

        azkorthAppearanceModal.innerHTML = `
            <p>Suddenly, a spectral figure begins to materialize near the floating dice. Slowly, it takes the form of Azkorth, an ancient techno-mage turned spectral entity. His eyes burn with a piercing blue light, and his face, hidden behind a skull mask, smiles a not-quite-human smile. He holds a blue flame in his right hand, an unstable glow that seems to whisper forbidden secrets.</p>
            <button id="nextStep2">Continue</button>
        `;

        // Add the modal to the page
        document.body.appendChild(azkorthAppearanceModal);

        // Proceed to the next step after clicking "Continue"
        azkorthAppearanceModal.querySelector('#nextStep2').addEventListener('click', () => {
            document.body.removeChild(azkorthAppearanceModal);
            this.showAzkorthDialogue();
        });
    },

    showAzkorthDialogue() {
        // Create a new modal for Azkorth's dialogue
        const azkorthDialogueModal = document.createElement('div');
        this.setupModal(azkorthDialogueModal, "Azkorth's Challenge");

        azkorthDialogueModal.innerHTML = `
            <div class="azkorth-dialogue">
                <strong>Azkorth:</strong> "What a surprise... An apprentice, so far in these lost ruins. Were you sent here by your masters? To prove your worth, to test your strength? Or perhaps... to test your luck?"
            </div>
            <button id="nextStep3">Respond</button>
        `;

        // Add the modal to the page
        document.body.appendChild(azkorthDialogueModal);

        // Proceed to the player's choices step after clicking "Respond"
        azkorthDialogueModal.querySelector('#nextStep3').addEventListener('click', () => {
            document.body.removeChild(azkorthDialogueModal);
            this.showPlayerChoices();
        });
    },


    showPlayerChoices() {
        // Create a new modal for the player's choices
        const playerChoicesModal = document.createElement('div');
        this.setupModal(playerChoicesModal, "Your Choices");

        playerChoicesModal.innerHTML = `
            <div class="azkorth-dialogue">
                <strong>Azkorth:</strong> "Don't worry... I am but a shadow of a bygone era, a mere presence in this maze of mysteries. But these dice... oh, these dice are quite real. They offer more than meets the eye. Luck, risk, reward... Fate is but a series of games, after all. Why not try yours?"
            </div>
    
            <div class="player-choices">
                <button id="choice1">"I am not afraid. I want to see what these dice have to offer."</button>
                <button id="choice2">"I am here for a mission. Why would I play your game?"</button>
                <button id="choice3">"Who are you? Why are you here?"</button>
                <button id="leave">[Leave]</button>
            </div>
        `;

        // Add the modal to the page
        document.body.appendChild(playerChoicesModal);

        // Player responses to choices
        playerChoicesModal.querySelector('#choice1').addEventListener('click', () => {
            document.body.removeChild(playerChoicesModal);
            this.showAzkorthBet();
        });
        playerChoicesModal.querySelector('#choice2').addEventListener('click', () => {
            this.showAzkorthResponse(playerChoicesModal, 2);
        });
        playerChoicesModal.querySelector('#choice3').addEventListener('click', () => {
            this.showAzkorthResponse(playerChoicesModal, 3);
        });
        playerChoicesModal.querySelector('#leave').addEventListener('click', () => {
            this.showAzkorthResponse(playerChoicesModal, 4);
        });
    },

    showAzkorthResponse(playerChoicesModal, choice) {
        // Close the choices modal
        document.body.removeChild(playerChoicesModal);

        // Create a new modal for Azkorth's response
        const responseModal = document.createElement('div');
        this.setupModal(responseModal, "Azkorth's Response");

        let response = '';
        switch (choice) {
            case 1:
                response = `<div class="azkorth-dialogue"><strong>Azkorth:</strong> "Courageous, or perhaps desperate. They look so much alike... Let them dance, and let fortune or misfortune find you. Remember, young apprentice, that fate favors those who dare venture beyond the known."</div>`;
                break;
            case 2:
                response = `<div class="azkorth-dialogue"><strong>Azkorth:</strong> "A mission, you say? Life itself is an endless mission, one challenge after another, with luck at its pivot. Perhaps by playing, you will find the key to your success... or answers to questions you never knew you were asking."</div>`;
                break;
            case 3:
                response = `<div class="azkorth-dialogue"><strong>Azkorth:</strong> "I am the remnant of a failure, a memory that refuses to die. Once, I was like you, seeking power and knowledge. But I played too much with the rules of reality. Now, I am a spectator, and my game is to see who dares to play against fate... or with it."</div>`;
                break;
            case 4:
                response = `<div class="azkorth-dialogue"><strong>Azkorth:</strong> "Ah, the choice of prudence. But know that the emptiness you feel now will only grow. Luck smiles only upon those who invite it to their table. If you change your mind, these dice will wait... they have all the time in the world, after all."</div>`;
                break;
        }

        responseModal.innerHTML = `
            ${response}
            <button id="closeModal">Close</button>
        `;

        responseModal.querySelector('#closeModal').addEventListener('click', () => {
            document.body.removeChild(responseModal);
        });

        document.body.appendChild(responseModal);
    },


    showDiceGameModal(betType, betAmount) {
        this.currentBet = { type: betType, amount: betAmount };
        console.log('currentBet initalised in showDiceGameModal:', this.currentBet);

        const diceGameModal = document.createElement('div');
        this.setupModal(diceGameModal, "The Dice of Azkorth");

        diceGameModal.innerHTML += `
            <style>
                :root {
                    --border-color: #3d3a34;
                    --background-color: #1a1816;
                    --dice-color: #252320;
                    --glow-color: #c7a76c;
                    --glow-color1: rgba(199, 167, 108, 0.6);
                    --crack-color: #3d3a34;
                    --rune-color: #e8e6e3;
                }
    
                #dice, .face, .face .number {
                    user-select: none;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    pointer-events: none;
                }
    
.face img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* ada */
    border-radius: 10px; /* man */
}

                #dice {
                    pointer-events: auto;
                    cursor: grab;
                }
    
                #dice:active {
                    cursor: grabbing;
                }
    
                #game-container1 {
                    position: relative;
                    max-width: 600px;
                    width: 90%;
                    max-height: 45vh;
                    background-color: rgba(26, 24, 22, 0.95);
                    border: 3px solid var(--border-color);
                    border-radius: 15px;
                    padding: 20px;
                    box-shadow:
                        0 0 20px rgba(199, 167, 108, 0.3),
                        inset 0 0 15px rgba(0, 0, 0, 0.8);
                    background-image:
                        url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%231a1816" /><path d="M0 0L100 100M100 0L0 100" stroke="%233d3a34" stroke-width="0.5"/></svg>');
                    overflow: hidden;
                    perspective: 1000px;
                        user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
                }
    
    
                #dice-container {
                    width: 100%;
                    height: 300px;
                    position: relative;
                }
    
                #dice {
                    width: 80px;
                    height: 80px;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform-style: preserve-3d;
                    cursor: grab;
                    transition: transform 0.05s;
                }
    
                .face {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(45deg, #252320, #3d3a34);
                    border: 2px solid var(--glow-color);
                    display: flex;
                    align-items: center;
                    font-size: 32px;
                    font-weight: bold;
                    color: var(--rune-color);
                    text-shadow: 0 0 3px var(--glow-color);
                    box-shadow:
                        inset 0 0 15px rgba(0, 0, 0, 0.8),
                        0 0 10px var(--glow-color);
                    backface-visibility: hidden;
                    border-radius: 10px;
                    overflow: hidden;
                    clip-path: polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%);
                }
    
                .face::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-image:
                        url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 0.7 0"/></filter><rect width="100" height="100" filter="url(%23noise)"/></svg>'),
                        url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path d="M20,50 L80,50 M50,20 L50,80 M20,20 L80,80 M20,80 L80,20" stroke="%23c7a76c" stroke-width="0.5" opacity="0.2"/></svg>'),
                        url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="none" stroke="%23c7a76c" stroke-width="0.5" opacity="0.2"/></svg>');
                    opacity: 0.15;
                    mix-blend-mode: overlay;
                }
    
                .face::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-image:
                        url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><filter id="crackle"><feTurbulence type="turbulence" baseFrequency="0.3" numOctaves="5" seed="5" stitchTiles="stitch"/><feColorMatrix values="0 0 0 9 -4, 0 0 0 9 -4, 0 0 0 9 -4, 0 0 0 0 1"/></filter><rect width="100" height="100" filter="url(%23crackle)"/></svg>');
                    opacity: 0.4;
                    mix-blend-mode: color-burn;
                }
    
                .glowing-result {
                    color: #ffffff;
                    text-shadow:
                        0 0 10px var(--glow-color),
                        0 0 20px var(--glow-color),
                        0 0 30px var(--glow-color),
                        0 0 40px var(--glow-color),
                        0 0 70px var(--glow-color);
                    animation: intense-glow 1.5s ease-in-out infinite alternate;
                }
    
                @keyframes intense-glow {
                    from {
                        text-shadow:
                            0 0 10px var(--glow-color),
                            0 0 20px var(--glow-color),
                            0 0 30px var(--glow-color),
                            0 0 40px var(--glow-color);
                    }
                    to {
                        text-shadow:
                            0 0 20px var(--glow-color),
                            0 0 30px var(--glow-color),
                            0 0 40px var(--glow-color),
                            0 0 50px var(--glow-color),
                            0 0 80px var(--glow-color);
                    }
                }
    
                @keyframes mystical-pulse {
                    0% {
                        text-shadow: 0 0 5px var(--glow-color);
                        box-shadow: 0 0 5px var(--glow-color), inset 0 0 15px rgba(0, 0, 0, 0.8);
                    }
                    50% {
                        text-shadow: 0 0 15px var(--glow-color), 0 0 30px var(--glow-color);
                        box-shadow: 0 0 15px var(--glow-color), inset 0 0 25px rgba(199, 167, 108, 0.4);
                    }
                    100% {
                        text-shadow: 0 0 5px var(--glow-color);
                        box-shadow: 0 0 5px var(--glow-color), inset 0 0 15px rgba(0, 0, 0, 0.8);
                    }
                }
    
                #dice.rolling .face {
                    animation: mystical-pulse 0.5s infinite;
                }
    
                @keyframes spectral-glow {
                    0% { border-color: var(--glow-color); }
                    50% { border-color: #e8d8b7; }
                    100% { border-color: var(--glow-color); }
                }
    
                .face {
                    animation: spectral-glow 2s infinite;
                }
    
                .face::before {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background:
                        radial-gradient(circle at 0 0, transparent 5px, var(--dice-color) 5px),
                        radial-gradient(circle at 100% 0, transparent 5px, var(--dice-color) 5px),
                        radial-gradient(circle at 100% 100%, transparent 5px, var(--dice-color) 5px),
                        radial-gradient(circle at 0 100%, transparent 5px, var(--dice-color) 5px);
                    background-size: 50% 50%;
                    background-repeat: no-repeat;
                    background-position: top left, top right, bottom right, bottom left;
                }
    
                .face .number {
                    position: relative;
                    z-index: 2;
                    color: #e8e6e3;
                    text-shadow:
                        0 0 5px var(--glow-color1),
                        0 0 10px var(--glow-color),
                        0 0 15px var(--glow-color1);
                    animation: face-number-glow 2s infinite alternate;
                }
    
                @keyframes face-number-glow {
                    from {
                        text-shadow:
                            0 0 5px var(--glow-color1),
                            0 0 10px var(--glow-color),
                            0 0 15px var(--glow-color1);
                    }
                    to {
                        text-shadow:
                            0 0 10px var(--glow-color1),
                            0 0 20px var(--glow-color),
                            0 0 30px var(--glow-color1),
                            0 0 40px var(--glow-color);
                    }
                }
    
                .face::before,
                .face::after {
                    transition: opacity 0.3s ease;
                }
    
                #dice.rolling .face::before,
                #dice.rolling .face::after {
                    opacity: 0.4;
                }
    
                .face:nth-child(1) { transform: rotateY(0deg) translateZ(40px); }
                .face:nth-child(2) { transform: rotateY(180deg) translateZ(40px); }
                .face:nth-child(3) { transform: rotateY(-90deg) translateZ(40px); }
                .face:nth-child(4) { transform: rotateY(90deg) translateZ(40px); }
                .face:nth-child(5) { transform: rotateX(90deg) translateZ(40px); }
                .face:nth-child(6) { transform: rotateX(-90deg) translateZ(40px); }
    
                #trail {
                    position: absolute;
                    pointer-events: none;
                    z-index: -1;
                }
    
                #result {
                    position: absolute;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 36px;
                    color: var(--rune-color);
                    text-align: center;
                    text-shadow: 0 0 5px var(--glow-color);
                    z-index: 1;
                }
    
                @keyframes pulse {
                    0% { transform: scale(1) translateX(-50%); }
                    50% { transform: scale(1.1) translateX(-45%); }
                    100% { transform: scale(1) translateX(-50%); }
                }
    
                @keyframes mystical-glow {
                    0% { box-shadow: 0 0 5px var(--glow-color), inset 0 0 15px rgba(0, 0, 0, 0.8); }
                    50% { box-shadow: 0 0 10px var(--glow-color), inset 0 0 20px rgba(26, 95, 180, 0.3); }
                    100% { box-shadow: 0 0 5px var(--glow-color), inset 0 0 15px rgba(0, 0, 0, 0.8); }
                }
    
                #dice.rolling .face {
                    animation: mystical-glow 0.5s infinite;
                }
    
                #closeDiceGame {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: var(--dice-color);
                    color: var(--rune-color);
                    border: 1px solid var(--glow-color);
                    padding: 5px 10px;
                    cursor: pointer;
                    border-radius: 5px;
                    transition: all 0.3s ease;
                }
    
                #closeDiceGame:hover {
                    background: var(--glow-color);
                    color: var(--dice-color);
                }
            </style>
        <div id="game-container1">
            <div id="result"></div>
            <div id="dice-container">
                <div id="trail"></div>
                <div id="dice">
                    <div class="face"><img src="assets/img/des/1.png" alt="Face 1"></div>
                    <div class="face"><img src="assets/img/des/2.png" alt="Face 2"></div>
                    <div class="face"><img src="assets/img/des/3.png" alt="Face 3"></div>
                    <div class="face"><img src="assets/img/des/4.png" alt="Face 4"></div>
                    <div class="face"><img src="assets/img/des/5.png" alt="Face 5"></div>
                    <div class="face"><img src="assets/img/des/6.png" alt="Face 6"></div>
                </div>
            </div>
            <button id="rollDiceButton" class="roll-dice-button">Roll Dice</button> <!-- Roll Dice Button -->
            <button id="closeDiceGame">Close</button>
        </div>
        `

            ;

        document.body.appendChild(diceGameModal);

        // JavaScript code for the 3D dice
        const dice = diceGameModal.querySelector('#dice');
        const diceContainer = diceGameModal.querySelector('#dice-container');
        const result = diceGameModal.querySelector('#result');
        const trail = diceGameModal.querySelector('#trail');
        const rollDiceButton = diceGameModal.querySelector('#rollDiceButton');
        let isDragging = false;
        let startX, startY, lastX, lastY, velocityX, velocityY;
        let rotationX = 0, rotationY = 0;
        let lastTimestamp;

        rollDiceButton.addEventListener('click', () => {
            console.log("Bouton 'Roll Dice' cliqué");

            if (!this.currentBet) {
                console.error("Erreur : this.currentBet n'est pas défini");
                return;
            }

            //  Check if the player has enough resources for the bet
            if (this.currentBet.type === 'HP') {
                if (this.currentBet.amount > window.game.hero.stats.hp) {
                    alert("You do not have enough health points for this bet!");
                    return;
                }
                // Do not deduct health points here
            } else if (this.currentBet.type === 'Gold') {
                if (this.currentBet.amount > window.game.hero.stats.gold) {
                    alert("You do not have enough gold for this bet!");
                    return;
                }

            }

            console.log(`Resources before rolling the dice: HP: ${window.game.hero.stats.hp}, Gold: ${window.game.hero.stats.gold}`);

            rollDice.call(this);
        });



        function startDrag(e) {
            e.preventDefault();
            e.stopPropagation();
            isDragging = true;
            startX = lastX = e.clientX || e.touches[0].clientX;
            startY = lastY = e.clientY || e.touches[0].clientY;
            velocityX = velocityY = 0;
            lastTimestamp = Date.now();
            dice.style.transition = 'none';
            document.body.style.cursor = 'grabbing';
        }


        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            const currentX = e.clientX || e.touches[0].clientX;
            const currentY = e.clientY || e.touches[0].clientY;
            const deltaX = currentX - lastX;
            const deltaY = currentY - lastY;
            const currentTimestamp = Date.now();
            const deltaTime = currentTimestamp - lastTimestamp;

            velocityX = deltaX / deltaTime * 10;
            velocityY = deltaY / deltaTime * 10;

            rotationY += deltaX * 1.5;
            rotationX -= deltaY * 1.5;

            updateDicePosition(currentX, currentY);
            updateDiceRotation();
            createTrailEffect(currentX, currentY);

            lastX = currentX;
            lastY = currentY;
            lastTimestamp = currentTimestamp;
        }

        dice.addEventListener('mousedown', startDrag.bind(this));
        document.addEventListener('mousemove', drag.bind(this));
        document.addEventListener('mouseup', endDrag.bind(this));
        dice.addEventListener('touchstart', startDrag.bind(this));
        document.addEventListener('touchmove', drag.bind(this));
        document.addEventListener('touchend', endDrag.bind(this));


        function endDrag() {
            if (!isDragging) return;
            isDragging = false;
            document.body.style.cursor = 'default';
        }

        function preventSelection(e) {
            e.preventDefault();
            return false;
        }

        document.addEventListener('selectstart', preventSelection);
        diceContainer.addEventListener('selectstart', preventSelection);
        dice.addEventListener('selectstart', preventSelection);
        diceContainer.addEventListener('dragstart', preventSelection);
        dice.addEventListener('dragstart', preventSelection);


        function updateDicePosition(x, y) {
            const rect = diceContainer.getBoundingClientRect();
            const left = Math.max(0, Math.min(x - rect.left - 40, rect.width - 80));
            const top = Math.max(0, Math.min(y - rect.top - 40, rect.height - 80));
            dice.style.left = `${left}px`;
            dice.style.top = `${top}px`;
        }

        function updateDiceRotation() {
            dice.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
        }

        function createTrailEffect(x, y) {
            const trailDot = document.createElement('div');
            trailDot.style.position = 'absolute';
            trailDot.style.left = `${x}px`;
            trailDot.style.top = `${y}px`;
            trailDot.style.width = '10px';
            trailDot.style.height = '10px';
            trailDot.style.borderRadius = '50%';
            trailDot.style.backgroundColor = 'rgba(52, 152, 219, 0.3)';
            trailDot.style.pointerEvents = 'none';
            trail.appendChild(trailDot);

            setTimeout(() => {
                trailDot.style.transition = 'all 0.3s';
                trailDot.style.opacity = '0';
                trailDot.style.transform = 'scale(0.3)';
                setTimeout(() => trail.removeChild(trailDot), 300);
            }, 5);
        }

        const probabilities = {
            1: 45.00,
            2: 30.00,
            3: 15.00,
            4: 6.50,
            5: 2.80,
            6: 0.70
        };


        // Declare a state variable to track if the dice is rolling
        let isRolling = false;

        function rollDice() {
            console.log("Starting the rollDice()");
            if (isRolling) return;
            isRolling = true;

            const self = this;

            // Check if currentBet is defined before continuing
            if (!self.currentBet || !self.currentBet.type || self.currentBet.amount == null) {
                console.error("Bet information not defined correctly.");
                return;
            }

            // Calculate random initial spin and movement speeds
            const initialSpeedX = Math.random() * 200 + 100; // Initial spin speed in X
            const initialSpeedY = Math.random() * 200 + 100; // Initial spin speed in Y
            const duration = 2; // Animation duration in seconds

            // Calculate the final movement
            const containerRect = diceContainer.getBoundingClientRect();
            const finalX = Math.random() * (containerRect.width - 80);
            const finalY = Math.random() * (containerRect.height - 80);

            // Use custom probabilities to determine the outcome
            const randomValue = Math.random() * 100;
            let cumulativeProbability = 0;
            let finalRoll;

            for (let i = 1; i <= 6; i++) {
                cumulativeProbability += probabilities[i];
                if (randomValue <= cumulativeProbability) {
                    finalRoll = i;
                    break;
                }
            }

            let finalRotationX, finalRotationY;
            switch (finalRoll) {
                case 1: finalRotationX = 0; finalRotationY = 0; break;
                case 2: finalRotationX = -90; finalRotationY = 0; break;
                case 3: finalRotationX = 0; finalRotationY = -90; break;
                case 4: finalRotationX = 0; finalRotationY = 90; break;
                case 5: finalRotationX = 90; finalRotationY = 0; break;
                case 6: finalRotationX = 180; finalRotationY = 0; break;
            }

            finalRotationX += Math.floor(Math.random() * 4 + 4) * 360;
            finalRotationY += Math.floor(Math.random() * 4 + 4) * 360;

            dice.classList.add('rolling');
            dice.style.transition = `transform ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1), left ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1), top ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1)`;

            dice.style.transform = `rotateX(${initialSpeedX}deg) rotateY(${initialSpeedY}deg)`;
            dice.style.left = `${Math.random() * (containerRect.width - 80)}px`;
            dice.style.top = `${Math.random() * (containerRect.height - 80)}px`;

            setTimeout(() => {
                dice.style.transform = `rotateX(${finalRotationX}deg) rotateY(${finalRotationY}deg)`;
                dice.style.left = `${finalX}px`;
                dice.style.top = `${finalY}px`;

                setTimeout(() => {
                    dice.classList.remove('rolling');
                    result.innerHTML = `<span class="glowing-result">${finalRoll}</span>!`;
                    result.style.animation = 'pulse 0.5s ease-in-out';

                    setTimeout(() => {
                        result.style.animation = 'none';
                        if (self.currentBet && self.currentBet.type && self.currentBet.amount != null) {
                            console.log("Sending 'diceResult' event");
                            document.dispatchEvent(new CustomEvent('diceResult', {
                                detail: {
                                    result: finalRoll,
                                    betType: self.currentBet.type,
                                    betAmount: self.currentBet.amount
                                }
                            }));
                        } else {
                            console.error("Bet information not defined correctly.");
                        }
                        isRolling = false;
                        console.log("Rolling state reset");
                    }, 500);
                }, duration * 1000);
            }, 100);


            document.addEventListener('diceResult', (event) => {
                console.log("Écouteur 'diceResult' déclenché", event.detail);
                const { result, betType, betAmount } = event.detail;
                if (betType && betAmount != null) {
                    console.log("Call of this.resolveBet()");
                    this.resolveBet(betType, betAmount, result);
                } else {
                    console.error("Invalid bet information received in diceResult event.");
                }
            }, { once: true });
        }


        dice.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        dice.addEventListener('touchstart', startDrag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('touchend', endDrag);
        diceGameModal.querySelector('#closeDiceGame').addEventListener('click', () => {
            document.body.removeChild(diceGameModal);
            dice.removeEventListener('mousedown', startDrag);
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', endDrag);
            dice.removeEventListener('touchstart', startDrag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('touchend', endDrag);
            document.removeEventListener('selectstart', preventSelection);
            diceContainer.removeEventListener('selectstart', preventSelection);
            dice.removeEventListener('selectstart', preventSelection);
            diceContainer.removeEventListener('dragstart', preventSelection);
            dice.removeEventListener('dragstart', preventSelection);
        });
    },


    prayAtStatue(hero) {
        const modal = document.createElement('div');
        this.setupModal(modal, "Pray the Statue");

        modal.innerHTML = `
                <h2>Pray the Statue</h2>
                <p>You can pray to the ancient gods and seek their favor.</p>
                <button id="gainXp">Pray</button>
                <button id="closeModal">Cancel</button>
            `;

        modal.querySelector('#gainXp').addEventListener('click', () => {
            const xpGain = Math.floor(hero.xpToNextLevel * 0.2);
            hero.gainXP(xpGain);

            // Create a new modal to display the result
            const resultModal = document.createElement('div');
            this.setupModal(resultModal, "Prayer Result");

            let resultMessage = `<p>You gained ${xpGain} XP!</p>`;

            if (Math.random() < 0.05) {
                this.unlockSpecialSpell(hero);
                resultMessage += `<p>You have unlocked the special spell 'Arcane Aegis'!</p>`;
            }

            resultModal.innerHTML = `
                    <h2>Prayer Result</h2>
                    ${resultMessage}
                    <button id="closeResultModal">Close</button>
                `;

            resultModal.querySelector('#closeResultModal').addEventListener('click', () => {
                document.body.removeChild(resultModal);
            });

            document.body.appendChild(resultModal);
            document.body.removeChild(modal);
        });

        modal.querySelector('#closeModal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.body.appendChild(modal);
    },


    absorbPower(hero, dungeon, game) {
        const modal = document.createElement('div');
        this.setupModal(modal, "Absorb the Statue's Power");

        modal.innerHTML = `
                <h2>Absorb the Power</h2>
                <p>50% chance to enhance your weapon, otherwise fight a guardian.</p>
                <button id="absorb">Absorb</button>
                <button id="closeModal">Cancel</button>
            `;

        modal.querySelector('#absorb').addEventListener('click', () => {
            const success = Math.random() < 0.7;
            if (success) {
                if (hero.currentWeapon) {
                    let weapon = typeof hero.currentWeapon === 'string' ? ITEMS[hero.currentWeapon] : hero.currentWeapon;
                    if (weapon && typeof weapon === 'object' && weapon.attackBoost) {
                        weapon.attackBoost += Math.floor(weapon.attackBoost * 0.1);
                        alert("Your weapon has been enhanced!");
                    } else {
                        alert("Cannot enhance weapon. No weapon equipped.");
                    }
                } else {
                    alert("You have no weapon equipped to absorb the power.");
                }
            } else {
                const heroLevel = hero.level || 1;
                try {
                    const guardian = new Enemy(hero.x, hero.y, 'statueguardian', heroLevel);
                    window.game.startCombat(guardian); // Use window.game to access the global instance
                } catch (error) {
                    console.error("Error creating the guardian:", error);
                    alert("Error starting the combat. Please try again.");
                }
            }
            document.body.removeChild(modal);
        });

        modal.querySelector('#closeModal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.body.appendChild(modal);
    },


    destroyStatue(hero) {
        const modal = document.createElement('div');
        this.setupModal(modal, "Destroy the Statue");

        modal.innerHTML = `
            <h2>Destroy the Statue</h2>
            <p>Gain between 100 and 200 gold coins but lose 10% of your max HP.</p>
            <button id="destroy">Destroy</button>
            <button id="closeModal">Cancel</button>
        `;

        modal.querySelector('#destroy').addEventListener('click', () => {
            const goldGain = Math.floor(Math.random() * 100) + 100;
            hero.addGold(goldGain);
            hero.stats.maxHp = Math.floor(hero.stats.maxHp * 0.9);
            hero.stats.hp = Math.min(hero.stats.hp, hero.stats.maxHp);

            // Create a result modal for the destroy action
            const resultModal = document.createElement('div');
            this.setupModal(resultModal, "Destruction Result");

            resultModal.innerHTML = `
                <h2>Destruction Result</h2>
                <p>You destroyed the statue and gained ${goldGain} gold coins, but lost 10% of your max HP.</p>
                <button id="closeResultModal">Close</button>
            `;

            resultModal.querySelector('#closeResultModal').addEventListener('click', () => {
                document.body.removeChild(resultModal);
            });

            document.body.removeChild(modal);
            document.body.appendChild(resultModal);
        });

        modal.querySelector('#closeModal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.body.appendChild(modal);
    },


    setupModal(modal, title) {
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.maxWidth = '600px';
        modal.style.width = '90%';
        modal.style.maxHeight = '80vh';
        modal.style.zIndex = '10000000000';
        modal.style.backgroundColor = 'rgba(32, 34, 37, 0.95)';
        modal.style.border = '2px solid var(--border-color)';
        modal.style.borderRadius = '15px';
        modal.style.padding = '20px';
        modal.style.boxShadow = `
                0 0 20px rgba(184, 134, 11, 0.3),
                inset 0 0 15px rgba(22, 22, 20, 0.5),
                0 0 50px rgba(31, 20, 16, 0.7)`;
        modal.style.backgroundBlendMode = 'overlay, overlay, normal';
        modal.style.overflow = 'hidden';
        modal.style.display = 'flex';
        modal.style.flexDirection = 'column';
        modal.style.alignItems = 'center';
        modal.innerHTML = `<h2>${title}</h2>`;
    },

    unlockSpecialSpell(hero) {
        if (!hero.spells.includes('arcaneAegis')) { // Avoid duplicates
            hero.spells.push('arcaneAegis'); // Add spell key, not object
        }
    }



}