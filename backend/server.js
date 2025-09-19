const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const multer = require('multer');
require('dotenv').config();
const stripe = require('stripe')('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');

const app = express();
const port = process.env.PORT || 5001;
const backendUrl = process.env.BACKEND_URL;

// Middleware CORS para permitir peticiones de tu frontend
app.use(cors({
    origin: 'https://detodounpoco-1.onrender.com'
}));

// Middleware para procesar JSON solo en rutas que no son el webhook
app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});
app.use('/uploads', express.static('uploads'));

const uri = process.env.MONGODB_URI;
// Agrega los parámetros TLS directamente a la URL de conexión
const mongoURI = `${uri}&tls=true&tlsInsecure=true`;

const client = new MongoClient(mongoURI);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Conectado a MongoDB Atlas");
  } catch (err) {
    console.error("Error al conectar a MongoDB:", err);
    process.exit(1);
  }
}

connectToDatabase();

const db = client.db('detodounpoco');
const productsCollection = db.collection('products');
const usersCollection = db.collection('users');

app.get('/', (req, res) => {
  res.send('El servidor backend de DeTodoUnPoco está en funcionamiento.');
});

// Rutas de la API
// ... (resto de tus rutas aquí)

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto: ${port}`);
});