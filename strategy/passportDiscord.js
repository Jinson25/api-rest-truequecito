const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;
const User = require("../models/User");
const { DISCORD_CALLBACK_URL } = require('../constants/url.passport');

const configureDiscordPassport = () => {
  passport.use(
    new DiscordStrategy(
      {
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: DISCORD_CALLBACK_URL,
        scope: ['identify', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.email });

          if (user) {
            // Si el usuario ya existe, actualiza el identificador de Discord si no está presente
            user.providerId = profile.id;
            user.provider = 'discord';
            user.username = profile.username;
            user.avatar = profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null;
            await user.save();
            return done(null, user);
          } else {
            // Si el usuario no existe, crea uno nuevo
            user = new User({
              providerId: profile.id,
              provider: 'discord',
              username: profile.username,
              email: profile.email ? profile.email : 'no-email@discord.com', // el correo podría no estar disponible
              avatar: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null,
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

module.exports = configureDiscordPassport;
