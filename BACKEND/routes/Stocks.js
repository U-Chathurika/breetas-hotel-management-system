// Initialize express router 
const router = require('express').Router();

// Import the stock model
const Stock = require('../models/Stock');

// Import multer for file uploads
const multer = require('multer');
const path = require('path');

// Create - Insert data - POST
// http://localhost:8070/stocks/add
router.route('/add').post((req, res) => {
    const { itemName, category, subCategory, quantity, unitPrice, supplierName, contactNumber, expiryDate } = req.body;

    // Create a new stock object
    const newStock = new Stock({
        itemName,
        category,
        subCategory,
        quantity,
        unitPrice,
        supplierName,
        contactNumber,
        expiryDate
    });

    // Save data in the database
    newStock.save()
        .then(() => res.json("Stock Item Added!"))
        .catch(err => {
            console.log(err);
            res.status(500).send({ status: "Error adding stock item", error: err.message });
        });
});

// Read - Get data - GET
// http://localhost:8070/stocks/
router.route('/').get((req, res) => {
    // Find all stock items
    Stock.find()
        .then(stock => res.json(stock))
        .catch(err => {
            console.log(err);
            res.status(500).send({ status: "Error fetching stock items", error: err.message });
        });
});

// Update - Update data - PUT
// http://localhost:8070/stocks/update/itemID
router.route('/update/:itemID').put(async (req, res) => {
    // Get the itemID from the URL
    let itemID = req.params.itemID;

    // Fetch the data from the body
    const { itemName, category, subCategory, quantity, unitPrice, supplierName, contactNumber, expiryDate } = req.body;

    // Create a new stock object
    const updateStock = {
        itemName,
        category,
        subCategory,
        quantity,
        unitPrice,
        supplierName,
        contactNumber,
        expiryDate
    };

    // Update the stock item
    try {
        await Stock.findByIdAndUpdate(itemID, updateStock);
        res.status(200).send({ status: "Stock Item Updated!" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with updating stock item", error: err.message });
    }
});

// Delete - Delete data - DELETE
// http://localhost:8070/stocks/delete/itemID
router.route('/delete/:itemID').delete(async (req, res) => {
    // Get the itemID from the URL
    let itemID = req.params.itemID;

    // Delete the stock item
    try {
        await Stock.findByIdAndDelete(itemID);
        res.status(200).send({ status: "Stock Item Deleted!" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ status: "Error with deleting stock item", error: err.message });
    }
});

// Get a specific stock item - GET
// http://localhost:8070/stocks/get/:itemID
router.route('/get/:itemID').get(async (req, res) => {
    // Get the itemID from the URL
    const itemID = req.params.itemID;

    // Fetch the data from the database
    try {
        const stock = await Stock.findById(itemID);
        res.status(200).send({ status: "Stock Item Fetched!", stock: stock });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ status: "Error with fetching stock item", error: err.message });
    }
});

// Get report data - GET
// http://localhost:8070/stocks/reports
router.route('/reports').get(async (req, res) => {
    try {
        // Find items with quantity less than 10
        const lowStockItems = await Stock.find({ quantity: { $lt: 10 } });
        res.status(200).json(lowStockItems);
    } catch (error) {
        console.error('Failed to fetch report data:', error);
        res.status(500).send({ status: "Error fetching report data", error: error.message });
    }
});



// File upload route

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the folder for image uploads
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append current time to image file name
    }
});

// File filter for only image files
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Initialize multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

// POST route for uploading images
router.post('/:id/images', upload.array('image', 4), async (req, res) => {
    try {
        const stockId = req.params.id;
        const stock = await Stock.findById(stockId);

        if (!stock) {
            return res.status(404).send({ status: 'Stock item not found' });
        }

        // Save file paths in stock item
        const imagePaths = req.files.map(file => file.path);
        stock.images = imagePaths; // Assuming your Stock schema has an 'images' field (Array)

        await stock.save();
        res.status(200).send({ status: 'Images uploaded successfully!' });
    } catch (err) {
        res.status(500).send({ status: 'Error uploading images', error: err.message });
    }
});









// Export the module
module.exports = router;
