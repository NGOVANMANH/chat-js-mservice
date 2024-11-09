const mongoose = require("mongoose");

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";

const connect = () => {
  if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }

  return mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("Successfully connected to MongoDB");
    })
    .catch((error) => {
      throw error;
    });
};

module.exports = { connect };
