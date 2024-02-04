const { MongoClient, ObjectId } = require('mongodb');
const url = process.env.DB_URL;
const client = new MongoClient(url);
const dbName = process.env.DB_NAME;

client.connect();

const db = client.db(dbName);

module.exports = {
    db,
    ObjectId
};