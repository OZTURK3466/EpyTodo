const pool = require("../../config/db");

exports.getTodos = async (req, res) => {
    try {
        const [rows] = await pool.execute("SELECT * FROM todo");
    
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
};

exports.getTodoById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.execute("SELECT * FROM todo WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ msg: "Todo not found" });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
};

exports.createTodo = async (req, res) => {
    const { title, description, due_time, user_id, status } = req.body;

    if (!title || !description || !due_time || !user_id || !status ) {
        return res.status(400).send("Toutes les valeurs sont requises");
    }

    try {
        const result = await pool.execute(
            "INSERT INTO todo (title, description, due_time, status, user_id) VALUES (?, ?, ?, ?, ?)",
            [title, description, due_time, status, user_id]
        );

        const [rows] = await pool.execute("SELECT * FROM todo WHERE id = ?", [result[0].insertId]);

        if (rows.length === 0) {
            return res.status(404).json({ msg: "Todo not found" });
        }

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
}

exports.updateTodo = async (req, res) => {
    const { id } = req.params;
    const { title, description, due_time, user_id, status } = req.body;

    if (!title || !description || !due_time || !user_id || !status ) {
        return res.status(400).send("Toutes les valeurs sont requises");
    }

    try {
        const [rows] = await pool.execute("SELECT * FROM todo WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ msg: "Todo not found" });
        }

        await pool.execute(
            "UPDATE todo SET title = ?, description = ?, due_time = ?, status = ?, user_id = ? WHERE id = ?",
            [title, description, due_time, status, user_id, id]
        );

        const [updatedTodo] = await pool.execute("SELECT * FROM todo WHERE id = ?", [id]);

        res.json(updatedTodo);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
}

exports.deleteTodo = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.execute("SELECT * FROM todo WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ msg: "Todo not found" });
        }

        await pool.execute("DELETE FROM todo WHERE id = ?", [id]);

        res.send("Successfully deleted record number: ${" + id + "}");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
}