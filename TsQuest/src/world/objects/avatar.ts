import 'phaser'

import { BaseObject } from './base-object';


const AvatarAnimation = {
    IDLE: 'avatar-idle',
    IDLE_FRONT: 'avatar-idle-front',
    IDLE_BACK: 'avatar-idle-back',
    IDLE_SIDE: 'avatar-idle-side',
    WALK_FRONT: 'avatar-walk-front',
    WALK_SIDE: 'avatar-walk-side',
    WALK_BACK: 'avatar-walk-back'
}

export class Avatar extends BaseObject {

    objectType = "avatar";

    constructor(
        scene: Phaser.Scene,
        position: Phaser.Math.Vector2) {
    
        super(scene, position, 'avatar');

        this.scene.load.spritesheet(
            'avatar-',
            './src/assets/objects/avatar/avatar_spritesheet.png',
            { frameWidth: 32, frameHeight: 32 });

        this.anims.animationManager.create(
        {
            key: AvatarAnimation.WALK_FRONT,
            frameRate: 10,
            frames: this.anims.animationManager.generateFrameNumbers(this.objectType, {
                frames: [0, 1, 2]
            })
        })
       
        64524
        // this.anims.animationManager.create(
        // Phaser.Typesation
        // {
        //     key: AvatarAnimation.IDLE_FRONT,
        //     frameRate: 10,
        //     frames: this.anims.animationManager.generateFrameNumbers(this.objectType, {
        //         frames: [0, 1, 2]
        //     })
        // })
    }  
}