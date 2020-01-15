// Main JS file. This holds the Phaser instance, imports other "states" and inits one of them

/*global Phaser, game*/

var TILE_SIZE = 8;
var RESOLUTION_SCALE = 4;

// Pixel-perfect Phaser canvas with Game Boy resolution, https://belenalbeza.com/retro-crisp-pixel-art-in-phaser
var game = new Phaser.Game(160, 144, Phaser.CANVAS, 'gameboy', { init: init, preload: onGameClosed});
    
// Add states here
game.state.add('Title', Title);
game.state.add('Game', Game);
game.state.add('GameOver', GameOver);

// Launch the first state in the init function

function init() {
    console.log("main.js init");
    
    ///////////  Pixel perfect workaround code  ///////////

    // scale the game 4x
    game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    game.scale.setUserScale(RESOLUTION_SCALE, RESOLUTION_SCALE);

    // enable crisp rendering
    game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    ///////////  End Pixel perfect workaround code  ///////////

    // Choose a state and start it (should be Title)
    game.state.start('Game'); // We can change this state to debug
}

function onGameClosed() {
    console.log("Game closed. Main JS ends");
}