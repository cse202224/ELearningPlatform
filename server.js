const express = require('express');
const mysql = require('mysql');
// const mysql = require('mysql2');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path'); // Import the 'path' module


const app = express();
const port = 3000;


// Middleware to parse JSON bodies
app.use(express.json());

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12723744',
  password: 'NNmGZCJpSq',
  database: 'sql12723744',
  port: 3306
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'img')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/signup', (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
  
    // Check if the user already exists
    db.query('SELECT * FROM elearning WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.error('Error checking user existence:', err);
        return res.status(500).json({ success: false, message: 'Server error.' });
      }
  
      if (results.length > 0) {
        return res.status(400).json({ success: false, message: 'Email already registered.' });
      }
  
      // Insert new user into the database
      db.query('INSERT INTO elearning (email, password) VALUES (?, ?)', [email, password], (err, results) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).json({ success: false, message: 'Server error.' });
        }
  
        res.status(200).json({ success: true });
      });
    });
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM elearning WHERE email = ? AND password = ?';

  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).json({ success: false, message: 'Server error' });
      return;
    }

    if (results.length > 0) {
      // Successful login
      res.status(200).json({ success: true });
    } else {
      // Invalid credentials
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  });
});




app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});



 
