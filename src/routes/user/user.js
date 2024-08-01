const pool = require('./../../config/db');
const bcrypt = require('bcryptjs');

const saltRounds = 10;

exports.getUser = async (req, res) => {
    try {
      const userId = req.user.id;
      const [rows] = await pool.execute('SELECT * FROM user WHERE id = ?', [userId]);
  
      if (rows.length === 0) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      res.json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur serveur');
    }
};

exports.getUserTodos = async (req, res) => {
    try {
      const userId = req.user.id;
      const [rows] = await pool.execute('SELECT * FROM todo WHERE user_id = ?', [userId]);
  
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur serveur');
    }
};

exports.getUserByIdOrEmail = async (req, res) => {
  const { id_or_email = '' } = req.params;

  try {
    const isNumber = !isNaN(parseInt(id_or_email));
    let rows;

    if (isNumber) {
      [rows] = await pool.execute('SELECT * FROM user WHERE id = ?', [id_or_email]);
    } else {
      [rows] = await pool.execute('SELECT * FROM user WHERE email = ?', [id_or_email]);
    }

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, password, name, firstname } = req.body;
  
    try {
      const [user] = await pool.execute('SELECT * FROM user WHERE id = ?', [id]);
  
      if (user.length === 0) {
        return res.status(404).json({ msg: 'User not found' });
      }
      
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const result = await pool.execute(
        'UPDATE user SET email = ?, password = ?, name = ?, firstname = ? WHERE id = ?',
        [email, hashedPassword, name, firstname, id]
      );

      const [updatedUser] = await pool.execute('SELECT * FROM user WHERE id = ?', [id]);
  
      res.json(updatedUser[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur serveur');
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
      const [user] = await pool.execute('SELECT * FROM user WHERE id = ?', [id]);

      if (user.length === 0) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      const result = await pool.execute('DELETE FROM user WHERE id = ?', [id]);
  
      res.json({ msg: `Successfully deleted record number: ${id}` });
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur serveur');
    }
};
  