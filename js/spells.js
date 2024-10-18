// spells.js
const SPELLS = {
    fireball: {
        name: "Fireball",
        damage: 20,
        manaCost: 10,
        description: "Launches a fireball at the enemy."
    },
    arcanespark: {
        name: "Arcane Spark",
        manaCost: 5,
        damage: 12,
        levelRequired: 1,
        description: "A spark of pure arcane energy that strikes the enemy."
    },
    lightning: {
        name: "Lightning",
        damage: 25,
        manaCost: 10,
        description: "Strikes the enemy with a powerful lightning bolt."
    },
    iceSpike: {
        name: "Ice Spike",
        damage: 18,
        manaCost: 8,
        description: "Shoots a sharp spike of ice that pierces the enemy."
    },
    earthquake: {
        name: "Earthquake",
        damage: 15,
        manaCost: 12,
        description: "Shakes the ground, damaging all enemies nearby."
    },
    gust: {
        name: "Gust",
        damage: 10,
        manaCost: 5,
        description: "Creates a gust of wind that knocks back the enemy."
    },
    poisonCloud: {
        name: "Poison Cloud",
        damage: 12,
        manaCost: 9,
        description: "Summons a toxic cloud that poisons the enemy over time."
    },
    healingLight: {
        name: "Healing Light",
        damage: 0, // Healing spell
        manaCost: 8,
        description: "Heals the caster or an ally for a moderate amount."
    },
    arcaneAegis: {
        name: "Arcane Aegis",
        manaCost: 30,
        description: "Protects the player and reduces damage taken by 30% for 3 turns. Reflects 20% of absorbed damage as magical damage.",
        effect: (caster, target) => {
            // Ensure the target has an addBuff method
            if (typeof target.addBuff === 'function') {
                target.addBuff({
                    name: "Arcane Aegis",
                    duration: 3,
                    applyEffect: () => {
                        target.reduceDamage(0.3);
                    },
                    endEffect: () => {
                        // Optional: Reset or remove any changes after buff duration
                        console.log('Arcane Aegis effect has ended.');
                    },
                    counterEffect: (damage) => {
                        // Example: Reflect 20% of absorbed damage back to the attacker
                        const reflectedDamage = damage * 0.2;
                        console.log(`Counter-attacking with ${reflectedDamage} magical damage.`);
                        return reflectedDamage;
                    }
                });
            } else {
                console.warn('The target does not support buffs.');
            }
        }
    }

};
