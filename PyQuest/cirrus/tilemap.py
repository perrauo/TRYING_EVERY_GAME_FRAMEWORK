import pygame
import pytmx.pytmx
import pytmx.util_pygame


class Renderer(object):
    def __init__(self, tilemap):
        self.tilemap = tilemap
        self.size = tilemap.width * tilemap.tilewidth, tilemap.height * tilemap.tileheight
        
    def render(self, surface):
        tw = self.tilemap.tilewidth
        th = self.tilemap.tileheight
        gt = self.tilemap.get_tile_image_by_gid

        if self.tilemap.background_color:
            surface.fill(self.tilemap.background_color)

        for layer in self.tilemap.visible_layers:
            if isinstance(layer, pytmx.TiledTileLayer):
                for x, y, gid in layer:
                    tile = gt(gid)
                    if tile:
                        surface.blit(tile, (x * tw, y * th))

            elif isinstance(layer, pytmx.TiledObjectGroup):
                pass

            elif isinstance(layer, pytmx.TiledImageLayer):
                image = gt(layer.gid)
                if image:
                    surface.blit(image, (0, 0))

    def make_map(self):
        temp_surface = pygame.Surface(self.size)
        self.render(temp_surface)
        return temp_surface