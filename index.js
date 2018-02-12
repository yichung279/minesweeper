const {app} = require('electron')
const {ipcRenderer} = require('electron')
const {BrowserWindow} = require('electron')
let win

global.sharedObject = {
  level: 'easy',
}

app.on('ready', function() {
  win = new BrowserWindow({
    width: 300,
    height: 400,
  })
  win.loadURL('file://' + __dirname + '/pub/menu.html')
})


app.on('window-all-closed', app.quit);

app.on('before-quit', () => {
  win.removeAllListeners('close');
  win.close();
});

