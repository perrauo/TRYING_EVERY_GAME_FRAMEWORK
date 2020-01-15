using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Cirrus.Nez;
using Cirrus.Numeric;
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

        public Attack(
            AttackType type,
            Direction direction,
            int range,
            Vector2Int size)
        {
            this.type = type;

            this.direction = direction;

            switch (direction)
            {
                case Direction.Left:
                case Direction.Right:
                    LocalPosition = new Vector2Int(range, 0) * (direction == Direction.Left ? -1 : 1);
                    break;

                case Direction.Up:
                case Direction.Down:
                    LocalPosition = new Vector2Int(0, range) * (direction == Direction.Up ? -1 : 1);
                    break;
            }

            collider = AddComponent(new BoxCollider(size.X, size.Y));

            collider.IsTrigger = true;

            spriteController =
                AddComponent(new AttackSpriteController(
                AddComponent(new SpriteAnimator())));

            spriteController.SpriteAnimator.FlipX = direction == Direction.Right;
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
                        SpriteAnimator.LoopMode.ClampForever);
                    break;

                case AttackType.Bite:
                    spriteController.Play(
                        direction == Direction.Left ||
                        direction == Direction.Right ?
                            AttackSpriteController.BiteSideAnimation :
                            AttackSpriteController.BiteForwardAnimation,
                        SpriteAnimator.LoopMode.ClampForever);

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
