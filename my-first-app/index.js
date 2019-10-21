// 1.
const { app, BrowserWindow } = require('electron');

// 2.
let window;

// 3.
app.on('ready', () => {
  // 4.
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  window.loadFile('index.html');
});
