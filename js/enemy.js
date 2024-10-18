class Enemy {
    constructor(x, y, type, heroLevel, inventory = null) {
        console.log(`Creating enemy of type: ${type} at (${x}, ${y}) with heroLevel: ${heroLevel}`);
        this.x = x;
        this.y = y;
        this.type = type;
        this.stats = this.getInitialStats(type, heroLevel);
        this.inventory = inventory;
        this.element = this.createEnemyElement();
        this.debuffs = [];
    }

    addDebuff(name, effect) {
        this.debuffs.push({ name, ...effect });
    }

    removeDebuff(name) {
        this.debuffs = this.debuffs.filter(debuff => debuff.name !== name);
    }

    isStunned() {
        return this.debuffs.some(debuff => debuff.name === 'Stunned');
    }

    updateDebuffs() {
        // Reduce the remaining turns for each debuff
        this.debuffs.forEach(debuff => {
            if (debuff.turns) debuff.turns--;
        });
        // Remove debuffs that have no remaining turns
        this.debuffs = this.debuffs.filter(debuff => debuff.turns > 0);
    }

    getInitialStats(type, heroLevel) {
        const baseStats = ENEMY_TYPES[type]; // Direct access without JSON parsing
        if (!baseStats) {
            console.error(`Unknown enemy type: ${type}.`);
            return {}; // Return an empty object to avoid errors
        }

        console.log(`Base stats for ${type}:`, baseStats);

        if (typeof heroLevel !== 'number' || heroLevel < 1) {
            console.warn(`Invalid heroLevel: ${heroLevel}. Defaulting to 1.`);
            heroLevel = 1;
        }

        const difficultyMultiplier = 1 + (heroLevel - 1) * 0.2;

        // Create a deep copy of the base stats to avoid modifying the shared object
        const statsCopy = {
            hp: Math.floor(baseStats.hp * difficultyMultiplier) || baseStats.hp,
            maxHp: Math.floor(baseStats.hp * difficultyMultiplier) || baseStats.hp, //  maxHp is calculated here
            attack: Math.floor(baseStats.attack * difficultyMultiplier) || baseStats.attack,
            defense: Math.floor(baseStats.defense * difficultyMultiplier) || baseStats.defense,
            xp: Math.floor(baseStats.xp * difficultyMultiplier),
            gold: Math.floor(baseStats.gold * difficultyMultiplier),
            drops: baseStats.drops ? JSON.parse(JSON.stringify(baseStats.drops)) : [], //  Deep copy of the drops
            spawnChance: baseStats.spawnChance
        };

        console.log(`Final stats for ${type} after applying heroLevel multiplier:`, statsCopy);

        return statsCopy;
    }


    createEnemyElement() {
        const element = document.createElement('div');
        element.className = `enemy ${this.type}`;
        element.style.left = `${this.x * CONFIG.TILE_SIZE}px`;
        element.style.top = `${this.y * CONFIG.TILE_SIZE}px`;
        return element;
    }

    takeDamage(amount) {
        this.stats.hp -= amount;
        console.log(`${this.type} took ${amount} damage. HP remaining: ${this.stats.hp}`);
        return this.stats.hp <= 0;
    }

    attack() {
        return this.stats.attack;
    }

    dropItems(hero) {
        const droppedItems = [];

        if (this.stats.gold) {
            hero.addGold(this.stats.gold);
            game.showMessage(`You found ${this.stats.gold} gold on the enemy!`);
        }

        const drops = this.stats.drops || [];
        drops.forEach(drop => {
            if (Math.random() * 100 < drop.chance) {
                const itemKey = drop.item;
                droppedItems.push(itemKey);
            }
        });

        return droppedItems;
    }

    interact(hero) {
        if (this.type === 'merchant') {
            game.interactWithMerchant(this);
        } else {
            game.startCombat(this);
        }
    }
}

const ENEMY_TYPES = {
    goblin: {
        hp: 25,
        attack: 5,
        defense: 2,
        xp: 8,
        minLevel: 1,
        gold: 7,
        drops: [
            { item: 'healthPotion', chance: 12 },
            { item: 'fireScroll', chance: 0.05 },
            { item: 'basicarmor', chance: 5 },
            { item: 'basicSword', chance: 3 },
            { item: 'ironSword', chance: 0.2 }
        ],
        spawnChance: 30
    },
    orc: {
        hp: 40,
        attack: 9,
        defense: 4,
        xp: 15,
        minLevel: 3,
        gold: 13,
        drops: [
            { item: 'healthPotion', chance: 9 },
            { item: 'basicSword', chance: 3 },
            { item: 'lightningScroll', chance: 0.3 },
            { item: 'ironarmor', chance: 2 },
            { item: 'earthScroll', chance: 0.5 },
            { item: 'greaterHealthPotion', chance: 3 }
        ],
        spawnChance: 25
    },

    shadowThief: {
        hp: 35,
        attack: 12,
        defense: 4,
        xp: 17,
        minLevel: 5,
        gold: 25,
        drops: [
            { item: 'thief Daggers', chance: 5 },
            { item: 'assassinVest', chance: 3 },
            { item: 'shadowstrikeGarb', chance: 1 },
            { item: 'lightningTalisman', chance: 1 },
            { item: 'manaCrystal', chance: 2 },
            { item: 'poisonScroll', chance: 2 },
            { item: 'manaPotion', chance: 10 }
        ],
        spawnChance: 15
    },


    twilightKnight: {
        hp: 55,
        attack: 18,
        defense: 10,
        xp: 30,
        minLevel: 7,
        gold: 40,
        drops: [
            { item: 'twilightClaymore', chance: 2 },
            { item: 'ironclad Bulwark', chance: 1 },
            { item: 'steelSword', chance: 5 },
            { item: 'greaterHealthPotion', chance: 8 },
            { item: 'windScroll', chance: 3 }
        ],
        spawnChance: 10
    },
    voidWalker: {
        hp: 75,
        attack: 22,
        defense: 8,
        xp: 60,
        minLevel: 9,
        gold: 60,
        drops: [
            { item: 'voidharbinger', chance: 0.5 },
            { item: 'umbralWeave', chance: 2 },
            { item: 'mysticBlade', chance: 3 },
            { item: 'superiorManaPotion', chance: 5 },
            { item: 'scrollOfWisdom', chance: 0.2 }
        ],
        spawnChance: 5
    },
    berserkerChampion: {
        hp: 60,
        attack: 25,
        defense: 5,
        xp: 45,
        minLevel: 8,
        gold: 45,
        drops: [
            { item: 'ravagersCleaver', chance: 2 },
            { item: 'bloodfury Cuirass', chance: 1 },
            { item: 'warriorAxe', chance: 5 },
            { item: 'superiorHealthPotion', chance: 8 },
            { item: 'fireScroll', chance: 3 }
        ],
        spawnChance: 8
    },
    celestialGuardian: {
        hp: 100,
        attack: 20,
        defense: 20,
        xp: 70,
        minLevel: 10,
        gold: 80,
        drops: [
            { item: 'celestialWardplate', chance: 1 },
            { item: 'bulwarkMaul', chance: 2 },
            { item: 'guardianPlate', chance: 3 },
            { item: 'elixirOfVitality', chance: 5 },
            { item: 'healingScroll', chance: 8 }
        ],
        spawnChance: 3
    },
    windDancer: {
        hp: 35,
        attack: 15,
        defense: 6,
        xp: 25,
        minLevel: 6,
        gold: 35,
        drops: [
            { item: 'whisperwind', chance: 2 },
            { item: 'shadowstrikeGarb', chance: 1.5 },
            { item: 'windScroll', chance: 5 },
            { item: 'greaterManaPotion', chance: 8 },
            { item: 'silvertongue', chance: 1 }
        ],
        spawnChance: 12
    },
    spellbladeAssassin: {
        hp: 55,
        attack: 20,
        defense: 7,
        xp: 30,
        minLevel: 7,
        gold: 40,
        drops: [
            { item: 'silvertongue', chance: 2 },
            { item: "spellwarden'sVestments", chance: 1.5 },
            { item: 'mysticBlade', chance: 3 },
            { item: 'lightningScroll', chance: 5 },
            { item: 'superiorManaPotion', chance: 8 }
        ],
        spawnChance: 10
    },
    cursedRevenant: {
        hp: 70,
        attack: 18,
        defense: 12,
        xp: 40,
        minLevel: 8,
        gold: 50,
        drops: [
            { item: 'voidharbinger', chance: 0.5 },
            { item: 'umbralWeave', chance: 2 },
            { item: 'poisonScroll', chance: 5 },
            { item: 'superiorHealthPotion', chance: 8 },
            { item: 'twilightClaymore', chance: 1.5 }
        ],
        spawnChance: 7
    },

    ironcladJuggernaut: {
        hp: 140,
        attack: 12,
        defense: 17,
        xp: 60,
        minLevel: 9,
        gold: 70,
        drops: [
            { item: 'ironclad Bulwark', chance: 2 },
            { item: 'bulwarkMaul', chance: 1.5 },
            { item: 'steelShield', chance: 5 },
            { item: 'earthScroll', chance: 3 },
            { item: 'elixirOfVitality', chance: 2 }
        ],
        spawnChance: 5
    },
    shadowWeaver: {
        hp: 40,
        attack: 22,
        defense: 5,
        xp: 40,
        minLevel: 7,
        gold: 45,
        drops: [
            { item: 'umbralWeave', chance: 2 },
            { item: 'shadowstrikeGarb', chance: 1.5 },
            { item: 'poisonScroll', chance: 5 },
            { item: 'greaterManaPotion', chance: 8 },
            { item: 'thief Daggers', chance: 3 }
        ],
        spawnChance: 9
    },
    bloodfuryBerserker: {
        hp: 45,
        attack: 28,
        defense: 3,
        xp: 30,
        minLevel: 8,
        gold: 55,
        drops: [
            { item: 'bloodfury Cuirass', chance: 1 },
            { item: 'ravagersCleaver', chance: 2 },
            { item: 'warriorAxe', chance: 5 },
            { item: 'fireScroll', chance: 3 },
            { item: 'superiorHealthPotion', chance: 8 }
        ],
        spawnChance: 7
    },
    etherealArcher: {
        hp: 35,
        attack: 20,
        defense: 6,
        xp: 30,
        minLevel: 6,
        gold: 40,
        drops: [
            { item: 'whisperwind', chance: 2 },
            { item: 'umbralWeave', chance: 1.5 },
            { item: 'windScroll', chance: 5 },
            { item: 'iceScroll', chance: 3 },
            { item: 'greaterManaPotion', chance: 8 }
        ],
        spawnChance: 11
    },
    voidTyrant: {
        hp: 150,
        attack: 30,
        defense: 15,
        xp: 80,
        minLevel: 10,
        gold: 100,
        drops: [
            { item: 'voidharbinger', chance: 1 },
            { item: 'celestialWardplate', chance: 0.5 },
            { item: 'scrollOfWisdom', chance: 2 },
            { item: 'elixirOfVitality', chance: 5 },
            { item: 'swordOfFortitude', chance: 0.3 }
        ],
        spawnChance: 2
    },
    twilightSorcerer: {
        hp: 70,
        attack: 25,
        defense: 8,
        xp: 40,
        minLevel: 8,
        gold: 50,
        drops: [
            { item: "spellwarden'sVestments", chance: 2 },
            { item: 'silvertongue', chance: 1.5 },
            { item: 'mysticBlade', chance: 3 },
            { item: 'superiorManaPotion', chance: 8 },
            { item: 'scrollOfWisdom', chance: 1 }
        ],
        spawnChance: 8
    },
    shadowstrikeNinja: {
        hp: 50,
        attack: 30,
        defense: 5,
        xp: 30,
        minLevel: 7,
        gold: 45,
        drops: [
            { item: 'shadowstrikeGarb', chance: 2 },
            { item: 'thief Daggers', chance: 3 },
            { item: 'poisonScroll', chance: 5 },
            { item: 'windScroll', chance: 3 },
            { item: 'greaterHealthPotion', chance: 8 }
        ],
        spawnChance: 10
    },

    troll: {
        hp: 60,
        attack: 14,
        defense: 6,
        xp: 25,
        minLevel: 5,
        gold: 15,
        drops: [
            { item: 'healthPotion', chance: 15 },
            { item: 'shield', chance: 5 },
            { item: 'manaPotion', chance: 3 },
            { item: 'earthScroll', chance: 0.2 },
            { item: 'ironShield', chance: 2 },
            { item: 'bulwarkMaul', chance: 0.5 }
        ],
        spawnChance: 20
    },

    dragon: {
        hp: 300,
        attack: 25,
        defense: 15,
        xp: 100,
        minLevel: 10,
        gold: 100,
        drops: [
            { item: 'fireScroll', chance: 20 },
            { item: 'lightningScroll', chance: 5 },
            { item: 'poisonScroll', chance: 5 },
            { item: 'swordOfFortitude', chance: 1 },
            { item: 'guardianPlate', chance: 1 },
            { item: 'voidharbinger', chance: 0.5 }
        ],
        spawnChance: 2
    },

    skeleton: {
        hp: 40,
        attack: 7,
        defense: 3,
        xp: 10,
        minLevel: 2,
        gold: 8,
        drops: [
            { item: 'manaPotion', chance: 4 },
            { item: 'healthPotion', chance: 10 },
            { item: 'iceScroll', chance: 0.2 },
            { item: 'greaterManaPotion', chance: 2 }
        ],
        spawnChance: 20
    },
    rat: {
        hp: 15,
        attack: 3,
        defense: 0,
        xp: 4,
        minLevel: 1,
        gold: 4,
        drops: [
            { item: 'healthPotion', chance: 9 },
            { item: 'manaPotion', chance: 1 }
        ],
        spawnChance: 35
    }
    ,

    rat1: {
        hp: 20,
        attack: 3,
        defense: 0,
        xp: 5,
        minLevel: 1,
        gold: 4,
        drops: [
            { item: 'healthPotion', chance: 90 },
            { item: 'manaPotion', chance: 90 },
            { item: 'fireScroll', chance: 80 },
            { item: 'lightningScroll', chance: 90 },
            { item: 'iceScroll', chance: 80 },
            { item: 'earthScroll', chance: 90 },
            { item: 'windScroll', chance: 90 },
            { item: 'poisonScroll', chance: 90 },
            { item: 'healingScroll', chance: 90 },
            { item: 'manaRing', chance: 80 }
        ],
        spawnChance: 0.001
    },


    shaman: {
        hp: 30,
        attack: 8,
        defense: 3,
        xp: 15,
        minLevel: 4,
        gold: 12,
        drops: [
            { item: 'manaPotion', chance: 5 },
            { item: 'earthScroll', chance: 0.3 },
            { item: 'windScroll', chance: 1 },
            { item: 'whisperwind', chance: 0.2 }
        ],
        spawnChance: 15
    },

    slime: {
        hp: 25,
        attack: 6,
        defense: 4,
        xp: 9,
        minLevel: 3,
        gold: 6,
        drops: [
            { item: 'healthPotion', chance: 6 },
            { item: 'poisonScroll', chance: 0.2 }
        ],
        spawnChance: 25
    },
    warrior: {
        hp: 50,
        attack: 10,
        defense: 6,
        xp: 15,
        minLevel: 4,
        gold: 15,
        drops: [
            { item: 'basicSword', chance: 5 },
            { item: 'warriorAxe', chance: 1 },
            { item: 'twilightClaymore', chance: 0.5 }
        ],
        spawnChance: 18
    },


    witch: {
        hp: 35,
        attack: 13,
        defense: 5,
        xp: 25,
        minLevel: 6,
        gold: 20,
        drops: [
            { item: 'manaPotion', chance: 5 },
            { item: 'healingScroll', chance: 2 },
            { item: 'fireScroll', chance: 1 },
            { item: 'elixirOfVitality', chance: 1 },
            { item: 'silvertongue', chance: 0.3 }
        ],
        spawnChance: 10
    },


    minotaur: {
        hp: 70,
        attack: 18,
        defense: 10,
        xp: 30,
        minLevel: 7,
        gold: 25,
        drops: [
            { item: 'basicSword', chance: 5 },
            { item: 'earthScroll', chance: 1 },
            { item: 'mysticBlade', chance: 1 },
            { item: 'ravagersCleaver', chance: 0.5 }
        ],
        spawnChance: 8
    },


    drake: {
        hp: 80,
        attack: 16,
        defense: 9,
        xp: 50,
        minLevel: 8,
        gold: 30,
        drops: [
            { item: 'fireScroll', chance: 10 },
            { item: 'windScroll', chance: 10 },
            { item: 'blessedArmor', chance: 3 }
        ],
        spawnChance: 7
    },


    knight: {
        hp: 100,
        attack: 20,
        defense: 12,
        xp: 45,
        minLevel: 9,
        gold: 40,
        drops: [
            { item: 'basicSword', chance: 15 },
            { item: 'shield', chance: 10 },
            { item: 'steelSword', chance: 5 },
            { item: 'steelShield', chance: 5 },
            { item: 'twilightClaymore', chance: 1 }
        ],
        spawnChance: 5
    },


    wyvern: {
        hp: 250,
        attack: 25,
        defense: 18,
        xp: 70,
        minLevel: 10,
        gold: 80,
        drops: [
            { item: 'windScroll', chance: 10 },
            { item: 'poisonScroll', chance: 5 },
            { item: 'scrollOfWisdom', chance: 1 },
            { item: 'whisperwind', chance: 0.5 }
        ],
        spawnChance: 2
    },


    // SPECIAL MOBS
    statueguardian: {
        hp: 100,
        attack: 20,
        defense: 20,
        xp: 70,
        minLevel: 10,
        gold: 80,
        drops: [
            { item: 'windScroll', chance: 10 },
            { item: 'poisonScroll', chance: 5 },
            { item: 'scrollOfWisdom', chance: 1 },
            { item: 'whisperwind', chance: 0.5 }
        ],
        spawnChance: 0
    },


    // PNG
    merchant: {
        hp: 0,
        attack: 0,
        defense: 0,
        xp: 0,
        minLevel: 1,
        gold: 0,
        inventory: [],
        spawnChance: 1
    },

    Azkorth: {
        hp: 0,
        attack: 0,
        defense: 0,
        xp: 0,
        minLevel: 1,
        gold: 0,
        inventory: [],
        spawnChance: 1
    },



    // Object

    warriorStatue: {
        hp: 0,
        attack: 0,
        defense: 0,
        xp: 0,
        minLevel: 1,
        gold: 0,
        spawnChance: 0,
        interacted: false
    },

    chest: {
        hp: 0,
        attack: 0,
        defense: 0,
        xp: 0,
        minLevel: 1,
        gold: 0,
        drops: [
            { item: 'basicSword', chance: 10 },
            { item: 'healthPotion', chance: 50 }
        ],
        spawnChance: 0
    },

    manaFountain: {
        hp: 0,
        attack: 0,
        defense: 0,
        xp: 0,
        minLevel: 1,
        gold: 0,
        spawnChance: 1
    },

    lifeFountain: {
        hp: 0,
        attack: 0,
        defense: 0,
        xp: 0,
        minLevel: 1,
        gold: 0,
        spawnChance: 1
    },


    // Monster
    banshee: {
        hp: 60,
        attack: 14,
        defense: 6,
        xp: 30,
        minLevel: 8,
        gold: 20,
        drops: [
            { item: 'healingScroll', chance: 10 },
            { item: 'manaPotion', chance: 8 },
            { item: 'superiorHealthPotion', chance: 5 }
        ],
        spawnChance: 10
    },
    golem: {
        hp: 120,
        attack: 15,
        defense: 18,
        xp: 45,
        minLevel: 9,
        gold: 50,
        drops: [
            { item: 'earthScroll', chance: 15 },
            { item: 'shield', chance: 10 },
            { item: 'ironShield', chance: 8 },
            { item: 'guardianPlate', chance: 3 },
            { item: 'bulwarkMaul', chance: 0.8 }
        ],
        spawnChance: 7
    }
};
