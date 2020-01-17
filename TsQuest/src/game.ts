import "phaser";

import Scene from './scenes/scene';

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
};

class Game extends Phaser.Game
{
    constructor(){
        super(config);
        this.scene.add('Game', Scene);
        this.scene.start('Game');
    }    
}

var game:Game = null;

window.onload = function()
{
    game = new Game()

    // TS2339: Property 'Types' does not exist on type 'typeof Phaser'.
    //Phaser.Types.  
    // Phaser.Types
    // var animation = new Phaser.Types.Ani();
    
}