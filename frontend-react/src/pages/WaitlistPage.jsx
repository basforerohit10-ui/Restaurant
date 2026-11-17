import React, { useState } from 'react';
import { UsersRound, Clock, Plus, UserCheck, Trash2, Phone, AlertCircle } from 'lucide-react';
import Modal from '../components/common/Modal';
import { useRestaurant } from '../hooks/useRestaurant';
import { INITIAL_SECTIONS } from '../data/initialData';

export default function WaitlistPage() {
  const { waitlist, tables, addToWaitlist, seatWaitlistGuest, removeWaitlistGuest } = useRestaurant();

  // Add Walk-in Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [walkinData, setWalkinData] = useState({
    guestName: '',
    phone: '',
    partySize: 2,
    sectionPreference: 'all',
    quotedWaitMinutes: 15,
    notes: ''
  });

  // Seat Waitlist Modal State
  const [seatingEntry, setSeatingEntry] = useState(null);
  const [selectedTableId, setSelectedTableId] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!walkinData.guestName.trim()) return;

    addToWaitlist({
      ...walkinData,
      partySize: Number(walkinData.partySize),
      quotedWaitMinutes: Number(walkinData.quotedWaitMinutes)
    });

    setIsAddOpen(false);
    setWalkinData({
      guestName: '',
      phone: '',
      partySize: 2,
      sectionPreference: 'all',
      quotedWaitMinutes: 15,
      notes: ''
    });
  };

  const handleSeatSubmit = (e) => {
    e.preventDefault();
    if (!seatingEntry || !selectedTableId) return;

    seatWaitlistGuest(seatingEntry.id, selectedTableId);
    setSeatingEntry(null);
    setSelectedTableId('');
  };

  // Find compatible available tables for this waitlist party
  const compatibleAvailableTables = seatingEntry
    ? tables.filter(t => t.status === 'available' && t.capacity >= seatingEntry.partySize)
    : [];

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
            Walk-In Waitlist &amp; Queue Management
          </h2>
          <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.88rem' }}>
            Track unbooked walk-in diners, manage queue positions, and seat parties as tables clear.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
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
          <span>Add Walk-In Party</span>
        </button>
      </div>

      {/* Waitlist Queue Grid */}
      {waitlist.length === 0 ? (
        <div
          style={{
            background: '#1e293b',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '3.5rem 1.5rem',
            textAlign: 'center',
            color: '#94a3b8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b'
            }}
          >
            <UsersRound size={28} />
          </div>
          <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.15rem' }}>No Parties Currently on Waitlist</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', maxWidth: '360px' }}>
            The walk-in queue is empty. Click "Add Walk-In Party" when unreserved guests arrive at the host stand.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}
        >
          {waitlist.map((entry, index) => (
            <div
              key={entry.id}
              style={{
                background: '#1e293b',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        background: '#e11d48',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      #{index + 1}
                    </span>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                      {entry.guestName}
                    </h3>
                  </div>

                  <span
                    style={{
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#f59e0b',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '4px 8px',
                      borderRadius: '6px'
                    }}
                  >
                    ~{entry.quotedWaitMinutes}m wait
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: '#94a3b8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} />
                    <span>Added at {entry.addedAt} • Prefers: {entry.sectionPreference}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} />
                    <span>{entry.phone || 'No phone provided'}</span>
                  </div>
                  <div style={{ color: '#cbd5e1', fontWeight: 600 }}>
                    Party Size: {entry.partySize} Guests
                  </div>
                  {entry.notes && (
                    <div style={{ fontStyle: 'italic', color: '#fb7185', marginTop: '2px' }}>
                      "{entry.notes}"
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <button
                  type="button"
                  onClick={() => {
                    setSeatingEntry(entry);
                    setSelectedTableId('');
                  }}
                  style={{
                    flex: 1,
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <UserCheck size={16} />
                  <span>Seat Party Now</span>
                </button>

                <button
                  type="button"
                  onClick={() => removeWaitlistGuest(entry.id)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    cursor: 'pointer'
                  }}
                  title="Remove from waitlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Walk-in Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Walk-In Diner to Waitlist"
        subtitle="Collect party details and quote estimated turnaround wait time"
      >
        <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
              Guest / Party Name *
            </label>
            <input
              type="text"
              required
              value={walkinData.guestName}
              onChange={(e) => setWalkinData(prev => ({ ...prev, guestName: e.target.value }))}
              placeholder="e.g. Rachel Adams"
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '0.88rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                Contact Phone
              </label>
              <input
                type="tel"
                value={walkinData.phone}
                onChange={(e) => setWalkinData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 (555) 000-0000"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                Party Size
              </label>
              <select
                value={walkinData.partySize}
                onChange={(e) => setWalkinData(prev => ({ ...prev, partySize: Number(e.target.value) }))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '0.88rem',
                  outline: 'none',
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map(p => (
                  <option key={p} value={p}>{p} {p === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                Area Preference
              </label>
              <select
                value={walkinData.sectionPreference}
                onChange={(e) => setWalkinData(prev => ({ ...prev, sectionPreference: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '0.88rem',
                  outline: 'none',
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
              >
                <option value="First Available">First Available Area</option>
                {INITIAL_SECTIONS.filter(s => s.id !== 'all').map(sec => (
                  <option key={sec.id} value={sec.name}>{sec.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                Quoted Wait Time
              </label>
              <select
                value={walkinData.quotedWaitMinutes}
                onChange={(e) => setWalkinData(prev => ({ ...prev, quotedWaitMinutes: Number(e.target.value) }))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '0.88rem',
                  outline: 'none',
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
              >
                {[5, 10, 15, 20, 30, 45, 60].map(m => (
                  <option key={m} value={m}>{m} minutes</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
              Notes / Location (e.g. Waiting at Bar)
            </label>
            <input
              type="text"
              value={walkinData.notes}
              onChange={(e) => setWalkinData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="e.g. Having cocktails at bar counter, high chair requested..."
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '0.88rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
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
              style={{
                padding: '10px 20px',
                background: '#e11d48',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Add to Waitlist
            </button>
          </div>
        </form>
      </Modal>

      {/* Seat Waitlist Guest Modal */}
      <Modal
        isOpen={!!seatingEntry}
        onClose={() => setSeatingEntry(null)}
        title="Seat Waitlist Party"
        subtitle={`Select an open table for ${seatingEntry?.guestName} (Party of ${seatingEntry?.partySize})`}
      >
        {seatingEntry && (
          <form onSubmit={handleSeatSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
                Open Tables with Capacity ≥ {seatingEntry.partySize}:
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
                  No tables are currently open with sufficient capacity for {seatingEntry.partySize} guests. Please clear an occupied table first.
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
                onClick={() => setSeatingEntry(null)}
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

