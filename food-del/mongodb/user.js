const { getDB } = require('./connection');

const COLLECTION_NAME = 'users';

async function insertUser(user) {
  const db = getDB();
  const users = db.collection(COLLECTION_NAME);
  return users.insertOne(user);
}

async function findUserByEmail(email) {
  const db = getDB();
  const users = db.collection(COLLECTION_NAME);
  return users.findOne({ email });
}

module.exports = {
  insertUser,
  findUserByEmail,
  userCollection: COLLECTION_NAME
};
