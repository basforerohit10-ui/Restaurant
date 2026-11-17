import express from 'express';
import { db } from '../data/database.js';

const router = express.Router();

// GET /api/tables - Retrieve all dining tables
router.get('/', (req, res) => {
  try {
    const { section, status, minCapacity } = req.query;
    let tables = db.getTables();

    // Use JavaScript array filter operations on backend
    if (section && section !== 'all') {
      tables = tables.filter(t => t.section === section);
    }
    if (status && status !== 'all') {
      tables = tables.filter(t => t.status === status);
    }
    if (minCapacity) {
      tables = tables.filter(t => t.capacity >= Number(minCapacity));
    }

    res.json({
      success: true,
      count: tables.length,
      data: tables
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tables - Create a new table
router.post('/', async (req, res) => {
  try {
    const { number, section, capacity, shape } = req.body;
    if (!number || !capacity) {
      return res.status(400).json({ success: false, error: 'Table number and capacity are required' });
    }

    const newId = `T-${number}`;
    const existing = db.getTables().find(t => t.id === newId || t.number === number);
    if (existing) {
      return res.status(409).json({ success: false, error: `Table #${number} already exists` });
    }

    const newTable = {
      id: newId,
      number: String(number),
      section: section || 'main',
      capacity: Number(capacity),
      shape: shape || 'square',
      status: 'available',
      currentReservationId: null,
      x: 50,
      y: 50
    };

    const saved = await db.addTable(newTable);
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/tables/:id/status - Update table status directly
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, currentReservationId } = req.body;

    const validStatuses = ['available', 'reserved', 'occupied', 'maintenance'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const updated = await db.updateTable(id, {
      status,
      currentReservationId: status === 'available' || status === 'maintenance' ? null : currentReservationId
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Table not found' });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

