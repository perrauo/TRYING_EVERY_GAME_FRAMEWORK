using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Cirrus.Nez;
using Nez;
using Nez.Sprites;
using Nez.Timers;

namespace Cirrus.TutorialQuest.World.Objects
{
    public enum AttackType
    {
        Bite,
        Slash
    }

    // TODO exercise make a projectile
    public class Attack : Entity
    {
        private AttackSpriteController spriteController;

        private BoxCollider collider;

        private AttackType type;

        private Direction direction;

        public Attack(AttackType type, Direction direction)
        {
            this.type = type;

            this.direction = direction;

            spriteController =
                AddComponent(new AttackSpriteController(
                AddComponent(new SpriteAnimator())));

            spriteController.SpriteAnimator.FlipX = direction == Direction.Right;

            collider = new BoxCollider();
        }

        public override void OnAddedToScene()
        {
            base.OnAddedToScene();

            switch (type)
            {
                case AttackType.Slash:
                    spriteController.Play(
                        direction == Direction.Left ||
                        direction == Direction.Right ?
                            AttackSpriteController.SlashSide :
                            AttackSpriteController.SlashForward, 
                        SpriteAnimator.LoopMode.Once);
                    break;

                case AttackType.Bite:
                    spriteController.Play(
                        direction == Direction.Left ||
                        direction == Direction.Right ?
                            AttackSpriteController.BiteSideAnimation :
                            AttackSpriteController.BiteForwardAnimation,
                        SpriteAnimator.LoopMode.Once);

                    break;
            }


            Core.Schedule(
                spriteController.SpriteAnimator.CurrentAnimation.Time(), 
                new Action<ITimer>(OnTimeout));
        }

        public void OnTimeout(ITimer timer)
        {
            Destroy();
        }
    }
}
