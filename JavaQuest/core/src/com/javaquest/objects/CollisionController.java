package com.javaquest.objects;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.Rectangle;
import com.badlogic.gdx.math.Vector2;
import com.cirrus.RectangleUtils;
import com.cirrus.TiledUtils;
import com.javaquest.CameraController;
import com.javaquest.Level;
import com.javaquest.LevelUtils;

public class CollisionController {

    private Object object;

    private Rectangle rect;
    private Vector2 offset = new Vector2(-width /2, -32/8);
    private static final int width = 32 / 3;
    private static final int height = 32 / 4;

    private ShapeRenderer renderer;

    public CollisionController(Object object) {
        this.object = object;
        this.rect = new Rectangle(0, 0, width, height);
        this.renderer = new ShapeRenderer();
    }

    public void moveAndCollide(Vector2 velocity) {
        // Horizontal Collision
        int horizontalCollision = velocity.x > 0 ?
                RectangleUtils.right(rect) :
                RectangleUtils.left(rect);

        if (TiledUtils.worldToCell(
                Level.getInstance().getCollisionLayer(),
                horizontalCollision + (int) velocity.x,
                RectangleUtils.top(rect)) != null ||
            TiledUtils.worldToCell(
                Level.getInstance().getCollisionLayer(),
                horizontalCollision + (int) velocity.x,
                RectangleUtils.bottom(rect)) != null)
        {
            object.position.x =
                    velocity.x > 0 ?
                            object.position.x + (((int) object.position.x) % LevelUtils.TILE_SIZE) - (LevelUtils.TILE_SIZE-1) - (object.position.x - RectangleUtils.right(rect)) :
                            object.position.x - (((int) object.position.x) % LevelUtils.TILE_SIZE) - (RectangleUtils.left(rect) - object.position.x);

            velocity.x = 0;
        }

//         Vertical Collision
        int verticalCollision = velocity.y > 0 ?
                RectangleUtils.top(rect) :
                RectangleUtils.bottom(rect);

        if (TiledUtils.worldToCell(
                Level.getInstance().getCollisionLayer(),
                RectangleUtils.left(rect),
                verticalCollision + velocity.y) != null ||
            TiledUtils.worldToCell(
                    Level.getInstance().getCollisionLayer(),
                    RectangleUtils.right(rect),
                    verticalCollision + velocity.y) != null) {

            object.position.y =
                    velocity.y > 0 ?
                            object.position.y - (((int) object.position.y) % LevelUtils.TILE_SIZE) + (LevelUtils.TILE_SIZE-1) + (RectangleUtils.bottom(rect) - object.position.y) :
                            object.position.y + (((int) object.position.y) % LevelUtils.TILE_SIZE) - (RectangleUtils.top(rect) - object.position.y);

            velocity.y = 0;
        }
    }

    public void update()
    {
        rect.setPosition(object.position.cpy().add(offset));
    }

    public void render()
    {
        renderer.setProjectionMatrix(
                CameraController.getInstance().getCamera().combined);

        renderer.begin(ShapeRenderer.ShapeType.Line);
        renderer.setColor(Color.RED);
        renderer.rect(rect.x, rect.y, rect.width, rect.height);
        renderer.end();
    }
}
