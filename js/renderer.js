class Renderer {
    constructor() {
        this.gameMap = document.getElementById('game-map');
        this.tileElements = {};
    }

    renderDungeon(dungeon) {
        for (let y = 0; y < CONFIG.MAP_HEIGHT; y++) {
            for (let x = 0; x < CONFIG.MAP_WIDTH; x++) {
                const tileType = dungeon.getTileAt(x, y);
                if (tileType === 'breakable-wall') {
                    this.updateTile(x, y, 'wall');
                } else if (tileType.startsWith('hidden-')) {
                    this.updateTile(x, y, 'wall');
                } else {
                    this.updateTile(x, y, tileType);
                }
            }
        }
    }

    updateTile(x, y, tileType) {
        const key = `${x},${y}`;
        if (!this.tileElements[key]) {
            const tile = document.createElement('div');
            tile.style.left = `${x * CONFIG.TILE_SIZE}px`;
            tile.style.top = `${y * CONFIG.TILE_SIZE}px`;
            this.gameMap.appendChild(tile);
            this.tileElements[key] = tile;
        }
        this.tileElements[key].className = `tile ${tileType}`;
    }

    renderEnemies(enemies) {

        const existingEnemies = this.gameMap.querySelectorAll('.enemy');
        existingEnemies.forEach(el => el.remove());

        enemies.forEach(enemy => {
            this.gameMap.appendChild(enemy.element);
        });
    }



    renderItems(items) {

        const existingItems = this.gameMap.querySelectorAll('.item');
        existingItems.forEach(el => el.remove());

        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = `item ${item.type}`;
            itemElement.style.left = `${item.x * CONFIG.TILE_SIZE}px`;
            itemElement.style.top = `${item.y * CONFIG.TILE_SIZE}px`;
            this.gameMap.appendChild(itemElement);
        });
    }

    removeEnemyElement(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    removeItemElement(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    playItemFoundAnimation(itemKey, rarity) {
        const itemElement = document.createElement('div');
        itemElement.className = `item-found-animation ${rarity}`;

        itemElement.style.position = 'fixed';
        itemElement.style.left = '50%';
        itemElement.style.top = '50%';
        itemElement.style.transform = 'translate(-50%, -50%)';
        itemElement.style.zIndex = '1000';

        document.body.appendChild(itemElement);

        setTimeout(() => {
            itemElement.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(itemElement);
            }, 1000);
        }, 2000);
    }

    playChestOpeningAnimation(chestElement) {
        chestElement.classList.add('chest-opening');

        setTimeout(() => {
            chestElement.classList.remove('chest-opening');
        }, 4000);
    }

    updateSecretRoom(dungeon) {
        if (dungeon.secretPassagePath && dungeon.revealProgress < dungeon.secretPassagePath.length) {
            const currentTile = dungeon.secretPassagePath[dungeon.revealProgress];
            this.updateTile(currentTile.x, currentTile.y, 'floor');
            return true;
        }
        return false;
    }
}