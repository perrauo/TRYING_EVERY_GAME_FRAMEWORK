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

namespace TutorialQuest
{
    public class Slime : Character
    {
        public override float Speed => 0.4f;

        private SlimeSpriteController spriteController;

        public override SpriteController SpriteController => spriteController;

        private SlimeController controller;

        public override Physics.PhysicsLayer PhysicsLayer => Physics.PhysicsLayer.Enemy | Physics.PhysicsLayer.Object;

        public Slime(
            Vector2 position, 
            string name) : 
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

            spriteController.Play(SlimeSpriteController.IdleForwardAnimation);

            controller.Avatar = Scene.Entities.EntitiesOfType<Avatar>().FirstOrDefault();
        }

        public override void Update()
        {
            base.Update();

            MoveVelocity = Axes * Speed;

            MoveAndCollide(Velocity);

            if (Axes.X < 0)
            {
                Direction = Direction.Left;
                spriteController.Play(SlimeSpriteController.WalkSideAnimation);
            }
            else if (Axes.X > 0)
            {
                Direction = Direction.Right;
                spriteController.Play(SlimeSpriteController.WalkSideAnimation);
            }
            else if (Axes.Y < 0)
            {
                Direction = Direction.Down;
                spriteController.Play(SlimeSpriteController.WalkBackwardAnimation);
            }
            else if (Axes.Y > 0)
            {
                Direction = Direction.Up;
                spriteController.Play(SlimeSpriteController.WalkForwardAnimation);
            }

            if (Axes.IsAprroximately(Vector2.Zero))
            {
                switch (Direction)
                {
                    case Direction.Left:
                    case Direction.Right:
                        spriteController.Play(SlimeSpriteController.IdleSideAnimation);
                        break;

                    case Direction.Up:
                        spriteController.Play(SlimeSpriteController.IdleForwardAnimation);
                        break;

                    case Direction.Down:
                        spriteController.Play(SlimeSpriteController.IdleBackwardAnimation);
                        break;
                }
            }
        }
    }
}
