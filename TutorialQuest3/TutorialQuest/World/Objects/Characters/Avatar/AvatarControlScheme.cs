using Microsoft.Xna.Framework.Input;
using Nez;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cirrus.TutorialQuest.World.Objects
{
    class AvatarControlScheme
    {
        public bool IsLeftHeld => Keyboard.GetState().IsKeyDown(Keys.Left) || Keyboard.GetState().IsKeyDown(Keys.A);

        public bool IsRightHeld => Keyboard.GetState().IsKeyDown(Keys.Right) || Keyboard.GetState().IsKeyDown(Keys.D);

        public bool IsUpHeld => Keyboard.GetState().IsKeyDown(Keys.Up) || Keyboard.GetState().IsKeyDown(Keys.W);

        public bool IsDownHeld => Keyboard.GetState().IsKeyDown(Keys.Down) || Keyboard.GetState().IsKeyDown(Keys.S);

        public bool IsAttackPresssed => Input.IsKeyPressed(Keys.Space);
    }
}
