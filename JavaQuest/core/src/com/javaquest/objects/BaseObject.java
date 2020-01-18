package com.javaquest.objects;


import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.math.Vector2;
import com.javaquest.Level;

public abstract class BaseObject {
    protected Vector2 pos;
    protected float velocityY = 0;
    protected Level map;
    protected boolean grounded = false;

    public void update (float deltaTime, float gravity) {
        float newY = pos.y;
        newY += this.velocityY * deltaTime;
    }

    public abstract void render (SpriteBatch batch);

    protected void moveX (float amount) {

    }

     public Vector2 getPos() {
        return pos;
    }

    public float getX () {
        return pos.x;
    }

    public float getY () {
        return pos.y;
    }

    public boolean isGrounded() {
        return grounded;
    }

}
