package com.javaquest.objects;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.maps.tiled.TiledMapTileLayer;
import com.badlogic.gdx.math.Intersector;
import com.badlogic.gdx.math.Rectangle;
import com.badlogic.gdx.math.Vector2;
import com.cirrus.RectangleUtils;
import com.cirrus.TiledUtils;
import com.cirrus.Utils;
import com.javaquest.CameraController;
import com.javaquest.Game;
import com.javaquest.InputUtils;
import com.javaquest.Level;
//import com.badlogic.gdx.graphics.sp

public class Avatar extends BaseObject {

    AvatarSpriteController spriteController;
    private Vector2 inputAxes = new Vector2();
    private Vector2 velocity = new Vector2();
    private Utils.Direction direction = Utils.Direction.DOWN;

    private Rectangle hitbox;
    private ShapeRenderer hitboxRenderer = new ShapeRenderer();
    private Vector2 hitboxOffset = new Vector2(32 / 4, 0);

    private static final int hitboxWidth = 32 / 2;
    private static final int hitboxHeight = 32 / 4;

    public Avatar() {
        super();
        spriteController = new AvatarSpriteController(this);
        hitbox = new Rectangle(0, 0, hitboxWidth, hitboxHeight);
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

        // Horizontal Collision
        int horizontalCollision = velocity.x > 0 ?
                RectangleUtils.right(hitbox) :
                RectangleUtils.left(hitbox);

        if (TiledUtils.worldToCell(
                Level.getInstance().getCollisionLayer(),
                horizontalCollision + (int)velocity.x,
                RectangleUtils.top(hitbox)) != null ||
            TiledUtils.worldToCell(
                        Level.getInstance().getCollisionLayer(),
                        horizontalCollision + (int)velocity.x,
                        RectangleUtils.bottom(hitbox)) != null)
        {
            if(velocity.x > 0) {
                // TODO TILE_SIZE = 32
                // moving to the right
                position.x = position.x - ((int)position.x % 32) + 31 - (RectangleUtils.right(hitbox) - position.x);
            }
            else {
                position.x = position.x - ((int)position.x % 32) + (RectangleUtils.left(hitbox) - position.x);
            }

            velocity.x = 0;
        }

        position = position.add(velocity);

        if (inputAxes.x < 0) {
            direction = Utils.Direction.LEFT;
            spriteController.flipped = false;
            spriteController.play(AvatarSpriteController.WALK_SIDE_ANIM, true);
        } else if (inputAxes.x > 0) {
            direction = Utils.Direction.RIGHT;
            spriteController.flipped = true;
            spriteController.play(AvatarSpriteController.WALK_SIDE_ANIM, true);
        } else if (inputAxes.y < 0) {
            direction = Utils.Direction.DOWN;
            spriteController.flipped = false;
            spriteController.play(AvatarSpriteController.WALK_FORWARD_ANIM, true);
        } else if (inputAxes.y > 0) {
            direction = Utils.Direction.UP;
            spriteController.flipped = false;
            spriteController.play(AvatarSpriteController.WALK_BACK_ANIM, true);
        }

        if (inputAxes.epsilonEquals(Vector2.Zero)) {
            inputAxes = Vector2.Zero.cpy();
            switch (direction) {
                case LEFT:
                case RIGHT:
                    spriteController.play(
                            AvatarSpriteController.IDLE_SIDE_ANIM, true);
                    break;

                case UP:
                    spriteController.play(
                            AvatarSpriteController.IDLE_BACK_ANIM, true);
                    break;

                case DOWN:
                    spriteController.play(
                            AvatarSpriteController.IDLE_FORWARD_ANIM, true);
                    break;
            }

        }

        spriteController.update(deltaTime);
        hitbox.setPosition(position.cpy().add(hitboxOffset));
    }


    @Override
    public void render(SpriteBatch batch) {

        spriteController.render(batch);


        if (!Game.getInstance().isDebugDrawingEnabled())
            return;

        hitboxRenderer.setProjectionMatrix(
                CameraController.getInstance().getCamera().combined);
        hitboxRenderer.begin(ShapeRenderer.ShapeType.Line);
        hitboxRenderer.setColor(Color.RED);
        hitboxRenderer.rect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
        hitboxRenderer.end();
    }
}
