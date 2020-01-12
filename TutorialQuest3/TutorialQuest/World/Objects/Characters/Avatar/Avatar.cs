using Cirrus.Numeric;
using Microsoft.Xna.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Nez;
using Nez.Sprites;
using Microsoft.Xna.Framework.Graphics;
using Nez.Textures;

namespace Cirrus.TutorialQuest.World.Objects
{
    public class Avatar : Character
    {
        private AvatarController controller;

        private AvatarSpriteController spriteController;

        public override SpriteController SpriteController => spriteController;

        public override Physics.PhysicsLayer PhysicsLayer => Physics.PhysicsLayer.Avatar;

        public Avatar(Vector2 position, string name = "Avatar") : base(position, name)
        {
            controller = AddComponent(new AvatarController(this));

            spriteController =
                AddComponent(new AvatarSpriteController(
                AddComponent(new SpriteAnimator())));
        }

        public override void OnAddedToScene()
        {
            base.OnAddedToScene();

            spriteController.Play(AvatarSpriteController.IdleForwardAnimation);            
        }

        public override void Update()
        {
            base.Update();

            Velocity = Axes* Speed;

            MoveAndCollide(Velocity);

            if (Axes.X < 0)
            {
                Direction = Direction.Left;
                spriteController.Play(AvatarSpriteController.WalkLeftAnimation);
            }
            else if(Axes.X > 0)
            {
                Direction = Direction.Right;
                spriteController.Play(AvatarSpriteController.WalkRightAnimation);
            }
            else if(Axes.Y < 0)
            {
                Direction = Direction.Down;
                spriteController.Play(AvatarSpriteController.WalkBackwardAnimation);
            }
            else if(Axes.Y > 0)
            {
                Direction = Direction.Up;
                spriteController.Play(AvatarSpriteController.WalkForwardAnimation);
            }

            if(Axes.IsAprroximately(Vector2.Zero))
            {
                switch(Direction)
                {
                    case Direction.Left:
                        spriteController.Play(AvatarSpriteController.IdleLeftAnimation);
                        break;

                    case Direction.Right:
                        spriteController.Play(AvatarSpriteController.IdleRightAnimation);
                        break;

                    case Direction.Up:
                        spriteController.Play(AvatarSpriteController.IdleForwardAnimation);
                        break;

                    case Direction.Down:
                        spriteController.Play(AvatarSpriteController.IdleBackwardAnimation);
                        break;
                }
            }
        }
    }
}
