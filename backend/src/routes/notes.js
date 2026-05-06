const express = require('express');
const pool    = require('../config/db');
const auth    = require('../middleware/auth');

const router = express.Router();

router.delete('/note/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM notes WHERE id = ?', [req.params.id]);
    res.json({ message: 'Note deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/:leadId', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM notes WHERE lead_id = ? ORDER BY created_at DESC',
      [req.params.leadId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/:leadId', auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Note content is required.' });
    }

    const [result] = await pool.query(
      'INSERT INTO notes (lead_id, content, created_by) VALUES (?, ?, ?)',
      [req.params.leadId, content.trim(), req.user.name]
    );

    const [newNote] = await pool.query('SELECT * FROM notes WHERE id = ?', [result.insertId]);
    res.status(201).json(newNote[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
