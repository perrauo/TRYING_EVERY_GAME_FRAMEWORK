package com.javaquest.objects;


import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.math.Vector2;


public abstract class BaseObject {
    protected Vector2 position = new Vector2();

    protected float speed = 0;


    protected boolean grounded = false;

    public void update(float deltaTime) {}

    public abstract void render(SpriteBatch batch);

    public void set(Vector2 position)
    {
        this.position = position;
    }

    public Vector2 position() {
        return position;
    }

}
