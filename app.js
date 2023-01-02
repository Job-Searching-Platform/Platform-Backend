const express = require("express");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");


// Additional utils
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");



// 1) INIT FUNCTIONS
const app = express();

app.enable("trust proxy");

// Swagger Doc
app.use("/", swaggerUI.serve);
app.get("/", swaggerUI.setup(swaggerDocument));


// 2) BADY PARSERS
app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(compression());




// 3) ROUTES
// app.use("/admin", adminRouter);





app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });


app.use(globalErrorHandler);

module.exports = app;