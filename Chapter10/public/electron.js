const { app, BrowserWindow, Menu } = require('electron');
const isDev = require('electron-is-dev');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    resizable: false
  });

  win.loadURL(isDev ? 'http://localhost:3000' : 'index.html');
}

app.on('ready', createWindow);

Menu.setApplicationMenu(
  Menu.buildFromTemplate([
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Node',
          click() {
            const window = BrowserWindow.getFocusedWindow();
            window.webContents.send('commands', 'show-node-info');
          }
        }
      ]
    }
  ])
);
