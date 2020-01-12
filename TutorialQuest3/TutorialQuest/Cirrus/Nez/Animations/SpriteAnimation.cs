using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Cirrus.Numeric;
using Microsoft.Xna.Framework;
using Nez;
using Nez.Sprites;


namespace Cirrus.Nez
{
    public static class SpriteAnimationtExtension
    {
        public static float Time(this SpriteAnimation anim)
        {
            /*
             * 
                numFrames/? X framerate 
             */

            return anim.Sprites.Length / anim.FrameRate;
        }
    }
}
