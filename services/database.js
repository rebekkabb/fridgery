const mongo = require('mongodb').MongoClient;
const mongo_url = process.env.MONGO_URL;
let db = null;

exports.connectDatabase = (callback) => {
    mongo.connect(mongo_url, {
        useNewUrlParser: true,
    }, (err, client) => {
        if (err) throw err;
        db = client.db();
        db.createCollection("fridges");
        db.createCollection("users");
        db.createCollection("items");
        db.createCollection("fridgeUsers");
        db.createCollection("fridge");
        callback();
    });
};

exports.db = () => {
    return db;
};