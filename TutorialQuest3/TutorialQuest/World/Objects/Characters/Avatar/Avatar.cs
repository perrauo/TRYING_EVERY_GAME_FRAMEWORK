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

        public override Physics.PhysicsLayer PhysicsLayer => Physics.PhysicsLayer.Avatar | Physics.PhysicsLayer.Object;

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
                SpriteController.SpriteAnimator.FlipX = false;
                spriteController.Play(AvatarSpriteController.WalkSideAnimation);
            }
            else if(Axes.X > 0)
            {
                SpriteController.SpriteAnimator.FlipX = true;
                Direction = Direction.Right;
                spriteController.Play(AvatarSpriteController.WalkSideAnimation);
            }
            else if(Axes.Y < 0)
            {
                SpriteController.SpriteAnimator.FlipX = false;
                Direction = Direction.Down;
                spriteController.Play(AvatarSpriteController.WalkBackwardAnimation);
            }
            else if(Axes.Y > 0)
            {
                SpriteController.SpriteAnimator.FlipX = false;
                Direction = Direction.Up;
                spriteController.Play(AvatarSpriteController.WalkForwardAnimation);
            }

            if(Axes.IsAprroximately(Vector2.Zero))
            {
                Axes = Vector2.Zero;

                switch (Direction)
                {
                    case Direction.Left:
                    case Direction.Right:
                        spriteController.Play(AvatarSpriteController.IdleSideAnimation);
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

        public void Attack()
        {
            Attack attack = Scene.AddEntity(new Attack(AttackType.Slash, Direction));
            attack.SetParent(Transform);

            switch (Direction)
            {
                case Direction.Left:
                case Direction.Right:
                    spriteController.Play(AvatarSpriteController.AttackSideAnimation, SpriteAnimator.LoopMode.Once);
                    break;

                case Direction.Up:
                case Direction.Down:
                    spriteController.Play(AvatarSpriteController.AttackForwardAnimation, SpriteAnimator.LoopMode.Once);
                    break;
            }
        }
    }
}
