// UI generation functions for Quill AI Writing Assistant
// Design system: Swiss (International Typographic Style)
// - 12-column grid, hairline 1px rules, sharp 0-4px corners
// - Inter Display + Inter Text, tight headlines, wide-tracked uppercase captions
// - Black / White / Signal Red palette, no shadows, no gradients

export function generateMainPageHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quill — AI Writing Assistant</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
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

        /* ========== CONTAINER ========== */
        .container {
            max-width: var(--container-max);
            margin: 0 auto;
            padding-left: var(--pad-x);
            padding-right: var(--pad-x);
            width: 100%;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        html, body { background: var(--white); color: var(--black); }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-weight: 400;
            font-size: 15px;
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            min-height: 100vh;
            padding: 0;
        }

        a { color: inherit; text-decoration: none; }
        a:hover { text-decoration: underline; text-underline-offset: 4px; text-decoration-thickness: 1px; }

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
        .topbar-right { display: flex; align-items: center; gap: 20px; }

        /* ========== BYOK STATUS (topbar) ========== */
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
        .byok-status[data-state="ok"]   { color: var(--black); border-color: var(--black); }
        .byok-status[data-state="missing"] { color: var(--accent); border-color: var(--accent); }
        .byok-status .byok-lab { font-family: 'JetBrains Mono', monospace; font-weight: 700; }
        .byok-status .byok-dot {
            width: 6px; height: 6px;
            display: inline-block;
            background: var(--accent);
        }
        .byok-status[data-state="ok"] .byok-dot { background: var(--black); }

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

        /* ========== SECTION LABEL ========== */
        .section-label {
            padding: 14px 0;
            border-bottom: var(--rule);
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            column-gap: var(--gutter);
            align-items: center;
            font-size: 11px;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            font-weight: 600;
        }
        .section-label .num { grid-column: 1 / span 1; color: var(--accent); font-family: 'JetBrains Mono', monospace; }
        .section-label .title { grid-column: 2 / span 8; }
        .section-label .meta { grid-column: 10 / span 3; text-align: right; color: var(--gray-600); font-weight: 400; letter-spacing: 0.12em; }

        /* ========== GENERATOR GRID ========== */
        .generator {
            padding: 0;
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            column-gap: var(--gutter);
            border-bottom: var(--rule);
        }
        .form-grid {
            grid-column: 1 / span 12;
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            column-gap: var(--gutter);
            row-gap: 0;
        }
        .form-group {
            grid-column: span 6;
            border-top: var(--rule-soft);
            padding: 16px 0 20px 0;
        }
        .form-group.full { grid-column: span 12; }
        .form-group.half { grid-column: span 6; }
        .form-group.third { grid-column: span 4; }

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
        .form-group input[type="number"],
        .form-group input[type="password"],
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
        .form-group select {
            background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' stroke='%23000' stroke-width='1.4' fill='none'/></svg>");
            background-repeat: no-repeat;
            background-position: right 0 center;
            padding-right: 24px;
        }
        .form-group input::placeholder,
        .form-group textarea::placeholder { color: var(--gray-600); }

        .form-group .custom-field {
            margin-top: 8px;
        }
        .optgroup-label {
            font-weight: 600;
            font-style: normal;
            color: var(--gray-600);
        }

        /* Tag input row */
        .tag-row {
            display: grid;
            grid-template-columns: 1fr auto;
            column-gap: 8px;
            align-items: end;
        }
        .tag-input {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            padding-top: 6px;
        }
        .tag-input:empty::before {
            content: attr(data-empty);
            color: var(--gray-600);
            font-size: 14px;
        }
        .chip {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 8px 4px 10px;
            border: 1px solid var(--black);
            font-size: 12px;
            font-weight: 500;
            letter-spacing: 0.04em;
            text-transform: uppercase;
        }
        .chip .x {
            cursor: pointer;
            color: var(--accent);
            font-weight: 700;
            line-height: 1;
        }

        .add-btn {
            border: 1px solid var(--black);
            background: var(--white);
            color: var(--black);
            padding: 8px 14px;
            font-family: 'Inter', sans-serif;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            cursor: pointer;
            border-radius: 0;
        }
        .add-btn:hover { background: var(--black); color: var(--white); }

        /* Action row */
        .action-row {
            grid-column: 1 / span 12;
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            column-gap: var(--gutter);
            padding: 24px 0 32px 0;
            border-top: var(--rule);
            margin-top: 8px;
            align-items: center;
        }
        .action-row .generate-btn {
            grid-column: 1 / span 8;
            background: var(--black);
            color: var(--white);
            border: 1px solid var(--black);
            padding: 18px 24px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            cursor: pointer;
            border-radius: 0;
            transition: background 120ms linear, color 120ms linear;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .action-row .generate-btn:hover { background: var(--accent); border-color: var(--accent); }
        .action-row .generate-btn:disabled { background: var(--gray-300); border-color: var(--gray-300); color: var(--gray-600); cursor: not-allowed; }
        .action-row .generate-btn .arrow { font-family: 'JetBrains Mono', monospace; font-weight: 400; }
        .action-row .reset-btn {
            grid-column: 9 / span 4;
            background: var(--white);
            color: var(--black);
            border: 1px solid var(--black);
            padding: 18px 24px;
            font-family: 'Inter', sans-serif;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            cursor: pointer;
            border-radius: 0;
        }
        .action-row .reset-btn:hover { background: var(--black); color: var(--white); }
        .action-row .reset-btn.hidden { display: none; }

        /* ========== STATUS / FEEDBACK ========== */
        .status-bar {
            padding: 0;
            border-bottom: var(--rule);
            display: none;
        }
        .status-bar.show { display: block; }
        .status-bar .progress {
            height: 2px;
            width: 100%;
            background: var(--gray-100);
            position: relative;
            overflow: hidden;
        }
        .status-bar .progress::after {
            content: '';
            position: absolute;
            top: 0; left: 0;
            height: 100%; width: 30%;
            background: var(--accent);
            animation: slide 1.6s linear infinite;
        }
        @keyframes slide {
            0% { left: -30%; }
            100% { left: 100%; }
        }
        .status-bar .row {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            column-gap: var(--gutter);
            padding: 14px 0;
        }
        .status-bar .row .lab { grid-column: 1 / span 2; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--gray-600); }
        .status-bar .row .msg { grid-column: 3 / span 10; font-size: 14px; font-weight: 500; }

        .error-bar {
            padding: 14px 0;
            border-bottom: var(--rule);
            background: var(--white);
            color: var(--accent);
            display: none;
        }
        .error-bar.show { display: block; }
        .error-bar .row { display: grid; grid-template-columns: repeat(12, 1fr); column-gap: var(--gutter); align-items: center; }
        .error-bar .lab { grid-column: 1 / span 2; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 700; }
        .error-bar .msg { grid-column: 3 / span 10; font-size: 14px; font-weight: 500; }

        /* ========== RESULT ========== */
        .result-container {
            display: none;
        }
        .result-container.show { display: block; }
        .result-block {
            padding: 0;
            border-bottom: var(--rule);
        }
        .result-head {
            padding: 14px 0;
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            column-gap: var(--gutter);
            align-items: center;
            font-size: 11px;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            font-weight: 600;
        }
        .result-head .num { grid-column: 1 / span 1; color: var(--accent); font-family: 'JetBrains Mono', monospace; }
        .result-head .title { grid-column: 2 / span 8; font-size: 18px; font-weight: 700; letter-spacing: -0.01em; text-transform: none; }
        .result-head .meta { grid-column: 10 / span 3; text-align: right; color: var(--gray-600); font-weight: 400; letter-spacing: 0.12em; }

        .tag-row-result { padding: 0 0 24px 0; }
        .tag-row-result .tag-input { padding-top: 0; }

        .option-grid {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            column-gap: var(--gutter);
            row-gap: 0;
            padding: 0 0 32px 0;
        }
        .option-card {
            grid-column: span 4;
            border: 1px solid var(--black);
            padding: 16px;
            cursor: pointer;
            background: var(--white);
            border-radius: 0;
            display: flex;
            flex-direction: column;
            gap: 8px;
            min-height: 96px;
        }
        .option-card:hover { background: var(--gray-100); }
        .option-card.selected { background: var(--black); color: var(--white); }
        .option-card.selected .option-tag { color: var(--accent); }
        .option-tag {
            font-size: 10px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            font-weight: 700;
            color: var(--gray-600);
        }
        .option-text {
            font-size: 16px;
            line-height: 1.3;
            font-weight: 500;
        }

        .content-display {
            grid-column: 1 / span 12;
            padding: 0 0 32px 0;
            font-family: 'Inter', sans-serif;
            font-size: 16px;
            line-height: 1.6;
            white-space: pre-wrap;
            color: var(--black);
        }

        .export-block {
            padding: 0;
            border-bottom: var(--rule);
        }
        .export-block .export-row {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            column-gap: var(--gutter);
            padding: 24px 0;
            align-items: end;
        }
        .export-block .export-select-group { grid-column: 1 / span 6; }
        .export-block .export-buttons { grid-column: 7 / span 6; display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
        .export-block label {
            display: block;
            font-size: 10px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 8px;
        }
        .export-select {
            width: 100%;
            border: none;
            border-bottom: 1px solid var(--black);
            background: transparent;
            padding: 6px 0 8px 0;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            color: var(--black);
            border-radius: 0;
            -webkit-appearance: none;
            appearance: none;
            background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' stroke='%23000' stroke-width='1.4' fill='none'/></svg>");
            background-repeat: no-repeat;
            background-position: right 0 center;
            padding-right: 24px;
        }
        .export-btn {
            border: 1px solid var(--black);
            background: var(--white);
            color: var(--black);
            padding: 12px 16px;
            font-family: 'Inter', sans-serif;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            cursor: pointer;
            border-radius: 0;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        .export-btn:hover { background: var(--black); color: var(--white); }
        .export-btn:disabled { background: var(--gray-100); border-color: var(--gray-300); color: var(--gray-600); cursor: not-allowed; }

        /* Chapter list */
        .chapter-outline { padding: 0 0 32px 0; }
        .chapter-item {
            border-top: var(--rule-soft);
            padding: 0;
        }
        .chapter-item:last-child { border-bottom: var(--rule-soft); }
        .chapter-header {
            display: grid;
            grid-template-columns: 80px 1fr 40px;
            column-gap: 16px;
            padding: 16px 0;
            align-items: center;
            cursor: pointer;
        }
        .chapter-header:hover { background: var(--gray-100); }
        .chapter-num {
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            color: var(--accent);
            font-weight: 500;
        }
        .chapter-titles { line-height: 1.3; }
        .chapter-titles .ch-title { font-size: 18px; font-weight: 700; letter-spacing: -0.01em; }
        .chapter-titles .ch-sub { font-size: 13px; color: var(--gray-600); }
        .chapter-toggle {
            text-align: right;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            color: var(--black);
        }
        .chapter-content-section {
            display: none;
            padding: 0 0 24px 96px;
        }
        .chapter-content-section.expanded { display: block; }
        .chapter-actions { display: flex; gap: 8px; margin: 8px 0 16px 0; flex-wrap: wrap; }
        .generate-chapter-btn, .export-chapter-btn {
            border: 1px solid var(--black);
            background: var(--white);
            color: var(--black);
            padding: 10px 14px;
            font-family: 'Inter', sans-serif;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            cursor: pointer;
            border-radius: 0;
        }
        .generate-chapter-btn:hover, .export-chapter-btn:hover { background: var(--black); color: var(--white); }
        .generate-chapter-btn:disabled { background: var(--gray-100); border-color: var(--gray-300); color: var(--gray-600); cursor: not-allowed; }
        .export-chapter-buttons { display: inline-flex; gap: 6px; }
        .chapter-loading {
            padding: 8px 0;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .chapter-loading .bar { flex: 1; height: 2px; background: var(--gray-100); position: relative; overflow: hidden; }
        .chapter-loading .bar::after {
            content: ''; position: absolute; top: 0; left: 0; height: 100%; width: 30%; background: var(--accent);
            animation: slide 1.6s linear infinite;
        }
        .chapter-loading .lab { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600; }
        .chapter-content {
            font-family: 'Inter', sans-serif;
            font-size: 15px;
            line-height: 1.6;
            border-left: 2px solid var(--black);
            padding: 0 0 0 16px;
        }

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

        /* ========== RESPONSIVE ========== */
        @media (max-width: 900px) {
            :root { --gutter: 16px; --pad-x: 20px; }
            .hero .index, .hero .lede { display: none; }
            .hero .headline { grid-column: 1 / -1; padding: 24px 0 32px 0; }
            .section-label .title { grid-column: 2 / -1; }
            .section-label .meta { display: none; }
            .form-group { grid-column: 1 / -1; }
            .form-group.third { grid-column: 1 / -1; }
            .action-row .generate-btn,
            .action-row .reset-btn { grid-column: 1 / -1; }
            .option-card { grid-column: 1 / -1; }
            .export-block .export-select-group { grid-column: 1 / -1; }
            .export-block .export-buttons { grid-column: 1 / -1; justify-content: flex-start; margin-top: 12px; }
            .footer .col-1, .footer .col-2, .footer .col-3 { grid-column: 1 / -1; text-align: left; margin-bottom: 4px; }
            .chapter-content-section { padding-left: 16px; }
            .byok-banner-row { grid-template-columns: 1fr; row-gap: 12px; padding: 16px 0; }
            .byok-banner-num { text-align: left; font-size: 24px; }
            .topbar-right { gap: 12px; flex-wrap: wrap; }
            .byok-status { font-size: 10px; padding: 3px 8px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="topbar">
            <div class="meta">QUILL <span class="accent-dot">/</span> AI WRITING ASSISTANT <span class="accent-dot">/</span> ED. 02</div>
            <div class="topbar-right">
                <span class="byok-status" id="byokStatus" data-state="missing" title="BYOK &mdash; Bring Your Own Key">
                    <span class="byok-lab">BYOK</span>
                    <span class="byok-dot" aria-hidden="true"></span>
                    <span class="byok-state" id="byokStateText">No API Key</span>
                </span>
                <a href="/settings">SETTINGS &rarr;</a>
            </div>
        </div>

        <div class="byok-banner" id="byokBanner">
            <div class="byok-banner-row">
                <div class="byok-banner-num">!</div>
                <div class="byok-banner-body">
                    <div class="byok-banner-title" id="byokBannerTitle">API Key Required</div>
                    <div class="byok-banner-msg" id="byokBannerMsg">Quill is BYOK &mdash; Bring Your Own Key. Add your Gemini API key in Settings to start generating. The key is stored only in this browser and sent per-request via the <code>X-User-API-Key</code> header. The server never persists it.</div>
                </div>
                <div class="byok-banner-cta">
                    <a href="/settings" class="byok-banner-link" id="byokBannerLink">OPEN SETTINGS &rarr;</a>
                </div>
            </div>
        </div>

        <header class="hero">
            <div class="index">№ 01</div>
            <div class="headline">
                <h1>Quill<span class="amp">.</span></h1>
            </div>
            <p class="lede">An editorial writing instrument powered by AI. Long-form articles, short stories, news briefs and novel outlines — drafted with author-style precision.</p>
        </header>

        <div class="section-label">
            <div class="num">02</div>
            <div class="title">Brief &mdash; Generator</div>
            <div class="meta">FIELDS 01 / 09</div>
        </div>

        <form class="generator" id="articleForm" autocomplete="off">
        <div class="form-grid">
            <div class="form-group full">
                <label for="topic">Topic <span class="req">*</span></label>
                <input type="text" id="topic" name="topic" required placeholder="e.g. The architecture of memory, monsoon economies">
            </div>

            <div class="form-group half">
                <label for="authorStyle">Author Style <span class="req">*</span></label>
                <select id="authorStyle" name="authorStyle" required>
                    <option value="">Select an author</option>
                    <optgroup label="Classic &amp; Literary">
                        <option value="Ernest Hemingway">Ernest Hemingway</option>
                        <option value="Jane Austen">Jane Austen</option>
                        <option value="Toni Morrison">Toni Morrison</option>
                        <option value="Agatha Christie">Agatha Christie</option>
                        <option value="Gabriel García Márquez">Gabriel García Márquez</option>
                        <option value="Cormac McCarthy">Cormac McCarthy</option>
                    </optgroup>
                    <optgroup label="Fantasy &amp; Sci-Fi">
                        <option value="J.R.R. Tolkien">J.R.R. Tolkien</option>
                        <option value="George R.R. Martin">George R.R. Martin</option>
                        <option value="J.K. Rowling">J.K. Rowling</option>
                        <option value="Neil Gaiman">Neil Gaiman</option>
                    </optgroup>
                    <optgroup label="Contemporary &amp; Thriller">
                        <option value="Stephen King">Stephen King</option>
                        <option value="Haruki Murakami">Haruki Murakami</option>
                        <option value="Margaret Atwood">Margaret Atwood</option>
                        <option value="Zadie Smith">Zadie Smith</option>
                        <option value="Chimamanda Ngozi Adichie">Chimamanda Ngozi Adichie</option>
                    </optgroup>
                    <optgroup label="Indonesian Authors">
                        <option value="Pramoedya Ananta Toer">Pramoedya Ananta Toer</option>
                        <option value="Dee Lestari">Dee Lestari</option>
                        <option value="Andrea Hirata">Andrea Hirata</option>
                        <option value="Goenawan Mohamad">Goenawan Mohamad</option>
                        <option value="Leila S. Chudori">Leila S. Chudori</option>
                        <option value="Najwa Shihab">Najwa Shihab</option>
                    </optgroup>
                    <optgroup label="Non-Fiction">
                        <option value="Yuval Noah Harari">Yuval Noah Harari</option>
                    </optgroup>
                    <optgroup label="Other">
                        <option value="custom">Custom (enter below)</option>
                    </optgroup>
                </select>
                <input type="text" class="custom-field" id="customAuthorStyle" name="customAuthorStyle" placeholder="Enter custom author name" style="display: none;">
            </div>

            <div class="form-group half">
                <label for="type">Type <span class="req">*</span></label>
                <select id="type" name="type" required>
                    <option value="">Select type</option>
                    <option value="article">Article (1800–2000 words)</option>
                    <option value="shortstory">Short Story (2500–3000 words)</option>
                    <option value="novel">Novel Outline</option>
                    <option value="news">News Article (1200–1800 words)</option>
                    <option value="shortnews">Short News (400–600 words)</option>
                </select>
            </div>

            <div class="form-group half newspaper-style-group" id="newspaperStyleGroup" style="display: none;">
                <label for="newspaperStyle">Newspaper Style <span class="req">*</span></label>
                <select id="newspaperStyle" name="newspaperStyle">
                    <option value="">Select newspaper style</option>
                    <option value="The New York Times">The New York Times</option>
                    <option value="The Washington Post">The Washington Post</option>
                    <option value="BBC News">BBC News</option>
                    <option value="CNN">CNN</option>
                    <option value="Reuters">Reuters</option>
                    <option value="Associated Press">Associated Press</option>
                    <option value="The Guardian">The Guardian</option>
                    <option value="The Wall Street Journal">The Wall Street Journal</option>
                    <option value="Fox News">Fox News</option>
                    <option value="Al Jazeera">Al Jazeera</option>
                    <option value="custom">Custom (enter below)</option>
                </select>
                <input type="text" class="custom-field" id="customNewspaperStyle" name="customNewspaperStyle" placeholder="Enter custom newspaper style" style="display: none;">
            </div>

            <div class="form-group half">
                <label for="language">Language <span class="req">*</span></label>
                <select id="language" name="language" required>
                    <option value="">Select language</option>
                    <option value="english">English</option>
                    <option value="indonesian">Indonesian (Bahasa Indonesia)</option>
                </select>
            </div>

            <div class="form-group third chapter-count-group" id="chapterCountGroup">
                <label for="chapterCount">Chapters <span class="req">*</span></label>
                <input type="number" id="chapterCount" name="chapterCount" min="1" max="50" placeholder="e.g. 10">
            </div>

            <div class="form-group third">
                <label for="tagInput">Tags</label>
                <div class="tag-row">
                    <input type="text" id="tagInput" placeholder="Add a tag and press Enter">
                    <button type="button" class="add-btn" id="addTagBtn">Add</button>
                </div>
                <div class="tag-input" id="tagsContainer" data-empty=""></div>
            </div>

            <div class="form-group third">
                <label for="keywordInput">Keywords</label>
                <div class="tag-row">
                    <input type="text" id="keywordInput" placeholder="Add a keyword and press Enter">
                    <button type="button" class="add-btn" id="addKeywordBtn">Add</button>
                </div>
                <div class="tag-input" id="keywordsContainer" data-empty=""></div>
            </div>

            <div class="form-group full">
                <label for="mainIdea">Main Idea / Plot</label>
                <textarea id="mainIdea" name="mainIdea" rows="3" placeholder="Describe the main idea, plot or concept the AI should build upon."></textarea>
            </div>

            <div class="action-row">
                <button type="submit" class="generate-btn" id="generateBtn">
                    <span>Generate Content</span>
                    <span class="arrow">&rarr;</span>
                </button>
                <button type="button" class="reset-btn hidden" id="resetBtn">Reset All</button>
            </div>
        </div>
    </form>

    <div class="status-bar" id="loading">
        <div class="row">
            <div class="lab">Status</div>
            <div class="msg" id="loadingMsg">Generating your content with AI&hellip;</div>
        </div>
        <div class="progress"></div>
    </div>

    <div class="error-bar" id="errorMessage">
        <div class="row">
            <div class="lab">Error</div>
            <div class="msg" id="errorMessageText"></div>
        </div>
    </div>

    <div class="result-container" id="resultContainer"></div>

    <footer class="footer">
        <div class="col-1">Quill&trade; <span class="accent-dot">&middot;</span> Ed. 02 / 2026</div>
        <div class="col-2">Set in Inter &amp; JetBrains Mono</div>
        <div class="col-3">By <a href="https://azzar.netlify.app/porto" target="_blank">LilyOpenCMS</a></div>
    </footer>
    </div>

    <div class="modal-overlay" id="confirmationModal">
        <div class="modal-content">
            <div class="modal-head">
                <span class="lab">CONFIRM</span>
                <span>ESC TO CLOSE</span>
            </div>
            <div class="modal-body">
                <h3 class="modal-title" id="modalTitle">Reset All Data</h3>
                <p class="modal-message" id="modalMessage">Are you sure you want to reset all data?</p>
            </div>
            <div class="modal-actions">
                <button class="modal-btn modal-btn-cancel" id="modalCancel">Cancel</button>
                <button class="modal-btn modal-btn-confirm" id="modalConfirm">Confirm</button>
            </div>
        </div>
    </div>

    <script>
        // Language strings
        const uiLanguages = {
            english: {
                title: 'Quill.',
                subtitle: 'An editorial writing instrument powered by AI. Long-form articles, short stories, news briefs and novel outlines \u2014 drafted with author-style precision.',
                settings: 'SETTINGS \u2192',
                settingsDescription: 'Configure your Quill writing assistant',
                topicLabel: 'Topic *',
                topicPlaceholder: 'e.g. The architecture of memory, monsoon economies',
                tagsLabel: 'Tags',
                tagsPlaceholder: 'Add a tag and press Enter',
                keywordsLabel: 'Keywords',
                keywordsPlaceholder: 'Add a keyword and press Enter',
                authorStyleLabel: 'Author Style *',
                selectAuthor: 'Select an author',
                customAuthorPlaceholder: 'Enter custom author name',
                newspaperStyleLabel: 'Newspaper Style *',
                selectNewspaper: 'Select newspaper style',
                customNewspaperPlaceholder: 'Enter custom newspaper style',
                selectLanguage: 'Select language',
                addButton: 'Add',
                chapterCountPlaceholder: 'e.g. 10',
                typeLabel: 'Type *',
                typeArticle: 'Article',
                typeShortStory: 'Short Story',
                typeNews: 'News Article',
                typeNovel: 'Novel Outline',
                chapterCountLabel: 'Chapters *',
                languageLabel: 'Language *',
                mainIdeaLabel: 'Main Idea / Plot',
                mainIdeaPlaceholder: 'Describe the main idea, plot or concept the AI should build upon.',
                generateButton: 'Generate Content',
                resetButton: 'Reset All',
                resetConfirmTitle: 'Reset All Data',
                resetConfirmMessage: 'Are you sure you want to reset all data? This will clear your form and generated content.',
                cancelButton: 'Cancel',
                resetModalButton: 'Reset',
                generating: 'Generating your content with AI\u2026',
                loadingFacts: [
                    'The quill pen was invented in the 6th century.',
                    'The first quills came from swan feathers.',
                    'Shakespeare wrote 37 plays and 154 sonnets.',
                    'Hemingway wrote standing up.',
                    'The first newspaper was published in Strasbourg, 1605.',
                    'The novel form emerged in 18th century England.',
                    'AI can analyze writing styles of any author.',
                    'Typography evolved from handwritten scripts to digital fonts.',
                    'Writing systems developed independently in four ancient civilizations.',
                    'The first printing press was invented by Gutenberg in 1450.',
                    'Mark Twain was the first author to submit a typewritten manuscript.',
                    'Literature has been used as propaganda since ancient Rome.',
                    'The shortest story ever written is just six words long.',
                    'Writing on clay tablets began over 5,000 years ago.',
                    'The first copyright law was established in Britain in 1710.'
                ],
                apiKeyRequired: 'Please set your Gemini API key in Settings first.',
                byokKeySet: 'Key Set',
                byokKeyMissing: 'No API Key',
                byokBannerTitle: 'Bring Your Own Key',
                byokBannerMsg: 'Quill is BYOK — Bring Your Own Key. Add your Gemini API key in Settings to start generating. The key is stored only in this browser and sent per-request via the <code>X-User-API-Key</code> header. The server never persists it.',
                byokBannerCta: 'Open Settings →',
                missingFields: 'Missing required fields',
                tagsRequired: 'Please add at least one tag',
                exportMarkdown: 'Export as Markdown',
                exportRTF: 'Export as RTF',
                generateChapter: 'Generate Chapter',
                generatingChapter: 'Generating\u2026',
                regenerateChapter: 'Regenerate Chapter',
                exportChapter: 'Export Chapter',
                selectTitle: 'Select Title',
                selectSubtitle: 'Select Subtitle',
                novelTitle: 'Novel Title',
                synopsis: 'Synopsis',
                outline: 'Outline',
                chapter: 'Chapter',
                refinedTags: 'Refined Tags',
                content: 'Content',
                backToGenerator: '\u2190 Back to Generator',
                languageSettings: 'Language',
                interfaceLanguage: 'Interface Language',
                languageHelp: 'Choose the language for the user interface',
                apiConfiguration: 'Gemini AI Configuration',
                getApiKey: 'How to get your API key:',
                apiSteps: ['Go to Google AI Studio', 'Sign in with your Google account', 'Create a new API key', 'Copy the key and paste it below'],
                apiKeyLabel: 'Gemini API Key *',
                apiKeyPlaceholder: 'Enter your Gemini API key',
                saveApiKey: 'Save API Key',
                removeApiKey: 'Remove API Key',
                apiKeySaved: 'API key saved successfully!',
                apiKeyVerified: 'API key verified and saved successfully!',
                apiKeyVerificationFailed: 'API key saved but verification failed: ',
                apiKeySaveError: 'API key saved but could not verify: ',
                apiKeyQuotaExceeded: 'API quota exceeded. Please check your Gemini API billing/limits.',
                apiKeyInvalid: 'Invalid API key. Please check that your Gemini API key is correct and enabled.',
                networkError: 'Network error. Please check your internet connection and try again.',
                pleaseEnterApiKey: 'Please enter an API key',
                apiKeyRemoved: 'API key removed successfully.'
            },
            indonesian: {
                title: 'Quill.',
                subtitle: 'Instrumen penulisan editorial bertenaga AI. Artikel panjang, cerita pendek, berita singkat, dan rangkuman novel \u2014 disusun dengan presisi gaya penulis.',
                settings: 'PENGATURAN \u2192',
                settingsDescription: 'Konfigurasikan asisten penulisan Quill Anda',
                topicLabel: 'Topik *',
                topicPlaceholder: 'cth. Arsitektur memori, ekonomi monsoon',
                tagsLabel: 'Tag',
                tagsPlaceholder: 'Tambahkan tag dan tekan Enter',
                keywordsLabel: 'Kata Kunci',
                keywordsPlaceholder: 'Tambahkan kata kunci dan tekan Enter',
                authorStyleLabel: 'Gaya Penulis *',
                selectAuthor: 'Pilih penulis',
                customAuthorPlaceholder: 'Masukkan nama penulis kustom',
                newspaperStyleLabel: 'Gaya Koran *',
                selectNewspaper: 'Pilih gaya koran',
                customNewspaperPlaceholder: 'Masukkan gaya koran kustom',
                selectLanguage: 'Pilih bahasa',
                addButton: 'Tambah',
                chapterCountPlaceholder: 'cth. 10',
                typeLabel: 'Tipe *',
                typeArticle: 'Artikel',
                typeShortStory: 'Cerita Pendek',
                typeNews: 'Artikel Berita',
                typeNovel: 'Rangkuman Novel',
                chapterCountLabel: 'Jumlah Bab *',
                languageLabel: 'Bahasa *',
                mainIdeaLabel: 'Ide Utama / Alur',
                mainIdeaPlaceholder: 'Jelaskan ide utama, alur, atau konsep yang ingin dibangun oleh AI.',
                generateButton: 'Hasilkan Konten',
                resetButton: 'Reset Semua',
                resetConfirmTitle: 'Reset Semua Data',
                resetConfirmMessage: 'Apakah Anda yakin ingin mereset semua data? Formulir dan konten akan dihapus.',
                cancelButton: 'Batal',
                resetModalButton: 'Reset',
                generating: 'Menghasilkan konten Anda dengan AI\u2026',
                loadingFacts: [
                    'Pena quill ditemukan pada abad ke-6.',
                    'Quill pertama berasal dari bulu angsa.',
                    'Shakespeare menulis 37 drama dan 154 soneta.',
                    'Hemingway menulis sambil berdiri.',
                    'Surat kabar pertama diterbitkan di Strasbourg, 1605.',
                    'Bentuk novel muncul di Inggris abad ke-18.',
                    'AI dapat menganalisis gaya tulisan penulis mana pun.',
                    'Tipografi berkembang dari naskah tulisan tangan ke font digital.',
                    'Sistem tulis berkembang independen di empat peradaban kuno.',
                    'Mesin cetak pertama ditemukan Gutenberg pada 1450.',
                    'Mark Twain adalah penulis pertama yang menyerahkan naskah ketik.',
                    'Sastra telah digunakan sebagai propaganda sejak Romawi kuno.',
                    'Cerita terpendek yang pernah ditulis hanya enam kata.',
                    'Penulisan di tablet tanah liat dimulai lebih dari 5.000 tahun lalu.',
                    'Hukum hak cipta pertama didirikan di Inggris pada 1710.'
                ],
                apiKeyRequired: 'Silakan atur kunci API Gemini Anda di Pengaturan terlebih dahulu.',
                byokKeySet: 'Kunci Disetel',
                byokKeyMissing: 'Tanpa Kunci',
                byokBannerTitle: 'Bawa Kunci Anda Sendiri',
                byokBannerMsg: 'Quill adalah BYOK — Bawa Kunci Anda Sendiri. Tambahkan kunci API Gemini Anda di Pengaturan untuk mulai menghasilkan. Kunci hanya disimpan di peramban ini dan dikirim per-request lewat header <code>X-User-API-Key</code>. Server tidak pernah menyimpannya.',
                byokBannerCta: 'Buka Pengaturan →',
                missingFields: 'Kolom wajib belum lengkap',
                tagsRequired: 'Silakan tambahkan setidaknya satu tag',
                exportMarkdown: 'Ekspor sebagai Markdown',
                exportRTF: 'Ekspor sebagai RTF',
                generateChapter: 'Hasilkan Bab',
                generatingChapter: 'Menghasilkan\u2026',
                regenerateChapter: 'Hasilkan Ulang',
                exportChapter: 'Ekspor Bab',
                selectTitle: 'Pilih Judul',
                selectSubtitle: 'Pilih Subjudul',
                novelTitle: 'Judul Novel',
                synopsis: 'Sinopsis',
                outline: 'Rangkuman',
                chapter: 'Bab',
                refinedTags: 'Tag yang Dimurnikan',
                content: 'Konten',
                backToGenerator: '\u2190 Kembali ke Generator',
                languageSettings: 'Bahasa',
                interfaceLanguage: 'Bahasa Antarmuka',
                languageHelp: 'Pilih bahasa untuk antarmuka pengguna',
                apiConfiguration: 'Konfigurasi Gemini AI',
                getApiKey: 'Cara mendapatkan kunci API:',
                apiSteps: ['Kunjungi Google AI Studio', 'Masuk dengan akun Google Anda', 'Buat kunci API baru', 'Salin kunci dan tempel di bawah'],
                apiKeyLabel: 'Kunci API Gemini *',
                apiKeyPlaceholder: 'Masukkan kunci API Gemini Anda',
                saveApiKey: 'Simpan Kunci API',
                removeApiKey: 'Hapus Kunci API',
                apiKeySaved: 'Kunci API berhasil disimpan!',
                apiKeyVerified: 'Kunci API diverifikasi dan berhasil disimpan!',
                apiKeyVerificationFailed: 'Kunci API disimpan tetapi verifikasi gagal: ',
                apiKeySaveError: 'Kunci API disimpan tetapi tidak dapat diverifikasi: ',
                apiKeyQuotaExceeded: 'Kuota API terlampaui. Periksa tagihan/batas Gemini API Anda.',
                apiKeyInvalid: 'Kunci API tidak valid. Periksa kunci API Gemini Anda.',
                networkError: 'Kesalahan jaringan. Periksa koneksi internet Anda.',
                pleaseEnterApiKey: 'Silakan masukkan kunci API',
                apiKeyRemoved: 'Kunci API berhasil dihapus.'
            }
        };

        // Form handling and UI logic
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('articleForm');
            const typeSelect = document.getElementById('type');
            const chapterCountGroup = document.getElementById('chapterCountGroup');
            const authorStyleSelect = document.getElementById('authorStyle');
            const customAuthorStyle = document.getElementById('customAuthorStyle');
            const newspaperStyleGroup = document.getElementById('newspaperStyleGroup');
            const newspaperStyleSelect = document.getElementById('newspaperStyle');
            const customNewspaperStyle = document.getElementById('customNewspaperStyle');
            const generateBtn = document.getElementById('generateBtn');
            const loading = document.getElementById('loading');
            const loadingMsg = document.getElementById('loadingMsg');
            const errorMessage = document.getElementById('errorMessage');
            const errorMessageText = document.getElementById('errorMessageText');
            const resultContainer = document.getElementById('resultContainer');
            const modal = document.getElementById('confirmationModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalMessage = document.getElementById('modalMessage');
            const modalCancel = document.getElementById('modalCancel');
            const modalConfirm = document.getElementById('modalConfirm');
            const byokStatus = document.getElementById('byokStatus');
            const byokStateText = document.getElementById('byokStateText');
            const byokBanner = document.getElementById('byokBanner');
            const byokBannerTitle = document.getElementById('byokBannerTitle');
            const byokBannerMsg = document.getElementById('byokBannerMsg');
            const byokBannerLink = document.getElementById('byokBannerLink');

            const savedLanguage = localStorage.getItem('uiLanguage') || 'english';

            // ---------- BYOK status sync ----------
            function syncByokStatus() {
                const key = (localStorage.getItem('geminiApiKey') || '').trim();
                const has = key.length > 0;
                const lang = localStorage.getItem('uiLanguage') || 'english';
                const t = uiLanguages[lang];
                if (byokStatus) {
                    byokStatus.setAttribute('data-state', has ? 'ok' : 'missing');
                    byokStateText.textContent = has ? t.byokKeySet : t.byokKeyMissing;
                }
                if (byokBanner) {
                    byokBanner.classList.toggle('show', !has);
                }
                if (byokBannerTitle) byokBannerTitle.textContent = t.byokBannerTitle;
                if (byokBannerMsg) byokBannerMsg.innerHTML = t.byokBannerMsg;
                if (byokBannerLink) byokBannerLink.textContent = t.byokBannerCta;
            }

            // Read a fresh key each call (so a Settings save takes effect immediately
            // if the user navigated back without a full reload).
            function getApiKeyOrRedirect() {
                const key = (localStorage.getItem('geminiApiKey') || '').trim();
                if (!key) {
                    const lang = localStorage.getItem('uiLanguage') || 'english';
                    showError(uiLanguages[lang].apiKeyRequired);
                    // Surface the banner + make sure the badge is fresh.
                    syncByokStatus();
                    return null;
                }
                return key;
            }

            // Shared fetch wrapper for AI endpoints: sends the key in the
            // X-User-API-Key header (BYOK) and never in the body.
            async function callByokEndpoint(url, body) {
                const key = getApiKeyOrRedirect();
                if (!key) return null;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-User-API-Key': key,
                    },
                    body: JSON.stringify(body),
                });
                if (response.status === 400) {
                    let payload = null;
                    try { payload = await response.json(); } catch (_) { /* noop */ }
                    if (payload && payload.code === 'BYOK_KEY_REQUIRED') {
                        const lang = localStorage.getItem('uiLanguage') || 'english';
                        showError(uiLanguages[lang].apiKeyRequired);
                        syncByokStatus();
                        return null;
                    }
                }
                return response;
            }


            function updateUILanguage(lang) {
                const texts = uiLanguages[lang];
                document.querySelector('h1').innerHTML = texts.title.replace('.', '<span class="amp">.</span>');
                document.querySelector('.lede').textContent = texts.subtitle;
                document.querySelector('.settings-link, .topbar a').textContent = texts.settings;
                document.querySelector('label[for="topic"]').innerHTML = texts.topicLabel.replace('*', '<span class="req">*</span>');
                document.querySelector('#topic').placeholder = texts.topicPlaceholder;
                document.querySelector('label[for="tags"]').textContent = texts.tagsLabel;
                document.querySelector('#tagInput').placeholder = texts.tagsPlaceholder;
                document.querySelector('#addTagBtn').textContent = texts.addButton;
                document.querySelector('label[for="keywords"]').textContent = texts.keywordsLabel;
                document.querySelector('#keywordInput').placeholder = texts.keywordsPlaceholder;
                document.querySelector('#addKeywordBtn').textContent = texts.addButton;
                document.querySelector('label[for="authorStyle"]').innerHTML = texts.authorStyleLabel.replace('*', '<span class="req">*</span>');
                document.querySelector('#authorStyle option[value=""]').textContent = texts.selectAuthor;
                document.querySelector('#customAuthorStyle').placeholder = texts.customAuthorPlaceholder;
                document.querySelector('label[for="newspaperStyle"]').innerHTML = texts.newspaperStyleLabel.replace('*', '<span class="req">*</span>');
                document.querySelector('#newspaperStyle option[value=""]').textContent = texts.selectNewspaper;
                document.querySelector('#customNewspaperStyle').placeholder = texts.customNewspaperPlaceholder;
                document.querySelector('label[for="type"]').innerHTML = texts.typeLabel.replace('*', '<span class="req">*</span>');
                document.querySelector('#type option[value="article"]').textContent = texts.typeArticle;
                document.querySelector('#type option[value="shortstory"]').textContent = texts.typeShortStory;
                document.querySelector('#type option[value="news"]').textContent = texts.typeNews;
                document.querySelector('#type option[value="novel"]').textContent = texts.typeNovel;
                document.querySelector('label[for="chapterCount"]').innerHTML = texts.chapterCountLabel.replace('*', '<span class="req">*</span>');
                document.querySelector('#chapterCount').placeholder = texts.chapterCountPlaceholder;
                document.querySelector('label[for="language"]').innerHTML = texts.languageLabel.replace('*', '<span class="req">*</span>');
                document.querySelector('#language option[value=""]').textContent = texts.selectLanguage;
                document.querySelector('label[for="mainIdea"]').textContent = texts.mainIdeaLabel;
                document.querySelector('#mainIdea').placeholder = texts.mainIdeaPlaceholder;
                document.querySelector('#generateBtn span:first-child').textContent = texts.generateButton;
                document.querySelector('#resetBtn').textContent = texts.resetButton;
                if (!loadingInterval) {
                    loadingMsg.textContent = texts.generating;
                }
                localStorage.setItem('uiLanguage', lang);
            }

            // Loading text cycling
            let loadingInterval;
            let shuffledFacts = [];
            let currentFactIndex = 0;

            function shuffleArray(array) {
                const shuffled = array.slice();
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                return shuffled;
            }

            function startLoadingFacts(lang) {
                const texts = uiLanguages[lang];
                const facts = texts.loadingFacts;
                if (!facts || facts.length === 0) return;
                shuffledFacts = shuffleArray(facts);
                currentFactIndex = 0;
                loadingMsg.textContent = shuffledFacts[0];
                loadingInterval = setInterval(() => {
                    currentFactIndex = (currentFactIndex + 1) % shuffledFacts.length;
                    loadingMsg.textContent = shuffledFacts[currentFactIndex];
                }, 2800 + Math.random() * 800);
            }

            function stopLoadingFacts() {
                if (loadingInterval) {
                    clearInterval(loadingInterval);
                    loadingInterval = null;
                    const currentLang = localStorage.getItem('uiLanguage') || 'english';
                    loadingMsg.textContent = uiLanguages[currentLang].generating;
                }
            }

            updateUILanguage(savedLanguage);
            syncByokStatus();

            // Tag and keyword management
            let tags = [];
            let keywords = [];

            function setupTagSystem(inputId, containerId, array, addBtnId) {
                const input = document.getElementById(inputId);
                const container = document.getElementById(containerId);
                const addBtn = document.getElementById(addBtnId);

                function addItem(value) {
                    if (value && !array.includes(value)) {
                        array.push(value);
                        renderItems();
                        input.value = '';
                    }
                }

                function removeItem(index) {
                    array.splice(index, 1);
                    renderItems();
                }

                function renderItems() {
                    container.innerHTML = '';
                    array.forEach((item, index) => {
                        const tagElement = document.createElement('div');
                        tagElement.className = 'chip';
                        tagElement.innerHTML = item + ' <span class="x" data-index="' + index + '">&times;</span>';
                        container.appendChild(tagElement);
                    });
                    container.querySelectorAll('.x').forEach(function(el) {
                        el.addEventListener('click', function(e) {
                            removeItem(parseInt(e.target.getAttribute('data-index'), 10));
                        });
                    });
                }

                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        addItem(input.value.trim());
                    }
                });

                addBtn.addEventListener('click', function() {
                    addItem(input.value.trim());
                });
            }

            setupTagSystem('tagInput', 'tagsContainer', tags, 'addTagBtn');
            setupTagSystem('keywordInput', 'keywordsContainer', keywords, 'addKeywordBtn');

            // Persistence functions
            function saveFormData() {
                const formData = {
                    topic: document.getElementById('topic').value,
                    authorStyle: document.getElementById('authorStyle').value,
                    customAuthorStyle: document.getElementById('customAuthorStyle').value,
                    type: document.getElementById('type').value,
                    newspaperStyle: document.getElementById('newspaperStyle').value,
                    customNewspaperStyle: document.getElementById('customNewspaperStyle').value,
                    language: document.getElementById('language').value,
                    chapterCount: document.getElementById('chapterCount').value,
                    mainIdea: document.getElementById('mainIdea').value,
                    tags: tags,
                    keywords: keywords
                };
                localStorage.setItem('quillFormData', JSON.stringify(formData));
            }

            function loadFormData() {
                const savedData = localStorage.getItem('quillFormData');
                if (!savedData) return;
                const formData = JSON.parse(savedData);
                document.getElementById('topic').value = formData.topic || '';
                document.getElementById('authorStyle').value = formData.authorStyle || '';
                document.getElementById('customAuthorStyle').value = formData.customAuthorStyle || '';
                document.getElementById('type').value = formData.type || '';
                document.getElementById('newspaperStyle').value = formData.newspaperStyle || '';
                document.getElementById('customNewspaperStyle').value = formData.customNewspaperStyle || '';
                document.getElementById('language').value = formData.language || '';
                document.getElementById('chapterCount').value = formData.chapterCount || '';
                document.getElementById('mainIdea').value = formData.mainIdea || '';

                if (formData.tags) {
                    tags.length = 0;
                    tags.push.apply(tags, formData.tags);
                }
                if (formData.keywords) {
                    keywords.length = 0;
                    keywords.push.apply(keywords, formData.keywords);
                }
                setupTagSystem('tagInput', 'tagsContainer', tags, 'addTagBtn');
                setupTagSystem('keywordInput', 'keywordsContainer', keywords, 'addKeywordBtn');

                const ccg = document.getElementById('chapterCountGroup');
                if (formData.type === 'novel') ccg.classList.add('show'); else ccg.classList.remove('show');

                const cas = document.getElementById('customAuthorStyle');
                if (formData.authorStyle === 'custom') { cas.style.display = 'block'; cas.required = true; }
                else { cas.style.display = 'none'; cas.required = false; }

                const nsg = document.getElementById('newspaperStyleGroup');
                if (formData.type === 'news' || formData.type === 'shortnews') {
                    nsg.style.display = 'block';
                    document.getElementById('newspaperStyle').required = true;
                } else {
                    nsg.style.display = 'none';
                    document.getElementById('newspaperStyle').required = false;
                }

                const cns = document.getElementById('customNewspaperStyle');
                if (formData.newspaperStyle === 'custom') { cns.style.display = 'block'; cns.required = true; }
                else { cns.style.display = 'none'; cns.required = false; }
            }

            function saveResults(result, type) {
                const resultsData = { result: result, type: type, timestamp: Date.now() };
                localStorage.setItem('quillResults', JSON.stringify(resultsData));
            }

            function loadResults() {
                const savedResults = localStorage.getItem('quillResults');
                if (!savedResults) return;
                const resultsData = JSON.parse(savedResults);
                displayResults(resultsData.result, resultsData.type);
                document.getElementById('resetBtn').classList.remove('hidden');
            }

            function clearAllData() {
                localStorage.removeItem('quillFormData');
                localStorage.removeItem('quillResults');
                document.getElementById('articleForm').reset();
                tags.length = 0;
                keywords.length = 0;
                document.getElementById('tagsContainer').innerHTML = '';
                document.getElementById('keywordsContainer').innerHTML = '';
                document.getElementById('chapterCountGroup').classList.remove('show');
                document.getElementById('customAuthorStyle').style.display = 'none';
                document.getElementById('customAuthorStyle').required = false;
                document.getElementById('newspaperStyleGroup').style.display = 'none';
                document.getElementById('newspaperStyle').required = false;
                document.getElementById('customNewspaperStyle').style.display = 'none';
                document.getElementById('customNewspaperStyle').required = false;
                document.getElementById('resultContainer').innerHTML = '';
                document.getElementById('resultContainer').classList.remove('show');
                document.getElementById('errorMessage').classList.remove('show');
                document.getElementById('resetBtn').classList.add('hidden');
            }

            typeSelect.addEventListener('change', function() {
                if (this.value === 'novel') chapterCountGroup.classList.add('show');
                else chapterCountGroup.classList.remove('show');
                if (this.value === 'news' || this.value === 'shortnews') {
                    newspaperStyleGroup.style.display = 'block';
                    document.getElementById('newspaperStyle').required = true;
                } else {
                    newspaperStyleGroup.style.display = 'none';
                    document.getElementById('newspaperStyle').required = false;
                }
                saveFormData();
            });

            authorStyleSelect.addEventListener('change', function() {
                if (this.value === 'custom') { customAuthorStyle.style.display = 'block'; customAuthorStyle.required = true; }
                else { customAuthorStyle.style.display = 'none'; customAuthorStyle.required = false; }
                saveFormData();
            });

            newspaperStyleSelect.addEventListener('change', function() {
                if (this.value === 'custom') { customNewspaperStyle.style.display = 'block'; customNewspaperStyle.required = true; }
                else { customNewspaperStyle.style.display = 'none'; customNewspaperStyle.required = false; }
                saveFormData();
            });

            document.querySelectorAll('input, select, textarea').forEach(function(input) {
                input.addEventListener('input', saveFormData);
                input.addEventListener('change', saveFormData);
            });

            function showModal(title, message, onConfirm, cancelText, confirmText) {
                modalTitle.textContent = title;
                modalMessage.textContent = message;
                modalCancel.textContent = cancelText || 'Cancel';
                modalConfirm.textContent = confirmText || 'Confirm';
                modal.classList.add('show');
                function closeModal() { modal.classList.remove('show'); }
                modalCancel.onclick = closeModal;
                modalConfirm.onclick = function() { closeModal(); onConfirm(); };
                modal.onclick = function(e) { if (e.target === modal) closeModal(); };
                document.addEventListener('keydown', function escHandler(e) {
                    if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', escHandler); }
                });
            }

            document.getElementById('resetBtn').addEventListener('click', function() {
                const currentLang = localStorage.getItem('uiLanguage') || 'english';
                const texts = uiLanguages[currentLang];
                showModal(texts.resetConfirmTitle || 'Reset All Data', texts.resetConfirmMessage, function() { clearAllData(); }, texts.cancelButton, texts.resetModalButton);
            });

            function showError(message) {
                errorMessageText.textContent = message;
                errorMessage.classList.add('show');
                errorMessage.scrollIntoView({ behavior: 'smooth' });
            }

            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                const formData = new FormData(form);
                const apiKey = getApiKeyOrRedirect();
                if (!apiKey) return;

                const data = {
                    topic: formData.get('topic'),
                    tags: tags.length > 0 ? tags : ['writing', 'content', 'creative'],
                    keywords: keywords.length > 0 ? keywords : ['writing', 'content', 'creation'],
                    authorStyle: authorStyleSelect.value === 'custom' ? customAuthorStyle.value : authorStyleSelect.value,
                    type: formData.get('type'),
                    newspaperStyle: newspaperStyleSelect.value === 'custom' ? customNewspaperStyle.value : newspaperStyleSelect.value,
                    chapterCount: formData.get('chapterCount') ? parseInt(formData.get('chapterCount'), 10) : undefined,
                    language: formData.get('language'),
                    mainIdea: formData.get('mainIdea') || undefined,
                };

                loading.classList.add('show');
                generateBtn.disabled = true;
                errorMessage.classList.remove('show');
                resultContainer.classList.remove('show');
                const currentLang = localStorage.getItem('uiLanguage') || 'english';
                startLoadingFacts(currentLang);

                try {
                    const response = await callByokEndpoint('/api/generate', data);
                    if (!response) return; // BYOK missing-key branch already handled
                    const result = await response.json();
                    if (!response.ok) throw new Error(result.error || 'Failed to generate content');
                    displayResults(result, data.type);
                    saveResults(result, data.type);
                    document.getElementById('resetBtn').classList.remove('hidden');
                    syncByokStatus();
                } catch (error) {
                    const currentLang = localStorage.getItem('uiLanguage') || 'english';
                    const texts = uiLanguages[currentLang];
                    let errorMessage = error.message;
                    if (error.message.includes('quota exceeded') || error.message.includes('429')) errorMessage = texts.apiKeyQuotaExceeded;
                    else if (error.message.includes('403') || error.message.includes('access denied') || error.message.includes('unauthorized')) errorMessage = texts.apiKeyInvalid;
                    else if (error.message.includes('network') || error.message.includes('fetch')) errorMessage = texts.networkError;
                    showError(errorMessage);
                } finally {
                    loading.classList.remove('show');
                    generateBtn.disabled = false;
                    stopLoadingFacts();
                }
            });

            function displayResults(result, type) {
                resultContainer.innerHTML = '';
                if (type === 'article' || type === 'shortstory' || type === 'news' || type === 'shortnews') {
                    displayArticleResults(result);
                } else {
                    displayNovelResults(result);
                }
                resultContainer.classList.add('show');
                resultContainer.scrollIntoView({ behavior: 'smooth' });
            }

            function resultHead(num, title, meta) {
                return '<div class="result-block"><div class="result-head"><div class="num">' + num + '</div><div class="title">' + title + '</div><div class="meta">' + (meta || '') + '</div></div>';
            }
            function resultFoot() { return '</div>'; }

            function displayArticleResults(result) {
                const currentLang = localStorage.getItem('uiLanguage') || 'english';
                const texts = uiLanguages[currentLang];
                let html = '';

                if (result.refinedTags && result.refinedTags.length > 0) {
                    html += resultHead('03', texts.refinedTags, 'TAGS / ' + result.refinedTags.length);
                    html += '<div class="tag-row-result"><div class="tag-input">' + result.refinedTags.map(function(t) { return '<div class="chip">' + t + '</div>'; }).join('') + '</div></div>';
                    html += resultFoot();
                }

                if (result.titleSelection && result.titleSelection.length > 0) {
                    html += resultHead('04', texts.selectTitle, 'OPTIONS / ' + result.titleSelection.length);
                    html += '<div class="option-grid">';
                    result.titleSelection.forEach(function(title, index) {
                        html += '<div class="option-card" data-type="title" data-index="' + index + '"><div class="option-tag">OPTION ' + String(index + 1).padStart(2, '0') + '</div><div class="option-text">' + title + '</div></div>';
                    });
                    html += '</div>' + resultFoot();
                }

                if (result.subtitleSelection && result.subtitleSelection.length > 0) {
                    html += resultHead('05', texts.selectSubtitle, 'OPTIONS / ' + result.subtitleSelection.length);
                    html += '<div class="option-grid">';
                    result.subtitleSelection.forEach(function(subtitle, index) {
                        html += '<div class="option-card" data-type="subtitle" data-index="' + index + '"><div class="option-tag">OPTION ' + String(index + 1).padStart(2, '0') + '</div><div class="option-text">' + subtitle + '</div></div>';
                    });
                    html += '</div>' + resultFoot();
                }

                if (result.content) {
                    html += resultHead('06', texts.content, 'BODY');
                    html += '<div class="content-display">' + result.content + '</div>';
                    html += '<div class="export-block"><div class="export-row">';
                    html += '<div class="export-select-group"><label for="selectedTitle">' + texts.selectTitle + '</label><select id="selectedTitle" class="export-select"><option value="">' + texts.selectTitle + '\u2026</option>';
                    if (result.titleSelection) {
                        result.titleSelection.forEach(function(t) { html += '<option value="' + t + '">' + t + '</option>'; });
                    }
                    html += '</select></div>';
                    html += '<div class="export-select-group" style="grid-column: 1 / -1; margin-top: 16px;"><label for="selectedSubtitle">' + texts.selectSubtitle + '</label><select id="selectedSubtitle" class="export-select"><option value="">' + texts.selectSubtitle + '\u2026</option>';
                    if (result.subtitleSelection) {
                        result.subtitleSelection.forEach(function(s) { html += '<option value="' + s + '">' + s + '</option>'; });
                    }
                    html += '</select></div>';
                    html += '<div class="export-buttons"><button class="export-btn" id="exportMdBtn">&#8595; ' + texts.exportMarkdown + '</button><button class="export-btn" id="exportRtfBtn">&#8595; ' + (texts.exportRTF || 'Export as RTF') + '</button></div>';
                    html += '</div></div>';
                    html += resultFoot();
                }

                resultContainer.innerHTML = html;
                bindOptionSelection();
                bindExportButtons();
            }

            function displayNovelResults(result) {
                const currentLang = localStorage.getItem('uiLanguage') || 'english';
                const texts = uiLanguages[currentLang];
                let html = '';

                if (result.titleSelection && result.titleSelection.length > 0) {
                    html += resultHead('03', texts.selectTitle, 'OPTIONS / ' + result.titleSelection.length);
                    html += '<div class="option-grid">';
                    result.titleSelection.forEach(function(title, index) {
                        html += '<div class="option-card" data-type="title" data-index="' + index + '"><div class="option-tag">OPTION ' + String(index + 1).padStart(2, '0') + '</div><div class="option-text">' + title + '</div></div>';
                    });
                    html += '</div>' + resultFoot();
                }

                if (result.synopsis) {
                    html += resultHead('04', texts.synopsis, 'NARRATIVE');
                    html += '<div class="content-display">' + result.synopsis + '</div>' + resultFoot();
                }

                if (result.outline && result.outline.length > 0) {
                    html += resultHead('05', texts.outline, 'CHAPTERS / ' + result.outline.length);
                    html += '<div class="chapter-outline">';
                    result.outline.forEach(function(chapter) {
                        html += '<div class="chapter-item">';
                        html += '<div class="chapter-header" data-chapter="' + chapter.chapterNumber + '">';
                        html += '<div class="chapter-num">CH / ' + String(chapter.chapterNumber).padStart(2, '0') + '</div>';
                        html += '<div class="chapter-titles"><div class="ch-title">' + chapter.title + '</div><div class="ch-sub">' + chapter.subtitle + '</div></div>';
                        html += '<div class="chapter-toggle" id="chapter-toggle-' + chapter.chapterNumber + '">&rarr;</div>';
                        html += '</div>';
                        html += '<div class="chapter-content-section" id="chapter-content-section-' + chapter.chapterNumber + '">';
                        html += '<div class="chapter-details">';
                        html += '<div class="chapter-actions">';
                        html += '<button class="generate-chapter-btn" data-chapter-number="' + chapter.chapterNumber + '" data-chapter-title="' + chapter.title.replace(/"/g, '&quot;') + '" data-chapter-subtitle="' + chapter.subtitle.replace(/"/g, '&quot;') + '" data-novel-title="' + (result.titleSelection ? result.titleSelection[0].replace(/"/g, '&quot;') : '') + '" data-novel-synopsis="' + (result.synopsis ? result.synopsis.substring(0, 100).replace(/"/g, '&quot;') : '') + '">' + texts.generateChapter + '</button>';
                        html += '<div class="export-chapter-buttons" id="export-chapter-' + chapter.chapterNumber + '-btn" style="display: none;">';
                        html += '<button class="export-chapter-btn" data-chapter-number="' + chapter.chapterNumber + '" data-chapter-title="' + chapter.title.replace(/"/g, '&quot;') + '" data-chapter-subtitle="' + chapter.subtitle.replace(/"/g, '&quot;') + '" data-export="md">MD</button>';
                        html += '<button class="export-chapter-btn" data-chapter-number="' + chapter.chapterNumber + '" data-chapter-title="' + chapter.title.replace(/"/g, '&quot;') + '" data-chapter-subtitle="' + chapter.subtitle.replace(/"/g, '&quot;') + '" data-export="rtf">RTF</button>';
                        html += '</div></div>';
                        html += '<div class="chapter-loading" id="chapter-' + chapter.chapterNumber + '-loading" style="display: none;"><div class="bar"></div><div class="lab">GENERATING</div></div>';
                        html += '<div class="chapter-content" id="chapter-' + chapter.chapterNumber + '-content" style="display: none;"></div>';
                        html += '</div></div></div>';
                    });
                    html += '</div>';

                    html += '<div class="export-block"><div class="export-row">';
                    html += '<div class="export-select-group"><label for="selectedNovelTitle">' + texts.selectTitle + '</label><select id="selectedNovelTitle" class="export-select"><option value="">' + texts.selectTitle + '\u2026</option>';
                    if (result.titleSelection) {
                        result.titleSelection.forEach(function(t) { html += '<option value="' + t + '">' + t + '</option>'; });
                    }
                    html += '</select></div>';
                    html += '<div class="export-buttons"><button class="export-btn" id="exportNovelMdBtn">&#8595; ' + texts.exportMarkdown + '</button></div>';
                    html += '</div></div>';

                    html += resultFoot();
                }

                resultContainer.innerHTML = html;
                bindOptionSelection();
                bindChapterToggles();
                bindChapterGenerate();
                bindExportButtons();
            }

            function bindOptionSelection() {
                document.querySelectorAll('.option-card').forEach(function(card) {
                    card.addEventListener('click', function() {
                        const type = this.getAttribute('data-type');
                        document.querySelectorAll('.option-card[data-type="' + type + '"]').forEach(function(c) { c.classList.remove('selected'); });
                        this.classList.add('selected');
                    });
                });
            }

            function bindChapterToggles() {
                document.querySelectorAll('.chapter-header').forEach(function(h) {
                    h.addEventListener('click', function(e) {
                        if (e.target.closest('button')) return;
                        const n = this.getAttribute('data-chapter');
                        const sec = document.getElementById('chapter-content-section-' + n);
                        const tog = document.getElementById('chapter-toggle-' + n);
                        if (sec.classList.contains('expanded')) {
                            sec.classList.remove('expanded');
                            tog.innerHTML = '&rarr;';
                        } else {
                            sec.classList.add('expanded');
                            tog.innerHTML = '&darr;';
                        }
                    });
                });
            }

            function bindChapterGenerate() {
                document.querySelectorAll('.generate-chapter-btn').forEach(function(btn) {
                    btn.addEventListener('click', function() { generateChapter(this); });
                });
                document.querySelectorAll('.export-chapter-btn').forEach(function(btn) {
                    btn.addEventListener('click', function() {
                        const fmt = this.getAttribute('data-export');
                        if (fmt === 'md') exportChapterMarkdown(this);
                        else exportChapterRTF(this);
                    });
                });
            }

            function bindExportButtons() {
                const md = document.getElementById('exportMdBtn');
                if (md) md.addEventListener('click', exportAsMarkdown);
                const rtf = document.getElementById('exportRtfBtn');
                if (rtf) rtf.addEventListener('click', exportAsRTF);
                const nmd = document.getElementById('exportNovelMdBtn');
                if (nmd) nmd.addEventListener('click', exportNovelAsMarkdown);
            }

            function exportAsMarkdown() {
                const selectedTitle = document.getElementById('selectedTitle').value;
                const selectedSubtitle = document.getElementById('selectedSubtitle').value;
                if (!selectedTitle) { alert('Please select a title first.'); return; }
                const contentElement = document.querySelector('.content-display');
                if (!contentElement) { alert('No content found to export.'); return; }
                const content = contentElement.textContent || contentElement.innerText;
                let markdown = '# ' + selectedTitle + '\n\n';
                if (selectedSubtitle) markdown += '## ' + selectedSubtitle + '\n\n';
                markdown += content;
                const blob = new Blob([markdown], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = selectedTitle.replace(/[^a-z0-9]/g, '_').toLowerCase() + '.md';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }

            async function exportAsRTF() {
                const selectedTitle = document.getElementById('selectedTitle').value;
                const selectedSubtitle = document.getElementById('selectedSubtitle').value;
                if (!selectedTitle) { alert('Please select a title first.'); return; }
                const contentElement = document.querySelector('.content-display');
                if (!contentElement) { alert('No content found to export.'); return; }
                const content = contentElement.textContent || contentElement.innerText;
                try {
                    const response = await fetch('/api/export-rtf', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title: selectedTitle, subtitle: selectedSubtitle || '', content: content })
                    });
                    if (!response.ok) throw new Error('Export failed');
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = selectedTitle.replace(/[^a-z0-9]/g, '_').toLowerCase() + '.rtf';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                } catch (error) {
                    console.error('RTF export error:', error);
                    alert('RTF export failed. Please try again.');
                }
            }

            function exportNovelAsMarkdown() {
                const selectedTitle = document.getElementById('selectedNovelTitle').value;
                if (!selectedTitle) { alert('Please select a novel title first.'); return; }
                const chapters = [];
                document.querySelectorAll('.chapter-item').forEach(function(item, index) {
                    const n = index + 1;
                    const titleEl = item.querySelector('.ch-title');
                    const contentEl = item.querySelector('.chapter-content');
                    chapters.push({
                        number: n,
                        title: titleEl ? titleEl.textContent : 'Chapter ' + n,
                        content: contentEl && contentEl.style.display !== 'none' ? contentEl.textContent : '[Chapter content not generated yet]'
                    });
                });
                let markdown = '# ' + selectedTitle + '\n\n';
                const synopsisElement = document.querySelector('.content-display');
                if (synopsisElement) {
                    const synopsis = synopsisElement.textContent || synopsisElement.innerText;
                    markdown += '## Synopsis\n\n' + synopsis + '\n\n';
                }
                chapters.forEach(function(c) {
                    markdown += '## ' + c.title + '\n\n' + c.content + '\n\n---\n\n';
                });
                const blob = new Blob([markdown], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = selectedTitle.replace(/[^a-z0-9]/g, '_').toLowerCase() + '.md';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }

            async function generateChapter(button) {
                const chapterNumber = parseInt(button.getAttribute('data-chapter-number'), 10);
                const chapterTitle = button.getAttribute('data-chapter-title');
                const chapterSubtitle = button.getAttribute('data-chapter-subtitle');
                const novelTitle = button.getAttribute('data-novel-title');
                const novelSynopsis = button.getAttribute('data-novel-synopsis');
                const loadingDiv = document.getElementById('chapter-' + chapterNumber + '-loading');
                const contentDiv = document.getElementById('chapter-' + chapterNumber + '-content');
                const apiKey = getApiKeyOrRedirect();
                if (!apiKey) return;
                button.disabled = true;
                const currentLang = localStorage.getItem('uiLanguage') || 'english';
                const texts = uiLanguages[currentLang];
                button.textContent = texts.generatingChapter;
                loadingDiv.style.display = 'flex';
                try {
                    const response = await callByokEndpoint('/api/generate-chapter', {
                        chapterNumber: chapterNumber,
                        chapterTitle: chapterTitle,
                        chapterSubtitle: chapterSubtitle,
                        novelTitle: novelTitle,
                        novelSynopsis: novelSynopsis,
                        previousChapters: collectPreviousChapters(chapterNumber),
                    });
                    if (!response) return; // BYOK missing-key branch already handled
                    if (!response.ok) throw new Error('Chapter generation failed');
                    const result = await response.json();
                    loadingDiv.style.display = 'none';
                    contentDiv.style.display = 'block';
                    contentDiv.innerHTML = result.content.replace(/\n/g, '<br>');
                    const exportBtn = document.getElementById('export-chapter-' + chapterNumber + '-btn');
                    if (exportBtn) exportBtn.style.display = 'inline-flex';
                    setTimeout(function() {
                        const sec = document.getElementById('chapter-content-section-' + chapterNumber);
                        const tog = document.getElementById('chapter-toggle-' + chapterNumber);
                        if (!sec.classList.contains('expanded')) {
                            sec.classList.add('expanded');
                            tog.innerHTML = '&darr;';
                        }
                    }, 100);
                    button.textContent = texts.regenerateChapter;
                    button.disabled = false;
                    syncByokStatus();
                } catch (error) {
                    alert('Chapter generation failed. Please try again.');
                    console.error('Chapter generation error:', error);
                    const currentLang = localStorage.getItem('uiLanguage') || 'english';
                    button.disabled = false;
                    button.textContent = uiLanguages[currentLang].generateChapter;
                    loadingDiv.style.display = 'none';
                }
            }

            function collectPreviousChapters(currentChapterNumber) {
                const previousChapters = [];
                document.querySelectorAll('.chapter-item').forEach(function(item, index) {
                    const n = index + 1;
                    if (n < currentChapterNumber) {
                        const titleEl = item.querySelector('.ch-title');
                        const title = titleEl ? titleEl.textContent : 'Chapter ' + n;
                        const contentElement = document.getElementById('chapter-' + n + '-content');
                        if (contentElement && contentElement.style.display !== 'none') {
                            const content = contentElement.textContent || contentElement.innerText;
                            if (content && content.length > 50) {
                                previousChapters.push({ chapterNumber: n, title: title, content: content, keyEvents: [] });
                            }
                        }
                    }
                });
                return previousChapters;
            }

            function exportChapterMarkdown(button) {
                const chapterNumber = parseInt(button.getAttribute('data-chapter-number'), 10);
                const chapterTitle = button.getAttribute('data-chapter-title');
                const chapterSubtitle = button.getAttribute('data-chapter-subtitle');
                const contentElement = document.getElementById('chapter-' + chapterNumber + '-content');
                if (!contentElement || contentElement.style.display === 'none') { alert('No chapter content found. Generate the chapter first.'); return; }
                const content = contentElement.textContent || contentElement.innerText;
                const markdown = '# Chapter ' + chapterNumber + ': ' + chapterTitle + '\n\n## ' + chapterSubtitle + '\n\n' + content + '\n\n---\n';
                const blob = new Blob([markdown], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = chapterTitle.replace(/[^a-z0-9]/g, '_').toLowerCase() + '_chapter_' + chapterNumber + '.md';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }

            async function exportChapterRTF(button) {
                const chapterNumber = parseInt(button.getAttribute('data-chapter-number'), 10);
                const chapterTitle = button.getAttribute('data-chapter-title');
                const chapterSubtitle = button.getAttribute('data-chapter-subtitle');
                const contentElement = document.getElementById('chapter-' + chapterNumber + '-content');
                if (!contentElement || contentElement.style.display === 'none') { alert('No chapter content found. Generate the chapter first.'); return; }
                const content = contentElement.textContent || contentElement.innerText;
                try {
                    const response = await fetch('/api/export-chapter-rtf', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ chapterNumber: chapterNumber, chapterTitle: chapterTitle, chapterSubtitle: chapterSubtitle, content: content })
                    });
                    if (!response.ok) throw new Error('Chapter RTF export failed');
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = chapterTitle.replace(/[^a-z0-9]/g, '_').toLowerCase() + '_chapter_' + chapterNumber + '.rtf';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                } catch (error) {
                    console.error('Chapter RTF export error:', error);
                    alert('Chapter RTF export failed. Please try again.');
                }
            }

            loadFormData();
            loadResults();
        });
    </script>
</body>
</html>`;
}

export function generateSettingsPageHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quill — Settings</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
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
            --gutter: 24px;
            --container-max: 1280px;
            --pad-x: 32px;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: var(--white); color: var(--black); }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-weight: 400;
            font-size: 15px;
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            min-height: 100vh;
        }
        a { color: inherit; text-decoration: none; }
        a:hover { text-decoration: underline; text-underline-offset: 4px; }

        .container {
            max-width: var(--container-max);
            margin: 0 auto;
            padding-left: var(--pad-x);
            padding-right: var(--pad-x);
            width: 100%;
        }

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
        .topbar-right { display: flex; align-items: center; gap: 20px; }

        /* BYOK status badge (settings page) */
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
        .byok-status[data-state="ok"]   { color: var(--black); border-color: var(--black); }
        .byok-status[data-state="missing"] { color: var(--accent); border-color: var(--accent); }
        .byok-status .byok-lab { font-family: 'JetBrains Mono', monospace; font-weight: 700; }
        .byok-status .byok-dot { width: 6px; height: 6px; display: inline-block; background: var(--accent); }
        .byok-status[data-state="ok"] .byok-dot { background: var(--black); }

        /* BYOK notice (settings page, above the API key form) */
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
            font-size: clamp(40px, 7vw, 96px);
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

        .nav {
            border-bottom: var(--rule);
            padding: 14px 0;
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            column-gap: var(--gutter);
            font-size: 11px;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            font-weight: 600;
            align-items: center;
        }
        .nav .num { grid-column: 1 / span 1; color: var(--accent); font-family: 'JetBrains Mono', monospace; }
        .nav .title { grid-column: 2 / span 6; }
        .nav .back { grid-column: 9 / span 4; text-align: right; }
        .nav a { color: var(--black); }

        .settings-container {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            column-gap: var(--gutter);
            padding: 0;
        }
        .settings-section {
            grid-column: 1 / span 12;
            border-bottom: var(--rule);
            padding: 0 0 32px 0;
        }
        .section-head {
            padding: 14px 0;
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            column-gap: var(--gutter);
            align-items: center;
            font-size: 11px;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            font-weight: 600;
        }
        .section-head .num { grid-column: 1 / span 1; color: var(--accent); font-family: 'JetBrains Mono', monospace; }
        .section-head .title { grid-column: 2 / span 8; font-size: 20px; font-weight: 700; letter-spacing: -0.01em; text-transform: none; }
        .section-head .meta { grid-column: 10 / span 3; text-align: right; color: var(--gray-600); font-weight: 400; letter-spacing: 0.12em; }

        .form-group {
            padding: 16px 0;
            border-top: var(--rule-soft);
        }
        .form-group label {
            display: block;
            font-size: 10px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 8px;
        }
        .form-group .req { color: var(--accent); }
        .form-group input[type="text"],
        .form-group input[type="password"],
        .form-group select {
            width: 100%;
            border: none;
            border-bottom: 1px solid var(--black);
            background: transparent;
            padding: 6px 0 8px 0;
            font-family: 'Inter', sans-serif;
            font-size: 16px;
            color: var(--black);
            outline: none;
            border-radius: 0;
            -webkit-appearance: none;
            appearance: none;
        }
        .form-group input:focus,
        .form-group select:focus { border-bottom: 2px solid var(--accent); padding-bottom: 7px; }
        .form-group select {
            background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' stroke='%23000' stroke-width='1.4' fill='none'/></svg>");
            background-repeat: no-repeat;
            background-position: right 0 center;
            padding-right: 24px;
        }
        .form-group small {
            display: block;
            margin-top: 8px;
            font-size: 12px;
            color: var(--gray-600);
            letter-spacing: 0.02em;
        }

        .info-block {
            border-top: var(--rule-soft);
            padding: 16px 0;
        }
        .info-block h4 {
            font-size: 10px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            font-weight: 700;
            margin-bottom: 12px;
            color: var(--black);
        }
        .info-block ol {
            list-style: none;
            counter-reset: step;
        }
        .info-block ol li {
            counter-increment: step;
            padding: 6px 0 6px 32px;
            position: relative;
            font-size: 14px;
            border-bottom: 1px dotted var(--gray-300);
        }
        .info-block ol li:last-child { border-bottom: none; }
        .info-block ol li::before {
            content: counter(step, decimal-leading-zero);
            position: absolute;
            left: 0;
            top: 6px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            color: var(--accent);
        }
        .info-block a { color: var(--black); border-bottom: 1px solid var(--black); }
        .info-block a:hover { color: var(--accent); border-bottom-color: var(--accent); text-decoration: none; }

        .action-row {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            column-gap: var(--gutter);
            padding: 16px 0 0 0;
        }
        .save-btn {
            grid-column: 1 / span 6;
            background: var(--black);
            color: var(--white);
            border: 1px solid var(--black);
            padding: 18px 24px;
            font-family: 'Inter', sans-serif;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            cursor: pointer;
            border-radius: 0;
        }
        .save-btn:hover { background: var(--accent); border-color: var(--accent); }
        .remove-btn {
            grid-column: 7 / span 6;
            background: var(--white);
            color: var(--black);
            border: 1px solid var(--black);
            padding: 18px 24px;
            font-family: 'Inter', sans-serif;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            cursor: pointer;
            border-radius: 0;
        }
        .remove-btn:hover { background: var(--black); color: var(--white); }
        .save-btn:disabled, .remove-btn:disabled { background: var(--gray-100); border-color: var(--gray-300); color: var(--gray-600); cursor: not-allowed; }

        .status-message {
            padding: 12px 0;
            font-size: 13px;
            font-weight: 500;
            display: none;
            border-top: var(--rule-soft);
            margin-top: 12px;
        }
        .status-success { color: var(--black); border-top-color: var(--black); }
        .status-error { color: var(--accent); border-top-color: var(--accent); }

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
        .modal-head .lab { color: var(--accent); font-family: 'JetBrains Mono', monospace; }
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
        }
        .footer .col-1 { grid-column: 1 / span 4; }
        .footer .col-2 { grid-column: 5 / span 4; }
        .footer .col-3 { grid-column: 9 / span 4; text-align: right; }
        .footer a { color: var(--black); }
        .footer .accent-dot { color: var(--accent); }

        @media (max-width: 900px) {
            :root { --gutter: 16px; --pad-x: 20px; }
            .hero .index, .hero .lede { display: none; }
            .hero .headline { grid-column: 1 / -1; padding: 24px 0 32px 0; }
            .nav .title { grid-column: 2 / -1; }
            .nav .back { grid-column: 1 / -1; text-align: left; margin-top: 4px; }
            .section-head .title { grid-column: 2 / -1; font-size: 18px; }
            .section-head .meta { display: none; }
            .save-btn, .remove-btn { grid-column: 1 / -1; margin-bottom: 8px; }
            .footer .col-1, .footer .col-2, .footer .col-3 { grid-column: 1 / -1; text-align: left; margin-bottom: 4px; }
            .byok-notice { grid-template-columns: 1fr; row-gap: 12px; }
            .byok-notice-num { justify-self: start; }
            .topbar-right { gap: 12px; flex-wrap: wrap; }
            .byok-status { font-size: 10px; padding: 3px 8px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="topbar">
            <div class="meta">QUILL <span class="accent-dot">/</span> SETTINGS <span class="accent-dot">/</span> ED. 02</div>
            <div class="topbar-right">
                <span class="byok-status" id="byokStatus" data-state="missing" title="BYOK &mdash; Bring Your Own Key">
                    <span class="byok-lab">BYOK</span>
                    <span class="byok-dot" aria-hidden="true"></span>
                    <span class="byok-state" id="byokStateText">No API Key</span>
                </span>
                <a href="/">&larr; BACK TO GENERATOR</a>
            </div>
        </div>

        <header class="hero">
            <div class="index">№ S.01</div>
            <div class="headline">
                <h1>Settings<span class="amp">.</span></h1>
            </div>
            <p class="lede">Configure the language of the interface and your Gemini API key. All values are stored locally in this browser.</p>
        </header>

        <div class="nav">
            <div class="num">01</div>
            <div class="title">Configuration</div>
            <div class="back"><a href="/">&larr; Back to Generator</a></div>
        </div>

        <div class="settings-container">
        <section class="settings-section">
            <div class="section-head">
                <div class="num">02</div>
                <div class="title">Language</div>
                <div class="meta">UI / LOCALE</div>
            </div>
            <div class="form-group">
                <label for="uiLanguage">Interface Language</label>
                <select id="uiLanguage">
                    <option value="english">English</option>
                    <option value="indonesian">Bahasa Indonesia</option>
                </select>
                <small>Choose the language for the user interface.</small>
            </div>
        </section>

        <section class="settings-section">
            <div class="section-head">
                <div class="num">03</div>
                <div class="title">Gemini AI Configuration</div>
                <div class="meta">CREDENTIALS</div>
            </div>
            <div class="byok-notice" id="byokNotice">
                <div class="byok-notice-num">BYOK</div>
                <div class="byok-notice-body">
                    <div class="byok-notice-title" id="byokNoticeTitle">Bring Your Own Key</div>
                    <div class="byok-notice-msg" id="byokNoticeMsg">Quill is BYOK — Bring Your Own Key. The server has no default Gemini key, so every visitor must provide their own. Your key is stored only in this browser (<code>localStorage</code>) and is sent per-request as the <code>X-User-API-Key</code> header. The server never persists, logs, or shares it.</div>
                </div>
            </div>
            <div class="info-block">
                <h4>How to get your API key</h4>
                <ol id="apiStepsList">
                    <li><a href="https://aistudio.google.com/app/apikey" target="_blank">Go to Google AI Studio</a></li>
                    <li>Sign in with your Google account</li>
                    <li>Create a new API key</li>
                    <li>Copy the key and paste it below</li>
                </ol>
            </div>
            <form id="apiKeyForm">
                <div class="form-group">
                    <label for="apiKey">Gemini API Key <span class="req">*</span></label>
                    <input type="password" id="apiKey" required>
                </div>
                <div class="action-row">
                    <button type="submit" class="save-btn" id="saveBtn">Save API Key</button>
                    <button type="button" class="remove-btn" id="removeBtn">Remove API Key</button>
                </div>
                <div class="status-message" id="statusMessage"></div>
            </form>
        </section>
    </div>

    <footer class="footer">
        <div class="col-1">Quill&trade; <span class="accent-dot">&middot;</span> Ed. 02 / 2026</div>
        <div class="col-2">Set in Inter &amp; JetBrains Mono</div>
        <div class="col-3">By <a href="https://azzar.netlify.app/porto" target="_blank">LilyOpenCMS</a></div>
    </footer>
    </div>

    <div class="modal-overlay" id="confirmationModal">
        <div class="modal-content">
            <div class="modal-head">
                <span class="lab">CONFIRM</span>
                <span>ESC TO CLOSE</span>
            </div>
            <div class="modal-body">
                <h3 class="modal-title" id="modalTitle">Remove API Key</h3>
                <p class="modal-message" id="modalMessage">Are you sure you want to remove your API key?</p>
            </div>
            <div class="modal-actions">
                <button class="modal-btn modal-btn-cancel" id="modalCancel">Cancel</button>
                <button class="modal-btn modal-btn-confirm" id="modalConfirm">Confirm</button>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const apiKeyForm = document.getElementById('apiKeyForm');
            const apiKeyInput = document.getElementById('apiKey');
            const saveBtn = document.getElementById('saveBtn');
            const removeBtn = document.getElementById('removeBtn');
            const statusMessage = document.getElementById('statusMessage');
            const languageSelect = document.getElementById('uiLanguage');
            const modal = document.getElementById('confirmationModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalMessage = document.getElementById('modalMessage');
            const modalCancel = document.getElementById('modalCancel');
            const modalConfirm = document.getElementById('modalConfirm');
            const byokStatus = document.getElementById('byokStatus');
            const byokStateText = document.getElementById('byokStateText');
            const byokNoticeTitle = document.getElementById('byokNoticeTitle');
            const byokNoticeMsg = document.getElementById('byokNoticeMsg');

            function syncByokStatus() {
                const has = !!(localStorage.getItem('geminiApiKey') || '').trim();
                const lang = localStorage.getItem('uiLanguage') || 'english';
                const t = languages[lang];
                if (byokStatus) {
                    byokStatus.setAttribute('data-state', has ? 'ok' : 'missing');
                    byokStateText.textContent = has ? t.byokKeySet : t.byokKeyMissing;
                }
                if (byokNoticeTitle) byokNoticeTitle.textContent = t.byokNoticeTitle;
                if (byokNoticeMsg) byokNoticeMsg.innerHTML = t.byokNoticeMsg;
            }
            window.syncByokStatus = syncByokStatus;

            const languages = {
                english: {
                    title: 'Settings.',
                    lede: 'Configure the language of the interface and your Gemini API key. All values are stored locally in this browser.',
                    back: '\u2190 Back to Generator',
                    languageTitle: 'Language',
                    interfaceLanguage: 'Interface Language',
                    languageHelp: 'Choose the language for the user interface.',
                    apiTitle: 'Gemini AI Configuration',
                    apiInstructions: 'How to get your API key',
                    apiSteps: [
                        '<a href="https://aistudio.google.com/app/apikey" target="_blank">Go to Google AI Studio</a>',
                        'Sign in with your Google account',
                        'Create a new API key',
                        'Copy the key and paste it below'
                    ],
                    apiKeyLabel: 'Gemini API Key',
                    saveButton: 'Save API Key',
                    removeButton: 'Remove API Key',
                    removeConfirmTitle: 'Remove API Key',
                    removeConfirmMessage: 'Are you sure you want to remove the API key?',
                    cancelButton: 'Cancel',
                    removeModalButton: 'Remove',
                    apiKeySaved: 'API key saved successfully.',
                    apiKeyVerified: 'API key verified and saved successfully.',
                    apiKeyVerificationFailed: 'API key saved but verification failed: ',
                    apiKeySaveError: 'API key saved but could not verify: ',
                    apiKeyRemoved: 'API key removed successfully.',
                    pleaseEnterApiKey: 'Please enter an API key',
                    byokKeySet: 'Key Set',
                    byokKeyMissing: 'No API Key',
                    byokNoticeTitle: 'Bring Your Own Key',
                    byokNoticeMsg: 'Quill is BYOK — Bring Your Own Key. The server has no default Gemini key, so every visitor must provide their own. Your key is stored only in this browser (<code>localStorage</code>) and is sent per-request as the <code>X-User-API-Key</code> header. The server never persists, logs, or shares it.'
                },
                indonesian: {
                    title: 'Pengaturan.',
                    lede: 'Konfigurasikan bahasa antarmuka dan kunci API Gemini Anda. Semua nilai disimpan secara lokal di peramban ini.',
                    back: '\u2190 Kembali ke Generator',
                    languageTitle: 'Bahasa',
                    interfaceLanguage: 'Bahasa Antarmuka',
                    languageHelp: 'Pilih bahasa untuk antarmuka pengguna.',
                    apiTitle: 'Konfigurasi Gemini AI',
                    apiInstructions: 'Cara mendapatkan kunci API',
                    apiSteps: [
                        '<a href="https://aistudio.google.com/app/apikey" target="_blank">Kunjungi Google AI Studio</a>',
                        'Masuk dengan akun Google Anda',
                        'Buat kunci API baru',
                        'Salin kunci dan tempel di bawah'
                    ],
                    apiKeyLabel: 'Kunci API Gemini',
                    saveButton: 'Simpan Kunci API',
                    removeButton: 'Hapus Kunci API',
                    removeConfirmTitle: 'Hapus Kunci API',
                    removeConfirmMessage: 'Apakah Anda yakin ingin menghapus kunci API?',
                    cancelButton: 'Batal',
                    removeModalButton: 'Hapus',
                    apiKeySaved: 'Kunci API berhasil disimpan.',
                    apiKeyVerified: 'Kunci API diverifikasi dan berhasil disimpan.',
                    apiKeyVerificationFailed: 'Kunci API disimpan tetapi verifikasi gagal: ',
                    apiKeySaveError: 'Kunci API disimpan tetapi tidak dapat diverifikasi: ',
                    apiKeyRemoved: 'Kunci API berhasil dihapus.',
                    pleaseEnterApiKey: 'Silakan masukkan kunci API',
                    byokKeySet: 'Kunci Disetel',
                    byokKeyMissing: 'Tanpa Kunci',
                    byokNoticeTitle: 'Bawa Kunci Anda Sendiri',
                    byokNoticeMsg: 'Quill adalah BYOK — Bawa Kunci Anda Sendiri. Server tidak memiliki kunci Gemini bawaan, jadi setiap pengunjung harus menyediakan kuncinya sendiri. Kunci Anda hanya disimpan di peramban ini (<code>localStorage</code>) dan dikirim per-request sebagai header <code>X-User-API-Key</code>. Server tidak pernah menyimpan, mencatat, atau membagikannya.'
                }
            };

            const savedLanguage = localStorage.getItem('uiLanguage') || 'english';
            languageSelect.value = savedLanguage;

            function showModal(title, message, onConfirm, cancelText, confirmText) {
                modalTitle.textContent = title;
                modalMessage.textContent = message;
                modalCancel.textContent = cancelText || 'Cancel';
                modalConfirm.textContent = confirmText || 'Confirm';
                modal.classList.add('show');
                function closeModal() { modal.classList.remove('show'); }
                modalCancel.onclick = closeModal;
                modalConfirm.onclick = function() { closeModal(); onConfirm(); };
                modal.onclick = function(e) { if (e.target === modal) closeModal(); };
                document.addEventListener('keydown', function escHandler(e) {
                    if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', escHandler); }
                });
            }

            const savedApiKey = localStorage.getItem('geminiApiKey');
            if (savedApiKey) {
                apiKeyInput.value = savedApiKey;
                removeBtn.style.display = 'inline-block';
            } else {
                removeBtn.style.display = 'none';
            }
            syncByokStatus();

            function updateLanguage(lang) {
                const texts = languages[lang];
                document.querySelector('h1').innerHTML = texts.title.replace('.', '<span class="amp">.</span>');
                document.querySelector('.lede').textContent = texts.lede;
                document.querySelectorAll('.section-head .title')[0].textContent = texts.languageTitle;
                document.querySelector('label[for="uiLanguage"]').textContent = texts.interfaceLanguage;
                document.querySelector('label[for="uiLanguage"]').nextElementSibling.nextElementSibling.textContent = texts.languageHelp;
                document.querySelectorAll('.section-head .title')[1].textContent = texts.apiTitle;
                document.querySelector('.info-block h4').textContent = texts.apiInstructions;
                const stepsList = document.getElementById('apiStepsList');
                stepsList.innerHTML = texts.apiSteps.map(function(s) { return '<li>' + s + '</li>'; }).join('');
                document.querySelector('label[for="apiKey"]').innerHTML = texts.apiKeyLabel + ' <span class="req">*</span>';
                saveBtn.textContent = texts.saveButton;
                removeBtn.textContent = texts.removeButton;
                localStorage.setItem('uiLanguage', lang);
            }

            updateLanguage(savedLanguage);

            languageSelect.addEventListener('change', function() {
                updateLanguage(this.value);
                syncByokStatus();
            });

            removeBtn.addEventListener('click', function() {
                const currentLang = localStorage.getItem('uiLanguage') || 'english';
                const texts = languages[currentLang];
                showModal(texts.removeConfirmTitle, texts.removeConfirmMessage, function() {
                    localStorage.removeItem('geminiApiKey');
                    apiKeyInput.value = '';
                    removeBtn.style.display = 'none';
                    showStatus(texts.apiKeyRemoved, 'success');
                    syncByokStatus();
                }, texts.cancelButton, texts.removeModalButton);
            });

            apiKeyForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                const currentLang = localStorage.getItem('uiLanguage') || 'english';
                const texts = languages[currentLang];
                const apiKey = apiKeyInput.value.trim();
                if (!apiKey) {
                    showStatus(texts.pleaseEnterApiKey, 'error');
                    return;
                }
                localStorage.setItem('geminiApiKey', apiKey);
                showStatus(texts.apiKeySaved, 'success');
                removeBtn.style.display = 'inline-block';
                removeBtn.textContent = texts.removeButton;
                syncByokStatus();
                try {
                    const response = await fetch('/api/test-key', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-User-API-Key': apiKey,
                        },
                        body: JSON.stringify({ apiKey: apiKey })
                    });
                    if (response.ok) {
                        showStatus(texts.apiKeyVerified, 'success');
                    } else {
                        const result = await response.json();
                        let errorMessage = (result && result.error) || 'Unknown error';
                        if (errorMessage.includes('quota exceeded') || errorMessage.includes('429')) {
                            errorMessage = (texts.apiKeyQuotaExceeded || 'API quota exceeded.');
                        } else if (errorMessage.includes('403') || errorMessage.includes('access denied') || errorMessage.includes('unauthorized')) {
                            errorMessage = (texts.apiKeyInvalid || 'Invalid API key.');
                        }
                        showStatus(texts.apiKeyVerificationFailed + errorMessage, 'error');
                    }
                } catch (error) {
                    let errorMessage = error.message;
                    if (error.message.includes('network') || error.message.includes('fetch')) {
                        errorMessage = (texts.networkError || 'Network error.');
                    }
                    showStatus(texts.apiKeySaveError + errorMessage, 'error');
                }
            });

            function showStatus(message, type) {
                statusMessage.textContent = message;
                statusMessage.className = 'status-message status-' + type;
                statusMessage.style.display = 'block';
                setTimeout(function() { statusMessage.style.display = 'none'; }, 5000);
            }
        });
    </script>
</body>
</html>`;
}
