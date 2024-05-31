const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require("mysql2");

const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const con = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: '',
    database: 'shop'
});

con.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

app.put('/order/update/:id', (req, res) => {
  const id = req.params.id;
  const quantity = req.body.quantity;
  if (!id || !quantity || isNaN(quantity) || quantity < 1) {
    return res.status(400).send("Invalid input data");
  }
  const query = "UPDATE `order` SET quantity = ? WHERE id = ?";
  con.query(query, [quantity, id], (err, result) => {
    if (err) {
      console.error('Error updating order quantity', err);
      return res.status(500).send("Error updating order quantity");
    }
    if (result.affectedRows === 0) {
      console.log(`No order found with id: ${id}`);
      return res.status(404).send("Order not found");
    }
    console.log(`Order with id: ${id} updated successfully`);
    res.send("Order quantity updated successfully");
  });
});


app.delete('/order/delete/:id', (req, res) => { 
  const id = req.params.id;
  con.query("DELETE FROM `order` WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error('Error deleting order', err);
      return res.status(500).send("Error deleting order");
    }
    res.send("Order deleted successfully");
  });
});

app.get('/order/get',(req,res)=>{
  con.query("SELECT * FROM `order`",(err,result)=>{
      res.send(result);
  })
})

app.post('/order/post', (req, res) => {
  const { id, image , title, owner, contract, price, quantity,productID } = req.body;
  const query = 'INSERT INTO `order` (id, image, title, owner, contract, price, quantity, productID) VALUES (?, ?, ?, ?, ?, ? ,?,?)';
  const values = [id, image, title, owner, contract, price, quantity,productID];
  con.query(query, values, (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send("Database server error");
    }
    if(result){
      res.send("Add successfully");
    }
  });
});
//http://localhost:3001/test
app.get('/test', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
