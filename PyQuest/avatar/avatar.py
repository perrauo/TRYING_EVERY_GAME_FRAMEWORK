

import cirrus

class Avatar:
    def __init__(self):      
        spritesheet = sprsht.SpriteSheet(\
            'avatar/resources/avatar_spritesheet.png')
        
        animatedsprite = cirrus.An(\
            spritesheet.load_strip(pygame.Rect(0, 0, 32, 32), \
                12))       
        pass