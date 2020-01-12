using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cirrus.TutorialQuest.World
{
    public static class Physics
    {
        public enum PhysicsLayer : int
        {
            Level = 1 << 0,
            Object = 1 << 1, 
            Enemy = Object | 1 << 2,
            Avatar = Object | 1 << 3
        }
    }
}
