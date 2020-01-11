using Cirrus.Numeric;
using Microsoft.Xna.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cirrus.TutorialQuest.Objects
{
    class Slime : BaseObject
    {
        protected override BaseSpriteController SpriteController => spriteController;

        private SlimeSpriteController spriteController;

        public Slime(Vector2 position) : this(position, Vector2.One) { }

        private const int spriteWidth = 32;

        private const int spriteHeight = 32;

        public Slime(
            Vector2 position,
            Vector2 scale,
            float rotation = 0) :
                base(
                    position,
                    scale,
                    rotation)
        {
            spriteController = new SlimeSpriteController(
                spriteWidth,
                spriteHeight,
                new Vector2Int(spriteWidth / 2, spriteHeight-4));
        }
    }
}
