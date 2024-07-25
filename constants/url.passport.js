const urlBackend = 'https://api-rest-truequecito.onrender.com/auth/google/callback';
const urlFrontend = 'https://truequecito.vercel.app';

exports.FRONTEND_URL = urlFrontend;
exports.URL_BACKEND = urlBackend;

exports.GOOGLE_CALLBACK_URL = `${urlBackend}/auth/google/callback`;
exports.FACEBOOK_CALLBACK_URL = `${urlBackend}/auth/facebook/callback`;
exports.DISCORD_CALLBACK_URL = `${urlBackend}/auth/discord/callback`;
