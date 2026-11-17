import express from 'express';
import { db } from '../data/database.js';

const router = express.Router();

// GET /api/analytics - Dynamic analytics powered by Array reduce and filter
router.get('/', (req, res) => {
  try {
    const tables = db.getTables();
    const reservations = db.getReservations();
    const waitlist = db.getWaitlist();

    const totalTables = tables.length;
    const availableTables = tables.filter(t => t.status === 'available').length;
    const occupiedTables = tables.filter(t => t.status === 'occupied').length;
    const reservedTables = tables.filter(t => t.status === 'reserved').length;
    const maintenanceTables = tables.filter(t => t.status === 'maintenance').length;
    const activeOccupied = occupiedTables + reservedTables;
    const occupancyRate = totalTables > 0 ? Math.round((activeOccupied / totalTables) * 100) : 0;

    const seatedReservations = reservations.filter(r => r.status === 'seated');
    const totalSeatedGuests = seatedReservations.reduce((acc, r) => acc + Number(r.partySize || 0), 0);
    const totalExpectedGuests = reservations
      .filter(r => r.status !== 'cancelled')
      .reduce((acc, r) => acc + Number(r.partySize || 0), 0);

    // Grouping party sizes with Array.reduce
    const partySizeDistribution = reservations.reduce((acc, r) => {
      const size = r.partySize;
      const key = size <= 2 ? '1-2 Guests' : size <= 4 ? '3-4 Guests' : size <= 6 ? '5-6 Guests' : '7+ Guests';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {
      '1-2 Guests': 0,
      '3-4 Guests': 0,
      '5-6 Guests': 0,
      '7+ Guests': 0
    });

    res.json({
      success: true,
      data: {
        totalTables,
        availableTables,
        occupiedTables,
        reservedTables,
        maintenanceTables,
        occupancyRate,
        totalReservations: reservations.length,
        seatedCount: seatedReservations.length,
        totalSeatedGuests,
        totalExpectedGuests,
        activeWaitlistCount: waitlist.filter(w => w.status === 'waiting').length,
        partySizeDistribution
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

