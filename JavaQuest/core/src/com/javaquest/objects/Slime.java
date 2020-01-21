package com.javaquest.objects;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.javaquest.CameraController;
import com.javaquest.Game;
import com.javaquest.Level;

public class Slime extends Object
{
    public Slime()
    {
        super();
        spriteController = new SlimeSpriteController(this);
    }

    private Avatar target;
    public void SetTarget(Avatar avatar) {
        this.target = avatar;
    }

    @Override
    public void onStart() {
        super.onStart();
        target = Level.getInstance().find(Avatar.class);
    }

    private SlimeSpriteController spriteController = new SlimeSpriteController(this);
    @Override
    protected SpriteController getSpriteController() {
        return spriteController;
    }

    @Override
    public void update(float deltaTime) {
        super.update(deltaTime);
        if (target != null) inputAxes = (target.position.cpy().sub(position)).nor();
    }

    @Override
    public void render(SpriteBatch batch) {
        super.render(batch);

        getSpriteController().render(batch);

        if (!Game.getInstance().isDebugDrawingEnabled())
            return;

        shapeRenderer.setProjectionMatrix(
            CameraController.getInstance().getCamera().combined);

        shapeRenderer.begin(ShapeRenderer.ShapeType.Filled);
        shapeRenderer.setColor(Color.YELLOW);
        shapeRenderer.circle(position.x, position.y, 2);
        shapeRenderer.end();

        collisionController.render();
    }
}
