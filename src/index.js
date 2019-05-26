const express = require('express');
const bodyParser = require('body-parser');
const routerModule = require('express-promise-router');

// Initialize express and its middlewares that's needed
const app = express();

// Body parser is needed to parse the request parameters
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Call the routes file that holds the resources.
const routes = require('./routes'); // The app's resources

const router = routerModule();

routes(router, app);

// Express should also serve the compiled static files in the dist folder
app.use(express.static('dist'));

// Bind the routes to the root folder
app.use('/', router);

// Set the application's path
const port = process.env.PORT || 3000;

// Run the HTTP server
// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Recommendify server running on port ${port}!`));
