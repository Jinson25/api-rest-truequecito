const urlBackend = 'http://localhost:5000';
const urlFrontend = 'http://localhost:4200';

exports.FRONTEND_URL = urlFrontend;
exports.URL_BACKEND = urlBackend;

exports.GOOGLE_CALLBACK_URL = `${urlBackend}/auth/google/callback`;
exports.FACEBOOK_CALLBACK_URL = `${urlBackend}/auth/facebook/callback`;
exports.DISCORD_CALLBACK_URL = `${urlBackend}/auth/discord/callback`;
