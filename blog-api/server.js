require("module-alias/register");
require("dotenv").config();
const express = require("express");
const path = require("path");

const apiRoute = require("@/routes/api");
const webRoute = require("@/routes/web");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const notFoundHandler = require("@/middlewares/notFoundHandler");
const errorsHandler = require("@/middlewares/errorHandler");
const handlePagination = require("@/middlewares/handlePagination");
const { sequelize } = require("./src/models");
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const app = express();

//Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.use(handlePagination);

async function sendDb() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

sendDb();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", webRoute);
app.use("/api/v1", apiRoute);

//Error Handler
app.use(notFoundHandler);
app.use(errorsHandler);

app.listen(3000, () => {
  console.log("App running");
});

// dùng faker tạo các bài post ảo
// crud postb
// comment
// setting
// chat
// validator backend auth
// realtime comment post
// thông báo auth
// thông báo realtime từ comment, post ..
