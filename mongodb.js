
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

//const id = new ObjectID();
//console.log(id);

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if(error) {
        return console.log('unable to coonect to database');
    }

    const db = client.db(databaseName);

    // const updatePromise = db.collection('users').updateOne({
    //     _id: new ObjectID("5d2675a5ce4b1a0ca462e823")
    // },{
    //     $set: {
    //         name: "ManuelUpdated"
    //     }
    // })
//update where values = 33 set to 30
    // const updatePromise = db.collection('users').updateMany({
    //     age: 33
    // }, {
    //     $set: {
    //         age: 30
    //     }
    // });

    // const updatePromise = db.collection('users').deleteMany({
    //     age: 25
    // });
    const updatePromise = db.collection('users').deleteOne({
        name: 'Jen'
    });

    updatePromise.then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    })
    // db.collection('users').findOne({_id: new ObjectID("5d27a60a10152b137ea38516")}, (error, user)=> {
    //     if(error) {
    //         return console.log('unable to fetch user');          
    //     }
    //     console.log(user);
    // });

    // db.collection('users').find({age: 34}).toArray((error, users) => {
    //     console.log(users);
    // });

    // db.collection('users').find({age: 34}).count((error, count) => {
    //     console.log(count);
    // });

    // db.collection('users').insertOne({
    //     _id: id,
    //     name: 'Alberto',
    //     age: 30
    // }, (error, result) => { 
    //     if(error) {
    //         return console.log('unable to insert user')
    //     }

    //     console.log(result.ops);
    // })
    // db.collection('users').insertMany([
    //     {
    //         name: 'Jen',
    //         age: 34
    //     }, {
    //         name: 'Juan',
    //         age: 25
    //     }
    // ], (error, result)=> {
    //     if(error) {
    //         return console.log("Unable to insert document.")
    //     }

    //     console.log(result.ops);
    // });
});