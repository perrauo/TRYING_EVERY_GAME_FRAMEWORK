"""
Sprite Collect Coins

Simple program to show basic sprite usage.

Artwork from http://kenney.nl

If Python and Arcade are installed, this example can be run from the command line with:
python -m arcade.examples.sprite_collect_coins
"""

import random
import arcade
import os

# --- Constants ---
SPRITE_SCALING_PLAYER = 0.5
SPRITE_SCALING_COIN = .25
COIN_COUNT = 50

SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
SCREEN_TITLE = "Sprite Collect Coins Example"


import arcade
import pyglet.graphics

from objects.avatar.avatar import Avatar

class Game(arcade.Window):

    def __init__(self):
        """ Initializer """
        # Call the parent class initializer
        super().__init__(SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_TITLE)
        pyglet.resource.path = ['./resources']
        pyglet.resource.reindex()

    def setup(self):
        arcade.set_background_color(arcade.color.CORNFLOWER_BLUE)  
        self.view : arcade.View = arcade.View()        

        self.sprite_batch = pyglet.graphics.Batch()
        self.avatar = Avatar(x=400, y=300, batch=self.sprite_batch)
        self.avatar.play("WalkForward")

    def on_draw(self):
        """ Draw everything """
        arcade.start_render()
        self.sprite_batch.draw()

    def on_mouse_motion(self, x, y, dx, dy):
        """ Handle Mouse Motion """
        pass

    def on_update(self, delta_time):
        """ Movement and game logic """
        pass


def main():
    """ Main method """
    window = Game()
    window.setup()
    arcade.run()


if __name__ == "__main__":
    main()