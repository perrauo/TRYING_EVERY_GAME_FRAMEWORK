package com.javaquest.objects;

import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.Animation;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.graphics.g3d.particles.renderers.PointSpriteRenderer;

import java.util.Dictionary;
import java.util.Hashtable;

public class AvatarSpriteController {

    public static final float FRAME_LENGTH = 0.2f;
    public static final int OFFSET = 8;
    public static final int SIZE = 32;
    public static final int IMAGE_SIZE = 32;

    private float stateTime = 0;

    private Dictionary<Integer, Animation<TextureRegion>> animations = new Hashtable<>();

    private Animation currentAnimation;

    private int currentAnimationID;

    public static final int WALK_FORWARD_ANIM = 1;
    public static final int IDLE_FORWARD_ANIM = 2;
    public static final int WALK_SIDE_ANIM = 3;
    public static final int IDLE_SIDE_ANIM = 4;
    public static final int WALK_BACK_ANIM = 5;
    public static final int IDLE_BACK_ANIM = 6;

    private boolean looping = false;

    private BaseObject object;

    public boolean flipped = false;

    public AvatarSpriteController(BaseObject object) {

        this.object = object;
        Texture spriteSheet = new Texture("avatar/avatar_spritesheet.png");
        TextureRegion[][] sprites = TextureRegion.split(spriteSheet, IMAGE_SIZE, IMAGE_SIZE);


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

    public void update(float deltaTime) {
        stateTime += deltaTime;
    }

    public void play(int animation, boolean loop) {
        if(animation == currentAnimationID)
            return;

        System.out.println(currentAnimation);
        looping = loop;
        currentAnimationID = animation;
        currentAnimation = animations.get(currentAnimationID);
    }

    public void render(SpriteBatch batch) {
        batch.begin();
        batch.draw(
                (TextureRegion) currentAnimation.getKeyFrame(stateTime, looping),
                object.position.x + SIZE * (flipped ? 1 : 0),
                object.position.y,
                SIZE * (flipped ? -1 : 1),
                SIZE);
        batch.end();
    }
}
