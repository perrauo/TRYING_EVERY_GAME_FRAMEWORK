// Title screen JS file. Contains the Title screen state

/*global Phaser, game*/

var Title = {

// Define variables
preloadBar  : undefined,
buttonA     : undefined,

// Define functions
init : function() {
    
    // Initialize data
    
    console.log("-> Title init");
},

preload : function() {

    // Invoke onPreloadUpdate callback at each asset loaded
    game.load.onFileComplete.add(this.onPreloadUpdate, this);
    
    // Load resources
    game.load.image('loadingBarSprite', 'assets/loadingscreen/loadingscreen_background.png'); // Provisional
},

onPreloadUpdate : function(progress, key, success, totalLoaded, totalFiles) {

    // Set a loading bar sprite that will automatically fill as files are loaded. Remember to preload this graphic before any other asset
    if(key == 'loadingBarSprite') {
        this.preloadBar = this.add.sprite(0, 0, 'loadingBarSprite');
        this.load.setPreloadSprite(this.preloadBar);
    }
    
    // Remove the onFileComplete listener when loading finishes
    if (progress === 100)
        game.load.onFileComplete.removeAll(this);

    console.log("Loading... \t" + progress + "%.\t Asset: " + key);
},

create : function() {
    
    // Create objects (sprites, etc.)
    
    // Add keyboard listener
    this.buttonA = game.input.keyboard.addKey(Phaser.Keyboard.K);
    this.buttonA.onDown.add(this.startGame, this);
},

update : function(dt) {
    
    // Update logic. Called once per frame. dt = time between frames
},

render : function() {
    
    // Custom rendering operations
    game.debug.text('Title state', 16, 16);
},

startGame : function() {
    console.log("KEY WAS PRESSED -> Start game");
    game.state.start('Game');  
},
}; // Title var