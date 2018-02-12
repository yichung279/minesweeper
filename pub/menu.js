var storage=require('electron').remote.getGlobal('sharedObject')
var app = new Vue({
  el: '#menu',
  data: {
    difficulty:[
      'Easy',
      'Medium',
      'Hard'
    ],
  },
  methods:{
    setlevel(item){
      console.log(item)
      storage.level = item.item
      console.log(storage.level)
    },
    mouseEnter:function(item){
      $(`#${item.item}>i`).css("display","inline");
    } ,
    mouseLeave:function(item){
      $(`#${item.item}>i`).css("display","none");
    } 
  } 
})  


