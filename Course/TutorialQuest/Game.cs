using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;

using MonoGame.Extended.Tiled;
using MonoGame.Extended.ViewportAdapters;


using Newtonsoft.Json;
using System.IO;
using System.Xml.Serialization;

using MonoGame.Extended;
using Cirrus.TutorialQuest.Levels;

namespace Cirrus.TutorialQuest
{
    /// <summary>
    /// This is the main type for your game.
    /// </summary>
    public class Game : Microsoft.Xna.Framework.Game
    {
        private GraphicsDeviceManager graphics;

        public ViewportAdapter ViewportAdapter { get; private set; }

        public SpriteBatch SpriteBatch { get; private set; }

        public Level CurrentLevel { get; private set; }

        public CameraController CameraController { get; private set; }

        public Game()
        {
            graphics = new GraphicsDeviceManager(this);

            Content.RootDirectory = "Content";
        }

        /// <summary>
        /// Allows the game to perform any initialization it needs to before starting to run.
        /// This is where it can query for any required services and load any non-graphic
        /// related content.  Calling base.Initialize will enumerate through any components
        /// and initialize them as well.
        /// </summary>
        protected override void Initialize()
        {
            ViewportAdapter = new BoxingViewportAdapter(Window, GraphicsDevice, 800, 480);

            CameraController = new CameraController(new OrthographicCamera(ViewportAdapter));

            CameraController.Initialize();

            XmlSerializer serializer = new XmlSerializer(typeof(Level));

            using (TextReader reader =
            new StringReader(
                File.ReadAllText(
                    Path.Combine(
                        Content.RootDirectory,
                        "Levels/Level1.xml"))))
            {
                CurrentLevel = (Level)serializer.Deserialize(reader);
                CurrentLevel.Initialize(this);
            }

            base.Initialize();
        }

        /// <summary>
        /// LoadContent will be called once per game and is the place to load
        /// all of your content.
        /// </summary>
        protected override void LoadContent()
        {
            base.LoadContent();
            
            // Create a new SpriteBatch, which can be used to draw textures.
            SpriteBatch = new SpriteBatch(GraphicsDevice);

            CurrentLevel.LoadContent();
        }

        /// <summary>
        /// UnloadContent will be called once per game and is the place to unload
        /// game-specific content.
        /// </summary>
        protected override void UnloadContent()
        {
            // TODO: Unload any non ContentManager content here
        }

        /// <summary>
        /// Allows the game to run logic such as updating the world,
        /// checking for collisions, gathering input, and playing audio.
        /// </summary>
        /// <param name="gameTime">Provides a snapshot of timing values.</param>
        protected override void Update(GameTime gameTime)
        {
            base.Update(gameTime);

            if (GamePad.GetState(PlayerIndex.One).Buttons.Back == ButtonState.Pressed || Keyboard.GetState().IsKeyDown(Keys.Escape))
                Exit();

            CameraController.Update(gameTime);

            CurrentLevel.Update(gameTime);
        }

        /// <summary>
        /// This is called when the game should draw itself.
        /// </summary>
        /// <param name="gameTime">Provides a snapshot of timing values.</param>
        protected override void Draw(GameTime gameTime)
        {
            base.Draw(gameTime);

            GraphicsDevice.Clear(Color.CornflowerBlue);

            SpriteBatch.Begin(
                transformMatrix:CameraController.Camera.GetViewMatrix(),
                sortMode: SpriteSortMode.BackToFront,
                samplerState: SamplerState.PointClamp,
                depthStencilState: DepthStencilState.Default,
                blendState: BlendState.AlphaBlend,
                rasterizerState: RasterizerState.CullNone);
            
            CurrentLevel.Draw(gameTime);           

            SpriteBatch.End();

        }
    }
}
