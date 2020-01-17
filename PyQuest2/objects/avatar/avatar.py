
import enum
import pyglet

# import cirrus.bounding_box

from objects.base_object import BaseObject

class Avatar(BaseObject):
    def __init__(self, *args, **kwargs):
        super(BaseObject, self).__init__(pyglet.resource.image('avatar/avatar_spritesheet.png'), *args, **kwargs)
        
        self.animations = {}

        sprite_sheet = pyglet.resource.image('avatar/avatar_spritesheet.png')
        sprites = pyglet.image.ImageGrid(sprite_sheet, rows=8, columns=12)


        self.animations['WalkForward'] = pyglet.image.Animation.from_image_sequence(
            [
                sprites[0],
                sprites[1],
                sprites[2]
            ],
            10,
            True)
    
        self.animations['WalkSide'] = pyglet.image.Animation.from_image_sequence(
            [
                sprites[3],
                sprites[4],
                sprites[5]
            ], 
            10,
            True)

    def play(self, animation:str):
        # self.image = self.animations[animation]
        pass

