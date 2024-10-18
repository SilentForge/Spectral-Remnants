class Hero {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 100;
        this.stats = {
            maxHp: 100,
            hp: 100,
            attack: 5,
            defense: 5,
            maxMana: 50,
            mana: 50,
            gold: 100,
            critChance: 5,  // Critical blow in percentage
            critDamage: 1.5  // Damage multiplier for critical blows
        };
        this.spells = ['arcanespark'];  // Adding the basic spell
        this.buffs = [];  // Initialize Buffs Array

        this.inventory = {};  // Change from Array to Object to Handle Stacks
        this.maxInventorySlots = 20; // Define the maximum number of inventory slots
        this.element = document.getElementById('hero');
        this.currentWeapon = null;
        this.currentArmor = null;
        this.currentArtifacts = [null, null, null];  // Three artifact slots
    }


    // Calculation of damage after reduction by defense
    calculateDamageAfterDefense(baseDamage, defense) {
        const defenseMultiplier = 2; // Can stay at 2
        const baseConstant = 80; // Decreases from 100 to 80
        return baseDamage * (baseConstant / (baseConstant + (defense * defenseMultiplier)));
    }


    addItemToInventory(itemKey) {
        if (!ITEMS[itemKey]) {
            console.error(`Item with key ${itemKey} does not exist in ITEMS.`);
            return;
        }

        const item = ITEMS[itemKey];
        console.log(`Attempting to add item: ${item.name}`);

        // Check if the inventory has space available before adding an object
        if (!this.hasInventorySpace()) {
            this.handleFullInventory(itemKey);
            return;
        }

        if (this.inventory[itemKey]) {
            this.inventory[itemKey].quantity++;
        } else {
            this.inventory[itemKey] = { key: itemKey, quantity: 1 };
        }
    }


    handleFullInventory(newItemKey) {
        const newItem = ITEMS[newItemKey];
        console.log(`Your inventory is full. You need to replace an item to add ${newItem.name}.`);
        // Call a method to open the replacement interface
        game.promptItemReplacement(newItemKey);
    }

    replaceItemInInventory(newItemKey) {
        const itemToReplace = prompt("Which item would you like to replace? Enter the name of the item or its index.");

        const itemKey = Object.keys(this.inventory).find(key => ITEMS[key].name.toLowerCase() === itemToReplace.toLowerCase());

        if (itemKey) {
            delete this.inventory[itemKey];
            this.inventory[newItemKey] = { key: newItemKey, quantity: 1 };
            console.log(`You replaced ${ITEMS[itemKey].name} with ${ITEMS[newItemKey].name}.`);
        } else {
            console.log("The specified item was not found in the inventory.");
        }
    }

    removeItemFromInventory(itemKey) {
        if (!this.inventory[itemKey]) {
            console.error(`Item with key ${itemKey} does not exist in the inventory.`);
            return;
        }

        if (this.inventory[itemKey].quantity > 1) {
            this.inventory[itemKey].quantity--;
        } else {
            delete this.inventory[itemKey];
        }

        console.log(`The item ${ITEMS[itemKey].name} has been thrown away.`);
    }



    hasInventorySpace() {
        // Count the number of slots used taking into account the quantity of each item
        let usedSlots = 0;
        for (const itemKey in this.inventory) {
            const item = ITEMS[itemKey];
            if (item.type === 'weapon' || item.type === 'armor' || item.type === 'artifact') {
                usedSlots += this.inventory[itemKey].quantity;
            } else {
                usedSlots++;
            }
        }
        return usedSlots < this.maxInventorySlots;
    }

    setStartPosition(startPos) {
        this.x = startPos.x;
        this.y = startPos.y;
        this.updatePosition();
    }

    updatePosition() {
        if (this.element) {
            this.element.style.left = `${this.x * CONFIG.TILE_SIZE}px`;
            this.element.style.top = `${this.y * CONFIG.TILE_SIZE}px`;
        }
    }

    move(dx, dy, dungeon) {
        const newX = this.x + dx;
        const newY = this.y + dy;
        if (newX >= 0 && newX < CONFIG.MAP_WIDTH && newY >= 0 && newY < CONFIG.MAP_HEIGHT) {
            const newTile = dungeon.getTileAt(newX, newY);
            if (newTile !== 'wall') {
                this.x = newX;
                this.y = newY;
                this.updatePosition();
                return newTile === 'exit';
            }
        }
        return false;
    }

    gainXP(amount) {
        this.xp += amount;
        if (this.xp >= this.xpToNextLevel) {
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        this.xp -= this.xpToNextLevel;
        this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5);

        this.stats.maxHp += 20;
        this.stats.hp = this.stats.maxHp;
        this.stats.attack += 2;
        this.stats.defense += 1;
        this.stats.maxMana += 10;
        this.stats.critChance += 0.5;  // Slightly increases the chance of critical blow at each level
        this.stats.mana = this.stats.maxMana;

        this.checkNewSpells();
    }

    checkNewSpells() {
        for (const [spellKey, spell] of Object.entries(SPELLS)) {
            if (spell.levelRequired === this.level && !this.spells.includes(spellKey)) {
                this.spells.push(spellKey);
            }
        }
    }

    attack(enemy) {
        let baseDamage = this.stats.attack;
        let isCritical = false;

        // Calcital damage calculation
        if (Math.random() * 100 < this.stats.critChance) {
            baseDamage = Math.floor(baseDamage * this.stats.critDamage);
            isCritical = true;
        }

        // Apply the reduction of damage according to the defense of the enemy
        const finalDamage = this.calculateDamageAfterDefense(baseDamage, enemy.stats.defense);

        enemy.takeDamage(Math.ceil(finalDamage)); // Round the final damage
        return { damage: Math.ceil(finalDamage), isCritical };
    }

    castSpell(spellKey, enemy) {
        const spell = SPELLS[spellKey];
        if (this.stats.mana >= spell.manaCost) {
            this.stats.mana -= spell.manaCost;
            const damage = enemy.takeDamage(spell.damage);
            return { success: true, damage, message: `You cast ${spell.name}!` };
        } else {
            return { success: false, message: "Not enough mana to cast this spell." };
        }
    }


    // Method to add a buff
    addBuff(buff) {
        this.buffs.push(buff);
        if (buff.applyEffect) buff.applyEffect(); // Initial application Effect when Buff is added
        console.log(`Buff added: ${buff.name}`);

        // Set a timer or condition to remove the buff after its duration
        setTimeout(() => {
            this.removeBuff(buff);
        }, buff.duration * 1000); // Example: duration is in seconds
    }

    removeBuff(buff) {
        // Remove the Buff and End its Effect If Needed
        const index = this.buffs.indexOf(buff);
        if (index !== -1) {
            this.buffs.splice(index, 1);
            if (buff.endEffect) buff.endEffect();  // End The Buff's Effect
            console.log(`Buff removed: ${buff.name}`);
        }
    }

    reduceDamage(factor) {
        // Implement Damage Reduction Logic
        console.log(`Damage reduced by ${factor * 100}%`);
    }

    counterAttack(factor) {
        // Implement Counter-Attack Logic
        console.log(`Counter-attacking with ${factor * 100}% of the damage.`);
    }

    getAvailableSpells() {
        return this.spells.map(spellKey => SPELLS[spellKey]).filter(spell => spell); // Filter Out Any Undefined Spells
    }

    // New method for adding gold
    addGold(amount) {
        this.stats.gold += amount;
        console.log(`You gained ${amount} gold. Total gold: ${this.stats.gold}.`);
    }

    getStats() {
        return {
            level: this.level,
            xp: this.xp,
            xpToNextLevel: this.xpToNextLevel,
            ...this.stats,
            critChance: this.stats.critChance.toFixed(1) + '%',
            critDamage: (this.stats.critDamage * 100 - 100).toFixed(0) + '%'
        };
    }

    equipWeapon(itemKey) {
        const newWeapon = itemKey ? ITEMS[itemKey] : null;

        if (this.currentWeapon) {
            const oldWeapon = this.currentWeapon;
            const oldWeaponData = ITEMS[oldWeapon];

            // Remove the bonuses from the old weapon
            this.stats.attack -= oldWeaponData.attackBoost;
            this.stats.critChance -= oldWeaponData.critChanceBoost || 0;
            this.stats.defense -= oldWeaponData.defenseBoost || 0;

            if (newWeapon) {
                if (this.inventory[oldWeapon]) {
                    this.inventory[oldWeapon].quantity++;
                } else {
                    this.inventory[oldWeapon] = { quantity: 1 };
                }
            }

        }

        this.currentWeapon = itemKey;
        if (newWeapon) {
            this.stats.attack += newWeapon.attackBoost;
            this.stats.critChance += newWeapon.critChanceBoost || 0;
            this.stats.defense += newWeapon.defenseBoost || 0;

            // Remove a copy from the new weapon of inventory
            this.inventory[itemKey].quantity--;
            if (this.inventory[itemKey].quantity <= 0) {
                delete this.inventory[itemKey];
            }
        }

        return newWeapon ? `You equipped ${newWeapon.name}.` : 'Weapon unequipped';
    }


    equipArmor(itemKey) {
        const newArmor = itemKey ? ITEMS[itemKey] : null;

        if (this.currentArmor) {
            const oldArmor = this.currentArmor;
            const oldArmorData = ITEMS[oldArmor];

            // Remove the bonuses from the old armor
            this.stats.defense -= oldArmorData.defenseBoost;
            this.stats.maxHp -= oldArmorData.hpBoost || 0;
            this.stats.critResistance -= oldArmorData.critResistanceBoost || 0;

            if (newArmor) {
                if (this.inventory[oldArmor]) {
                    this.inventory[oldArmor].quantity++;
                } else {
                    this.inventory[oldArmor] = { quantity: 1 };
                }
            }

        }

        this.currentArmor = itemKey;
        if (newArmor) {
            this.stats.defense += newArmor.defenseBoost;
            this.stats.critResistance += newArmor.critResistanceBoost || 0;
            if (newArmor.hpBoost) {
                this.stats.maxHp += newArmor.hpBoost;
                this.stats.hp = Math.min(this.stats.hp + newArmor.hpBoost, this.stats.maxHp);
            }

            // Remove a copy from the new armor from the inventory
            this.inventory[itemKey].quantity--;
            if (this.inventory[itemKey].quantity <= 0) {
                delete this.inventory[itemKey];
            }
        }

        return newArmor ? `You equipped ${newArmor.name}.` : 'Armor unequipped';
    }
    equipArtifact(itemKey) {
        const newArtifact = itemKey ? ITEMS[itemKey] : null;

        // Look for an empty slot to equip the artifact
        let emptySlot = this.currentArtifacts.findIndex(slot => slot === null);

        if (emptySlot === -1) {
            // If no slot is empty, use the first slot (index 0) for the swap
            emptySlot = 0;
        }

        const oldArtifact = this.currentArtifacts[emptySlot];

        if (oldArtifact) {
            const oldArtifactData = ITEMS[oldArtifact];
            // Remove the effects of the old artefact
            this.removeArtifactEffects(oldArtifactData);

            // Add the old artefact to the inventory
            if (this.inventory[oldArtifact]) {
                this.inventory[oldArtifact].quantity++;
            } else {
                this.inventory[oldArtifact] = { quantity: 1 };
            }
        }

        this.currentArtifacts[emptySlot] = itemKey;

        if (newArtifact) {
            // Apply the effects of the new artefact
            this.applyArtifactEffects(newArtifact);

            // Remove a copy from the new inventory artifact
            this.inventory[itemKey].quantity--;
            if (this.inventory[itemKey].quantity <= 0) {
                delete this.inventory[itemKey];
            }
        }

        return newArtifact
            ? `You equipped ${newArtifact.name} in slot ${emptySlot + 1}.`
            : `Artifact unequipped from slot ${emptySlot + 1}.`;
    }

    removeArtifactEffects(artifact) {
        // Logic to withdraw the effects of the artifact
        switch (artifact.effect) {
            case 'boostCritChance':
                this.stats.critChance -= artifact.value;
                break;
            case 'boostDefense':
                this.stats.defense -= artifact.value;
                break;
            case 'boostStunChance':
                this.stats.stunChance -= artifact.value;
                break;
            case 'reduceEnemyAttack':
                this.stats.reduceEnemyAttack -= artifact.value;
                break;
            case 'boostCritDamage':
                this.stats.critDamage -= artifact.value;
                break;
            case 'boostPoisonDamage':
                this.stats.poisonDamage -= artifact.value;
                break;
            case 'boostMaxMana':
                this.stats.maxMana -= artifact.value;
                this.stats.mana = Math.min(this.stats.mana, this.stats.maxMana); // Make sure the current mana does not exceed the maximum
                break;
            case 'boostMaxHp':
                this.stats.maxHp -= artifact.value;
                this.stats.hp = Math.min(this.stats.hp, this.stats.maxHp); // Make sure that current PVs do not exceed the maximum
                break;
            case 'reduceDamageTaken':
                this.stats.reduceDamageTaken -= artifact.value;
                break;
            case 'boostManaRegen':
                this.stats.manaRegen -= artifact.value;
                break;
            // Add other cases here for additional effects ...
        }
        // Add other effects here
    }

    applyArtifactEffects(artifact) {
        // Logic to apply the effects of artifact
        switch (artifact.effect) {
            case 'boostCritChance':
                this.stats.critChance += artifact.value;
                break;
            case 'boostDefense':
                this.stats.defense += artifact.value;
                break;
            case 'boostStunChance':
                this.stats.stunChance = (this.stats.stunChance || 0) + artifact.value;
                break;
            case 'reduceEnemyAttack':
                this.stats.reduceEnemyAttack = (this.stats.reduceEnemyAttack || 0) + artifact.value;
                break;
            case 'boostCritDamage':
                this.stats.critDamage += artifact.value;
                break;
            case 'boostPoisonDamage':
                this.stats.poisonDamage = (this.stats.poisonDamage || 0) + artifact.value;
                break;
            case 'boostMaxMana':
                this.stats.maxMana += artifact.value;
                this.stats.mana += artifact.value; // Also add to the current mana
                break;
            case 'boostMaxHp':
                this.stats.maxHp += artifact.value;
                this.stats.hp += artifact.value; // Also add to current PVs
                break;
            case 'reduceDamageTaken':
                this.stats.reduceDamageTaken = (this.stats.reduceDamageTaken || 0) + artifact.value;
                break;
            case 'boostManaRegen':
                this.stats.manaRegen = (this.stats.manaRegen || 0) + artifact.value;
                break;
            // Add other cases here for additional effects ...
        }
    }

    showArtifacts() {
        for (let i = 0; i < this.currentArtifacts.length; i++) {
            const artifact = this.currentArtifacts[i] ? ITEMS[this.currentArtifacts[i]] : null;
            if (artifact) {
                console.log(`Slot ${i + 1}: ${artifact.name}`);
            } else {
                console.log(`Slot ${i + 1}: Vide`);
            }
        }
    }

    useItem(itemKey) {
        if (!this.inCombat) {
            console.warn("Attempting to use an item out of combat.");
            return;
        }

        if (this.hero.inventory[itemKey] && this.hero.inventory[itemKey].quantity > 0) {
            const item = ITEMS[itemKey];

            if (item.type === 'consumable') {
                // Apply Item Effects
                if (item.effect === 'heal') {
                    this.hero.stats.hp = Math.min(this.hero.stats.maxHp, this.hero.stats.hp + item.value);
                    this.showMessage(`You used a ${item.name}. HP restored by ${item.value}.`);
                } else if (item.effect === 'restoreMana') {
                    this.hero.stats.mana = Math.min(this.hero.stats.maxMana, this.hero.stats.mana + item.value);
                    this.showMessage(`You used a ${item.name}. Mana restored by ${item.value}.`);
                }

                // Reduce Item Quantity and Remove If Zero
                this.hero.inventory[itemKey].quantity--;
                if (this.hero.inventory[itemKey].quantity <= 0) {
                    delete this.hero.inventory[itemKey];  // Deletes the object if the quantity falls to 0
                }

                // Interface update after using the object
                this.updateCombatUI();

                // Disable actions to prevent spam
                this.disableCombatActions();

                // Trigger the enemy's attack after using the object
                setTimeout(() => {
                    if (this.currentEnemy && this.currentEnemy.stats.hp > 0) {
                        this.enemyAttack();
                    }
                    this.enableCombatActions(); // Reactivate actions after the enemy attack
                }, 500); // Wait a short time before the enemy attack

            } else if (item.type === 'spell') {
                // Learn a New Spell
                if (!this.hero.spells.includes(item.spell)) {
                    this.hero.spells.push(item.spell);
                    this.showMessage(`You learned a new spell: ${SPELLS[item.spell].name}!`);
                    delete this.hero.inventory[itemKey];  // Remove the object once used
                } else {
                    this.showMessage(`You already know the spell: ${SPELLS[item.spell].name}.`);
                }
            }

            // Updating statistics and inventory
            this.updateStatsDisplay();
            this.showInventory();
        } else {
            this.showMessage("Item not available or insufficient quantity.");
        }
    }
}