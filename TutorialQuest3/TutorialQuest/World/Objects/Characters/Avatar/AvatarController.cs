using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Input;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Nez;

namespace Cirrus.TutorialQuest.World.Objects
{
    public class AvatarController : Component, IUpdatable
    {
        private Avatar avatar;

        private AvatarControlScheme scheme;

        public AvatarController(Avatar avatar)
        {
            this.avatar = avatar;

            scheme = new AvatarControlScheme();
        }

        public void Update()
        {   
            // Right
            if (!scheme.IsLeftHeld && scheme.IsRightHeld)
            {
                avatar.Axes.X = 1; 
            }
            // Left
            else if (scheme.IsLeftHeld && !scheme.IsRightHeld)
            {
                avatar.Axes.X = -1;
            }
            // Left Right
            else
            {
                avatar.Axes.X = 0;
            }

            // Up
            if (!scheme.IsDownHeld && scheme.IsUpHeld)
            {
                avatar.Axes.Y = -1;
            }
            // Down
            else if (scheme.IsDownHeld && !scheme.IsUpHeld)
            {
                avatar.Axes.Y = 1;
            }
            // Up Down
            else
            {
                avatar.Axes.Y = 0;
            }

        }

    }
}
