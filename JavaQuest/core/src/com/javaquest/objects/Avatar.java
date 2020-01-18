package com.javaquest.objects;

import com.badlogic.gdx.ApplicationAdapter;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
//import com.badlogic.gdx.graphics.sp

public class Avatar extends BaseObject{

    AvatarSpriteController spriteController;

    public Avatar(){
        super();

        spriteController = new AvatarSpriteController(this);
    }

    @Override
    public void update(float deltaTime)
    {
        spriteController.update(deltaTime);
    }

    @Override
    public void render(SpriteBatch batch) {
        spriteController.render(batch);
    }
}
