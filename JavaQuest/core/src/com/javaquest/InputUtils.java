package com.javaquest;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Input;

public class InputUtils {

    public static boolean IsUpPressed() {
      return Gdx.input.isKeyPressed(Input.Keys.W) || Gdx.input.isKeyPressed(Input.Keys.UP);
    }

    public static boolean IsDownPressed() {
        return Gdx.input.isKeyPressed(Input.Keys.S) || Gdx.input.isKeyPressed(Input.Keys.DOWN);
    }

    public static boolean IsLeftPressed() {
        return Gdx.input.isKeyPressed(Input.Keys.A) || Gdx.input.isKeyPressed(Input.Keys.LEFT);
    }

    public static boolean IsRightPressed() {
        return Gdx.input.isKeyPressed(Input.Keys.D) || Gdx.input.isKeyPressed(Input.Keys.RIGHT);
    }

    public static boolean IsDebugDrawingJustPressed() {
        return Gdx.input.isKeyJustPressed(Input.Keys.F1);
    }

}
