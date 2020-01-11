using Microsoft.Xna.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cirrus.TutorialQuest.Objects
{
    public abstract class Character : BaseObject
    {
        public virtual float Speed { get; set; } = 1f;

        public Character(Vector2 position) : this(position, Vector2.One) { }

        public Character(
            Vector2 position,
            Vector2 scale,
            float rotation = 0) :
                base(
                    position,
                    scale,
                    rotation)
        {

        }
    }
}
