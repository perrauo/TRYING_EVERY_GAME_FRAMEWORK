package com.javaquest;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.OrthographicCamera;
import com.javaquest.objects.Object;

public class CameraController {

    private OrthographicCamera camera;
    private Object target;

    public OrthographicCamera getCamera() {
        return camera;
    }

    private static CameraController instance = null;

    public static CameraController getInstance() {
        return instance;
    }

    CameraController(OrthographicCamera camera) {
        instance = this;
        this.camera = camera;
        this.camera.setToOrtho(false, Gdx.graphics.getWidth(), Gdx.graphics.getHeight());
        this.camera.zoom = 0.25f;
        this.camera.update();
    }

    public OrthographicCamera camera() {
        return camera;
    }

    public void set(Object target) {
        this.target = target;
    }

    public void update(float deltaTime) {
        camera.position.set(target.getPosition(), 0);
        camera.update();
    }
}
