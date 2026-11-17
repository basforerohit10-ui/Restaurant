import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { INITIAL_TABLES, INITIAL_RESERVATIONS, INITIAL_WAITLIST } from '../data/initialData';
import { api } from '../services/api';
import { soundManager } from '../utils/audio';

const RestaurantContext = createContext(null);

const STORAGE_KEYS = {
  TABLES: 'aurabistro_tables_v1',
  RESERVATIONS: 'aurabistro_reservations_v1',
  WAITLIST: 'aurabistro_waitlist_v1'
};

export function RestaurantProvider({ children }) {
  // Backend connection status
  const [backendOnline, setBackendOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 1. State initialization with localStorage fallback
  const [tables, setTables] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TABLES);
      return saved ? JSON.parse(saved) : INITIAL_TABLES;
    } catch {
      return INITIAL_TABLES;
    }
  });

  const [reservations, setReservations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
      return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
    } catch {
      return INITIAL_RESERVATIONS;
    }
  });

  const [waitlist, setWaitlist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WAITLIST);
      return saved ? JSON.parse(saved) : INITIAL_WAITLIST;
    } catch {
      return INITIAL_WAITLIST;
    }
  });

  // Global toast notification state
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // 2. Initial Data Fetch from Express Backend
  useEffect(() => {
    let mounted = true;

    async function loadBackendData() {
      try {
        const health = await api.checkHealth();
        if (health.online && mounted) {
          setBackendOnline(true);
          const [fetchedTables, fetchedReservations, fetchedWaitlist] = await Promise.all([
            api.getTables().catch(() => null),
            api.getReservations().catch(() => null),
            api.getWaitlist().catch(() => null)
          ]);

          if (mounted) {
            if (fetchedTables) setTables(fetchedTables);
            if (fetchedReservations) setReservations(fetchedReservations);
            if (fetchedWaitlist) setWaitlist(fetchedWaitlist);
            showToast('Connected to Express REST Backend', 'success');
          }
        } else if (mounted) {
          setBackendOnline(false);
        }
      } catch {
        if (mounted) setBackendOnline(false);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadBackendData();
    return () => { mounted = false; };
  }, [showToast]);

  // Persistent storage synchronization with useEffect hook as local backup
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
    } catch (err) {
      console.error('Failed to sync tables to localStorage', err);
    }
  }, [tables]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
    } catch (err) {
      console.error('Failed to sync reservations to localStorage', err);
    }
  }, [reservations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WAITLIST, JSON.stringify(waitlist));
    } catch (err) {
      console.error('Failed to sync waitlist to localStorage', err);
    }
  }, [waitlist]);

  // 3. Computed Metrics via JavaScript Array Operations & useMemo
  const metrics = useMemo(() => {
    const totalTables = tables.length;
    const availableTables = tables.filter(t => t.status === 'available').length;
    const occupiedTables = tables.filter(t => t.status === 'occupied').length;
    const reservedTables = tables.filter(t => t.status === 'reserved').length;
    const maintenanceTables = tables.filter(t => t.status === 'maintenance').length;
    const activeOccupiedOrReserved = occupiedTables + reservedTables;
    const occupancyRate = totalTables > 0 ? Math.round((activeOccupiedOrReserved / totalTables) * 100) : 0;

    const totalReservations = reservations.length;
    const seatedReservations = reservations.filter(r => r.status === 'seated');
    const confirmedReservations = reservations.filter(r => r.status === 'confirmed');
    const pendingReservations = reservations.filter(r => r.status === 'pending');
    
    // JS reduce operation to calculate total guests seated
    const totalSeatedGuests = seatedReservations.reduce((sum, res) => sum + Number(res.partySize || 0), 0);
    const totalExpectedGuests = reservations
      .filter(r => r.status !== 'cancelled')
      .reduce((sum, res) => sum + Number(res.partySize || 0), 0);

    const activeWaitlistCount = waitlist.filter(w => w.status === 'waiting' || w.status === 'notified').length;

    return {
      totalTables,
      availableTables,
      occupiedTables,
      reservedTables,
      maintenanceTables,
      occupancyRate,
      totalReservations,
      seatedCount: seatedReservations.length,
      confirmedCount: confirmedReservations.length,
      pendingCount: pendingReservations.length,
      totalSeatedGuests,
      totalExpectedGuests,
      activeWaitlistCount
    };
  }, [tables, reservations, waitlist]);

  // 4. Action Handlers for Reservations and Table Management

  // Add a new reservation
  const addReservation = useCallback(async (reservationData) => {
    const newId = `RES-${String(Date.now()).slice(-4)}`;
    const newReservation = {
      ...reservationData,
      id: newId,
      createdAt: new Date().toISOString()
    };

    // Optimistic UI update
    setReservations(prev => [newReservation, ...prev]);

    if (newReservation.tableId) {
      setTables(prevTables =>
        prevTables.map(t => {
          if (t.id === newReservation.tableId) {
            const newStatus = newReservation.status === 'seated' ? 'occupied' : 'reserved';
            return { ...t, status: newStatus, currentReservationId: newId };
          }
          return t;
        })
      );
    }

    soundManager.playSuccess();
    showToast(`Reservation created for ${newReservation.guestName} (${newReservation.partySize} guests)`, 'success');

    // Async Backend API sync
    if (backendOnline) {
      try {
        await api.addReservation(newReservation);
      } catch (err) {
        console.warn('Backend sync failed, state preserved locally:', err);
      }
    }

    return newReservation;
  }, [backendOnline, showToast]);

  // Update existing reservation
  const updateReservation = useCallback(async (id, updatedData) => {
    setReservations(prev =>
      prev.map(r => {
        if (r.id === id) {
          const oldTableId = r.tableId;
          const newTableId = updatedData.tableId;

          if (oldTableId && oldTableId !== newTableId) {
            setTables(tablesPrev =>
              tablesPrev.map(t => (t.id === oldTableId ? { ...t, status: 'available', currentReservationId: null } : t))
            );
          }
          if (newTableId) {
            setTables(tablesPrev =>
              tablesPrev.map(t => {
                if (t.id === newTableId) {
                  const targetStatus = updatedData.status === 'seated' ? 'occupied' : 'reserved';
                  return { ...t, status: targetStatus, currentReservationId: id };
                }
                return t;
              })
            );
          }

          return { ...r, ...updatedData };
        }
        return r;
      })
    );

    showToast('Reservation updated successfully', 'info');

    if (backendOnline) {
      try {
        await api.updateReservation(id, updatedData);
      } catch (err) {
        console.warn('Backend sync failed:', err);
      }
    }
  }, [backendOnline, showToast]);

  // Cancel reservation
  const cancelReservation = useCallback(async (id) => {
    const target = reservations.find(r => r.id === id);
    if (!target) return;

    setReservations(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'cancelled' } : r))
    );

    if (target.tableId) {
      setTables(prevTables =>
        prevTables.map(t => (t.id === target.tableId ? { ...t, status: 'available', currentReservationId: null } : t))
      );
    }

    showToast(`Reservation for ${target.guestName} cancelled`, 'warning');

    if (backendOnline) {
      try {
        await api.cancelReservation(id);
      } catch (err) {
        console.warn('Backend sync failed:', err);
      }
    }
  }, [reservations, backendOnline, showToast]);

  // Seat a reservation directly at a table
  const seatReservation = useCallback(async (reservationId, targetTableId) => {
    const targetReservation = reservations.find(r => r.id === reservationId);
    if (!targetReservation) return;

    const assignedTableId = targetTableId || targetReservation.tableId;
    if (!assignedTableId) {
      showToast('Please assign a table before seating the guest', 'warning');
      return;
    }

    setReservations(prev =>
      prev.map(r => (r.id === reservationId ? { ...r, status: 'seated', tableId: assignedTableId } : r))
    );

    setTables(prev =>
      prev.map(t => (t.id === assignedTableId ? { ...t, status: 'occupied', currentReservationId: reservationId } : t))
    );

    soundManager.playSeat();
    showToast(`${targetReservation.guestName} has been seated at Table ${assignedTableId}`, 'success');

    if (backendOnline) {
      try {
        await api.seatReservation(reservationId, assignedTableId);
      } catch (err) {
        console.warn('Backend sync failed:', err);
      }
    }
  }, [reservations, backendOnline, showToast]);

  // Complete a seated dining session and free the table
  const completeReservation = useCallback(async (reservationId) => {
    const targetReservation = reservations.find(r => r.id === reservationId);
    if (!targetReservation) return;

    setReservations(prev =>
      prev.map(r => (r.id === reservationId ? { ...r, status: 'completed' } : r))
    );

    if (targetReservation.tableId) {
      setTables(prev =>
        prev.map(t => (t.id === targetReservation.tableId ? { ...t, status: 'available', currentReservationId: null } : t))
      );
    }

    soundManager.playClear();
    showToast(`Table cleared. Dining completed for ${targetReservation.guestName}`, 'success');

    if (backendOnline) {
      try {
        await api.completeReservation(reservationId);
      } catch (err) {
        console.warn('Backend sync failed:', err);
      }
    }
  }, [reservations, backendOnline, showToast]);

  // Direct table status toggle (e.g. from Floor Plan)
  const updateTableStatus = useCallback(async (tableId, newStatus, newReservationId = null) => {
    setTables(prev =>
      prev.map(t => {
        if (t.id === tableId) {
          return {
            ...t,
            status: newStatus,
            currentReservationId: newStatus === 'available' || newStatus === 'maintenance' ? null : (newReservationId || t.currentReservationId)
          };
        }
        return t;
      })
    );

    showToast(`Table #${tableId} status updated to ${newStatus.toUpperCase()}`, 'info');

    if (backendOnline) {
      try {
        await api.updateTableStatus(tableId, newStatus, newReservationId);
      } catch (err) {
        console.warn('Backend sync failed:', err);
      }
    }
  }, [backendOnline, showToast]);

  // Add new custom table
  const addTable = useCallback(async (tableData) => {
    const newId = `T-${tableData.number}`;
    const newTable = {
      ...tableData,
      id: newId,
      status: 'available',
      currentReservationId: null,
      x: 50,
      y: 50
    };

    setTables(prev => [...prev, newTable]);
    showToast(`Table #${tableData.number} added successfully`, 'success');

    if (backendOnline) {
      try {
        await api.addTable(newTable);
      } catch (err) {
        console.warn('Backend sync failed:', err);
      }
    }
  }, [backendOnline, showToast]);

  // Waitlist actions
  const addToWaitlist = useCallback(async (waitlistData) => {
    const newId = `WAIT-${String(Date.now()).slice(-3)}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newEntry = {
      ...waitlistData,
      id: newId,
      addedAt: timeStr,
      status: 'waiting'
    };

    setWaitlist(prev => [...prev, newEntry]);
    showToast(`Added ${newEntry.guestName} to waitlist (~${newEntry.quotedWaitMinutes} min wait)`, 'success');

    if (backendOnline) {
      try {
        await api.addWaitlist(newEntry);
      } catch (err) {
        console.warn('Backend sync failed:', err);
      }
    }
  }, [backendOnline, showToast]);

  const seatWaitlistGuest = useCallback(async (waitlistId, tableId) => {
    const entry = waitlist.find(w => w.id === waitlistId);
    if (!entry) return;

    setWaitlist(prev => prev.filter(w => w.id !== waitlistId));

    const newResId = `RES-${String(Date.now()).slice(-4)}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newRes = {
      id: newResId,
      guestName: entry.guestName,
      phone: entry.phone,
      email: '',
      partySize: entry.partySize,
      tableId: tableId,
      date: new Date().toISOString().split('T')[0],
      time: timeStr,
      status: 'seated',
      occasion: 'Walk-in',
      specialRequests: entry.notes || 'Walk-in guest from waitlist',
      source: 'Walk-in',
      createdAt: new Date().toISOString()
    };

    setReservations(prev => [newRes, ...prev]);

    setTables(prev =>
      prev.map(t => (t.id === tableId ? { ...t, status: 'occupied', currentReservationId: newResId } : t))
    );

    soundManager.playSeat();
    showToast(`Seated waitlist guest ${entry.guestName} at Table ${tableId}`, 'success');

    if (backendOnline) {
      try {
        await api.seatWaitlistGuest(waitlistId, tableId);
      } catch (err) {
        console.warn('Backend sync failed:', err);
      }
    }
  }, [waitlist, backendOnline, showToast]);

  const removeWaitlistGuest = useCallback(async (waitlistId) => {
    setWaitlist(prev => prev.filter(w => w.id !== waitlistId));
    showToast('Guest removed from waitlist', 'info');

    if (backendOnline) {
      try {
        await api.removeWaitlist(waitlistId);
      } catch (err) {
        console.warn('Backend sync failed:', err);
      }
    }
  }, [backendOnline, showToast]);

  // Reset to original demo seed data
  const resetToDemoData = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEYS.TABLES);
    localStorage.removeItem(STORAGE_KEYS.RESERVATIONS);
    localStorage.removeItem(STORAGE_KEYS.WAITLIST);
    setTables(INITIAL_TABLES);
    setReservations(INITIAL_RESERVATIONS);
    setWaitlist(INITIAL_WAITLIST);
    showToast('Reset system to pristine demo seed data', 'info');

    if (backendOnline) {
      try {
        await api.resetDatabase();
      } catch (err) {
        console.warn('Backend reset failed:', err);
      }
    }
  }, [backendOnline, showToast]);

  const value = {
    backendOnline,
    isLoading,
    tables,
    reservations,
    waitlist,
    metrics,
    toast,
    showToast,
    hideToast,
    addReservation,
    updateReservation,
    cancelReservation,
    seatReservation,
    completeReservation,
    updateTableStatus,
    addTable,
    addToWaitlist,
    seatWaitlistGuest,
    removeWaitlistGuest,
    resetToDemoData
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}
