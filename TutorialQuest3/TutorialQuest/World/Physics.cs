using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TutorialQuest
{
    public static class Physics
    {
        public enum PhysicsLayer : int
        {
            None = 0,
            Collidable = 1 << 0,
            Object = 1 << 1, 
            Enemy =  1 << 2,
            Avatar = 1 << 3
        }

        public static bool IsCollidable(Physics.PhysicsLayer layers)
        {
            return
                (layers & Physics.PhysicsLayer.Collidable) != 0 ||
                (layers & Physics.PhysicsLayer.Object) != 0;
        }
    }
}
