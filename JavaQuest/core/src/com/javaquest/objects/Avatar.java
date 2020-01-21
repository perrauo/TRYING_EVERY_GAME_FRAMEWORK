package com.javaquest.objects;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.Vector2;
import com.cirrus.Utils;
import com.javaquest.*;
//import com.badlogic.gdx.graphics.sp

public class Avatar extends Object {

    AvatarSpriteController spriteController = new AvatarSpriteController(this);
    @Override
    protected SpriteController getSpriteController() {
        return spriteController;
    }

    public Avatar() {
        super();
    }

    @Override
    public void update(float deltaTime) {

        if (InputUtils.IsLeftPressed() && !InputUtils.IsRightPressed())
            inputAxes.x = -1;
        else if (!InputUtils.IsLeftPressed() && InputUtils.IsRightPressed())
            inputAxes.x = 1;
        else inputAxes.x = 0;

        if (InputUtils.IsUpPressed() && !InputUtils.IsDownPressed())
            inputAxes.y = 1;
        else if (!InputUtils.IsUpPressed() && InputUtils.IsDownPressed())
            inputAxes.y = -1;
        else inputAxes.y = 0;

        velocity = inputAxes.scl(speed);
        collisionController.moveAndCollide(velocity);
        position = position.add(velocity);

        if (inputAxes.x < 0) {
            direction = Utils.Direction.LEFT;
            getSpriteController().flipped = false;
            getSpriteController().play(AvatarSpriteController.WALK_SIDE_ANIM, true);
        } else if (inputAxes.x > 0) {
            direction = Utils.Direction.RIGHT;
            getSpriteController().flipped = true;
            getSpriteController().play(AvatarSpriteController.WALK_SIDE_ANIM, true);
        } else if (inputAxes.y < 0) {
            direction = Utils.Direction.DOWN;
            getSpriteController().flipped = false;
            getSpriteController().play(AvatarSpriteController.WALK_FORWARD_ANIM, true);
        } else if (inputAxes.y > 0) {
            direction = Utils.Direction.UP;
            getSpriteController().flipped = false;
            getSpriteController().play(AvatarSpriteController.WALK_BACK_ANIM, true);
        }

        if (inputAxes.epsilonEquals(Vector2.Zero)) {
            inputAxes = Vector2.Zero.cpy();
            switch (direction) {
                case LEFT:
                case RIGHT:
                    getSpriteController().play(
                        AvatarSpriteController.IDLE_SIDE_ANIM, true);
                    break;

                case UP:
                    getSpriteController().play(
                        AvatarSpriteController.IDLE_BACK_ANIM, true);
                    break;

                case DOWN:
                    getSpriteController().play(
                        AvatarSpriteController.IDLE_FORWARD_ANIM, true);
                    break;
            }
        }

        getSpriteController().update(deltaTime);
        collisionController.update();
    }


    @Override
    public void render(SpriteBatch batch) {
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
