
import pygame
import pygame.sprite

import cirrus.animation
import cirrus.sprite

import os.path 

class Avatar(pygame.sprite.Sprite):
    def __init__(self, game): 
        self.game = game
        self.groups = game.sprites
        self.position = (40, game.height - 100)

        super().__init__(self.groups)

        spritesheet = cirrus.sprite.SpriteSheet(
            os.path.join(game.path, './resources/avatar/avatar_spritesheet.png'))

        frames = spritesheet.load_strip(pygame.Rect(0, 0, 32, 32), 12)  

        self.animations = {}
        self.animations["WalkFront"] = cirrus.animation.SpriteAnimation([frames[0], frames[1], frames[2]], 10, True)
        self.animations["WalkSide"] = cirrus.animation.SpriteAnimation([frames[3], frames[4], frames[5]], 10, True)
        
        self.animator = cirrus.animation.SpriteAnimator(self)
        self.play("WalkFront")
        self.rect = self.image.get_rect()
        self.rect.center = (40, game.height - 100)


    def update(self, delta_time):
        self.animator.update(delta_time)
        self.rect.midbottom = self.position
        pass

    def play(self, anim):
        self.animator.play(self.animations[anim])
