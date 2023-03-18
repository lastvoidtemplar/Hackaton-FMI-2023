require('dotenv').config()
const { MongoClient } = require("mongodb");
const MONGO_URL = process.env.MONGO_URL;
console.log('Create a connection');

const client = new MongoClient(MONGO_URL);


const database = client.db('Spotify');

module.exports = database;