package com.javaquest.objects;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.Rectangle;
import com.badlogic.gdx.math.Vector2;
import com.cirrus.RectangleUtils;
import com.cirrus.TiledUtils;
import com.cirrus.Utils;
import com.javaquest.*;
//import com.badlogic.gdx.graphics.sp

public class Avatar extends BaseObject {

    AvatarSpriteController spriteController;
    private Vector2 inputAxes = new Vector2();
    private Vector2 velocity = new Vector2();
    private Utils.Direction direction = Utils.Direction.DOWN;

    private Rectangle hitbox;
    private ShapeRenderer shapeRenderer = new ShapeRenderer();

    private Vector2 hitboxOffset = new Vector2(-hitboxWidth/2, -32/8);

    private static final int hitboxWidth = 32 / 3;
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
                horizontalCollision + (int) velocity.x,
                RectangleUtils.top(hitbox)) != null ||
            TiledUtils.worldToCell(
                Level.getInstance().getCollisionLayer(),
                horizontalCollision + (int) velocity.x,
                RectangleUtils.bottom(hitbox)) != null)
        {
            position.x =
                velocity.x > 0 ?
                position.x + (((int) position.x) % LevelUtils.TILE_SIZE) - (LevelUtils.TILE_SIZE-1) - (position.x - RectangleUtils.right(hitbox)) :
                position.x - (((int) position.x) % LevelUtils.TILE_SIZE) - (RectangleUtils.left(hitbox) - position.x);

            velocity.x = 0;
        }

//         Vertical Collision
        int verticalCollision = velocity.y > 0 ?
                RectangleUtils.top(hitbox) :
                RectangleUtils.bottom(hitbox);

        if (TiledUtils.worldToCell(
                Level.getInstance().getCollisionLayer(),
                RectangleUtils.left(hitbox),
                verticalCollision + velocity.y) != null ||
            TiledUtils.worldToCell(
                Level.getInstance().getCollisionLayer(),
                RectangleUtils.right(hitbox),
                verticalCollision + velocity.y) != null) {

            position.y =
                    velocity.y > 0 ?
                        position.y - (((int) position.y) % LevelUtils.TILE_SIZE) + (LevelUtils.TILE_SIZE-1) + (RectangleUtils.bottom(hitbox) - position.y) :
                        position.y + (((int) position.y) % LevelUtils.TILE_SIZE) - (RectangleUtils.top(hitbox) - position.y);

            velocity.y = 0;
        }

        position = position.add(velocity);
        hitbox.setPosition(position.cpy().add(hitboxOffset));

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
    }


    @Override
    public void render(SpriteBatch batch) {

        spriteController.render(batch);

        if (!Game.getInstance().isDebugDrawingEnabled())
            return;

        shapeRenderer.setProjectionMatrix(
                CameraController.getInstance().getCamera().combined);

        shapeRenderer.begin(ShapeRenderer.ShapeType.Filled);
        shapeRenderer.setColor(Color.YELLOW);
        shapeRenderer.circle(position.x, position.y, 2);
        shapeRenderer.end();

        shapeRenderer.begin(ShapeRenderer.ShapeType.Line);
        shapeRenderer.setColor(Color.RED);
        shapeRenderer.rect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
        shapeRenderer.end();
    }
}
