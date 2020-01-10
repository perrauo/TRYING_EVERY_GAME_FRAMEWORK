using Newtonsoft.Json;

using System;
using System.IO;

using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;

using MonoGame.Extended;
using MonoGame.Extended.ViewportAdapters;
using MonoGame.Extended.Tiled;
using System.Xml.Serialization;
using MonoGame.Extended.Tiled.Renderers;
using System.Collections.Generic;
using TutorialQuest.Objects;

namespace TutorialQuest.Levels
{
    [XmlRoot("Level")]
    public class Level
    {
        [XmlElement("TileMap")]
        public string TileMapFile { get; set; }

        private TiledMap tileMap;

        private TiledMapRenderer tileMapRenderer;

        private OrthographicCamera camera;

        private List<BaseObject> objects = new List<BaseObject>();

        private Game game;

        private Vector2 AvatarPosition = Vector2.One * 32; 

        private Avatar avatar;

        public void Initialize(Game game)
        {
            this.game = game;

            camera = new OrthographicCamera(game.GraphicsDevice);

            tileMapRenderer = new TiledMapRenderer(game.GraphicsDevice);

            avatar = new Avatar(AvatarPosition);
        }

        public void LoadContent()
        {
            tileMap = game.Content.Load<TiledMap>(TileMapFile);
            
            tileMapRenderer.LoadMap(tileMap);

            avatar.LoadContent(game.Content);
        }

        public void Update(GameTime gameTime)
        {
            tileMapRenderer.Update(gameTime);

            avatar.Update(gameTime);
        }

        public void Draw(GameTime gameTime)
        {
            tileMapRenderer.Draw(camera.GetViewMatrix());

            avatar.Draw(game.SpriteBatch);

            foreach (BaseObject obj in objects)
            {
                //obj.Draw(game.SpriteBatch)
            }
        }
    }
}
