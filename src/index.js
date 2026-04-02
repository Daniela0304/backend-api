const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const productoRoute = require('./routes/productoRoute');
require('dotenv').config();

const app = express();

// 1. Middlewares (Debe ir antes de las rutas)
app.use(cors());
app.use(express.json()); 

// 2. Rutas
app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoute);

// 3. Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en: https://backend-api-ygb1.onrender.com`);
    console.log(`📡 Puerto local: ${PORT}`);
});