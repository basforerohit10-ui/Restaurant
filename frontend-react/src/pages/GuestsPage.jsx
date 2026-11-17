import React, { useState, useMemo } from 'react';
import { UserCheck, Star, Phone, Mail, Calendar, Sparkles, AlertTriangle, Utensils, Heart } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import { useRestaurant } from '../hooks/useRestaurant';
import { formatDate } from '../utils/formatters';

export default function GuestsPage({ onOpenNewReservationForGuest }) {
  const { reservations } = useRestaurant();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'vip' | 'allergies'

  // Aggregate unique guest profiles from reservations using Array.reduce
  const guestProfiles = useMemo(() => {
    const profileMap = reservations.reduce((acc, res) => {
      const key = res.email || res.phone || res.guestName.toLowerCase().trim();

      if (!acc[key]) {
        acc[key] = {
          id: key,
          name: res.guestName,
          phone: res.phone,
          email: res.email,
          totalVisits: 0,
          totalCovers: 0,
          lastVisit: res.date,
          occasions: new Set(),
          specialRequests: [],
          isVip: false
        };
      }

      acc[key].totalVisits += 1;
      acc[key].totalCovers += Number(res.partySize || 0);
      if (res.occasion) acc[key].occasions.add(res.occasion);
      if (res.specialRequests) acc[key].specialRequests.push(res.specialRequests);

      // VIP rule: visited 2+ times or booked VIP occasion/large party
      if (acc[key].totalVisits >= 2 || res.occasion === 'VIP Dinner' || res.partySize >= 6) {
        acc[key].isVip = true;
      }

      return acc;
    }, {});

    return Object.values(profileMap).map(profile => ({
      ...profile,
      occasions: Array.from(profile.occasions)
    }));
  }, [reservations]);

  // Filter guest profiles using Array.filter
  const filteredGuests = useMemo(() => {
    return guestProfiles.filter(guest => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        guest.name.toLowerCase().includes(q) ||
        (guest.phone && guest.phone.includes(q)) ||
        (guest.email && guest.email.toLowerCase().includes(q));

      const matchesFilter =
        filterType === 'all' ||
        (filterType === 'vip' && guest.isVip) ||
        (filterType === 'allergies' && guest.specialRequests.some(r => /allergy|gluten|vegan|vegetarian|dairy/i.test(r)));

      return matchesSearch && matchesFilter;
    });
  }, [guestProfiles, searchQuery, filterType]);

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fb7185', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <Sparkles size={16} />
            <span>Hospitality CRM &amp; History</span>
          </div>
          <h2 style={{ margin: '4px 0 0', fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
            Guest Directory &amp; VIP Recognition
          </h2>
          <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.88rem' }}>
            Track frequent dining guests, dietary restrictions, allergens, and hospitality preferences.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          background: '#1e293b',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '1.25rem'
        }}
      >
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search guest by name, phone number, or email..."
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {[
            { id: 'all', label: `All Guests (${guestProfiles.length})` },
            { id: 'vip', label: `VIP Members (${guestProfiles.filter(g => g.isVip).length})` },
            { id: 'allergies', label: 'Dietary Notes' }
          ].map(btn => {
            const isActive = filterType === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => setFilterType(btn.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: isActive ? '1px solid #e11d48' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isActive ? 'rgba(225, 29, 72, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                  color: isActive ? '#f8fafc' : '#94a3b8',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer'
                }}
              >
                {btn.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Guest Cards Grid */}
      {filteredGuests.length === 0 ? (
        <div
          style={{
            background: '#1e293b',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '3rem 1.5rem',
            textAlign: 'center',
            color: '#94a3b8'
          }}
        >
          <UserCheck size={36} color="#64748b" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ margin: 0, color: '#f8fafc' }}>No Guest Profiles Found</h3>
          <p style={{ margin: '6px 0 0', fontSize: '0.85rem' }}>
            No guest records match your search criteria.
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
          {filteredGuests.map(guest => (
            <div
              key={guest.id}
              style={{
                background: '#1e293b',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: guest.isVip ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                        border: `1px solid ${guest.isVip ? '#f59e0b' : '#3b82f6'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        color: guest.isVip ? '#f59e0b' : '#3b82f6',
                        fontSize: '0.9rem'
                      }}
                    >
                      {guest.name.charAt(0)}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.05rem', fontWeight: 700 }}>
                        {guest.name}
                      </h3>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        Last Visit: {formatDate(guest.lastVisit)}
                      </div>
                    </div>
                  </div>

                  {guest.isVip && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'rgba(245, 158, 11, 0.15)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        color: '#f59e0b',
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}
                    >
                      <Star size={11} fill="#f59e0b" />
                      <span>VIP</span>
                    </span>
                  )}
                </div>

                {/* Metrics */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    padding: '8px 10px',
                    backgroundColor: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: '#cbd5e1',
                    marginBottom: '10px'
                  }}
                >
                  <div>
                    <span style={{ color: '#94a3b8' }}>Visits: </span>
                    <strong>{guest.totalVisits}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Total Guests: </span>
                    <strong>{guest.totalCovers}</strong>
                  </div>
                </div>

                {/* Contact info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem', color: '#94a3b8' }}>
                  {guest.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={13} />
                      <span>{guest.phone}</span>
                    </div>
                  )}
                  {guest.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={13} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {guest.email}
                      </span>
                    </div>
                  )}
                </div>

                {/* Dietary requests */}
                {guest.specialRequests.length > 0 && (
                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#fb7185', fontWeight: 600 }}>
                      Preferences &amp; Notes:
                    </div>
                    {guest.specialRequests.slice(0, 2).map((req, i) => (
                      <div
                        key={i}
                        style={{
                          fontSize: '0.75rem',
                          color: '#cbd5e1',
                          fontStyle: 'italic',
                          background: 'rgba(255, 255, 255, 0.04)',
                          padding: '4px 8px',
                          borderRadius: '6px'
                        }}
                      >
                        "{req}"
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <button
                  type="button"
                  onClick={() => onOpenNewReservationForGuest && onOpenNewReservationForGuest(guest)}
                  style={{
                    width: '100%',
                    background: '#e11d48',
                    border: 'none',
                    color: 'white',
                    borderRadius: '8px',
                    padding: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Utensils size={14} />
                  <span>Book Table for {guest.name.split(' ')[0]}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

