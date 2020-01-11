using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;
using MonoGame.Extended.Animations;
using MonoGame.Extended.Animations.SpriteSheets;
using MonoGame.Extended.TextureAtlases;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cirrus.TutorialQuest.Objects
{
    public class SlimeSpriteController : BaseSpriteController
    {
        public SlimeSpriteController(
            int spriteWidth,
            int spriteHeight,
            Numeric.Vector2Int origin) :
                base(
                    spriteWidth,
                    spriteHeight,
                    origin)
        { }

        public string WalkForwardAnimation = "WalkForward";

        public string WalkLeftAnimation = "WalkLeft";

        public string WalkRightAnimation = "WalkRight";

        public string WalkBackwardAnimation = "WalkBackward";

        public string IdleForwardAnimation = "IdleForward";

        public string IdleLeftAnimation = "IdleLeft";

        public string IdleRightAnimation = "IdleRight";

        public string IdleBackwardAnimation = "IdleBackward";

        public override void LoadContent(ContentManager contentManager)
        {
            Texture2D texture = contentManager.Load<Texture2D>("Objects/Characters/Monsters/monster_spritesheet");

            TextureAtlas characterAtlas = TextureAtlas.Create("Slime", texture, spriteWidth, spriteHeight);

            SpriteSheetAnimationFactory animationFactory = new SpriteSheetAnimationFactory(characterAtlas);

            animationFactory.Add(
                WalkForwardAnimation,
                new SpriteSheetAnimationData(new[] { 0, 1, 2 },
                isLooping: true));

            animationFactory.Add(
                IdleForwardAnimation,
                new SpriteSheetAnimationData(new[] { 1 },
                isLooping: true));

            animationFactory.Add(
                WalkLeftAnimation,
                new SpriteSheetAnimationData(new[] { 3, 4, 5 },
                isLooping: true));

            animationFactory.Add(
                IdleLeftAnimation,
                new SpriteSheetAnimationData(new[] { 4 },
                isLooping: true));

            animationFactory.Add(
                WalkRightAnimation,
                new SpriteSheetAnimationData(new[] { 6, 7, 8 },
                isLooping: true));

            animationFactory.Add(
                IdleRightAnimation,
                new SpriteSheetAnimationData(new[] { 7 },
                isLooping: true));

            animationFactory.Add(
                WalkBackwardAnimation,
                new SpriteSheetAnimationData(new[]
                { 9, 10, 11 },
                isLooping: true));

            animationFactory.Add(
                IdleBackwardAnimation,
                new SpriteSheetAnimationData(new[] { 10 },
                isLooping: true));

            sprite = new AnimatedSprite(animationFactory);
        }
    }
}
