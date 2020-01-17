import pyglet

class BaseObject(pyglet.sprite.Sprite):
    def __init__(self, *args, **kwargs):
        super(BaseObject, self).__init__(*args, **kwargs)

        # Velocity
        self.velocity_x, self.velocity_y = 0.0, 0.0

    def update(self, dt):
        # Update position according to velocity and time
        self.x += self.velocity_x * dt
        self.y += self.velocity_y * dt


