import React, { useState } from 'react';
import HtmlToJsxConverter from '../components/converter/HtmlToJsxConverter';
import JsxCheatSheet from '../components/converter/JsxCheatSheet';
import { Code2, BookOpen, Sparkles } from 'lucide-react';

export default function ConverterPage() {
  const [activeTab, setActiveTab] = useState('converter'); // 'converter' | 'rules'

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
            <span>React JSX Learning Studio</span>
          </div>
          <h2 style={{ margin: '4px 0 0', fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
            HTML to JSX Converter &amp; Syntax Reference
          </h2>
          <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.88rem' }}>
            Convert standard HTML5 markup into idiomatic React JSX code with real-time rule tracking and visual previews.
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#1e293b',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '4px'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('converter')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'converter' ? '#e11d48' : 'transparent',
              color: activeTab === 'converter' ? 'white' : '#94a3b8',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Code2 size={16} />
            <span>Interactive Converter</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'rules' ? '#e11d48' : 'transparent',
              color: activeTab === 'rules' ? 'white' : '#94a3b8',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <BookOpen size={16} />
            <span>JSX Conversion Cheatsheet</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'converter' ? (
        <HtmlToJsxConverter />
      ) : (
        <JsxCheatSheet />
      )}
    </div>
  );
}

