const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de Usuario
const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verificar si el usuario ya existe
        const userExist = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        
        if (userExist.rows.length > 0) {
            return res.status(400).json({ msg: "El usuario ya existe" });
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insertar en la base de datos
        const newUser = await pool.query(
            'INSERT INTO usuarios (email, password) VALUES ($1, $2) RETURNING id, email, rol',
            [email, passwordHash]
        );

        res.status(201).json({
            msg: "Usuario registrado con éxito",
            user: newUser.rows[0]
        });

    } catch (error) {
        console.error("Error en Register:", error);
        res.status(500).json({ error: "Error en el servidor al registrar" });
    }
};

// Login de Usuario
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(400).json({ msg: "Credenciales inválidas" });
        }

        const usuario = result.rows[0];
        const isMatch = await bcrypt.compare(password, usuario.password);

        if (!isMatch) {
            return res.status(400).json({ msg: "Credenciales inválidas" });
        }

        // Generar Token JWT (Corregido: usuario.id)
        const payload = { 
            id: usuario.id, 
            rol: usuario.rol,
            email: usuario.email
        };

        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET || 'contrasena_ultra_secreta', 
            { expiresIn: '8h' }
        );

        res.json({ 
            msg: "Bienvenido",
            token: token 
        });

    } catch (error) {
        console.error("Error en Login:", error);
        res.status(500).json({ error: "Error en el servidor al loguear" });
    }
};

module.exports = { register, login };