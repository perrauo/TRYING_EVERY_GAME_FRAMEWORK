// villagers JS file. Contains Villager classes.

/*global game, Game, Player*/


// global namespace
var VILLAGERS = VILLAGERS || {};


// Don't do new BaseVillager anywhere else than subclasses
VILLAGERS.BaseVillager = function(options) {
    
    options = options || {};

    // Base class constructor
    if (this instanceof VILLAGERS.BaseVillager) {
        
        // Add properties and their default values
        
        this.name = options.name || "DefaultVillager";
        this.villagertype = options.villagertype || ""; // Needed?
        this.sprite = options.sprite || "";
        this.matrixPosX = options.matrixPosX || 0;
        this.matrixPosY = options.matrixPosY || 0;
        this.message = options.message || "I DON'T KNOW WHAT TO SAY\nIMPLEMENT ME, PLEASE!";
        this.alreadyTalked = options.alreadyTalked || false;
        this.offeringItem = options.offeringItem || false;
        this.offeringQuest = options.offeringQuest || false;
        
        // Add functions
        
        this.GetInfo = function() {
           console.log("Override the GetInfo() function of BaseVillager in subclasses");
           console.log(this);
        };
        
        this.Talk = function() {
            console.log("Override the Talk() function of BaseVillager in subclasses")
            this.message = Game.getRandomCharacterLine(this.name, this.offeringItem, this.offeringQuest);
            console.log(this.message);
            Game.textWriter(this.message);
            this.alreadyTalked = true;
        }

        this.DecideAction = function() {
           console.log("Override the DecideAction() function of BaseVillager in subclasses with specific AI rules");
        };
        
        
        this.Move = function(direction) {
           console.log("BaseVillager Move()");
           
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
            
            destinationTile = Game.villageMatrix[destX][destY];
           
           
            // Perform different actions depending on the ID of the destination tile
            switch (destinationTile.id) {
                case 'none':
    
                    console.log("Villager " + this.name + " moved");
                    tween = game.add.tween(this.spriteRef).to( { x: destX * 8, y: destY * 8 }, 100, Phaser.Easing.Linear.None, true);
                    Player.UnlockInput();
                    
                    // Update villageMatrix
                    Game.villageMatrix[destX][destY] = { id: "villager",  objectReference: this };
                    Game.villageMatrix[this.matrixPosX][this.matrixPosY] = Game.OBJ_NONE;
                    this.matrixPosX = destX;
                    this.matrixPosY = destY;
                    break;
                
                default:
                //case 'VILLAGERS':
                //case 'item':
                //case 'wall':
                    // Do nothing
                    Player.UnlockInput();
                    break;
            }

        };
    
    // Return an instance of the base class to subclasses
    } else {
        return new VILLAGERS.BaseVillager(options);
    }
}


// Define the Adult constructor
VILLAGERS.Adult = function(options) {
    // Call the parent constructor, making sure (using call)
    // that "this" is set correctly during the call
    VILLAGERS.BaseVillager.call(this, options);
    
    options = options || {};
    
    // Initialize base class properties
    this.name = options.name || "Adult";
    this.sprite = options.sprite || "playerIdle";
    
    // Add sprite/animation
    this.spriteRef = game.add.sprite(this.matrixPosX * 8, this.matrixPosY * 8, this.sprite);
    this.spriteRef.animations.add('idle', [0, 1, 2, 3], 6.4, true);
    this.spriteRef.animations.play('idle');
        
    // Create and initialize subclass-specific properties and methods
    this.DecideAction = function() {
        
        // Specific behaviour for Alf, the dog :3
        if (this.name != "ALF") {
            Player.UnlockInput();
            return;
        }
        
       // Find path to player and decide what to do according to that
       var pathToPlayer = ENEMY.findPath(this.matrixPosX, this.matrixPosY, Game.villageMatrix, 'player');
       var pathToReturn = ENEMY.findPath(this.matrixPosX, this.matrixPosY, Game.villageMatrix, 'dogPlace');
       
        var moveRandom = false;
        console.log("Already talked:");
        console.log(this.alreadyTalked);
        console.log("Path to player:");
        console.log(pathToPlayer);
        console.log("Path to return:");
        console.log(pathToReturn);
        // Decide what to do depending on distance to the player and dog's place
        if (pathToPlayer) {
            console.log("Path to player");
            if (pathToReturn) {
                console.log("Path to return");
                if (Math.random() > 0.8) {
                    moveRandom = true;
                    console.log("ALF walks random");
                }
                else {

                    if (this.alreadyTalked && pathToPlayer.length > 2) {
                        console.log("ALF walks towards player");
                        this.Move(pathToPlayer[0]);
                        
                        if (pathToReturn.length >= 12) {
                            this.alreadyTalked = false;
                        }
                    }
                    else if (pathToReturn.length >= 5) {
                        console.log("ALF walks towards home");
                        this.Move(pathToReturn[0]);
                    }
                    else {
                        this.moveRandom = true;
                        console.log("ALF walks random 2");
                    }
                }
           }
       }
       
       //console.log("Villager " + this.name + " deciding action...");
       
       // Move randomly sometimes
       if (moveRandom) {
           if (Math.random() > 0.4) {
               console.log("Villager " + this.name + " moved randomly");
               var directions = ["up", "right", "down", "left"];
               this.Move(directions[Math.floor(Math.random() * 4)]);
           }
           else
               Player.UnlockInput();
       }
       
    };
}
// Create a Adult.prototype object that inherits from BaseVillager.prototype.
VILLAGERS.Adult.prototype = Object.create(VILLAGERS.BaseVillager.prototype); // Object.create may not work on older JS engines. Solution: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
// Set the "constructor" property to refer to Adult
VILLAGERS.Adult.prototype.constructor = VILLAGERS.Adult;




// Register enemies
VILLAGERS.Types = [
    VILLAGERS.Adult,
];
