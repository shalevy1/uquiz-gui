import eel

_eel_options = {
    'port': 1234
}

eel.init("web")
eel.start("index.html", size=(300, 200), options=_eel_options)
