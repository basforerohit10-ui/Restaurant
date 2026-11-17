import express from 'express';
import { db } from '../data/database.js';

const router = express.Router();

// GET /api/waitlist - Retrieve all waitlist entries
router.get('/', (req, res) => {
  try {
    const waitlist = db.getWaitlist();
    res.json({
      success: true,
      count: waitlist.length,
      data: waitlist
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/waitlist - Add party to waitlist
router.post('/', async (req, res) => {
  try {
    const { guestName, phone, partySize, sectionPreference, quotedWaitMinutes, notes } = req.body;
    if (!guestName || !partySize) {
      return res.status(400).json({ success: false, error: 'guestName and partySize are required' });
    }

    const newId = `WAIT-${String(Date.now()).slice(-3)}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newEntry = {
      id: newId,
      guestName: guestName.trim(),
      phone: phone || '',
      partySize: Number(partySize),
      sectionPreference: sectionPreference || 'First Available',
      quotedWaitMinutes: Number(quotedWaitMinutes) || 15,
      addedAt: timeStr,
      status: 'waiting',
      notes: notes || ''
    };

    const saved = await db.addWaitlist(newEntry);
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/waitlist/:id/seat - Seat waitlist guest at table
router.post('/:id/seat', async (req, res) => {
  try {
    const { id } = req.params;
    const { tableId } = req.body;

    if (!tableId) {
      return res.status(400).json({ success: false, error: 'tableId is required to seat waitlist guest' });
    }

    const entry = db.getWaitlist().find(w => w.id === id);
    if (!entry) {
      return res.status(404).json({ success: false, error: 'Waitlist party not found' });
    }

    // Remove from waitlist
    await db.removeWaitlist(id);

    // Create seated reservation
    const newResId = `RES-${String(Date.now()).slice(-4)}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newReservation = {
      id: newResId,
      guestName: entry.guestName,
      phone: entry.phone,
      email: '',
      partySize: entry.partySize,
      tableId,
      date: new Date().toISOString().split('T')[0],
      time: timeStr,
      status: 'seated',
      occasion: 'Walk-In',
      specialRequests: entry.notes || 'Walk-in guest from waitlist',
      source: 'Waitlist Queue',
      createdAt: new Date().toISOString()
    };

    await db.addReservation(newReservation);

    // Update table
    await db.updateTable(tableId, {
      status: 'occupied',
      currentReservationId: newResId
    });

    res.json({
      success: true,
      message: `Seated ${entry.guestName} at Table ${tableId}`,
      data: newReservation
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/waitlist/:id - Remove guest from waitlist
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await db.removeWaitlist(id);
    if (!removed) {
      return res.status(404).json({ success: false, error: 'Waitlist party not found' });
    }
    res.json({ success: true, message: 'Waitlist party removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

