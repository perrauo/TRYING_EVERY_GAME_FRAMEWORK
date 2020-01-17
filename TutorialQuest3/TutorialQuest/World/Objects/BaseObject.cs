using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Cirrus.Nez;
using Cirrus.Numeric;
using Microsoft.Xna.Framework;
using Nez;

namespace TutorialQuest
{
    public abstract class BaseObject : Entity
    {
        public Direction Direction { get; set; }
            
        public abstract SpriteController SpriteController { get; }

        // Collider

        public Vector2 ColliderPosition = new Vector2(0, 0);

        public Vector2 ColliderSize = new Vector2(16, 4);

        public BoxCollider Collider { get; private set; }

        // HurtBox

        public Vector2Int HurtBoxPosition = new Vector2Int(0, 0);

        public Vector2Int HurtBoxSize = new Vector2Int(16, 16);

        public BoxCollider HurtBoxCollider { get; private set; }

        public abstract Physics.PhysicsLayer PhysicsLayer { get; }

        public Vector2 KnockbackVelocity = new Vector2(0, 0);

        public float KnockbackVelocityDecelerationAmount = 0.4f;

        public Vector2 MoveVelocity = new Vector2(0, 0);

        public Vector2 Velocity => KnockbackVelocity + MoveVelocity;

        public BaseObject(Vector2 position, string name = "") : base(name)
        {
            Position = position;

            Collider = AddComponent(
                new BoxCollider(
                    ColliderPosition.X,
                    ColliderPosition.Y,
                    ColliderSize.X,
                    ColliderSize.Y));

            Collider.CollidesWithLayers = (int)Physics.PhysicsLayer.Collidable;
            Collider.PhysicsLayer = (int)Physics.PhysicsLayer.Collidable;

            HurtBoxCollider = AddComponent(
            new BoxCollider(
                HurtBoxPosition.X,
                HurtBoxPosition.Y,
                HurtBoxSize.X,
                HurtBoxSize.Y));     
            HurtBoxCollider.PhysicsLayer = (int)PhysicsLayer;
        }

        public override void OnAddedToScene()
        {
            base.OnAddedToScene();

            HurtBoxCollider.LocalOffset = Vector2Int.Zero;
            Collider.LocalOffset = new Vector2Int(0, SpriteController.SpriteSize.Y / 3);
        }

        public virtual void OnAttack(Attack attack)
        {
            KnockbackVelocity += attack.Direction.Vector() * attack.Strength;
            SpriteController.Blink();
        }

        public void MoveAndCollide(Vector2 velocity)
        {
            Collider.CollidesWithAny(ref velocity, out CollisionResult res);
            Position += velocity;           
        }

        public override void Update()
        {
            base.Update();

            KnockbackVelocity = Vector2.Lerp(
                KnockbackVelocity, 
                Vector2.Zero, 
                KnockbackVelocityDecelerationAmount);

            SpriteController.SpriteAnimator.LayerDepth = 1 - (Position.Y / 1000);
        }
    }
}
