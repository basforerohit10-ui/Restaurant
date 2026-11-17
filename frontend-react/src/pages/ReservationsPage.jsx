import React, { useState, useMemo } from 'react';
import ReservationFilters from '../components/reservations/ReservationFilters';
import ReservationList from '../components/reservations/ReservationList';
import ReservationForm from '../components/reservations/ReservationForm';
import Modal from '../components/common/Modal';
import { Plus, Download, Printer } from 'lucide-react';
import { useRestaurant } from '../hooks/useRestaurant';
import { exportReservationsToCSV, printShiftRunSheet } from '../utils/exportManifest';

export default function ReservationsPage({ onOpenNewReservation }) {
  const { reservations, tables, metrics, updateReservation, seatReservation } = useRestaurant();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Modals state
  const [editingReservation, setEditingReservation] = useState(null);
  const [assigningReservation, setAssigningReservation] = useState(null);
  const [selectedTableId, setSelectedTableId] = useState('');

  // Comprehensive filter using JavaScript array filter()
  const filteredReservations = useMemo(() => {
    return reservations.filter(res => {
      // 1. Search Query filter (matches guest name, phone, email, or id)
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        res.guestName.toLowerCase().includes(query) ||
        (res.phone && res.phone.includes(query)) ||
        (res.email && res.email.toLowerCase().includes(query)) ||
        res.id.toLowerCase().includes(query);

      // 2. Status filter
      const matchesStatus = statusFilter === 'all' || res.status === statusFilter;

      // 3. Date filter
      const matchesDate = !dateFilter || res.date === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [reservations, searchQuery, statusFilter, dateFilter]);

  // Handle Edit Submission
  const handleEditSubmit = (updatedData) => {
    if (!editingReservation) return;
    updateReservation(editingReservation.id, updatedData);
    setEditingReservation(null);
  };

  // Handle Assign Table & Seat
  const handleAssignTableSubmit = (e) => {
    e.preventDefault();
    if (!assigningReservation || !selectedTableId) return;

    seatReservation(assigningReservation.id, selectedTableId);
    setAssigningReservation(null);
    setSelectedTableId('');
  };

  // Compatible available tables for assigning using filter()
  const compatibleAvailableTables = useMemo(() => {
    if (!assigningReservation) return [];
    return tables.filter(
      t => t.status === 'available' && t.capacity >= assigningReservation.partySize
    );
  }, [tables, assigningReservation]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
            Reservation Management
          </h2>
          <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.88rem' }}>
            Manage upcoming bookings, seating assignments, meal status, and guest dietary requirements.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => exportReservationsToCSV(filteredReservations, tables)}
            title="Download CSV spreadsheet of current reservations"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#f8fafc',
              borderRadius: '10px',
              padding: '10px 14px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => printShiftRunSheet(reservations, tables, metrics)}
            title="Print Front-of-House guest run sheet"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#f8fafc',
              borderRadius: '10px',
              padding: '10px 14px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Printer size={16} />
            <span>Print Sheet</span>
          </button>

          <button
            type="button"
            onClick={onOpenNewReservation}
            style={{
              background: 'linear-gradient(135deg, #e11d48, #be123c)',
              border: 'none',
              color: 'white',
              borderRadius: '10px',
              padding: '10px 16px',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(225, 29, 72, 0.35)'
            }}
          >
            <Plus size={18} />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <ReservationFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
      />

      {/* List / Grid of Reservations */}
      <ReservationList
        reservations={filteredReservations}
        viewMode={viewMode}
        onEdit={(res) => setEditingReservation(res)}
        onAssignTable={(res) => {
          setAssigningReservation(res);
          setSelectedTableId('');
        }}
      />

      {/* Edit Reservation Modal */}
      <Modal
        isOpen={!!editingReservation}
        onClose={() => setEditingReservation(null)}
        title="Edit Reservation Details"
        subtitle={`Modifying booking details for ${editingReservation?.guestName} (${editingReservation?.id})`}
      >
        {editingReservation && (
          <ReservationForm
            initialData={editingReservation}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingReservation(null)}
          />
        )}
      </Modal>

      {/* Assign Table & Seat Modal */}
      <Modal
        isOpen={!!assigningReservation}
        onClose={() => setAssigningReservation(null)}
        title="Assign Table & Seat Guest"
        subtitle={`Select an available table for ${assigningReservation?.guestName} (Party of ${assigningReservation?.partySize})`}
      >
        {assigningReservation && (
          <form onSubmit={handleAssignTableSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
                Select Open Compatible Table:
              </label>

              {compatibleAvailableTables.length === 0 ? (
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#f87171',
                    fontSize: '0.85rem'
                  }}
                >
                  No tables currently available with capacity for {assigningReservation.partySize} guests. Free a table or adjust seating.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                  {compatibleAvailableTables.map(tbl => {
                    const isSelected = selectedTableId === tbl.id;
                    return (
                      <div
                        key={tbl.id}
                        onClick={() => setSelectedTableId(tbl.id)}
                        style={{
                          padding: '12px',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                          backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '1rem' }}>
                          Table #{tbl.number}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'capitalize' }}>
                          {tbl.section} • {tbl.capacity}p
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setAssigningReservation(null)}
                style={{
                  padding: '10px 16px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedTableId}
                style={{
                  padding: '10px 20px',
                  background: selectedTableId ? '#10b981' : '#475569',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: 600,
                  cursor: selectedTableId ? 'pointer' : 'not-allowed'
                }}
              >
                Seat at Table
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
