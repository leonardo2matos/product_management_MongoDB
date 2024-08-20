const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('./middlewares/authMiddleware');

// Proteger rotas com autenticação
router.post('/', authMiddleware, async (req, res) => {
    // Rota protegida para adicionar produtos
});

// Adicionar produto
router.post('/', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Devolver todos os produtos
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Devolver um produto específico
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Produto não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Atualizar um produto
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Produto não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Remover um produto pelo ID
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (product) {
            res.status(200).json({ message: 'Produto removido' });
        } else {
            res.status(404).json({ message: 'Produto não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Devolver a média do rating de todos os produtos
router.get('/rating/average', async (req, res) => {
    try {
        const averageRating = await Product.aggregate([
            { $group: { _id: null, avgRating: { $avg: "$rating" } } }
        ]);
        res.status(200).json({ averageRating: averageRating[0].avgRating });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Devolver todos os produtos cujo preço seja maior que um determinado valor
router.get('/price/greater-than/:price', async (req, res) => {
    try {
        const products = await Product.find({ price: { $gt: req.params.price } });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Devolver todos os produtos que tenham uma determinada marca e cujo preço seja superior a X
router.get('/brand/:brand/price/greater-than/:price', async (req, res) => {
    try {
        const products = await Product.find({ brand: req.params.brand, price: { $gt: req.params.price } });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Devolver todos os produtos que tenham uma determinada marca
router.get('/brand/:brand', async (req, res) => {
    try {
        const products = await Product.find({ brand: req.params.brand });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Devolver todos os produtos ordenados por rating (decrescente)
router.get('/rating/desc', async (req, res) => {
    try {
        const products = await Product.find().sort({ rating: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Devolver o número de produtos registados
router.get('/count', async (req, res) => {
    try {
        const count = await Product.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Devolver todos os produtos que tenham imagens
router.get('/with-pictures', async (req, res) => {
    try {
        const products = await Product.find({ pictures: { $exists: true, $ne: [] } });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rota para devolver todos os produtos com paginação
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const products = await Product.find().skip(skip).limit(limit);
        const total = await Product.countDocuments();

        res.status(200).json({
            products,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
