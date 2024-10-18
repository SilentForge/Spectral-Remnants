const ITEMS = {
    "healthPotion": {
        "name": "Health Potion",
        "type": "consumable",
        "rarity": "common",
        "effect": "heal",
        "value": 50,
        "goldValue": 50, // Potions de soin de base, nécessaires mais chères
        "imageUrl": "assets/img/consum/healthpotion.png"  // Path to the image
    },
    "greaterHealthPotion": {
        "name": "Greater Health Potion",
        "type": "consumable",
        "rarity": "uncommon",
        "effect": "heal",
        "value": 100,
        "goldValue": 150 // More powerful and therefore significantly more expensive
    },
    "superiorHealthPotion": {
        "name": "Superior Health Potion",
        "type": "consumable",
        "rarity": "rare",
        "effect": "heal",
        "value": 200,
        "goldValue": 300 // Very expensive because of its rarity and its efficiency
    },
    "manaPotion": {
        "name": "Mana Potion",
        "type": "consumable",
        "rarity": "common",
        "effect": "restoreMana",
        "value": 30,
        "goldValue": 40 // A little cheaper than care potions
    },
    "greaterManaPotion": {
        "name": "Greater Mana Potion",
        "type": "consumable",
        "rarity": "uncommon",
        "effect": "restoreMana",
        "value": 60,
        "goldValue": 100
    },
    "superiorManaPotion": {
        "name": "Superior Mana Potion",
        "type": "consumable",
        "rarity": "rare",
        "effect": "restoreMana",
        "value": 120,
        "goldValue": 200
    },
    "elixirOfVitality": {
        "name": "Elixir of Vitality",
        "type": "consumable",
        "rarity": "rare",
        "effect": "healMana",
        "value": {
            "hp": 100,
            "mana": 50
        },
        "goldValue": 400
    },

    // Weapon 

    "basicSword": {
        "name": "Basic Sword",
        "type": "weapon",
        "rarity": "common",
        "attackBoost": 5,
        "critChanceBoost": 0.5,
        "goldValue": 60
    },
    "ironSword": {
        "name": "Iron Sword",
        "type": "weapon",
        "rarity": "uncommon",
        "attackBoost": 10,
        "critChanceBoost": 2,
        "goldValue": 150
    },
    "steelSword": {
        "name": "Steel Sword",
        "type": "weapon",
        "rarity": "rare",
        "attackBoost": 15,
        "critChanceBoost": 5,
        "goldValue": 300
    },
    "mysticBlade": {
        "name": "Mystic Blade",
        "type": "weapon",
        "rarity": "rare",
        "attackBoost": 12,
        "manaBoost": 20,
        "critChanceBoost": 8,
        "goldValue": 400
    },
    "warriorAxe": {
        "name": "Warrior's Axe",
        "type": "weapon",
        "rarity": "uncommon",
        "attackBoost": 8,
        "defenseBoost": 5,
        "critChanceBoost": 3,
        "goldValue": 250
    },
    "swordOfFortitude": {
        "name": "Sword of Fortitude",
        "type": "weapon",
        "rarity": "legendary",
        "attackBoost": 20,
        "defenseBoost": 10,
        "critChanceBoost": 10,
        "goldValue": 1000
    },

    "Thief Daggers": {
        "name": "Thief Daggers",
        "type": "weapon",
        "rarity": "uncommon",
        "attackBoost": 7,
        "defenseBoost": 1,
        "critChanceBoost": 15,
        "goldValue": 200
    },


    "twilightClaymore": {
        "name": "Twilight Claymore",
        "type": "weapon",
        "rarity": "rare",
        "attackBoost": 15,
        "defenseBoost": 5,
        "critChanceBoost": 7,
        "critDamageBoost": 0.2,
        "goldValue": 550
    },
    "ravagersCleaver": {
        "name": "Ravager's Cleaver",
        "type": "weapon",
        "rarity": "rare",
        "attackBoost": 25,
        "defenseBoost": -10,
        "critChanceBoost": 12,
        "critDamageBoost": 0.4,
        "goldValue": 650
    },
    "silvertongue": {
        "name": "Silvertongue",
        "type": "weapon",
        "rarity": "rare",
        "attackBoost": 10,
        "critChanceBoost": 20,
        "critDamageBoost": 0.5,
        "goldValue": 600
    },
    "bulwarkMaul": {
        "name": "Bulwark Maul",
        "type": "weapon",
        "rarity": "rare",
        "attackBoost": 12,
        "defenseBoost": 15,
        "maxHpBoost": 50,
        "critChanceBoost": 5,
        "goldValue": 580
    },
    "voidharbinger": {
        "name": "Voidharbinger",
        "type": "weapon",
        "rarity": "legendary",
        "attackBoost": 30,
        "manaBoost": 30,
        "critChanceBoost": 15,
        "critDamageBoost": 0.6,
        "goldValue": 1200
    },
    "whisperwind": {
        "name": "Whisperwind",
        "type": "weapon",
        "rarity": "rare",
        "attackBoost": 18,
        "manaBoost": 20,
        "critChanceBoost": 10,
        "critDamageBoost": 0.3,
        "goldValue": 700
    },

    // Armor 

    "basicarmor": {
        "name": "Basic Armor",
        "type": "armor",
        "rarity": "common",
        "defenseBoost": 3,
        "goldValue": 50 // Basic Defense Accessory
    },
    "ironarmor": {
        "name": "Iron Armor",
        "type": "armor",
        "rarity": "uncommon",
        "defenseBoost": 15,
        "goldValue": 150
    },
    "steelArmor": {
        "name": "Steel Armor",
        "type": "armor",
        "rarity": "rare",
        "defenseBoost": 10,
        "goldValue": 250
    },
    "blessedArmor": {
        "name": "Blessed Armor",
        "type": "armor",
        "rarity": "rare",
        "defenseBoost": 12,
        "manaBoost": 30,
        "goldValue": 500
    },
    "guardianPlate": {
        "name": "Guardian Plate",
        "type": "armor",
        "rarity": "legendary",
        "defenseBoost": 20,
        "hpBoost": 50,
        "goldValue": 800
    },

    "assassinVest": {
        "name": "Assassin's Vest",
        "type": "armor",
        "rarity": "rare",
        "defenseBoost": 8,
        "critChanceBoost": 12,
        "goldValue": 600
    },
    "ironclad Bulwark": {
        "name": "Ironclad Bulwark",
        "type": "armor",
        "rarity": "rare",
        "defenseBoost": 20,
        "maxHpBoost": 70,
        "attackBoost": -5,
        "goldValue": 680
    },
    "umbralWeave": {
        "name": "Umbral Weave",
        "type": "armor",
        "rarity": "rare",
        "defenseBoost": 8,
        "critChanceBoost": 18,
        "critDamageBoost": 0.4,
        "goldValue": 720
    },
    "spellwarden'sVestments": {
        "name": "Spellwarden's Vestments",
        "type": "armor",
        "rarity": "rare",
        "defenseBoost": 12,
        "manaBoost": 60,
        "attackBoost": 8,
        "critChanceBoost": 7,
        "goldValue": 750
    },
    "bloodfury Cuirass": {
        "name": "Bloodfury Cuirass",
        "type": "armor",
        "rarity": "legendary",
        "maxHpBoost": 150,
        "attackBoost": 15,
        "defenseBoost": -10,
        "critChanceBoost": 10,
        "critDamageBoost": 0.3,
        "goldValue": 1100
    },
    "celestialWardplate": {
        "name": "Celestial Wardplate",
        "type": "armor",
        "rarity": "legendary",
        "defenseBoost": 30,
        "maxHpBoost": 100,
        "manaBoost": 50,
        "critChanceBoost": 5,
        "goldValue": 1300
    },
    "shadowstrikeGarb": {
        "name": "Shadowstrike Garb",
        "type": "armor",
        "rarity": "rare",
        "defenseBoost": 5,
        "critChanceBoost": 22,
        "critDamageBoost": 0.5,
        "attackBoost": 10,
        "goldValue": 800
    },


    // Spell Scroll

    "fireScroll": {
        "name": "Fire Scroll",
        "type": "spell",
        "rarity": "rare",
        "spell": "fireball",
        "goldValue": 300
    },
    "lightningScroll": {
        "name": "Lightning Scroll",
        "type": "spell",
        "rarity": "rare",
        "spell": "lightning",
        "goldValue": 300
    },
    "iceScroll": {
        "name": "Ice Scroll",
        "type": "spell",
        "rarity": "rare",
        "spell": "iceSpike",
        "goldValue": 300
    },
    "earthScroll": {
        "name": "Earth Scroll",
        "type": "spell",
        "rarity": "uncommon",
        "spell": "earthquake",
        "goldValue": 200 // Cheaper than rare spells
    },
    "windScroll": {
        "name": "Wind Scroll",
        "type": "spell",
        "rarity": "uncommon",
        "spell": "gust",
        "goldValue": 200
    },
    "poisonScroll": {
        "name": "Poison Scroll",
        "type": "spell",
        "rarity": "rare",
        "spell": "poisonCloud",
        "goldValue": 300
    },
    "healingScroll": {
        "name": "Healing Scroll",
        "type": "spell",
        "rarity": "uncommon",
        "spell": "healingLight",
        "goldValue": 75
    },

    // Artifacts 

    "lightningTalisman": {
        "name": "Lightning Talisman",
        "type": "artifact",
        "rarity": "common",
        "effect": "boostCritChance",
        "value": 5,
        "goldValue": 100, // Improves the chances of criticism for all attacks
        "effectDescription": "Increases critical hit chance by 5%.",
        "imageUrl": "assets/img/arte/lighttalisman.png"  // Path to the image
    },
    "frostAmulet": {
        "name": "Frost Amulet",
        "type": "artifact",
        "rarity": "uncommon",
        "effect": "boostDefense",
        "value": 3, // Increase the defense of 3
        "goldValue": 150, // Offers better protection by increasing defense
        "effectDescription": "Increases defense by 3.",
        "imageUrl": "assets/img/arte/frostamulet.png"  // Path to the image
    },
    "earthquakeCharm": {
        "name": "Earthquake Charm",
        "type": "artifact",
        "rarity": "rare",
        "effect": "boostStunChance",
        "value": 5,
        "goldValue": 200, // Strengthens the chances of stunning with stun effects
        "effectDescription": "Increases chance to stun the enemy by 5%.",
        "imageUrl": "assets/img/arte/earthquakecharm.png"  // Path to the image

    },
    "gustPendant": {
        "name": "Gust Pendant",
        "type": "artifact",
        "rarity": "uncommon",
        "effect": "reduceEnemyAttack",
        "value": 1, // Reduces the enemy's attack by 1 for 5 seconds after a critical attack
        "goldValue": 140, // Temporarily decreases the enemy's attack after a critical attack
        "effectDescription": "Reduces enemy attack by 1 for 5 seconds after a critical hit.",
        "imageUrl": "assets/img/arte/gustpendant.png"  // Path to the image
    },
    "arcaneSparkGem": {
        "name": "Arcane Spark Gem",
        "type": "artifact",
        "rarity": "rare",
        "effect": "boostCritDamage",
        "value": 0.3, // Increase the critical damage by 0.3x
        "goldValue": 250, // Increases the power of critical blows
        "effectDescription": "Increases critical damage by 0.3x.",
        "imageUrl": "assets/img/arte/arcanetalisman.png"  // Path to the image
    },
    "poisonRing": {
        "name": "Poison Ring",
        "type": "artifact",
        "rarity": "rare",
        "effect": "boostPoisonDamage",
        "value": 2, // Increases poison damage by 2 per tick
        "goldValue": 180, // Strengthens poison effects for attacks that inflict poison damage
        "effectDescription": "Increases poison damage by 2 per tick.",
        "imageUrl": "assets/img/arte/poisonring.png"  // Path to the image
    },
    "manaCrystal": {
        "name": "Mana Crystal",
        "type": "artifact",
        "rarity": "common",
        "effect": "boostMaxMana",
        "value": 10, // Increase the maximum mana by 10 points
        "goldValue": 80, // Allows the hero to launch more spells before missing Mana
        "effectDescription": "Increases maximum mana by 10 points.",
        "imageUrl": "assets/img/arte/manacrystal.png"  // Path to the image
    },
    "vitalityOrb": {
        "name": "Vitality Orb",
        "type": "artifact",
        "rarity": "common",
        "effect": "boostMaxHp",
        "value": 20, // Increase the maximum of 20 points of life of 20
        "goldValue": 100, // Improves survival capacity by increasing maximum life
        "effectDescription": "Increases maximum health points by 20",
        "imageUrl": "assets/img/arte/vitalityorb.png"  // Path to the images
    },
    "resistanceMedallion": {
        "name": "Resistance Medallion",
        "type": "artifact",
        "rarity": "uncommon",
        "effect": "reduceDamageTaken",
        "value": 5,
        "goldValue": 130, // Decreases the damage received in combat
        "effectDescription": "Reduces damage taken by 5%.",
        "imageUrl": "assets/img/arte/resistancemedallion.png"  // Path to the image
    },
    "manaRing": {
        "name": "Mana Ring",
        "type": "artifact",
        "rarity": "common",
        "effect": "boostManaRegen",
        "value": 5, // Increases Mana's regeneration by 5 points per second
        "goldValue": 90, // Accelerates Mana recovery to allow more spells in a prolonged fight
        "effectDescription": "Increases mana regeneration by 5 points per second.",
        "imageUrl": "assets/img/arte/manaring.png"  // Path to the image
    }

};
