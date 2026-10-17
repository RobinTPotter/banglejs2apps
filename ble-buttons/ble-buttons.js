
// Define UI colors (Bangle.js 2 theme)
const COLOR_BG = "#000000";
const COLOR_TEXT = "#FFFFFF";
const COLOR_BORDER = "#444444";

// Calculate screen dimensions dynamically
const W = g.getWidth();
const H = g.getHeight();

// Grid layout calculations (2 columns x 2 rows)
const midX = W / 2;
const midY = H / 2;

// Button helper definitions
const buttons = [
  { label: "START",    x1: 2,        y1: 2,        x2: midX - 2, y2: midY - 2, cmd: "go" },
  { label: "STOP",     x1: midX + 2, y1: 2,        x2: W - 2,    y2: midY - 2, cmd: "stop" },
  { label: "CONT.",    x1: 2,        y1: midY + 2, x2: midX - 2, y2: H - 2,    cmd: "continue" },
  { label: "RESET",    x1: midX + 2, y1: midY + 2, x2: W - 2,    y2: H - 2,    cmd: "reset" }
];

// Function to draw the 4 buttons on screen
function drawUI() {
  g.setTheme({bg:COLOR_BG, fg:COLOR_TEXT});
  g.clear();
  
  buttons.forEach(b => {
    // Draw button background boundary box
    g.setColor(COLOR_BORDER);
    g.drawRect(b.x1, b.y1, b.x2, b.y2);
    g.drawRect(b.x1+1, b.y1+1, b.x2-1, b.y2-1);
    
    // Draw centered text label
    g.setColor(COLOR_TEXT);
    g.setFont("Vector", 18);
    g.setFontAlign(0, 0); // Center, Center alignment
    g.drawString(b.label, (b.x1 + b.x2) / 2, (b.y1 + b.y2) / 2);
  });
}

// Flash button helper for visual touch feedback
function flashButton(b) {
  g.setColor("#00FF00"); // Flash green on success
  g.drawRect(b.x1, b.y1, b.x2, b.y2);
  g.drawRect(b.x1+1, b.y1+1, b.x2-1, b.y2-1);
  
  // Redraw the standard border after 150ms
  setTimeout(() => {
    g.setColor(COLOR_BORDER);
    g.drawRect(b.x1, b.y1, b.x2, b.y2);
    g.drawRect(b.x1+1, b.y1+1, b.x2-1, b.y2-1);
  }, 150);
}

// Handle touchscreen taps
Bangle.on('touch', function(zone, e) {
  // Check which button area matches the x, y coordinates
  buttons.forEach(b => {
    if (e.x >= b.x1 && e.x <= b.x2 && e.y >= b.y1 && e.y <= b.y2) {
      Bluetooth.println(b.cmd); // Send string over BLE UART
      flashButton(b);
    }
  });
});

// Handle the physical "Back" button to send quit and exit the app
setWatch(function() {
  Bluetooth.println("quit"); // Alert the Raspberry Pi
  
  // Clean up listeners and return to the main watch application launcher
  Bangle.showLauncher();
}, BTN1, { repeat: false, edge: "falling" });

// Initialize the display layout
drawUI();

/*

require("Storage").write("ble-buttons.info", {
  "id": "ble-buttons",
  "name": "ble-buttons",
  "icon": "ble-buttons.img",
  "src": "ble-buttons.js"
});

require("Storage").write("ble-buttons.img", require("heatshrink").decompress(atob("mEw4UBAoP/AAXvvdVAC9UFo8VBYNABY8BBYJGJEQUO1WrA4M61WsEgILB9XAgfwgeqAAPAitQgYQBgE8h2wCQOwgtQgWgBYMMhYDBh2gBYISCgEPnADBgWsBYMKwAHClgDBgeoBY0gKQQLzKYUOBYxjBAwMLnhTCL4RjBA4M4hgnCO4SWBTYOsh4nCR4SUBUQOwVIKuCBYS/IBYQAIBcw2DBYxOCnXAJggLBMwUDfIRwB+ALBPwUA0B5BAgM8BYKWCgHsRgIEBhgLBVwcoRgIEBh4LGaAgL9L4kKKYUOO40ONYULR40CQYU4gtUU4kD1QCB1kVqi/F9Wq1WwitVY4q/DqtVoDiHgILBEgIAGEQIAXA==")));

*/
