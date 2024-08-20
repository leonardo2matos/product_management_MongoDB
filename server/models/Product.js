const mongoose = require('mongoose');

const specsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, required: true },
    optionDescription: { type: String }
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    model: { type: String, required: true },
    brand: { type: String, required: true },
    pictures: [String],
    specs: [specsSchema],
    rating: Number
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
