import 'phaser';

export class BaseObject extends Phaser.GameObjects.GameObject {
    constructor(
        scene,
        position,
        type) 
    {
        super(scene, type);
        this.position = position;
    }

    update(t, td) {
        // Place frame update code here
        
    }
}