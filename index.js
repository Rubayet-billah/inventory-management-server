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
const categoriesCollection = client.db('inventory').collection('categories');
const productsCollection = client.db('inventory').collection('products');

async function run() {
    try {

        // get categories from database
        app.get('/categories', async (req, res) => {
            const query = {};
            const categories = await categoriesCollection.find(query).toArray();
            res.send(categories)
        })
        // add categories to database
        app.post('/categories', async (req, res) => {
            const category = req.body;
            const query = { name: category.name }
            const previousCategory = await categoriesCollection.findOne(query);
            if (previousCategory) {
                return res.send({ message: 'Category already exists' })
            }
            const result = await categoriesCollection.insertOne(category);
            res.send(result);
        })

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
        // delete a product from database
        app.delete('/products/:id', async (req, res) => {
            const filter = { _id: ObjectId(req.params.id) };
            const result = await productsCollection.deleteOne(filter);
            res.send(result)
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