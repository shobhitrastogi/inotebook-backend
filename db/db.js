const mongoose = require('mongoose');
const dotenv = require('dotenv'); 
dotenv.config()
const url= process.env.MONGODB_URL
const mongoUri =`${url}` ; 

const connectToMongo = () => {
  mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Connected to MongoDB successfully");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};

module.exports = connectToMongo;
