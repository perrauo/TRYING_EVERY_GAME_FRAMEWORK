// enemies JS file. Contains Enemy classes.

/*global game, Game, Player*/


// global namespace
var ENEMY = ENEMY || {};


// Don't do new BaseEnemy anywhere else than subclasses
ENEMY.BaseEnemy = function(options) {
    
    options = options || {};

    // Base class constructor
    if (this instanceof ENEMY.BaseEnemy) {
        
        // Add properties and their default values
        
        this.name = options.name || "DefaultEnemy";
        this.enemytype = options.enemytype || ""; // Needed?
        this.sprite = options.sprite || "";
        this.hp = options.hp || 3;
        this.attack = options.attack || 1;
        this.matrixPosX = options.matrixPosX || 0;
        this.matrixPosY = options.matrixPosY || 0;
        
        // Add functions
        
        this.GetInfo = function() {
           console.log("Override the GetInfo() function of BaseEnemy in subclasses");
           console.log(this);
        };
        
        
        this.TakeDamage = function(damage) {
            this.hp -= damage;
            this.hp < 0 ? 0 : this.hp;
            
            console.log("Enemy " + this.name + " took " + damage + " damage points. Remaining HP: " + this.hp);
            
            if (this.hp <= 0) {
                this.Die();
            }
            
            // Animation to show enemy took damage (two frames of white fill)
            this.spriteRef.animations.play('hit');
            var restoreIdleAnimation = function() { this.spriteRef.animations.play('idle'); };
            this.spriteRef.animations.currentAnim.onComplete.add(restoreIdleAnimation, this);
            
            // Play a sound?
        };
        
        
        this.Die = function() {
            console.log("Enemy " + this.name + " dies!");
            
            // Play enemy death sound
            this.enemyDeathSound = game.add.sound('enemyDeath');
            this.enemyDeathSound.play();
            
            // Update objectMatrix and enemiesList
            Game.objectMatrix[this.matrixPosX][this.matrixPosY] = Game.OBJ_NONE;
            for (var i = 0; i < Game.enemiesList.length; i++) {
                if (Game.enemiesList[i] === this)
                    Game.enemiesList.splice(i, 1);
            }

            // Play some animation, kill the sprite, delete the object (or leave it in dead status)
            this.spriteRef.kill();
        };
        
        

        this.DecideAction = function() {
           console.log("Override the DecideAction() function of BaseEnemy in subclasses with specific AI rules");
        };
        
        
        this.Move = function(direction) {
           console.log("BaseEnemy Move()");
           
            var destX;
            var destY;
            var destinationTile;
            var tween;
            
            switch (direction) {
                case 'up':
                    destX = this.matrixPosX;
                    destY = this.matrixPosY - 1;
                    break;
                
                case 'down':
                    destX = this.matrixPosX;
                    destY = this.matrixPosY + 1;
                    break;
                    
                case 'left':
                    destX = this.matrixPosX - 1;
                    destY = this.matrixPosY;
                    break;
                    
                case 'right':
                    destX = this.matrixPosX + 1;
                    destY = this.matrixPosY;
                    break;
            }
            
            destinationTile = Game.objectMatrix[destX][destY];
           
           
                   // Perform different actions depending on the ID of the destination tile
            switch (destinationTile.id) {
                case 'none':
    
                    console.log("Enemy moved");
                    tween = game.add.tween(this.spriteRef).to( { x: destX * 8, y: destY * 8 }, 100, Phaser.Easing.Linear.None, true);
                    Player.UnlockInput();
                    
                    // Update objectMatrix
                    Game.objectMatrix[destX][destY] = { id: "enemy",  objectReference: this };
                    Game.objectMatrix[this.matrixPosX][this.matrixPosY] = Game.OBJ_NONE;
                    this.matrixPosX = destX;
                    this.matrixPosY = destY;
                    break;
                    
                case 'player':
                    // Move and return (attack)
                    Player.LockInput();
                    tween = game.add.tween(this.spriteRef).to( { x: destX * 8, y: destY * 8 }, 100, Phaser.Easing.Circular.In, true);
                    var onTween1end = function() { 
                        var tween2 = game.add.tween(this.spriteRef).to( { x: this.matrixPosX * 8, y: this.matrixPosY * 8 }, 100, Phaser.Easing.Circular.Out, true);
                        tween2.onComplete.add(Player.UnlockInput, Player);
                        
                        // Calculate a chance to hit the player
                        if (Math.random() > 0.5) {
                            console.log("Enemy hits the player with " + this.attack + " damage points!");
                            // Damage the player
                            destinationTile.objectReference.killedBy = this.name;
                            destinationTile.objectReference.UpdatePlayerHP(-this.attack);
                            // Play sound
                        }
                        else {
                            console.log("Enemy attack misses!");
                            // Play sound?
                        }
                        
                    };
                    tween.onComplete.add(onTween1end, this);
                    break;
                
                default:
                //case 'enemy':
                //case 'item':
                //case 'wall':
                    // Do nothing
                    console.log("Enemy did nothing");
                    Player.UnlockInput();
                    break;
            }

        };
    
    // Return an instance of the base class to subclasses
    } else {
        return new ENEMY.BaseEnemy(options);
    }
}


// Define the Rat constructor
ENEMY.Rat = function(options) {
    // Call the parent constructor, making sure (using call)
    // that "this" is set correctly during the call
    ENEMY.BaseEnemy.call(this, options);
    
    options = options || {};
    
    // Initialize base class properties
    this.name = options.name || "A  RAT";
    this.sprite = options.sprite || "ratIdle";
    this.attack = options.attack || 1;
    
    // Add sprite/animation
    this.spriteRef = game.add.sprite(this.matrixPosX * 8, this.matrixPosY * 8, this.sprite);
    this.spriteRef.animations.add('idle', [0, 1, 2, 3], 6.4, true);
    this.spriteRef.animations.add('hit', [4, 5], 8, false);
    this.spriteRef.animations.play('idle');
        
    // Create and initialize subclass-specific properties and methods
    this.DecideAction = function() {
        
       // Find path to player and decide what to do according to that
       var result = ENEMY.findPath(this.matrixPosX, this.matrixPosY, Game.objectMatrix, 'player');
       
       console.log("Enemy " + this.name + " deciding action...");
       console.log(result);
       
       var moveRandom = false;

       // Decide what to do depending on distance to the player
       if (result) {
           // Attack if next to the player
           if (result.length == 1) {
               // Attack!
               this.Move(result[0]);
           }
           // Move 1 step towards the player if distance between both is less than 6 tiles
           else if (result.length < 6) {
               this.Move(result[0]);
           }
           // Too far. Move randomly sometimes
           else {
               moveRandom = true;
           }
       }

       // Can't find the player
       else {
           moveRandom = true;
       }

       // Too far. Move randomly sometimes
       if (moveRandom && Math.random() > 0.5) {
           console.log("Enemy " + this.name + " moved randomly");
           var directions = ["up", "right", "down", "left"];
           this.Move(directions[Math.floor(Math.random() * 4)]);
       }
       else {
           console.log("Enemy " + this.name + " did nothing");
           Player.UnlockInput();
       }
    };
}
// Create a Rat.prototype object that inherits from BaseEnemy.prototype.
ENEMY.Rat.prototype = Object.create(ENEMY.BaseEnemy.prototype); // Object.create may not work on older JS engines. Solution: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
// Set the "constructor" property to refer to Rat
ENEMY.Rat.prototype.constructor = ENEMY.Rat;



// Define the Rat constructor
ENEMY.Bat = function(options) {
    // Call the parent constructor, making sure (using call)
    // that "this" is set correctly during the call
    ENEMY.BaseEnemy.call(this, options);
    
    options = options || {};
    
    // Initialize base class properties
    this.name = options.name || "A  BAT";
    this.sprite = options.sprite || "batIdle";
    this.attack = options.attack || 1;
    
    // Add sprite/animation
    this.spriteRef = game.add.sprite(this.matrixPosX * 8, this.matrixPosY * 8, this.sprite);
    this.spriteRef.animations.add('idle', [0, 1, 2, 3], 6.4, true);
    this.spriteRef.animations.add('hit', [4, 5], 8, false);
    this.spriteRef.animations.play('idle');
        
    // Create and initialize subclass-specific properties and methods
    this.DecideAction = function() {
        
       // Find path to player and decide what to do according to that
       var result = ENEMY.findPath(this.matrixPosX, this.matrixPosY, Game.objectMatrix, 'player');
       
       console.log("Enemy " + this.name + " deciding action...");
       console.log(result);
       
       var moveRandom = false;

       // Decide what to do
       if (result) {
           // Attack if next to the player
           if (result.length == 1) {
               // Attack!
               this.Move(result[0]);
           }
           // Move 1 step towards the player
           else {
               this.Move(result[0]);
           }
       }

       // Can't find the player
       else {
           moveRandom = true;
       }

       // Too far. Move randomly sometimes
       if (moveRandom && Math.random() > 0.5) {
           console.log("Enemy " + this.name + " moved randomly");
           var directions = ["up", "right", "down", "left"];
           this.Move(directions[Math.floor(Math.random() * 4)]);
       }
       else {
           console.log("Enemy " + this.name + " did nothing");
           Player.UnlockInput();
       }
    };
}
// Create a Bat.prototype object that inherits from BaseEnemy.prototype.
ENEMY.Bat.prototype = Object.create(ENEMY.BaseEnemy.prototype); // Object.create may not work on older JS engines. Solution: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
// Set the "constructor" property to refer to Bat
ENEMY.Bat.prototype.constructor = ENEMY.Bat;



// Define the Snake constructor
ENEMY.Snake = function(options) {
    // Call the parent constructor, making sure (using call)
    // that "this" is set correctly during the call
    ENEMY.BaseEnemy.call(this, options);
    
    options = options || {};
    
    // Initialize base class properties
    this.name = options.name || "A  SNAKE";
    this.sprite = options.sprite || "snakeIdle";
    this.attack = options.attack || 2;
    
    // Add sprite/animation
    this.spriteRef = game.add.sprite(this.matrixPosX * 8, this.matrixPosY * 8, this.sprite);
    this.spriteRef.animations.add('idle', [0, 1, 2, 3], 6.4, true);
    this.spriteRef.animations.add('hit', [4, 5], 8, false);
    this.spriteRef.animations.play('idle');
        
    // Create and initialize subclass-specific properties and methods
    this.DecideAction = function() {
        
       // Find path to player and decide what to do according to that
       var result = ENEMY.findPath(this.matrixPosX, this.matrixPosY, Game.objectMatrix, 'player');
       
       console.log("Enemy " + this.name + " deciding action...");
       console.log(result);
       
       var moveRandom = false;

       // Decide what to do depending on distance to the player
       if (result) {
           // Attack if next to the player
           if (result.length == 1) {
               // Attack!
               this.Move(result[0]);
           }
           // Move 1 step towards the player if distance between both is less than 6 tiles
           else if (result.length < 6) {
               this.Move(result[0]);
           }
           // Too far. Move randomly sometimes
           else {
               moveRandom = true;
           }
       }

       // Can't find the player
       else {
           moveRandom = true;
       }

       // Too far. Move randomly sometimes
       if (moveRandom && Math.random() > 0.5) {
           console.log("Enemy " + this.name + " moved randomly");
           var directions = ["up", "right", "down", "left"];
           this.Move(directions[Math.floor(Math.random() * 4)]);
       }
       else {
           console.log("Enemy " + this.name + " did nothing");
           Player.UnlockInput();
       }
    };
}
// Create a Snake.prototype object that inherits from BaseEnemy.prototype.
ENEMY.Snake.prototype = Object.create(ENEMY.BaseEnemy.prototype); // Object.create may not work on older JS engines. Solution: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
// Set the "constructor" property to refer to Snake
ENEMY.Snake.prototype.constructor = ENEMY.Snake;



// Define the Snake constructor
ENEMY.Fatzombie = function(options) {
    // Call the parent constructor, making sure (using call)
    // that "this" is set correctly during the call
    ENEMY.BaseEnemy.call(this, options);
    
    options = options || {};
    
    // Initialize base class properties
    this.name = options.name || "A  FAT  ZOMBIE";
    this.sprite = options.sprite || "fatzombieIdle";
    this.attack = options.attack || 1;
    
    // Add sprite/animation
    this.spriteRef = game.add.sprite(this.matrixPosX * 8, this.matrixPosY * 8, this.sprite);
    this.spriteRef.animations.add('idle', [0, 1, 2, 3], 6.4, true);
    this.spriteRef.animations.add('hit', [4, 5], 8, false);
    this.spriteRef.animations.play('idle');
        
    // Create and initialize subclass-specific properties and methods
    this.DecideAction = function() {
        
       // Find path to player and decide what to do according to that
       var result = ENEMY.findPath(this.matrixPosX, this.matrixPosY, Game.objectMatrix, 'player');
       
       console.log("Enemy " + this.name + " deciding action...");
       console.log(result);
       
       var moveRandom = false;

       // Decide what to do depending on distance to the player
       if (result) {
           // Attack if next to the player
           if (result.length == 1) {
               // Attack!
               this.Move(result[0]);
           }
           // Move 1 step towards the player if distance between both is less than 6 tiles
           else if (result.length < 6) {
               this.Move(result[0]);
           }
           // Too far. Move randomly sometimes
           else {
               moveRandom = true;
           }
       }

       // Can't find the player
       else {
           moveRandom = true;
       }

       // Too far. Move randomly sometimes
       if (moveRandom && Math.random() > 0.5) {
           console.log("Enemy " + this.name + " moved randomly");
           var directions = ["up", "right", "down", "left"];
           this.Move(directions[Math.floor(Math.random() * 4)]);
       }
       else {
           console.log("Enemy " + this.name + " did nothing");
           Player.UnlockInput();
       }
    };
}
// Create a Fatzombie.prototype object that inherits from BaseEnemy.prototype.
ENEMY.Fatzombie.prototype = Object.create(ENEMY.BaseEnemy.prototype); // Object.create may not work on older JS engines. Solution: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
// Set the "constructor" property to refer to Fatzombie
ENEMY.Fatzombie.prototype.constructor = ENEMY.Fatzombie;



// Register enemies
ENEMY.Types = [
    ENEMY.Rat,
    ENEMY.Snake,
    ENEMY.Fatzombie,
];








// Utils: Distance, pathfinding...

ENEMY.distance = function(x1, y1, x2, y2) {
    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);

    var min = Math.min(dx, dy);
    var max = Math.max(dx, dy);

    var diagonalSteps = min;
    var straightSteps = max - min;

    return 1.4142135624 * diagonalSteps + straightSteps; // 1.4142135624 ≈ sqrt(2)
}


// Pathfinding algorithm
ENEMY.findPath = function(startX, startY, grid, goalID) {
    
    // First, copy the grid to avoid modifications in the original matrix
    var copiedGrid = new Array(Game.TILEMAP_HEIGHT * 2);
    for (var i = 0; i < Game.TILEMAP_HEIGHT * 2; i++) {
        copiedGrid[i] = new Array(Game.TILEMAP_WIDTH * 2);
        for (var j = 0; j < Game.TILEMAP_WIDTH * 2; j++) {
            copiedGrid[i][j] = grid[j][i].id;
        }
    }
    
    var distanceFromLeft = startX;
    var distanceFromTop = startY;

    // Each "position" will store its coordinates
    // and the shortest path required to arrive there
    var position = {
        distanceFromTop: distanceFromTop,
        distanceFromLeft: distanceFromLeft,
        path: [],
        status: 'Start'
    };

    // Initialize the queue with the start position already inside
    var queue = [position];

    // Loop through the grid searching for the goal
    while (queue.length > 0) {
        // Take the first position off the queue
        var currentPosition = queue.shift();

        var directions = ["up", "right", "down", "left"];
        for (var dir in directions) {
            var newPosition = ENEMY.exploreInDirection(currentPosition, directions[dir], copiedGrid, goalID);
            if (newPosition.status === 'Goal') {
                return newPosition.path;
            }
            else if (newPosition.status === 'Valid') {
                if (queue.length < 20) // Cut
                    queue.push(newPosition);
            }

        }
    }

    // No valid path found
    return false;

};

// This function will check a position's status
// (a position is "valid" if it is on the grid, is not an "obstacle",
// and has not yet been visited by our algorithm)
// Returns "Valid", "Invalid", "Blocked", or "Goal"
ENEMY.checkPosition = function(position, grid, goalID) {

    var dft = position.distanceFromTop;
    var dfl = position.distanceFromLeft;

    if (position.distanceFromLeft < 0 ||
        position.distanceFromLeft >= grid[0].length ||
        position.distanceFromTop < 0 ||
        position.distanceFromTop >= grid.length) {

        // location is not on the grid--return false
        return 'Invalid';
    }
    else if (grid[dft][dfl] === goalID) {
        return 'Goal';
    }
    else if (grid[dft][dfl] !== 'none') {
        // position is either an obstacle or has been visited
        return 'Blocked';
    }
    else {
        return 'Valid';
    }
};


// Explores the grid from the given position in the given direction
ENEMY.exploreInDirection = function(currentLocation, direction, grid, goalID) {
    var newPath = currentLocation.path.slice();
    newPath.push(direction);

    var dft = currentLocation.distanceFromTop;
    var dfl = currentLocation.distanceFromLeft;

    if (direction === 'up') {
        dft -= 1;
    }
    else if (direction === 'right') {
        dfl += 1;
    }
    else if (direction === 'down') {
        dft += 1;
    }
    else if (direction === 'left') {
        dfl -= 1;
    }

    var newLocation = {
        distanceFromTop: dft,
        distanceFromLeft: dfl,
        path: newPath,
        status: 'Unknown'
    };
    newLocation.status = ENEMY.checkPosition(newLocation, grid, goalID);

    // If this new location is valid, mark it as 'Visited'
    if (newLocation.status === 'Valid') {
        grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = 'Visited';
    }

    return newLocation;
};
