const mongo = require('mongodb').MongoClient;
const mongo_url = process.env.MONGO_URL;
let db = null;

exports.connectDatabase = (callback) => {
    mongo.connect(mongo_url, {
        useNewUrlParser: true,
    }, (err, client) => {
        if (err) throw err;
        db = client.db();
        callback();
    });
};

exports.db = () => {
    return db;
};