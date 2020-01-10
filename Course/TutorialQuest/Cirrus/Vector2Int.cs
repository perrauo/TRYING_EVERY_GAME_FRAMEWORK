
using System;
using System.Globalization;
using System.Runtime.InteropServices;

using Microsoft.Xna.Framework;


namespace Cirrus.Numeric
{
    public struct Vector2Int : IEquatable<Vector2Int>, IFormattable
    {
        public int X { get { return x; } set { x = value; } }
        public int Y { get { return y; } set { y = value; } }

        private int x;
        private int y;

        public Vector2Int(int x, int y)
        {
            this.x = x;
            this.y = y;
        }

        // Set x and y components of an existing Vector.
        public void Set(int x, int y)
        {
            this.x = x;
            this.y = y;
        }

        // Returns the length of this vector (RO).
        public double magnitude { get { return Math.Sqrt((double)(X * X + Y * Y)); } }

        // Returns the squared length of this vector (RO).
        public int sqrMagnitude { get { return X * X + Y * Y; } }

        // Returns the distance between /a/ and /b/.
        public static float Distance(Vector2Int a, Vector2Int b)
        {
            float diff_x = a.X - b.X;
            float diff_y = a.Y - b.Y;

            return (float)Math.Sqrt(diff_x * diff_x + diff_y * diff_y);
        }

        // Returns a vector that is made from the smallest components of two vectors.
        public static Vector2Int Min(Vector2Int lhs, Vector2Int rhs) { return new Vector2Int(Math.Min(lhs.X, rhs.X), Math.Min(lhs.Y, rhs.Y)); }

        // Returns a vector that is made from the largest components of two vectors.
        public static Vector2Int Max(Vector2Int lhs, Vector2Int rhs) { return new Vector2Int(Math.Max(lhs.X, rhs.X), Math.Max(lhs.Y, rhs.Y)); }

        // Multiplies two vectors component-wise.
        public static Vector2Int Scale(Vector2Int a, Vector2Int b) { return new Vector2Int(a.X * b.X, a.Y * b.Y); }

        // Multiplies every component of this vector by the same component of /scale/.
        public void Scale(Vector2Int scale) { X *= scale.X; Y *= scale.Y; }

        public void Clamp(Vector2Int min, Vector2Int max)
        {
            X = Math.Max(min.X, X);
            X = Math.Min(max.X, X);
            Y = Math.Max(min.Y, Y);
            Y = Math.Min(max.Y, Y);
        }

        // Converts a Vector2Int to a [[Vector2]].
        public static implicit operator Vector2(Vector2Int v)
        {
            return new Vector2(v.X, v.Y);
        }


        public static Vector2Int operator -(Vector2Int v)
        {
            return new Vector2Int(-v.X, -v.Y);
        }

        public static Vector2Int operator +(Vector2Int a, Vector2Int b)
        {
            return new Vector2Int(a.X + b.X, a.Y + b.Y);
        }

        public static Vector2Int operator -(Vector2Int a, Vector2Int b)
        {
            return new Vector2Int(a.X - b.X, a.Y - b.Y);
        }

        public static Vector2Int operator *(Vector2Int a, Vector2Int b)
        {
            return new Vector2Int(a.X * b.X, a.Y * b.Y);
        }

        public static Vector2Int operator *(int a, Vector2Int b)
        {
            return new Vector2Int(a * b.X, a * b.Y);
        }

        public static Vector2Int operator *(Vector2Int a, int b)
        {
            return new Vector2Int(a.X * b, a.Y * b);
        }

        public static Vector2Int operator /(Vector2Int a, int b)
        {
            return new Vector2Int(a.X / b, a.Y / b);
        }

        public static bool operator ==(Vector2Int lhs, Vector2Int rhs)
        {
            return lhs.X == rhs.X && lhs.Y == rhs.Y;
        }

        public static bool operator !=(Vector2Int lhs, Vector2Int rhs)
        {
            return !(lhs == rhs);
        }

        public override bool Equals(object other)
        {
            if (!(other is Vector2Int)) return false;

            return Equals((Vector2Int)other);
        }

        public bool Equals(Vector2Int other)
        {
            return X.Equals(other.X) && Y.Equals(other.Y);
        }

        public override int GetHashCode()
        {
            return X.GetHashCode() ^ (Y.GetHashCode() << 2);
        }

        /// *listonly*
        public override string ToString()
        {
            return ToString(null, CultureInfo.InvariantCulture.NumberFormat);
        }

        public string ToString(string format)
        {
            return ToString(format, CultureInfo.InvariantCulture.NumberFormat);
        }

        public string ToString(string format, IFormatProvider formatProvider)
        {
            return string.Format("{{X:{0} Y:{1}}}", this.x, this.y);
        }

        public static Vector2Int Zero { get { return s_Zero; } }
        public static Vector2Int One { get { return s_One; } }
        public static Vector2Int Up { get { return s_Up; } }
        public static Vector2Int Down { get { return s_Down; } }
        public static Vector2Int Left { get { return s_Left; } }
        public static Vector2Int Right { get { return s_Right; } }

        private static readonly Vector2Int s_Zero = new Vector2Int(0, 0);
        private static readonly Vector2Int s_One = new Vector2Int(1, 1);
        private static readonly Vector2Int s_Up = new Vector2Int(0, 1);
        private static readonly Vector2Int s_Down = new Vector2Int(0, -1);
        private static readonly Vector2Int s_Left = new Vector2Int(-1, 0);
        private static readonly Vector2Int s_Right = new Vector2Int(1, 0);
    }
}
