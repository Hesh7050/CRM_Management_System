const express = require('express');
const pool    = require('../config/db');
const auth    = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const [[{ totalLeads }]]       = await pool.query("SELECT COUNT(*) AS totalLeads FROM leads");
    const [[{ newLeads }]]         = await pool.query("SELECT COUNT(*) AS newLeads FROM leads WHERE status = 'New'");
    const [[{ qualifiedLeads }]]   = await pool.query("SELECT COUNT(*) AS qualifiedLeads FROM leads WHERE status = 'Qualified'");
    const [[{ wonLeads }]]         = await pool.query("SELECT COUNT(*) AS wonLeads FROM leads WHERE status = 'Won'");
    const [[{ lostLeads }]]        = await pool.query("SELECT COUNT(*) AS lostLeads FROM leads WHERE status = 'Lost'");
    const [[{ totalDealValue }]]   = await pool.query("SELECT COALESCE(SUM(deal_value), 0) AS totalDealValue FROM leads");
    const [[{ wonDealValue }]]     = await pool.query("SELECT COALESCE(SUM(deal_value), 0) AS wonDealValue FROM leads WHERE status = 'Won'");

    res.json({
      totalLeads,
      newLeads,
      qualifiedLeads,
      wonLeads,
      lostLeads,
      totalDealValue,
      wonDealValue,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
