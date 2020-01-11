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
using Cirrus.TutorialQuest.Objects;
using TutorialQuest.Levels;

namespace Cirrus.TutorialQuest.Levels
{
    [XmlRoot("Level")]
    public class Level
    {
        [XmlElement("TileMap")]
        public string TileMapFile { get; set; }

        private OrthographicCamera camera;

        private List<BaseObject> objects = new List<BaseObject>();

        private Game game;

        private TileMapController tileMapController;

        public void Initialize(Game game)
        {
            this.game = game;

            tileMapController = new TileMapController(game.GraphicsDevice);       
        }

        public void LoadContent()
        {
            tileMapController.LoadContent(
                game.Content, 
                TileMapFile, 
                out objects
                );

            foreach (BaseObject obj in objects)
            {
                obj.LoadContent(game.Content);

                // TODO exercise event
                if (obj is Avatar)
                {
                    game.CameraController.SetTarget(obj);
                }
            }
        }

        public void Update(GameTime gameTime)
        {
            tileMapController.Update(gameTime);

            foreach (BaseObject obj in objects)
            {
                obj.Update(gameTime);
            }
        }

        public void Draw(GameTime gameTime)
        {
            tileMapController.Draw(game.CameraController.Camera);

            foreach (BaseObject obj in objects)
            {
                obj.Draw(game.SpriteBatch);
            }
        }
    }
}
