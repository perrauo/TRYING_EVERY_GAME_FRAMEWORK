import 'phaser';

export abstract class BaseObject extends Phaser.GameObjects.Sprite {

    position : Phaser.Math.Vector2;

    public abstract objectType: string;

    constructor(
        scene : Phaser.Scene,
        position : Phaser.Math.Vector2,
        texture : string) 
    {
        super(
            scene,
            position.x,
            position.y,
            texture
            );

        this.position = position;
    }

    update(deltaTime : number) {
        
    }
}