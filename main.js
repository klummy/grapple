const {
  app,
  BrowserWindow,
} = require('electron');
const path = require('path');
const url = require('url');

const isDev = process.env.NODE_ENV === 'development'

if (isDev) {
  require('electron-reload')(__dirname + '/dist')
}

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    height: 800,
    width: 800,
  })

  // TODO: Production build fixes. This likely won't work
  const startUrl = isDev ? 'http://localhost:1234' : url.format({
    pathname: path.join(__dirname, "./index.html"),
    protocol: 'file',
    slashes: true
  })

  mainWindow.loadURL(startUrl)

  // Maximize window
  mainWindow.maximize()

  if (isDev) {
    mainWindow.webContents.openDevTools({
      mode: 'bottom'
    })
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  })
}

app.on('ready', createWindow)

app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})