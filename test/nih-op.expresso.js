var Nihop = require('nih-op')
  , assert = require('assert')

exports ['single boolean option'] = function (){


  var parser = Nihop("test").option('test','t',0)
  
  assert.deepEqual(parser.parse(['--test']), {test: true, args: []})
  assert.deepEqual(parser.parse(['-t']), {test: true, args: []})
  assert.deepEqual(parser.parse(['-t', 123]), {test: true, args: [123]})
}

exports ['options with single arg'] = function (){

  var parser = Nihop("test").option('x','x',1).option('y','y',1)

  assert.deepEqual
    ( parser.parse(['--x', 'hello'])
    , {x: 'hello', args: []})

  assert.deepEqual
    ( parser.parse(['--x', 'hello', '-y', 'goodbye'])
    , {x: 'hello', y: 'goodbye', args: []})
}

exports ['options with fixed args'] = function (){

  var parser = Nihop("test").option('x','x',2).option('y','y',3)

  assert.deepEqual
    ( parser.parse(['--x', 'hello', 'john'])
    , {x: ['hello','john'] , args: []})

  assert.deepEqual
    ( parser.parse(['--x', 'hello', 'there', '-y', 1,2,3])
    , {x: ['hello', 'there'], y: [1,2,3], args: []})
}

exports ['options with vairable args'] = function (){

  var parser = Nihop("test").option('x','x',-1).option('y','y',-1)

  assert.deepEqual
    ( parser.parse(['--x', 'hello', 'john'])
    , {x: ['hello','john'] , args: []})

  assert.deepEqual
    ( parser.parse 
      ( [ '--x', 'hello', 'there'
        , '-y', 1,2,3 ] )
    , { x: ['hello', 'there']
      , y: [1,2,3], args: [] } )
}

exports ['call a function with args'] = function (){
  var isCalled1 = false
    , isCalled2 = false
    , isCalled3 = false

  var parser = Nihop("test")
    .option('true','t').do(function (bool,name){
      assert.ok(bool)
      assert.equal(name,'true')
      isCalled1 = true
    })
    .option('false','f').do(function (bool,name){
      assert.ok(bool)
      assert.equal(name,'false')
      isCalled2 = true
    })
    .option('value','v',1).do(function (value,name){
      assert.equal(value,10)
      assert.equal(name,'value')
      isCalled3 = true
    })
    
    parser.parse(['--true', '-f','-v', 10])
    
    assert.ok(isCalled1)
    assert.ok(isCalled2)
    assert.ok(isCalled3)
}   


exports ['generate usuage'] = function (){

  var parser = Nihop("test", "example for nih-op\nnot-invented-here options parser")
    .option('array','a',-1)
      .describe("list of values")
    .option('boolean','b')
      .describe("include if true")
    .option('value','v')
      .describe("value of value")
      
  console.log(parser.usuage())

}