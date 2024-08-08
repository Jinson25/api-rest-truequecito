const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const configurePassport = require('./config/passport');
const generateToken = require('./utils/token');
const path = require('path'); // Importa el módulo path

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

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
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('../backend/admin/routes/admin.routes');

// Usar las rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', uploadRoutes);
app.use('/api/user', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ruta de callback de Google directamente en el servidor principal (opcional)
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user._id);
    const frontendURL = process.env.FRONTEND_URL;

    const redirectURL = `${frontendURL}/?token=${token}&id=${req.user._id}&email=${req.user.email}&username=${encodeURIComponent(req.user.username)}&avatar=${encodeURIComponent(req.user.avatar)}`;

    res.redirect(redirectURL);
});

// Ruta de callback de Discord directamente en el servidor principal (opcional)
app.get('/auth/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user._id);
    const frontendURL = process.env.FRONTEND_URL;

    const redirectURL = `${frontendURL}/?token=${token}&id=${req.user._id}&email=${req.user.email}&username=${encodeURIComponent(req.user.username)}&avatar=${encodeURIComponent(req.user.avatar)}`;

    res.redirect(redirectURL);
});

const PORT = process.env.PORT || 8090;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
