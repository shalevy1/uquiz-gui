
import eel
import setup
import serial
import serial.tools.list_ports

_DEBUG_PORT = "/dev/pts/9"
comport = None

def updateCOMPort(device):
    if device == _DEBUG_PORT:
        comport = _DEBUG_PORT

    for port in serial.tools.list_port.comports():
        if device == port.name:
            comport = port.device
            break

@eel.expose
def checkDevice(device):
    updateCOMPort(device)

    if comport == None:
        return 1

    r_ser = serial.Serial(comport);

    with serial.Serial(comport, 19200, timeout=2) as ser:
        pass

@eel.expose
def findSerialDevices():
    devices = []

    devices.append(_DEBUG_PORT)

    for port in serial.tools.list_ports.comports():
        devices.append(port.name)

    print(devices)
    return devices

setup.compile_files()

_eel_options = {
    'port': 1234
}

eel.init("web")
eel.start("index.html", size=(300, 200), options=_eel_options)
