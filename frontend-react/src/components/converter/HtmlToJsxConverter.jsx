import React, { useState, useMemo } from 'react';
import { convertHtmlToJsx, SAMPLE_HTML_SNIPPETS } from '../../utils/htmlToJsxConverter';
import { Copy, Check, Sparkles, RefreshCw, Eye, Code, FileText } from 'lucide-react';

export default function HtmlToJsxConverter() {
  const [htmlInput, setHtmlInput] = useState(SAMPLE_HTML_SNIPPETS[0].html);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('code'); // 'code' | 'preview'

  // Conversion result with useMemo
  const { jsx, changes } = useMemo(() => {
    return convertHtmlToJsx(htmlInput);
  }, [htmlInput]);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsx);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = (sample) => {
    setHtmlInput(sample.html);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      {/* Sample Templates Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          background: '#1e293b',
          padding: '12px 16px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' }}>
          Load Restaurant Sample:
        </span>
        {SAMPLE_HTML_SNIPPETS.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => loadSample(sample)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#f8fafc',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {sample.name}
          </button>
        ))}
      </div>

      {/* Two Column Code Editor: HTML on Left, JSX on Right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '20px'
        }}
      >
        {/* HTML Input Panel */}
        <div
          style={{
            background: '#1e293b',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: '#0f172a',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginLeft: '6px' }}>
                Raw HTML Source
              </span>
            </div>
            <button
              type="button"
              onClick={() => setHtmlInput('')}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          </div>

          <textarea
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            placeholder="Paste raw HTML here..."
            rows={14}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#131b2e',
              border: 'none',
              color: '#f8fafc',
              fontFamily: "'Fira Code', monospace",
              fontSize: '0.85rem',
              lineHeight: 1.5,
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Converted JSX Panel */}
        <div
          style={{
            background: '#1e293b',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 16px',
              background: '#0f172a',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="#fb7185" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                React JSX Output
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Tab Switcher: Code vs Rendered Preview */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  padding: '2px'
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveTab('code')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    border: 'none',
                    borderRadius: '4px',
                    background: activeTab === 'code' ? '#e11d48' : 'transparent',
                    color: activeTab === 'code' ? 'white' : '#94a3b8',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  <Code size={12} />
                  <span>JSX</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    border: 'none',
                    borderRadius: '4px',
                    background: activeTab === 'preview' ? '#e11d48' : 'transparent',
                    color: activeTab === 'preview' ? 'white' : '#94a3b8',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  <Eye size={12} />
                  <span>Preview</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 10px',
                  background: copied ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? 'Copied!' : 'Copy JSX'}</span>
              </button>
            </div>
          </div>

          {activeTab === 'code' ? (
            <pre
              style={{
                margin: 0,
                padding: '16px',
                backgroundColor: '#131b2e',
                color: '#34d399',
                fontFamily: "'Fira Code', monospace",
                fontSize: '0.85rem',
                lineHeight: 1.5,
                overflowX: 'auto',
                minHeight: '260px',
                maxHeight: '340px'
              }}
            >
              <code>{jsx || '// JSX output will appear here...'}</code>
            </pre>
          ) : (
            <div
              style={{
                padding: '20px',
                backgroundColor: '#131b2e',
                minHeight: '260px',
                overflowY: 'auto'
              }}
            >
              {/* Live Render Preview via dangerouslySetInnerHTML for HTML preview */}
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: '10px',
                  border: '1px dashed rgba(255, 255, 255, 0.1)'
                }}
                dangerouslySetInnerHTML={{ __html: htmlInput }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Applied Transformations Breakdown Table */}
      <div
        style={{
          background: '#1e293b',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="#fb7185" />
            <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '1rem', fontWeight: 700 }}>
              JSX Transformation Log ({changes.length} rules applied)
            </h4>
          </div>
        </div>

        {changes.length === 0 ? (
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>
            No HTML-specific syntax detected requiring transformation. The markup is already valid JSX!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {changes.map((ch, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div
                  style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(225, 29, 72, 0.15)',
                    color: '#fb7185',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {ch.rule}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                  {ch.description}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

