using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Cirrus.Sprites
{
    public interface ISpriteAnimation
    {
        int ID { get; }

        Sprite[] Sprites { get; }

        float FrameRate { get; }
    }

    [SerializeField]
    public class SpriteAnimation : ISpriteAnimation
    {
        [SerializeField]
        private string _name;

        public int ID => _name.GetHashCode();

        [SerializeField]
        private Sprite[] _sprites;

        public Sprite[] Sprites => _sprites;

        [SerializeField]
        float _frameRate = 10;

        public float FrameRate => _frameRate;
    }

    /// <summary>
    /// SpriteAnimator handles the display and animation of a sprite
    /// </summary>
    public class SpriteAnimator : MonoBehaviour
    {
        [SerializeField]
        public enum LoopMode
        {
            /// <summary>
            /// Play the sequence in a loop forever [A][B][C][A][B][C][A][B][C]...
            /// </summary>
            Loop,

            /// <summary>
            /// Play the sequence once [A][B][C] then pause and set time to 0 [A]
            /// </summary>
            Once,

            /// <summary>
            /// Plays back the animation once, [A][B][C]. When it reaches the end, it will keep playing the last frame and never stop playing
            /// </summary>
            ClampForever,

            /// <summary>
            /// Play the sequence in a ping pong loop forever [A][B][C][B][A][B][C][B]...
            /// </summary>
            PingPong,

            /// <summary>
            /// Play the sequence once forward then back to the start [A][B][C][B][A] then pause and set time to 0
            /// </summary>
            PingPongOnce
        }

        
        public enum State
        {
            None,
            Running,
            Paused,
            Completed
        }

        /// <summary>
        /// fired when an animation completes, includes the animation name;
        /// </summary>
        public event Action<int> OnAnimationCompletedEvent;

        /// <summary>
        /// animation playback speed
        /// </summary>
        public float Speed = 1;

        /// <summary>
        /// the current state of the animation
        /// </summary>
        public State AnimationState { get; private set; } = State.None;

        /// <summary>
        /// the current animation
        /// </summary>
        public ISpriteAnimation CurrentAnimation { get; private set; }

        /// <summary>
        /// the name of the current animation
        /// </summary>
        public int CurrentAnimationId { get; private set; }

        /// <summary>
        /// index of the current frame in sprite array of the current animation
        /// </summary>
        public int CurrentFrame { get; private set; }

        /// <summary>
        /// checks to see if the CurrentAnimation is running
        /// </summary>
        public bool IsRunning => AnimationState == State.Running;

        [SerializeField]
        private SpriteAnimation[] _animations;

        readonly Dictionary<int, ISpriteAnimation> _dictionary = new Dictionary<int, ISpriteAnimation>();

        float _elapsedTime;
        LoopMode _loopMode;

        [SerializeField]
        private SpriteRenderer _spriteRenderer;

        public void Awake()
        {
            foreach (var anim in _animations)
            {
                _dictionary.Add(anim.ID, anim);
            }
        }

        public void Update()
        {
            if (AnimationState != State.Running || CurrentAnimation == null)
                return;

            var animation = CurrentAnimation;
            var secondsPerFrame = 1 / (animation.FrameRate * Speed);
            var iterationDuration = secondsPerFrame * animation.Sprites.Length;
            var pingPongIterationDuration = animation.Sprites.Length < 3 ? iterationDuration : secondsPerFrame * (animation.Sprites.Length * 2 - 2);

            _elapsedTime += Time.deltaTime;
            var time = Math.Abs(_elapsedTime);

            // Once and PingPongOnce reset back to Time = 0 once they complete
            if (_loopMode == LoopMode.Once && time > iterationDuration ||
                _loopMode == LoopMode.PingPongOnce && time > pingPongIterationDuration)
            {
                AnimationState = State.Completed;
                _elapsedTime = 0;
                CurrentFrame = 0;
                _spriteRenderer.sprite = animation.Sprites[0];
                OnAnimationCompletedEvent?.Invoke(CurrentAnimationId);
                return;
            }

            if (_loopMode == LoopMode.ClampForever && time > iterationDuration)
            {
                AnimationState = State.Completed;
                CurrentFrame = animation.Sprites.Length - 1;
                _spriteRenderer.sprite = animation.Sprites[CurrentFrame];
                OnAnimationCompletedEvent?.Invoke(CurrentAnimationId);
                return;
            }

            // figure out which frame we are on
            int i = Mathf.FloorToInt(time / secondsPerFrame);
            int n = animation.Sprites.Length;
            if (n > 2 && (_loopMode == LoopMode.PingPong || _loopMode == LoopMode.PingPongOnce))
            {
                // create a pingpong frame
                int maxIndex = n - 1;
                CurrentFrame = maxIndex - Math.Abs(maxIndex - i % (maxIndex * 2));
            }
            else
                // create a looping frame
                CurrentFrame = i % n;

            _spriteRenderer.sprite = animation.Sprites[CurrentFrame];
        }



        /// <summary>
        /// plays the animation with the given name. If no loopMode is specified it is defaults to Loop
        /// </summary>
        public void Play(int id, LoopMode? loopMode = null)
        {
            CurrentAnimation = _dictionary[id];
            CurrentAnimationId = id;
            CurrentFrame = 0;
            AnimationState = State.Running;

            _spriteRenderer.sprite = CurrentAnimation.Sprites[0];
            _elapsedTime = 0;
            _loopMode = loopMode ?? LoopMode.Loop;
        }

        /// <summary>
        /// checks to see if the animation is playing (i.e. the animation is active. it may still be in the paused state)
        /// </summary>
        public bool IsAnimationActive(string name) => CurrentAnimation != null && CurrentAnimationId.Equals(name);

        /// <summary>
        /// pauses the animator
        /// </summary>
        public void Pause() => AnimationState = State.Paused;

        /// <summary>
        /// unpauses the animator
        /// </summary>
        public void UnPause() => AnimationState = State.Running;

        /// <summary>
        /// stops the current animation and nulls it out
        /// </summary>
        public void Stop()
        {
            CurrentAnimation = null;
            CurrentAnimationId = -1;
            CurrentFrame = 0;
            AnimationState = State.None;
        }

        /// <summary>
        /// Adds a SpriteAnimation
        /// </summary>
        public void AddAnimation(int id, ISpriteAnimation animation)
        {
            // if we have no sprite use the first frame we find
            if(!_dictionary.TryGetValue(id, out ISpriteAnimation anim))
                _dictionary.Add(id, animation);
        }
    }
}