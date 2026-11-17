// Utility to export restaurant reservations to CSV and printable shift run sheet

export function exportReservationsToCSV(reservations, tables) {
  if (!reservations || reservations.length === 0) return;

  const headers = [
    'Reservation ID',
    'Guest Name',
    'Phone',
    'Email',
    'Party Size',
    'Table Number',
    'Section',
    'Date',
    'Time',
    'Status',
    'Occasion',
    'Special Requests'
  ];

  const rows = reservations.map(r => {
    const table = r.tableId ? tables.find(t => t.id === r.tableId) : null;
    const tableNum = table ? `Table ${table.number}` : 'Unassigned';
    const section = table ? table.section : 'N/A';

    return [
      `"${r.id}"`,
      `"${r.guestName.replace(/"/g, '""')}"`,
      `"${r.phone || ''}"`,
      `"${r.email || ''}"`,
      r.partySize,
      `"${tableNum}"`,
      `"${section}"`,
      `"${r.date}"`,
      `"${r.time}"`,
      `"${r.status.toUpperCase()}"`,
      `"${(r.occasion || '').replace(/"/g, '""')}"`,
      `"${(r.specialRequests || '').replace(/"/g, '""')}"`
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', `AuraBistro_Reservations_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function printShiftRunSheet(reservations, tables, metrics) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const sortedReservations = [...reservations].sort((a, b) => a.time.localeCompare(b.time));

  const tableRows = sortedReservations
    .map(r => {
      const table = r.tableId ? tables.find(t => t.id === r.tableId) : null;
      return `
        <tr>
          <td><strong>${r.time}</strong></td>
          <td>${r.guestName}</td>
          <td>${r.partySize}p</td>
          <td>${table ? `T-${table.number} (${table.section})` : 'Unassigned'}</td>
          <td>${r.phone || 'N/A'}</td>
          <td><span class="badge ${r.status}">${r.status.toUpperCase()}</span></td>
          <td>${r.specialRequests || '—'}</td>
        </tr>
      `;
    })
    .join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>AuraBistro - Daily Guest Run Sheet</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #111; }
          h1 { margin: 0 0 4px; font-size: 24px; }
          .meta { color: #666; margin-bottom: 20px; font-size: 14px; }
          .stats { display: flex; gap: 20px; margin-bottom: 24px; background: #f3f4f6; padding: 12px 16px; border-radius: 8px; }
          .stat-item { font-size: 13px; }
          .stat-item strong { font-size: 16px; display: block; color: #111; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          th { text-align: left; background: #e5e7eb; padding: 10px 12px; border-bottom: 2px solid #ccc; font-weight: 700; }
          td { padding: 9px 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
          .badge { padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold; }
          .badge.seated { background: #d1fae5; color: #065f46; }
          .badge.confirmed { background: #dbeafe; color: #1e40af; }
          .badge.pending { background: #fef3c7; color: #92400e; }
          .badge.completed { background: #f3e8ff; color: #6b21a8; }
          .badge.cancelled { background: #fee2e2; color: #991b1b; }
          @media print {
            body { padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h1>AuraBistro &bull; Host Stand Daily Run Sheet</h1>
            <div class="meta">${dateStr} &bull; Generated for Front-of-House Service</div>
          </div>
          <button onclick="window.print()" style="padding: 8px 16px; font-size: 14px; background: #e11d48; color: white; border: none; border-radius: 6px; cursor: pointer;">
            Print Sheet
          </button>
        </div>

        <div class="stats">
          <div class="stat-item"><strong>${metrics.totalReservations}</strong> Total Bookings</div>
          <div class="stat-item"><strong>${metrics.totalExpectedGuests}</strong> Total Diners</div>
          <div class="stat-item"><strong>${metrics.occupancyRate}%</strong> Current Occupancy</div>
          <div class="stat-item"><strong>${metrics.availableTables} / ${metrics.totalTables}</strong> Tables Available</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Guest Name</th>
              <th>Party</th>
              <th>Table</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Dietary &amp; Special Requests</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
    </html>
  `);

  printWindow.document.close();
}

