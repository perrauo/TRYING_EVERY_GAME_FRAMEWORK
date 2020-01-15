import 'phaser'

export default class Scene extends Phaser.Scene {
    constructor() {
        super('Game');
    }
    
    preload() {
        this.load.image('logo', "./src/assets/logo.png");
    }

    create() {
        var logo = this.add.image(400, 150, "logo");
    }
}