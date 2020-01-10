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

namespace TutorialQuest.Objects
{
    public class AvatarSpriteController : BaseSpriteController
    {
        public AvatarSpriteController(
            int spriteWidth,
            int spriteHeight) :
                base(
                    spriteWidth,
                    spriteHeight)
        { }                  

        public override void LoadContent(ContentManager contentManager)
        {
            Texture2D texture = contentManager.Load<Texture2D>("Objects/Characters/avatar_walk");

            TextureAtlas characterAtlas = TextureAtlas.Create("Avatar", texture, spriteWidth, spriteHeight);

            SpriteSheetAnimationFactory animationFactory = new SpriteSheetAnimationFactory(characterAtlas);

            animationFactory.Add(
                "WalkForward", new SpriteSheetAnimationData(new[] { 0, 1, 2 }, isLooping: true));

            animationFactory.Add(
                "WalkLeft", new SpriteSheetAnimationData(new[] { 3, 4, 5 }, isLooping: true));

            animationFactory.Add(
                "WalkRight", new SpriteSheetAnimationData(new[] { 6, 7, 8 }, isLooping: true));

            animationFactory.Add(
                "WalkBackward", new SpriteSheetAnimationData(new[] { 9, 10, 11 }, isLooping: true));

            sprite = new AnimatedSprite(animationFactory);
        }
    }
}
