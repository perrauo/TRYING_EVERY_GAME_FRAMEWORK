using Cirrus.Numeric;
using Microsoft.Xna.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cirrus.TutorialQuest.Objects
{
    public class Avatar : Character
    {
        private AvatarController controller;

        private AvatarSpriteController spriteController;

        protected override BaseSpriteController SpriteController => spriteController;

        private const int spriteWidth = 32;

        private const int spriteHeight = 32;

        public Vector2 Axes;

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
                spriteHeight,
                new Vector2Int(spriteWidth/2, spriteHeight));

            controller = new AvatarController(this);
        }

        public override void Update(GameTime gameTime)
        {
            base.Update(gameTime);

            controller.Update(gameTime);

            Position += Axes * Speed;

            if (Axes.X < 0)
            {
                Direction = Vector2Int.Left;
                spriteController.Play(spriteController.WalkLeftAnimation);
            }
            else if(Axes.X > 0)
            {
                Direction = Vector2Int.Right;
                spriteController.Play(spriteController.WalkRightAnimation);
            }
            else if(Axes.Y < 0)
            {
                Direction = Vector2Int.Down;
                spriteController.Play(spriteController.WalkBackwardAnimation);
            }
            else if(Axes.Y > 0)
            {
                Direction = Vector2Int.Up;
                spriteController.Play(spriteController.WalkForwardAnimation);
            }

            if(Axes.IsAprroximately(Vector2.Zero))
            {
                if (Direction == Vector2Int.Left)
                {
                    spriteController.Play(spriteController.IdleLeftAnimation);
                }
                else if (Direction == Vector2Int.Right)
                {
                    spriteController.Play(spriteController.IdleRightAnimation);
                }
                else if (Direction == Vector2Int.Up)
                {
                    spriteController.Play(spriteController.IdleForwardAnimation);
                }
                else if (Direction == Vector2Int.Down)
                {
                    spriteController.Play(spriteController.IdleBackwardAnimation);
                }
            }
        }
    }
}
