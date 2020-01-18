package com.cirrus;

import com.badlogic.gdx.math.Vector2;

public class NumericUtils {

    public static boolean IsAprroximately(Vector2 pos1, Vector2 pos2, float tolerance) {
        return pos1.sub(pos2).len() <= tolerance;
    }
}
