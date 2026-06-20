const { MongoClient } = require('mongodb');

// Connection URL
const url = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = process.env.DB_NAME || 'FOOD_ITEMS';

let db;

async function connectDB() {
  if (!db) {
    try {
      await client.connect();
      console.log('Connected successfully to MongoDB');
      db = client.db(dbName);
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }
  return db;
}

function getDB() {
  if (!db) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return db;
}

module.exports = {
  connectDB,
  getDB
};