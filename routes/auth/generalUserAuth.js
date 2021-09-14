const router = require("express").Router();
const { OAuth2Client } = require("google-auth-library");
const GENERAL_USER = require("../../database/models/general_user");
const { generateJWT } = require("../../utils/Authorize");
const crypto = require("crypto");
const SESSIONS = require("../../database/models/sessions");
const Roles = require("../../database/roles");

const OAuth2ClientEndPoint =
  "383681632751-r91i8q9ca65mlqtv9grtfirs7k8lfjjo.apps.googleusercontent.com";

const client = new OAuth2Client(OAuth2ClientEndPoint);

router.post("/", (req, res) => {
  const { tokenId } = req.body;
  client
    .verifyIdToken({
      idToken: tokenId,
      audience: OAuth2ClientEndPoint,
    })
    .then(async (response) => {
      const { email_verified, name, email, picture } = response.payload;
      if (!email_verified) {
        return res.status(404).json({});
      }
      try {
        const user = await GENERAL_USER.findOne({ email });
        if (!user) {
          // new user
          const newUser = await GENERAL_USER.create({
            email,
            name,
            profile_pic: picture,
          });
          const access_token = await generateJWT({
            user_id: newUser._id,
          });
          //create a new refresh token and send it
          const refresh_token = crypto.randomBytes(64).toString("hex");
          await SESSIONS.create({
            user_id: newUser._id,
            refresh_token,
            role: Roles.GENERAL_USER,
          });

          return res
            .status(200)
            .json({ access_token, userData: newUser, refresh_token });
        }
        //user already exist
        const access_token = await generateJWT({
          user_id: user._id,
        });
        const refresh_token = crypto.randomBytes(64).toString("hex");
        //create a new refresh token by overriding the old one if exist or creating if not
        await SESSIONS.updateOne(
          { user_id: user._id },
          {
            user_id: user._id,
            refresh_token: refresh_token,
            role: Roles.GENERAL_USER,
          },
          { upsert: true }
        );

        return res
          .status(200)
          .json({ access_token, userData: user, refresh_token });
      } catch (error) {
        res.status(500).json({});
      }
    });
});

module.exports = router;
