# Class6 Fixes and Why They Were Needed

This document records the problems found while making the Class6 API work in Postman. It explains the original symptom, the cause, the fix, and the result in beginner-friendly language.

## Fix 1: The routes were not connected to the server

### Symptom

Postman returned `404 Not Found` even when the URL looked correct.

### Cause

`server.js` created an Express app and started the server, but it did not import or mount `userRoutes.js`. Express therefore had no knowledge of the user routes.

### Fix

The server now imports the router and mounts it:

```js
import userRoutes from './routes/userRoutes.js'

app.use('/', userRoutes)
```

### Why this works

The router contains the URL-to-controller mappings. `app.use('/', userRoutes)` tells Express to use those mappings for requests beginning at the root URL.

## Fix 2: JSON request bodies were not being parsed

### Symptom

The server could not reliably read values sent in Postman's raw JSON body.

### Cause

Incoming HTTP request bodies arrive as data that Express must parse. Without JSON middleware, `req.body` may be unavailable.

### Fix

`server.js` now includes:

```js
app.use(express.json())
```

### Why this works

This middleware reads a request with `Content-Type: application/json` and converts its JSON text into a JavaScript object. A body such as `{"id":2}` can then be read as `req.body.id`.

## Fix 3: The wrong database filename was used

### Symptom

The controller attempted to read a file that did not exist, which could cause a server error.

### Cause

The real file is:

```text
database/database.json
```

Some controller code was using:

```text
database/data.json
```

Those are different filenames.

### Fix

All controller operations now use `database/database.json`.

### Why this works

The `fs` module can only read or write a file that exists at the path supplied to it. Using the actual filename allows the controllers to access the project data.

## Fix 4: The update route did not match the Postman URL

### Symptom

Postman was using:

```http
PUT http://localhost:3002/updateuser
```

but the available route originally expected a URL shaped like:

```http
PUT http://localhost:3002/user/2
```

This mismatch caused a `404 Not Found` response.

### Fix

The project now supports all of these routes:

```js
router.put('/user/:id', updateuser)
router.put('/updateuser', updateuser)
router.put('/updateuser/:id', updateuser)
```

The body-based form requires an id:

```json
{
  "id": 2,
  "name": "Rohit",
  "age": 30
}
```

### Why this works

The controller first checks the URL parameter and then falls back to the body:

```js
const id = Number(req.params.id ?? req.body.id)
```

This lets both URL styles identify the user.

## Fix 5: The update controller did not finish the operation

### Symptom

The update function changed the user object in memory but did not save the file or send a response.

### Cause

Changing a JavaScript object only changes the temporary in-memory copy. The JSON file remains unchanged unless `fs.writeFileSync` is called.

An HTTP request also needs a response. Without `res.json(...)` or another response method, Postman may wait or report a connection problem.

### Fix

The controller now:

1. Finds the requested user.
2. Updates the supplied fields.
3. Writes the complete array to `database/database.json`.
4. Sends a `200` JSON response.

It also returns `404` when the id does not match a user and `400` when the id is invalid.

## Fix 6: The delete controller used an undefined variable

### Symptom

Postman returned:

```text
500 Internal Server Error
```

for:

```http
DELETE http://localhost:3002/deleteuser/2
```

### Cause

The controller called:

```js
fs.readFileSync(filePath, 'utf-8')
```

and:

```js
fs.writeFileSync(filePath, ...)
```

but `filePath` had never been declared. JavaScript could not resolve that variable, so the request crashed inside the controller.

### Fix

The controller now declares the path before using it:

```js
const filePath = './database/database.json';
```

### Why this works

Both the read and write operations now use a real, known file path. The controller can remove the selected user and save the result.

## Fix 7: Missing-user responses were added

### Problem prevented

If an update or delete request used an id that did not exist, the code could try to change or remove something that was not present.

### Fix

The controllers now check for a match and return a clear response:

```json
{
  "message": "user not found",
  "success": false
}
```

The response status is `404`.

## Verification performed

The following checks were completed:

- The server started on port `3002`.
- A temporary user was created with `POST /user`.
- The temporary user was deleted with `DELETE /deleteuser/99`.
- The delete request returned status `200`.
- The temporary user was removed successfully.
- The original database records remained intact.
- The edited JavaScript files reported no diagnostics.

## Current limitations and learning notes

These items are not current failures, but they are useful to understand:

### The JSON file is only a learning database

The entire file is read and rewritten for each change. A real application would normally use a database such as MongoDB, PostgreSQL, or MySQL.

### File paths depend on the start directory

The controllers use paths such as `./database/database.json`. Start the server from the `Class6` directory so those relative paths resolve correctly.

### User ids are not checked for duplicates during creation

The create controller checks that an id exists, but it does not check whether another user already has that id. Duplicate ids could make future updates or deletes ambiguous.

### Validation is basic

The current code does not strongly validate types, age ranges, empty strings, or duplicate users. These are natural next improvements after understanding the current workflow.
