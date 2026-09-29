'use strict';

const BUILTIN_COMMANDS = new Set([
  'begin', 'end', 'text', 'textbf', 'textit', 'emph', 'underline', 'frac', 'sqrt',
  'sum', 'prod', 'int', 'iint', 'iiint', 'oint', 'lim', 'sup', 'inf', 'max', 'min',
  'in', 'notin', 'subset', 'subseteq', 'cup', 'cap', 'emptyset', 'varnothing',
  'times', 'cdot', 'div', 'pm', 'mp', 'leq', 'geq', 'neq', 'approx', 'equiv', 'sim',
  'to', 'mapsto', 'rightarrow', 'leftarrow', 'leftrightarrow', 'Rightarrow', 'Leftarrow',
  'iff', 'implies', 'iff', 'land', 'lor', 'neg', 'forall', 'exists', 'nexists',
  'mathbb', 'mathcal', 'mathbf', 'mathfrak', 'mathrm', 'mathsf', 'mathtt',
  'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'varepsilon', 'zeta', 'eta', 'theta',
  'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'pi', 'rho', 'sigma', 'tau', 'upsilon',
  'phi', 'varphi', 'chi', 'psi', 'omega', 'Gamma', 'Delta', 'Theta', 'Lambda', 'Xi',
  'Pi', 'Sigma', 'Upsilon', 'Phi', 'Psi', 'Omega', 'ell', 'hbar', 'imath', 'jmath',
  'partial', 'nabla', 'infty', 'aleph', 'degree', 'prime', 'circ', 'bullet', 'star',
  'left', 'right', 'bigl', 'bigr', 'Bigl', 'Bigr', 'biggl', 'biggr', 'big', 'Big',
  'langle', 'rangle', 'lVert', 'rVert', 'vert', 'Vert', 'lceil', 'rceil', 'lfloor', 'rfloor',
  'quad', 'qquad', 'hspace', 'vspace', 'kern', 'phantom', 'hphantom', 'vphantom',
  'array', 'matrix', 'pmatrix', 'bmatrix', 'vmatrix', 'cases', 'aligned',
  'item', 'label', 'ref', 'eqref', 'cite', 'footnote', 'marginpar', 'tag',
  'overline', 'underline', 'overbrace', 'underbrace', 'overrightarrow', 'underrightarrow',
  'hat', 'widehat', 'tilde', 'widetilde', 'vec', 'bar', 'dot', 'ddot', 'breve', 'check',
  'stackrel', 'overset', 'underset', 'binom', 'choose', 'atop', 'over',
  'displaystyle', 'textstyle', 'scriptstyle', 'scriptscriptstyle',
  'newcommand', 'renewcommand', 'providecommand', 'def', 'let', 'declaremathoperator',
  'par', 'newline', 'linebreak', 'pagebreak', 'noindent', 'smallskip', 'medskip', 'bigskip',
  'qed', 'qedsymbol', 'square', 'blacksquare', 'diamond',
  'g', 'kg', 'cm', 'm', 'km', 's', 'h', 'ms'
]);

const ENVIRONMENTS = new Set([
  'document', 'center', 'figure', 'table', 'tabular', 'array', 'itemize', 'enumerate',
  'description', 'quote', 'quotation', 'verse', 'proof', 'align', 'align*', 'gather',
  'equation', 'equation*', 'displaymath', 'math', 'split', 'multline', 'cases',
  'matrix', 'pmatrix', 'bmatrix', 'theorem', 'lemma', 'definition', 'proposition',
  'corollary', 'remark', 'example', 'exercise', 'tikzpicture', 'minipage', 'frame'
]);

function extractUsedMacros(body) {
  const used = new Set();
  if (typeof body !== 'string') {
    return used;
  }
  let mathMode = false;
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch === '%') {
      while (i < body.length && body[i] !== '\n') {
        i++;
      }
      continue;
    }
    if (ch === '$') {
      mathMode = !mathMode;
      if (body[i + 1] === '$') {
        i++;
      }
      continue;
    }
    if (ch !== '\\') {
      continue;
    }
    let j = i + 1;
    let name = '';
    while (j < body.length && /[A-Za-z@]/.test(body[j])) {
      name += body[j];
      j++;
    }
    if (name.length === 0) {
      i = j;
      continue;
    }
    if (name === 'begin' || name === 'end') {
      let k = j;
      while (k < body.length && /\s/.test(body[k])) {
        k++;
      }
      if (body[k] === '{') {
        let depth = 0;
        let envName = '';
        while (k < body.length) {
          if (body[k] === '\\') {
            k += 2;
            continue;
          }
          if (body[k] === '{') {
            depth++;
            if (depth > 1) {
              envName += body[k];
            }
          } else if (body[k] === '}') {
            depth--;
            if (depth === 0) {
              break;
            }
            envName += body[k];
          } else if (depth > 0) {
            envName += body[k];
          }
          k++;
        }
        if (envName) {
          used.add('env:' + envName);
        }
        i = k;
        continue;
      }
    }
    used.add(name);
    i = j - 1;
  }
  return used;
}

function extractDefinedMacros(settings) {
  const defined = new Set();
  if (!settings || !Array.isArray(settings.macros)) {
    return defined;
  }
  for (const macro of settings.macros) {
    if (macro && macro.name) {
      defined.add(macro.name.replace(/^\\/, ''));
    }
  }
  if (Array.isArray(settings.environments)) {
    for (const env of settings.environments) {
      if (env && env.name) {
        defined.add('env:' + env.name.replace(/\*$/, ''));
      }
    }
  }
  return defined;
}

function checkNotionCompiles(notionBody, settings) {
  const used = extractUsedMacros(notionBody);
  const defined = extractDefinedMacros(settings);
  const missingMacros = [];
  const missingEnvironments = [];
  for (const item of used) {
    if (item.startsWith('env:')) {
      const envName = item.slice(4).replace(/\*$/, '');
      if (!ENVIRONMENTS.has(envName) && !defined.has('env:' + envName)) {
        missingEnvironments.push(item.slice(4));
      }
    } else {
      if (!BUILTIN_COMMANDS.has(item) && !defined.has(item)) {
        missingMacros.push(item);
      }
    }
  }
  return {
    ok: missingMacros.length === 0 && missingEnvironments.length === 0,
    missingMacros: missingMacros.sort(),
    missingEnvironments: missingEnvironments.sort()
  };
}

const compileCheckApi = {
  checkNotionCompiles,
  extractUsedMacros,
  extractDefinedMacros,
  BUILTIN_COMMANDS,
  ENVIRONMENTS
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = compileCheckApi;
} else {
  window.compileCheck = compileCheckApi;
}
