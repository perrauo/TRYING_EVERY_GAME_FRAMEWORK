import pyglet, random, math

from objects.avatar.avatar import Avatar

# Set up a window
game_window = pyglet.window.Window(800, 600)
main_batch = pyglet.graphics.Batch()

counter = pyglet.window.FPSDisplay(window=game_window)


level_objects = []

# We need to pop off as many event stack frames as we pushed on
# every time we reset the level.
event_stack_size = 0


def init():

    pyglet.resource.path = ['./resources']
    pyglet.resource.reindex()    

    avatar = Avatar(x=400, y=300, batch=main_batch)
    avatar.play("WalkSide")

    # Add any specified event handlers to the event handler stack
    for obj in level_objects:
        for handler in obj.event_handlers:
            game_window.push_handlers(handler)
            event_stack_size += 1

@game_window.event
def on_draw():
    game_window.clear()
    main_batch.draw()
    counter.draw()

def update(dt):    
    for obj in level_objects:
        obj.update(dt)

if __name__ == "__main__":
    # Start it up!
    init()

    # Update the game 120 times per second
    pyglet.clock.schedule_interval(update, 1 / 120.0)

    # Tell pyglet to do its thing
    pyglet.app.run()
