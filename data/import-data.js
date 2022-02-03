const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config({ path: `${__dirname}/../config.env` });

const mongoose = require("mongoose");
const productModel = require("../models/productModel");
const potsModel = require("../models/potsModel");
const allProductModel = require("../models/allProductsModel");

const DB = process.env.DATABASE.replace("<password>", process.env.DATABASE_PASSWORD);
mongoose.connect(DB);

const products = JSON.parse(fs.readFileSync(`${__dirname}/plants.json`));
const pots = JSON.parse(fs.readFileSync(`${__dirname}/pots.json`));
const allProducts = JSON.parse(fs.readFileSync(`${__dirname}/all-data.json`));

const importData = async function () {
  try {
    // await productModel.create(products, { validateBeforeSave: true });
    // await potsModel.create(pots, { validateBeforeSave: true });
    await allProductModel.create(allProducts, { validateBeforeSave: true });

    console.log("Data uploaded successfully!");
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

const deleteData = async function () {
  try {
    await allProductModel.deleteMany();
    console.log("Data deleted successfully!");
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

if (process.argv[2] === "--import") importData();
if (process.argv[2] === "--delete") deleteData();
