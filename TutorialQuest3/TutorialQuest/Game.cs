using Cirrus.TutorialQuest.World;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;

using Nez;

namespace Cirrus.TutorialQuest
{
    /// <summary>
    /// This is the main type for your game.
    /// </summary>
    public class Game : Core
    {
        public Game() : base() { }

        /// <summary>
        /// Allows the game to perform any initialization it needs to before starting to run.
        /// This is where it can query for any required services and load any non-graphic
        /// related content.  Calling base.Initialize will enumerate through any components
        /// and initialize them as well.
        /// </summary>
        protected override void Initialize()
        {
            // TODO: Add your initialization logic here

            base.Initialize();

            Scene = Scene.CreateWithDefaultRenderer(Color.CornflowerBlue);

            Scene.SetDesignResolution(512, 256, Scene.SceneResolutionPolicy.ShowAllPixelPerfect);

            Screen.SetSize(512 * 3, 256 * 3);

            Scene.AddEntity(new Level("Level1"));
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
