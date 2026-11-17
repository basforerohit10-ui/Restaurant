import React, { useState, useMemo } from 'react';
import TableFilterBar from '../components/tables/TableFilterBar';
import TableGrid from '../components/tables/TableGrid';
import FloorPlan from '../components/tables/FloorPlan';
import TableTimeline from '../components/tables/TableTimeline';
import Modal from '../components/common/Modal';
import { Plus } from 'lucide-react';
import { useRestaurant } from '../hooks/useRestaurant';
import { INITIAL_SECTIONS } from '../data/initialData';

export default function TablesPage({ onSeatWalkIn }) {
  const { tables, addTable, updateTableStatus } = useRestaurant();

  // Filter states
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCapacity, setSelectedCapacity] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'floorplan' | 'timeline'

  // Add Table Modal State
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [newTableData, setNewTableData] = useState({
    number: '',
    section: 'main',
    capacity: 4,
    shape: 'square'
  });

  // Filter tables using JavaScript array filter()
  const filteredTables = useMemo(() => {
    return tables.filter(table => {
      const sectionMatch = selectedSection === 'all' || table.section === selectedSection;
      const statusMatch = selectedStatus === 'all' || table.status === selectedStatus;
      const capacityMatch =
        selectedCapacity === 'all' || table.capacity >= Number(selectedCapacity);
      return sectionMatch && statusMatch && capacityMatch;
    });
  }, [tables, selectedSection, selectedStatus, selectedCapacity]);

  const handleAddTableSubmit = (e) => {
    e.preventDefault();
    if (!newTableData.number.trim()) return;
    addTable({
      ...newTableData,
      number: newTableData.number.trim(),
      capacity: Number(newTableData.capacity)
    });
    setIsAddTableOpen(false);
    setNewTableData({
      number: '',
      section: 'main',
      capacity: 4,
      shape: 'square'
    });
  };

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
            Table Management &amp; Floor Plan
          </h2>
          <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.88rem' }}>
            Interactive seating layout across dining sections. Switch between Grid Cards, 2D Floor Plan, and Hourly Matrix.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddTableOpen(true)}
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
          <span>Add Custom Table</span>
        </button>
      </div>

      {/* Filter Bar with View Mode Toggle */}
      <TableFilterBar
        selectedSection={selectedSection}
        onSelectSection={setSelectedSection}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        selectedCapacity={selectedCapacity}
        onSelectCapacity={setSelectedCapacity}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
      />

      {/* Active Table Display: 2D Floor Plan vs Cards Grid vs Timeline Matrix */}
      {viewMode === 'floorplan' ? (
        <FloorPlan
          tables={filteredTables}
          onSeatWalkIn={onSeatWalkIn}
        />
      ) : viewMode === 'timeline' ? (
        <TableTimeline tables={filteredTables} />
      ) : (
        <TableGrid
          tables={filteredTables}
          onSeatWalkIn={onSeatWalkIn}
        />
      )}

      {/* Add Table Modal */}
      <Modal
        isOpen={isAddTableOpen}
        onClose={() => setIsAddTableOpen(false)}
        title="Add New Dining Table"
        subtitle="Configure table number, area section, seating capacity, and table geometry"
      >
        <form onSubmit={handleAddTableSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
              Table Number / Label *
            </label>
            <input
              type="text"
              required
              value={newTableData.number}
              onChange={(e) => setNewTableData(prev => ({ ...prev, number: e.target.value }))}
              placeholder="e.g. 109, P-10, Bar-05"
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                Dining Section
              </label>
              <select
                value={newTableData.section}
                onChange={(e) => setNewTableData(prev => ({ ...prev, section: e.target.value }))}
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
                {INITIAL_SECTIONS.filter(s => s.id !== 'all').map(sec => (
                  <option key={sec.id} value={sec.id}>{sec.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                Seating Capacity
              </label>
              <select
                value={newTableData.capacity}
                onChange={(e) => setNewTableData(prev => ({ ...prev, capacity: Number(e.target.value) }))}
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
                {[2, 4, 6, 8, 10, 12].map(n => (
                  <option key={n} value={n}>{n} Guests</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
              Table Shape
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {['round', 'square', 'rectangle'].map(shape => {
                const isSelected = newTableData.shape === shape;
                return (
                  <button
                    key={shape}
                    type="button"
                    onClick={() => setNewTableData(prev => ({ ...prev, shape }))}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: isSelected ? '1px solid #e11d48' : '1px solid rgba(255, 255, 255, 0.1)',
                      background: isSelected ? 'rgba(225, 29, 72, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                      color: isSelected ? '#f8fafc' : '#94a3b8',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      textTransform: 'capitalize',
                      cursor: 'pointer'
                    }}
                  >
                    {shape}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => setIsAddTableOpen(false)}
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
              Create Table
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
