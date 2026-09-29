'use strict';

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const ENV_NAMES = [
  'document', 'abstract', 'center', 'figure', 'table', 'tabular', 'array',
  'itemize', 'enumerate', 'description', 'proof', 'proof*', 'demonstration',
  'align', 'align*', 'alignat', 'gather', 'gather*', 'equation', 'equation*',
  'displaymath', 'math', 'split', 'cases', 'matrix', 'pmatrix', 'bmatrix',
  'tikzpicture', 'quotation', 'verse', 'minipage', 'frame', 'example'
];
const ENV_NAME_SET = new Set(ENV_NAMES);

function isKnownEnvironment(name) {
  return ENV_NAME_SET.has(name) || /^[a-z]{1,6}$/.test(name);
}

function tokenizeLatex(source) {
  const tokens = [];
  if (typeof source !== 'string') {
    return tokens;
  }
  let i = 0;
  const n = source.length;
  let mathMode = false;
  while (i < n) {
    const ch = source[i];
    if (ch === '%' && !mathMode) {
      const start = i;
      while (i < n && source[i] !== '\n') {
        i++;
      }
      tokens.push({ type: 'comment', value: source.slice(start, i) });
      continue;
    }
    if (ch === '\\') {
      const start = i;
      i++;
      let name = '';
      while (i < n && /[A-Za-z@]/.test(source[i])) {
        name += source[i];
        i++;
      }
      if (name.length === 0) {
        if (i < n) {
          const special = source.slice(i, i + 1);
          i++;
          tokens.push({ type: mathMode ? 'math' : 'special', value: '\\' + special });
        }
        continue;
      }
      const lower = name.toLowerCase();
      if (lower === 'begin' || lower === 'end') {
        let j = i;
        while (j < n && /\s/.test(source[j])) {
          j++;
        }
        if (source[j] === '{') {
          let depth = 0;
          let k = j;
          let envName = '';
          let closed = false;
          while (k < n) {
            if (source[k] === '\\') {
              k += 2;
              continue;
            }
            if (source[k] === '{') {
              depth++;
              if (depth > 1) {
                envName += source[k];
              }
            } else if (source[k] === '}') {
              depth--;
              if (depth === 0) {
                closed = true;
                break;
              }
              envName += source[k];
            } else if (depth > 0) {
              envName += source[k];
            }
            k++;
          }
          if (closed && isKnownEnvironment(envName)) {
            tokens.push({ type: 'environment', value: source.slice(start, k + 1) });
            i = k + 1;
            continue;
          }
        }
      }
      tokens.push({ type: 'command', value: source.slice(start, i) });
      continue;
    }
    if (ch === '$') {
      const start = i;
      i++;
      if (source[i] === '$') {
        i++;
      }
      mathMode = !mathMode;
      tokens.push({ type: 'math', value: source.slice(start, i) });
      continue;
    }
    if (mathMode) {
      const start = i;
      while (i < n && source[i] !== '\\' && source[i] !== '$' && source[i] !== '%') {
        i++;
      }
      tokens.push({ type: 'math', value: source.slice(start, i) });
      continue;
    }
    if (ch === '{' || ch === '}') {
      tokens.push({ type: 'brace', value: ch });
      i++;
      continue;
    }
    if (ch === '&' || ch === '#' || ch === '_' || ch === '^') {
      tokens.push({ type: 'special', value: ch });
      i++;
      continue;
    }
    if (ch === '[' || ch === ']') {
      tokens.push({ type: 'operator', value: ch });
      i++;
      continue;
    }
    const start = i;
    while (i < n && !/[%\\${}&#\[\]_\^]/.test(source[i])) {
      i++;
    }
    if (i === start) {
      i++;
    }
    tokens.push({ type: 'text', value: source.slice(start, i) });
  }
  return tokens;
}

function highlightLatex(source) {
  const tokens = tokenizeLatex(source);
  let out = '';
  for (const token of tokens) {
    const escaped = escapeHtml(token.value);
    switch (token.type) {
      case 'comment':
        out += `<span class="tok-comment">${escaped}</span>`;
        break;
      case 'command':
        out += `<span class="tok-command">${escaped}</span>`;
        break;
      case 'environment':
        out += `<span class="tok-environment">${escaped}</span>`;
        break;
      case 'brace':
        out += `<span class="tok-brace">${escaped}</span>`;
        break;
      case 'math':
        out += `<span class="tok-math">${escaped}</span>`;
        break;
      case 'special':
        out += `<span class="tok-special">${escaped}</span>`;
        break;
      case 'operator':
        out += `<span class="tok-operator">${escaped}</span>`;
        break;
      default:
        out += escaped;
    }
  }
  return out;
}

const latexHighlightApi = {
  tokenizeLatex,
  highlightLatex,
  isKnownEnvironment,
  ENV_NAMES
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = latexHighlightApi;
} else {
  window.latexHighlight = latexHighlightApi;
}
