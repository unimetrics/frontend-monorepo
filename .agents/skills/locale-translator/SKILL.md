---
name: locale-translator
description: Translate locale JSON files from a detected source locale into all other locale files in the current workspace, with strict key parity and validation.
---

# Workspace Locale Translator

Translate locale content with quality and consistency, without hardcoding a specific app path.

## Scope

1. Auto-detect locale files in the current workspace (prefer directories like `src/i18n/messages`, `src/locales`, `locales`, `i18n`, `translations`).
2. Auto-detect source locale:
- Prefer `en.json` when available.
- Otherwise use the locale explicitly requested by the user.
- If neither is available, use the first locale file alphabetically and state that assumption.
3. Translate from source locale into all other detected locale files unless the user narrows the target set.
4. If the user requests a specific subtree (for example `landing.*`), only update that subtree.
5. Do not rewrite unrelated keys unless explicitly requested.

## Translation Rules

1. Tone: natural, modern, casual product language (not overly formal, not slangy).
2. Keep meaning faithful to English; avoid shortening away product intent.
3. Never translate keys or JSON structure.
4. Keep placeholders/syntax untouched:
- variables like `{count}`, `{name}`
- percents/numbers (`0.6%`, `+4.2%`)
- tickers/pairs (`ETH / USDC`)
- punctuation needed for values (`P&L`, `APR`, `%`, `/day`)
5. Keep brand/domain terms in English unless a locale convention clearly demands otherwise:
- `Unimetrics`, `LP`, `P&L`, `APR`, `API`, `Desk`, `Waitlist`
6. Respect script conventions:
- `zh-CN` Simplified Chinese
- `zh-TW` Traditional Chinese

## Execution

1. Detect locale directory, source locale file, and target locale files.
2. Read source JSON and each target locale JSON.
3. Translate source values into each target locale for requested scope (entire file or requested subtree).
4. Preserve existing high-quality target strings if already correct; update only weak/literal/missing ones.
5. Re-check terminology consistency inside each locale (same concept uses same wording across keys).

## Required Validation

1. Dynamic key parity check across all detected locale files (or for scoped subtree if requested):
```bash
LOCALES_DIR="<detected-locale-dir>" SOURCE_LOCALE="<source-locale>" KEY_SCOPE="<optional.dot.path>" node - <<'NODE'
const fs = require('node:fs');
const path = require('node:path');

const dir = process.env.LOCALES_DIR;
const sourceLocale = process.env.SOURCE_LOCALE;
const keyScope = process.env.KEY_SCOPE || '';

if (!dir || !sourceLocale) {
  console.error('LOCALES_DIR and SOURCE_LOCALE are required.');
  process.exit(1);
}

const files = fs.readdirSync(dir)
  .filter((f) => f.endsWith('.json'))
  .sort();

const locales = files.map((f) => path.basename(f, '.json'));
if (!locales.includes(sourceLocale)) {
  console.error(`Source locale ${sourceLocale} not found in ${dir}`);
  process.exit(1);
}

const read = (locale) => JSON.parse(fs.readFileSync(path.join(dir, `${locale}.json`), 'utf8'));

const getByPath = (obj, dotPath) => {
  if (!dotPath) return obj;
  return dotPath.split('.').reduce((acc, part) => {
    if (acc == null || typeof acc !== 'object') return undefined;
    return acc[part];
  }, obj);
};

const flatten = (obj, prefix = '', out = []) => {
  if (typeof obj !== 'object' || obj === null) return out;
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'object' && v !== null) flatten(v, key, out);
    else out.push(key);
  }
  return out;
};

const sourceNode = getByPath(read(sourceLocale), keyScope);
if (sourceNode == null) {
  console.error(`Scope "${keyScope}" not found in source locale ${sourceLocale}`);
  process.exit(1);
}

const sourceKeys = new Set(flatten(sourceNode));
let failed = false;
for (const locale of locales.filter((l) => l !== sourceLocale)) {
  const targetNode = getByPath(read(locale), keyScope);
  const keys = new Set(flatten(targetNode ?? {}));
  const missing = [...sourceKeys].filter((k) => !keys.has(k));
  const extra = [...keys].filter((k) => !sourceKeys.has(k));
  if (missing.length || extra.length) {
    failed = true;
    console.log(`\\n${locale}:`);
    if (missing.length) console.log(`  missing (${missing.length}):`, missing.join(', '));
    if (extra.length) console.log(`  extra (${extra.length}):`, extra.join(', '));
  }
}
if (failed) process.exit(1);
console.log('Locale key parity OK.');
NODE
```
2. Run i18n lint command if available:
```bash
pnpm run lint:i18n
```
If `lint:i18n` is unavailable at repo root, run it from the detected workspace package if present.

## Output

Return:

1. Detected locale directory, source locale, targets, and optional scope
2. Locales updated
3. Key parity result
4. Lint/check result
5. Any intentional term-preservation decisions
