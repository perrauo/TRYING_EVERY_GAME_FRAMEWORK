// Player JS file. Contains player health, inventory and floor progress.

/*global Game, game, Phaser, ITEMS, ENEMY*/

var Player = {
    
    sprite        : undefined,
    isMoving      : false,
    matrixPosX    : 0,
    matrixPosY    : 0,
    
    playerHP      : 8,
    playerMaxHP   : 8,
    inventorySize : 3,
    
    inventory     : [],
    auxItemRef    : [],

    weapons       : [],
    currentWeapon : undefined,
    
    coins         : 0,
    
    // Decrease this by 1 every time player exits to town
    curseDays     : 30,
    
    // Increase this by 1 every time player goes into the next dungeon
    dungeonLevel  : 1,
    
    // Use this to change functions behaviour
    atVillage     : false,
    inventoryOpen : false,
    itemSelected  : false,
    currentItem   : 0,
    
    // game over stuff
    gameOverBrokenScreen : {},
    gameOverBitmapText1 : {},
    gameOverBitmapText2 : {},
    gameOverBitmapText3 : {},
    gameOverBitmapTextRestart : {},
    gameOverEnded : true,
    killedBy : "AN ENEMY", // Curse, enemy...

    // Reset all player state to default values here
    reset : function() {
        console.log("\n -----------  Reset Player var ------------")
    
        // Destroy sprites
        Player.gameOverBrokenScreen.destroy();
        Player.gameOverSpriteText.destroy();
        Player.gameOverBitmapText1.destroy();
        Player.gameOverBitmapText2.destroy();
        Player.gameOverBitmapText3.destroy();
        Player.gameOverBitmapTextRestart.destroy();
    
        // Default values
        this.sprite = undefined;
        this.isMoving = false;
        this.matrixPosX = 0;
        this.matrixPosY = 0
        
        this.playerHP = 8;
        this.playerMaxHP = 8;
        this.inventorySize = 3;
        
        this.inventory = [];
        this.auxItemRef = [];
        
        this.weapons = [];
        this.currentWeapon = undefined;
        
        this.coins = 0;
        
        this.curseDays = 30;
        this.dungeonLevel = 1;
        this.atVillage = false;
        this.inventoryOpen = false;
        this.itemSelected = false;
        this.currentItem = 0;
        
        this.gameOverBrokenScreen = {};
        this.gameOverBitmapText1 = {};
        this.gameOverBitmapText2 = {};
        this.gameOverBitmapTextRestart = {};
        this.gameOverEnded = true;
        this.killedBy = "AN ENEMY";
        
    },

    UpdatePlayerHP : function(HPChange) {
        // Increase or decrease HP by given change
        this.playerHP += HPChange;
        // Play hit animation on character portrait
        if (HPChange < 0) {
            
            // Animation to show player took damage (two frames of white fill)
            this.sprite.animations.play('hit');
            // Play player hit sound
            this.playerHitSound = game.add.sound('playerHit');
            this.playerHitSound.play();
            
            var restoreIdleAnimation = function() { this.sprite.animations.play('idle'); };
            this.sprite.animations.currentAnim.onComplete.add(restoreIdleAnimation, this);
            
            if (this.curseDays > 20) {
                Game.characterPortrait.animations.play('charCurse1Hit');
            } else if (this.curseDays <= 20 && this.curseDays > 10) {
                Game.characterPortrait.animations.play('charCurse2Hit');
            } else if (this.curseDays <= 10) {
                Game.characterPortrait.animations.play('charCurse3Hit');
            }
            Game.characterPortrait.animations.currentAnim.onComplete.add(this.UpdateCharacterPortraitState, this);
        }
        else {
            this.UpdateCharacterPortraitState();
        }
        
        if (HPChange > 0) {
            this.healSound = game.add.sound('heal');
            this.healSound.play();
        }
        
        // If larger than max HP, set to max HP. If smaller than 1, set to 0, game is over.
        if(this.playerHP > this.playerMaxHP) {
            this.playerHP = this.playerMaxHP;
        } else if(this.playerHP < 1) {
            this.playerHP = 0;
            
            // Disable input
            this.LockInput();
            this.gameOverEnded = false;
            
            // Flash screen twice and show broken screen after?
            
            
            // Stop player and all villagers/enemies/items animations
            this.sprite.animations.stop();
            Game.characterPortrait.animations.stop();
            for (var i = 0; i < Game.itemsList.length; i++) {
                Game.itemsList[i].spriteRef.animations.stop();
            }
            for (var i = 0; i < Game.enemiesList.length; i++) {
                Game.enemiesList[i].spriteRef.animations.stop();
            }
            for (var i = 0; i < Game.villagersList.length; i++) {
                Game.villagersList[i].spriteRef.animations.stop();
            }
            game.tweens.pauseAll();
            game.tweens.removeAll();
            
            // Play a sound
            
            // Play game over sequence: Broken screen, game over animation, text "you reached floor X and were killed by Y" + "Press A to restart"
            this.gameOverBrokenScreen = game.add.sprite(0, 0, 'gameOverBrokenScreen');
            this.gameOverBrokenScreen.animations.add('break', [0], 0.5, false);
            this.gameOverBrokenScreen.animations.add('dissolve', [1, 2, 3, 4, 5, 6, 7], 10, false);
            this.gameOverBrokenScreen.animations.play('break');
            
            // Chain events to form the sequence (looks like code hell :P)
            this.gameOverBrokenScreen.animations.currentAnim.onComplete.add( function() { 
                
                this.gameOverBrokenScreen.animations.play('dissolve'); 
                this.gameOverBrokenScreen.animations.currentAnim.onComplete.add( function() {
                    
                    this.gameOverSpriteText = game.add.sprite(0, 35, 'gameOverText');
                    this.gameOverSpriteText.animations.add('gameover', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, false);
                    this.gameOverSpriteText.animations.play('gameover');
                    this.gameOverSpriteText.animations.currentAnim.onComplete.add( function() {
                        
                        // Text
                        game.time.events.add(1000, function() {
                            
                            // Show "You reached floor X" text + sound + delay
                            this.gameOverBitmapText1 = game.add.bitmapText(0, 92, 'LURKLight', "YOU  REACHED  FLOOR  " + Player.dungeonLevel , 6);
                            this.gameOverBitmapText1.x = 80 - (this.gameOverBitmapText1.textWidth * 0.5);
                            
                        }, this);
                        
                        game.time.events.add(2000, function() {
                            
                            // Show "You were killed by Y" text + sound + delay
                            this.gameOverBitmapText2 = game.add.bitmapText(0, 99, 'LURKLight', "AND  WERE  KILLED  BY  " + Player.killedBy + "." , 6);
                            this.gameOverBitmapText2.x = 80 - (this.gameOverBitmapText2.textWidth * 0.5);

                        }, this);
                        
                        game.time.events.add(3000, function() {
                            
                            // Show "Your score is Z" text + sound + delay
                            this.gameOverBitmapText3 = game.add.bitmapText(0, 106, 'LURKLight', "YOUR  SCORE  IS  " + (Player.coins + Player.dungeonLevel * 5).toString() + "." , 6);
                            this.gameOverBitmapText3.x = 80 - (this.gameOverBitmapText3.textWidth * 0.5);

                        }, this);
                        
                        game.time.events.add(4000, function() {
                            
                            // Show line
                            this.gameOverLine = game.add.sprite(0, 134, 'pressXBg');

                        }, this);

                        game.time.events.add(4200, function() {
                            
                            // Show "Press B to restart" text + unlock input to allow restarting
                            this.gameOverBitmapTextRestart = game.add.bitmapText(48, 133, 'LURKLight', "PRESS  A  TO  RESTART", 6);
                            this.gameOverBitmapTextRestart.x = 80 - (this.gameOverBitmapTextRestart.textWidth * 0.5);
                            
                            // Finally unlock input so that player can reset the game
                            this.UnlockInput();
                            this.gameOverEnded = true;

                        }, this);
                        
                    }, this);

                }, this);
                
            }, this);
            
        }
        // Update UI
        Game.updatePlayerHPOnScreen(this.playerHP);
    },
    
    UpdatePlayerMaxHP : function(maxHPChange) {
        // Increase or decrease max HP by given change
        this.playerMaxHP += maxHPChange;
        // If larger than 14, set to 14. If smaller than 1, set to 1.
        if (this.playerMaxHP > 14) { this.playerMaxHP = 14; } else if (this.playerMaxHP < 1) { this.playerMaxHP = 1; }
        // Update UI
        Game.updatePlayerHPOnScreen(this.playerHP);
    },
    
    FillPlayerHP : function() {
        // Add max hp with local function
        this.UpdatePlayerHP(+7);
        // Update UI
        Game.updatePlayerHPOnScreen(this.playerHP);
    },
    
    UpdateInventorySize : function(inventorySizeChange) {
        // Enlarge or shrink the inventory size by given change
        this.inventorySize += inventorySizeChange;
        // If larger than 10, set to 10. If smaller than 1, set to 1.
        if (this.inventorySize > 10) { this.inventorySize = 10; } else if (this.inventorySize < 1) { this.inventorySize = 1; }
        // Remove items that don't fit the new size
        if(this.inventorySize+inventorySizeChange < this.inventory.length) {
            for(var i = this.inventorySize+inventorySizeChange; i < this.inventory.length-1; i++) {
                this.inventory.remove(i);
            }
        }
        // Update UI
        Game.updatePlayerItemsOnScreen();
    },
    
    UpdateCharacterPortraitState : function() {
        if (this.curseDays > 20) {
            if (this.playerHP > Math.floor(2*this.playerMaxHP/3)) {
                Game.characterPortrait.animations.play('charCurse1Dmg1');
            } else if (this.playerHP <= Math.floor(2*this.playerMaxHP/3) && this.playerHP > Math.floor(this.playerMaxHP/3)) {
                Game.characterPortrait.animations.play('charCurse1Dmg2');
            } else if (this.playerHP <= Math.floor(this.playerMaxHP/3)) {
                Game.characterPortrait.animations.play('charCurse1Dmg3');
            }
        } else if (this.curseDays <= 20 && this.curseDays > 10) {
            if (this.playerHP > Math.floor(this.playerMaxHP/2)) {
                Game.characterPortrait.animations.play('charCurse2Dmg1');
            } else if (this.playerHP <= Math.floor(this.playerMaxHP/2)) {
                Game.characterPortrait.animations.play('charCurse2Dmg2');
            }
        } else if (this.curseDays <= 10) {
            Game.characterPortrait.animations.play('charCurse3');
        }
    },
    
    UpdateCoins : function(coinChange) {
        this.coins += coinChange;
        if (this.coins < 0) {
            this.coins = 0;
        } else if (this.coins > 99999) {
            this.coins = 99999;
        }
        Game.updateCoinsOnScreen();
    },
    
    MoveTo : function(direction) {
        
        // Avoid moving again if already moving
        if (this.isMoving) {
            console.log("Player already moving. Can't move again until finish");
            return;
        }
        
        // Choose village or dungeon matrix
        var matrix = {tile : []};
        matrix.tile = this.atVillage ? Game.villageMatrix : Game.objectMatrix;
        
        console.log("Player MoveTo " + direction);
        
        // Calculate coordinates of player
        
        var playerX = this.sprite.x / 8;
        var playerY = this.sprite.y / 8;
        var destX;
        var destY;

        console.log("PlayerX: " + playerX + "  PlayerY: " + playerY);
        
        var moved = false;
        
        var destinationTile;
        var tween;
        
        switch (direction) {
            case 'up':
                destX = playerX;
                destY = playerY - 1;
                break;
            
            case 'down':
                destX = playerX;
                destY = playerY + 1;
                break;
                
            case 'left':
                destX = playerX - 1;
                destY = playerY;
                break;
                
            case 'right':
                destX = playerX + 1;
                destY = playerY;
                break;
        }
        
        // Get the next tile info
        destinationTile = matrix.tile[destX][destY]; // FIXME: If I quickly press up-right (or some other horizontal-vertical combination), undefined logs
        
        var shouldSaveItem = false;
        
        // Perform different actions depending on the ID of the destination tile
        switch (destinationTile.id) {
            case 'item':
                // Check if item must be used on pick up
                if (destinationTile.objectReference.useOnPickUp) {
                    destinationTile.objectReference.Use();
                    destinationTile.objectReference.soundRef.play();
                    console.log("Use item directly: " + destinationTile.objectReference.name);
                    destinationTile.objectReference.spriteRef.destroy();
                }
                // If item is to be stored, take the item if inventory is not full
                else if (this.inventory.length < this.inventorySize) {
                    this.inventory.push(destinationTile.objectReference);
                    destinationTile.objectReference.soundRef.play();
                    console.log("Take item: " + destinationTile.objectReference.name);
                    destinationTile.objectReference.spriteRef.destroy();
                }
                
                // If inventory is full, hold temporarily the object of the objectMatrix in a player's variable, drop it in the next move
                else {
                    console.log(this.auxItemRef);
                    shouldSaveItem = true;
                }
                
                //console.log("Inventory size:" + Player.inventorySize);
                Game.updatePlayerItemsOnScreen();
                
                console.log("Player moved");
                tween = game.add.tween(this.sprite).to( { x: destX * 8, y: destY * 8 }, 100, Phaser.Easing.Linear.None, true);
                
                // Don't break so that it also performs the 'none' code

            case 'none':
                console.log("Player moved");
                tween = game.add.tween(this.sprite).to( { x: destX * 8, y: destY * 8 }, 100, Phaser.Easing.Linear.None, true);
                
                // Update objectMatrix
                matrix.tile[destX][destY] = Game.OBJ_PLAYER;
                matrix.tile[playerX][playerY] = this.auxItemRef.length > 0 ? this.auxItemRef.pop() : Game.OBJ_NONE;
                //console.log("Previous tile transforms into:");
                //console.log(Game.matrix[playerX][playerY]);
                this.matrixPosX = destX;
                this.matrixPosY = destY;
                
                if (shouldSaveItem)
                    this.auxItemRef.push(destinationTile);
                    
                // Play walk sound
                this.walkSound = game.add.sound('walk');
                this.walkSound.play();

                // If the player has moved, lock input and movement until move ends. Also, update the objectsMatrix positions
                this.LockInput();
                tween.onComplete.add(Game.ProcessEnemiesTurn, Game); // Trigger enemies turn 
                
                break;
                
            case 'wall':
                // Do nothing, Maybe play a sound like in Pokemon
                console.log("Player hit a wall with the face >.<");
                break;
                
            case 'enemy':
                // Move and return (attack)
                this.LockInput();
                tween = game.add.tween(this.sprite).to( { x: destX * 8, y: destY * 8 }, 100, Phaser.Easing.Circular.In, true);
                var onTween1end = function() { 
                    var tween2 = game.add.tween(this.sprite).to( { x: playerX * 8, y: playerY * 8 }, 100, Phaser.Easing.Circular.Out, true);
                    tween2.onComplete.add( Game.ProcessEnemiesTurn, Game); // Trigger enemies turn
                };
                tween.onComplete.add(onTween1end, this);
                tween.onComplete.add(function() {
                    // Damage the enemy
                    destinationTile.objectReference.TakeDamage(Player.currentWeapon.damage);
                    // Play enemy hit sound
                    this.enemyHitSound = game.add.sound('enemyHit');
                    this.enemyHitSound.play();
                })
                break;
                
            case 'upStairs':
                // Teleport to village (1 day passes)
                console.log("Go back to village");
                
                tween = game.add.tween(this.sprite).to( { x: destX * 8, y: destY * 8 }, 100, Phaser.Easing.Linear.None, true);
                
                matrix.tile[playerX][playerY] = Game.OBJ_NONE;

                // Lock input and movement until move ends. At movement end, teleport
                this.LockInput();
                tween.onComplete.add(Game.GoToVillage, Game);
                
                break;
                
            case 'downStairs':
                // Teleport to next dungeon level
                console.log("Teleport to next dungeon level");
                
                tween = game.add.tween(this.sprite).to( { x: destX * 8, y: destY * 8 }, 100, Phaser.Easing.Linear.None, true);
                
                matrix.tile[playerX][playerY] = Game.OBJ_NONE;

                if (this.atVillage) {
                    tween.onComplete.add(function() {
                        // restore previous level
                        Game.GoToDungeon();
                    });
                }
                else {
                    tween.onComplete.add(function() {
                        // generate new level
                        Game.ClearLevelData();
                        Game.generateMap();
                        Game.fillTileMap();
                        
    
    
                        // Destroy and re-create player's sprite for Z positioning
                        Player.sprite.destroy();
                        Player.sprite = game.add.sprite(0, 0, 'playerIdle');
                        Player.sprite.animations.add('idle', [0, 1, 2, 3], 6.4, true);
                        Player.sprite.animations.add('hit', [4, 5], 8, false);
                        Player.sprite.animations.play('idle');
                    
                        Player.sprite.x = Player.matrixPosX * Game.TILE_SIZE/2;
                        Player.sprite.y = Player.matrixPosY * Game.TILE_SIZE/2;
    
                        Player.dungeonLevel++;
                        Game.updateDungeonLevelOnScreen();
                    });
                }
                
                // Lock input and movement until move ends. At movement end, teleport
                //this.LockInput();
                //tween.onComplete.add(Game.GoToNextDungeonLevel, this);
                
                break;
                
            case 'villager':
                console.log("Talked to a villager");
                destinationTile.objectReference.Talk();
                break;
        }
        
    },
    
    LockInput : function() {
        this.isMoving = true;
        Game.inputLocked = true;
    },
    
    UnlockInput : function() {
      
      console.log("UnlockInput called. Enemy turn: " + Game.enemyTurn + " enemies: " + Game.enemiesList.length);
      
        // If every enemy's turn has passed, or at village, or in game over
        if (this.atVillage/* && Game.enemyTurn >= Game.villagersList.length - 1*/) {
            // Unlock movement and input again
            this.isMoving = false;
            Game.inputLocked = false;
        }
        
        else if (Game.enemyTurn >= Game.enemiesList.length - 1 || this.playerHP <= 0) {
            // Unlock movement and input again
            this.isMoving = false;
            Game.inputLocked = false;
        }
    },
    
};