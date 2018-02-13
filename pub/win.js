const {ipcRenderer} = require('electron')
const storage = require('electron').remote.getGlobal('sharedObject')
const win = require('electron').remote.getCurrentWindow()

var board = new Vue({
  el: '#board',
  data: {
    win: true,
    lose: true,
    time: '',
    buttonStyle: {
      position: 'relative',
      left: '145px',
      display: 'inline',
    }
  },
  created:function(){
    if(storage.win){
      win.setSize(450,200)
      this.win = true
      this.lose = false
    }else{
      win.setSize(450,160)
      this.win = false
      this.lose = true
    }
    let sec_one = Math.floor( storage.finishTime % 10).toString()
    let sec_ten = Math.floor((storage.finishTime / 10) % 6).toString()
    let min_one = Math.floor((storage.finishTime / 60) % 10).toString()
    let min_ten = Math.floor( storage.finishTime / 600).toString()
    this.time = 'time:' + min_ten + min_one + ':' + sec_ten + sec_one
  }, 
  methods: {
    playAgain: function(){ipcRenderer.send('again')},
    quitGame: function(){ipcRenderer.send('quit')}
  },
})
