using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Cirrus.Numeric;
using Microsoft.Xna.Framework;
using Nez;
using Nez.Sprites;

namespace TutorialQuest
{
    public abstract class SpriteController : Component
    {       
        public SpriteAnimator SpriteAnimator { get; private set; }

        public virtual Vector2Int SpriteSize { get; } = new Vector2Int(32, 32);

        public virtual float BlinkTime { get; } = 0.1f;

        public SpriteController(SpriteAnimator animator)
        {
            SpriteAnimator = animator;          
        }

        public virtual void Play(string animation, SpriteAnimator.LoopMode loopMode = SpriteAnimator.LoopMode.Loop)
        {
            SpriteAnimator.Play(animation, loopMode);
        }

        public virtual void Blink()
        {
            SpriteAnimator.Enabled = false;
            Core.Schedule(BlinkTime, OnBlinkTimeout);
        }

        public void OnBlinkTimeout(ITimer timer)
        {
            SpriteAnimator.Enabled = true;
        }
    }
}
