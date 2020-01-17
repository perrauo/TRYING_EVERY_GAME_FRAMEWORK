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
using Nez.UI;
using Microsoft.Xna.Framework.Graphics;
using Nez.Textures;

namespace TutorialQuest
{
    public class HealthBar : Group
    {
        private Image healthBarBackground;

        private Image healthBar;

        public HealthBar()
        {
            //Texture2D texture = Core.Content.Load<Texture2D>("UI/Health/health_hud_spritesheet");

            //List<Sprite> sprites = Sprite.SpritesFromAtlas(
            //    texture,
            //    16,
            //    64);

            //healthBarBackground = AddElement(
            //    new Image(sprites[0]));

            //healthBar = AddElement(
            //    new Image(sprites[1]));
        }
    }

    public class HUD : Entity
    {
        private UICanvas canvas;

        public HUD()
        {
            canvas = AddComponent(new UICanvas());
            canvas.IsFullScreen = true;
            canvas.RenderLayer = (int)Utils.RenderLayer.UI;

            canvas.Stage.AddElement(new HealthBar());
        }

        public override void Update()
        {
            base.Update();

            Debug.DrawText(
                 Graphics.Instance.BitmapFont,
                 "Hello World",
                 Screen.Center,
                 Color.White);
        }

        //public override void DebugRender(Batcher batcher)
        //{
        //    base.DebugRender(batcher);

        //    Debug.DrawText(
        //        Graphics.Instance.BitmapFont,
        //        "Hello World",
        //        Screen.Center,
        //        Color.White);   
        //}
    }
}
