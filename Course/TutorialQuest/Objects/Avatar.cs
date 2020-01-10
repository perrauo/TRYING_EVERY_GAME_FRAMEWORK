using Microsoft.Xna.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TutorialQuest.Objects
{
    public class Avatar : BaseObject
    {
        private AvatarSpriteController spriteController;

        protected override BaseSpriteController SpriteController => spriteController;

        private const int spriteWidth = 32;

        private const int spriteHeight = 32;

        public Avatar() : this(Vector2.Zero, Vector2.One) { }

        public Avatar(Vector2 position) : this(position, Vector2.One) { }

        public Avatar(
            Vector2 position,
            Vector2 scale,
            float rotation=0) : 
                base(
                    position, 
                    scale, 
                    rotation)
        {
            spriteController = new AvatarSpriteController(
                spriteWidth, 
                spriteHeight);
        }
    }
}
