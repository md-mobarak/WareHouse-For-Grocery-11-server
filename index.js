const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()

// bduser
// hDrsnHr8dZoOzyUE

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vv6vo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {

        await client.connect()
        const productCollection = client.db('groci').collection('product')
        const itemCollection = client.db('item').collection('newItem')
        app.get('/product', async (req, res) => {
            const query = {}
            const cursor = productCollection.find(query)
            const product = await cursor.toArray()
            res.send(product)
        })
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const product = await productCollection.findOne(query)
            // console.log(product);
            res.send(product)
        })

        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productCollection.deleteOne(query)
            res.send(result)
        })
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id
            const updatedProduct = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: updatedProduct
            };
            const result = await productCollection.updateOne(filter, updateDoc, options)
            console.log(result);

            res.send({ result })
        })

        app.post('/manageproduct', async (req, res) => {
            const newProduct = req.body;
            // const result = await productCollection.insertOne(newProduct)
            const result = await itemCollection.insertOne(newProduct)
            // console.log(newProduct);
            res.send(result)
        })

        app.get('/myitem', async (req, res) => {
            const email = req.query.email;
            // console.log(email);
            const query = { email: email }
            const cursor = itemCollection.find(query)
            const myItem = await cursor.toArray()
            res.send(myItem)
        })

    }

    finally {

    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('hello world')
})


app.listen(port, () => {
    console.log(`Server is Running ${port}`)
})