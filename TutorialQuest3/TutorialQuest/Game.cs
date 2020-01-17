using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;

using Nez;

namespace TutorialQuest
{
    /// <summary>
    /// This is the main type for your game.
    /// </summary>
    public class Game : Core
    {
        public const int DesignWidth = 512;

        public const int DesignHeight = 256;

        public Game() : base() { }

        /// <summary>
        /// Allows the game to perform any initialization it needs to before starting to run.
        /// This is where it can query for any required services and load any non-graphic
        /// related content.  Calling base.Initialize will enumerate through any components
        /// and initialize them as well.
        /// </summary>
        protected override void Initialize()
        {
            base.Initialize();

            Scene = Scene.CreateWithDefaultRenderer(Color.CornflowerBlue);

            Scene.SetDesignResolution(DesignWidth, DesignHeight, Scene.SceneResolutionPolicy.ShowAllPixelPerfect);

            Screen.SetSize(DesignWidth * 3, DesignHeight * 3);

            //Scene.AddEntity(new Level("Level1"));

            Scene.AddEntity(new HUD());
        }

        protected override void Update(GameTime time)
        {
            base.Update(time);

            if (Input.IsKeyPressed(Keys.F1))
            {
                DebugRenderEnabled = !DebugRenderEnabled;
            }
        }
    }
}
