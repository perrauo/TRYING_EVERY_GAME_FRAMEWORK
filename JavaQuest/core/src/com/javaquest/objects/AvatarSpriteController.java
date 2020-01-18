package com.javaquest.objects;

import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.Animation;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.g2d.TextureAtlas;
import com.badlogic.gdx.graphics.g2d.TextureRegion;

import java.util.Dictionary;
import java.util.Hashtable;

public class AvatarSpriteController {

    public static final float FRAME_LENGTH = 0.2f;
    public static final int OFFSET = 8;
    public static final int SIZE = 64;
    public static final int IMAGE_SIZE = 32;

    private float stateTime = 0;

    private Dictionary<AnimationID, Animation<TextureRegion>> animations = new Hashtable<>();

    private Animation currentAnimation;

    public enum AnimationID {
        WALK_FORWARD,
        IDLE_FORWARD;
    }

    private BaseObject object;

    public AvatarSpriteController(BaseObject object) {

        this.object = object;
        Texture spriteSheet = new Texture("avatar/avatar_spritesheet.png");
        TextureRegion[][] sprites = TextureRegion.split(spriteSheet, IMAGE_SIZE, IMAGE_SIZE);

        animations.put(
                AnimationID.WALK_FORWARD,
                new Animation<TextureRegion>(FRAME_LENGTH,
                        sprites[0][1], sprites[0][2], sprites[0][3]
                ));

        animations.put(
                AnimationID.IDLE_FORWARD,
                new Animation<TextureRegion>(FRAME_LENGTH,
                        sprites[0][2]
                ));
        play(AnimationID.WALK_FORWARD);
    }

    public void update(float deltaTime) {
        stateTime += deltaTime;
//        if (currentAnimation.isAnimationFinished(stateTime))
//        {}
    }

    public void play(AnimationID animation) {
        currentAnimation = animations.get(animation);
    }

    public void render(SpriteBatch batch) {
        batch.draw(
                (TextureRegion) currentAnimation.getKeyFrame(stateTime),
                object.position.x,
                object.position.y,
                SIZE,
                SIZE);
    }
}
