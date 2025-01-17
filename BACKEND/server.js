const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

// Set the port number
const PORT = process.env.PORT || 8070;

// Use the cors
app.use(cors());
app.use(bodyParser.json());

// Connect to the MongoDB
const URL = process.env.MONGODB_URL;
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Check the connection
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("Mongodb Connection success!");
})

// Import the stockRouter
const stockRouter = require("./routes/Stocks.js");
// Use the stockRouter
app.use("/stocks", stockRouter);

// Listen to the port
app.listen(PORT, () => {
    console.log(`Server is up and running on port number: ${PORT}`);
});
