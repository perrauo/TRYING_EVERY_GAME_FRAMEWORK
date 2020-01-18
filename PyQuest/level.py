import pygame
import pytmx
import pytmx.util_pygame

import cirrus.tilemap

class Level:
    def __init__(self, file):
        self.tilemap:pytmx.TiledMap = pytmx.util_pygame.load_pygame(file)
        self.tilemap_renderer = cirrus.tilemap.Renderer(self.tilemap)
        self.tilemap_surface = self.tilemap_renderer.make_map()
        self.tilemap_rect = self.tilemap_surface.get_rect()

    def get_width(self):
        return self.tilemap.width * self.tilemap.tilewidth

    def get_height(self):
        return self.tilemap.height * self.tilemap.tileheight

    def draw(self, screen):
        screen.blit(self.tilemap_surface, (0, 0))


