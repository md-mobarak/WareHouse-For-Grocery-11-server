const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()

// bduser
// hDrsnHr8dZoOzyUE

app.use(cors())
app.use(express.json())

function varifyJwt(req, res, next) {
    const auth = req.headers.authorization;
    console.log(auth);
    next()
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vv6vo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {

        await client.connect()
        const productCollection = client.db('groci').collection('product')
        const itemCollection = client.db('item').collection('newItem')


        //   AUTH 
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            res.send({ accessToken });
        })


        // SERVICES
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
            console.log(product);
            res.send(product)
        })


        app.post('/manageproduct', async (req, res) => {
            const newProduct = req.body;
            const result = await itemCollection.insertOne(newProduct)

            res.send(result)
        })

        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productCollection.deleteOne(query)
            res.send(result)
        })

        app.delete('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await itemCollection.deleteOne(query)

            res.send(result)
        })

        // new try 
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const updateInfo = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upset: true }
            const updateDoc = {
                $set: {
                    quantity: updateInfo.quantity
                }
            }
            const result = await productCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })


        app.put('/product/:id', async (req, res) => {
            const id = req.params.id
            const updatedValue = req.body
            // console.log(updatedValue);
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedValue.quantity
                }
            }
            // console.log(updatedDoc);
            const result = await productCollection.updateOne(filter, updatedDoc, options)
            // console.log(result);
            res.send(result)
        })


        app.post('/manageproduct', async (req, res) => {
            const newProduct = req.body;
            // const result = await productCollection.insertOne(newProduct)
            const result = await productCollection.insertOne(newProduct)
            // console.log(newProduct);
            res.send(result)
        })

        app.get('/myitem', varifyJwt, async (req, res) => {

            const email = req.query.email;

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