const express = require("express");
const cors = require("cors");
const healthRouter = require("./routes/health");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();

const clientOrigin = process.env.CLIENT_ORIGIN;

app.use(
  cors({
    origin: clientOrigin || /^http:\/\/localhost:\d+$/,
  })
);
app.use(express.json());

app.use(healthRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
