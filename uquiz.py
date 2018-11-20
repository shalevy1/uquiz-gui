import eel
import setup
import serial
import serial.tools.list_ports

@eel.expose
def findSerialDevices():
    devices = []

    for port in serial.tools.list_ports.comports():
        devices.append(port.name);

    print(devices)
    return devices

setup.compile_files()

_eel_options = {
    'port': 1234
}

eel.init("web")
eel.start("index.html", size=(300, 200), options=_eel_options)
