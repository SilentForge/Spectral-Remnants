class Dungeon {
    constructor(game) {
        this.game = game;
        this.reset();
        this.exitReached = false;

        // Ajout des compteurs pour les marchands et les coffres
        this.merchantCounter = 0;
        this.chestCounter = 0;
    }

    reset() {
        this.map = [];
        this.rooms = [];
        this.enemies = [];
        this.items = [];
        this.startPosition = { x: 0, y: 0 };
        this.exitPosition = { x: 0, y: 0 };
    }

    generate(heroLevel) {
        this.reset();
        this.initializeMap();
        this.generateRooms();
        this.connectRooms();
        this.generateSideRooms(); // Ajout des salles annexes 2x2 ici
        this.placeStartAndExit();
        this.placeGuardsAtExit(heroLevel);
        this.placeEnemies(heroLevel);

        if (this.map[this.exitPosition.y]?.[this.exitPosition.x] !== 'exit') {
            console.warn("The exit was not properly placed. Forced placement.");
            this.forceExitPlacement();
        }

        // Incrementation of counters after dungeon generation.
        this.merchantCounter++;
        this.chestCounter++;
    }

    initializeMap() {
        for (let y = 0; y < CONFIG.MAP_HEIGHT; y++) {
            this.map[y] = new Array(CONFIG.MAP_WIDTH).fill('wall');
        }
    }

    generateRooms() {
        const numRooms = Math.floor(Math.random() * 3) + 4;
        for (let i = 0; i < numRooms; i++) {
            let room;
            let attempts = 0; // Add a attempts counter.
            const maxAttempts = 100; // Limit attempts to avoid infinite loops
            do {
                room = this.createRoom();
                attempts++;
            } while (this.doesRoomOverlap(room) && attempts < maxAttempts);

            if (attempts < maxAttempts) { // Do not add the room unless it is valid
                this.carveRoom(room);
                this.rooms.push(room);
            } else {
                console.warn(`Failed to place room after ${maxAttempts} attempts.`);
            }
        }
    }

    createRoom() {
        const width = Math.floor(Math.random() * 5) + 4;
        const height = Math.floor(Math.random() * 5) + 4;
        const x = Math.floor(Math.random() * (CONFIG.MAP_WIDTH - width - 2)) + 1;
        const y = Math.floor(Math.random() * (CONFIG.MAP_HEIGHT - height - 2)) + 1;
        return { x, y, width, height };
    }

    doesRoomOverlap(room) {
        return this.rooms.some(r =>
            room.x < r.x + r.width &&
            room.x + room.width > r.x &&
            room.y < r.y + r.height &&
            room.y + room.height > r.y
        );
    }


    generateSideRooms() {
        const sideRoomChance = 0.90;

        if (Math.random() >= sideRoomChance) {
            console.log("No side room generated this time.");
            return;
        }

        let attempts = 0;
        const maxAttempts = 50;
        let placed = false;

        while (!placed && attempts < maxAttempts) {
            attempts++;
            const room = this.createSideRoom();

            if (this.canPlaceSideRoom(room)) {
                this.carveSideRoomWithBreakableWall(room);
                room.isSideRoom = true;
                room.isHidden = true; // Mark the room as hidden
                this.rooms.push(room);

                // Decide the contents of the room
                const contentChance = Math.random();
                if (contentChance < 0.4) {
                    this.placeWarriorStatue(room);
                } else if (contentChance < 0.8) {
                    this.spawnAzkorth(room);
                } else {
                    // 20% chance of having an empty room or placing another type of element
                    console.log("Empty side room or space for future content.");
                }

                placed = true;
            }
        }

        if (!placed) {
            console.warn(`Failed to place side room after ${maxAttempts} attempts.`);
        } else {
            console.log("Side room successfully generated and placed.");
        }
    }


    // Place the warrior statue in the annex room
    placeWarriorStatue(room) {
        const { x, y, width, height } = room;
        const statueX = x + Math.floor(width / 2);
        const statueY = y + Math.floor(height / 2);
        this.map[statueY][statueX] = 'hidden-warriorStatue';
    }

    // Spawn the enemy Azkorth in the annex room
    spawnAzkorth(room) {
        const { x, y, width, height } = room;
        const statueX = x + Math.floor(width / 2);
        const statueY = y + Math.floor(height / 2);
        this.map[statueY][statueX] = 'hidden-Azkorth';
    }

    // New method to reveal hidden elements
    revealHiddenElements(x, y) {
        if (this.map[y][x].startsWith('hidden-')) {
            this.map[y][x] = this.map[y][x].replace('hidden-', '');
        }

        // Recursively reveal adjacent tiles
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (let [dx, dy] of directions) {
            let nx = x + dx;
            let ny = y + dy;
            if (this.map[ny] && this.map[ny][nx] && this.map[ny][nx].startsWith('hidden-')) {
                this.revealHiddenElements(nx, ny);
            }

        }
    }

    // Check if the special room can be placed in the chosen location
    canPlaceSideRoom(room) {
        const { x, y, width, height } = room;

        // Ensure the area is surrounded by walls but adjacent to a 'floor'
        let hasAdjacentFloor = false;

        // Possible positions for breakable walls
        const possibleEntrances = [
            { x: x - 1, y: y },
            { x: x + width, y: y },
            { x: x, y: y - 1 },
            { x: x, y: y + height }
        ];

        for (let i = y - 1; i <= y + height; i++) {
            for (let j = x - 1; j <= x + width; j++) {
                // Check that all outer edges are 'walls'
                if (this.map[i]?.[j] !== 'wall') {
                    return false; // The outside of the room must be entirely 'walls'
                }
            }
        }

        // Check that one of the possible entry positions is adjacent to a 'floor'
        hasAdjacentFloor = possibleEntrances.some(pos =>
            this.map[pos.y]?.[pos.x] === 'wall' &&
            (
                this.map[pos.y - 1]?.[pos.x] === 'floor' ||
                this.map[pos.y + 1]?.[pos.x] === 'floor' ||
                this.map[pos.y]?.[pos.x - 1] === 'floor' ||
                this.map[pos.y]?.[pos.x + 1] === 'floor'
            )
        );

        // The room must be surrounded by walls and have an entry adjacent to a 'floor'
        return hasAdjacentFloor;
    }

    // Method to generate a 3x3 annex room
    createSideRoom() {
        const width = 4;
        const height = 4;
        const x = Math.floor(Math.random() * (CONFIG.MAP_WIDTH - width - 2)) + 1;
        const y = Math.floor(Math.random() * (CONFIG.MAP_HEIGHT - height - 2)) + 1;
        return { x, y, width, height };
    }

    // Method to dig the annex room and add the breakable wall as an entry
    carveSideRoomWithBreakableWall(room) {
        const { x, y, width, height } = room;

        for (let i = y; i < y + height; i++) {
            for (let j = x; j < x + width; j++) {
                this.map[i][j] = 'hidden-special-floor';
            }
        }

        const possibleEntrances = [
            { x: x - 1, y: y },
            { x: x + width, y: y },
            { x: x, y: y - 1 },
            { x: x, y: y + height }
        ];

        const validEntrances = possibleEntrances.filter(pos =>
            this.map[pos.y]?.[pos.x] === 'wall' &&
            (
                this.map[pos.y - 1]?.[pos.x] === 'floor' ||
                this.map[pos.y + 1]?.[pos.x] === 'floor' ||
                this.map[pos.y]?.[pos.x - 1] === 'floor' ||
                this.map[pos.y]?.[pos.x + 1] === 'floor'
            )
        );

        if (validEntrances.length > 0) {
            const entrance = validEntrances[Math.floor(Math.random() * validEntrances.length)];
            this.map[entrance.y][entrance.x] = 'hidden-breakable-wall';
        }
    }


    createStraightCorridor(roomA, roomB) {
        if (!roomA || !roomB) {
            console.error("Invalid rooms provided to createStraightCorridor:", roomA, roomB);
            return;
        }

        const startX = roomA.x + Math.floor(roomA.width / 2);
        const startY = roomA.y + Math.floor(roomA.height / 2);
        const endX = roomB.x + Math.floor(roomB.width / 2);
        const endY = roomB.y + Math.floor(roomB.height / 2);

        for (let x = Math.min(startX, endX); x <= Math.max(startX, endX); x++) {
            this.map[startY][x] = 'floor';
        }
        for (let y = Math.min(startY, endY); y <= Math.max(startY, endY); y++) {
            this.map[y][endX] = 'floor';
        }
    }

    carveRoom(room) {
        for (let y = room.y; y < room.y + room.height; y++) {
            for (let x = room.x; x < room.x + room.width; x++) {
                this.map[y][x] = 'floor';
            }
        }
    }

    connectRooms() {
        const edges = [];

        // Create edges between each room with their distance
        for (let i = 0; i < this.rooms.length; i++) {
            for (let j = i + 1; j < this.rooms.length; j++) {
                const distance = this.calculateDistance(this.rooms[i], this.rooms[j]);
                edges.push({ roomA: this.rooms[i], roomB: this.rooms[j], distance });
            }
        }

        // Sort edges by increasing distance
        edges.sort((a, b) => a.distance - b.distance);

        // Use Kruskal's algorithm to create a minimum spanning tree
        const roomGroups = this.rooms.map(room => new Set([room]));

        for (const edge of edges) {
            const { roomA, roomB } = edge;

            // Find the groups containing roomA and roomB
            const groupA = roomGroups.find(group => group.has(roomA));
            const groupB = roomGroups.find(group => group.has(roomB));

            // If roomA and roomB are not in the same group, connect them
            if (groupA && groupB && groupA !== groupB) {
                this.createStraightCorridor(roomA, roomB);

                // Merge the groups
                const newGroup = new Set([...groupA, ...groupB]);
                roomGroups.splice(roomGroups.indexOf(groupA), 1);
                roomGroups.splice(roomGroups.indexOf(groupB), 1);
                roomGroups.push(newGroup);
            }
        }
    }

    placeStartAndExit() {
        const mainRooms = this.rooms.filter(room => !room.isSideRoom); // Exclude annex rooms
        if (mainRooms.length < 2) {
            console.error("Not enough main rooms to place start and exit.");
            return;
        }
        const [startRoom, exitRoom] = this.getFarthestRooms(mainRooms); // Find the farthest rooms among the main ones

        this.startPosition = this.getRandomPositionInRoom(startRoom);
        this.exitPosition = this.getCenterPositionInRoom(exitRoom);
        this.map[this.exitPosition.y][this.exitPosition.x] = 'exit';
    }

    getRandomPositionInRoom(room) {
        return {
            x: Math.floor(Math.random() * (room.width - 2)) + room.x + 1,
            y: Math.floor(Math.random() * (room.height - 2)) + room.y + 1,
        };
    }

    getFarthestRooms(rooms) {
        let maxDistance = 0;
        let farthestPair = [rooms[0], rooms[1]];

        for (let i = 0; i < rooms.length; i++) {
            for (let j = i + 1; j < rooms.length; j++) {
                const distance = this.calculateDistance(rooms[i], rooms[j]);
                if (distance > maxDistance) {
                    maxDistance = distance;
                    farthestPair = [rooms[i], rooms[j]];
                }
            }
        }

        return farthestPair;
    }

    calculateDistance(roomA, roomB) {
        const centerA = {
            x: roomA.x + Math.floor(roomA.width / 2),
            y: roomA.y + Math.floor(roomA.height / 2),
        };
        const centerB = {
            x: roomB.x + Math.floor(roomB.width / 2),
            y: roomB.y + Math.floor(roomB.height / 2),
        };
        return Math.sqrt(Math.pow(centerB.x - centerA.x, 2) + Math.pow(centerB.y - centerA.y, 2));
    }

    getCenterPositionInRoom(room) {
        return {
            x: Math.floor(room.x + room.width / 2),
            y: Math.floor(room.y + room.height / 2),
        };
    }

    getRoomContainingPosition(position) {
        return this.rooms.find(room =>
            position.x >= room.x &&
            position.x < room.x + room.width &&
            position.y >= room.y &&
            position.y < room.y + room.height
        );
    }

    placeGuardsAtExit(heroLevel) {
        if (typeof heroLevel !== 'number' || heroLevel < 1) {
            console.error(`Invalid heroLevel passed to placeGuardsAtExit: ${heroLevel}. Defaulting to 1.`);
            heroLevel = 1;  // Ensure heroLevel has a valid value
        }

        const exitRoom = this.getRoomContainingPosition(this.exitPosition);
        if (!exitRoom) {
            console.error("No valid exit room found.");
            return;
        }

        const roomAccesses = this.getRoomAccesses(exitRoom);
        roomAccesses.forEach(access => {
            if (!this.isPositionOccupied(access.x, access.y)) {
                let type = selectEnemyType(heroLevel) || Object.keys(ENEMY_TYPES)[0];

                const enemy = new Enemy(access.x, access.y, type, heroLevel);
                const multiplier = 1.1 + (heroLevel - 1) * 0.05;
                enemy.stats.maxHp = Math.floor(enemy.stats.hp * multiplier);
                enemy.stats.hp = enemy.stats.maxHp;
                enemy.stats.attack = Math.floor(enemy.stats.attack * multiplier);
                enemy.stats.defense = Math.floor(enemy.stats.defense * multiplier);

                this.enemies.push(enemy);
            }
        });

        if (this.enemies.length === 0) {
            this.forceEnemyPlacement(heroLevel, roomAccesses);
        }
    }


    forceEnemyPlacement(heroLevel, accesses) {
        if (typeof heroLevel !== 'number' || heroLevel < 1) {
            console.error(`Invalid heroLevel passed to forceEnemyPlacement: ${heroLevel}. Defaulting to 1.`);
            heroLevel = 1;  // Ensure heroLevel has a valid value
        }

        accesses.forEach(access => {
            console.log(`Forcing enemy placement at (${access.x}, ${access.y})`);
            let type = selectEnemyType(heroLevel);
            console.log(`Selected enemy type for forced placement: ${type}`);

            if (!type) {
                type = Object.keys(ENEMY_TYPES)[0];
                console.warn(`No enemy type available. Forcing enemy type to: ${type}`);
            }

            // Apply a more moderate difficulty multiplier with a limit
            const maxMultiplier = 1.5; // Reduction of the maximum multiplier limit
            let multiplier = 1.05 + (heroLevel - 1) * 0.15; // Reduction of the level increase factor

            // Limit the multiplier to the maxMultiplier value
            if (multiplier > maxMultiplier) {
                multiplier = maxMultiplier;
            }

            // Adjust stats with a attenuation curve
            const attenuationFactor = 0.95 + (1 / (heroLevel + 1)); // Less aggressive attenuation curve
            multiplier *= attenuationFactor;

            const enemy = new Enemy(access.x, access.y, type, heroLevel);
            enemy.stats.maxHp = Math.floor(enemy.stats.hp * multiplier);
            enemy.stats.hp = enemy.stats.maxHp;
            enemy.stats.attack = Math.floor(enemy.stats.attack * multiplier);
            enemy.stats.defense = Math.floor(enemy.stats.defense * multiplier);

            // Adjust XP and gold
            enemy.stats.xp = Math.floor(enemy.stats.xp * multiplier);
            enemy.stats.gold = Math.floor(enemy.stats.gold * multiplier);

            console.log(`Created forced enemy at (${access.x}, ${access.y}) with adjusted stats:`, enemy.stats);

            if (!this.isPositionOccupied(access.x, access.y)) {
                // Add the enemy to the list
                this.enemies.push(enemy);
                console.log(`Forced enemy added to the list:`, this.enemies);
            } else {
                console.warn(`Position (${access.x}, ${access.y}) is already occupied. Forced enemy cannot be placed.`);
            }
        });
    }



    getRoomAccesses(room) {
        const accesses = [];

        for (let y = room.y; y < room.y + room.height; y++) {
            if (this.getTileAt(room.x - 1, y) === 'floor') accesses.push({ x: room.x - 1, y });
            if (this.getTileAt(room.x + room.width, y) === 'floor') accesses.push({ x: room.x + room.width, y });
        }

        for (let x = room.x; x < room.x + room.width; x++) {
            if (this.getTileAt(x, room.y - 1) === 'floor') accesses.push({ x, y: room.y - 1 });
            if (this.getTileAt(x, room.y + room.height) === 'floor') accesses.push({ x, y: room.y + room.height });
        }

        return accesses;
    }


    placeEnemies(heroLevel) {
        const mainRooms = this.rooms.filter(room => !room.isSideRoom && !room.isSpecialRoom);
        const numEnemies = Math.floor(Math.random() * 3) + 5;
        let merchantPlaced = false;
        let manaFountainPlaced = false;
        let lifeFountainPlaced = false;

        for (let i = 0; i < numEnemies; i++) {
            let x, y, room;
            do {
                room = mainRooms[Math.floor(Math.random() * mainRooms.length)];
                x = Math.floor(Math.random() * (room.width - 2)) + room.x + 1;
                y = Math.floor(Math.random() * (room.height - 2)) + room.y + 1;
            } while (
                this.isPositionOccupied(x, y) ||
                (x === this.exitPosition.x && y === this.exitPosition.y) ||
                (x === this.startPosition.x && y === this.startPosition.y)
            );

            let type;

            if (this.merchantCounter >= 3 && !merchantPlaced && Math.random() < 0.04 && !room.isSideRoom) {
                type = 'merchant';
                if (this.game && typeof this.game.generateMerchantInventory === 'function') {
                    const merchant = new Enemy(x, y, type, heroLevel);
                    merchant.stats.inventory = this.game.generateMerchantInventory();
                    this.enemies.push(merchant);
                    merchantPlaced = true;
                    this.merchantCounter = 0;
                } else {
                    console.error("Erreur: `game` ou `generateMerchantInventory` n'est pas défini.");
                }
            } else if (this.chestCounter >= 4 && !room.isSideRoom) {
                const baseDropRate = 0.095;
                const maxBonusRate = 0.08;
                const bonusRate = Math.min(maxBonusRate, baseDropRate + (this.chestCounter - 2) * 0.005);

                if (Math.random() < bonusRate) {
                    type = 'chest';
                    this.enemies.push(new Enemy(x, y, type, heroLevel));
                    this.chestCounter = 0;
                } else {
                    this.chestCounter++;
                }
            } else if (this.manaFountainCounter >= 3 && !manaFountainPlaced && Math.random() < 0.03 && !room.isSideRoom) {
                type = 'manaFountain';
                this.enemies.push(new Enemy(x, y, type, heroLevel));
                manaFountainPlaced = true;
                this.manaFountainCounter = 0;
            } else if (this.lifeFountainCounter >= 3 && !lifeFountainPlaced && Math.random() < 0.03 && !room.isSideRoom) {
                type = 'lifeFountain';
                this.enemies.push(new Enemy(x, y, type, heroLevel));
                lifeFountainPlaced = true;
                this.lifeFountainCounter = 0;
            } else {
                type = selectEnemyType(heroLevel);
                if (type && type !== 'Azkorth') {  // Add this check to exclude Azkorth
                    this.enemies.push(new Enemy(x, y, type, heroLevel));
                }
            }
        }

        // Force the placement of entities if necessary
        if (this.merchantCounter >= 3 && !merchantPlaced) {
            this.forcePlaceEntity('merchant', heroLevel, mainRooms);
        }
        if (this.chestCounter >= 3) {
            this.forcePlaceEntity('chest', heroLevel, mainRooms);
        }
        if (this.manaFountainCounter >= 3 && !manaFountainPlaced) {
            this.forcePlaceEntity('manaFountain', heroLevel, mainRooms);
        }
        if (this.lifeFountainCounter >= 3 && !lifeFountainPlaced) {
            this.forcePlaceEntity('lifeFountain', heroLevel, mainRooms);
        }

        // Increment the counters
        this.merchantCounter++;
        this.manaFountainCounter++;
        this.lifeFountainCounter++;
    }

    forcePlaceEntity(type, heroLevel, mainRooms) {
        let room, x, y;
        do {
            room = mainRooms[Math.floor(Math.random() * mainRooms.length)];
            x = Math.floor(Math.random() * (room.width - 2)) + room.x + 1;
            y = Math.floor(Math.random() * (room.height - 2)) + room.y + 1;
        } while (
            this.isPositionOccupied(x, y) ||
            (x === this.exitPosition.x && y === this.exitPosition.y) ||
            (x === this.startPosition.x && y === this.startPosition.y)
        );

        const entity = new Enemy(x, y, type, heroLevel);

        if (type === 'merchant' && this.game && typeof this.game.generateMerchantInventory === 'function') {
            entity.stats.inventory = this.game.generateMerchantInventory() || [];
        }

        this.enemies.push(entity);

        // Reset the appropriate counter
        if (type === 'merchant') this.merchantCounter = 0;
        if (type === 'chest') this.chestCounter = 0;
        if (type === 'manaFountain') this.manaFountainCounter = 0;
        if (type === 'lifeFountain') this.lifeFountainCounter = 0;
    }




    forceExitPlacement() {
        for (let room of this.rooms) {
            for (let y = room.y; y < room.y + room.height; y++) {
                for (let x = room.x; x < room.x + room.width; x++) {
                    if (!this.isPositionOccupied(x, y) &&
                        !(x === this.startPosition.x && y === this.startPosition.y)) {
                        this.exitPosition = { x, y };
                        this.map[y][x] = 'exit';
                        return;
                    }
                }
            }
        }
    }

    isPositionOccupied(x, y) {
        return this.enemies.some(enemy => enemy.x === x && enemy.y === y);
    }

    getTileAt(x, y) {
        if (x < 0 || y < 0 || y >= CONFIG.MAP_HEIGHT || x >= CONFIG.MAP_WIDTH) {
            return 'wall';
        }
        const tile = this.map[y][x];
        return tile === 'hidden-breakable-wall' ? 'breakable-wall' : tile;
    }

    isBreakableWall(x, y) {
        return this.map[y][x] === 'breakable-wall' || this.map[y][x] === 'hidden-breakable-wall';
    }


    getEnemyAt(x, y) {
        return this.enemies.find(enemy => enemy.x === x && enemy.y === y);
    }

    addItem(item) {
        this.items.push(item);
    }

    removeItem(item) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
        }
    }

    getItemAt(x, y) {
        return this.items.find(item => item.x === x && item.y === y);
    }

    removeEnemy(enemy) {
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
    }
}

function selectEnemyType(heroLevel) {
    if (typeof heroLevel !== 'number' || heroLevel < 1) {
        console.error(`Invalid heroLevel passed to selectEnemyType: ${heroLevel}. Defaulting to 1.`);
        heroLevel = 1;  // Ensure heroLevel has a valid value
    }

    const availableEnemies = Object.entries(ENEMY_TYPES)
        .filter(([type, stats]) => {
            let adjustedSpawnChance = stats.spawnChance;
            const levelDifference = heroLevel - stats.minLevel;

            if (levelDifference >= 5) {
                adjustedSpawnChance = 0; // Completely exclude enemies that are too weak
            } else if (levelDifference > 0) {
                adjustedSpawnChance = Math.max(stats.spawnChance - levelDifference * 2, 0);
            }

            const isEligible = heroLevel >= stats.minLevel && Math.random() * 100 < adjustedSpawnChance;
            console.log(`Checking ${type}: Eligible = ${isEligible}, Adjusted Spawn Chance = ${adjustedSpawnChance}`);
            return isEligible;
        })
        .map(([type, stats]) => type);

    console.log('Available enemies after filtering:', availableEnemies);

    if (availableEnemies.length > 0) {
        const selectedEnemy = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
        console.log('Selected enemy:', selectedEnemy);
        return selectedEnemy;
    }

    console.log('No enemies available for selection.');
    return null;
}
