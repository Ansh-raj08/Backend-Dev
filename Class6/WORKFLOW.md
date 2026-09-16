# Class6 API Workflow

This document explains how the Class6 project works from the moment the server starts until a response is sent back to Postman. It assumes no previous knowledge of Node.js, Express, APIs, or JSON files.

## 1. What this project is

Class6 is a small backend application. A backend is a program that waits for requests from another program, performs work, and sends responses back.

In this project:

- Postman is the client that sends requests.
- Express is the web framework that receives and routes requests.
- The controller functions contain the application logic.
- `database/database.json` acts as a simple database.
- The server runs on port `3002`.

The application provides these user operations:

| Operation | HTTP method | URL | Purpose |
| --- | --- | --- | --- |
| Read users | `GET` | `/user` | Return all users |
| Create user | `POST` | `/user` | Add a user |
| Update user | `PUT` | `/user/:id` | Update a user using an id in the URL |
| Update user | `PUT` | `/updateuser/:id` | Update a user using an id in the URL |
| Update user | `PUT` | `/updateuser` | Update a user using an id in the JSON body |
| Delete user | `DELETE` | `/deleteuser/:id` | Remove a user |

`:id` means that the actual URL must contain a number. For example, `/deleteuser/2` asks to delete the user whose id is `2`.

## 2. Project structure

```text
Class6/
|-- server.js
|-- package.json
|-- package-lock.json
|-- WORKFLOW.md
|-- FIXES.md
|-- controllers/
|   `-- user.js
|-- routes/
|   `-- userRoutes.js
`-- database/
    `-- database.json
```

### `server.js`

This is the entry point of the application. It:

1. Imports Express.
2. Creates an Express application.
3. Enables JSON request bodies with `express.json()`.
4. Mounts the routes from `routes/userRoutes.js`.
5. Starts listening on port `3002`.

The line `app.use('/', userRoutes)` means that Express should compare incoming requests with the routes exported from `userRoutes.js`.

### `routes/userRoutes.js`

This file maps an HTTP method and URL to a controller function. For example:

```js
router.delete('/deleteuser/:id', deleteuser)
```

This means that a `DELETE` request to `/deleteuser/2` should call the `deleteuser` function.

The router does not perform the database work itself. It only directs the request to the correct controller.

### `controllers/user.js`

This file contains the work performed for each request. The controller reads or changes the JSON file, then sends an HTTP response using `res.status(...).json(...)`.

### `database/database.json`

This file stores users as a JSON array. A typical record looks like this:

```json
{
  "name": "Ankit",
  "age": 25,
  "id": 1
}
```

This is suitable for learning, but it is not a production database. The entire file is read and rewritten for each operation that changes data.

## 3. Starting the server

Open a terminal in the `Class6` folder:

```bash
cd "/Users/anshmac/Desktop/Backend Dev/Class6"
npm install
npm start
```

The server should print:

```text
server has started at port 3002
```

The base address is:

```text
http://localhost:3002
```

`localhost` means this computer. The number `3002` identifies the port where this application is listening.

The server must keep running while requests are sent from Postman. Stop it with `Ctrl+C`.

For automatic restarting during development, use:

```bash
npx nodemon server.js
```

## 4. How one request travels through the application

Every request follows this general path:

```text
Postman
  -> HTTP request
  -> Express server
  -> matching route
  -> controller function
  -> database/database.json
  -> controller response
  -> Postman
```

For example, `DELETE /deleteuser/2` works like this:

1. Postman sends a `DELETE` request to `http://localhost:3002/deleteuser/2`.
2. Express receives the request on port `3002`.
3. The router matches `/deleteuser/:id`.
4. Express places `2` in `req.params.id`.
5. `deleteuser` converts the id from text to a number.
6. The controller reads `database/database.json`.
7. It finds the matching user and removes it from the array.
8. It writes the changed array back to the file.
9. It sends a JSON success response to Postman.

## 5. Reading users

### Postman request

```http
GET http://localhost:3002/user
```

No request body is needed.

### What the controller does

The `getuser` function:

1. Reads `database/database.json` using Node's `fs` module.
2. Converts the file text into a JavaScript array with `JSON.parse`.
3. Sends the array in the response.

### Example response

```json
{
  "message": "data fetched successfully..",
  "success": true,
  "data": [
    {
      "name": "Ankit",
      "age": 25,
      "id": 1
    }
  ]
}
```

## 6. Creating a user

### Postman request

```http
POST http://localhost:3002/user
```

In Postman, choose **Body**, select **raw**, and choose **JSON**. Send:

```json
{
  "name": "Neha",
  "age": 26,
  "id": 5
}
```

The `Content-Type` header should be `application/json`. Express uses `express.json()` in `server.js` to turn the JSON body into `req.body`.

### What the controller does

The `createuser` function:

1. Reads `name`, `age`, and `id` from `req.body`.
2. Checks that all three values exist.
3. Reads the existing JSON array.
4. Adds a new object with `data.push(...)`.
5. Writes the complete array back to the file.
6. Sends the updated array in the response.

## 7. Updating a user

There are three supported update URLs.

### Option A: id in the URL

```http
PUT http://localhost:3002/user/2
```

or:

```http
PUT http://localhost:3002/updateuser/2
```

Body:

```json
{
  "name": "Rohit Sharma",
  "age": 31
}
```

The id is available to the controller as `req.params.id`.

### Option B: id in the body

```http
PUT http://localhost:3002/updateuser
```

Body:

```json
{
  "id": 2,
  "name": "Rohit Sharma",
  "age": 31
}
```

The controller uses the URL id when it exists. Otherwise, it uses `req.body.id`.

### What the controller does

The `updateuser` function:

1. Converts the id to a number.
2. Returns `400` if a valid id was not supplied.
3. Reads the database array.
4. Searches for a user with the same id.
5. Returns `404` if no matching user exists.
6. Replaces `name` and `age` when those values are provided.
7. Writes the changed array to the JSON file.
8. Sends a success response.

## 8. Deleting a user

### Postman request

```http
DELETE http://localhost:3002/deleteuser/2
```

No body is required.

### What the controller does

The `deleteuser` function:

1. Reads the id from `req.params.id`.
2. Converts it from URL text to a number.
3. Reads the database array.
4. Finds the array position of the matching user.
5. Returns `404` if the user does not exist.
6. Removes one item with `data.splice(...)`.
7. Writes the changed array to the file.
8. Sends a success response.

### Example response

```json
{
  "message": "user deleted successfully",
  "success": true
}
```

## 9. Important HTTP status codes

| Status | Meaning in this project |
| --- | --- |
| `200` | The operation completed successfully |
| `400` | The request is missing a valid id |
| `404` | The user or required data was not found |
| `500` | The server encountered an unexpected programming or file error |

## 10. A simple testing order

Use this order when learning or testing the API:

1. Start the server.
2. Send `GET /user` to see the current data.
3. Send `POST /user` to create a test user.
4. Send `GET /user` again to confirm it was saved.
5. Send `PUT /updateuser/:id` to change that user.
6. Send `GET /user` again to confirm the update.
7. Send `DELETE /deleteuser/:id` to remove the test user.
8. Send `GET /user` one last time to confirm it was removed.

Always use a test id that you are comfortable changing or deleting because the operation changes `database/database.json` permanently.
