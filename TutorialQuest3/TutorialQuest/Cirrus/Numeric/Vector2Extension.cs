using Microsoft.Xna.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cirrus.Numeric
{
    public static class Vector2Extension
    {    
        public static bool IsAprroximately(this Vector2 pos1, Vector2 pos2, float tolerance = 0.1f)
        { 
            return (pos2 - pos1).Length() <= tolerance;
        }

        public static Vector2 Normalized(this Vector2 v)
        {
            return Vector2.Normalize(v);
        }
    }
}
