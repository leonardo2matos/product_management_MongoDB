const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('server/routes/productRoutes');
const productRoutes = require('./server/routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB Atlas
const mongoURI = 'your_mongodb_atlas_connection_string';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log('Conectado ao MongoDB Atlas'))
    .catch(error => console.error('Erro ao conectar ao MongoDB Atlas:', error.message));

// Rotas
app.use('/products', productRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
