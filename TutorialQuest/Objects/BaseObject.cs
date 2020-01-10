using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TutorialQuest.Objects
{
    public abstract class BaseObject
    {
        public Vector2 Position { get; set; }

        public Vector2 Scale { get; set; }

        public float Rotation { get; set; }

        protected abstract BaseSpriteController SpriteController { get; }

        public BaseObject() : this(Vector2.Zero, Vector2.One) { }

        public BaseObject(Vector2 position) : this(position, Vector2.One) { }
        
        public BaseObject(
            Vector2 position,
            Vector2 scale, 
            float rotation = 0)
        {
            Position = position;
            Scale = scale;
            Rotation = rotation;
        }

        public virtual void Initialize()
        {
            SpriteController.Initialize();
        }    

        public virtual void LoadContent(ContentManager contentManager)
        {
            SpriteController.LoadContent(contentManager);
        }

        public virtual void Update(GameTime gameTime)
        {
            SpriteController.Update(gameTime);
        }

        public virtual void Draw(SpriteBatch spriteBatch)
        {
            SpriteController.Draw(spriteBatch, Position, Rotation, Scale);
        }
    }
}
