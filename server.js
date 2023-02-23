"use strict";
//imports
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT;

app.get("/productsapi", productsHandler);
app.get("/productsDB", databaseHandler);
app.get("/productsDB/:id", databaseIDHandler);
app.post("/product", addDatabaseHandler);

mongoose.connect("mongodb://127.0.0.1:27017/makeup");

//collection
//schema
const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  price: String,
  imageUrl: String,
  description: String,
});

const productModel = mongoose.model("product", productSchema); //collection called products

// function populateProductCollection() {
//   const lipstick = new productModel({
//     name: "lipstick",
//     brand: "Maybel",
//     price: "£1",
//     imageUrl: "test",
//     description: "t swift red",
//   });
//   const eyeliner = new productModel({
//     name: "EMO BLACK",
//     brand: "Maybel",
//     price: "£2",
//     imageUrl: "testiyo",
//     description: "when i was a young boy",
//   });
//   const concealer = new productModel({
//     name: "tired eyes",
//     brand: "Maybel",
//     price: "£1000000",
//     imageUrl: "another test",
//     description: "carrying baggage",
//   });
//   lipstick.save();
//   eyeliner.save();
//   concealer.save();
// }

// populateProductCollection();

async function productsHandler(req, res) {
  try {
    const productsListRes = await axios.get(
      "https://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline"
    );
    const productsList = productsListRes.data;
    res.status(200).send(productsList);
  } catch (err) {
    res.status(500).send("something went wrong");
  }
}

//1. localhost:3001/makeup

async function databaseHandler(req, res) {
  let makeupData = await productModel.find({});
  res.send(makeupData);
}
async function databaseIDHandler(req, res) {
  const id = req.params.id;
  const product = await productModel.findById(id);
  res.send(product);
}

async function addDatabaseHandler(req, res) {
  console.log(req.body);

  const nameInput = req.body.name;
  const brandInput = req.body.brand;
  const priceInput = req.body.price;
  const imageUrlInput = req.body.imageUrl;
  const descriptionInput = req.body.description;

  let newMakeup = await productModel.create({
    name: nameInput,
    brand: brandInput,
    price: priceInput,
    imageUrl: imageUrlInput,
    description: descriptionInput,
  });
  res.send(newMakeup);
}

app.listen(PORT, () => {
  console.log(`listening listening on ${PORT} :)`);
});
