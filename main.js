const { app, BrowserWindow, Tray, Menu, clipboard, ipcMain } = require('electron')
const totp = require('totp-generator');
const path = require('path');
const Store = require('electron-store');

const store = new Store();
let tray = null;
let tokenWindow;
app.whenReady().then(() => {
  tray = new Tray(path.join(__dirname,'el.png'))
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Get code', type: 'normal', click: getCode },
    { label: 'Register Token', type: 'normal', click: setToken},
    { label: 'Reset', type: 'normal' },
    { label: '', type: 'separator'},
    { label: 'About el.', type: 'normal', click: aboutEl },
    { label: 'Quit el.', type: 'normal', click: quit }
  ])
  tray.setToolTip('el.')
  tray.setContextMenu(contextMenu)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

function getCode() {
  try {
    const token = store.get('token');
    if (!token) {
      clipboard.writeText('totp token not registered!')
      return;
    }
    const code = totp(token);
    clipboard.writeText(code);
  } catch (error) {
    clipboard.writeText('ERROR: invalid totp token. Register again.')
  }
}

function setToken() {
  tokenWindow = new BrowserWindow({ 
    height:200, width:400, modal: true, show: false, maximizable: false, resizable: false,
    webPreferences: {
      nodeIntegration: true
    },
    title: 'el.'
  })

  tokenWindow.loadFile('token.html')
  tokenWindow.once('ready-to-show', () => {
    tokenWindow.show()
  })
  tokenWindow.on('closed', () => {
    tokenWindow = null;
  });
}

function quit() {
  app.quit()
}

ipcMain.on('token:registration', function (event, token) {
  try {
    if (tokenWindow) {
      tokenWindow.close()
    }
    store.set('token', token)
  } catch (error) {
    
  }
});

function aboutEl() {
  let aboutWin = new BrowserWindow({ 
    height:200, width:400, modal: true, show: false, maximizable: false, resizable: false,
    title: 'el.'
  })

  aboutWin.loadFile('about.html')
  aboutWin.once('ready-to-show', () => {
    aboutWin.show()
  })
  aboutWin.on('closed', () => {
    aboutWin = null;
  });
}