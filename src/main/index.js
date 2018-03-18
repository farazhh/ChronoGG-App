import { app, BrowserWindow, Menu, Tray } from 'electron' // eslint-disable-line
import AutoLaunch from 'auto-launch';
import Storage from 'electron-json-storage';
import log from 'electron-log';
import path from 'path';

log.transports.file.level = 'info';
log.transports.file.file = `${__dirname}chronogg.log`;

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('minimize', (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }

    return false;
  });

  const appIcon = new Tray(path.join(__static, 'icons', 'icon.png'));

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App',
      click() {
        mainWindow.show();
      } },
    { label: 'Quit',
      click() {
        app.isQuiting = true;
        app.quit();
      } },
  ]);

  appIcon.setContextMenu(contextMenu);

  mainWindow.tray = appIcon;
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

new AutoLaunch({
  name: 'ChronoGG App',
  path: app.getPath('exe'),
  isHidden: true,
}).enable();

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
