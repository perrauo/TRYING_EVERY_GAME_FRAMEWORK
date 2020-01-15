import Phaser from "phaser";

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

window.onload = function()
{
    window.game = new Game()
}