const mongoose = require('mongoose');
const dns = require("dns")

const connectDB = async () => {
  dns.setServers(['8.8.8.8', '1.1.1.1'])
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
