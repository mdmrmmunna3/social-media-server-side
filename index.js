const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000

const app = express();

// middlewares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.le2w9sh.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const postDataCollection = client.db('socialMedia').collection('postData');

        app.post("/postData", async (req, res) => {
            const userPostData = req.body;
            const result = await postDataCollection.insertOne(userPostData);
            // console.log(result)
            res.send(result);
        })

    }

    finally {

    }
}

run().catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send('Social-Media project is running ')
})

app.listen(port, (req, res) => {
    console.log(`Social Media project running on ${port}`)
})