import 'phaser';

export class BaseObject extends Phaser.GameObjects.Sprite {
    constructor(
        scene,
        position,
        texture,
        type) 
    {
        super(scene, type);
        this.position = position;
    }
}