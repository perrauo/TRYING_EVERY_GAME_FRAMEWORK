
import pygame

import external.spritesheet as sprsht
import external.pyganim as pyganim

class Avatar:
    def __init__(self):      
        spritesheet = sprsht.SpriteSheet(\
            'avatar/resources/avatar_spritesheet.png')
        
        animatedsprite = pyganim.PygAnimation(\
            spritesheet.load_strip(pygame.Rect(0, 0, 32, 32), \
                12))       
        pass