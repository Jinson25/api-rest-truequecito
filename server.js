const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const configurePassport = require('./config/passport');
const generateToken = require('./utils/token');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Configuración de express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
configurePassport();

// Importar las rutas
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const exchangeRoutes = require('./routes/exchangeRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require('./routes/userRoutes');

// Usar las rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', uploadRoutes);
app.use('/api/user', userRoutes);

// Ruta de callback de Google directamente en el servidor principal (opcional)
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Suponiendo que generateToken(req.user._id) genera el token necesario
    const token = generateToken(req.user._id);
    const frontendURL = process.env.FRONTEND_URL; // Cambia esto por la URL de tu frontend en producción

    // Crear la URL de redirección con el token y otros datos del usuario como parámetros
    const redirectURL = `${frontendURL}/?token=${token}&id=${req.user._id}&email=${req.user.email}&username=${encodeURIComponent(req.user.username)}&avatar=${encodeURIComponent(req.user.avatar)}`;

    // Redirigir al usuario al frontend con los datos como parámetros de la URL
    res.redirect(redirectURL);
});

// Ruta de callback de Discord directamente en el servidor principal (opcional)
app.get('/auth/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/login' }),
  (req, res) => {
    // Suponiendo que generateToken(req.user._id) genera el token necesario
    const token = generateToken(req.user._id);
    const frontendURL = process.env.FRONTEND_URL; // Cambia esto por la URL de tu frontend en producción

    // Crear la URL de redirección con el token y otros datos del usuario como parámetros
    const redirectURL = `${frontendURL}/?token=${token}&id=${req.user._id}&email=${req.user.email}&username=${encodeURIComponent(req.user.username)}&avatar=${encodeURIComponent(req.user.avatar)}`;

    // Redirigir al usuario al frontend con los datos como parámetros de la URL
    res.redirect(redirectURL);
});

const PORT = process.env.PORT || 8090;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
