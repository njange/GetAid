const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const healthRouter = require("./routes/health");
const authRouter = require("./routes/auth");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();

const clientOrigin = process.env.CLIENT_ORIGIN;

app.use(
  cors({
    origin: clientOrigin || /^http:\/\/localhost:\d+$/,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(healthRouter);
app.use(authRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
