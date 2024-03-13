const express = require('express');
const app = express();
const port = 3000;

const createConnection = require('typeorm');
const pagination = ('typeorm-pagination');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(pagination);


app.get("/", (req, res) => {
    res.status(200)
      .json({
      success: true,
      message: "You are on node-typescript-boilerplate.",
    });
});

createConnection()
    .then(async () => {
      app.listen(port, () => {
        console.log(`CONNECTED TO DB AND SERVER START ON ${port}`);
      });
  })
.catch((error) => console.log(error));