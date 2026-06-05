// Shared CSS for the Swiss design system used across all pages of Quill.
// Pages compose this with their own page-specific styles via `wrapInDocument()`.

export const SWISS_BASE_CSS = `
:root {
    --black: #000000;
    --white: #FFFFFF;
    --paper: #F5F5F5;
    --gray-100: #F5F5F5;
    --gray-300: #D4D4D4;
    --gray-600: #737373;
    --gray-900: #1A1A1A;
    --accent: #FF0000;
    --rule: 1px solid #000000;
    --rule-soft: 1px solid #D4D4D4;
    --grid: 12;
    --gutter: 24px;
    --col: calc((100vw - 2 * 32px - (var(--grid) - 1) * var(--gutter)) / var(--grid));
    --container-max: 1280px;
    --pad-x: 32px;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html { background: var(--white); color: var(--black); }

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-weight: 400;
    font-size: 15px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--white);
    color: var(--black);
}

a { color: inherit; text-decoration: none; }
a:hover { text-decoration: underline; text-underline-offset: 4px; text-decoration-thickness: 1px; }

button { font-family: inherit; }

/* ========== CONTAINER ========== */
.container {
    max-width: var(--container-max);
    margin: 0 auto;
    padding-left: var(--pad-x);
    padding-right: var(--pad-x);
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
}

/* ========== TOP BANNER ========== */
.topbar {
    border-bottom: var(--rule);
    padding: 12px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 500;
}
.topbar .meta { color: var(--gray-600); }
.topbar .meta strong { color: var(--black); font-weight: 700; }
.topbar a { color: var(--black); }
.topbar-right { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }

/* ========== BYOK STATUS (topbar badge) ========== */
.byok-status {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-weight: 600;
    color: var(--gray-600);
    border: 1px solid var(--gray-300);
    padding: 4px 10px;
}
.byok-status[data-state="ok"]      { color: var(--black); border-color: var(--black); }
.byok-status[data-state="missing"] { color: var(--accent); border-color: var(--accent); }
.byok-status .byok-lab { font-family: 'JetBrains Mono', monospace; font-weight: 700; }
.byok-status .byok-dot { width: 6px; height: 6px; display: inline-block; background: var(--accent); }
.byok-status[data-state="ok"] .byok-dot { background: var(--black); }

/* ========== AUTH (user pill, in topbar) ========== */
.auth-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-weight: 600;
    color: var(--black);
    border: 1px solid var(--black);
    padding: 4px 10px;
}
.auth-pill .auth-name { font-weight: 700; }
.auth-pill button {
    background: transparent;
    border: 0;
    color: var(--accent);
    font: inherit;
    font-weight: 700;
    cursor: pointer;
    padding: 0;
    letter-spacing: 0.16em;
}
.auth-pill button:hover { text-decoration: underline; text-underline-offset: 4px; }

/* ========== BYOK BANNER (no-key warning) ========== */
.byok-banner {
    display: none;
    background: var(--white);
    border-bottom: var(--rule);
    border-top: var(--rule);
    background-image:
        repeating-linear-gradient(
            45deg,
            transparent 0 8px,
            rgba(255,0,0,0.06) 8px 9px
        );
}
.byok-banner.show { display: block; }
.byok-banner-row {
    display: grid;
    grid-template-columns: 56px 1fr auto;
    column-gap: 24px;
    align-items: center;
    padding: 20px 0;
}
.byok-banner-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 32px;
    font-weight: 700;
    color: var(--accent);
    line-height: 1;
    text-align: center;
}
.byok-banner-title {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--black);
    margin-bottom: 4px;
}
.byok-banner-msg {
    font-size: 13px;
    line-height: 1.5;
    color: var(--gray-900);
}
.byok-banner-msg code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    background: var(--gray-100);
    padding: 1px 6px;
    border: 1px solid var(--gray-300);
}
.byok-banner-link {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--white);
    background: var(--accent);
    padding: 14px 20px;
    border: 1px solid var(--accent);
}
.byok-banner-link:hover { background: var(--black); border-color: var(--black); text-decoration: none; }

/* ========== BYOK NOTICE (settings page, above the form) ========== */
.byok-notice {
    display: grid;
    grid-template-columns: 88px 1fr;
    column-gap: 24px;
    align-items: start;
    border-top: var(--rule-soft);
    border-bottom: var(--rule-soft);
    padding: 20px 0;
    margin-top: 4px;
    background-image:
        repeating-linear-gradient(
            45deg,
            transparent 0 8px,
            rgba(255,0,0,0.04) 8px 9px
        );
}
.byok-notice-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.18em;
    color: var(--accent);
    padding: 4px 10px;
    border: 1px solid var(--accent);
    display: inline-block;
    align-self: start;
    justify-self: start;
}
.byok-notice-title {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--black);
    margin-bottom: 6px;
}
.byok-notice-msg {
    font-size: 13px;
    line-height: 1.5;
    color: var(--gray-900);
}
.byok-notice-msg code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    background: var(--gray-100);
    padding: 1px 6px;
    border: 1px solid var(--gray-300);
}

/* ========== HERO ========== */
.hero {
    border-bottom: var(--rule);
    padding: 0;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    column-gap: var(--gutter);
}
.hero .index {
    grid-column: 1 / span 1;
    padding: 24px 0 0 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--gray-600);
}
.hero .headline {
    grid-column: 2 / span 8;
    padding: 32px 0 40px 0;
}
.hero h1 {
    font-family: 'Inter', sans-serif;
    font-weight: 800;
    font-size: clamp(48px, 9vw, 128px);
    line-height: 0.95;
    letter-spacing: -0.04em;
    color: var(--black);
}
.hero h1 .amp { color: var(--accent); }
.hero .lede {
    grid-column: 10 / span 3;
    align-self: end;
    padding: 0 0 40px 0;
    font-size: 13px;
    line-height: 1.5;
    color: var(--gray-900);
    border-top: var(--rule);
    padding-top: 12px;
}

/* ========== FORM (shared input/select/textarea styling) ========== */
.form-group label {
    display: block;
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 600;
    color: var(--black);
    margin-bottom: 8px;
}
.form-group label .req { color: var(--accent); }
.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="password"],
.form-group input[type="number"],
.form-group select,
.form-group textarea {
    width: 100%;
    border: none;
    border-bottom: 1px solid var(--black);
    background: transparent;
    padding: 6px 0 8px 0;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 400;
    color: var(--black);
    outline: none;
    border-radius: 0;
    -webkit-appearance: none;
    appearance: none;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    border-bottom: 2px solid var(--accent);
    padding-bottom: 7px;
}
.form-group textarea {
    resize: vertical;
    min-height: 80px;
    line-height: 1.5;
}
.form-group input::placeholder,
.form-group textarea::placeholder { color: var(--gray-600); }
.form-group select {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' stroke='%23000' stroke-width='1.4' fill='none'/></svg>");
    background-repeat: no-repeat;
    background-position: right 0 center;
    padding-right: 24px;
}
.form-group .help-text {
    display: block;
    margin-top: 8px;
    font-size: 12px;
    color: var(--gray-600);
    letter-spacing: 0.02em;
}
.form-error {
    color: var(--accent);
    font-size: 12px;
    margin-top: 6px;
    font-weight: 500;
}

/* ========== BUTTONS (shared) ========== */
.btn-primary, .btn-secondary, .btn-danger {
    padding: 18px 24px;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 0;
    border: 1px solid var(--black);
    transition: background 120ms linear, color 120ms linear;
}
.btn-primary { background: var(--black); color: var(--white); }
.btn-primary:hover { background: var(--accent); border-color: var(--accent); }
.btn-primary:disabled { background: var(--gray-300); border-color: var(--gray-300); color: var(--gray-600); cursor: not-allowed; }
.btn-secondary { background: var(--white); color: var(--black); }
.btn-secondary:hover { background: var(--black); color: var(--white); }
.btn-google {
    background: var(--white);
    color: var(--black);
    border: 1px solid var(--black);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}
.btn-google:hover { background: var(--gray-100); }
.btn-google svg { width: 18px; height: 18px; }

/* ========== FOOTER ========== */
.footer {
    border-top: var(--rule);
    padding: 24px 0;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    column-gap: var(--gutter);
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--gray-600);
    margin-top: auto;
}
.footer .col-1 { grid-column: 1 / span 4; }
.footer .col-2 { grid-column: 5 / span 4; }
.footer .col-3 { grid-column: 9 / span 4; text-align: right; }
.footer a { color: var(--black); }
.footer .accent-dot { color: var(--accent); }

/* ========== MODAL ========== */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.55);
    display: none;
    align-items: stretch;
    justify-content: stretch;
    z-index: 100;
}
.modal-overlay.show { display: flex; }
.modal-content {
    background: var(--white);
    margin: auto;
    width: min(560px, calc(100% - 64px));
    border: 1px solid var(--black);
    padding: 0;
}
.modal-head {
    border-bottom: var(--rule);
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-weight: 700;
}
.modal-head .lab { color: var(--accent); font-family: 'JetBrains Mono', monospace; font-size: 11px; }
.modal-body { padding: 24px; }
.modal-title { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 12px; }
.modal-message { font-size: 14px; line-height: 1.5; color: var(--gray-900); }
.modal-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-top: var(--rule);
}
.modal-actions .modal-btn {
    background: var(--white);
    color: var(--black);
    border: none;
    border-right: var(--rule);
    padding: 18px 20px;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
}
.modal-actions .modal-btn:last-child { border-right: none; }
.modal-actions .modal-btn:hover { background: var(--gray-100); }
.modal-actions .modal-btn-confirm { background: var(--black); color: var(--white); }
.modal-actions .modal-btn-confirm:hover { background: var(--accent); }

/* ========== AUTH PAGE (login / sign-up) ========== */
.auth-page {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    column-gap: var(--gutter);
    align-items: start;
    padding: 48px 0 64px 0;
}
.auth-page .auth-intro {
    grid-column: 1 / span 5;
    border-top: var(--rule);
    padding: 24px 0 0 0;
}
.auth-page .auth-intro h2 {
    font-family: 'Inter', sans-serif;
    font-weight: 800;
    font-size: clamp(40px, 5vw, 72px);
    line-height: 0.95;
    letter-spacing: -0.03em;
    margin-bottom: 16px;
}
.auth-page .auth-intro h2 .amp { color: var(--accent); }
.auth-page .auth-intro p {
    font-size: 14px;
    line-height: 1.6;
    color: var(--gray-900);
    max-width: 36ch;
}
.auth-page .auth-card {
    grid-column: 7 / span 6;
    border-top: var(--rule);
    padding: 24px 0 0 0;
}
.auth-page .auth-tabs {
    display: flex;
    gap: 0;
    border-bottom: var(--rule);
    margin-bottom: 24px;
}
.auth-page .auth-tab {
    flex: 1;
    text-align: center;
    padding: 14px 0;
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--gray-600);
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    font-family: inherit;
}
.auth-page .auth-tab.active { color: var(--black); border-bottom-color: var(--black); }
.auth-page .auth-tab:hover { color: var(--black); }
.auth-page .auth-form { display: grid; row-gap: 16px; }
.auth-page .auth-form .form-group { padding: 0; border: 0; }
.auth-page .auth-actions { display: grid; row-gap: 8px; margin-top: 8px; }
.auth-page .auth-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 8px 0;
    color: var(--gray-600);
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
}
.auth-page .auth-divider::before,
.auth-page .auth-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--gray-300);
}
.auth-page .auth-status {
    padding: 12px 0;
    border-top: var(--rule-soft);
    border-bottom: var(--rule-soft);
    font-size: 13px;
    font-weight: 500;
    display: none;
}
.auth-page .auth-status.show { display: block; }
.auth-page .auth-status.status-error { color: var(--accent); border-color: var(--accent); }
.auth-page .auth-status.status-success { color: var(--black); }

/* ========== RESPONSIVE ========== */
@media (max-width: 900px) {
    :root { --gutter: 16px; --pad-x: 20px; }
    .hero .index, .hero .lede { display: none; }
    .hero .headline { grid-column: 1 / -1; padding: 24px 0 32px 0; }
    .footer .col-1, .footer .col-2, .footer .col-3 { grid-column: 1 / -1; text-align: left; margin-bottom: 4px; }
    .byok-banner-row { grid-template-columns: 1fr; row-gap: 12px; padding: 16px 0; }
    .byok-banner-num { text-align: left; font-size: 24px; }
    .topbar-right { gap: 12px; }
    .byok-status { font-size: 10px; padding: 3px 8px; }
    .byok-notice { grid-template-columns: 1fr; row-gap: 12px; }
    .byok-notice-num { justify-self: start; }
    .auth-page { padding: 24px 0; }
    .auth-page .auth-intro,
    .auth-page .auth-card { grid-column: 1 / -1; }
    .auth-page .auth-intro { margin-bottom: 24px; }
}
`;

// Helper that wraps a `<style>…</style>` block in the standard document head.
export function renderStyle(css: string): string {
  return `<style>\n${css}\n</style>`;
}

// Standard `<head>` boilerplate. Page-specific <title> and extra meta are
// passed in.
export function renderHead(opts: { title: string; pageStyles: string }): string {
  return `<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${opts.title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    ${renderStyle(SWISS_BASE_CSS)}
    ${renderStyle(opts.pageStyles)}
</head>`;
}

// Standard footer (used on every page).
export function renderFooter(i18n: FooterStrings): string {
  return `<footer class="footer">
        <div class="col-1">${i18n.copyright}</div>
        <div class="col-2">${i18n.typeface}</div>
        <div class="col-3">${i18n.by.replace('{link}', '<a href="https://azzar.netlify.app/porto" target="_blank">LilyOpenCMS</a>')}</div>
    </footer>`;
}

export interface FooterStrings {
  copyright: string;
  typeface: string;
  by: string; // uses {link} placeholder
}

export const FOOTER_STRINGS: Record<'english' | 'indonesian', FooterStrings> = {
  english: {
    copyright: 'Quill&trade; <span class="accent-dot">&middot;</span> Ed. 02 / 2026',
    typeface: 'Set in Inter &amp; JetBrains Mono',
    by: 'By {link}',
  },
  indonesian: {
    copyright: 'Quill&trade; <span class="accent-dot">&middot;</span> Ed. 02 / 2026',
    typeface: 'Diketik dalam Inter &amp; JetBrains Mono',
    by: 'Oleh {link}',
  },
};
