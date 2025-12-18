const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql');

// Create a connection pool
const db = mysql.createConnection({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ecommerce'
});
db.connect((error)=> {
  if (error) {
    console.error('Error connecting to the database:', error);
    return;
  }
    console.log('Connected to the MySQL database.');
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
//add multiple users at once 
app.post("/add-users", (req, res) => {
  const users = req.body;
  console.log(users);
  const sql = "INSERT INTO users (username, email, role, password) VALUES ?";
  const values = users.map(user => [user.username, user.email, user.role, user.password]);
    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error('Error inserting users:', err);
            res.status(500).send('Error inserting users');
        } else {
            res.status(200).send('Users added successfully');
        }
    });
});

// app.post("/add-users", (req, res) => {
//   const { username, email, role, password } = req.body;
//   const sql = "INSERT INTO users (username, email, role, password) VALUES (?, ?, ?, ?)";
//     db.query(sql, [username, email, role, password], (err, result) => {
//         if (err) {
//             console.error('Error inserting user:', err);
//             res.status(500).send('Error inserting user');
//         } else {
//             res.status(200).send('User added successfully');
//         }
//     });
// });

app.get("/get-users",(req,res)=>{
  const sql = "SELECT * FROM users";
  db.query(sql, (err,results)=>{
    if(err){
      console.error('Error fetching users:', err);
      res.status(500).send('Error fetching users');
    }
    else{
      res.status(200).json(results);
    }
  })
})

app.delete("/delete-user/:id",(req,res)=>{
  const id = req.params.id
  console.log(id);
  const sql = "DELETE FROM users WHERE userid = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).send('Error deleting user');
    } else {  
      res.status(200).send('User deleted successfully');
    }
  });
});

app.put("/update-user/:id",(req,res)=>{
  const userid = req.params.id;
  const { username, email, role, password } = req.body;
  const sql = "UPDATE users SET username = ?, email = ?, role = ?, password = ? WHERE userid = ?";
  db.query(sql, [username, email, role, password, userid], (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      res.status(500).send('Error updating user');
    } else {
      res.status(200).send('User updated successfully');
    }
  });
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});