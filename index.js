const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
require("dotenv").config();
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion } = require("mongodb");


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.xsnumx1.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run(){
  try{
        await client.connect();

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
