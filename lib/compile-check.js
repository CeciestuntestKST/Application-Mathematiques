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
  'g', 'kg', 'cm', 'm', 'km', 's', 'h', 'ms',
  'ker', 'cong', 'isom', 'Hom', 'arg', 'deg', 'det', 'dim', 'exp', 'gcd', 'lg',
  'liminf', 'limsup', 'ln', 'log', 'Pr', 'injlim', 'projlim', 'varinjlim', 'varprojlim',
  'propto', 'asymp', 'doteq', 'doteqdot', 'models', 'prec', 'succ', 'preceq', 'succeq',
  'nprec', 'nsucc', 'npreceq', 'nsucceq', 'perp', 'parallel', 'mid', 'nmid', 'wedgen',
  'wedge', 'vee', 'uplus', 'oplus', 'ominus', 'otimes', 'oslash', 'odot', 'bigcirc',
  'dagger', 'ddagger', 'amalg', 'setminus', 'smallsetminus', 'wr', 'diamond', 'Diamond',
  'bigtriangleup', 'bigtriangledown', 'triangleleft', 'triangleright', 'triangle', 'angle',
  'measure', 'mho', 'top', 'bot', 'vdash', 'dashv', 'vDash', 'Vdash', 'VDash', 'nvdash',
  'nvDash', 'Vvdash', 'smile', 'frown', 'blacktriangleleft', 'blacktriangleright',
  'sqsubset', 'sqsupset', 'sqsubseteq', 'sqsupseteq', 'sqcap', 'sqcup', 'bigsqcup',
  'triangleq', 'risingdotseq', 'fallingdotseq', 'eqcirc', 'circeq', 'eqsim', 'approxeq',
  'thicksim', 'thickapprox', 'backsim', 'simeq', 'backsimeq', 'nsim', 'ncong',
  'lesssim', 'gtrsim', 'lessapprox', 'gtrapprox', 'lessdot', 'gtrdot', 'lll', 'ggg',
  'lessgtr', 'gtrless', 'lesseqgtr', 'gtreqless', 'lesseqqgtr', 'gtreqqless',
  'lnapprox', 'gnapprox', 'lneq', 'gneq', 'lvertneqq', 'gvertneqq', 'lneqq', 'gneqq',
  'nless', 'ngtr', 'nleq', 'ngeq', 'nleqslant', 'ngeqslant', 'leqslant', 'geqslant',
  'eqqcolon', 'coloneqq', 'colonequals', 'eqcolon', 'dblcolon', 'Colon',
  'hookrightarrow', 'hookleftarrow', 'rightharpoonup', 'rightharpoondown',
  'leftharpoonup', 'leftharpoondown', 'rightleftharpoons', 'leftrightharpoons',
  'circlearrowleft', 'circlearrowright', 'curvearrowright', 'curvearrowleft',
  'upuparrows', 'downdownarrows', 'rightrightarrows', 'leftleftarrows',
  'rightleftarrows', 'leftrightarrows', 'Lsh', 'Rsh', 'leadsto', 'dashrightarrow',
  'rightsquigarrow', 'leftrightsquigarrow', 'multimap', 'nearrow', 'searrow',
  'swarrow', 'nwarrow', 'downdownarrows', 'uparrow', 'downarrow', 'updownarrow',
  'Uparrow', 'Downarrow', 'Updownarrow', 'longmapsto', 'longrightarrow',
  'longleftrightarrow', 'Longrightarrow', 'Longleftarrow', 'Longleftrightarrow',
  'longmapsto', 'hookrightarrow', 'digamma', 'varepsilon', 'varsigma', 'vartheta',
  'varrho', 'varpi', 'varphi', 'varkappa', 'beth', 'gimel', 'daleth', 'circledS',
  'nexists', 'complement', 'emptyset', 'varnothing', 'imath', 'jmath', 'eth',
  'mathstrut', 'boxed', 'fbox', 'stackrel', 'overset', 'underset', 'sideset',
  'prescript', 'substack', 'dfrac', 'tfrac', 'cfrac', 'binom', 'dbinom', 'tbinom',
  'genfrac', 'above', 'over', 'atopwithdelims', 'abovewithdelims',
  'subsubsection', 'section', 'subsection', 'chapter', 'part', 'paragraph',
  'title', 'author', 'date', 'maketitle', 'tableofcontents', 'footnotesize',
  'scriptsize', 'tiny', 'small', 'normalsize', 'large', 'Large', 'LARGE', 'huge', 'Huge',
  'texttt', 'textsf', 'textsc', 'textmd', 'textup', 'textsl', 'textrm', 'textnormal',
  'uppercase', 'lowercase', 'today', 'LaTeX', 'TeX', 'par', 'noindent',
  'draw', 'fill', 'filldraw', 'node', 'path', 'shade', 'shadedraw', 'clip',
  'coordinate', 'circle', 'rectangle', 'arc', 'grid', 'foreach'
]);

const ENVIRONMENTS = new Set([
  'document', 'center', 'figure', 'table', 'tabular', 'array', 'itemize', 'enumerate',
  'description', 'quote', 'quotation', 'verse', 'proof', 'align', 'align*', 'gather',
  'equation', 'equation*', 'displaymath', 'math', 'split', 'multline', 'cases',
  'matrix', 'pmatrix', 'bmatrix', 'theorem', 'lemma', 'definition', 'proposition',
  'corollary', 'remark', 'example', 'exercise', 'tikzpicture', 'minipage', 'frame'
]);

const MATH_ENVIRONMENTS = new Set([
  'array', 'matrix', 'pmatrix', 'bmatrix', 'Bmatrix', 'vmatrix', 'Vmatrix',
  'smallmatrix', 'cases', 'aligned', 'alignedat', 'gathered', 'split', 'subarray',
  'align', 'align*', 'alignat', 'alignat*', 'gather', 'gather*', 'equation',
  'equation*', 'multline', 'multline*', 'displaymath', 'math', 'flalign', 'flalign*',
  'eqnarray', 'eqnarray*', 'numcases', 'subnumcases', 'matrix*', 'pmatrix*', 'bmatrix*',
  'Bmatrix*', 'vmatrix*', 'Vmatrix*', 'smallmatrix*', 'system', 'dcases', 'rcases'
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
          used.add((mathMode ? 'mathenv:' : 'env:') + envName);
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
    if (item.startsWith('mathenv:')) {
      const envName = item.slice(8).replace(/\*$/, '');
      if (!MATH_ENVIRONMENTS.has(envName) && !defined.has('env:' + envName)) {
        missingEnvironments.push(item.slice(8));
      }
    } else if (item.startsWith('env:')) {
      const envName = item.slice(4).replace(/\*$/, '');
      if (!ENVIRONMENTS.has(envName) && !MATH_ENVIRONMENTS.has(envName) && !defined.has('env:' + envName)) {
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
  ENVIRONMENTS,
  MATH_ENVIRONMENTS
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = compileCheckApi;
} else {
  window.compileCheck = compileCheckApi;
}
