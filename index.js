const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId

const app = express()
app.use(cors());
app.use(bodyParser.json());
const port = process.env.PORT || 4000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pg32v.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("smart-shopping").collection("products");
    const ordersCollection = client.db("smart-shopping").collection("orders");
    // perform actions on the collection object
    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        collection.insertOne(newProduct)
            .then(result => {
                console.log(result.insertedCount)
                res.send(result.insertedCount > 0);
            })
    })

    //show product on UI
    app.get('/products', (req, res) => {
        collection.find()
            .toArray((err, documents) => {
                res.send(documents);
                console.log(documents)
            })
    })
    //show a single product
    app.get('/product/:id', (req, res) => {
        console.log(req.params.key)
        collection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })
    //delete product
    app.delete('/delete/:id', (req, res) => {
        collection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
            })
    })
    //order 
    app.post('/addOrder', (req, res) => {
        const ordersInfo = req.body;
        ordersCollection.insertOne(ordersInfo)
            .then(result => {
                console.log(result.insertedCount)
                res.send(result.insertedCount > 0);
            })
    })
    //show order
    app.get('/ShowOrder', (req, res) => {
        ordersCollection.find({email: req.query.email})
            .toArray((err, documents) => {
                res.send(documents);
                console.log(documents)
            })
    })
    console.log('database connected')
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})