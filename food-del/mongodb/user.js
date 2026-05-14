const { getDB } = require('./connection');

const COLLECTION_NAME = 'users';

async function insertUser(user) {
  const db = getDB();
  const users = db.collection(COLLECTION_NAME);
  return users.insertOne(user);
}

module.exports = {
  insertUser,
};
