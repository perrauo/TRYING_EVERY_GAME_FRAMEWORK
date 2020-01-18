package com.javaquest.objects;

import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.math.Vector2;
import com.cirrus.Utils;
import com.javaquest.InputUtils;
//import com.badlogic.gdx.graphics.sp

public class Avatar extends BaseObject {

    AvatarSpriteController spriteController;
    private Vector2 axes = new Vector2();
    private Vector2 velocity = new Vector2();
    private Utils.Direction direction;

    public Avatar() {
        super();
        spriteController = new AvatarSpriteController(this);
    }

    @Override
    public void update(float deltaTime) {

        if (InputUtils.IsLeftPressed() && !InputUtils.IsRightPressed())
            axes.x = -1;
        else if (!InputUtils.IsLeftPressed() && InputUtils.IsRightPressed())
            axes.x = 1;
        else axes.x = 0;

        if (InputUtils.IsUpPressed() && !InputUtils.IsDownPressed())
            axes.y = 1;
        else if (!InputUtils.IsUpPressed() && InputUtils.IsDownPressed())
            axes.y = -1;
        else axes.y = 0;

        velocity = axes.scl(speed);
        position = position.add(velocity);

        if (axes.x < 0) {
            direction = Utils.Direction.LEFT;
            spriteController.flipped = false;
            spriteController.play(AvatarSpriteController.WALK_SIDE_ANIM, true);
        } else if (axes.x > 0) {
            direction = Utils.Direction.RIGHT;
            spriteController.flipped = true;
            spriteController.play(AvatarSpriteController.WALK_SIDE_ANIM, true);
        } else if (axes.y < 0) {
            direction = Utils.Direction.DOWN;
            spriteController.flipped = false;
            spriteController.play(AvatarSpriteController.WALK_FORWARD_ANIM, true);
        } else if (axes.y > 0) {
            direction = Utils.Direction.UP;
            spriteController.flipped = false;
            spriteController.play(AvatarSpriteController.WALK_BACK_ANIM, true);
        }

        spriteController.update(deltaTime);
    }


    @Override
    public void render(SpriteBatch batch) {
        spriteController.render(batch);
    }
}
