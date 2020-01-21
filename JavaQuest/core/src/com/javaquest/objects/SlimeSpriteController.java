package com.javaquest.objects;

import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.Animation;
import com.badlogic.gdx.graphics.g2d.TextureRegion;

public class SlimeSpriteController extends SpriteController {

    public static final float FRAME_LENGTH = 0.2f;

    public static final int WALK_FORWARD_ANIM = 1;
    public static final int IDLE_FORWARD_ANIM = 2;
    public static final int WALK_SIDE_ANIM = 3;
    public static final int IDLE_SIDE_ANIM = 4;
    public static final int WALK_BACK_ANIM = 5;
    public static final int IDLE_BACK_ANIM = 6;

    public SlimeSpriteController(Object object){
        super();

        this.object = object;
        Texture spriteSheet = new Texture("monsters/monster_spritesheet.png");
        TextureRegion[][] sprites = TextureRegion.split(spriteSheet, getSize(), getSize());

        animations.put(
                WALK_FORWARD_ANIM,
                new Animation<TextureRegion>(FRAME_LENGTH,
                        sprites[0][0], sprites[0][1], sprites[0][2]
                ));

        animations.put(
                IDLE_FORWARD_ANIM,
                new Animation<TextureRegion>(FRAME_LENGTH,
                        sprites[0][2]
                ));

        animations.put(
                WALK_SIDE_ANIM,
                new Animation<TextureRegion>(FRAME_LENGTH,
                        sprites[0][3], sprites[0][4], sprites[0][5]
                ));

        animations.put(
                IDLE_SIDE_ANIM,
                new Animation<TextureRegion>(FRAME_LENGTH,
                        sprites[0][4]
                ));

        animations.put(
                WALK_BACK_ANIM,
                new Animation<TextureRegion>(FRAME_LENGTH,
                        sprites[0][6], sprites[0][7], sprites[0][8]
                ));

        animations.put(
                IDLE_BACK_ANIM,
                new Animation<TextureRegion>(FRAME_LENGTH,
                        sprites[0][7]
                ));

        play(WALK_FORWARD_ANIM, true);
    }
}
