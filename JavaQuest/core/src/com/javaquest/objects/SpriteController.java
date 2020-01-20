package com.javaquest.objects;

import com.badlogic.gdx.graphics.g2d.Animation;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.math.Vector2;

import java.util.Dictionary;
import java.util.Hashtable;

public abstract class SpriteController {
    public static final float FRAME_LENGTH = 0.2f;

    protected int getSize() {return 32; }
    protected Vector2 getOrigin() { return new Vector2(getSize()/2, getSize()/8);}

    protected float stateTime = 0;
    protected Dictionary<Integer, Animation<TextureRegion>> animations = new Hashtable<>();
    private Animation currentAnimation;
    private int currentAnimationID;
    private boolean looping = false;
    public boolean flipped = false;

    protected BaseObject object;


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
                object.position.x - getOrigin().x + getSize() * (flipped ? 1 : 0),
                object.position.y - getOrigin().y,
                getSize() * (flipped ? -1 : 1),
                getSize());
        batch.end();
    }
}
