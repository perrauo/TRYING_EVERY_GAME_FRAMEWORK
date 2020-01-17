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
    public class AvatarSpriteController :  SpriteController
    {
        public const string WalkForwardAnimation = "WalkForward";

        public const string WalkSideAnimation = "WalkSide";

        public const string WalkBackwardAnimation = "WalkBackward";

        public const string IdleForwardAnimation = "IdleForward";

        public const string IdleSideAnimation = "IdleSide";

        public const string IdleBackwardAnimation = "IdleBackward";

        public const string AttackForwardAnimation = "AttackForward";

        public const string AttackBackwardAnimation = "AttackBackward";

        public const string AttackSideAnimation = "AttackSide";

        public AvatarSpriteController(SpriteAnimator spriteAnimator) : base(spriteAnimator)
        {
            Texture2D texture = Core.Content.Load<Texture2D>("Objects/Characters/avatar_spritesheet");

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

            SpriteAnimator.AddAnimation(WalkBackwardAnimation, new[]
            {
                sprites[6],
                sprites[7],
                sprites[8]
            });

            SpriteAnimator.AddAnimation(IdleBackwardAnimation, new[]
            {
                sprites[7]
            });

            SpriteAnimator.AddAnimation(AttackForwardAnimation, new[]
{
                sprites[36],
                sprites[37],
                sprites[38],
                sprites[39],
                sprites[40]
            });

            SpriteAnimator.AddAnimation(AttackBackwardAnimation, new[] {
                sprites[7]
            });

            SpriteAnimator.AddAnimation(AttackSideAnimation, new[]
            {
                sprites[48],
                sprites[49],
                sprites[50],
                sprites[51],
                sprites[52]
            });
        }

        public override void Play(string animation, SpriteAnimator.LoopMode loopMode= SpriteAnimator.LoopMode.Loop)
        {
            if (SpriteAnimator.IsAnimationActive(animation))
                return;

            if (SpriteAnimator.IsAnimationActive(AttackForwardAnimation) ||
                SpriteAnimator.IsAnimationActive(AttackBackwardAnimation) ||
                SpriteAnimator.IsAnimationActive(AttackSideAnimation))
            {
                if (SpriteAnimator.IsRunning)
                    return;
            }

            base.Play(animation, loopMode);
        }
    }
}
