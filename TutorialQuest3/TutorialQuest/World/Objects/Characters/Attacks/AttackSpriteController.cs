using Cirrus.Numeric;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Nez;
using Nez.Sprites;
using Nez.Textures;
using Microsoft.Xna.Framework;


namespace TutorialQuest
{
    public class AttackSpriteController : SpriteController
    {
        public const string BiteForwardAnimation = "BiteForward";

        public const string BiteSideAnimation = "BiteSide";

        public const string SlashForward = "SlashForward";

        public const string SlashSide = "SlashSide";

        public AttackSpriteController(SpriteAnimator animator) : base(animator)
        {
            Texture2D texture = Core.Content.Load<Texture2D>("Objects/Characters/effect_spritesheet");

            List<Sprite> sprites = Sprite.SpritesFromAtlas(
                texture,
                SpriteSize.X,
                SpriteSize.Y);

            SpriteAnimator.AddAnimation(SlashForward, new[]
            {
                sprites[0],
                sprites[1],
                sprites[2],
                sprites[4]
            });

            SpriteAnimator.AddAnimation(SlashSide, new[]
            {
                sprites[12],
                sprites[13],
                sprites[14],
                sprites[15]
            });

            SpriteAnimator.AddAnimation(BiteForwardAnimation, new[]
            {
                sprites[24],
                sprites[25],
                sprites[26],
                sprites[27],
            });

            SpriteAnimator.AddAnimation(BiteForwardAnimation, new[]
            {
                sprites[36],
                sprites[37],
                sprites[38],
                sprites[39],
            });
        }

        public override void Play(string animation, SpriteAnimator.LoopMode loopMode = SpriteAnimator.LoopMode.Loop)
        {
            base.Play(animation, SpriteAnimator.LoopMode.Once);
        }
    }
}
