const mongoose = require("mongoose");
const dotenv = require("dotenv"); 
const path = require("path");
const app = require("./app");


process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
})

dotenv.config({ path: path.resolve(__dirname, "../config.env") });


const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}....`);
  });
  
const DB = process.env.DATABASE;


mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connection successful!"));


process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    server.close(() => {
    process.exit(1);
    });
});


process.on("SIGTERM", () => {
    console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
    server.close(() => {
      console.log("💥 Process terminated!");
    });
  });

