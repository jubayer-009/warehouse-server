const express = require("express");
const app = express();
const port =process.env.PORT|| 5000;
const cors = require("cors");
require("dotenv").config();
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.xsnumx1.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run(){
  try{
    const servicesCollection = client
      .db("warehouse-managment")
      .collection("services");
    const productsCollection = client
      .db("warehouse-managment")
      .collection("products");
    await client.connect();
    //services collction
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    //products collction
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    //details
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.send(product);
    });
    //update quantity
    app.put("/products/:id", async (req, res) => {
        const id = req.params.id;
      const updateQuantity = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: updateQuantity,
      };
      const result = await productsCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
      console.log(updatedDoc);
    });
  }
  finally{

  }
console.log("db Connected");

}
run().catch(console.dir);




app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
