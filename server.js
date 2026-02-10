require('dotenv').config();
const app = require("./src/app");
const config = require("./config/local.json");

const PORT = config.PORT;

// Listen to the express server
const server = app.listen(PORT, '0.0.0.0', () => {
 console.log(`App running on http://localhost:${PORT}`);
});

module.exports = server;