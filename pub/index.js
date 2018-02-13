const {ipcRenderer} = require('electron')
const storage = require('electron').remote.getGlobal('sharedObject') 
const win = require('electron').remote.getCurrentWindow()

var clock = new Vue({
  el: '#clock',
  data: {
    minutes_ten:0,
    minutes_one:0,
    seconds_ten: 0,
    seconds_one: 0,
    distance : 0,
    keepGoing: true,
  },
  created:function(){
    var that = this
    setInterval(()=>{
      if (this.keepGoing){that.distance += 1}
      that.seconds_one = that.distance % 10
      that.seconds_ten = Math.floor(that.distance / 10) % 6
      that.minutes_one = Math.floor(that.distance / 60) % 10
      that.minutes_ten = Math.floor(that.distance / 600) 
    } , 1000)
  },
  methods: {
    test: function(){
    }
  }
})



var game = new Vue({
  el : '#game',
  data : {
    map : [],
    trig: 0,
    mine_count: 0,
    flag_count: 0,
  },

  created : function(){
    if (storage.level === 'Easy'){
      this.setGame(9, 9, 10, 320, 350 )
    }else if (storage.level === 'Medium'){
      this.setGame(16, 16, 40, 450, 550)
    }else if (storage.level === 'Hard'){
      this.setGame(30, 16, 99, 800, 550 )
    }
  },

  methods : {

    setGame : function(x, y, m, width, height){
      this.setMap(x,y)
      this.setMines(x, y, m)
      win.setSize(width,height)
      
    },

    setMap : function(x,y){
      let map = this.map
      for(let i = 0; i < y; i++){
        map[i] = new Array()
        for(let j = 0; j < x; j++){
          map[i][j] = {
            mine : 0,
            pos_i : i,
            pos_j : j,
            visited : false,
            flaged : false,
            boom : false,
            show : "",
          }
        }
      }
    },
 
    setMines : function(x, y, mines){
      let map = this.map
      let mine_count = 0
      this.mine_count = mines
      while(mine_count < mines){
        let rand1 = Math.floor(Math.random()*y)
        let rand2 = Math.floor(Math.random()*x)
        if (map[rand1][rand2].mine == 0){
          map[rand1][rand2].mine = 1
          mine_count++
        }
      }
    },

    detect: function(dot){
      let i = dot.dot.pos_i
      let j = dot.dot.pos_j
      if (dot.dot.flaged){
        return 0
      }
      this.sweep(i, j)
    },

    sweep : function(i, j){
      let that = this
      if(i < 0|| i >= that.map.length|| j < 0|| j >= that.map[0].length){
        return 0
      }
      if(that.map[i][j].visited){
        return 0
      }
      that.map[i][j].visited = true
      if(that.map[i][j].mine == 1){
        console.log('game over')
        that.gameover()
      }else if(that.mineAround(i, j) == 0){
        that.checkGame()
        that.map[i][j].show = '0'
        that.trig ++
        that.sweep(i-1, j-1)
        that.sweep(i-1, j)
        that.sweep(i-1, j+1)
        that.sweep(i, j-1)
        that.sweep(i, j+1)
        that.sweep(i+1, j-1)
        that.sweep(i+1, j)
        that.sweep(i+1, j+1)
      }else{
        that.checkGame()
        console.log(that.mineAround(i,j))
        that.map[i][j].show = that.mineAround(i, j).toString()
        that.trig ++
      }
    },

    mineAround: function(i, j){
      let map = this.map
      let count = 0
      if(0 <= i-1 && 0 <= j-1){
        if(map[i-1][j-1].mine == 1){count++}
      }
      if(0 <= i-1){
        if(map[i-1][ j ].mine == 1){count++}
      }
      if(0 <= i-1 && j+1 < map[0].length){
        if(map[i-1][j+1].mine == 1){count++}
      }
      if(0 <= j-1){
        if(map[ i ][j-1].mine == 1){count++}
      }
      if(j+1 < map[0].length){
        if(map[ i ][j+1].mine == 1){count++}
      }
      if(i+1 < map.length && 0 <= j-1){
        if(map[i+1][j-1].mine == 1){count++}
      }
      if(i+1 < map.length){
        if(map[i+1][ j ].mine == 1){count++}
      }
      if(i+1 < map.length &&  j+1 < map[0].length){
        if(map[i+1][j+1].mine == 1){count++}
      }
      return count
    },
    
    mark: function(dot){
      if (dot.dot.flaged){
        dot.dot.flaged = false  
        this.flag_count--
        this.trig--
      }else{
        dot.dot.flaged = true
        this.flag_count++
        this.trig++
      }
    },

    checkGame: function(){
      for(let i =  0; i < this.map.length; i++){
        for(let j = 0; j < this.map[i].length; j++){
          if(this.map[i][j].mine == 0 && !this.map[i][j].visited){
            return true
          }
        }
      }
      ipcRenderer.send('over')
      storage.win = true
      clock.keepGoing = false
      storage.finishTime = clock.distance
      return false
    },

    gameover: function(){
      ipcRenderer.send('over')
      storage.win = false
      clock.keepGoing = false
      let that = this
      for(let i =  0; i < that.map.length; i++){
        for(let j = 0; j < that.map[i].length; j++){
          if(this.map[i][j].mine == 1 && !this.map[i][j].flaged){
            this.map[i][j].boom = true
          }
        }
      }
      this.trig--
    },

  }
})
