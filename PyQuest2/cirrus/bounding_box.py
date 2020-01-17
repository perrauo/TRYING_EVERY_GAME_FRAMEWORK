

def check_collision(x1, y1, w1, h1, x2, y2, w2, h2):
    """Returns true if two boxes overlap, false if they dont"""
    """x2,y2,w2 & h2 are the same, but for the second box."""
    return x1 < x2+w2 and/
    x2 < x1+w1 and/
    y1 < y2+h2 and/
    y2 < y1+h1
