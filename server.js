const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./app");

process.on("uncaughtException", (err) => {
  console.log("--------------UNCAUGHT EXPRESSION----------------");
  console.log(`${err.name} : ${err.message}`);
  process.exit(1); // sclosing server, shutdown application;
});

const DB = process.env.DATABASE.replace("<password>", process.env.DATABASE_PASSWORD);

mongoose.connect(DB);

const server = app.listen(process.env.PORT || 7000, () => {
  console.log(`Server started on port: ${process.env.PORT}`);
});

/// handle async: unhandle rejections error, globally

process.on("unhandledRejection", (err) => {
  console.log("--------------UNHANDLED REJECTION----------------");
  console.log(`${err.name} : ${err.message}`);
  server.close(() => process.exit(1)); // sclosing server, shutdown application;
});

process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVED. Shutting down gracefully! 😊");

  server.close(() => {
    console.log(" 😊Process terminated!");
  });
});
