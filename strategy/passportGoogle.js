const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const { GOOGLE_CALLBACK_URL } = require('../constants/url.passport');

const configureGooglePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // Si el usuario ya existe, actualiza el identificador de Google si no está presente
            user.providerId = profile.id;
            user.provider = 'google';
            user.username = profile.displayName;
            user.avatar = profile.photos[0].value;
            await user.save();
            return done(null, user);
          } else {
            // Si el usuario no existe, crea uno nuevo
            user = new User({
              providerId: profile.id,
              provider: 'google',
              username: profile.displayName,
              email: profile.emails[0].value,
              avatar: profile.photos[0].value,
            });
            await user.save();
            return done(null, user);
          }
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};

module.exports = configureGooglePassport;
