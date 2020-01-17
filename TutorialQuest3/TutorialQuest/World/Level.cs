using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Cirrus.Numeric;

using Microsoft.Xna.Framework;
using Nez;
using Nez.Tiled;
using Cirrus.Nez;

namespace TutorialQuest
{
    public class Level : Entity
    {
        private TiledMapRenderer tileMapRenderer;

        private TmxMap tileMap;

        public static Level Instance { get; private set; } 

        private static readonly Vector2Int TiledObjectOffset = new Vector2Int(16, -4);

        public const string AvatarObjectType = "Avatar";

        public const string SlimeObjectType = "Slime";

        public Level(string name="") : base(name)
        {
            Instance = this;
        }

        public override void OnAddedToScene()
        {
            base.OnAddedToScene();

            tileMap = Core.Content.LoadTiledMap(System.IO.Path.Combine(
                Core.Content.RootDirectory,
                "Levels/TileMap1.tmx"));

            tileMapRenderer = AddComponent(new TiledMapRenderer(tileMap));

            tileMapRenderer.SetLayersToRender(new string[] { "Foreground", "Background" });

            tileMapRenderer.PhysicsLayer = (int) Physics.PhysicsLayer.Collidable;

            tileMapRenderer.CollisionLayer = tileMap.GetLayer<TmxLayer>("Collision");

            tileMapRenderer.AddColliders();

            tileMapRenderer.LayerDepth = 1;

            TmxObjectGroup objectsLayer =  tileMap.GetObjectGroup("Objects");

            objectsLayer.Visible = false;

            foreach (TmxObject obj in objectsLayer.Objects)
            {
                switch (obj.Type)
                {
                    case AvatarObjectType:
                        Avatar avatar = Scene.AddEntity(new Avatar(obj.Position() + TiledObjectOffset));
                        Scene.Camera.AddComponent(new FollowCamera(avatar, FollowCamera.CameraStyle.LockOn));
                        break;

                    case SlimeObjectType:
                        Slime slime = Scene.AddEntity(
                            new Slime(
                            obj.Position() + TiledObjectOffset,
                            obj.FullName()));

                        break;
                }
            }
        }

        public override void DebugRender(Batcher batcher)
        {
            base.DebugRender(batcher);

            //batcher.DrawString("Hello World", Color.White);
        }

    }
}
