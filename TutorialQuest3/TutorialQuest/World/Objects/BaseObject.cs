using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Cirrus.Numeric;
using Microsoft.Xna.Framework;
using Nez;

namespace Cirrus.TutorialQuest.World.Objects
{
    public abstract class BaseObject : Entity
    {
        public Direction Direction { get; set; }
            
        public abstract SpriteController SpriteController { get; }

        public BoxCollider BoxCollider { get; private set; }

        public abstract Physics.PhysicsLayer PhysicsLayer { get; }

        public Vector2 ColliderPosition = new Vector2(0, 0);

        public Vector2 ColliderSize = new Vector2(16, 4);

        public Vector2 Velocity { get; set; } = new Vector2(0, 0);

        public BaseObject(Vector2 position, string name = "") : base(name)
        {
            Position = position;

            BoxCollider = AddComponent(
                new BoxCollider(
                    ColliderPosition.X,
                    ColliderPosition.Y,
                    ColliderSize.X,
                    ColliderSize.Y));

            BoxCollider.PhysicsLayer = (int)PhysicsLayer;
        }

        public override void OnAddedToScene()
        {
            base.OnAddedToScene();

            BoxCollider.LocalOffset = new Vector2Int(0, SpriteController.SpriteSize.Y / 3);
        }
    
        public bool IsCollidable(Physics.PhysicsLayer layers)
        {
            return 
                (layers & Physics.PhysicsLayer.Level) != 0 ||
                (layers & Physics.PhysicsLayer.Object) != 0;
        }



        public void MoveAndCollide(Vector2 velocity)
        {
            if (
                BoxCollider.CollidesWithAny(ref velocity, out CollisionResult res) &&
                IsCollidable((Physics.PhysicsLayer)res.Collider.PhysicsLayer))
            { 
                Position += velocity;
            }
            else
            {
                Position += Velocity;
            }
        }

        public override void Update()
        {
            base.Update();

            SpriteController.SpriteAnimator.LayerDepth = 1 - (Position.Y / 1000);
        }

        public override void DebugRender(Batcher batcher)
        {
            base.DebugRender(batcher);
        }
    }
}
