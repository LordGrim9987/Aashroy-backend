require("dotenv").config();

const express = require("express");
const cors = require("cors"); //for development use only

const app = express();

app.use(express.json({ limit: "20mb" }));
app.use(cors());
const cookieParser = require("cookie-parser");
require("./database/dbConnect").connect();
require("./database/blobStore").config();

app.use(cookieParser());
const mung = require("express-mung");
app.use(
  mung.json(function authTransforms(body, req, res) {
    if (req.access_token) {
      body = { ...body, access_token: req.access_token };
    }
    return body;
  })
);

app.use("/", express.static("public"));

//routes
app.use("/auth/generaluser/", require("./routes/auth/generalUserAuth"));
app.use("/auth/ngo/", require("./routes/auth/ngoAuth"));
app.use("/ngo/details/", require("./routes/ngo/ngoDetails"));
app.use("/ngo/public/", require("./routes/ngo/ngoPublic"));
//

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server is running at port", PORT));
