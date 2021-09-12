const jwt = require("jsonwebtoken");
const SESSIONS = require("../database/models/sessions");

const generateJWT = async (tokenData) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        ...tokenData,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

//FORMAT OF TOKEN
//Authorization: Bearer <access_token> <refreshed_token>

const authenticateToken = async (req, res, next) => {
  //v2
  //get auth header value
  const bearerHeader = req.headers["authorization"];
  // check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    //split at the space
    const bearer = bearerHeader.split(" ");
    //get token from array
    const bearerToken = bearer[1];
    const bearerRefreshToken = bearer[2];
    //set token
    req.token = bearerToken;
    //next middleware
    jwt.verify(
      req.token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, authData) => {
        if (err) {
          //use refresh token
          const session = await SESSIONS.findOne({
            refresh_token: bearerRefreshToken,
          });
          if (!session) {
            return res.sendStatus(404);
          }
          // create new access_token
          const access_token = await generateJWT({
            _id: session.user_id,
          });
          req.access_token = access_token;
          req.body.authData = { user_id: session.user_id };
          next();
        } else {
          req.body.authData = authData;
          next();
        }
      }
    );
  } else {
    console.log("Request Blocked -> IP: ", req.connection.remoteAddress);
    console.log(
      "Request Blocked -> IP: ",
      req.headers["x-forwarded-for"],
      " (if server behind proxy)"
    );
    res.sendStatus(403);
  }
};

module.exports = { generateJWT, authenticateToken };
