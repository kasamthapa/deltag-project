const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  try {
    await mongoose.connect(MONGO_URL);

    // Move the initialization function here
    await initDB();

    console.log("connected to DB");
  } catch (err) {
    console.error(err);
  }
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});

    const ownerId = "6582f8181a0449f2f1960bc0";

    const listingsToInsert = initData.data.map((listing) => {
      const imageUrl = listing.image.url;
      const imageFilename = listing.image.filename; // Add this line to get the filename
      return {
        ...listing,
        image: {
          filename: imageFilename,
          url: imageUrl,
          
        },
        owner: ownerId,
      };
    });

    await Listing.insertMany(listingsToInsert);
    console.log("data was initialized");
  } catch (err) {
    console.error("Error initializing data:", err);
  }
};


main();
