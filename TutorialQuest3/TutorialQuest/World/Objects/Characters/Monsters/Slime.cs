using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xna.Framework;
using Nez.Sprites;

using Nez;
using Nez.Sprites;
using Cirrus.Numeric;

namespace Cirrus.TutorialQuest.World.Objects
{
    public class Slime : Character
    {
        public override float Speed => 0.4f;

        private SlimeSpriteController spriteController;

        public override SpriteController SpriteController => spriteController;

        private SlimeController controller;

        public override Physics.PhysicsLayer PhysicsLayer => Physics.PhysicsLayer.Enemy;

        public Slime(
            Vector2 position, 
            string name = "") : 
                base(position, name)
        {
            spriteController =
                AddComponent(new SlimeSpriteController(
                AddComponent(new SpriteAnimator())));

            controller = AddComponent(new SlimeController(this));
        }

        public override void OnAddedToScene()
        {
            base.OnAddedToScene();

            spriteController.Play(AvatarSpriteController.IdleForwardAnimation);

            controller.Avatar =
                Scene.Entities.EntitiesOfType<Avatar>().FirstOrDefault() != null ?
                (Avatar) Scene.Entities.EntitiesOfType<Avatar>().FirstOrDefault() :
                null;
        }

        public override void Update()
        {
            base.Update();

            Velocity = Axes * Speed;

            MoveAndCollide(Velocity);

            if (Axes.X < 0)
            {
                Direction = Direction.Left;
                spriteController.Play(AvatarSpriteController.WalkLeftAnimation);
            }
            else if (Axes.X > 0)
            {
                Direction = Direction.Right;
                spriteController.Play(AvatarSpriteController.WalkRightAnimation);
            }
            else if (Axes.Y < 0)
            {
                Direction = Direction.Down;
                spriteController.Play(AvatarSpriteController.WalkBackwardAnimation);
            }
            else if (Axes.Y > 0)
            {
                Direction = Direction.Up;
                spriteController.Play(AvatarSpriteController.WalkForwardAnimation);
            }

            if (Axes.IsAprroximately(Vector2.Zero))
            {
                switch (Direction)
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
