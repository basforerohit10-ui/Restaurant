// JavaScript Array Operations Live Demonstrator & Documentation Engine

export function executeArrayOperations(reservations, tables) {
  return [
    {
      name: 'filter() - Filter High-Priority / Seated Reservations',
      method: '.filter()',
      description: 'Filters down elements based on a boolean predicate without mutating the original array.',
      code: `const seatedGuests = reservations.filter(res => res.status === 'seated');`,
      result: reservations.filter(res => res.status === 'seated'),
      summary: `Found ${reservations.filter(res => res.status === 'seated').length} currently seated dining parties out of ${reservations.length} total reservations.`
    },
    {
      name: 'filter() - Available Large Tables (Capacity >= 6)',
      method: '.filter()',
      description: 'Quickly locates all available tables capable of hosting large groups (6+ guests).',
      code: `const largeAvailable = tables.filter(t => t.status === 'available' && t.capacity >= 6);`,
      result: tables.filter(t => t.status === 'available' && t.capacity >= 6),
      summary: `${tables.filter(t => t.status === 'available' && t.capacity >= 6).length} large tables currently open for walk-ins or reservations.`
    },
    {
      name: 'map() - Format Guest Seating Digest',
      method: '.map()',
      description: 'Transforms each element in an array into a new shape or formatted string for UI rendering.',
      code: `const guestDigest = reservations.map(r => ({
  guest: r.guestName,
  party: \`\${r.partySize} guests\`,
  time: r.time,
  status: r.status.toUpperCase()
}));`,
      result: reservations.slice(0, 5).map(r => ({
        guest: r.guestName,
        party: `${r.partySize} guests`,
        time: r.time,
        status: r.status.toUpperCase()
      })),
      summary: `Transformed ${reservations.length} raw reservation records into structured UI-ready display cards.`
    },
    {
      name: 'reduce() - Total Guests Expected Today',
      method: '.reduce()',
      description: 'Accumulates array elements into a single aggregate metric (e.g. sum of party sizes).',
      code: `const totalGuests = reservations.reduce((accumulator, current) => {
  return accumulator + current.partySize;
}, 0);`,
      result: {
        totalPartyGuests: reservations.reduce((acc, curr) => acc + curr.partySize, 0),
        averagePartySize: (
          reservations.reduce((acc, curr) => acc + curr.partySize, 0) / (reservations.length || 1)
        ).toFixed(1)
      },
      summary: `Computed aggregate sum: ${reservations.reduce((acc, curr) => acc + curr.partySize, 0)} total guests expected across all bookings.`
    },
    {
      name: 'reduce() - Current Table Occupancy Rate %',
      method: '.reduce()',
      description: 'Calculates the real-time operational capacity percentage of the dining room.',
      code: `const occupiedCount = tables.reduce((count, table) => {
  return (table.status === 'occupied' || table.status === 'reserved') ? count + 1 : count;
}, 0);
const occupancyRate = ((occupiedCount / tables.length) * 100).toFixed(0);`,
      result: {
        occupiedOrReserved: tables.reduce((acc, t) => (t.status === 'occupied' || t.status === 'reserved' ? acc + 1 : acc), 0),
        totalTables: tables.length,
        occupancyRatePercentage: `${((tables.reduce((acc, t) => (t.status === 'occupied' || t.status === 'reserved' ? acc + 1 : acc), 0) / tables.length) * 100).toFixed(0)}%`
      },
      summary: `Dynamic real-time occupancy metric: ${((tables.reduce((acc, t) => (t.status === 'occupied' || t.status === 'reserved' ? acc + 1 : acc), 0) / tables.length) * 100).toFixed(0)}% floor utilization.`
    },
    {
      name: 'find() - Find Specific Table by Table Number',
      method: '.find()',
      description: 'Returns the first element that satisfies the testing function, or undefined if none found.',
      code: `const vipTable = tables.find(table => table.section === 'vip' && table.status === 'available');`,
      result: tables.find(t => t.section === 'vip' && t.status === 'available') || null,
      summary: tables.find(t => t.section === 'vip' && t.status === 'available')
        ? `Found Table #${tables.find(t => t.section === 'vip' && t.status === 'available').number} open in VIP Lounge.`
        : 'No VIP tables currently available.'
    },
    {
      name: 'some() - Check for Maintenance Alerts',
      method: '.some()',
      description: 'Tests whether at least one element in the array passes the test implemented by the provided function.',
      code: `const hasMaintenanceIssue = tables.some(table => table.status === 'maintenance');`,
      result: {
        hasMaintenanceIssue: tables.some(t => t.status === 'maintenance'),
        affectedTables: tables.filter(t => t.status === 'maintenance').map(t => `#${t.number}`)
      },
      summary: tables.some(t => t.status === 'maintenance')
        ? `Alert: Maintenance is currently needed on table(s): ${tables.filter(t => t.status === 'maintenance').map(t => '#' + t.number).join(', ')}`
        : 'All dining tables operational without maintenance flags.'
    },
    {
      name: 'sort() - Chronological Reservation Timeline',
      method: '.sort()',
      description: 'Sorts elements of an array in place or returns a sorted shallow copy.',
      code: `const sortedTimeline = [...reservations].sort((a, b) => a.time.localeCompare(b.time));`,
      result: [...reservations].sort((a, b) => a.time.localeCompare(b.time)).slice(0, 4).map(r => `${r.time} - ${r.guestName} (${r.partySize}p)`),
      summary: `Chronologically ordered schedule for front-of-house host staff.`
    }
  ];
}

