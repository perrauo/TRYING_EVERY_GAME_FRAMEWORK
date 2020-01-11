using Cirrus.Numeric;
using Cirrus.TutorialQuest.Objects;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;
using MonoGame.Extended;
using MonoGame.Extended.Tiled;
using MonoGame.Extended.Tiled.Renderers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TutorialQuest.Levels
{
    public class TileMapController
    {
        private TiledMap tileMap;

        private TiledMapRenderer tileMapRenderer;

        private TiledMapLayer backgroundLayer;

        private TiledMapLayer foregroundLayer;

        private TiledMapObjectLayer objectsLayer;

        public const string AvatarObjectType = "Avatar";

        public const string SlimeObjectType = "Slime";

        private static readonly Vector2Int TiledObjectOffset = new Vector2Int(16, -4);

        public TileMapController(GraphicsDevice graphicsDevice)
        {
            tileMapRenderer = new TiledMapRenderer(graphicsDevice);
        }

        public void LoadContent(
            ContentManager content,
            string tileMapFile,
            out List<BaseObject> objects)
        {
            objects = new List<BaseObject>();

            tileMap = content.Load<TiledMap>(tileMapFile);

            tileMapRenderer.LoadMap(tileMap);

            backgroundLayer = tileMap.GetLayer("Background");

            foregroundLayer = tileMap.GetLayer("Foreground");

            objectsLayer = tileMap.GetLayer<TiledMapObjectLayer>("Objects");

            foreach (TiledMapObject obj in objectsLayer.Objects)
            {
                switch (obj.Type)
                {
                    case AvatarObjectType:
                        objects.Add(new Avatar(obj.Position + TiledObjectOffset));
                        break;

                    case SlimeObjectType:
                        objects.Add(new Slime(obj.Position + TiledObjectOffset));
                        break;
                }
            }
        }

        public void Update(GameTime time)
        {
            tileMapRenderer.Update(time);
        }

        public void Draw(OrthographicCamera camera)
        {
            tileMapRenderer.Draw(
                backgroundLayer,
                camera.GetViewMatrix(),
                depth:1);

            tileMapRenderer.Draw(
                foregroundLayer,
                camera.GetViewMatrix(),
                depth: 1);
        }
    }
}
