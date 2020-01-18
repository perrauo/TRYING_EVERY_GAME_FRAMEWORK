# PyGame template.
 
# Import standard modules.
import sys
import os.path 
import os

import pygame
import pygame.sprite
import cirrus.color
import objects.avatar
import level
import camera
 
WIDTH = 640
HEIGHT = 480
PATH = os.path.dirname(__file__)

class Game:
    # Set up the window.   

    def __init__(self):
        # Initialise PyGame.
        pygame.init()
        
        # Set up the clock. This will tick every frame and thus maintain a relatively constant framerate. Hopefully.
        self.fps = 60.0
        self.clock = pygame.time.Clock()
        self.sprites = pygame.sprite.LayeredUpdates()
        self.screen = pygame.display.set_mode((WIDTH, HEIGHT))
               
        self.avatar = objects.avatar.Avatar(self)
        self.level = level.Level(os.path.join(PATH, './resources/levels/tilemap1.tmx'))
        self.camera = camera.Camera(self.level.get_width(), self.level.get_height())

        delta_time = 1/self.fps
        while True:
            self.update(delta_time)
            self.draw()
            delta_time = self.clock.tick(self.fps)

    def update(self, delta_time):
        self.sprites.update(delta_time)
        self.camera.update(self.avatar)
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                os._exit(0)                

    def draw(self):
        pygame.display.flip()
        self.screen.fill(cirrus.color.CORNFLOWER_BLUE)
        self.level.draw(self.screen)
        self.sprites.draw(self.screen)
        
 
game = None	

if __name__ == "__main__":
    game = Game()