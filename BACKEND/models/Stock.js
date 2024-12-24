// Initiate mongoose
const mongoose = require('mongoose');

// Create a schema
const Schema = mongoose.Schema;

// Create a schema for stock management
const stockSchema = new Schema({

    // Define the properties of the stocks

    

    itemName: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    subCategory: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    unitPrice: {
        type: Number,
        required: true
    },

    expiryDate: {
        type: String,
        required: true
    },

   

    supplierName: {
        type: String,
        required: true
    },

    contactNumber: {
        type: String,
        required: true
    },

    

});

// Create a model for stock
const Stock = mongoose.model("Stock", stockSchema);

// Export the model - if not exported then it will not be accessible in other files
module.exports = Stock;
