const { app, BrowserWindow, Menu, Tray, globalShortcut } = require('electron');
const path = require('path');

let win;
let tray;

function createTray() {
  const iconPath = path.join(__dirname, 'assets/icon.png');
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      type: 'normal',
      accelerator: 'CommandOrControl+Alt+Shift+S',
      click() {
        win.show();
      }
    },
    {
      label: 'Quit',
      type: 'normal',
      click() {
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Screenshot Snipping Tool');
  tray.setContextMenu(contextMenu);

  globalShortcut.register('CommandOrControl+Alt+Shift+S', () => {
    if (win) {
      win.show();
    }
  });
}

function createWindow() {
  win = new BrowserWindow({
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.hide();
  win.loadURL(`http://localhost:3000`);

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', () => {
  createTray();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
