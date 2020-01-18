package com.javaquest;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.OrthographicCamera;
import com.javaquest.objects.BaseObject;

public class CameraController {

    private OrthographicCamera camera;
    private BaseObject target;

    CameraController(OrthographicCamera camera)
    {
        this.camera = camera;
        this.camera.setToOrtho(false, Gdx.graphics.getWidth(), Gdx.graphics.getHeight());
        this.camera.zoom = 0.5f;
        this.camera.update();
    }

    public OrthographicCamera camera()
    {
        return camera;
    }

    public void set(BaseObject target)
    {
        this.target = target;
    }

    public void update(float deltaTime) {
        camera.position.set(target.position(), 0);
        camera.update();
    }
}
