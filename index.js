const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


// middlewares
app.use(cors());
app.use(express.json());

// mongodb connection

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bhwsqpg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// database and collection
const productsCollection = client.db('inventory').collection('products');

async function run() {
    try {
        // get product from database
        app.get('/products', async (req, res) => {
            const query = {};
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        })
        app.get('/products/:id', async (req, res) => {
            const query = { _id: ObjectId(req.params.id) };
            const product = await productsCollection.findOne(query);
            res.send(product)
        })
        // add product to database
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.send(result)
        })
        // update product in database
        app.patch('/products/:id', async (req, res) => {
            const filter = { _id: ObjectId(req.params.id) };
            console.log(req.body)
            const updatedDoc = {
                $set: req.body
            };
            const updateResult = await productsCollection.updateOne(filter, updatedDoc)
            res.send(updateResult)
        })
    } catch (error) {

    }
}

run().catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('Inventory management server is running');
})


app.listen(port, () => {
    console.log(`server is running fine on port ${port}`)
})