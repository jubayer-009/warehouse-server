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
    const cartCollection = client.db("warehouse-managment").collection("cart");
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
    //cart collction
    app.post("/cart", async (req, res) => {
      const data = req.body;
      const result = await cartCollection.insertOne(data);
      res.send(result);
    });
    //get cart collction
    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find();
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
      const result = await productsCollection.updateMany(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
      console.log(updatedDoc);
    });
    //order by email
    app.get("/cartproduct", async (req, res) => {
      const email = req.query.email;

      const query = {email:email};
      const cartProduct = await cartCollection.find(query).toArray();
      res.send(cartProduct);
    });
    //delete cart item
     app.delete("/cartproduct/:id", async (req, res) => {
       const id = req.params.id;
       const filter = { _id: ObjectId(id) };
       const result = await cartCollection.deleteOne(filter);
       res.send(result);
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
