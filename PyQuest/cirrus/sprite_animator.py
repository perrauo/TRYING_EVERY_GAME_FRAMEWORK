
from enum import Enum

import math

class State(Enum):
    Running = 1
    Paused = 2
    Completed = 3    

class SpriteAnimation:
    def __init__(self, frames, frame_rate=10, loop=True):
        self.loop = loop
        self.frames = frames
        self.frame_rate = frame_rate
        pass

class SpriteAnimator:
    def __init__(self, sprite):        
        self._sprite = sprite
        self.current_animation = None
        self.current_animation_id = None
        self.state = State.Paused
        self._animations = {}
        self._current_frame = 0
        self._elapsed_time = 0
        pass

    def Update(self, delta_time):
        if self.state != State.Running:
            return
        
        seconds_per_frame = 1 / (self.current_animation.frame_rate)
        iteration_duration = seconds_per_frame * len(self.current_animation.frames)

        self._elapsed_time += delta_time
        
        if not self.current_animation.loop and self._elapsed_time < iteration_duration:
            self.state = State.Completed
            self._elapsed_time = 0
            self._current_frame = 0            
            
        # Else we are looping
        self._current_frame = \
            math.floor(self._elapsed_time/seconds_per_frame) % \
            len(self.current_animation.frames)
        
        self._sprite.image = self.current_animation.frames[self._current_frame]
        

