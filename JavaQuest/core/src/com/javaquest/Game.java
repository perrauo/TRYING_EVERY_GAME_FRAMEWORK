package com.javaquest;

import com.badlogic.gdx.ApplicationAdapter;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Camera;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.OrthographicCamera;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.cirrus.ColorUtils;
import com.cirrus.GLUtils;

public class Game extends ApplicationAdapter {

    private SpriteBatch batch;
    private Texture img;

    private CameraController cameraController;
    private Level level;

    private static Game instance;
    public static Game getInstance() {
        return instance;
    }

    private boolean isDebugDrawingEnabled = false;
    public boolean isDebugDrawingEnabled() {
        return isDebugDrawingEnabled;
    }

    @Override
    public void create() {
    	instance = this;
        Gdx.graphics.setWindowedMode(GameUtils.WIDTH, GameUtils.HEIGHT);
        batch = new SpriteBatch();
        cameraController = new CameraController(new OrthographicCamera());
        level = new Level();
    }

    @Override
    public void render() {
        GLUtils.glClearColor(ColorUtils.CORNFLOWER_BLUE);
        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);

        if(InputUtils.IsDebugDrawingJustPressed())
            isDebugDrawingEnabled = !isDebugDrawingEnabled;

        cameraController.update(Gdx.graphics.getDeltaTime());
        level.update(Gdx.graphics.getDeltaTime());
        level.render(batch);
    }

    @Override
    public void dispose() {
        batch.dispose();
        img.dispose();
    }
}
