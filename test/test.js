var assert = require("assert"),
    routes = require("../index"),
    router = new routes.Router();

(function(){
  //avoid typing assert.blah all over
  for(k in assert){
    this[k] = assert[k];
  }  
})();

equal(1, 1);

var noop = function(){};

var cases = [
  {
    path: "/lang",
    testMatch: {
      "/lang" :{
        fn: noop,
        params: {},
        splats: []
      },
      "/lang/" :{
        fn: noop,
        params: {},
        splats: []
      }
    }
  },
  {
    path: "/lang/:lang([a-z]{2})",
    testMatch :{
      "/lang/de":{
        fn: noop,
        params: { 
          "lang":"de"
        },
        splats:[]
      }
    },
    testNoMatch: ["/lang/who", "/lang/toolong", "/lang/1"]
  },
  {
    path: "/normal/:id", 
    testMatch: {
      "/normal/1":{
        fn: noop,
        params: {
          id: "1"
        },
        splats: []
      }
    },
    testNoMatch: ["/normal/1/updates"]
  },
  {
    path: "/optional/:id?", 
    testMatch: {
      "/optional/1":{
        fn: noop,
        params: {
          id: "1"
        },
        splats: []
      },
      "/optional/":{
        fn: noop,
        params: {
          id: undefined
        },
        splats: []
      }
    },
    testNoMatch: ["/optional/1/blah"]
  },
  {
    path: "/whatever/*.*",
     testMatch: {
        "/whatever/1/2/3.js":{
          fn: noop,
          params: { },
          splats:["1/2/3", "js"],
        }
      },
    testNomatch: [ "/whatever/" ]
  },
  { 
    path: "/files/*.*",
    testMatch: {
      "/files/hi.json":{
        fn: noop,
        params: {},
        splats: ["hi", "json"]
      },
      "/files/blah/blah.js":{
        fn: noop,
        params: {},
        splats: ["blah/blah", "js"]
      }
    },
    testNoMatch: ["/files/", "/files/blah"]
  },
  {
    path: "/transitive/:kind/:id/:method?.:format?",
    testMatch: {
      "/transitive/users/ekjnekjnfkej":  {
        fn: noop,
        params: { 
          "kind":"users", 
          "id":"ekjnekjnfkej",
          "method": undefined,
          "format": undefined },
        splats:[],
      },
      "/transitive/users/ekjnekjnfkej/update": {
        fn: noop,
        params: { 
          "kind":"users", 
          "id":"ekjnekjnfkej",
          "method": "update",
          "format": undefined },
        splats:[],        
      },
      "/transitive/users/ekjnekjnfkej/update.json": {
        fn: noop,
        params: { 
          "kind":"users", 
          "id":"ekjnekjnfkej",
          "method": "update",
          "format": "json" },
        splats:[],        
      }
    },
    testNoMatch: ["/transitive/kind/", "/transitive/"]
  },
  {
    path: /^\/(\d{2,3}-\d{2,3}-\d{4})\.(\w*)$/,
    testMatch :{
      "/123-22-1234.json":{
        fn: noop,
        params: {},
        splats:["123-22-1234", "json"]
      }
    },
    testNoMatch: ["/123-1-1234.png", "/123-22-1234", "/123.png"]
  },
]

//load routes
for(caseIdx in cases){
  test = cases[caseIdx];
  router.addRoute(test.path, noop);
}

var assertCount = 0;

//run tests
for(caseIdx in cases){
  test = cases[caseIdx];
  for(path in test.testMatch){
    match = router.match(path);
    fixture = test.testMatch[path];
    
    //save typing in fixtures
    fixture.route = test.path;
    deepEqual(match, fixture);
    assertCount++;
  }
  
  for(noMatchIdx in test.testNoMatch){
    match = router.match(test.testNoMatch[noMatchIdx]);
    strictEqual(match, undefined);
    assertCount++;
  }
}

console.log(assertCount.toString()+ " assertions made succesfully");