'use strict';

const META_LINE_PREFIXES = ['% lesson-meta:', '% dev-meta:'];

const FALLBACK_PREAMBLE = [
  '\\usepackage[utf8]{inputenc}',
  '\\usepackage[T1]{fontenc}',
  '\\usepackage[francais]{babel}',
  '\\usepackage{amsmath,amssymb,amsthm}',
  '\\newtheorem{theoreme}{Théorème}',
  '\\newtheorem{theoremebis}{Théorème}',
  '\\newtheorem{definition}{Définition}'
].join('\n');

function stripMetaLines(content) {
  if (typeof content !== 'string') {
    return '';
  }
  return content
    .split(/\r?\n/)
    .filter((line) => !META_LINE_PREFIXES.some((prefix) => line.startsWith(prefix)))
    .join('\n');
}

function escapeLatex(text) {
  return String(text || '')
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/([{}&%$#_])/g, '\\$1')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

function buildHeading(kind, number, title) {
  const cleanTitle = escapeLatex(String(title || '').trim());
  if (kind === 'dev') {
    return cleanTitle || 'Développement';
  }
  if (typeof number === 'number' && number > 0) {
    return cleanTitle ? `Leçon ${number} — ${cleanTitle}` : `Leçon ${number}`;
  }
  return cleanTitle || 'Leçon';
}

function buildStandaloneTex(options) {
  const opts = options && typeof options === 'object' ? options : {};
  const kind = opts.kind === 'dev' ? 'dev' : 'lesson';
  const settingsContent = typeof opts.settingsContent === 'string' ? opts.settingsContent.trim() : '';
  const preamble = settingsContent || FALLBACK_PREAMBLE;
  const heading = buildHeading(kind, opts.number, opts.title);
  const body = stripMetaLines(typeof opts.content === 'string' ? opts.content : '').trim();
  const lines = [
    '% Document autonome généré par Application Mathématiques — compiler avec pdflatex',
    '\\documentclass{article}',
    preamble,
    '\\begin{document}',
    '\\begin{center}{\\Large ' + heading + '}\\end{center}',
    body,
    '\\end{document}'
  ];
  return lines.join('\n').replace(/\n{3,}/g, '\n\n') + '\n';
}

module.exports = {
  stripMetaLines,
  escapeLatex,
  buildStandaloneTex,
  FALLBACK_PREAMBLE
};
