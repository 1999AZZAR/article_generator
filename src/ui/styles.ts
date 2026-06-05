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
    --burgundy: #8B0000;
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
    padding: 0;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: stretch;
    min-height: 56px;
    font-size: 11px;
    font-weight: 500;
}
.topbar a { color: var(--black); }
.topbar a:hover { text-decoration: none; }

.topbar-left {
    display: flex;
    align-items: stretch;
    border-right: var(--rule);
}
.topbar-right {
    display: flex;
    align-items: stretch;
    justify-content: flex-end;
    border-left: var(--rule);
}

/* Brand mark (left) */
.brand {
    display: flex;
    align-items: center;
    padding: 0 24px;
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: -0.02em;
    text-transform: none;
    color: var(--black);
    border-right: var(--rule);
    background: var(--white);
}
.brand:hover { background: var(--gray-100); }
.brand-mark { line-height: 1; }
.brand-tm { color: var(--burgundy); margin-left: 2px; font-size: 0.7em; vertical-align: super; }

/* Primary nav (centre-left) — Polaris "Navigation" pattern in Swiss treatment */
.topbar-nav {
    display: flex;
    align-items: stretch;
}
.topbar-nav-link {
    display: flex;
    align-items: center;
    padding: 0 20px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gray-600);
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: color 80ms linear, border-color 80ms linear;
}
.topbar-nav-link:hover { color: var(--black); }
.topbar-nav-link.active {
    color: var(--black);
    border-bottom-color: var(--accent);
}
.topbar-nav-link .nav-num {
    font-family: 'JetBrains Mono', monospace;
    color: var(--accent);
    margin-right: 8px;
    font-size: 10px;
    font-weight: 400;
}

/* ========== BYOK STATUS (topbar chip, Polaris "Tag" pattern) ========== */
.byok-chip {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 0 20px;
    height: 100%;
    border: 0;
    border-left: var(--rule);
    background: transparent;
    color: var(--gray-600);
    font: inherit;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    cursor: pointer;
    text-decoration: none;
}
.byok-chip:hover { background: var(--gray-100); color: var(--black); }
.byok-chip[data-state="ok"] { color: var(--black); }
.byok-chip[data-state="missing"] { color: var(--accent); }
.byok-chip-dot {
    width: 6px; height: 6px;
    background: var(--accent);
    flex-shrink: 0;
}
.byok-chip[data-state="ok"] .byok-chip-dot { background: var(--black); }
.byok-chip-lab { font-family: 'JetBrains Mono', monospace; font-weight: 700; }
.byok-chip-text { font-size: 11px; }

/* Legacy alias — kept for the byok-banner block in pages that still uses it */
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

/* ========== ACCOUNT MENU (Polaris ActionList pattern, Swiss treatment) ========== */
.account-menu { position: relative; display: flex; align-items: stretch; }
.account-trigger[hidden],
.account-backdrop[hidden],
.account-dropdown[hidden] { display: none !important; }
.signin-btn[hidden] { display: none !important; }

.account-trigger {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 16px 0 20px;
    height: 100%;
    border: 0;
    border-left: var(--rule);
    background: transparent;
    color: var(--black);
    font: inherit;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    cursor: pointer;
}
.account-trigger:hover { background: var(--gray-100); }
.account-trigger[aria-expanded="true"] { background: var(--black); color: var(--white); }
.account-trigger[aria-expanded="true"] .account-avatar { background: var(--accent); color: var(--white); }
.account-avatar {
    width: 28px; height: 28px;
    display: inline-flex;
    align-items: center; justify-content: center;
    background: var(--black);
    color: var(--white);
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0;
    text-transform: uppercase;
    flex-shrink: 0;
}
.account-trigger-name {
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.account-caret {
    width: 10px; height: 10px;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' stroke='%23000' stroke-width='1.4' fill='none'/></svg>");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 10px 6px;
    transition: transform 120ms linear;
    flex-shrink: 0;
}
.account-trigger[aria-expanded="true"] .account-caret {
    transform: rotate(180deg);
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' stroke='%23fff' stroke-width='1.4' fill='none'/></svg>");
}

.topbar .signin-btn,
.signin-btn {
    display: flex;
    align-items: center;
    padding: 0 24px;
    height: 100%;
    border: 0;
    border-left: var(--rule);
    background: var(--black);
    color: var(--white);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    text-decoration: none;
    cursor: pointer;
    line-height: 1;
}
.signin-btn:hover { background: var(--accent); color: var(--white); text-decoration: none; }
.signin-btn[hidden] { display: none; }

.account-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 100;
    min-width: 280px;
    background: var(--white);
    border: 1px solid var(--black);
    border-top: 0;
    box-shadow: 0 8px 0 -7px var(--black);
}
.account-dropdown[hidden] { display: none; }

.account-dropdown-head {
    display: grid;
    grid-template-columns: 40px 1fr;
    gap: 12px;
    padding: 16px;
    border-bottom: var(--rule);
    align-items: center;
    background: var(--white);
}
.account-avatar-lg {
    width: 40px; height: 40px;
    display: inline-flex;
    align-items: center; justify-content: center;
    background: var(--accent);
    color: var(--white);
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 700;
    flex-shrink: 0;
}
.account-info { min-width: 0; }
.account-name {
    font-size: 14px;
    font-weight: 700;
    color: var(--black);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    letter-spacing: 0; text-transform: none;
}
.account-email {
    font-size: 11px;
    color: var(--gray-600);
    font-family: 'JetBrains Mono', monospace;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    margin-top: 2px;
    letter-spacing: 0; text-transform: none;
}

.account-dropdown-list { display: flex; flex-direction: column; }
.account-dropdown-item {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    padding: 12px 16px;
    border: 0;
    border-bottom: var(--rule);
    background: transparent;
    color: var(--black);
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    text-align: left;
    text-decoration: none;
    cursor: pointer;
    width: 100%;
    letter-spacing: 0;
    text-transform: none;
}
.account-dropdown-item:last-child { border-bottom: 0; }
.account-dropdown-item:hover { background: var(--gray-100); text-decoration: none; }
.account-dropdown-item[aria-current="page"] { background: var(--gray-100); border-left: 2px solid var(--accent); padding-left: 14px; }
.account-dropdown-label { font-size: 13px; }
.account-dropdown-meta {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--gray-600);
    letter-spacing: 0.16em;
    text-transform: uppercase;
}
.account-dropdown-item-danger .account-dropdown-label { color: var(--accent); }
.account-dropdown-item-danger .account-dropdown-meta { color: var(--accent); }
.account-dropdown-item-danger:hover { background: var(--accent); color: var(--white); }
.account-dropdown-item-danger:hover .account-dropdown-meta { color: var(--white); }

.account-dropdown-foot {
    padding: 8px 16px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--gray-600);
    border-top: var(--rule);
    display: flex;
    justify-content: space-between;
}

/* Backdrop when dropdown is open (click anywhere to close) */
.account-backdrop {
    position: fixed; inset: 0; z-index: 99;
    background: transparent;
}
.account-backdrop[hidden] { display: none; }

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
.form-group input:hover:not(:focus),
.form-group select:hover:not(:focus),
.form-group textarea:hover:not(:focus) {
    border-bottom-color: var(--accent);
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    border-bottom: 2px solid var(--accent);
    padding-bottom: 7px;
}
.form-group input:disabled,
.form-group select:disabled,
.form-group textarea:disabled {
    color: var(--gray-600);
    border-bottom-color: var(--gray-300);
    cursor: not-allowed;
    background: transparent;
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
.modal-extra {
    margin-top: 16px;
    padding-top: 16px;
    border-top: var(--rule-soft);
}
.modal-checkbox {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    font-weight: 400;
    color: var(--black);
    cursor: pointer;
    text-transform: none;
    letter-spacing: 0;
}
.modal-checkbox input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border: 1px solid var(--black);
    background: var(--white);
    cursor: pointer;
    position: relative;
    margin: 0;
    flex-shrink: 0;
    border-radius: 0;
}
.modal-checkbox input[type="checkbox"]:checked {
    background: var(--black);
}
.modal-checkbox input[type="checkbox"]:checked::after {
    content: '';
    position: absolute;
    left: 4px;
    top: 1px;
    width: 4px;
    height: 8px;
    border: solid var(--white);
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}
.modal-checkbox input[type="checkbox"]:focus {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}

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
.auth-page .auth-row-between {
    display: flex;
    justify-content: flex-end;
    margin-top: -4px;
    margin-bottom: 4px;
}
.auth-page .auth-link-muted {
    text-decoration: none;
    transition: color 120ms linear, border-color 120ms linear;
}
.auth-page .auth-link-muted:hover {
    color: var(--black);
    border-bottom-color: var(--black);
}
.auth-page .btn-primary[disabled],
.auth-page .btn-google[disabled] {
    opacity: 0.55;
    cursor: not-allowed;
    pointer-events: none;
}
.auth-page .auth-tab[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
}

/* ========== RESPONSIVE ========== */
@media (max-width: 900px) {
    :root { --gutter: 16px; --pad-x: 20px; }
    .hero .index, .hero .lede { display: none; }
    .hero .headline { grid-column: 1 / -1; padding: 24px 0 32px 0; }
    .footer .col-1, .footer .col-2, .footer .col-3 { grid-column: 1 / -1; text-align: left; margin-bottom: 4px; }
    .byok-banner-row { grid-template-columns: 1fr; row-gap: 12px; padding: 16px 0; }
    .byok-banner-num { text-align: left; font-size: 24px; }
    .topbar { min-height: 48px; }
    .brand { padding: 0 16px; font-size: 16px; }
    .topbar-nav-link { padding: 0 12px; letter-spacing: 0.14em; }
    .byok-chip { padding: 0 12px; letter-spacing: 0.12em; }
    .byok-chip-text { display: none; }
    .account-trigger-name { display: none; }
    .account-trigger { padding: 0 14px; }
    .signin-btn { padding: 0 16px; }
    .account-dropdown { min-width: 260px; right: -8px; }
    .byok-status { font-size: 10px; padding: 3px 8px; }
    .byok-notice { grid-template-columns: 1fr; row-gap: 12px; }
    .byok-notice-num { justify-self: start; }
    .auth-page { padding: 24px 0; }
    .auth-page .auth-intro,
    .auth-page .auth-card { grid-column: 1 / -1; }
    .auth-page .auth-intro { margin-bottom: 24px; }
}

/* ========== SWISS-ARCHIVAL DETAILS ========== */
/* Paper-grain texture (fixed, behind everything; fixed-position so it doesn't
   scroll or interfere with hits). Uses feTurbulence with the reference values
   from the Swiss-Archival ruleset: baseFrequency 0.65, opacity 0.035. */
.paper-grain {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 0;
    opacity: 0.035;
    mix-blend-mode: multiply;
}
.container { position: relative; z-index: 1; }

/* Blueprint construction guides — twelve 1px vertical hairlines at the
   column boundaries, only visible at 1200px+ viewports. The 12-col grid
   has each column at 1280px / 12 = 106.67px wide. */
.construction-guides {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 1280px;
    height: 100vh;
    pointer-events: none;
    z-index: 0;
    display: none;
}
@media (min-width: 1200px) {
    .construction-guides { display: block; }
}
.construction-guides svg { width: 100%; height: 100%; display: block; }
.construction-guides line { stroke: rgba(115, 110, 100, 0.18); stroke-width: 1; }
.construction-guides line.gutter { stroke: rgba(115, 110, 100, 0.08); }
.construction-guides line.outer { stroke: rgba(115, 110, 100, 0.22); }

/* Corner crop marks — four L-shaped 1px hairlines at the page corners,
   only visible at 1200px+ viewports. Crop marks are a museum/archive
   printing convention that says "this is a finished specimen, not a draft". */
.crop-marks {
    position: fixed;
    inset: 24px 24px 24px 24px;
    pointer-events: none;
    z-index: 9999;
    display: none;
}
@media (min-width: 1200px) {
    .crop-marks { display: block; }
}
.crop-marks::before,
.crop-marks::after,
.crop-marks > span::before,
.crop-marks > span::after {
    content: '';
    position: absolute;
    width: 14px;
    height: 14px;
    border: 0 solid var(--black);
}
.crop-marks::before { top: 0; left: 0; border-top-width: 1px; border-left-width: 1px; }
.crop-marks::after { top: 0; right: 0; border-top-width: 1px; border-right-width: 1px; }
.crop-marks > span::before { bottom: 0; left: 0; border-bottom-width: 1px; border-left-width: 1px; }
.crop-marks > span::after { bottom: 0; right: 0; border-bottom-width: 1px; border-right-width: 1px; }

/* Specimen SVG container — used both in the footer and next to the
   loading status. Square aspect, tiny, never crosses the form flow. */
.specimen-svg {
    width: 100%;
    height: 100%;
    display: block;
    color: var(--gray-600);
}
.specimen-block {
    display: flex;
    align-items: center;
    gap: 10px;
}
.specimen-block .specimen-figure {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    color: var(--gray-900);
    animation: specimen-rotate 18s linear infinite;
}
@keyframes specimen-rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
    .specimen-block .specimen-figure { animation: none; }
}

/* Loading state ornament — a small specimen next to the spinning dots. */
.loading-specimen {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 0;
    border-top: var(--rule-soft);
    border-bottom: var(--rule-soft);
    margin-bottom: 14px;
}
.loading-specimen .specimen-figure {
    width: 38px;
    height: 38px;
    color: var(--accent);
    animation: specimen-rotate 8s linear infinite;
}
.loading-specimen-meta {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--gray-600);
    line-height: 1.4;
}
.loading-specimen-meta .specimen-sid { color: var(--accent); }

/* Specimen SVG tucked into the result-head — a tiny corner ornament
   that re-renders for each result block. */
.result-head .specimen-mark-svg {
    width: 18px;
    height: 18px;
    color: var(--gray-900);
    margin-left: auto;
    flex-shrink: 0;
    align-self: center;
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

// Shared topbar used on every page. Hybrid: Swiss grid + Polaris nav patterns
// (brand mark, primary nav, BYOK chip, account menu with ActionList dropdown).
// `active` is one of: 'generator' | 'workspace' | 'settings' | 'login'.
export type TopbarPage = 'generator' | 'workspace' | 'settings' | 'login';

export interface TopbarStrings {
  brandAria: string;
  navGenerator: string;
  navWorkspace: string;
  navSettings: string;
  byokAria: string;
  byokLabel: string;
  byokSet: string;
  byokMissing: string;
  signIn: string;
  accountAria: string;
  menuAccount: string;
  menuWorkspace: string;
  menuWorkspaceMeta: string;
  menuSettings: string;
  menuSettingsMeta: string;
  menuSignOut: string;
  menuSignOutMeta: string;
  footPrefix: string;
  footVersion: string;
}

const TOPBAR_STRINGS_EN: TopbarStrings = {
  brandAria: 'Quill home',
  navGenerator: 'Generator',
  navWorkspace: 'Workspace',
  navSettings: 'Settings',
  byokAria: 'BYOK — Bring Your Own Key',
  byokLabel: 'BYOK',
  byokSet: 'Key Set',
  byokMissing: 'No Key',
  signIn: 'Sign in',
  accountAria: 'Account menu',
  menuAccount: 'Account',
  menuWorkspace: 'Workspace',
  menuWorkspaceMeta: 'WS',
  menuSettings: 'Settings',
  menuSettingsMeta: 'CFG',
  menuSignOut: 'Sign out',
  menuSignOutMeta: 'EXIT',
  footPrefix: 'BYOK',
  footVersion: 'v0.2',
};

const TOPBAR_STRINGS_ID: TopbarStrings = {
  brandAria: 'Beranda Quill',
  navGenerator: 'Generator',
  navWorkspace: 'Ruang Kerja',
  navSettings: 'Pengaturan',
  byokAria: 'BYOK — Bawa Kunci Anda Sendiri',
  byokLabel: 'BYOK',
  byokSet: 'Kunci Disetel',
  byokMissing: 'Tanpa Kunci',
  signIn: 'Masuk',
  accountAria: 'Menu akun',
  menuAccount: 'Akun',
  menuWorkspace: 'Ruang Kerja',
  menuWorkspaceMeta: 'WK',
  menuSettings: 'Pengaturan',
  menuSettingsMeta: 'CFG',
  menuSignOut: 'Keluar',
  menuSignOutMeta: 'KELUAR',
  footPrefix: 'BYOK',
  footVersion: 'v0.2',
};

export function getTopbarStrings(lang: 'english' | 'indonesian'): TopbarStrings {
  return lang === 'indonesian' ? TOPBAR_STRINGS_ID : TOPBAR_STRINGS_EN;
}

export function renderTopbar(active: TopbarPage, lang: 'english' | 'indonesian' = 'english'): string {
  const t = getTopbarStrings(lang);
  return `<div class="topbar">
        <div class="topbar-left">
            <a href="/" class="brand" aria-label="${t.brandAria}">
                <span class="brand-mark">Quill</span><span class="brand-tm">™</span>
            </a>
            <nav class="topbar-nav" aria-label="Primary">
                <a href="/" class="topbar-nav-link${active === 'generator' ? ' active' : ''}" data-page="generator" ${active === 'generator' ? 'aria-current="page"' : ''}>
                    <span class="nav-num">01</span>${t.navGenerator}
                </a>
                <a href="/workspace" class="topbar-nav-link${active === 'workspace' ? ' active' : ''}" data-page="workspace" ${active === 'workspace' ? 'aria-current="page"' : ''}>
                    <span class="nav-num">02</span>${t.navWorkspace}
                </a>
                <a href="/settings" class="topbar-nav-link${active === 'settings' ? ' active' : ''}" data-page="settings" ${active === 'settings' ? 'aria-current="page"' : ''}>
                    <span class="nav-num">03</span>${t.navSettings}
                </a>
            </nav>
        </div>
        <div class="topbar-right">
            <a href="/settings" class="byok-chip" id="byokStatus" data-state="missing" title="${t.byokAria}">
                <span class="byok-chip-dot" aria-hidden="true"></span>
                <span class="byok-chip-lab">${t.byokLabel}</span>
                <span class="byok-chip-text" id="byokStateText">${t.byokMissing}</span>
            </a>
            <div class="account-menu" id="accountMenu">
                <button type="button" class="account-trigger" id="accountTrigger" aria-haspopup="menu" aria-expanded="false" aria-label="${t.accountAria}" hidden>
                    <span class="account-avatar" id="accountAvatar">--</span>
                    <span class="account-trigger-name" id="accountTriggerName"></span>
                    <span class="account-caret" aria-hidden="true"></span>
                </button>
                <a href="/login" class="signin-btn" id="authSignInLink" ${active === 'login' ? 'aria-current="page"' : ''}>${t.signIn}</a>
                <div class="account-backdrop" id="accountBackdrop" hidden></div>
                <div class="account-dropdown" id="accountDropdown" role="menu" hidden>
                    <div class="account-dropdown-head">
                        <div class="account-avatar-lg" id="accountAvatarLg">--</div>
                        <div class="account-info">
                            <div class="account-name" id="accountName">—</div>
                            <div class="account-email" id="accountEmail">—</div>
                        </div>
                    </div>
                    <div class="account-dropdown-list" role="none">
                        <a href="/workspace" class="account-dropdown-item" role="menuitem" ${active === 'workspace' ? 'aria-current="page"' : ''}>
                            <span class="account-dropdown-label">${t.menuWorkspace}</span>
                            <span class="account-dropdown-meta">${t.menuWorkspaceMeta}</span>
                        </a>
                        <a href="/settings" class="account-dropdown-item" role="menuitem" ${active === 'settings' ? 'aria-current="page"' : ''}>
                            <span class="account-dropdown-label">${t.menuSettings}</span>
                            <span class="account-dropdown-meta">${t.menuSettingsMeta}</span>
                        </a>
                        <button type="button" class="account-dropdown-item account-dropdown-item-danger" id="authSignOutBtn" role="menuitem">
                            <span class="account-dropdown-label">${t.menuSignOut}</span>
                            <span class="account-dropdown-meta">${t.menuSignOutMeta}</span>
                        </button>
                    </div>
                    <div class="account-dropdown-foot">
                        <span>${t.footPrefix} · ${t.footVersion}</span>
                        <span id="accountFootUid">—</span>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

export interface FooterStrings {
  copyright: string;
  typeface: string;
  by: string; // uses {link} placeholder
}

export const FOOTER_STRINGS: Record<'english' | 'indonesian', FooterStrings> = {
  english: {
    copyright: 'Quill<span class="brand-tm">™</span> <span class="accent-dot">&middot;</span> Ed. 02 / 2026',
    typeface: 'Set in Inter &amp; JetBrains Mono',
    by: 'By {link}',
  },
  indonesian: {
    copyright: 'Quill<span class="brand-tm">™</span> <span class="accent-dot">&middot;</span> Ed. 02 / 2026',
    typeface: 'Diketik dalam Inter &amp; JetBrains Mono',
    by: 'Oleh {link}',
  },
};

// Swiss-Archival details: paper grain (fixed SVG noise), construction guides
// (12-col vertical hairlines at the column boundaries, wide viewports only),
// and corner crop marks. Emitted in the page body so every page gets the
// museum-archive feel without per-page wiring.
export const ARCHIVAL_DETAILS_HTML = `
<div class="paper-grain" aria-hidden="true">
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <filter id="quill-paper-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="2" stitchTiles="stitch" seed="7"/>
            <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.6 0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#quill-paper-grain)"/>
    </svg>
</div>
<div class="construction-guides" aria-hidden="true">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 800" preserveAspectRatio="none">
        <line class="outer" x1="0" y1="0" x2="0" y2="800"/>
        <line class="outer" x1="1280" y1="0" x2="1280" y2="800"/>
        <line class="gutter" x1="106.67" y1="0" x2="106.67" y2="800"/>
        <line x1="213.33" y1="0" x2="213.33" y2="800"/>
        <line x1="320" y1="0" x2="320" y2="800"/>
        <line x1="426.67" y1="0" x2="426.67" y2="800"/>
        <line x1="533.33" y1="0" x2="533.33" y2="800"/>
        <line x1="640" y1="0" x2="640" y2="800"/>
        <line x1="746.67" y1="0" x2="746.67" y2="800"/>
        <line x1="853.33" y1="0" x2="853.33" y2="800"/>
        <line x1="960" y1="0" x2="960" y2="800"/>
        <line x1="1066.67" y1="0" x2="1066.67" y2="800"/>
        <line x1="1173.33" y1="0" x2="1173.33" y2="800"/>
    </svg>
</div>
<div class="crop-marks" aria-hidden="true"><span></span></div>
`;

