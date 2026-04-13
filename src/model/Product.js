const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
    },
    shortDescription: {
        type: String,
    },
    image: {
        type: String,
        required: true
    },
    gallery: [{
        type: String
    }],
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String
    },
    brand: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    sku: {
        type: String,
        unique: true,
        sparse: true
    },
    lowStockThreshold: {
        type: Number,
        default: 5
    },
    trackQuantity: {
        type: Boolean,
        default: true
    },
    weight: {
        type: Number
    },
    dimensions: {
        length: Number,
        width: Number,
        height: Number
    },
    requiresShipping: {
        type: Boolean,
        default: true
    },
    seoTitle: {
        type: String
    },
    seoDescription: {
        type: String
    },
    slug: {
        type: String,
        unique: true,
        sparse: true
    },
    youtubeLink: {
        type: String
    },
    status: {
        type: String,
        enum: ["Draft", "Active", "Archived"],
        default: "Draft"
    },
    visibility: {
        type: String,
        enum: ["Public", "Private", "Password Protected"],
        default: "Public"
    },
    attributes: {
        size: { type: Boolean, default: false },
        color: { type: Boolean, default: false },
        material: { type: Boolean, default: false }
    },
    variations: [{
        size: String,
        color: String,
        material: String,
        price: Number,
        stock: Number,
        sku: String
    }],
    specs: [{
        key: String,
        value: String
    }],
    tags: [String],
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);