# Routes.js

`routes` lets you easily dispatch based on url-style strings.  It comes with a default Router function that you can use to route http requests, but it also cleanly exposes the important functionality so you could also use it to perform more generic string pattern matching.

This might make it useful for things like:

1. URI routing
2. Cucumber-style pattern matching :)
3. Routing messages by channel name from an MQ
4. Dispatching hierarchical events by name


## Router Example:

The full range of `Path Formats` is documented below.

    var router = new require('routes').Router();
    var noop = function(){};

    router.addRoute("/articles/:title?", noop);
    router.addRoute("/:controller/:action/:id.:format?", noop);

    console.log(router.match("/articles"));
    console.log(router.match("/articles/never-gonna-let-you-down"));
    console.log(router.match("/posts/show/1.json"));

The output for `router.match("/posts/show/1.json")` would be:

    { params: 
       { controller: 'posts',
         action: 'show',
         id: '1',
         format: 'json' },
      splats: [],
      route: '/:controller/:action/:id.:format?',
      fn: [Function] }
  
In the example above, fn would be the function that was passed into the router.


I return this object instead of calling your function for you because you will likely want to add additional parameters from the current context to the function invocation. Ex:

    var route = router.match("/posts/show/1.json");
    route.fn.apply([req, res, route.params, route.splats]);

## Installation

`npm install routes`

## Path Formats

Basic string:

    "/articles" will only match routes that == "/articles".

Named parameters:

    "/articles/:title" will only match routes like "/articles/hello", but *not* "/articles/".

Optional named parameters:

    "/articles/:title?" will match "/articles/hello" AND "/articles/"

Periods before optional parameters are also optional:

    "/:n.:f?" will match "/1" and "/1.json"

Splaaaat! :

    "/assets/*" will match "/assets/blah/blah/blah.png" and "/assets/".
    
    "/assets/*.*" will match "/assets/1/2/3.js" as splats: ["1/2/3", "js"]

Mix splat with named parameters:

    "/account/:id/assets/*" will match "/account/2/assets/folder.png" as params: {id: 2}, splats:["folder.png"]


Named RegExp:

    "/lang/:lang([a-z]{2})" will match "/lang/en" but not "/lang/12" or "/lang/eng"

Raw RegExp:

    /^\/(\d{2,3}-\d{2,3}-\d{4})\.(\w*)$/ (note no quotes, this is a RegExp, not a string.) will match "/123-22-1234.json". Each match group will be an entry in splats: ["123-22-1234", "json"]


## Router API

The `Router()` that `routes` exposes has two functions: `addRoute` and `match`.

`addRoute`: takes a `path` and a `fn`. Your `path` can match any of the formats in the "Path Formats" section.

`match`: takes a `String` and returns an object that contains the named `params`, `splats`, `route` (string that was matched against), and the `fn` handler you passed in with `addRoute`

## Library API

`match`: takes an array of `Routes`, and a `String`. Goes through `Routes` and returns an object for the first `Route` that matches the `String`, or 'undefined' if none is found. The result object contains `params`, `splats`, and `route`. `params` is an object containing the named matches, `splats` contains the unnamed globs ("*") and `route` contains the original string that was matched against.

`pathToRegExp`: takes a `path` string and an empty array, `keys`.  Returns a RegExp and populates `keys` with the names of the match groups that the RegExp will match. This is largely an internal function but is provided in case someone wants to make a nifty string -> [RegExp, keys] utility.


## Test

Clone the repo, cd to it and:

`make test`

## Credits

This library is an extraction and re-factor of the `connect` `router` middleware.  I found that connect-based routing worked reasonably well on the server side, but I wanted to do similar routing based on channel names when using `Push-It` and possibly for event names when using `Evan`.  So, I extracted the relevant goodness out of the `router` middleware and presented it here.  Big thanks to TJ Holowaychuk for writing the original `router` middleware.

## License

This code is distributed under the MIT license, Copyright Aaron Blohowiak and TJ Holowaychuk 2011.