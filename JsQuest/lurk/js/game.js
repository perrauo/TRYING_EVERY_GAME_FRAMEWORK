// Game JS file. Contains the game state

/*global Phaser, game, Player, ENEMY, ITEMS, VILLAGERS*/

var Game = {


/////////////// Variables /////////////// 
// variableName : defaultValue,
// CONSTANT_NAME: value,
// then they can be accessed with this.variableName

TILEMAP_WIDTH   : 10, // changed to 16px tiles, so 10 tiles instead of 20
TILEMAP_HEIGHT  : 7, // changed to 16px tiles, so 7 tiles instead of 14
TILE_SIZE       : 16,

// Tilemap and layers
tilemap     : undefined,

// Define object types here
OBJ_NONE        : { id: "none",         objectReference: {}        }, // Used to fill the objectMatrix
OBJ_WALL        : { id: "wall",         objectReference: {}        }, // Used for collisions
OBJ_UPSTAIRS    : { id: "upStairs",     objectReference: {}        }, // Used to teleport to the village
OBJ_DOWNSTAIRS  : { id: "downStairs",   objectReference: {}        }, // Used to teleport to the next dungeon level
OBJ_PLAYER      : { id: "player",       objectReference: Player    },
OBJ_DOGPLACE    : { id: "dogPlace",     objectReference: {}        },
//OBJ_ITEM      : { id: "item",         objectReference: {}        }, // Don't use this global OBJ_ITEM. Instantiate anonymously at objectMaxtrix fill
//OBJ_ENEMY     : { id: "enemy",        objectReference: {}        }, // Don't use this global OBJ_ENEMY. Instantiate anonymously at objectMaxtrix fill


// Matrix of tiles and objects
tileMatrix  : undefined, // Uses TILE_SIZE (16px)
objectMatrix: undefined, // Uses TILE_SIZE / 2 (8px)

// Manually-filled objects matrix for village (collisions, people, etc.)
villageMatrix : [],
villagersList : [],
villageSprite : undefined,

// Lists of enemies and items
enemiesList : [],
itemsList   : [],
enemyTurn   :  0,
 
// Define tile types here
TILE_FLOOR      : { id: 1,  graphicID : 17,      walkable : true,    },
TILE_WALL       : { id: 2,  graphicID : 0,       walkable : false,   },
TILE_STAIRS     : { id: 3,  graphicID : 16,      walkable : true,    },
TILE_PATH       : { id: 6,  graphicID : 22,      walkable : true,    }, // Doesn't need to have a graphic diferentiation. Just needed for this algorithm

prevStairsPosition : 5, // This will be the initial value for entrance stairs (is the position in tiles they have at the village)
currentStairsPosition : 5,

// Controls
keyK        : undefined,
keyL        : undefined,
keyW        : undefined,
keyA        : undefined,
keyS        : undefined,
keyD        : undefined,
inputLocked : false,


// UI sprites and stuff
// Heart Sprites Array
heartSprites        : [],
baseHeartSprites    : [],

// Inventory Sprites Array
inventorySprites    : [],
baseInventorySprites: [],

coinsBitmapText         : {}, 
dungeonLevelBitmapText  : {}, 
curseDaysBitmapText     : {}, 
itemPortrait            : {},
itemOptionsSprite       : {},

// Stat Texts
coinText            : "",
curseDaysText       : "",
dungeonLevelText    : "",

// Character Portrait Sprite Anim
characterPortrait   : undefined,

// Sound Effects and music
//coinPickup          : undefined, // not used
dungeonTheme        : undefined,
villageTheme        : undefined,

// Writer variable
fullText     : "",
textsArray   : [],
letterCounter: 0,
textBoxSprite: {},
textBoxBitmapText : {},
inMiddleOfConversation : false,
skippingConversation : false,

// Intro
introTextArray : [],
introPlaying    : true,
blackScreen     : {},
arneBreathing   : {},
noeBreathing   : {},
fireSparks      : {},
skipIntro : false,

titleWaitingToStart : false,

loadingHeartSprite : {},

/////////////// Functions /////////////// 
// don't forget the , after the ending }

reset : function() {
    console.log("\n -----------  Reset Game var ------------")
    
    // Reset other global state first
    Player.reset();
    
    // Destroy sprites, audios, etc.
    this.villageSprite.destroy();
    this.tilemap.destroy();
    this.textBoxSprite.destroy();
    this.textBoxBitmapText.destroy();
    this.itemPortrait.destroy();
    this.coinsBitmapText.destroy();
    this.curseDaysBitmapText.destroy();
    this.dungeonLevelBitmapText.destroy();
    this.itemOptionsSprite.destroy();
    this.blackScreen.destroy();
    this.arneBreathing.destroy();
    this.noeBreathing.destroy();
    this.fireSparks.destroy();
    this.fireSparks2.destroy();
    this.lineBGsprite.destroy();
    this.bitmapTextStart.destroy();
    
    for (var i = 0; i < this.heartSprites.length; i++) {
        this.heartSprites[i].destroy();
    }    
    this.heartSprites = [];

    for (var i = 0; i < this.baseHeartSprites.length; i++) {
        this.baseHeartSprites[i].destroy();
    }
    this.baseHeartSprites = [];
    
    for (var i = 0; i < this.inventorySprites.length; i++) {
        this.inventorySprites[i].destroy();
    }
    this.inventorySprites = [];
    
    for (var i = 0; i < this.baseInventorySprites.length; i++) {
        this.baseInventorySprites[i].destroy();
    }
    this.baseInventorySprites = [];
    
    for (var i = 0; i < this.enemiesList.length; i++) {
        this.enemiesList[i].spriteRef.destroy();
    }
    this.enemiesList = [];
  
    for (var i = 0; i < this.itemsList.length; i++) {
        this.itemsList[i].spriteRef.destroy();
        this.itemsList[i].soundRef.destroy();
    }
    this.itemsList = [];
    
    this.villageTheme.destroy();
    this.dungeonTheme.destroy();
    //this.coinPickup.destroy();
    
    // Delete event listeners
    this.keyK.onDown.removeAll();
    this.keyL.onDown.removeAll();
    this.keyW.onDown.removeAll();
    this.keyA.onDown.removeAll();
    this.keyS.onDown.removeAll();
    this.keyD.onDown.removeAll();
    
    // Reset global state to default values
    this.prevStairsPosition = 5;
    this.currentStairsPosition = 5;
    
    this.textsArray = [];
    this.letterCounter = 0;
    this.inMiddleOfConversation = false;
    this.skippingConversation = false;
    
    this.titleWaitingToStart = false;
    
    this.skipIntro = false;
    
    // Create everything again
    this.init();
    this.create();


    //game.state.start('Game');
},

init : function() {

    // Create player to test
    //this.player = Player(this, 0, 0, "player");
    console.log("-> Game init");
    
    // Let's fill the village matrix manually... U-.-
    var manualMatrix = [
        [this.OBJ_WALL, this.OBJ_DOGPLACE, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, ],
        [this.OBJ_WALL, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, ],
        [this.OBJ_WALL, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_NONE, this.OBJ_WALL, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_WALL, this.OBJ_NONE, this.OBJ_WALL, this.OBJ_NONE, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, ],
        [this.OBJ_WALL, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_WALL, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, ],
        [this.OBJ_WALL, this.OBJ_NONE, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_NONE, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, ],
        [this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_WALL, ],
        [this.OBJ_WALL, this.OBJ_WALL, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_WALL, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_WALL, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_WALL, ],
        [this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_WALL, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_WALL, ],
        [this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_NONE, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, ],
        [this.OBJ_WALL, this.OBJ_WALL, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_WALL, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, ],
        [this.OBJ_WALL, this.OBJ_WALL, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, ],
        [this.OBJ_WALL, this.OBJ_WALL, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_DOWNSTAIRS, this.OBJ_DOWNSTAIRS, this.OBJ_WALL, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_WALL, this.OBJ_WALL, ],
        [this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_NONE, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, ],
        [this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, this.OBJ_WALL, ],
    ];
    console.log(this.villageMatrix);
    
    // Transpose the matrix
    this.villageMatrix = manualMatrix[0].map(function (col, c) {
    // For each column, iterate all rows
    return manualMatrix.map(function (row, r) { 
        return manualMatrix[r][c]; 
    }); 
});
},

preload : function() {
    
    // Invoke onPreloadUpdate callback at each asset loaded
    game.load.onFileComplete.add(this.onPreloadUpdate, this);
    
    // Load resources
    game.load.image('loadingScreen', 'assets/loadingscreen/loadingscreen_background.png');
    game.load.spritesheet('loadingScreenHeart', 'assets/loadingscreen/loadingscreen_gameboy_spritemap.png', 17, 8, 10);
    
    game.load.bitmapFont('LURKLight', 'assets/LURK_Light.png', 'assets/LURK_Light.fnt');
    game.load.bitmapFont('LURKDark', 'assets/LURK_Dark.png', 'assets/LURK_Light.fnt');
    game.load.bitmapFont('LURK', 'assets/LURK.png', 'assets/LURK_Light.fnt');
    
    game.load.image('textBg', 'assets/game/bottomUI/bottomUI_textBg.png');
    
    game.load.image('tileset1', 'assets/game/tiles/dungeon_tileset_1.png');
    game.load.image('village', 'assets/game/tiles/village_tileset.png');
    
    game.load.image('bottomUIBackground', 'assets/game/bottomUI/bottomUI_background.png');
    game.load.image('bottomUICoinIcon', 'assets/game/bottomUI/bottomUI_coinIcon.png');
    game.load.image('bottomUIDayIcon', 'assets/game/bottomUI/bottomUI_dayIcon.png');
    game.load.image('bottomUIDisabledHeart', 'assets/game/bottomUI/bottomUI_disabledHeart.png');
    game.load.image('bottomUIHalfDisabledHeart', 'assets/game/bottomUI/bottomUI_halfDisabledHeart.png');
    game.load.image('bottomUIEmptyHeart', 'assets/game/bottomUI/bottomUI_emptyHeart.png');
    game.load.image('bottomUIFloorIcon', 'assets/game/bottomUI/bottomUI_floorIcon.png');
    game.load.image('bottomUIFrames', 'assets/game/bottomUI/bottomUI_frames.png');
    game.load.image('bottomUIFullHeart', 'assets/game/bottomUI/bottomUI_fullHeart.png');
    game.load.image('bottomUIHalfHeart', 'assets/game/bottomUI/bottomUI_halfHeart.png');
    game.load.image('bottomUINullHeart', 'assets/game/bottomUI/bottomUI_invisibleHeart.png');
    game.load.image('bottomUIDisabledSlot', 'assets/game/bottomUI/bottomUI_inv_disabledSlot.png');
    game.load.image('bottomUIEmptySlot', 'assets/game/bottomUI/bottomUI_inv_emptySlot.png');
    game.load.image('bottomUISelection', 'assets/game/bottomUI/bottomUI_inv_selection.png');
    
    game.load.image('itemOptions', 'assets/game/inventory/itemOptions.png');
    game.load.image('smallHealthPotionPortrait', 'assets/game/closeupframe/smallHealthPotionImage.png');
    game.load.image('swordPortrait', 'assets/game/closeupframe/swordImage.png');
    game.load.image('breadPortrait', 'assets/game/closeupframe/breadImage.png');
    game.load.image('healthPotionPortrait', 'assets/game/closeupframe/healthPotionImage.png');
    game.load.image('largeHealthPotionPortrait', 'assets/game/closeupframe/largeHealthPotionImage.png');
    game.load.image('unknownLiquidPortrait', 'assets/game/closeupframe/unknownLiquidImage.png');

    game.load.spritesheet('coin', 'assets/game/coin_spritesheet.png', 8, 8, 8);
    
    game.load.image('punchIcon', 'assets/game/inventory/punchIcon.png');
    game.load.image('swordIcon', 'assets/game/inventory/simpleSwordIcon.png');
    game.load.image('smallHealthPotionIcon', 'assets/game/inventory/smallHealthPotionIcon.png');
    game.load.image('sackIcon', 'assets/game/inventory/sackIcon.png');
    game.load.image('breadIcon', 'assets/game/inventory/breadIcon.png');
    game.load.image('healthPotionIcon', 'assets/game/inventory/healthPotionIcon.png');
    game.load.image('largeHealthPotionIcon', 'assets/game/inventory/largeHealthPotionIcon.png');
    
    game.load.image('buttonAIcon', 'assets/buttonA_icon.png');
    game.load.image('buttonBIcon', 'assets/buttonB_icon.png');
    game.load.image('dPadIcon', 'assets/buttonDpad_icon.png');
    
    game.load.spritesheet('characterPortrait', 'assets/game/character_spritesheet.png', 30, 30, 85);
    game.load.spritesheet('playerIdle', 'assets/game/character_idle.png', 8, 8, 6);
    game.load.spritesheet('ratIdle', 'assets/game/rat_idle.png', 8, 8, 6);
    game.load.spritesheet('snakeIdle', 'assets/game/snake_idle.png', 8, 8, 6);
    game.load.spritesheet('fatzombieIdle', 'assets/game/fatzombie_idle.png', 8, 8, 6);
    game.load.spritesheet('batIdle', 'assets/game/bat_idle.png', 8, 8, 6);
    
    game.load.spritesheet('alfIdle', 'assets/game/village/alf_idle.png', 8, 8, 4);
    game.load.spritesheet('frankIdle', 'assets/game/village/frank_idle.png', 8, 8, 4);
    game.load.spritesheet('lukaIdle', 'assets/game/village/luka_idle.png', 8, 8, 4);
    game.load.spritesheet('lunaIdle', 'assets/game/village/luna_idle.png', 8, 8, 4);
    game.load.spritesheet('megIdle', 'assets/game/village/meg_idle.png', 8, 8, 4);
    game.load.spritesheet('noeIdle', 'assets/game/village/noe_idle.png', 8, 8, 4);
    
    game.load.image('blackScreen', 'assets/blackScreen.png');
    game.load.spritesheet('introSparks', 'assets/intro/intro_firesparks.png', 160, 144, 6);
    game.load.spritesheet('introNoeBreath', 'assets/intro/intro_noe_breathing.png', 160, 144, 6);
    game.load.spritesheet('introArneBreath', 'assets/intro/intro_arne_breathing.png', 160, 144, 6);
    game.load.spritesheet('introArneShiningeye', 'assets/intro/intro_arne_shiningeye.png', 160, 144, 6);
    game.load.spritesheet('introSparks2', 'assets/intro/intro_firesparks_2.png', 160, 144, 6);
    
    game.load.image('titleScreenBG', 'assets/splashScreen/splashScreenBg.png');
    game.load.image('titleScreenLogo', 'assets/splashScreen/splashScreenLogo.png');
    
    game.load.spritesheet('gameOverBrokenScreen', 'assets/game/gameOver_brokenScreen_anim.png', 160, 144, 8);
    game.load.spritesheet('gameOverText', 'assets/game/gameOver_text_anim.png', 160, 47, 10);
    game.load.image('pressXBg', 'assets/pressXBg.png');
    
    game.load.spritesheet('transition', 'assets/transition.png', 160, 144, 14);
    
    game.load.audio('dungeonTheme', 'assets/soundmusic/DungeonTheme.mp3');
    game.load.audio('villageTheme', 'assets/soundmusic/VillageTheme.mp3');
    game.load.audio('mainTheme', 'assets/soundmusic/MainTheme.mp3');
    game.load.audio('coin', 'assets/soundmusic/coin.wav');
    game.load.audio('walk', 'assets/soundmusic/walk.wav');
    game.load.audio('heal', 'assets/soundmusic/heal.wav');
    game.load.audio('enemyHit', 'assets/soundmusic/enemyHit.wav');
    game.load.audio('playerHit', 'assets/soundmusic/playerHit.wav');
    game.load.audio('tick', 'assets/soundmusic/tick.wav');
    game.load.audio('enemyDeath', 'assets/soundmusic/enemyDeath.wav');

},

onPreloadUpdate : function(progress, key, success, totalLoaded, totalFiles) {

    // Set a loading bar sprite that will automatically fill as files are loaded. Remember to preload this graphic before any other asset
    if (key == 'loadingScreen') {
        this.preloadBar = this.add.sprite(0, 0, 'loadingScreen');
        //this.load.setPreloadSprite(this.preloadBar);
        
        if (this.loadLater) {
            this.loadingHeartSprite = this.add.sprite(67, 58, 'loadingScreenHeart');
            this.loadingHeartSprite.animations.add('loading', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 20, true);
            this.loadingHeartSprite.animations.play('loading');
        }
    }
    
    if (key == 'loadingScreenHeart') {
        if (this.preloadBar) {
            this.loadingHeartSprite = this.add.sprite(67, 58, 'loadingScreenHeart');
            this.loadingHeartSprite.animations.add('loading', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 20, true);
            this.loadingHeartSprite.animations.play('loading');
        }
        else
            this.loadLater = true;
    }
    
    // Remove the onFileComplete listener when loading finishes
    if (progress === 100) {
        game.load.onFileComplete.removeAll(this);

    }
        
    console.log("Loading... \t" + progress + "%.\t Asset: " + key);
},

create : function() {

    console.log("Game create()");

    // Create objects (sprites, etc.)
    
    game.stage.backgroundColor = '#404040';
    
    // Show permanent UI at the bottom
    this.bottomUIBackground = game.add.sprite(0, 112, 'bottomUIBackground');
    this.bottomUIFrames = game.add.sprite(0, 112, 'bottomUIFrames');
    this.bottomUIFloorIcon = game.add.sprite(91, 117, 'bottomUIFloorIcon');
    this.bottomUIDayIcon = game.add.sprite(112, 117, 'bottomUIDayIcon');
    this.bottomUICoinIcon = game.add.sprite(95, 126, 'bottomUICoinIcon');
    this.bottomUIWeaponSlot = game.add.sprite(34, 129, 'bottomUIEmptySlot');
    this.itemPortrait = game.add.sprite(130, 114, 'bottomUINullHeart');
    

    this.coinsBitmapText = game.add.bitmapText(103, 127, 'LURKDark', Player.coins.toString(), 6);
    this.dungeonLevelBitmapText = game.add.bitmapText(99, 118, 'LURKDark', Player.dungeonLevel.toString(), 6);
    this.curseDaysBitmapText = game.add.bitmapText(119, 118, 'LURKDark', Player.curseDays.toString(), 6);
    
    // Create hearts
    for (var i = 0; i < 7; i++) {
        this.baseHeartSprites[i] = game.add.sprite (34+(i*8), 117, 'bottomUIDisabledHeart');
    }
    for (var l = 0; l < 7; l++) {
        this.heartSprites[l] = game.add.sprite (34+(l*8), 117, 'bottomUINullHeart');
    }
    
    // Add Punch to weapon inventory as first weapon and assign it as current weapon
    Player.currentWeapon = new ITEMS.Punch();
    this.weaponSprite = game.add.sprite (34, 129, 'bottomUINullHeart');
    this.updatePlayerWeaponsOnScreen();
    
    // Create inventory sprites
    for (var l = 0; l < 2; l++) {
        for (var k = 0; k < 5; k++) {
            this.baseInventorySprites[k+(l*5)] = game.add.sprite (44+(k*9), 125+(l*9), 'bottomUIDisabledSlot');
        }
    }
    
    for (var p = 0; p < 2; p++) {
        for (var r = 0; r < 5; r++) {
            this.inventorySprites[r+(p*5)] = game.add.sprite (44+(r*9), 125+(p*9), 'bottomUINullHeart');
        }
    }
    
    this.selectionSprite = game.add.sprite(44, 125, 'bottomUISelection');
    this.selectionSprite.kill();
    
    // Write initial coins, curse days and dungeon level
    Player.UpdateCoins(0);
    this.updateCurseDaysOnScreen();
    this.updateDungeonLevelOnScreen();
    
    // Temp items
    this.updatePlayerItemsOnScreen();
    
    // Add character portrait animations
    this.characterPortrait = game.add.sprite(0, 114, 'characterPortrait');
    this.characterPortrait.animations.add('charCurse1Dmg1', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], 8, true);
    this.characterPortrait.animations.add('charCurse1Dmg2', [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], 6, true);
    this.characterPortrait.animations.add('charCurse1Dmg3', [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49], 4, true);
    this.characterPortrait.animations.add('charCurse2Dmg1', [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64], 6, true);
    this.characterPortrait.animations.add('charCurse2Dmg2', [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79], 4, true);
    this.characterPortrait.animations.add('charCurse3', [80, 81, 82, 83, 84], 4, true);
    this.characterPortrait.animations.add('charCurse1Hit', [30, 31, 32, 33, 34], 16, false);
    this.characterPortrait.animations.add('charCurse2Hit', [30, 31, 32, 33, 34], 16, false);
    this.characterPortrait.animations.add('charCurse3Hit', [30, 31, 32, 33, 34], 16, false);
    
    //Play initial character portrait animation
    Player.UpdateCharacterPortraitState();
    
    // Call update function for initial HP
    Player.UpdatePlayerHP(0);
    
    // Intro text
    this.introTextArray.push("30  DAYS?       "); 
    this.introTextArray.push("THIS  IS  HOW\nLONG  OUR  HERBS\nCAN  KEEP  YOU\nALIVE,  TRAVELER.       ");
    this.introTextArray.push("THEN  WHAT?       ");
    this.introTextArray.push("YOU  WILL  DIE.\nAS  MOST  OF  US\nHAVE  AND  AS  WE\nALL  WILL.       ");
    this.introTextArray.push("I'LL  GO  KILL\nIT  THEN.     ");
    this.introTextArray.push("        ?!    ");
    this.introTextArray.push("I'LL  SMASH  THE\nHEAD  OF  THAT\n*$?@*%$#     ");
    this.introTextArray.push("WELL  THERE  IS\nACTUALLY\nANOTHER...  ");
    this.introTextArray.push("ENOUGH  OLD  MAN,\nLET'S  KICK  SOME\nEVIL  ASS!      ");
    
    // Create an empty tilemap and add it a tileset image
    this.tilemap = game.add.tilemap();
    this.tilemap.tileWidth = this.TILE_SIZE;
    this.tilemap.tileHeight = this.TILE_SIZE;
    this.tilemap.addTilesetImage('tileset1');
    
    // Create layers
    this.mapLayer =  this.tilemap.createBlankLayer("mapLayer", this.TILEMAP_WIDTH, this.TILEMAP_HEIGHT, this.TILE_SIZE, this.TILE_SIZE);
    //maybe we don't need a tilemap for objects. Better with sprites and the objectMatrix //this.objectLayer = this.tilemap.createBlankLayer("objectLayer", this.TILEMAP_WIDTH * 2, this.TILEMAP_HEIGHT * 2, this.TILE_SIZE * 2, this.TILE_SIZE * 2); // everything x2 because tiles are 8x8 instead of 16x16
    

    // Generate a map and store it. Then, fill the tilemap
    this.generateMap();
    this.fillTileMap();
    
    // Create village sprite (fake a tilemap. No time! :P)
    this.villageSprite = game.add.sprite(0, 0, 'village');

    
    // Create villagers
    var alf = new VILLAGERS.Adult( { matrixPosX: 3, matrixPosY: 1, name: "ALF", sprite: 'alfIdle' } );
    this.villagersList.push(alf);
    this.villageMatrix[alf.matrixPosX][alf.matrixPosY] = { id: "villager", objectReference: alf };
    
    var luka = new VILLAGERS.Adult( { matrixPosX: 1, matrixPosY: 4, name: "LUKA", sprite: 'lukaIdle' } );
    this.villagersList.push(luka);
    this.villageMatrix[luka.matrixPosX][luka.matrixPosY] = { id: "villager", objectReference: luka };
    
    var luna = new VILLAGERS.Adult( { matrixPosX: 3, matrixPosY: 10, name: "LUNA", sprite: 'lunaIdle' } );
    this.villagersList.push(luna);
    this.villageMatrix[luna.matrixPosX][luna.matrixPosY] = { id: "villager", objectReference: luna };
    
    var meg = new VILLAGERS.Adult( { matrixPosX: 12, matrixPosY: 1, name: "MEG", sprite: 'megIdle' } );
    this.villagersList.push(meg);
    this.villageMatrix[meg.matrixPosX][meg.matrixPosY] = { id: "villager", objectReference: meg };
    
    var noe = new VILLAGERS.Adult( { matrixPosX: 18, matrixPosY: 6, name: "NOE", sprite: 'noeIdle' } );
    this.villagersList.push(noe);
    this.villageMatrix[noe.matrixPosX][noe.matrixPosY] = { id: "villager", objectReference: noe };
    
    var frank = new VILLAGERS.Adult( { matrixPosX: 17, matrixPosY: 11, name: "FRANK", sprite: 'frankIdle' } );
    this.villagersList.push(frank);
    this.villageMatrix[frank.matrixPosX][frank.matrixPosY] = { id: "villager", objectReference: frank };
    
    
    // Create player sprite and animate it
    Player.sprite = game.add.sprite(0, 0, 'playerIdle');
    Player.sprite.animations.add('idle', [0, 1, 2, 3], 6.4, true);
    Player.sprite.animations.add('hit', [4, 5], 8, false);
    Player.sprite.animations.play('idle');
    Player.sprite.x = this.TILE_SIZE * 4 + 8;//this.prevStairsPosition * this.TILE_SIZE;
    Player.sprite.y = this.TILE_SIZE * 3;//1 * this.TILE_SIZE;
    Player.atVillage = true;
    
    // Temporary random one-liner.
    //this.textWriter(this.getRandomCharacterLine('FRANK', false, false));
    
        
    
    // Create text box sprite and bitmapText
    this.textBoxSprite = game.add.sprite(33, 116, 'textBg');
    this.itemOptionsSprite = game.add.sprite(33, 116, 'itemOptions');
    this.itemOptionsSprite.kill();
    this.textBoxSprite.kill(); // Hide
    
    
    // Intro stuff
    this.blackScreen = game.add.sprite(0, 0, 'blackScreen');
    this.noeBreathing = game.add.sprite(0, 0, 'introNoeBreath');
    this.noeBreathing.animations.add('breath', [0,1,2,3,4,5], 3, true);
    this.noeBreathing.animations.play('breath');
    this.arneBreathing = game.add.sprite(0, 0, 'introArneBreath');
    this.arneBreathing.animations.add('breath', [0,1,2,3,4,5], 3, true);
    this.arneBreathing.animations.play('breath');
    this.fireSparks = game.add.sprite(0, 0, 'introSparks');
    this.fireSparks.animations.add('sparkle', [0,1,2,3,4,5], 8, true);
    this.fireSparks.animations.play('sparkle');
    this.fireSparks2 = game.add.sprite(0, 0, 'introSparks2');
    this.fireSparks2.animations.add('sparkle', [0,1,2,3,4,5], 8, true);
    this.fireSparks2.animations.play('sparkle');
    this.fireSparks2.kill();
    this.noeBreathing.kill();
    
    this.textBoxBitmapText = game.add.bitmapText(34,117, 'LURK', "", 6);
    this.textBoxBitmapText.kill(); // Hide

    // Add keyboard listeners for pad (WASD) and A B buttons (KL)
    this.keyK = game.input.keyboard.addKey(Phaser.Keyboard.K);
    this.keyK.onDown.add(this.onButtonB, this);
    this.keyL = game.input.keyboard.addKey(Phaser.Keyboard.L);
    this.keyL.onDown.add(this.onButtonA, this);
    this.keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.keyW.onDown.add(this.onButtonUp, this);
    this.keyA = game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.keyA.onDown.add(this.onButtonLeft, this);
    this.keyS = game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.keyS.onDown.add(this.onButtonDown, this);
    this.keyD = game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.keyD.onDown.add(this.onButtonRight, this);
    
    // Create music & sound effects
    this.dungeonTheme = game.add.audio('dungeonTheme');
    this.villageTheme = game.add.audio('villageTheme');
    this.mainTheme = game.add.audio('mainTheme');
    
    Player.LockInput();
    
    this.preloadBar = this.add.sprite(0, 0, 'loadingScreen');
    this.loadingHeartSprite = this.add.sprite(67, 58, 'loadingScreenHeart');
    this.loadingHeartSprite.animations.add('loading', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 20, true);
    this.loadingHeartSprite.animations.play('loading');
    
    // Show controls 5 seconds
    game.time.events.add(5000, function() {
        this.preloadBar.destroy();
        this.loadingHeartSprite.destroy(); 
        
        this.villageTheme.loopFull(0.3);

        // Start game intro
        this.startIntro();

    }, this);
    
},

// Buttons callbacks
onButtonA : function() {
    
    console.log("Game Boy A button was pressed (key K)");
    
    if (this.introPlaying && !this.skipIntro) {
        console.log("LOL");
        this.skipIntro = true;
        return;
    }
    
    if (this.titleWaitingToStart) {
        console.log("START GAME");
        this.titleWaitingToStart = false;
        
        // START GAME!
        this.startGame();
        
        return;
    }
    
    // Skip conversation
    if (this.inMiddleOfConversation && !this.introPlaying) {
        this.skippingConversation = true
        return;
    }
    
    // Hide text box
    else if (this.textBoxSprite.alive && !Player.inventoryOpen) {
        this.textBoxSprite.kill();
        this.textBoxBitmapText.kill();
        Player.UnlockInput();
        return;
    }
    
    if (this.inputLocked || Player.playerHP <= 0)
        return;
        
    

    
    // Inventory stuff
    if (!Player.inventoryOpen) {
        
        console.log("OPEN INVENTORY");
        console.log(Player.inventory);
        
        // Open inventory
        // Pause all animations?
        
        Player.inventoryOpen = true;
        Player.itemSelected = false;
        
        this.selectionSprite.revive();
        this.selectionSprite.x = this.inventorySprites[Player.currentItem].x;
        this.selectionSprite.y = this.inventorySprites[Player.currentItem].y;
        if (Player.inventory[Player.currentItem])
            this.itemPortrait.loadTexture(Player.inventory[Player.currentItem].portraitSprite);
        else
            this.itemPortrait.loadTexture('bottomUINullHeart');

    }
    else {
        
        // DESTROY ITEM
        if (Player.itemSelected) {
            
            // Destroy item!
            Player.inventory.splice(Player.currentItem, 1);
            
            // Update UI stuff
            this.updatePlayerItemsOnScreen();
            this.updatePlayerWeaponsOnScreen();
            
            // Hide UI stuff
            this.fullText = "";
            this.textBoxBitmapText.text = "";
            this.textBoxSprite.kill();
            this.textBoxBitmapText.kill();
            this.itemOptionsSprite.kill();

            console.log("DESTROY ITEM");
        }
        
        Player.inventoryOpen = false;
        Player.itemSelected = false;
        this.itemPortrait.loadTexture('bottomUINullHeart');
        this.selectionSprite.kill();
        
    }
    
    
    // DEBUG
    //this.ClearLevelData();
    //this.generateMap();
    //this.fillTileMap();
},

onButtonB : function() {
    
    if (this.inputLocked)
        return;
    
    console.log("Game Boy B button was pressed (key L)");

    // If the player is in Game Over, reset the game
    if (Player.playerHP <= 0 && Player.gameOverEnded) {
        this.reset();
        return;
    }
    
    
    
    // Item selection stuff
    if (Player.inventoryOpen) {
        
        // USE
        if (Player.itemSelected) {
            
            if (Player.inventory[Player.currentItem]) {
                 console.log("USE ITEM");
                 
                // Use the item
                Player.inventory[Player.currentItem].Use();
                
                // Destroy item if it's not a weapon
                if (Player.inventory[Player.currentItem].itemtype == "item") {
                    Player.inventory.splice(Player.currentItem, 1);
                }
                else if (Player.inventory[Player.currentItem].itemtype == "weapon") {
                    // Swap with weapon
                    var auxCurrentItem = Player.inventory[Player.currentItem];
                    var auxWeapon = Player.currentWeapon;
                    Player.currentWeapon = Player.inventory[Player.currentItem];
                    
                    if (auxWeapon.name != "PUNCH") {
                        console.log("NOT PUNCH -> SWAP");
                        Player.inventory[Player.currentItem] = auxCurrentItem;
                    }
                    else {
                        console.log("PUNCH -> REPLACE");
                        Player.inventory.splice(Player.currentItem, 1);
                    }
                    
                    console.log(Player.currentWeapon.sprite);
                    this.weaponSprite.loadTexture(Player.currentWeapon.sprite);
                    
                    console.log("WEAPON EQUIPPED");
                }
                
                // Play sound
                
                // Update UI stuff
                this.updatePlayerItemsOnScreen();
                this.updatePlayerWeaponsOnScreen();
                this.itemPortrait.loadTexture('bottomUINullHeart');
                
                // Hide UI stuff
                this.fullText = "";
                this.textBoxBitmapText.text = "";
                this.textBoxSprite.kill();
                this.textBoxBitmapText.kill();
                this.selectionSprite.kill();
                this.itemOptionsSprite.kill();
                
                Player.inventoryOpen = false;
                Player.itemSelected = false;
            }
        }
        
        // Show USE/EQUIP/DESTROY dialog
        else {
            if (Player.inventory[Player.currentItem]) {
                Player.itemSelected = true;
                this.fullText = Player.inventory[Player.currentItem].name;
                this.textBoxBitmapText.text = this.fullText;
                this.textBoxSprite.revive();
                this.textBoxBitmapText.x = 80 - (this.textBoxBitmapText.textWidth * 0.5);
                this.textBoxBitmapText.revive();
                this.itemOptionsSprite.revive();
            }
        }
    }
    
    
    

    
    // DEBUG
    //Player.UpdatePlayerHP(-1);
    //this.updatePlayerItemsOnScreen();
},

onButtonUp : function() {
    
    if (this.inputLocked || Player.playerHP <= 0)
        return;
        
    console.log("Game Boy UP button was pressed (key W)");
    
    if (Player.inventoryOpen) {
        if (Player.itemSelected) {
            Player.itemSelected = false;
            
            // Dismiss Use/Equip/Destroy prompt
            this.textBoxSprite.kill();
            this.textBoxBitmapText.kill();
            this.itemOptionsSprite.kill();
        }
        else {
            if (Player.inventorySize > Player.currentItem + 5)
                Player.currentItem = (Player.currentItem - 5) % Player.inventorySize;
            this.selectionSprite.x = this.inventorySprites[Player.currentItem].x;
            this.selectionSprite.y = this.inventorySprites[Player.currentItem].y;
            if (Player.inventory[Player.currentItem])
                this.itemPortrait.loadTexture(Player.inventory[Player.currentItem].portraitSprite);
        }
    }
    else 
        Player.MoveTo("up");
},

onButtonLeft : function() {
    
    if (this.inputLocked || Player.playerHP <= 0)
        return;    
    
    console.log("Game Boy LEFT button was pressed (key A)");
    
    if (Player.inventoryOpen) {
        if (Player.itemSelected) {
            Player.itemSelected = false;
            
            // Dismiss Use/Equip/Destroy prompt
            this.textBoxSprite.kill();
            this.textBoxBitmapText.kill();
            this.itemOptionsSprite.kill();
        }
        else {
            Player.currentItem = (Player.currentItem - 1) % Player.inventorySize;
            if (Player.currentItem < 0)
                Player.currentItem = Player.inventorySize - 1;
            this.selectionSprite.x = this.inventorySprites[Player.currentItem].x;
            this.selectionSprite.y = this.inventorySprites[Player.currentItem].y;
            if (Player.inventory[Player.currentItem])
                this.itemPortrait.loadTexture(Player.inventory[Player.currentItem].portraitSprite);
            else
                this.itemPortrait.loadTexture('bottomUINullHeart');
        }
    }
    else 
        Player.MoveTo("left");
},

onButtonDown : function() {
    
    if (this.inputLocked || Player.playerHP <= 0)
        return;    
    
    console.log("Game Boy DOWN button was pressed (key S)");
    
    if (Player.inventoryOpen) {
        if (Player.itemSelected) {
            Player.itemSelected = false;
            
            // Dismiss Use/Equip/Destroy prompt
            this.textBoxSprite.kill();
            this.textBoxBitmapText.kill();
            this.itemOptionsSprite.kill();
        }
        else {
            if (Player.inventorySize > Player.currentItem + 5)
                Player.currentItem = (Player.currentItem + 5) % Player.inventorySize;
            this.selectionSprite.x = this.inventorySprites[Player.currentItem].x;
            this.selectionSprite.y = this.inventorySprites[Player.currentItem].y;
            if (Player.inventory[Player.currentItem])
                this.itemPortrait.loadTexture(Player.inventory[Player.currentItem].portraitSprite);
            else
                this.itemPortrait.loadTexture('bottomUINullHeart');
        }
    }
    else 
        Player.MoveTo("down");
},

onButtonRight : function() {
    
    if (this.inputLocked || Player.playerHP <= 0)
        return;    
    
    console.log("Game Boy RIGHT button was pressed (key D)");
    
    
    if (Player.inventoryOpen) {
        if (Player.itemSelected) {
            Player.itemSelected = false;
            
            // Dismiss Use/Equip/Destroy prompt
            this.textBoxSprite.kill();
            this.textBoxBitmapText.kill();
            this.itemOptionsSprite.kill();
        }
        else {
            Player.currentItem = (Player.currentItem + 1) % Player.inventorySize;
            this.selectionSprite.x = this.inventorySprites[Player.currentItem].x;
            this.selectionSprite.y = this.inventorySprites[Player.currentItem].y;
            if (Player.inventory[Player.currentItem])
                this.itemPortrait.loadTexture(Player.inventory[Player.currentItem].portraitSprite);
            else
                this.itemPortrait.loadTexture('bottomUINullHeart');
        }
    }
    else 
        Player.MoveTo("right");
},

update : function(dt) {
    
    // Update logic. Called once per frame. dt = time between frames

},

render : function() {
    
    // Custom rendering operations
    
    //game.debug.text('Game state', 16, 16);
},


// Generates and returns a dungeon map in a matrix 
generateMap : function() {
    
    console.log("Generate map");
    
    var error = false;

    
    // Let's create an empty map for now
    
    this.tileMatrix = new Array(this.TILEMAP_WIDTH);
    
    for (var i = 0; i < this.TILEMAP_WIDTH; i++) {
        this.tileMatrix[i] = new Array(this.TILEMAP_HEIGHT);
        for (var j = 0; j < this.TILEMAP_HEIGHT; j++) {
            this.tileMatrix[i][j] = this.TILE_FLOOR;
        }
    }
    
    // Put the external walls
    
    for (var i = 0; i < this.TILEMAP_WIDTH; i++) {
        // Top row
        this.tileMatrix[i][0] = this.TILE_WALL;

        // Bottom row
        this.tileMatrix[i][this.TILEMAP_HEIGHT - 1] = this.TILE_WALL;
        
        // Left column
        this.tileMatrix[0][i] = this.TILE_WALL;

        // Right column
        this.tileMatrix[this.TILEMAP_WIDTH - 1][i] = this.TILE_WALL;
    }
    
    
    // Put entrance and next level stairs (remember the position of the previous next level stairs for this entrance stairs)
    
    // Entrance stairs
    this.tileMatrix[this.prevStairsPosition][0] = this.TILE_STAIRS;

    // Mark tiles below as TILE_PATH so that nothing blocks the stairs
    this.tileMatrix[this.prevStairsPosition][1] = this.TILE_PATH;

    // Next level stairs
    var stairNextPosition = Math.floor((Math.random() * (this.TILEMAP_WIDTH - 2)) + 1);
    this.tileMatrix[stairNextPosition][this.TILEMAP_HEIGHT - 1] = this.TILE_STAIRS;

    // Mark tiles above as TILE_PATH so that nothing blocks the stairs
    this.tileMatrix[stairNextPosition][this.TILEMAP_HEIGHT - 2] = this.TILE_PATH;
    
    // Rectangle wall chunks generation
    var numOfChunks = Math.floor(Math.random() * 4);
    
    console.log("Chunks to generate: " + numOfChunks);
    
    for (var num = 0; num < numOfChunks; num++) {
     
        // Determine random XY size and position. Can't contain a TILE_PATH
        
        var failedToPut = false;

        var chunkWidth  =   Math.floor(Math.random() * 2) + 1;
        var chunkHeight =   Math.floor(Math.random() * 2) + 1;

        var chunkX      =   Math.floor(Math.random() * (8 - chunkWidth)) + 1;
        var chunkY      =   Math.floor(Math.random() * (5 - chunkHeight)) + 1;
        
        
        // First, check if there's a PATH inside to avoid putting a chunk on it
        for(var i = chunkX; i < chunkX + chunkWidth; i++) {
            for(var j = chunkY; j < chunkY + chunkHeight; j++) {
                if (this.tileMatrix[i][j] == this.TILE_PATH) {
                    //numOfChunks++;
                    failedToPut = true;
                    console.log("Failed to put chunk " + num);
                }
            }
        }
        
        // If no PATH inside that aera, put it in the matrix
        if (!failedToPut) {
            for(var i = chunkX; i < chunkX + chunkWidth; i++) {
                for(var j = chunkY; j < chunkY + chunkHeight; j++) {
                    console.log("Putting chunk tile at [" + i + "][" + j + "] with size [" + chunkWidth + "][" + chunkHeight + "]");
                    this.tileMatrix[i][j] = this.TILE_WALL;
                }
            }
        }
        
    }
    
/*    for (var i = 0; i < this.TILEMAP_HEIGHT; i++) {
        var string = "";
        for (var j = 0; j < this.TILEMAP_WIDTH; j++) {
            string += "[" + this.tileMatrix[j][i].id + "]\t";
        }
        console.log(i + "F:\t" + string);
    }*/
    
    
    // Walls generation
    var numOfWalls = 10;
    
    for (var i = 0; i < numOfWalls; i++) {
        
        // Determine a starting point for the wall generation
        
        var currentX, currentY;
        var prevDir;
        
        var horizontalWall = Math.random() >= 0.5 ? true : false;
        
        if (horizontalWall) {
            currentX = Math.random() >= 0.5 ? 1 : this.TILEMAP_WIDTH-2;
            currentY = Math.floor(Math.random() * 2) + 2;
            prevDir = currentX == 1 ? "right" : "left";
        }
        else {
            do {
                currentX = Math.floor(Math.random() * 6) + 2;
                currentY = Math.random() >= 0.5 ? 1 : this.TILEMAP_HEIGHT-2;
            } while (this.tileMatrix[currentX][currentY] == this.TILE_PATH);
            
            prevDir = currentY == 1 ? "down" : "up";
        }

        //console.log("Random X,Y: " + currentX + ", " + currentY);
        var prevX = currentX;
        var prevY = currentY;

        var wallEnded = false;
        var wallLengthMax = 8;
        var wallLength = 0;
        var iterationsCounter = 0;
        
        console.log("Let's create a wall");
        
        while (!wallEnded && wallLength < wallLengthMax) {
            
            iterationsCounter++;
            if (iterationsCounter > 50) {
                console.log("TOO MANY ITERATIONS. Stop this wall generation");
                break;
            }
            
            // Adjacent tiles
            var tileUp      = this.tileMatrix[currentX][currentY - 1];
            var tileDown    = this.tileMatrix[currentX][currentY + 1];
            var tileLeft    = this.tileMatrix[currentX - 1][currentY];
            var tileRight   = this.tileMatrix[currentX + 1][currentY];
            
            // Diagonal tiles
            var tileUL      = this.tileMatrix[currentX - 1][currentY - 1];
            var tileUR      = this.tileMatrix[currentX + 1][currentY - 1];
            var tileDL      = this.tileMatrix[currentX - 1][currentY + 1];
            var tileDR      = this.tileMatrix[currentX + 1][currentY + 1];
            
            var possibleNextTile = [];
            var freeDiagonalTiles = 0;
            
            //console.log("Current position: [" + currentX + "][" + currentY + "]");
            
            // Determine possible next tile with adjacent tiles
            if (tileUp == this.TILE_FLOOR)
                possibleNextTile.push({ x : currentX, y: currentY - 1, direction: "up"});
            if (tileDown == this.TILE_FLOOR)
                possibleNextTile.push({ x : currentX, y: currentY + 1, direction: "down"});
            if (tileLeft == this.TILE_FLOOR)
                possibleNextTile.push({ x : currentX - 1, y: currentY, direction: "left"});
            if (tileRight == this.TILE_FLOOR)
                possibleNextTile.push({ x : currentX + 1, y: currentY, direction: "right"});
            
            
            // Determine free diagonal tiles depending on the prevDir
            if (prevDir == "up") {
                if (tileUL == this.TILE_FLOOR)
                    freeDiagonalTiles++;
                if (tileUR == this.TILE_FLOOR)
                    freeDiagonalTiles++;
            }
            if (prevDir == "down") {
                if (tileDL == this.TILE_FLOOR)
                    freeDiagonalTiles++;
                if (tileDR == this.TILE_FLOOR)
                    freeDiagonalTiles++;
            }          
            if (prevDir == "left") {
                if (tileUL == this.TILE_FLOOR)
                    freeDiagonalTiles++;
                if (tileDL == this.TILE_FLOOR)
                    freeDiagonalTiles++;    
            }
            if (prevDir == "right") {
                if (tileUR == this.TILE_FLOOR)
                    freeDiagonalTiles++;
                if (tileDR == this.TILE_FLOOR)
                    freeDiagonalTiles++;    
            }
            
                
            //console.log("Possible next tiles: " + possibleNextTile.length);

            
            // If there aren't possible next tiles, end the wall generation. There should be more than 2 free diagonal tiles to avoid closed areas
            if (possibleNextTile.length < 3 || freeDiagonalTiles < 2) {
                
                if (iterationsCounter == 1) {
                    console.log("Can't start a wall from position: [" + currentX + "][" + currentY + "]. Stop this wall generation");
                    wallEnded = true;
                }
                if (wallLength < wallLengthMax/* && (Math.random() * 10 > 1)*/) {
                    currentX = prevX;
                    currentY = prevY;
                    //console.log("Going back");
                }
                else {
                    wallEnded = true;
                    console.log("Wall ended!");
                }
            }
            else {
                // Put the wall tile
                this.tileMatrix[currentX][currentY] = this.TILE_WALL;
                wallLength++;
                
                // Randomly decide which possible next tile to visit
                var next = Math.floor(Math.random() * possibleNextTile.length);
            
                //console.log("Options to visit: " + possibleNextTile.length + ". Chosen option: " + next);
            
                // Update the current tile positions
                prevX = currentX;
                prevY = currentY;
                prevDir = possibleNextTile[next].direction;
                currentX = possibleNextTile[next].x;
                currentY = possibleNextTile[next].y;
            }
    
        }
    }
    
    
    
    // Now with the objects (monsters, items...):

    // Generate an empty objects matrix too
        
    this.objectMatrix = new Array(this.TILEMAP_WIDTH * 2);
    
    for (var i = 0; i < this.TILEMAP_WIDTH * 2; i++) {
        this.objectMatrix[i] = new Array(this.TILEMAP_HEIGHT * 2);
        //this.villageMatrix[i] = new Array(this.TILEMAP_HEIGHT * 2);
        for (var j = 0; j < this.TILEMAP_HEIGHT * 2; j++) {
                //this.villageMatrix[i][j] = this.OBJ_NONE;
            if (this.tileMatrix[Math.floor(i/2)][Math.floor(j/2)] == this.TILE_WALL)
                this.objectMatrix[i][j] = this.OBJ_WALL;
            else 
                this.objectMatrix[i][j] = this.OBJ_NONE;
        }
    }
    
    // Place stairs teleports
    this.objectMatrix[this.prevStairsPosition * 2][1] = this.OBJ_UPSTAIRS;
    this.objectMatrix[this.prevStairsPosition * 2 + 1][1] = this.OBJ_UPSTAIRS;
    this.objectMatrix[stairNextPosition * 2][this.TILEMAP_HEIGHT * 2 - 2] = this.OBJ_DOWNSTAIRS;
    this.objectMatrix[stairNextPosition * 2 + 1][this.TILEMAP_HEIGHT * 2 - 2] = this.OBJ_DOWNSTAIRS;
    
    // Place the player below the top stairs
    this.objectMatrix[this.prevStairsPosition * 2][2] = this.OBJ_PLAYER;
    Player.matrixPosX = this.prevStairsPosition * 2;
    Player.matrixPosY = 2;
    
    // Update stairsNextPosition
    this.currentStairsPosition = this.prevStairsPosition;
    this.prevStairsPosition = stairNextPosition;

    // Decide a number of enemies and items to put
    var numEnemies = Math.floor(Math.random() * 3) + 1 + Math.round(Player.dungeonLevel / 2);
    var numItems = Math.floor(Math.random() * 3) + 1;
    
    // Put enemies
    for (var i = 0; i < numEnemies; i++) {
        
        do {
            var randomX = Math.floor(Math.random() * 16) + 2;
            var randomY = Math.floor(Math.random() * 10) + 2;
            var success = false;
            
            if (this.objectMatrix[randomX][randomY].id == "none" && ENEMY.distance(randomX, randomY, Player.matrixPosX, Player.matrixPosY) > 3) {
                //console.log("Distance: " + distanceFromPlayer);

                // Choose a random enemy type
                var enemyType = ENEMY.Types[Math.floor(Math.random() * ENEMY.Types.length)];
                
                // Create the enemy and put it into the objectMatrix and an array of enemies
                var enemy = new enemyType( {matrixPosX: randomX, matrixPosY: randomY} ); // TODO: Vary type and attack/hp with difficulty
                this.enemiesList.push(enemy);
                this.objectMatrix[randomX][randomY] = { id: "enemy",  objectReference: enemy };
                success = true;
            }
        } while (!success);
    }
    
    
    // Put items
    for (var i = 0; i < numItems; i++) {
        
        do {
            var randomX = Math.floor(Math.random() * 16) + 2;
            var randomY = Math.floor(Math.random() * 10) + 2;
            var success = false;
            
            if (this.objectMatrix[randomX][randomY].id == "none" && ENEMY.distance(randomX, randomY, Player.matrixPosX, Player.matrixPosY) > 3) {

                // Choose a random object type
                var itemType = ITEMS.Types[Math.floor(Math.random() * ITEMS.Types.length)];
                
                // Create the item and put it into the objectMatrix and an array of items
                var item = new itemType( {matrixPosX: randomX, matrixPosY: randomY} ); // TODO: Vary depending on difficulty
                this.itemsList.push(item);
                this.objectMatrix[randomX][randomY] = { id: "item",  objectReference: item};
                success = true;
            }
        } while (!success);
    }
    
    // Test to put some enemies and objects in fixed positions
/*    this.objectMatrix[6][6] = { id: "enemy",  objectReference: new ENEMY.Rat( {matrixPosX: 6, matrixPosY: 6} ) };
    this.objectMatrix[6][6].objectReference.spriteRef = game.add.sprite(6*8, 6*8, 'playerIdle');
    this.objectMatrix[6][6].objectReference.spriteRef.animations.add('idle');
    this.objectMatrix[6][6].objectReference.spriteRef.animations.play('idle', 3, true);

    this.objectMatrix[8][7] = { id: "item",   objectReference: new ITEMS.SimpleSword( {matrixPosX: 8, matrixPosY: 7}) };
    this.objectMatrix[8][7].objectReference.spriteRef = game.add.sprite(8*8, 7*8, 'simpleSwordIcon');*/

    // If something went wrong, repeat the algorithm
    if (error) {
        console.log("The map generation algorithm completed with errors. Repeat the generation");
        this.generateMap();
    }

},

// Fills the tilemap with the information of the tilematrix
fillTileMap : function() {
    
    console.log("Fill tilemap");
    
    // Implementation of this idea: http://www.angryfishstudios.com/2011/04/adventures-in-bitmasking/

    var bitmaskMatrix = new Array(this.TILEMAP_WIDTH);
    
    for (var i = 0; i < this.TILEMAP_WIDTH; i++) {
        bitmaskMatrix[i] = new Array(this.TILEMAP_HEIGHT);
        for (var j = 0; j < this.TILEMAP_HEIGHT; j++) {
            bitmaskMatrix[i][j] = this.tileMatrix[i][j] == this.TILE_WALL ? 1 : 0;
        }
    }
    
    for (var i = 0; i < this.TILEMAP_WIDTH; i++) {
        for (var j = 0; j < this.TILEMAP_HEIGHT; j++) {
            
            var bitmask =   1 * (j == 0 ? 0 : bitmaskMatrix[i][j-1])
                          + 2 * (i == this.TILEMAP_WIDTH-1 ? 0 : bitmaskMatrix[i+1][j])
                          + 4 * (j == this.TILEMAP_HEIGHT-1 ? 0 : bitmaskMatrix[i][j+1])
                          + 8 * (i == 0 ? 0 : bitmaskMatrix[i-1][j]);
                          
            // Use the bitmap if it's a wall or the tileMatrix graphicID property if it's any other tile type to put in the tilemap
            var tile = this.tileMatrix[i][j];
            
            // Use the bitmask for the tile id if the tile is a WALL
            if (tile == this.TILE_WALL)
                this.tilemap.putTile(bitmask, i, j, this.mapLayer);
                
            // If not a WALL, just use the graphicID. FLOOR has variations
            else if (tile == this.TILE_FLOOR) {
                var randomFloorTile = Math.random() > 0.75 ? tile.graphicID + Math.floor(Math.random() * 15) : tile.graphicID;
                this.tilemap.putTile(randomFloorTile, i, j, this.mapLayer);
            }
            else {
                this.tilemap.putTile(tile.graphicID, i, j, this.mapLayer);
            }
        }
    }
    
    
/*    // Let's fill the objects layer with empty objects
    for (var i = 0; i < this.TILEMAP_WIDTH; i++) {
        for (var j = 0; j < this.TILEMAP_HEIGHT; j++) {
            var objectType = this.objectMatrix[i][j].type;
            this.tilemap.putTile(objectType, i, j, this.objectLayer);
        }
    }*/
    
},

GoToVillage : function() {
    
    console.log("Go to village");
    
    // Show village sprite
    this.villageSprite.revive();
    
    // Set the player at village, heal him and subtract one day
    Player.atVillage = true
    Player.UpdatePlayerHP(100);
    Player.curseDays--;
    this.updateCurseDaysOnScreen();
    
    // Check if player should die of curse
    if (Player.curseDays <= 0) {
        Player.killedBy = "THE CURSE";
        Player.UpdatePlayerHP(-100); // Fake great damage
    }
    
    // Put player in the correct position
    Player.sprite.x = this.TILE_SIZE * 5;
    Player.sprite.y = this.TILE_SIZE * 5;
    
    // Unlock input
    Player.UnlockInput();
    
    // Hide items and monsters
    for (var i = 0; i < this.itemsList.length; i++)
        this.itemsList[i].spriteRef.kill();
    for (var i = 0; i < this.enemiesList.length; i++)
        this.enemiesList[i].spriteRef.kill();
    
    // Show villagers
    for (var i = 0; i < this.villagersList.length; i++)
        this.villagersList[i].spriteRef.revive();
    
    // Play village theme
    this.dungeonTheme.stop();
    this.villageTheme.loopFull(0.3);
},

GoToDungeon : function() {
    
    console.log("Return to dungeon");
    
    // Hide village sprite
    this.villageSprite.kill();
    
    // Set the player at dungeon
    Player.atVillage = false

    // Put player in the correct position
    Player.sprite.x = this.TILE_SIZE * this.currentStairsPosition;
    Player.sprite.y = this.TILE_SIZE * 1;
    
    // FIXME: Check if there's an enemy at the position the player spawns at
    
    // Unlock input
    Player.UnlockInput();
    
    // Show items and monsters
    for (var i = 0; i < this.itemsList.length; i++)
        this.itemsList[i].spriteRef.revive();
    for (var i = 0; i < this.enemiesList.length; i++)
        this.enemiesList[i].spriteRef.revive();
        
    // Hide villagers
    for (var i = 0; i < this.villagersList.length; i++)
        this.villagersList[i].spriteRef.kill();  
        
    // Play dungeon theme
    this.villageTheme.stop();
    this.dungeonTheme.loopFull(0.3);
},

ProcessEnemiesTurn : function() {

    // Don't process enemies turn if player is at village. Do villagers stuff instead
    if (Player.atVillage) {
        
        for (var i = 0; i < this.villagersList.length; i++) {
            this.enemyTurn++;
            this.villagersList[i].DecideAction();
        }
    }
    
    // If not at village, process enemies turn
    else {
        // Call DecideAction on each enemy on the list
        for (var i = 0; i < this.enemiesList.length; i++) {
            this.enemyTurn++;
            this.enemiesList[i].DecideAction();
        }
        
        // If there aren't enemies, unlock input here
        if (this.enemiesList.length == 0) {
            Player.UnlockInput();
        }
        
    }
    
    this.enemyTurn = 0;
},

ClearLevelData : function() {
  
  // Destroy enemies and objects sprites and empty the lists
    for (var i = 0; i < this.enemiesList.length; i++) {
        this.enemiesList[i].spriteRef.destroy();
    }
    this.enemiesList = [];
  
    for (var i = 0; i < this.itemsList.length; i++) {
        this.itemsList[i].spriteRef.destroy();
    }
    this.itemsList = [];
    
    
    // Destroy and re-create player's sprite for Z positioning
    Player.sprite.destroy();
    Player.sprite = game.add.sprite(0, 0, 'playerIdle');
    Player.sprite.animations.add('idle', [0, 1, 2, 3], 6.4, true);
    Player.sprite.animations.add('hit', [4, 5], 8, false);
    Player.sprite.animations.play('idle');

    Player.sprite.x = this.prevStairsPosition * this.TILE_SIZE;
    Player.sprite.y = 1 * this.TILE_SIZE;
    
},

updatePlayerHPOnScreen : function(playerHP) {
    
    // First, fill the base with disabled hearts
    for (var i = 0; i < 7; i++) {
        this.baseHeartSprites[i].loadTexture('bottomUIDisabledHeart');
    }
    
    // Then, add empty hearts to the base according to playerMaxHP
    for (var j = 0; j < Player.playerMaxHP/2; j++) {
        this.baseHeartSprites[j].loadTexture('bottomUIEmptyHeart');
    }
    if (Player.playerMaxHP % 2 == 1) {
        this.baseHeartSprites[Math.floor(Player.playerMaxHP/2)].loadTexture('bottomUIHalfDisabledHeart');
    }
    
    // Add full hearts according to playerHP
    for (var k = 0; k < Math.floor(playerHP/2); k++) {
        this.heartSprites[k].loadTexture('bottomUIFullHeart');
    }
    
    //Fill the last slot with a half heart
    if (playerHP % 2 == 1) {
        this.heartSprites[Math.floor(playerHP/2)].loadTexture('bottomUIHalfHeart');
        // Clean rest of the slots
        for (var m = Math.floor(playerHP/2)+1; m < 7; m++) {
            this.heartSprites[m].loadTexture('bottomUINullHeart');
        }
    } else {
        // Clean rest of the slots
        for (var m = playerHP/2; m < 7; m++) {
            this.heartSprites[m].loadTexture('bottomUINullHeart');
        }
    }
    
    //console.log(this.heartSprites);
    
},

updatePlayerWeaponsOnScreen : function() {
    
    this.weaponSprite.loadTexture(Player.currentWeapon.sprite);
    
},

updatePlayerItemsOnScreen : function() {
    
    // Fill all with disabled slots
    for (var l = 0; l < 2; l++) {
        for (var k = 0; k < 5; k++) {
            this.baseInventorySprites[k+(l*5)].loadTexture('bottomUIDisabledSlot');
        }
    }
    
    // Fill empty slots according to inventorySize
    for (var t = 0; t < Player.inventorySize; t++) {
        //console.log(t);
        this.baseInventorySprites[t].loadTexture('bottomUIEmptySlot');
    }
    
    //console.log("Inventory slot sprites: " + this.baseInventorySprites);
    
    // Clear item icons
    for (var p = 0; p < Player.inventory.length; p++) {
            this.inventorySprites[p].loadTexture('bottomUINullHeart');
    }
    
    for (var i = 0; i < this.inventorySprites.length; i++)
        this.inventorySprites[i].kill();
    
    // Fill item icons from inventory
    for (var p = 0; p < Player.inventory.length; p++) {
            //console.log(Player.inventory[p]);
            if (Player.inventory[p] == undefined) {
                break;
            }
            this.inventorySprites[p].loadTexture(Player.inventory[p].sprite);
            this.inventorySprites[p].revive();
    }
    
},

updateCoinsOnScreen : function() {
    this.coinsBitmapText.text = Player.coins.toString();
},

updateDungeonLevelOnScreen : function() {
    this.dungeonLevelBitmapText.text = Player.dungeonLevel.toString();
},

updateCurseDaysOnScreen : function() {
    this.curseDaysBitmapText.text = Player.curseDays.toString();
},


textWriter : function(text) {
    
    this.fullText = text;
    
    Player.LockInput();
    this.inMiddleOfConversation = true;
    
    var letters = text.split("");
    if (!this.introPlaying) {
        this.textBoxSprite.revive();
        this.textBoxBitmapText.x = 34;
    }
    this.textBoxBitmapText.revive();
    var textInProgress = [];
    // Save each level of string into an array
    for (var z = 0; z < letters.length; z++) {
        textInProgress.push(letters[z]);
        this.textsArray.push(textInProgress.join(""));
    }
    // Start drawing
    this.textWriterDraw();
},

textWriterDraw : function() {
    // Draw string
    if (this.textsArray.length >= this.letterCounter)
        this.textBoxBitmapText.text = this.textsArray[this.letterCounter];
    
    // Show all text at once
    if (this.skippingConversation) {
        this.textBoxBitmapText.text = this.fullText;
        this.textsArray = [];
        this.letterCounter = 0;
        this.inMiddleOfConversation = false;
        this.skippingConversation = false;
        return
    }
    
    // If text is complete, return
    if(this.letterCounter == this.textsArray.length-1) {
        this.textsArray = [];
        this.inMiddleOfConversation = false;
        this.skippingConversation = false;
        this.letterCounter = 0;
        return;
    } else {
        // If not, call this same function to draw the next string
        this.letterCounter++;
        game.time.events.add(80, this.textWriterDraw, this);
    }
},

getRandomCharacterLine : function(characterName, isOfferingItem, isOfferingQuest) {
    var randomCharacterLine = "";
    var randomNumber = Math.floor(Math.random()*5+1);
    switch (characterName) {
        case 'ALF':
            switch (randomNumber) {
                case 1:
                    randomCharacterLine = "WOOF.";
                    break;
                case 2:
                    randomCharacterLine = "WOOF  WOOF.";
                    break;
                case 3:
                    randomCharacterLine = "GRRRH.";
                    break;
                case 4:
                    randomCharacterLine = "WOOF?";
                    break;
                case 5:
                    randomCharacterLine = "WOOF  WOOF  WOOF.";
                    break;
            }; break;
        case 'FRANK':
            switch (randomNumber) {
                case 1:
                    randomCharacterLine = "I  HAVE  LOST  MY\nMOTHER  A  MONTH  AGO.";
                    break;
                case 2:
                    randomCharacterLine = "HERE  IS  HER  GRAVE...";
                    break;
                case 3:
                    randomCharacterLine = "I  DID  NOT  HAVE  A\nGREAT  LIFE  ANYWAY.";
                    break;
                case 4:
                    randomCharacterLine = "CAN  YOU  PLEASE\nLEAVE  ME  ALONE  WITH\nHER?";
                    break;
                case 5:
                    randomCharacterLine = "THEY  ALL  CALLED  ME\nUGLY.  NOW  THEY  ARE  ALL\nDEAD.";
                    break;
            }; break;
        case 'LUKA':
            switch (randomNumber) {
                case 1:
                    randomCharacterLine = "I'M  TOO  YOUNG  TO\nDIE.";
                    break;
                case 2:
                    randomCharacterLine = "LOOK  AT  MY  SKIN.\nYOU  THINK  IT'S  THAT  BAD?";
                    break;
                case 3:
                    randomCharacterLine = "I  STARTED  TO  SEE  'IT'\nIN  MY  DREAMS.";
                    break;
                case 4:
                    randomCharacterLine = "IF  YOU  WON'T  HELP\nUS  NO  ONE  CAN.  OH...  YOU\nALSO  HAVE  IT.";
                    break;
                case 5:
                    randomCharacterLine = "I  FEEL  WEAK.  PLEASE\nEND  THIS  CURSE.";
                    break;
            }; break;
        case 'LUNA':
            switch (randomNumber) {
                case 1:
                    randomCharacterLine = "I  WAS  THE  ONLY  ONE\nWHO  COULD  HELP  BUT\nTHOSE  DAMN  SKELETONS...";
                    break;
                case 2:
                    randomCharacterLine = "YOU  THINK  YOU  ARE\nSTRONG?";
                    break;
                case 3:
                    randomCharacterLine = "MY  RALPH  DIED  AND\nNOW  IT'S  MY  TIME.";
                    break;
                case 4:
                    randomCharacterLine = "I  TOLD  THEM  NOT  TO\nPOKE  INTO  THE  ANCIENT\nDEEPS.  IT'S  TOO  LATE  NOW.";
                    break;
                case 5:
                    randomCharacterLine = "TRY  NOT  TO  STEP\nINTO  POISONOUS  PUDDLES.";
                    break;
            }; break;
        case 'MEG':
            switch (randomNumber) {
                case 1:
                    randomCharacterLine = "MY  MOTHER  TOLD  ME\nTO  WAIT  HERE  FOR  HER.";
                    break;
                case 2:
                    randomCharacterLine = "I  THINK  YOU  LOOK\nLIKE  MY  FATHER.  HMM...\nNOT  SURE.";
                    break;
                case 3:
                    randomCharacterLine = "THIS  BALLOON  IS\nUNDER  MY\nRESPONSIBILITY.";
                    break;
                case 4:
                    randomCharacterLine = "I'M  SURE  MOM  IS\nGATHERING  MUSHROOMS\nIN  THE  WOODS.";
                    break;
                case 5:
                    randomCharacterLine = "THOSE  RATS  AROUND\nTHE  STAIRS  ARE  NOT  VERY\nFRIENDLY.";
                    break;
            }; break;
        case 'NOE':
            switch (randomNumber) {
                case 1:
                    randomCharacterLine = "DON'T  LOSE  TIME.  WE\nARE  DYING.";
                    break;
                case 2:
                    randomCharacterLine = "I  WOULD  SAY  RUN  BUT\nYOU  ARE  CURSED  TOO.";
                    break;
                case 3:
                    randomCharacterLine = "THINK  BEFORE  ACT.\nFACE  THE  DEVIL  PREPARED.";
                    break;
                case 4:
                    randomCharacterLine = "I  THINK  IT  LURKS\nAROUND  40TH  FLOOR  BUT\nTHIS  IS  JUST  A  GUESS.";
                    break;
                case 5:
                    randomCharacterLine = "I'M  NOT  AS  WISE  AS\nTHEY  THINK  I  AM.";
                    break;
            }; break;
    }
    if (isOfferingItem) {
        switch (characterName) {
            case 'FRANK':
                randomCharacterLine = "SORRY,  I'VE  GOT\nNOTHING  MORE  TO  OFFER.";
                break;
            case 'LUKA':
                randomCharacterLine = "TAKE  THIS  AND  DO\nSOMETHING  WITH  IT.";
                break;
            case 'LUNA':
                randomCharacterLine = "THIS  WAS  MY\nRALPH'S.";
                break;
            case 'MEG':
                randomCharacterLine = "LOOK  WHAT  I'VE\nFOUND  FOR  YOU.";
                break;
            case 'NOE':
                randomCharacterLine = "USE  IT  WISELY.";
                break;
        }
    } else if (isOfferingQuest) {
        switch (characterName) {
            case 'FRANK':
                randomCharacterLine = "IF  YOU  WANT  MY\nADVICE,  NOW  I  WOULD...";
                break;
            case 'LUKA':
                randomCharacterLine = "JUST  GET  INTO  THE\nDUNGEONS  ALREADY!";
                break;
            case 'LUNA':
                randomCharacterLine = "LISTEN,  I  KNOW  HOW\nYOU  SHOULD  PROCEED...";
                break;
            case 'MEG':
                randomCharacterLine = "PRETTY  PLEASE?";
                break;
            case 'NOE':
                randomCharacterLine = "EVERY  STEP  WILL  GET\nYOU  CLOSER  TO  IT.";
                break;
        }
    }
    return characterName+":  "+randomCharacterLine;
},





/*
almost everything is in assets/intro

there is also blackScreen.png in assets for background
it starts with blackScreen + intro_arne_breathing (loop anim) + intro_firesparks (loop anim)
then we show the text with text writer, one letter at a time
pulling sentences from introTextArray
second cut is noe and third is arne, it goes on like this
there is a point where intro_arne_breathing changes into intro_arne_shiningeye
for noe the setup is blackScreen + intro_noe_breathing (loop anim) + intro_firesparks_2 (loop anim)
it changes into shiningeye at introTextArray[6]
*/


startIntro : function() {
    
    this.nextIntroEvent = game.time.events.add(1000, function() {
        
        if (this.introTextArray.length > 0 && !this.skipIntro) {
            
            if (!this.inMiddleOfConversation && this.introTextArray.length > 0) {
                
                // Hide Noa, show Arne and viceversa
                if (this.introTextArray.length % 2 == 1) {
                    
                    this.noeBreathing.kill();
                    this.fireSparks2.kill();
                    this.arneBreathing.revive();
                    this.fireSparks.revive();
                    this.textBoxBitmapText.x = 94;
                    this.textBoxBitmapText.y = 68;
                }
                else {
                    this.noeBreathing.revive();
                    this.arneBreathing.kill();
                    this.fireSparks.kill();
                    this.fireSparks2.revive();
                    this.textBoxBitmapText.x = 24;
                    this.textBoxBitmapText.y = 60;
                }
                
                // Stop music when Arne says "I'll kill it"
                if (this.introTextArray.length == 5) {
                    this.villageTheme.stop();
                }
                
                // Change Arne animation from breathing to shining eye
                if (this.introTextArray.length == 3) {
                    this.arneBreathing.loadTexture('introArneShiningeye');
                    this.arneBreathing.animations.add('introArneShiningeye', [0,1,2,3,4,5], 3, false);
                    this.arneBreathing.animations.play('introArneShiningeye');
                    
                    this.villageTheme.loopFull(0.3);
                }
                
                this.textWriter(this.introTextArray[0]);
                this.introTextArray.splice(0, 1);
                this.startIntro();
            }
            else {
                this.startIntro();
            }
        }
        
        // Final text
        else if (this.inMiddleOfConversation && !this.skipIntro) {
            this.startIntro();
        }
        
        // Text finished
        else {
            // Start game here. Transition?
            
            game.time.events.add(1000, function() {
                
                this.introPlaying = false;
                
                this.textsArray = [];
                this.inMiddleOfConversation = false;
                this.skippingConversation = false;
                this.letterCounter = 0;
                
                this.villageTheme.stop();

                this.textBoxBitmapText.text = "";
                this.textBoxBitmapText.x = 34;
                this.textBoxBitmapText.y = 117;
                this.textBoxBitmapText.font = 'LURKDark';
                
                this.noeBreathing.kill();
                this.arneBreathing.kill();
                this.fireSparks.kill();
                this.fireSparks2.kill();
                this.blackScreen.kill();
                
                // Launch title screen
                this.titleScreen();
                
            }, this);
        }

    }, this);
},

titleScreen : function() {
    
    // Play title music
    this.mainTheme.loopFull(0.3);
    
    // Tween logo and background
    this.titleBG = game.add.sprite(0, 0, 'titleScreenBG');
    this.logoSprite = game.add.sprite(0, 35, 'titleScreenLogo');
    
    
    game.time.events.add(3000, function() {
        
        var tweenBG = game.add.tween(this.titleBG).to( { x: 0, y:-144 }, 6000, Phaser.Easing.Linear.None, true);
        var tweenLogo = game.add.tween(this.logoSprite).to( { x: 0, y: -144 }, 5000, Phaser.Easing.Linear.None, true);
        tweenBG.onComplete.add( function() {
            
            Game.lineBGsprite = game.add.sprite(0, 134, 'pressXBg');
            Game.bitmapTextStart = game.add.bitmapText(48, 133, 'LURKLight', "PRESS  A  TO  START", 6);
            
            Game.titleWaitingToStart = true;
        });
        
    }, this);

    
},

startGame : function() {
    
    this.lineBGsprite.kill();
    this.bitmapTextStart.kill();
    this.titleBG.kill();
    this.logoSprite.kill();
    
    Player.UnlockInput();
    
    this.mainTheme.stop();

    this.villageTheme.loopFull(0.3);
    
}

}; // Game var


