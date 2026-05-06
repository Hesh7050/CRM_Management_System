const express = require('express');
const pool    = require('../config/db');
const auth    = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { status, lead_source, assigned_salesperson, search } = req.query;

    let query  = 'SELECT * FROM leads WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (lead_source) {
      query += ' AND lead_source = ?';
      params.push(lead_source);
    }
    if (assigned_salesperson) {
      query += ' AND assigned_salesperson LIKE ?';
      params.push(`%${assigned_salesperson}%`);
    }
    if (search) {
      query += ' AND (lead_name LIKE ? OR company_name LIKE ? OR email LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM leads WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Lead not found.' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const {
      lead_name, company_name, email, phone,
      lead_source, assigned_salesperson, status, deal_value,
    } = req.body;

    if (!lead_name || lead_name.trim() === '') {
      return res.status(400).json({ message: 'Lead name is required.' });
    }

    const [result] = await pool.query(
      `INSERT INTO leads
        (lead_name, company_name, email, phone, lead_source, assigned_salesperson, status, deal_value)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        lead_name.trim(),
        company_name   || null,
        email          || null,
        phone          || null,
        lead_source    || 'Website',
        assigned_salesperson || null,
        status         || 'New',
        parseFloat(deal_value) || 0,
      ]
    );

    const [newLead] = await pool.query('SELECT * FROM leads WHERE id = ?', [result.insertId]);
    res.status(201).json(newLead[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const {
      lead_name, company_name, email, phone,
      lead_source, assigned_salesperson, status, deal_value,
    } = req.body;

    const [existing] = await pool.query('SELECT id FROM leads WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Lead not found.' });

    await pool.query(
      `UPDATE leads SET
        lead_name = ?, company_name = ?, email = ?, phone = ?,
        lead_source = ?, assigned_salesperson = ?, status = ?, deal_value = ?
       WHERE id = ?`,
      [
        lead_name, company_name || null, email || null, phone || null,
        lead_source, assigned_salesperson || null, status,
        parseFloat(deal_value) || 0,
        req.params.id,
      ]
    );

    const [updated] = await pool.query('SELECT * FROM leads WHERE id = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT id FROM leads WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Lead not found.' });

    await pool.query('DELETE FROM leads WHERE id = ?', [req.params.id]);
    res.json({ message: 'Lead deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
