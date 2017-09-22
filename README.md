# commingle
A simple way to run functions in series or parallel. 

Let's run three functions in sequence:

```
var co = require('commingle')
co([function1, function2, function3])()
```

`co` will return immediately and the three listed functions will be run next tick.

Each function is assumed to have a signature:

```
function(arg1, arg2, next) {
		
}
```

Each function will have to call next() before the subsequent function is run.

You'll notice the signature matches the Express middleware signature. (Setting up dependencies 
among express middleware was the reason commingle was written.) If the two arguments
are not specified, then they will be created as empty objects.

Let's say you want to set up a sequence where you acquire a database connection,
load a bunch of data, then render a page. That would look like:

```
var co = require('commingle')
app.get('/somepage', function(req, res, next) {
	co([dbConnect, [loadSlideshow, loadEvents, loadPosts], renderPage])(req, res, () => next())	
})
```

However, what commingle is doing is creating a function which has the same signature
as Express middleware, so if we want, we could also accomplish the same like:

```
var co = require('commingle')
app.get('/somepage', co([dbConnect, [loadSlideshow, loadEvents, loadPosts], renderPage]))
```

For just a little bit of analysis on the code above, what happens is the dbConnect
function is called, probably waiting for connection, adding the connection to the
req object, and calling next when ready. Then three asynchronous load functions are called, running in parallel,
using the db connection from the previous step, all loading independent pieces of data
which are needed for the next step. Once all three of those functions have called
next(), renderPage is called, getting information it needs from the request object
(having been placed there by the load functions).