const express = require('express');
const cors = require('cors');
const productoRoute = require('./routes/productoRoute'); 
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();

// 1. Middlewares globales (SIEMPRE VAN PRIMERO)
app.use(cors());
app.use(express.json()); // <--- ESTO ES VITAL PARA LEER EL BODY

// 2. Definición de Prefijos de Rutas
app.use('/api/auth', authRoutes);   
app.use('/api/productos', productoRoute); 

// 3. Puerto y Arranque
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servicio arriba en puerto ${PORT}`));