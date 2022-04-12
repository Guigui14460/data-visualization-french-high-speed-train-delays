const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
const assert = require('assert');

// Connection URL
const url = 'mongodb://root:example@mongodb:27017';
//const url = 'mongodb://root:example@127.0.0.1:27017';
//const url = 'mongodb://root:example@172.18.0.2:27017';

// Database Name
const dbName = 'DM';

// Create a new MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true });

const findDocuments = function (db, col, query, callback) {
    // Get the documents collection
    const collection = db.collection(col);
    // Find some documents
    collection.find(query).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}

const findOneDocument = function (db, col, query, callback) {
    // Get the documents collection
    const collection = db.collection(col);
    // Find some documents
    collection.findOne(query, function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}

client.connect(function (err) {
    assert.equal(err, null);
    console.log("Connected correctly to the MongoDB server");
});

const resolvers = {
    Query: {
        train(root, args, context) {
            return new Promise((resolve, reject) => {
                const db = client.db(dbName);
                const o = new Object
                
                if (typeof args.Depart != 'undefined') {
                    o.Depart = args.Depart
                }
                if (typeof args.Arrive != 'undefined') {
                    o.Arrive = args.Arrive
                }
                if (typeof args.Annees != 'undefined') {
                    o.Annees = args.Annees
                }
                if (typeof args.Mois != 'undefined') {
                    o.Mois = args.Mois
                }
                
                findDocuments(db, 'train', o, resolve);
            }).then(result => {
                return result
            });
        },
        gare(root, args, context) {
            return new Promise((resolve, reject) => {
                const db = client.db(dbName);
                const o = new Object
                
                if (typeof args.name != 'undefined') {
                    o.name = args.name
                }
                if (typeof args.city != 'undefined') {
                    o.city = args.city
                }
                if (typeof args.station != 'undefined') {
                    o.station = args.station
                }

                findDocuments(db, 'gare', o, resolve);
            }).then(result => {
                return result
            });
        },
        stations(root, args, context) {
            return new Promise((resolve, reject) => {
                const db = client.db(dbName);
                
                findDocuments(db, "stations", {}, resolve);
            }).then(result => {
                return result;
            });
        },
        stationByLineCode(root, args, context) {
            return new Promise((resolve, reject) => {
                const db = client.db(dbName);
                findDocuments(db, "stations", {line_code: args.line_code}, resolve);
            }).then(result => {
                return result;
            });
        },
        lines(root, args, context) {
            return new Promise((resolve, reject) => {
                const db = client.db(dbName);
                findDocuments(db, "lines", {}, resolve);
            }).then(result => {
                return result;
            });
        },
        lineCodesByStationCode(root, args, context) {
            return new Promise((resolve, reject) => {
                const db = client.db(dbName);
                findDocuments(db, "stations", {uic_code: args.uic_code}, resolve);
            }).then(result => {
                return result;
            });
        },
    }
};

// on exporte la définition de 'resolvers'
module.exports = resolvers;
