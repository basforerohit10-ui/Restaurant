// HTML to JSX Conversion Engine & Educational Explainer

function convertStyleToJsx(styleStr) {
  if (!styleStr) return '{}';
  const rules = styleStr
    .split(';')
    .map(rule => rule.trim())
    .filter(Boolean);

  const styleObj = {};
  rules.forEach(rule => {
    const colonIndex = rule.indexOf(':');
    if (colonIndex === -1) return;
    const rawKey = rule.slice(0, colonIndex).trim();
    const rawVal = rule.slice(colonIndex + 1).trim();

    // Convert CSS kebab-case to camelCase
    const camelKey = rawKey.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
    styleObj[camelKey] = rawVal;
  });

  return styleObj;
}

export function convertHtmlToJsx(htmlString) {
  if (!htmlString || typeof htmlString !== 'string') {
    return {
      jsx: '',
      changes: []
    };
  }

  const changes = [];
  let result = htmlString;

  // 1. Convert HTML comments <!-- ... --> to JSX comments {/* ... */}
  if (/<!--([\s\S]*?)-->/.test(result)) {
    result = result.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');
    changes.push({
      rule: 'HTML Comments to JSX Comments',
      description: 'Converted <!-- comment --> to {/* comment */} because JSX uses JavaScript comments inside curly braces.'
    });
  }

  // 2. Convert class="..." to className="..."
  if (/\bclass=(["'][^"']*["'])/i.test(result)) {
    result = result.replace(/\bclass=(["'][^"']*["'])/gi, 'className=$1');
    changes.push({
      rule: 'class → className',
      description: 'Changed "class" to "className" because "class" is a reserved keyword in JavaScript.'
    });
  }

  // 3. Convert for="..." to htmlFor="..."
  if (/\bfor=(["'][^"']*["'])/i.test(result)) {
    result = result.replace(/\bfor=(["'][^"']*["'])/gi, 'htmlFor=$1');
    changes.push({
      rule: 'for → htmlFor',
      description: 'Changed "for" to "htmlFor" in label elements because "for" is a reserved JS loop keyword.'
    });
  }

  // 4. Convert inline styles: style="color: red; font-size: 14px;" -> style={{ color: 'red', fontSize: '14px' }}
  const styleRegex = /\bstyle=(["'])(.*?)\1/gi;
  if (styleRegex.test(result)) {
    result = result.replace(/\bstyle=(["'])(.*?)\1/gi, (_, quote, styleContent) => {
      const obj = convertStyleToJsx(styleContent);
      const jsonStr = JSON.stringify(obj, null, 2)
        .replace(/"([^"]+)":/g, '$1:') // clean keys
        .replace(/\n/g, ' ');
      return `style={${jsonStr}}`;
    });
    changes.push({
      rule: 'Inline CSS string → Style Object',
      description: 'Converted CSS string to a JavaScript object literal with camelCase properties (e.g. font-size → fontSize) wrapped in double curlies {{ ... }}.'
    });
  }

  // 5. Convert common attributes to camelCase
  const attributeMappings = [
    { from: /\btabindex=/gi, to: 'tabIndex=', name: 'tabindex → tabIndex' },
    { from: /\bautocomplete=/gi, to: 'autoComplete=', name: 'autocomplete → autoComplete' },
    { from: /\bautofocus=/gi, to: 'autoFocus=', name: 'autofocus → autoFocus' },
    { from: /\bcolspan=/gi, to: 'colSpan=', name: 'colspan → colSpan' },
    { from: /\browspan=/gi, to: 'rowSpan=', name: 'rowspan → rowSpan' },
    { from: /\bcellspacing=/gi, to: 'cellSpacing=', name: 'cellspacing → cellSpacing' },
    { from: /\bcellpadding=/gi, to: 'cellPadding=', name: 'cellpadding → cellPadding' },
    { from: /\bmaxlength=/gi, to: 'maxLength=', name: 'maxlength → maxLength' },
    { from: /\bminlength=/gi, to: 'minLength=', name: 'minlength → minLength' },
    { from: /\breadonly\b/gi, to: 'readOnly', name: 'readonly → readOnly' }
  ];

  attributeMappings.forEach(attr => {
    if (attr.from.test(result)) {
      result = result.replace(attr.from, attr.to);
      changes.push({
        rule: attr.name,
        description: `Normalized HTML attribute to React DOM camelCase property name.`
      });
    }
  });

  // 6. Convert inline event handlers: onclick -> onClick, onchange -> onChange, etc.
  const eventMappings = [
    { from: /\bonclick=(["'])(.*?)\1/gi, name: 'onclick → onClick' },
    { from: /\bonchange=(["'])(.*?)\1/gi, name: 'onchange → onChange' },
    { from: /\bonsubmit=(["'])(.*?)\1/gi, name: 'onsubmit → onSubmit' },
    { from: /\bonkeydown=(["'])(.*?)\1/gi, name: 'onkeydown → onKeyDown' },
    { from: /\bonkeyup=(["'])(.*?)\1/gi, name: 'onkeyup → onKeyUp' },
    { from: /\bonmouseover=(["'])(.*?)\1/gi, name: 'onmouseover → onMouseOver' },
    { from: /\bonfocus=(["'])(.*?)\1/gi, name: 'onfocus → onFocus' },
    { from: /\bonblur=(["'])(.*?)\1/gi, name: 'onblur → onBlur' }
  ];

  eventMappings.forEach(ev => {
    if (ev.from.test(result)) {
      result = result.replace(ev.from, (match, quote, val) => {
        const eventName = ev.name.split(' → ')[1];
        return `${eventName}={() => { /* ${val} */ }}`;
      });
      changes.push({
        rule: ev.name,
        description: `Converted inline event listener to React camelCase synthetic event handler function.`
      });
    }
  });

  // 7. Ensure void self-closing tags are closed: <input>, <img>, <br>, <hr>, <meta>, <link>
  const voidTags = ['input', 'img', 'br', 'hr', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr'];
  voidTags.forEach(tag => {
    // Regex for unclosed void tag: <tag (attributes)> without trailing />
    const unclosedRegex = new RegExp(`<(${tag})((?:\\s+[^>]*?)?)(?<!/)>`, 'gi');
    if (unclosedRegex.test(result)) {
      result = result.replace(unclosedRegex, `<$1$2 />`);
      changes.push({
        rule: `Self-closing <${tag} />`,
        description: `JSX requires all elements to be explicitly closed. Added closing slash to <${tag} />.`
      });
    }
  });

  return {
    jsx: result,
    changes
  };
}

// Sample HTML snippets for the interactive converter
export const SAMPLE_HTML_SNIPPETS = [
  {
    name: 'Restaurant Reservation Card',
    html: `<div class="reservation-card" style="background-color: #1e293b; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
  <!-- Guest summary header -->
  <h3 class="guest-title" style="color: #f8fafc; font-size: 18px; margin: 0 0 8px 0;">Eleanor Vance</h3>
  <p class="details" style="color: #94a3b8; font-size: 14px;">Party of 4 &bull; Table 105 &bull; 7:30 PM</p>
  <label for="guest-notes" class="label-text">Special Requests:</label>
  <input type="text" id="guest-notes" class="input-field" placeholder="Enter notes..." readonly>
  <br>
  <button class="btn btn-primary" onclick="seatGuest(105)" style="background-color: #10b981; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">
    Seat Guest Now
  </button>
</div>`
  },
  {
    name: 'Table Availability Badge & Indicator',
    html: `<!-- Table 101 Status -->
<div class="table-box" tabindex="0" style="border: 2px solid #10b981; padding: 12px; border-radius: 6px;">
  <span class="badge" style="background-color: rgba(16, 185, 129, 0.2); color: #10b981; font-weight: bold;">
    AVAILABLE
  </span>
  <h4 class="table-num">Table 101</h4>
  <p class="capacity">Capacity: 4 Guests</p>
  <img src="/icons/chair.svg" alt="Seating" class="chair-icon">
  <hr>
  <button class="action-btn" onclick="reserveTable()">Reserve</button>
</div>`
  },
  {
    name: 'Walk-In Customer Intake Form',
    html: `<form class="walkin-form" onsubmit="handleWalkinSubmit(event)">
  <!-- Walk-in input form with standard HTML -->
  <div class="form-group" style="margin-bottom: 15px;">
    <label for="walkin-name" class="form-label">Full Guest Name</label>
    <input type="text" id="walkin-name" class="form-control" autocomplete="off" maxlength="50" required>
  </div>
  <div class="form-group" style="margin-bottom: 15px;">
    <label for="party-count" class="form-label">Number of Guests</label>
    <input type="number" id="party-count" class="form-control" min="1" max="12">
  </div>
  <input type="checkbox" id="patio-pref">
  <label for="patio-pref">Outdoor Seating Preferred</label>
  <br>
  <button type="submit" class="submit-btn" style="margin-top: 10px; background-color: #f59e0b; color: white;">
    Add to Waitlist
  </button>
</form>`
  }
];

