const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");
const logger = require("./config/logger");
const sequelize = require("./database");

let server;
let port = process.env.PORT || 8000;

// mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
//    logger.info('Connected to MongoDB')
//    server = app.listen(port, () => {
//       logger.info(`Listening to port ${port}`)
//    })
// })
async function startApp() {
  try {
    await sequelize.authenticate();
    console.log("Connected to the database.");
    server = app.listen(port, () => {
      logger.info(`Listening to port ${port}`);
    });

    // Synchronize the models with the database (creates tables if they don't exist)
    await sequelize.sync();

    // Start your application logic here
    // ...
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startApp();

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
