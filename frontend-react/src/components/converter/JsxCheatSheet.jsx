import React from 'react';
import { BookOpen, Check, AlertTriangle, ArrowRight } from 'lucide-react';

export default function JsxCheatSheet() {
  const conversionRules = [
    {
      category: 'Attribute Naming',
      html: '<div class="card" for="guest-id">',
      jsx: '<div className="card" htmlFor="guest-id">',
      explanation: 'Since "class" and "for" are reserved keywords in JavaScript, React uses className and htmlFor to avoid syntax collisions.'
    },
    {
      category: 'Inline Styles',
      html: '<div style="background-color: #1e293b; font-size: 16px;">',
      jsx: '<div style={{ backgroundColor: "#1e293b", fontSize: "16px" }}>',
      explanation: 'Styles in JSX are passed as JavaScript objects wrapped in double curlies {{ ... }}. CSS property names are converted to camelCase.'
    },
    {
      category: 'Self-Closing Tags',
      html: '<input type="text">\n<img src="dish.jpg">\n<br>',
      jsx: '<input type="text" />\n<img src="dish.jpg" />\n<br />',
      explanation: 'In JSX, all elements must be explicitly closed. Void HTML5 tags like <img>, <input>, and <br> require a trailing slash.'
    },
    {
      category: 'Event Handling',
      html: '<button onclick="bookTable()">Book Table</button>',
      jsx: '<button onClick={() => bookTable()}>Book Table</button>',
      explanation: 'HTML event attributes (onclick, onchange) become camelCase synthetic events in React (onClick, onChange) and accept functions rather than strings.'
    },
    {
      category: 'Embedding JavaScript',
      html: '<h3>Party: 4 Guests</h3>',
      jsx: '<h3>Party: {reservation.partySize} Guests</h3>',
      explanation: 'Any valid JavaScript expression, variable, or calculation can be embedded directly in JSX by wrapping it in curly braces { ... }.'
    },
    {
      category: 'Comments',
      html: '<!-- Reservation Card -->',
      jsx: '{/* Reservation Card */}',
      explanation: 'HTML comments are not valid inside JSX. JSX comments are written as standard JS block comments wrapped in curly braces.'
    }
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <BookOpen size={20} color="#fb7185" />
        <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.15rem', fontWeight: 700 }}>
          JSX &amp; HTML-to-JSX Conversion Rules
        </h3>
      </div>

      <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.5 }}>
        JSX (JavaScript XML) is a syntax extension for JavaScript that allows you to write HTML-like markup directly inside React components. Here is how key HTML structures translate into standard React JSX:
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px'
        }}
      >
        {conversionRules.map((rule, idx) => (
          <div
            key={idx}
            style={{
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fb7185', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {rule.category}
              </span>
            </div>

            {/* Side-by-side comparison snippet */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  fontFamily: 'monospace',
                  fontSize: '0.78rem',
                  color: '#f87171',
                  whiteSpace: 'pre-wrap'
                }}
              >
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#ef4444', marginBottom: '2px' }}>HTML:</div>
                {rule.html}
              </div>

              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  fontFamily: 'monospace',
                  fontSize: '0.78rem',
                  color: '#34d399',
                  whiteSpace: 'pre-wrap'
                }}
              >
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#10b981', marginBottom: '2px' }}>REACT JSX:</div>
                {rule.jsx}
              </div>
            </div>

            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
              {rule.explanation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

