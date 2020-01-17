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

namespace TutorialQuest
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

        private BoxCollider hitBox;

        public AttackType Type { get; private set; }

        public Direction Direction { get; private set; }

        private List<Collider> hits = new List<Collider>();

        public float Strength { get; private set; }

        public Attack(
            AttackType type,
            Direction direction,
            float strength,
            int range,
            Vector2Int size,
            Physics.PhysicsLayer layers)
        {
            this.Type = type;

            this.Direction = direction;

            this.Strength = strength;

            switch (direction)
            {
                case Direction.Left:
                case Direction.Right:
                    LocalPosition = new Vector2Int(range, 0) * (direction == Direction.Left ? -1 : 1);
                    break;

                case Direction.Up:
                case Direction.Down:
                    LocalPosition = new Vector2Int(0, range) * (direction == Direction.Down ? -1 : 1);
                    break;
            }

            hitBox = AddComponent(new BoxCollider(size.X, size.Y));
            hitBox.CollidesWithLayers = (int) layers;
            hitBox.PhysicsLayer = (int)Physics.PhysicsLayer.None;

            spriteController =
                AddComponent(new AttackSpriteController(
                AddComponent(new SpriteAnimator())));

            spriteController.SpriteAnimator.FlipX = direction == Direction.Right;
        }

        public override void OnAddedToScene()
        {
            base.OnAddedToScene();

            switch (Type)
            {
                case AttackType.Slash:
                    spriteController.Play(
                        Direction == Direction.Left ||
                        Direction == Direction.Right ?
                            AttackSpriteController.SlashSide :
                            AttackSpriteController.SlashForward, 
                        SpriteAnimator.LoopMode.ClampForever);
                    break;

                case AttackType.Bite:
                    spriteController.Play(
                        Direction == Direction.Left ||
                        Direction == Direction.Right ?
                            AttackSpriteController.BiteSideAnimation :
                            AttackSpriteController.BiteForwardAnimation,
                        SpriteAnimator.LoopMode.ClampForever);

                    break;
            }

            Core.Schedule(
                spriteController.SpriteAnimator.CurrentAnimation.Time(), 
                OnTimeout);
        }

        public override void Update()
        {
            base.Update();

            if(hitBox.CollidesWithAny(out CollisionResult hit))
            {
                if (hits.Contains(hit.Collider))
                    return;

                hits.Add(hit.Collider);
                ((BaseObject)hit.Collider.Entity).OnAttack(this);
            }
        }

        public void OnTimeout(ITimer timer)
        {
            Destroy();
        }
    }
}
