import sys
import asyncio
from bleak import BleakClient
import subprocess
import re

x = subprocess.check_output("bluetoothctl devices".split())
m = re.search(r'Device ((?:[0-9A-F]{2}:){5}[0-9A-F]{2}) Bangle', x.decode())

if m:
    address = m.group(1)
else:
    x = subprocess.check_output("bluetoothctl --timeout 4 scan on".split())
    m = re.search(r'Device ((?:[0-9A-F]{2}:){5}[0-9A-F]{2}) Bangle', x.decode())
    address = m.group(1)


BANGLE_ADDRESS = address

# Standard Nordic UART UUIDs used by Bangle.js
UART_TX_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e" # Pi receives on this
UART_RX_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e" # Pi sends on this

def handle_command(command_str):
    """Interpret the short commands received from the Bangle."""
    cmd = command_str.strip().lower()
    
    if cmd == "go":
        print("🚀 Action: STARTING process!")
    elif cmd == "stop":
        print("🛑 Action: STOPPING process!")
    elif cmd == "reset":
        print("🔄 Action: RESETTING system!")
    elif cmd == "continue":
        print("🔄 Action: Continue")
    elif cmd == "quit":
        sys.exit(0)
    else:
        print(f"❓ Received unknown command: {cmd}")

def notification_handler(sender, data):
    """Callback triggered whenever the Bangle sends data."""
    try:
        # Decode the byte data into a string
        message = data.decode('utf-8')
        handle_command(message)
    except Exception as e:
        print(f"Error decoding data: {e}")

async def main():
    print(f"Connecting to Bangle at {BANGLE_ADDRESS}...")
    try:
        async with BleakClient(BANGLE_ADDRESS) as client:
            print("✅ Connected! Listening for commands (Press Ctrl+C to exit)...")
            
            # Start listening to the Bangle's TX characteristic
            await client.start_notify(UART_TX_UUID, notification_handler)
            
            # Keep the script running
            while True:
                await asyncio.sleep(1)
                
    except Exception as e:
        print(f"Connection failed or lost: {e}")

if __name__ == "__main__":
    asyncio.run(main())

