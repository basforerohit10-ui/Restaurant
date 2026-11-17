import React, { useState, useEffect, useMemo } from 'react';
import { Users, Calendar, Clock, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { useRestaurant } from '../../hooks/useRestaurant';
import { INITIAL_SECTIONS } from '../../data/initialData';

export default function ReservationForm({
  initialData = null,
  onSubmit,
  onCancel,
  preselectedTable = null
}) {
  const { tables } = useRestaurant();

  const [formData, setFormData] = useState({
    guestName: '',
    phone: '',
    email: '',
    partySize: 2,
    section: 'main',
    tableId: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    occasion: 'Casual Dining',
    specialRequests: '',
    status: 'confirmed'
  });

  const [errors, setErrors] = useState({});

  // Populate data if editing or preselected
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        partySize: Number(initialData.partySize) || 2
      });
    } else if (preselectedTable) {
      setFormData(prev => ({
        ...prev,
        tableId: preselectedTable.id,
        section: preselectedTable.section,
        partySize: preselectedTable.capacity
      }));
    }
  }, [initialData, preselectedTable]);

  // Dynamic table suggestions using JavaScript array filter()
  // Filter tables that:
  // 1. Have capacity >= partySize
  // 2. Belong to the selected section (unless section is 'all')
  // 3. Are available (or currently assigned to this reservation)
  const compatibleTables = useMemo(() => {
    return tables.filter(table => {
      const capacityMatches = table.capacity >= Number(formData.partySize);
      const sectionMatches = formData.section === 'all' || table.section === formData.section;
      const isAvailableOrCurrent = table.status === 'available' || table.id === formData.tableId;
      return capacityMatches && sectionMatches && isAvailableOrCurrent;
    });
  }, [tables, formData.partySize, formData.section, formData.tableId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'partySize' ? Number(value) : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.guestName.trim()) {
      newErrors.guestName = 'Guest name is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact phone number is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.time) {
      newErrors.time = 'Time is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  const occasions = [
    'Casual Dining',
    'Birthday',
    'Anniversary',
    'Date Night',
    'Business Dinner',
    'Family Gathering',
    'Celebration'
  ];

  const timeSlots = [
    '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30',
    '21:00', '21:30', '22:00'
  ];

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Guest Name & Phone */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div>
          <label
            htmlFor="guestName"
            style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}
          >
            Guest Full Name *
          </label>
          <input
            type="text"
            id="guestName"
            name="guestName"
            value={formData.guestName}
            onChange={handleChange}
            placeholder="e.g. Liam Gallagher"
            style={{
              width: '100%',
              padding: '10px 12px',
              backgroundColor: '#0f172a',
              border: `1px solid ${errors.guestName ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '0.88rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          {errors.guestName && (
            <span style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertCircle size={12} /> {errors.guestName}
            </span>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}
          >
            Contact Phone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. +1 (555) 019-2834"
            style={{
              width: '100%',
              padding: '10px 12px',
              backgroundColor: '#0f172a',
              border: `1px solid ${errors.phone ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '0.88rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          {errors.phone && (
            <span style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertCircle size={12} /> {errors.phone}
            </span>
          )}
        </div>
      </div>

      {/* Email & Party Size */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
        <div>
          <label
            htmlFor="email"
            style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}
          >
            Email Address (Optional)
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. guest@example.com"
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
          <label
            htmlFor="partySize"
            style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}
          >
            Party Size (Guests)
          </label>
          <div style={{ position: 'relative' }}>
            <select
              id="partySize"
              name="partySize"
              value={formData.partySize}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '0.88rem',
                outline: 'none',
                boxSizing: 'border-box',
                cursor: 'pointer'
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Date & Time Slot */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div>
          <label
            htmlFor="date"
            style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}
          >
            Reservation Date *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
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
          <label
            htmlFor="time"
            style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}
          >
            Time Slot *
          </label>
          <select
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px 12px',
              backgroundColor: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '0.88rem',
              outline: 'none',
              boxSizing: 'border-box',
              cursor: 'pointer'
            }}
          >
            {timeSlots.map(slot => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dining Section & Table Assignment */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div>
          <label
            htmlFor="section"
            style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}
          >
            Area Section Preference
          </label>
          <select
            id="section"
            name="section"
            value={formData.section}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px 12px',
              backgroundColor: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '0.88rem',
              outline: 'none',
              boxSizing: 'border-box',
              cursor: 'pointer'
            }}
          >
            {INITIAL_SECTIONS.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="tableId"
            style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}
          >
            Table Assignment ({compatibleTables.length} Available)
          </label>
          <select
            id="tableId"
            name="tableId"
            value={formData.tableId}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px 12px',
              backgroundColor: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '0.88rem',
              outline: 'none',
              boxSizing: 'border-box',
              cursor: 'pointer'
            }}
          >
            <option value="">-- Assign Later / Auto-Assign --</option>
            {compatibleTables.map(t => (
              <option key={t.id} value={t.id}>
                Table #{t.number} ({t.capacity}p - {t.section})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Occasion & Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div>
          <label
            htmlFor="occasion"
            style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}
          >
            Dining Occasion
          </label>
          <select
            id="occasion"
            name="occasion"
            value={formData.occasion}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px 12px',
              backgroundColor: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '0.88rem',
              outline: 'none',
              boxSizing: 'border-box',
              cursor: 'pointer'
            }}
          >
            {occasions.map(occ => (
              <option key={occ} value={occ}>{occ}</option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="status"
            style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}
          >
            Initial Reservation Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px 12px',
              backgroundColor: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '0.88rem',
              outline: 'none',
              boxSizing: 'border-box',
              cursor: 'pointer'
            }}
          >
            <option value="confirmed">Confirmed</option>
            <option value="seated">Seated Immediately</option>
            <option value="pending">Pending Confirmation</option>
          </select>
        </div>
      </div>

      {/* Special Requests / Notes */}
      <div>
        <label
          htmlFor="specialRequests"
          style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}
        >
          Special Dietary Notes &amp; Guest Requests
        </label>
        <textarea
          id="specialRequests"
          name="specialRequests"
          rows={3}
          value={formData.specialRequests}
          onChange={handleChange}
          placeholder="e.g. Vegetarian, window booth preference, celebrating anniversary..."
          style={{
            width: '100%',
            padding: '10px 12px',
            backgroundColor: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: '#f8fafc',
            fontSize: '0.88rem',
            outline: 'none',
            boxSizing: 'border-box',
            resize: 'vertical'
          }}
        />
      </div>

      {/* Form Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '10px 18px',
            backgroundColor: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: '#94a3b8',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          style={{
            padding: '10px 24px',
            background: 'linear-gradient(135deg, #e11d48, #be123c)',
            border: 'none',
            borderRadius: '8px',
            color: '#ffffff',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(225, 29, 72, 0.35)'
          }}
        >
          {initialData ? 'Update Reservation' : 'Confirm Reservation'}
        </button>
      </div>
    </form>
  );
}

