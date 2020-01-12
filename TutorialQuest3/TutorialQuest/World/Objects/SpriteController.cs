using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Cirrus.Numeric;
using Microsoft.Xna.Framework;
using Nez;
using Nez.Sprites;

namespace Cirrus.TutorialQuest.World.Objects
{
    public abstract class SpriteController : Component
    {       
        public SpriteAnimator SpriteAnimator { get; private set; }

        public virtual Vector2Int SpriteSize { get; } = new Vector2Int(32, 32); 

        public SpriteController(SpriteAnimator animator)
        {
            SpriteAnimator = animator;          
        }
    }
}
