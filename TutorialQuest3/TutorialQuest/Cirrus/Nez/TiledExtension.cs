using Microsoft.Xna.Framework;
using Nez.Tiled;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cirrus.Nez
{
    public static class TiledExtension
    {
        public static Vector2 Position(this TmxObject obj)
        {
            return new Vector2(obj.X, obj.Y);
        }

        public static string FullName(this TmxObject obj)
        {
            return obj.Type + "/" + obj.Name;
        }
    }
}
