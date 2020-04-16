// Import & Connect to the database
const db = require('./database');
const database = new db.Database();
database.connect();

// Load & Start the services
const svcLib = require('./services');
const services = svcLib.getInstance();
services.init(svcLib, () => {
    services.start()
});
