const configureGooglePassport = require("../strategy/passportGoogle");
const configureDiscordPassport = require("../strategy/passportDiscord");

const configurePassport = () => {
  configureGooglePassport();
  configureDiscordPassport();
};

module.exports = configurePassport;
