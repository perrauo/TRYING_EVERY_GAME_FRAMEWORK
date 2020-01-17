# PyGame template.
 
# Import standard modules.
import sys
import os.path 
import os

# Import non-standard modules.
import pygame
import pygame.sprite

import cirrus.color

import objects.avatar
 

class Game:
    def __init__(self):
        # Initialise PyGame.
        pygame.init()
        
        # Set up the clock. This will tick every frame and thus maintain a relatively constant framerate. Hopefully.
        self.fps = 60.0
        self.clock = pygame.time.Clock()
        self.sprites = pygame.sprite.LayeredUpdates()
        self.path = os.path.dirname(__file__)

        # Set up the window.
        self.width, self.height = 640, 480
        self.screen = pygame.display.set_mode((self.width, self.height))              
        self.avatar = objects.avatar.Avatar(self)

        delta_time = 1/self.fps
        while True:
            self.update(delta_time)
            self.draw()
            delta_time = self.clock.tick(self.fps)

    def update(self, delta_time):
        self.sprites.update(delta_time)
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                os._exit(0)                

    def draw(self):
        pygame.display.flip()
        self.screen.fill(cirrus.color.CORNFLOWER_BLUE)
        self.sprites.draw(self.screen)
 
game = None	

if __name__ == "__main__":
    game = Game()