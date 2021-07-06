# express-list-routes-cuz

  List all routes used in Express[3,4,5]

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]

**Example App**
```js
const express = require('express');
const ExpressListRoutes = require('cuz-express-list-routes');
var expressListRoutes = new ExpressListRoutes();


const app = express();

app.get('/health', fn)

app.use('/admin', router);
router.route('/user')
  .post(fn)
  .get(fn)
  .put(fn);
``` 
**List all Routes with prefix**
```js
expressListRoutes.discover(app, { prefix: '/api/v1' });
// Logs out the following:
// GET    /api/v1/health
// POST   /api/v1/admin/user
// GET    /api/v1/admin/user
// PUT    /api/v1/admin/user
```
**Or only log out nested router routes**
```js
expressListRoutes.discover(router);
// Logs out the following:
// POST   /admin/user
// GET    /admin/user
// PUT    /admin/user
```
**Get all routes after discover from every where**
```js
const routes = expressListRoutes.getRoutes();
// Logs out the following:
/*
[
    { method: 'GET', stackPath: '/' },
    { method: 'GET', stackPath: '/users' },
    { method: 'GET', stackPath: '/v1/articles' },
    { method: 'POST', stackPath: '/v1/articles' },
    { method: 'GET', stackPath: '/v1/articles/:docId' },
    { method: 'PATCH', stackPath: '/v1/articles/:docId' },
    { method: 'DELETE', stackPath: '/v1/articles/:docId' }
]
*/
```

## Installation

```bash
npm install express-list-routes-cuz
```

## Options

You can pass a second argument to set some options

```js
  {
    prefix: '', // A prefix for router Path
    spacer: 7,   // Spacer between router Method and Path,
    showLog: false // Show log in discover, default true
  }
```