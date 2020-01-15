
import pygame
from external import spritesheet

from avatar import avatar

if __name__ == '__main__':
    pygame.init()

    window = pygame.display.set_mode((512, 256))

    avatar.Avatar()
    
    
    

