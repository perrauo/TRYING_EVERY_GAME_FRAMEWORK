package com.cirrus;

import com.badlogic.gdx.math.Rectangle;
import com.badlogic.gdx.math.Vector;
import com.badlogic.gdx.math.Vector2;

public class RectangleUtils {

    public static Vector2 bottomLeft(Rectangle rect)
    {
        return new Vector2(rect.x, rect.y);
    }

    public static Vector2 bottomRight(Rectangle rect)
    {
        return new Vector2(rect.x + rect.width, rect.y);
    }

    public static Vector2 topLeft(Rectangle rect)
    {
        return new Vector2(rect.x, rect.y+rect.height);
    }

    public static Vector2 topRight(Rectangle rect)
    {
        return new Vector2(rect.x+rect.width, rect.y+rect.height);
    }

    public static int left(Rectangle rect)
    {
        return (int)rect.x;
    }

    public static int right(Rectangle rect)
    {
        return (int)rect.x + (int)rect.width;
    }

    public static int top(Rectangle rect)
    {
        return (int)rect.y + (int)rect.height;
    }

    public static int bottom(Rectangle rect)
    {
        return (int)rect.y;
    }

}
