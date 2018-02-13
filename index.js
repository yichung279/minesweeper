const {app} = require('electron')
const {ipcMain} = require('electron')
const {BrowserWindow} = require('electron')
let winMain,winOver

global.sharedObject = {
  level: '',
}

app.on('ready', function() {
  winMain = new BrowserWindow({
    width: 300,
    height: 400,
  })
  winOver = new BrowserWindow({
    width: 200,
    height: 200,
    show: false,
  })
  winMain.loadURL('file://' + __dirname + '/pub/menu.html')
  winMain.on('closed',() => {
    app.quit()
  });
  
  ipcMain.on('over', (event,result) => {
    if(result == 'win'){
      winOver.loadURL('file://' + __dirname + '/pub/win.html')
    }else if(result == 'lose'){
      winOver.loadURL('file://' + __dirname + '/pub/lose.html')
    }else{
      console.log('over error at index.js')
    }
    winOver.show()
  })
})



app.on('window-all-closed', app.quit);

app.on('before-quit', () => {
  winMain.removeAllListeners('close');
  winOver.removeAllListeners('close');
  winMain.close();
  winOver.close();
});

