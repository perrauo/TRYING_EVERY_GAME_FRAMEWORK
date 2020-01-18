package com.javaquest;

import com.badlogic.gdx.graphics.g2d.SpriteBatch;

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

    public Level() {
        tiledMap = new TmxMapLoader().load("levels/tilemap1.tmx");
        tiledMapRenderer = new OrthogonalTiledMapRenderer(tiledMap);

        for (MapLayer layer : tiledMap.getLayers()) {
            for (MapObject object : layer.getObjects()) {
                switch (object.getName()) {
                    case ObjectUtils.AVATAR:
                        Avatar avatar = new Avatar();
                        objects.add(avatar);
                        Game.instance()
                                .cameraController
                                .set(avatar);
                        avatar.set(new Vector2(
                                object.getProperties().get(TiledUtils.OBJECT_PROP_X, float.class),
                                object.getProperties().get(TiledUtils.OBJECT_PROP_Y, float.class)));

                        break;
                    case ObjectUtils.SLIME:
                        break;

                }
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
                Game.instance()
                        .cameraController.camera());

        tiledMapRenderer.render();

        batch.setProjectionMatrix(
                Game.instance()
                        .cameraController.camera().combined);

        batch.begin();
        for (BaseObject object : objects)
        {
            object.render(batch);
        }
        batch.end();
    }

    public void dispose() {
        tiledMap.dispose();
    }
}
