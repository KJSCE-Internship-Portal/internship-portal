const express = require("express");
const mongoose = require("mongoose");

const connectDB = async (req, res) => {
  try {
    console.log("Trying to connect to MongoDB...".green);
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URL);

    console.log("Connected to the database Successfully".green.bold);
  } catch (error) {
    console.log(`Error : ${error.message}`.red.underline);
  }
};

module.exports = connectDB;
