using Microsoft.Xna.Framework.Input;

namespace Cirrus
{
    public class Keyboard
    {
        static KeyboardState currentKeyState;
        public static KeyboardState PreviousKeyState;

        public static KeyboardState GetState()
        {
            PreviousKeyState = currentKeyState;
            currentKeyState = Microsoft.Xna.Framework.Input.Keyboard.GetState();
            return currentKeyState;
        }

        public static bool IsPressed(Keys key)
        {
            return currentKeyState.IsKeyDown(key);
        }

        public static bool HasBeenPressed(Keys key)
        {
            return currentKeyState.IsKeyDown(key) && !PreviousKeyState.IsKeyDown(key);
        }
    }
}