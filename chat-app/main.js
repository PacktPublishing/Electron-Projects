const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    resizable: false
  });

  win.loadURL(`http://localhost:4200`);
}

app.on('ready', createWindow);
