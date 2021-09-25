require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors"); //for development use only
const path = require("path");

const app = express();

// for logs
app.use(morgan("combined"));

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

app.use(express.static(path.join(__dirname, "public")));

//routes
app.use("/api/auth/generaluser/", require("./routes/auth/generalUserAuth"));
app.use("/api/auth/ngo/", require("./routes/auth/ngoAuth"));

// general user routes
app.use("/api/general-user", require("./routes/general-user/generalUser"));
app.use(
  "/api/general-user/report-homeless",
  require("./routes/general-user/reportHomeless")
);
app.use(
  "/api/general-user/donation",
  require("./routes/general-user/donation")
);

// crime report routes
app.use("/api/crime-report", require("./routes/crime-report/crimeReport"));

// ngo routes
app.use("/api/ngo/details/", require("./routes/ngo/ngoDetails"));
app.use("/api/ngo/public/", require("./routes/ngo/ngoPublic"));
app.use("/api/ngo/donation", require("./routes/ngo/ngoDonations"));

// donation board
app.use(
  "/api/donation-board",
  require("./routes/donation-board/donationBoard")
);
//

app.use("/api/homeless/data/", require("./routes/homeless/homeless"));
app.use("/api/crime/data/", require("./routes/crime-report/crimeData"));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname + "/public/index.html"));
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(">> Server is running at port", PORT));
