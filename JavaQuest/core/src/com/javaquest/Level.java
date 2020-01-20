package com.javaquest;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;

import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.maps.MapLayer;
import com.badlogic.gdx.maps.MapObject;
import com.badlogic.gdx.maps.tiled.*;
import com.badlogic.gdx.maps.tiled.renderers.OrthogonalTiledMapRenderer;
import com.badlogic.gdx.math.Vector2;
import com.cirrus.TiledUtils;
import com.javaquest.objects.Avatar;
import com.javaquest.objects.BaseObject;
import com.javaquest.objects.ObjectUtils;

import java.util.ArrayList;
import java.util.List;


public class Level {

    private TiledMap tiledMap;
    private TiledMapRenderer tiledMapRenderer;
    private List<BaseObject> objects = new ArrayList<>();

    private ShapeRenderer shapeRenderer = new ShapeRenderer();

    private TiledMapTileLayer collisionLayer;
    public TiledMapTileLayer getCollisionLayer() {
        return collisionLayer;
    }

    private static Level instance;
    public static Level getInstance() {
        return instance;
    }

    public Level() {
        instance = this;
        tiledMap = new TmxMapLoader().load("levels/tilemap1.tmx");
        tiledMapRenderer = new OrthogonalTiledMapRenderer(tiledMap);

        for (MapLayer layer : tiledMap.getLayers()) {
            switch (layer.getName())
            {
                case TiledUtils.LAYER_COLLISION:
                    collisionLayer = (TiledMapTileLayer) layer;
                    break;

                case TiledUtils.LAYER_OBJECT:
                    for (MapObject object : layer.getObjects()) {
                        switch (object.getName()) {
                            case ObjectUtils.AVATAR:
                                Avatar avatar = new Avatar();
                                objects.add(avatar);
                                CameraController.getInstance()
                                        .set(avatar);
                                avatar.setPosition(new Vector2(
                                        object.getProperties().get(TiledUtils.OBJECT_PROP_X, float.class),
                                        object.getProperties().get(TiledUtils.OBJECT_PROP_Y, float.class)));

                                break;
                            case ObjectUtils.SLIME:
                                break;
                        }
                    }
                    break;

            }
        }
    }

    public void update(float deltaTime) {
        for (BaseObject object : objects)
        {
            object.update(deltaTime);
        }
    }

    public void render(SpriteBatch batch) {

        tiledMapRenderer.setView(
                CameraController.getInstance().getCamera());
        tiledMapRenderer.render();

        batch.setProjectionMatrix(
                CameraController.getInstance().getCamera().combined);

        for (BaseObject object : objects)
        {
            object.render(batch);
        }

        if(!Game.getInstance().isDebugDrawingEnabled())
            return;

        shapeRenderer.setProjectionMatrix(
                CameraController.getInstance().getCamera().combined);
        shapeRenderer.begin(ShapeRenderer.ShapeType.Line);
        shapeRenderer.setColor(Color.BLUE);
        for(int i = 0; i < collisionLayer.getHeight(); i++)
        {
            for(int j = 0; j < collisionLayer.getWidth(); j++)
            {
                TiledMapTileLayer.Cell cell = collisionLayer.getCell(j, i);
                if(cell != null)
                {
                    shapeRenderer.rect(
                            j * collisionLayer.getTileWidth(),
                            i * collisionLayer.getTileHeight(),
                            collisionLayer.getTileWidth(),
                            collisionLayer.getTileHeight());
                }
            }
        }
        shapeRenderer.end();
    }

    public void dispose() {
        tiledMap.dispose();
    }
}
