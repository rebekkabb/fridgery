const mongo = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/fridgely";
let db = null;

exports.connectDatabase = (callback) => {
    mongo.connect(url, { useNewUrlParser: true }, (err, client) => {
        db = client.db('fridgely');
        callback();
    });
};

exports.db = () => {
    return db;
};