package com.javaquest.objects;


import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.Vector2;
import com.cirrus.Utils;


public abstract class Object {

    protected Vector2 position = new Vector2();
    protected float speed = 1;

    protected abstract SpriteController getSpriteController();
    protected CollisionController collisionController;

    protected Vector2 inputAxes = new Vector2();
    protected Vector2 velocity = new Vector2();
    protected Utils.Direction direction = Utils.Direction.DOWN;
    protected ShapeRenderer shapeRenderer = new ShapeRenderer();

    public Object()
    {
        collisionController = new CollisionController(this);
    }

    public void update(float deltaTime) {

    }

    public void render(SpriteBatch batch)
    {

    }

    public void setPosition(Vector2 position) {
        this.position = position;
    }

    public Vector2 getPosition() {
        return position;
    }

    public float getDepth()
    {
        return -position.y;
    }

    public void onStart() {

    }
}
