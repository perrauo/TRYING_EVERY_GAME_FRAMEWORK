using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.Xna.Framework;

namespace TutorialQuest
{
    public abstract class Character : BaseObject
    {
        public virtual float Speed => 1f;

        public Vector2 Axes;

        public Character(
            Vector2 position,
            string name = "") :
                base(
                    position,
                    name)
        {
            
        }
    }
}
