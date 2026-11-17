import express from 'express';
import { db } from '../data/database.js';

const router = express.Router();

// GET /api/reservations - Retrieve reservations with optional filters
router.get('/', (req, res) => {
  try {
    const { status, date, search } = req.query;
    let reservations = db.getReservations();

    // Use JavaScript array filter operations
    if (status && status !== 'all') {
      reservations = reservations.filter(r => r.status === status);
    }
    if (date) {
      reservations = reservations.filter(r => r.date === date);
    }
    if (search) {
      const q = search.toLowerCase().trim();
      reservations = reservations.filter(
        r =>
          r.guestName.toLowerCase().includes(q) ||
          (r.phone && r.phone.includes(q)) ||
          r.id.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/reservations - Create a new booking
router.post('/', async (req, res) => {
  try {
    const {
      guestName,
      phone,
      email,
      partySize,
      tableId,
      date,
      time,
      occasion,
      specialRequests,
      status,
      source
    } = req.body;

    if (!guestName || !partySize || !date || !time) {
      return res.status(400).json({
        success: false,
        error: 'guestName, partySize, date, and time are required fields'
      });
    }

    const newId = `RES-${String(Date.now()).slice(-4)}`;
    const newReservation = {
      id: newId,
      guestName: guestName.trim(),
      phone: phone || '',
      email: email || '',
      partySize: Number(partySize),
      tableId: tableId || null,
      date,
      time,
      occasion: occasion || 'Casual Dining',
      specialRequests: specialRequests || '',
      status: status || 'confirmed',
      source: source || 'Web App',
      createdAt: new Date().toISOString()
    };

    // If table is assigned, verify capacity and update table status
    if (tableId) {
      const table = db.getTables().find(t => t.id === tableId);
      if (table) {
        const tableStatus = newReservation.status === 'seated' ? 'occupied' : 'reserved';
        await db.updateTable(tableId, {
          status: tableStatus,
          currentReservationId: newId
        });
      }
    }

    const saved = await db.addReservation(newReservation);
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/reservations/:id - Update reservation
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const current = db.getReservations().find(r => r.id === id);
    if (!current) {
      return res.status(404).json({ success: false, error: 'Reservation not found' });
    }

    const updatedData = req.body;

    // Handle table reassignment
    if (updatedData.tableId && updatedData.tableId !== current.tableId) {
      // Free old table
      if (current.tableId) {
        await db.updateTable(current.tableId, { status: 'available', currentReservationId: null });
      }
      // Assign new table
      const newStatus = updatedData.status === 'seated' ? 'occupied' : 'reserved';
      await db.updateTable(updatedData.tableId, { status: newStatus, currentReservationId: id });
    }

    const updated = await db.updateReservation(id, updatedData);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/reservations/:id/seat - Seat a reservation at a table
router.put('/:id/seat', async (req, res) => {
  try {
    const { id } = req.params;
    const { tableId } = req.body;

    const reservation = db.getReservations().find(r => r.id === id);
    if (!reservation) {
      return res.status(404).json({ success: false, error: 'Reservation not found' });
    }

    const assignedTableId = tableId || reservation.tableId;
    if (!assignedTableId) {
      return res.status(400).json({ success: false, error: 'Table assignment required to seat party' });
    }

    // Update reservation
    const updatedRes = await db.updateReservation(id, {
      status: 'seated',
      tableId: assignedTableId
    });

    // Update table
    await db.updateTable(assignedTableId, {
      status: 'occupied',
      currentReservationId: id
    });

    res.json({ success: true, data: updatedRes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/reservations/:id/complete - Complete dining and free table
router.put('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = db.getReservations().find(r => r.id === id);
    if (!reservation) {
      return res.status(404).json({ success: false, error: 'Reservation not found' });
    }

    const updatedRes = await db.updateReservation(id, { status: 'completed' });

    if (reservation.tableId) {
      await db.updateTable(reservation.tableId, {
        status: 'available',
        currentReservationId: null
      });
    }

    res.json({ success: true, data: updatedRes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/reservations/:id - Cancel booking and free table hold
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = db.getReservations().find(r => r.id === id);
    if (!reservation) {
      return res.status(404).json({ success: false, error: 'Reservation not found' });
    }

    const updatedRes = await db.updateReservation(id, { status: 'cancelled' });

    if (reservation.tableId) {
      await db.updateTable(reservation.tableId, {
        status: 'available',
        currentReservationId: null
      });
    }

    res.json({ success: true, message: 'Reservation cancelled', data: updatedRes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

