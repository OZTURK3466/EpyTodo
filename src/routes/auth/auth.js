const pool = require("../../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

exports.register = async (req, res) => {
    const { email, password, name, firstname } = req.body;
  
    if (!email || !password || !name || !firstname) {
      return res.status(400).send('Toutes les valeurs sont requises');
    }
  
    try {
      const [rows] = await pool.execute('SELECT * FROM user WHERE email = ?', [email]);
  
      if (rows.length > 0) {
        return res.status(400).send('Account already exists');
      }
  
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      const result = await pool.execute(
        'INSERT INTO user (email, password, name, firstname) VALUES (?, ?, ?, ?)',
        [email, hashedPassword, name, firstname]
      );
  
      res.status(201).send('Utilisateur créé avec l\'ID ' + result[0].insertId);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur serveur');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const [rows] = await pool.execute('SELECT * FROM user WHERE email = ?', [email]);
  
      if (rows.length === 0) {
        return res.status(401).json({ msg: 'Invalid Credentials' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, rows[0].password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ msg: 'Invalid Credentials' });
      }
  
      const user = { id: rows[0].id, email: rows[0].email };
      const token = jwt.sign(user, process.env.SECRET);
  
      res.send({ token });
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur serveur');
    }
};