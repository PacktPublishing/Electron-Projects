const { app, BrowserWindow } = require('electron');

// Import the Nucleus Library and init with your app id
const Nucleus = require('electron-nucleus')('Your App ID', {
  onlyMainProcess: true,
  version: '0.0.1'
});

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    resizable: false
  });

  win.loadFile('index.html');

  // Optional: report an event
  Nucleus.track('APP_LAUNCHED');

  Nucleus.onUpdate = version => {
    win.webContents.executeJavaScript(`
      alert('There is a new version available: ${version}');
    `);
  };

  // Fetch global settings
  Nucleus.getCustomData((err, data) => {
    if (err) {
      console.error(err);
    } else {
      console.log(data);
    }
  });

  Nucleus.checkLicense('Your License ID', (err, license) => {
    if (err) return console.error(err);

    if (license.valid) {
      console.log('License is valid :) Using policy ' + license.policy);
    } else {
      console.log('License is invalid :(');
    }
  });
}

app.on('ready', createWindow);
