const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    resizable: false
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : 'index.html'
  );
}

app.on('ready', createWindow);
