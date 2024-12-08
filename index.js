const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.epj76.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// middleware
app.use(cors());
app.use(express.json());



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();


        // for user collection

        const database = client.db("CrowCubeDB");
        const userCollection = database.collection('userCollection');
        const campaignCollection = database.collection('campaignCollection');
        const userDonationCollection = database.collection("userDonationCollection");



        // to read data from client side which is sent

        app.post('/users', async (req, res) => {
            const newuser = req.body;
            console.log(newuser);
            const result = await userCollection.insertOne(newuser);
            res.send(result);
        })


        // to get data
        app.get('/users', async (req, res) => {
            const coursor = userCollection.find();
            const result = await coursor.toArray();
            res.send(result);
        })


        // for campain collections 

        // fomr er data server side pathano hoy
        app.post('/campaign', async (req, res) => {
            const newCampaign = req.body;
            console.log(newCampaign);
            const result = await campaignCollection.insertOne(newCampaign);
            res.send(result);
        })


        // server to database e data pathate
        app.get('/campaign', async (req, res) => {
            const coursor = campaignCollection.find();
            const result = await coursor.toArray();
            res.send(result);
        })

        // delete ----

        app.delete('/campaign/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await campaignCollection.deleteOne(query);
            res.send(result)
        })

        // update 
        app.get('/campaign/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await campaignCollection.findOne(query);
            res.send(result)

        })
        app.put('/campaign/:id', async (req, res) => {
            const update = req.body;
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateedCamp = {
                $set: {
                    email: update.email,
                    name: update.name,
                    thumbnail: update.thumbnail,
                    title: update.title,
                    type: update.type,
                    minDonation: update.minDonation, description: update.description, deadline: update.deadline
                }
            }
            const result = await campaignCollection.updateOne(query, updateedCamp, options);
            res.send(result)

        })







        // for collectin user donation collection 

        // data is creating --> and sending in server from client ---> code will be in client side --using fetch()

        // accepting data from client side 
        // inserting data on the collection 
        // then it is sent in the server
        app.post('/userDonation', async (req, res) => {
            const newDonation = req.body;
            const result = await userDonationCollection.insertOne(newDonation);
            res.send(result);
        })
        // showing data on server side 
        app.get('/userDonation', async (req, res) => {
            const coursor = userDonationCollection.find();
            const result = await coursor.toArray();
            res.send(result);
        })








        
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Assingment servver server is running")
})


app.listen(port, () => {
    console.log(`Assignment 10 server is running on :${port} port`)
})