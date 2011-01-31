/*
nihop.js 

Not-Invented-Here Options Parser

"the options parser dominic tarr wrote."

*/

//.option(long,short,numberOfArgs).do(function).usuage("line in usuage")

//which would return 

//{name: [args] or return value of function

var log = require('logger')

module.exports = Nihop

function Nihop(title,banner){
  if(!(this instanceof Nihop)) return new Nihop(title)
  this.options = {}
  this.funx = {}
  this.doc = {}
  this.length = {}
  this.title = title
  this.banner= banner
}

Nihop.prototype = {
  option: function (long,short,length){
    var self = this
    this.newOption = long

    this.length[long] = length

    this.options[long] = function (args){
      if(args[0] != '--' + long && args[0] != '-' + short)
        return false;
      
      args.shift() //option name
      
      if(!length)
        return true
      else if (length == 1)
        return args.shift()
      else if( length > 0){
        var r = []
        for(var i = 0; i < length; i ++)
          r.push(args.shift())
        return r
      } else {
        var r = []
        //stop if it's end of args list, or a new option is starting
        while(args.length && args[0][0] != '-'){
          r.push(args.shift())
        }
        return r
      }
    }

    return this
  },

  parse: function (args){
    var parsed = {args: []}
    var self = this
      
      function find (args){
        for(var option in self.options){
          var r = self.options[option] (args)

          log("PARSE?",option,r,args)

          if(r){
            parsed[option] = r
            log(self.funx, option)
            if(self.funx[option])
              self.funx[option].call(null,r,option)
          
            return true
          }
        }
      }
      
      while(args.length){
        if(!find(args))
          parsed.args.push(args.shift()) 
      }
    return parsed
  },
  do: function (func){
    this.funx[this.newOption] = func

    return this
  },
  describe: function (desc){
    this.doc[this.newOption] = desc

    return this
  },
  usuage: function (){
    var u = ''
    if(this.title)
    u += this.title + '\n'
    if(this.banner)
    u += this.banner + '\n'
    
    for(var option in this.options){
      u += '--' + option + '   ' + this.length[option] + '   ' + this.doc[option] + '\n'    
    }
    return u
  }
}