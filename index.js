const {app} = require('electron')
const {ipcMain} = require('electron')
const {BrowserWindow} = require('electron')
let winMain,winOver

global.sharedObject = {
  level: '',
  finishTime: 0,
  win: false,
}

app.on('ready', function() {
  winMain = new BrowserWindow({
    width: 300,
    height: 400,
  })
  winOver = new BrowserWindow({
    width: 450,
    height: 200,
    show: false,
  })
  winMain.loadURL('file://' + __dirname + '/pub/menu.html')
  winMain.on('closed',() => {
    app.quit()
  });
  
  ipcMain.on('over', (event) => {
    winOver.loadURL('file://' + __dirname + '/pub/win.html')
    winOver.show()
  })
  ipcMain.on('again', (e) => {
    winOver.hide()
    winMain.loadURL('file://' + __dirname + '/pub/index.html')
  })
  ipcMain.on('quit', (e) => {
    winOver.close()
    winMain.close()
    app.quit()
  })
})



app.on('before-quit', () => {
  winMain.removeAllListeners('close')
  winOver.removeAllListeners('close')
  winMain.close()
  winOver.close()
});

