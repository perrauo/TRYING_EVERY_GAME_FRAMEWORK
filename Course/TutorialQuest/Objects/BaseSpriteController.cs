using Cirrus.Numeric;

using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;
using MonoGame.Extended;
using MonoGame.Extended.Animations;
using MonoGame.Extended.Sprites;
using MonoGame.Extended.TextureAtlases;


namespace Cirrus.TutorialQuest.Objects
{
    // Exercise: Extend sprite controller
    public class BaseSpriteController
    {
        protected int spriteWidth;

        protected int spriteHeight;

        protected Vector2Int origin;

        protected AnimatedSprite sprite;

        public BaseSpriteController(
            int spriteWidth, 
            int spriteHeight, 
            Vector2Int origin)
        {
            this.spriteWidth = spriteWidth;

            this.spriteHeight = spriteHeight;

            this.origin = origin;           
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
            sprite.Origin = origin;

            //spriteBatch.DrawCircle(position, 2, 32, Color.White);//, ShieldHealth);

            sprite.Depth = 1 - (position.Y / 1000);

            spriteBatch.Draw(
                sprite, 
                position: position, 
                rotation: rotation, 
                scale: scale);
        }
    }
}
