const { app, BrowserWindow, Menu } = require('electron');
const menu = require('./menu');

Menu.setApplicationMenu(menu);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    resizable: false
  });

  win.loadURL(`http://localhost:3000`);
}

app.on('ready', createWindow);
