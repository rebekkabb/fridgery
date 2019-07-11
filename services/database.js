const mongo = require('mongodb').MongoClient;
const mongo_url = process.env.MONGO_URL;
const mongo_user = process.env.MONGO_USER;
const mongo_password = process.env.MONGO_PASSWORD;
let db = null;

exports.connectDatabase = (callback) => {
    mongo.connect(mongo_url, {
        useNewUrlParser: true,
        auth: {
            user: mongo_user,
            password: mongo_password
        }
    }, (err, client) => {
        db = client.db('fridgely');
        callback();
    });
};

exports.db = () => {
    return db;
};