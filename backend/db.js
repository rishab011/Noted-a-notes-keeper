require('dotenv').config(); // Ensure this line is present at the top of the file

const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI;

const connectToMongo = async () => {
  if (!mongoURI) {
    console.error("MONGO_URI is not defined in the environment variables");
    return;
  }

  await mongoose.connect(mongoURI)
    .then(() => console.log("Connected to Mongo Successfully"))
    .catch(err => console.log(err));
};

module.exports = connectToMongo;
