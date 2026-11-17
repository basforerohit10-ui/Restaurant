import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Modal from './components/common/Modal';
import Toast from './components/common/Toast';
import ReservationForm from './components/reservations/ReservationForm';
import DashboardPage from './pages/DashboardPage';
import TablesPage from './pages/TablesPage';
import ReservationsPage from './pages/ReservationsPage';
import WaitlistPage from './pages/WaitlistPage';
import GuestsPage from './pages/GuestsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ConverterPage from './pages/ConverterPage';
import { useRestaurant } from './hooks/useRestaurant';

export default function App() {
  const { toast, hideToast, addReservation, updateTableStatus } = useRestaurant();

  // Mobile sidebar open/close state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // New Reservation Modal state
  const [isNewReservationOpen, setIsNewReservationOpen] = useState(false);
  const [preselectedTableForReservation, setPreselectedTableForReservation] = useState(null);
  const [preselectedGuest, setPreselectedGuest] = useState(null);

  // Fast Walk-In Seating Modal state
  const [fastSeatTable, setFastSeatTable] = useState(null);
  const [walkinName, setWalkinName] = useState('');
  const [walkinGuests, setWalkinGuests] = useState(2);

  const handleOpenNewReservation = (table = null, guest = null) => {
    setPreselectedTableForReservation(table);
    setPreselectedGuest(guest);
    setIsNewReservationOpen(true);
  };

  const handleReservationSubmit = (formData) => {
    addReservation(formData);
    setIsNewReservationOpen(false);
    setPreselectedTableForReservation(null);
    setPreselectedGuest(null);
  };

  const handleFastSeatSubmit = (e) => {
    e.preventDefault();
    if (!fastSeatTable || !walkinName.trim()) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    addReservation({
      guestName: walkinName.trim(),
      phone: 'Walk-In',
      email: '',
      partySize: Number(walkinGuests),
      tableId: fastSeatTable.id,
      date: new Date().toISOString().split('T')[0],
      time: timeStr,
      status: 'seated',
      occasion: 'Walk-In Dining',
      specialRequests: 'Seated immediately from Floor Management',
      source: 'Host Stand'
    });

    setFastSeatTable(null);
    setWalkinName('');
    setWalkinGuests(2);
  };

  return (
    <div className="app-container">
      {/* Top sticky Navbar */}
      <Navbar
        onOpenNewReservation={() => handleOpenNewReservation(null, null)}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
      />

      {/* Main app body: Sidebar + Content */}
      <div className="app-body">
        <Sidebar
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
        />

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <DashboardPage
                  onOpenNewReservation={() => handleOpenNewReservation(null, null)}
                  onSeatWalkIn={(table) => setFastSeatTable(table)}
                />
              }
            />
            <Route
              path="/tables"
              element={
                <TablesPage
                  onSeatWalkIn={(table) => setFastSeatTable(table)}
                />
              }
            />
            <Route
              path="/reservations"
              element={
                <ReservationsPage
                  onOpenNewReservation={() => handleOpenNewReservation(null, null)}
                />
              }
            />
            <Route
              path="/waitlist"
              element={<WaitlistPage />}
            />
            <Route
              path="/guests"
              element={
                <GuestsPage
                  onOpenNewReservationForGuest={(guest) => handleOpenNewReservation(null, guest)}
                />
              }
            />
            <Route
              path="/analytics"
              element={<AnalyticsPage />}
            />
            <Route
              path="/converter"
              element={<ConverterPage />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* New Reservation Modal */}
      <Modal
        isOpen={isNewReservationOpen}
        onClose={() => {
          setIsNewReservationOpen(false);
          setPreselectedTableForReservation(null);
          setPreselectedGuest(null);
        }}
        title="Create New Dining Reservation"
        subtitle={
          preselectedTableForReservation
            ? `Booking directly for Table #${preselectedTableForReservation.number} (${preselectedTableForReservation.capacity} Guests - ${preselectedTableForReservation.section})`
            : preselectedGuest
            ? `Booking for returning guest: ${preselectedGuest.name}`
            : 'Fill in guest information, party size, dining section, and seating schedule'
        }
      >
        <ReservationForm
          preselectedTable={preselectedTableForReservation}
          initialData={
            preselectedGuest
              ? {
                  guestName: preselectedGuest.name,
                  phone: preselectedGuest.phone || '',
                  email: preselectedGuest.email || '',
                  partySize: 2,
                  occasion: preselectedGuest.occasions?.[0] || 'Casual Dining',
                  specialRequests: preselectedGuest.specialRequests?.[0] || ''
                }
              : null
          }
          onSubmit={handleReservationSubmit}
          onCancel={() => {
            setIsNewReservationOpen(false);
            setPreselectedTableForReservation(null);
            setPreselectedGuest(null);
          }}
        />
      </Modal>

      {/* Fast Walk-In Seating Modal */}
      <Modal
        isOpen={!!fastSeatTable}
        onClose={() => setFastSeatTable(null)}
        title="Immediate Walk-In Seating"
        subtitle={`Seat dining party directly at Table #${fastSeatTable?.number} (${fastSeatTable?.capacity} guests capacity - ${fastSeatTable?.section})`}
      >
        {fastSeatTable && (
          <form onSubmit={handleFastSeatSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                Guest / Host Name *
              </label>
              <input
                type="text"
                required
                autoFocus
                value={walkinName}
                onChange={(e) => setWalkinName(e.target.value)}
                placeholder="e.g. David Hasselhoff"
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
                Number of Diners
              </label>
              <select
                value={walkinGuests}
                onChange={(e) => setWalkinGuests(Number(e.target.value))}
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
                {Array.from({ length: fastSeatTable.capacity }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'} (Max {fastSeatTable.capacity})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setFastSeatTable(null)}
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
                  background: '#10b981',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Seat at Table #{fastSeatTable.number}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Global Toast Notification */}
      <Toast toast={toast} onClose={hideToast} />
    </div>
  );
}
