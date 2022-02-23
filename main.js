const { app, BrowserWindow, Tray, Menu, clipboard, ipcMain, nativeTheme } = require('electron')
const totp = require('totp-generator');
const path = require('path');
const Store = require('electron-store');

const store = new Store();
let tray = null;
let tokenWindow;
app.whenReady().then(() => {
  const theme = nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
  tray = new Tray(path.join(__dirname,`tray-${theme}.png`))
  tray.setToolTip('CASE')
  tray.setContextMenu(getTrayMenu())
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

function getTrayMenu() {
  const apps = store.get('apps') || []
  const contextMenu = Menu.buildFromTemplate([
    ...apps.map(app => ({
      label: `Get ${app} token`, type: 'normal', click: () => getCode(app)
    })),
    { label: '', type: 'separator'},
    { label: 'Register', type: 'normal', click: register},
    { label: 'Unregister', type: 'normal', click: unregister},
    { label: '', type: 'separator'},
    { label: 'About', type: 'normal', click: about },
    { label: 'Quit', type: 'normal', click: quit }
  ])
  return contextMenu
}

function getCode(appName) {
  try {
    const token = store.get(appName);
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

function register() {
  tokenWindow = new BrowserWindow({ 
    height:300, width:400, modal: true, show: false, maximizable: false, resizable: false,
    webPreferences: {
      nodeIntegration: true
    },
    title: 'CASE'
  })

  tokenWindow.loadFile('register.html')
  tokenWindow.once('ready-to-show', () => {
    tokenWindow.show()
  })
  tokenWindow.on('closed', () => {
    tokenWindow = null;
  });
}

function unregister() {
  tokenWindow = new BrowserWindow({ 
    height:300, width:400, modal: true, show: false, maximizable: false, resizable: false,
    webPreferences: {
      nodeIntegration: true
    },
    title: 'CASE'
  })

  tokenWindow.loadFile('unregister.html')
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

ipcMain.on('token:registration', function (event, appName, token) {
  try {
    if (tokenWindow) {
      tokenWindow.close()
    }
    const apps = store.get('apps')
    store.set('apps', (apps||[]).concat(appName))
    store.set(appName, token)

    tray.setContextMenu(getTrayMenu())
  } catch (ex) {
    console.log(ex)    
  }
});

ipcMain.on('token:unregistration', function (event, appName) {
  try {
    if (tokenWindow) {
      tokenWindow.close()
    }
    const apps = store.get('apps')
    store.set('apps', (apps||[]).filter(app => app !== appName))
    store.delete(appName)

    tray.setContextMenu(getTrayMenu())
  } catch (ex) {
    console.log(ex)    
  }
});

function about() {
  let aboutWin = new BrowserWindow({ 
    height:200, width:400, modal: true, show: false, maximizable: false, resizable: false,
    title: 'CASE'
  })

  aboutWin.loadFile('about.html')
  aboutWin.once('ready-to-show', () => {
    aboutWin.show()
  })
  aboutWin.on('closed', () => {
    aboutWin = null;
  });
}