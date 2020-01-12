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

namespace Cirrus.TutorialQuest.World.Objects
{
    public class SlimeSpriteController : SpriteController
    {
        public const string WalkForwardAnimation = "WalkForward";

        public const string WalkSideAnimation = "WalkSide";

        public const string WalkBackwardAnimation = "WalkBackward";

        public const string IdleForwardAnimation = "IdleForward";

        public const string IdleSideAnimation = "IdleSide";

        public const string IdleBackwardAnimation = "IdleBackward";

        public SlimeSpriteController(SpriteAnimator spriteAnimator) : base(spriteAnimator)
        {
            Texture2D texture = Core.Content.Load<Texture2D>("Objects/Characters/Monsters/monster_spritesheet");

            List<Sprite> sprites = Sprite.SpritesFromAtlas(
                texture,
                SpriteSize.X,
                SpriteSize.Y);

            SpriteAnimator.AddAnimation(WalkForwardAnimation, new[]
            {
                sprites[0],
                sprites[1],
                sprites[2],
            });

            SpriteAnimator.AddAnimation(IdleForwardAnimation, new[]
            {
                sprites[1]
            });

            SpriteAnimator.AddAnimation(WalkSideAnimation, new[]
            {
                sprites[3],
                sprites[4],
                sprites[5]
            });

            SpriteAnimator.AddAnimation(IdleSideAnimation, new[]
            {
                sprites[4]
            });

            //SpriteAnimator.AddAnimation(WalkRightAnimation, new[]
            //{
            //    sprites[6],
            //    sprites[7],
            //    sprites[8]
            //});

            //SpriteAnimator.AddAnimation(IdleRightAnimation, new[]
            //{
            //    sprites[7],
            //});

            SpriteAnimator.AddAnimation(WalkBackwardAnimation, new[]
            {
                sprites[9],
                sprites[10],
                sprites[11]
            });

            SpriteAnimator.AddAnimation(IdleBackwardAnimation, new[]
            {
                sprites[10]
            });
        }

        public void Play(string animation, SpriteAnimator.LoopMode loopMode = SpriteAnimator.LoopMode.Loop)
        {
            if (SpriteAnimator.IsAnimationActive(animation))
                return;

            SpriteAnimator.Play(animation, loopMode);
        }
    }
}
