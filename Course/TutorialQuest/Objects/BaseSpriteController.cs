using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;
using MonoGame.Extended.Animations;
using MonoGame.Extended.Animations.SpriteSheets;
using MonoGame.Extended.Sprites;
using MonoGame.Extended.TextureAtlases;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cirrus.TutorialQuest.Objects
{
    // Exercise: Extend sprite controller
    public class BaseSpriteController
    {
        protected int spriteWidth;

        protected int spriteHeight;

        protected AnimatedSprite sprite;

        public BaseSpriteController(int spriteWidth, int spriteHeight)
        {
            this.spriteWidth = spriteWidth;

            this.spriteHeight = spriteHeight;
        }

        public virtual void Initialize()
        {

        }

        public virtual void LoadContent(ContentManager contentManager)
        {

        }

        public void Play(string animation)
        {
            sprite.Play(animation);
        }

        public void Update(GameTime time)
        {
            sprite.Update(time);           
        }

        public void Draw(
            SpriteBatch spriteBatch,
            Vector2 position, 
            float rotation,
            Vector2 scale
            )
        {
            sprite.Depth = 1f;

            spriteBatch.Draw(
                sprite:sprite, 
                position:position, 
                rotation:rotation, 
                scale:scale
                );
        }
    }
}
