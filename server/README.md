# What is the server?

### The server is a node.js application that runs on the server. It is responsible for serving the API to the client. What that means is that it handles all the requests from the client and sends back the appropriate data. It also handles the database connection and all the database queries.

### This is using a MVC (Model View Controller) architecture. The model is the database, the view is the "view" of the responses (JSON, XML, etc.), and the controller is the server. The server is responsible for handling all the requests from the client and sending back the appropriate data. It also handles the database connection and all the database queries.

### More specific

## Routes

- The routes are defined in the `routes` folder.
- The routes only define the path and the _*controller*_ that should handle the request.
- The routes are then imported into the `routes/index.ts` file and added to the express app.
- The routes are then accessible at the specified path.

## Controllers

- The controllers are defined in the `controllers` folder.
- The controllers are responsible for handling the requests (they query the Firebase database, send the response, etc.)
- The controllers call the appropriate service to handle the request for the logic
- The controllers return the appropriate data to the routes

## Services

- The services are defined in the `services` folder.
- The services are responsible for handling the logic of the requests.
- The services execute logic and return the appropriate data to the controller.

## Models

- The models are defined in the `models` folder.
- The models are used by the controllers and services to define the data structure of the data that is used all throughout the backend server
