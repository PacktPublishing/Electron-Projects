const { Menu, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { exec } = require('child_process');
const { shell } = require('electron');

ipcMain.on('save', (_, contents) => {
  saveFile(contents);
});

ipcMain.on('generate', (_, payload) => {
  if (payload && payload.format) {
    switch (payload.format) {
      case 'html':
        generateHTML(payload.text);
        break;
      case 'pdf':
        generatePDF(payload.text);
        break;
      case 'epub':
        generateEPUB(payload.text);
        break;
      default:
        break;
    }
  }
});

function generateEPUB(contents) {
  writeTempFile(contents, fileName => {
    const name = 'markdown';
    const filePath = path.dirname(fileName);

    const command = `docker run -v ${filePath}:/source denysvuika/pandoc -f markdown ${name}.md -o ${name}.epub`;
    exec(command, () => {
      const outputPath = path.join(filePath, `${name}.epub`);
      // exec(`open ${outputPath}`).stderr.pipe(process.stderr);
      shell.openItem(outputPath);
    }).stderr.pipe(process.stderr);
  });
}

function generatePDF(contents) {
  writeTempFile(contents, fileName => {
    const name = 'markdown';
    const filePath = path.dirname(fileName);

    const command = `docker run -v ${filePath}:/source denysvuika/pandoc -f markdown -t latex ${name}.md -o ${name}.pdf`;
    exec(command, () => {
      const outputPath = path.join(filePath, `${name}.pdf`);
      exec(`open ${outputPath}`).stderr.pipe(process.stderr);
    }).stderr.pipe(process.stderr);
  });
}

function writeTempFile(contents, callback) {
  const tempPath = path.join(os.tmpdir(), 'markdown');
  console.log(tempPath);

  fs.mkdtemp(tempPath, (_, folderName) => {
    const filePath = path.join(folderName, 'markdown.md');

    fs.writeFile(filePath, contents, 'utf8', () => {
      callback(filePath);
    });
  });
}

function generateHTML(contents) {
  writeTempFile(contents, fileName => {
    const name = 'markdown';
    const filePath = path.dirname(fileName);

    const command = `docker run -v ${filePath}:/source denysvuika/pandoc -f markdown -t html5 ${name}.md -o ${name}.html`;
    exec(command, () => {
      const outputPath = path.join(filePath, `${name}.html`);
      exec(`open ${outputPath}`).stderr.pipe(process.stderr);
    }).stderr.pipe(process.stderr);
  });
}

function saveFile(contents) {
  const window = BrowserWindow.getFocusedWindow();
  const options = {
    title: 'Save markdown file',
    filters: [
      {
        name: 'MyFile',
        extensions: ['md']
      }
    ]
  };

  dialog.showSaveDialog(window, options, filename => {
    if (filename) {
      fs.writeFileSync(filename, contents);
    }
  });
}

function loadFile() {
  const window = BrowserWindow.getFocusedWindow();

  const options = {
    title: 'Pick a markdown file',
    filters: [{ name: 'Markdown files', extensions: ['md'] }]
  };

  dialog.showOpenDialog(window, options, paths => {
    if (paths && paths.length > 0) {
      const content = fs.readFileSync(paths[0]).toString();

      window.webContents.send('commands', {
        command: 'file.open',
        value: content
      });
    }
  });
}

module.exports = Menu.buildFromTemplate([
  {
    label: 'File',
    submenu: [
      {
        label: 'Open',
        accelerator: 'CommandOrControl+O',
        click() {
          loadFile();
        }
      },
      {
        label: 'Save',
        accelerator: 'CommandOrControl+S',
        click() {
          BrowserWindow.getFocusedWindow().webContents.send('commands', {
            command: 'file.save'
          });
        }
      }
    ]
  },
  {
    label: 'Debugging',
    submenu: [
      {
        label: 'Dev Tools',
        role: 'toggleDevTools'
      },

      { type: 'separator' },
      {
        role: 'reload',
        accelerator: 'Alt+R'
      }
    ]
  }
]);
