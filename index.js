const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        // insert post data
        app.post("/postData", async (req, res) => {
            const userPostData = req.body;
            const result = await postDataCollection.insertOne(userPostData);

            // console.log(result)
            res.send(result);
        })

        // get post data
        app.get("/postData", async (req, res) => {
            const query = {};
            const postdatas = postDataCollection.find(query).sort({ postTime: -1 });
            const result = await postdatas.toArray();
            res.send(result);
        })

        // get data by id
        app.get("/postData/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const postData = await postDataCollection.findOne(query)
            res.send(postData);
        })

        // update post data with like 
        app.put("postData/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    likes: likeCounter
                },
            };
            const result = await postDataCollection.updateOne(filter, updateDoc, options);
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