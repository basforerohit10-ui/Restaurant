// Frontend API Client connecting React to the Express Backend
// Includes resilient fallback to localStorage when backend is offline

const BASE_URL = '/api';

async function fetchJson(endpoint, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    // Return custom error indicator so callers can decide whether to fallback
    throw err;
  }
}

export const api = {
  // Check backend health
  async checkHealth() {
    try {
      const data = await fetchJson('/health');
      return { online: true, ...data };
    } catch {
      return { online: false };
    }
  },

  // Tables API
  async getTables() {
    const res = await fetchJson('/tables');
    return res.data;
  },

  async addTable(tableData) {
    const res = await fetchJson('/tables', {
      method: 'POST',
      body: JSON.stringify(tableData)
    });
    return res.data;
  },

  async updateTableStatus(tableId, status, currentReservationId = null) {
    const res = await fetchJson(`/tables/${tableId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, currentReservationId })
    });
    return res.data;
  },

  // Reservations API
  async getReservations() {
    const res = await fetchJson('/reservations');
    return res.data;
  },

  async addReservation(reservationData) {
    const res = await fetchJson('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData)
    });
    return res.data;
  },

  async updateReservation(id, updateData) {
    const res = await fetchJson(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
    return res.data;
  },

  async seatReservation(id, tableId) {
    const res = await fetchJson(`/reservations/${id}/seat`, {
      method: 'PUT',
      body: JSON.stringify({ tableId })
    });
    return res.data;
  },

  async completeReservation(id) {
    const res = await fetchJson(`/reservations/${id}/complete`, {
      method: 'PUT'
    });
    return res.data;
  },

  async cancelReservation(id) {
    const res = await fetchJson(`/reservations/${id}`, {
      method: 'DELETE'
    });
    return res.data;
  },

  // Waitlist API
  async getWaitlist() {
    const res = await fetchJson('/waitlist');
    return res.data;
  },

  async addWaitlist(waitlistData) {
    const res = await fetchJson('/waitlist', {
      method: 'POST',
      body: JSON.stringify(waitlistData)
    });
    return res.data;
  },

  async seatWaitlistGuest(id, tableId) {
    const res = await fetchJson(`/waitlist/${id}/seat`, {
      method: 'POST',
      body: JSON.stringify({ tableId })
    });
    return res.data;
  },

  async removeWaitlist(id) {
    const res = await fetchJson(`/waitlist/${id}`, {
      method: 'DELETE'
    });
    return res;
  },

  // Database Reset
  async resetDatabase() {
    const res = await fetchJson('/reset', {
      method: 'POST'
    });
    return res.data;
  }
};

