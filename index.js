const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()

// bduser
// hDrsnHr8dZoOzyUE

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://bduser:hDrsnHr8dZoOzyUE@cluster0.vv6vo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("groci").collection("product");
    // perform actions on the collection object
    client.close();
    console.log('server is runiiiiiiiiii');
});


app.get('/', (req, res) => {
    res.send('hello world')
})


app.listen(port, () => {
    console.log(`Server is Running ${port}`)
})