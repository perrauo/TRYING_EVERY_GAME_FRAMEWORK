using Microsoft.Xna.Framework;
using Nez;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cirrus.Nez
{
    public static class Utils
    {

        public static Vector2 Vector(this Direction direction)
        {
            switch (direction)
            {
                case Direction.Up: return Vector2.UnitX;
                case Direction.Down: return -Vector2.UnitY;
                case Direction.Left: return -Vector2.UnitX;
                case Direction.Right: return Vector2.UnitX;
                default: return Vector2.UnitX;
            }
        }
    }
}
