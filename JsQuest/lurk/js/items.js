// Items JS file. Contains item function and variables.

/*global game, Game, Player*/


// global namespace
var ITEMS = ITEMS || {};



// Don't do new BaseItem anywhere else than subclasses
ITEMS.BaseItem = function(options) {
    
    // If no options, create an empty object
    options = options || {};
    
    // Base class constructor
    if (this instanceof ITEMS.BaseItem) {
        
        // Add properties and their default values
        this.name = options.name || "DEFAULT ITEM";
        this.itemtype = options.itemtype || "item";
        this.sprite = options.sprite || 'bottomUINullHeart';
        this.portraitSprite = options.sprite || 'bottomUINullHeart';     
        this.matrixPosX = options.matrixPosX || -1; // Useful in this class??
        this.matrixPosY = options.matrixPosY ||  -1; // Useful in this class??
        this.useOnPickUp = options.useOnPickUp || false;
        this.pickupSound = options.pickupSound || 'coin'; // change this to generic pickup sound <<<<<<<<<<<<<<<<<<<<
        
        // Add functions
        this.Use = function() {
           console.log("Override the Use() function in subclasses");
        };
    
    // Return an instance of the base class to subclasses
    } else {
        return new ITEMS.BaseItem(options);
    }
}



// Define the Bread constructor
ITEMS.Bread = function(options) {
    // Call the parent constructor, making sure (using call)
    // that "this" is set correctly during the call
    ITEMS.BaseItem.call(this, options);
    
    // If no options, create an empty object
    options = options || {};
    
    // Initialize base class properties
    this.name = options.name || "BREAD";
    this.sprite = options.sprite || "breadIcon";
    this.pickupSound = options.pickupSound || 'coin';
    this.portraitSprite = options.sprite || 'breadPortrait';

    // Add sprite/animation
    this.spriteRef = game.add.sprite(this.matrixPosX * 8, this.matrixPosY * 8, this.sprite);
    
    // Add sound
    this.soundRef = game.add.sound(this.pickupSound);
    
    // Create and initialize subclass-specific properties and methods
    this.Use = function() {
        console.log("Overriden Use() function of BaseItem in Bread");
        Player.UpdatePlayerHP(+1);
    };
}
// Create a Bread.prototype object that inherits from BaseItem.prototype.
ITEMS.Bread.prototype = Object.create(ITEMS.BaseItem.prototype); // Object.create may not work on older JS engines. Solution: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
// Set the "constructor" property to refer to Bread
ITEMS.Bread.prototype.constructor = ITEMS.Bread;



// Define the SmallHealthPotion constructor
ITEMS.SmallHealthPotion = function(options) {
    // Call the parent constructor, making sure (using call)
    // that "this" is set correctly during the call
    ITEMS.BaseItem.call(this, options);
    
    // If no options, create an empty object
    options = options || {};
    
    // Initialize base class properties
    this.name = options.name || "SMALL  HEALTH  POTION";
    this.sprite = options.sprite || "smallHealthPotionIcon";
    this.pickupSound = options.pickupSound || 'coin';
    this.portraitSprite = options.sprite || 'smallHealthPotionPortrait';

    // Add sprite/animation
    this.spriteRef = game.add.sprite(this.matrixPosX * 8, this.matrixPosY * 8, this.sprite);
    
    // Add sound
    this.soundRef = game.add.sound(this.pickupSound);
    
    // Create and initialize subclass-specific properties and methods
    this.Use = function() {
        console.log("Overriden Use() function of BaseItem in SmallHealthPotion");
        Player.UpdatePlayerHP(+2);
    };
}
// Create a SmallHealthPotion.prototype object that inherits from BaseItem.prototype.
ITEMS.SmallHealthPotion.prototype = Object.create(ITEMS.BaseItem.prototype); // Object.create may not work on older JS engines. Solution: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
// Set the "constructor" property to refer to SmallHealthPotion
ITEMS.SmallHealthPotion.prototype.constructor = ITEMS.SmallHealthPotion;



// Define the HealthPotion constructor
ITEMS.HealthPotion = function(options) {
    // Call the parent constructor, making sure (using call)
    // that "this" is set correctly during the call
    ITEMS.BaseItem.call(this, options);
    
    // If no options, create an empty object
    options = options || {};
    
    // Initialize base class properties
    this.name = options.name || "HEALTH  POTION";
    this.sprite = options.sprite || "healthPotionIcon";
    this.pickupSound = options.pickupSound || 'coin';
    this.portraitSprite = options.sprite || 'healthPotionPortrait';

    // Add sprite/animation
    this.spriteRef = game.add.sprite(this.matrixPosX * 8, this.matrixPosY * 8, this.sprite);
    
    // Add sound
    this.soundRef = game.add.sound(this.pickupSound);
    
    // Create and initialize subclass-specific properties and methods
    this.Use = function() {
        console.log("Overriden Use() function of BaseItem in HealthPotion");
        Player.UpdatePlayerHP(+3);
    };
}
// Create a HealthPotion.prototype object that inherits from BaseItem.prototype.
ITEMS.HealthPotion.prototype = Object.create(ITEMS.BaseItem.prototype); // Object.create may not work on older JS engines. Solution: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
// Set the "constructor" property to refer to HealthPotion
ITEMS.HealthPotion.prototype.constructor = ITEMS.HealthPotion;



// Define the LargeHealthPotion constructor
ITEMS.LargeHealthPotion = function(options) {
    // Call the parent constructor, making sure (using call)
    // that "this" is set correctly during the call
    ITEMS.BaseItem.call(this, options);
    
    // If no options, create an empty object
    options = options || {};
    
    // Initialize base class properties
    this.name = options.name || "LARGE  HEALTH  POTION";
    this.sprite = options.sprite || "largeHealthPotionIcon";
    this.pickupSound = options.pickupSound || 'coin';
    this.portraitSprite = options.sprite || 'largeHealthPotionPortrait';

    // Add sprite/animation
    this.spriteRef = game.add.sprite(this.matrixPosX * 8, this.matrixPosY * 8, this.sprite);
    
    // Add sound
    this.soundRef = game.add.sound(this.pickupSound);
    
    // Create and initialize subclass-specific properties and methods
    this.Use = function() {
        console.log("Overriden Use() function of BaseItem in LargeHealthPotion");
        Player.UpdatePlayerHP(+4);
    };
}
// Create a LargeHealthPotion.prototype object that inherits from BaseItem.prototype.
ITEMS.LargeHealthPotion.prototype = Object.create(ITEMS.BaseItem.prototype); // Object.create may not work on older JS engines. Solution: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
// Set the "constructor" property to refer to LargeHealthPotion
ITEMS.LargeHealthPotion.prototype.constructor = ITEMS.LargeHealthPotion;



// Define the UnknownLiquid constructor
ITEMS.UnknownLiquid = function(options) {
    // Call the parent constructor, making sure (using call)
    // that "this" is set correctly during the call
    ITEMS.BaseItem.call(this, options);
    
    // If no options, create an empty object
    options = options || {};
    
    // Initialize base class properties
    this.name = options.name || "UNKNOWN  LIQUID";
    this.sprite = options.sprite || "unknownLiquidIcon";
    this.pickupSound = options.pickupSound || 'coin';
    this.portraitSprite = options.sprite || 'unknownLiquidPortrait';

    // Add sprite/animation
    this.spriteRef = game.add.sprite(this.matrixPosX * 8, this.matrixPosY * 8, this.sprite);
    
    // Add sound
    this.soundRef = game.add.sound(this.pickupSound);
    
    // Create and initialize subclass-specific properties and methods
    this.Use = function() {
        console.log("Overriden Use() function of BaseItem in UnknownLiquid");
        // RANDOM EFFECT HERE
    };
}
// Create a UnknownLiquid.prototype object that inherits from BaseItem.prototype.
ITEMS.UnknownLiquid.prototype = Object.create(ITEMS.BaseItem.prototype); // Object.create may not work on older JS engines. Solution: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
// Set the "constructor" property to refer to UnknownLiquid
ITEMS.UnknownLiquid.prototype.constructor = ITEMS.UnknownLiquid;



// Define the Sack constructor
ITEMS.Sack = function(options) {
    // Call the parent constructor, making sure (using call)
    // that "this" is set correctly during the call
    ITEMS.BaseItem.call(this, options);
    
    // If no options, create an empty object
    options = options || {};
    
    // Initialize base class properties
    this.name = options.name || "Sack";
    this.sprite = options.sprite || "sackIcon";
    this.pickupSound = options.pickupSound || 'coin';
    
    // Add sprite/animation
    this.spriteRef = game.add.sprite(this.matrixPosX * 8, this.matrixPosY * 8, this.sprite);
    
    // Use this item on pick up
    this.useOnPickUp = true;
    
    // Add sound
    this.soundRef = game.add.sound(this.pickupSound);
    
    // Create and initialize subclass-specific properties and methods
    this.Use = function() {
        console.log("Overriden Use() function of BaseItem in Sack");
        Player.UpdateInventorySize(+1);
    };
}
// Create a Sack.prototype object that inherits from BaseItem.prototype.
ITEMS.Sack.prototype = Object.create(ITEMS.BaseItem.prototype);
// Set the "constructor" property to refer to Sack
ITEMS.Sack.prototype.constructor = ITEMS.Sack;



// Define the Coin constructor
ITEMS.Coin = function(options) {
    // Call the parent constructor, making sure (using call)
    // that "this" is set correctly during the call
    ITEMS.BaseItem.call(this, options);
    
    // If no options, create an empty object
    options = options || {};
    
    // Initialize base class properties
    this.name = options.name || "COIN";
    this.sprite = options.sprite || "coin";
    this.coinAmount = options.coinAmount || 1;
    this.pickupSound = options.pickupSound || 'coin';
    
    // Add sprite/animation
    this.spriteRef = game.add.sprite(this.matrixPosX * 8, this.matrixPosY * 8, this.sprite);
    this.spriteRef.animations.add('pop', [0, 1, 2, 3], 10, false);
    this.spriteRef.animations.add('loop', [4, 5, 6, 7], 10, true);
    this.spriteRef.animations.play('pop');
    this.spriteRef.animations.currentAnim.onComplete.add(function () {this.spriteRef.animations.play('loop')}, this);
    
    // Add sound
    this.soundRef = game.add.sound(this.pickupSound);
    
    // Use this item on pick up
    this.useOnPickUp = true;
    
    // Create and initialize subclass-specific properties and methods
    this.Use = function() {
        console.log("Overriden Use() function of BaseItem in Coin");
        Player.UpdateCoins(this.coinAmount);
    };
}
// Create a Coin.prototype object that inherits from BaseItem.prototype.
ITEMS.Coin.prototype = Object.create(ITEMS.BaseItem.prototype);
// Set the "constructor" property to refer to Coin
ITEMS.Coin.prototype.constructor = ITEMS.Coin;




// Define the Punch constructor
ITEMS.Punch = function(options) {
    // Call the parent constructor, making sure (using call)
    // that "this" is set correctly during the call
    ITEMS.BaseItem.call(this, options);
    
    // If no options, create an empty object
    options = options || {};

    // Initialize base class properties
    this.name = options.name || "PUNCH";
    this.sprite = options.sprite || "punchIcon";
    this.damage = options.damage || 1;
    
    // Create and initialize subclass-specific properties and methods
    this.Use = function() {
        console.log("Overriden Use() function of BaseItem in Punch");
    };
    
    this.GetInfo = function() {
        console.log(this);
    }
}
// Create a Punch.prototype object that inherits from BaseItem.prototype.
ITEMS.Punch.prototype = Object.create(ITEMS.BaseItem.prototype);
// Set the "constructor" property to refer to Punch
ITEMS.Punch.prototype.constructor = ITEMS.Punch;




// Define the SimpleSword constructor
ITEMS.Sword = function(options) {
    // Call the parent constructor, making sure (using call)
    // that "this" is set correctly during the call
    ITEMS.BaseItem.call(this, options);
    
    // If no options, create an empty object
    options = options || {};

    // Initialize base class properties
    this.name = options.name || "SWORD";
    this.itemtype = options.itemtype || "weapon";
    this.sprite = options.sprite || "swordIcon";
    this.damage = options.damage || 2;
    this.pickupSound = options.pickupSound || 'coin';
    this.portraitSprite = options.sprite || 'swordPortrait';

    // Add sprite/animation
    this.spriteRef = game.add.sprite(this.matrixPosX * 8, this.matrixPosY * 8, this.sprite);
    
    // Add sound
    this.soundRef = game.add.sound(this.pickupSound);
    
    // Create and initialize subclass-specific properties and methods
    this.Use = function() {
        console.log("Overriden Use() function of BaseItem in Sword");
    };
    
    this.GetInfo = function() {
        console.log(this);
    }
}
// Create a Sword.prototype object that inherits from BaseItem.prototype.
ITEMS.Sword.prototype = Object.create(ITEMS.BaseItem.prototype);
// Set the "constructor" property to refer to Sword
ITEMS.Sword.prototype.constructor = ITEMS.SimpleSword;





// Register items that can be picked
ITEMS.Types = [
    ITEMS.Bread,
    ITEMS.SmallHealthPotion,
    ITEMS.HealthPotion,
    ITEMS.LargeHealthPotion,
    ITEMS.Sword,
    ITEMS.Sack,
    ITEMS.Coin,
];


// TESTING

/*var sword1 = new ITEMS.SimpleSword(); // No modifications. Default values
var sword2 = new ITEMS.SimpleSword({damage:5}); // Passed options with damage 5
var sword3 = new ITEMS.SimpleSword(); // Create with default values, modify damage after creation
sword3.damage = 999;

// Log all three swords info
sword1.GetInfo();
sword2.GetInfo();
sword3.GetInfo();
*/