// Settings page (language + Gemini API key) HTML generator for Quill.
// English strings are the default markup; the script below re-paints
// translatable fields when the user changes the language.

import { SETTINGS_STRINGS, COMMON_STRINGS, Locale } from './i18n';
import { renderHead, renderFooter, renderTopbar, getTopbarStrings, FOOTER_STRINGS, ARCHIVAL_DETAILS_HTML, COMMON_JS } from './styles';
import { SELECT_CSS, SELECT_SCRIPT } from './select';
import { SPECIMEN_JS } from './specimen';

const PAGE_CSS = `
${SELECT_CSS}
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

.settings-container { display: grid; grid-template-columns: repeat(12, 1fr); column-gap: var(--gutter); padding: 0; }
.settings-section { grid-column: 1 / span 12; border-bottom: var(--rule); padding: 0 0 32px 0; }
.section-head {
    padding: 14px 0;
    display: grid; grid-template-columns: repeat(12, 1fr); column-gap: var(--gutter); align-items: center;
    font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600;
}
.section-head .num { grid-column: 1 / span 1; color: var(--accent); font-family: 'JetBrains Mono', monospace; }
.section-head .title { grid-column: 2 / span 8; font-size: 20px; font-weight: 700; letter-spacing: -0.01em; text-transform: none; }
.section-head .meta { grid-column: 10 / span 3; text-align: right; color: var(--gray-600); font-weight: 400; letter-spacing: 0.12em; }

.form-group { padding: 16px 0; border-top: var(--rule-soft); }
.form-group label { display: block; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; margin-bottom: 8px; }
.form-group .req { color: var(--accent); }
.form-group input[type="text"],
.form-group input[type="password"],
.form-group select {
    width: 100%; border: none; border-bottom: 1px solid var(--black);
    background: transparent; padding: 6px 0 8px 0;
    font-family: 'Inter', sans-serif; font-size: 16px; color: var(--black);
    outline: none; border-radius: 0; -webkit-appearance: none; appearance: none;
}
.form-group input:focus, .form-group select:focus { border-bottom: 2px solid var(--accent); padding-bottom: 7px; }
.form-group select {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' stroke='%23000' stroke-width='1.4' fill='none'/></svg>");
    background-repeat: no-repeat; background-position: right 0 center; padding-right: 24px;
}
.form-group .help-text { display: block; margin-top: 8px; font-size: 12px; color: var(--gray-600); letter-spacing: 0.02em; }

.info-block { border-top: var(--rule-soft); padding: 16px 0; }
.info-block h4 { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 700; margin-bottom: 12px; color: var(--black); }
.info-block ol { list-style: none; counter-reset: step; }
.info-block ol li { counter-increment: step; padding: 6px 0 6px 32px; position: relative; font-size: 14px; border-bottom: 1px dotted var(--gray-300); }
.info-block ol li:last-child { border-bottom: none; }
.info-block ol li::before {
    content: counter(step, decimal-leading-zero);
    position: absolute; left: 0; top: 6px;
    font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--accent);
}
.info-block a { color: var(--black); border-bottom: 1px solid var(--black); }
.info-block a:hover { color: var(--accent); border-bottom-color: var(--accent); text-decoration: none; }

.action-row { display: grid; grid-template-columns: repeat(12, 1fr); column-gap: var(--gutter); padding: 16px 0 0 0; }
.save-btn {
    grid-column: 1 / span 6;
    background: var(--black); color: var(--white);
    border: 1px solid var(--black);
    padding: 18px 24px;
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase;
    cursor: pointer; border-radius: 0;
}
.save-btn:hover { background: var(--accent); border-color: var(--accent); }
.remove-btn {
    grid-column: 7 / span 6;
    background: var(--white); color: var(--black);
    border: 1px solid var(--black);
    padding: 18px 24px;
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase;
    cursor: pointer; border-radius: 0;
}
.remove-btn:hover { background: var(--black); color: var(--white); }
.save-btn:disabled, .remove-btn:disabled { background: var(--gray-100); border-color: var(--gray-300); color: var(--gray-600); cursor: not-allowed; }

.status-message { padding: 12px 0; font-size: 13px; font-weight: 500; display: none; border-top: var(--rule-soft); margin-top: 12px; }
.status-success { color: var(--black); border-top-color: var(--black); }
.status-error { color: var(--accent); border-top-color: var(--accent); }

@media (max-width: 900px) {
    .nav .title { grid-column: 2 / -1; }
    .nav .back { grid-column: 1 / -1; text-align: left; margin-top: 4px; }
    .section-head .title { grid-column: 2 / -1; font-size: 18px; }
    .section-head .meta { display: none; }
    .save-btn, .remove-btn { grid-column: 1 / -1; margin-bottom: 8px; }
}
`;

const SCRIPT = `
(function() {
    const I18N = window.__QUILL_I18N__.settings;
    const lang = localStorage.getItem('uiLanguage') || 'english';
    const storageKey = getApiKeyStorageKey();

    function getApiKeyStorageKey() {
        const uid = localStorage.getItem('quillAuthUid');
        return uid ? ('geminiApiKey.' + uid) : 'geminiApiKey';
    }

    function showStatus(message, type) {
        const el = document.getElementById('statusMessage');
        el.textContent = message;
        el.className = 'status-message ' + (type === 'success' ? 'status-success' : 'status-error');
        el.style.display = 'block';
        setTimeout(() => { el.style.display = 'none'; }, 5000);
    }

    function showModal(title, message, onConfirm, cancelText, confirmText, opts) {
        if (window.showModal) {
            window.showModal(title, message, onConfirm, cancelText, confirmText, opts);
        } else {
            if (confirm(message)) onConfirm(opts && opts.checkboxLabel ? true : undefined);
        }
    }

    function repaint(newLang) {
        const t = I18N[newLang];
        document.title = t.documentTitle;
        const topbarEl = document.querySelector('.topbar');
        if (topbarEl) {
            const tmp = document.createElement('div');
            tmp.innerHTML = (window.__QUILL_TOPBAR__ && window.__QUILL_TOPBAR__[newLang]) || topbarEl.outerHTML;
            topbarEl.replaceWith(tmp.firstElementChild);
            window.setupAccountMenu();
            window.syncAuthPill();
        }
        const heroTitle = document.getElementById('heroTitle');
        if (heroTitle) {
            heroTitle.innerHTML = t.title.replace(/\\./, '<span class="amp">.</span>');
        }
        document.getElementById('heroLede').textContent = t.lede;
        document.getElementById('configTitle').textContent = t.navTitle;
        document.getElementById('backLink').innerHTML = '&larr; ' + t.backToGenerator;
        document.getElementById('languageSection').textContent = t.languageSection;
        document.getElementById('languageMeta').textContent = t.languageMeta;
        document.getElementById('interfaceLanguageLabel').textContent = t.interfaceLanguageLabel;
        document.getElementById('languageHelp').textContent = t.languageHelp;
        document.getElementById('apiSection').textContent = t.apiSection;
        document.getElementById('apiMeta').textContent = t.apiMeta;
        document.getElementById('byokNoticeTitle').textContent = t.byokNoticeTitle;
        document.getElementById('byokNoticeBody').textContent = t.byokNoticeBody;
        document.getElementById('apiKeyLabel').textContent = t.apiKeyLabel;
        document.getElementById('apiKeyHelp').textContent = t.apiKeyHelp;
        document.getElementById('apiKeyGuideTitle').textContent = t.apiKeyGuideTitle;
        document.getElementById('guideStep01').innerHTML = t.guideStep01;
        document.getElementById('guideStep02').innerHTML = t.guideStep02;
        document.getElementById('guideStep03').innerHTML = t.guideStep03;
        document.getElementById('saveBtn').textContent = t.saveButton;
        const removeBtn = document.getElementById('removeBtn');
        if (removeBtn) removeBtn.textContent = t.removeButton;

        const signInLink = document.getElementById('authSignInLink');
        if (signInLink) {
            signInLink.textContent = t.signInLabel;
            signInLink.setAttribute('title', t.signInTooltip);
        }
        const signOutBtn = document.getElementById('authSignOutBtn');
        if (signOutBtn) signOutBtn.setAttribute('title', t.signOutTooltip);
        if (window.rebuildAllSelects) window.rebuildAllSelects();

        // Repaint Footer
        const footerEl = document.querySelector('.footer');
        if (footerEl) {
            const footerStrings = window.__QUILL_I18N__.footer[newLang];
            footerEl.querySelector('.col-1').innerHTML = footerStrings.copyright;
            footerEl.querySelector('.col-2').innerHTML = footerStrings.typeface;
            footerEl.querySelector('.col-3').innerHTML = footerStrings.by.replace('{link}', '<a href="https://azzar.netlify.app/porto" target="_blank">LilyOpenCMS</a>');
        }

        window.syncByokStatus();
    }

    document.addEventListener('DOMContentLoaded', function() {
        const savedLanguage = localStorage.getItem('uiLanguage') || 'english';
        const languageSelect = document.getElementById('uiLanguage');
        const apiKeyForm = document.getElementById('apiKeyForm');
        const apiKeyInput = document.getElementById('apiKey');
        const removeBtn = document.getElementById('removeBtn');

        languageSelect.value = savedLanguage;
        const savedKey = localStorage.getItem(storageKey);
        if (savedKey) {
            apiKeyInput.value = savedKey;
            removeBtn.style.display = 'inline-block';
        } else {
            removeBtn.style.display = 'none';
        }
        window.setupAccountMenu();
        window.syncAuthPill();
        repaint(savedLanguage);

        languageSelect.addEventListener('change', function() {
            localStorage.setItem('uiLanguage', this.value);
            repaint(this.value);
        });

        removeBtn.addEventListener('click', function() {
            const lang = localStorage.getItem('uiLanguage') || 'english';
            const t = I18N[lang];
            showModal(t.removeConfirmTitle, t.removeConfirmMessage, function() {
                localStorage.removeItem(storageKey);
                apiKeyInput.value = '';
                removeBtn.style.display = 'none';
                showStatus(t.apiKeyRemoved, 'success');
                window.syncByokStatus();
            }, t.cancelButton, t.removeModalButton);
        });

        apiKeyForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const lang = localStorage.getItem('uiLanguage') || 'english';
            const t = I18N[lang];
            const apiKey = apiKeyInput.value.trim();
            if (!apiKey) {
                showStatus(t.pleaseEnterApiKey, 'error');
                return;
            }
            localStorage.setItem(storageKey, apiKey);
            showStatus(t.apiKeySaved, 'success');
            removeBtn.style.display = 'inline-block';
            removeBtn.textContent = t.removeButton;
            window.syncByokStatus();
            try {
                const response = await fetch('/api/test-key', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-User-API-Key': apiKey },
                    body: JSON.stringify({ apiKey }),
                });
                if (response.ok) {
                    showStatus(t.apiKeyVerified, 'success');
                } else {
                    let result = null;
                    try { const txt = await response.text(); result = JSON.parse(txt); } catch (_) {}
                    let msg = (result && result.error) || 'Unknown error (' + response.status + ')';
                    if (msg.includes('quota exceeded') || msg.includes('429')) msg = t.apiKeyQuotaExceeded || 'API quota exceeded.';
                    else if (msg.includes('403') || msg.includes('access denied') || msg.includes('unauthorized')) msg = t.apiKeyInvalid || 'Invalid API key.';
                    showStatus(t.apiKeyVerificationFailed + msg, 'error');
                }
            } catch (error) {
                let msg = error.message;
                if (error.message.includes('network') || error.message.includes('fetch')) msg = t.networkError || 'Network error.';
                showStatus(t.apiKeySaveError + msg, 'error');
            }
        });

        document.addEventListener('click', function(e) {
            const target = e.target;
            if (!(target instanceof Element)) return;
            const btn = target.closest('#authSignOutBtn');
            if (!btn) return;
            e.preventDefault();
            const lang = localStorage.getItem('uiLanguage') || 'english';
            const t = I18N[lang];
            showModal(
                t.signOutConfirmTitle,
                t.signOutConfirmMessage,
                function(keepKey) { performSignOut(keepKey); },
                t.cancelButton,
                t.signOutConfirmButton,
                { checkboxLabel: t.signOutKeepKeyLabel, checkboxDefault: true }
            );
        });

        async function performSignOut(keepKey) {
            const previousUid = localStorage.getItem('quillAuthUid');
            const previousKey = previousUid ? localStorage.getItem('geminiApiKey.' + previousUid) : null;
            try {
                if (!window.firebase || !window.firebase.auth) {
                    await new Promise(function(resolve, reject) {
                        const s1 = document.createElement('script');
                        s1.src = 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js';
                        s1.onload = resolve; s1.onerror = reject;
                        document.head.appendChild(s1);
                    });
                    await new Promise(function(resolve, reject) {
                        const s2 = document.createElement('script');
                        s2.src = 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth-compat.js';
                        s2.onload = resolve; s2.onerror = reject;
                        document.head.appendChild(s2);
                    });
                }
                if (window.firebase && window.firebase.auth) {
                    try { await window.firebase.auth().signOut(); } catch (_) {}
                }
            } catch (_) {}
            try { await fetch('/api/auth/session', { method: 'DELETE' }); } catch (_) {}
            try { await fetch('/api/auth/signout', { method: 'POST' }); } catch (_) {}
            localStorage.removeItem('quillAuthUid');
            localStorage.removeItem('quillAuthName');
            if (!keepKey && previousUid) {
                localStorage.removeItem('geminiApiKey.' + previousUid);
            }
            localStorage.removeItem('geminiApiKey');
            const newKey = getApiKeyStorageKey();
            if (keepKey && previousKey) {
                localStorage.setItem(newKey, previousKey);
            } else {
                localStorage.setItem(newKey, '');
            }
            window.syncAuthPill();
            window.syncByokStatus();
            location.reload();
        }
    });
})();
`;

export function generateSettingsPageHTML(locale: Locale = 'english'): string {
  const strings = SETTINGS_STRINGS[locale];
  const footerStrings = FOOTER_STRINGS[locale];
  const topbarHtml = renderTopbar('settings', locale);
  const footerHtml = renderFooter(footerStrings);

  return `<!DOCTYPE html>
<html lang="${locale}">
${renderHead({ title: strings.documentTitle, pageStyles: PAGE_CSS })}
<body>
<div class="container">
    ${topbarHtml}

    <header class="hero">
        <div class="index">№ 04</div>
        <div class="headline">
            <h1 id="heroTitle">${strings.title.replace(/\./, '<span class="amp">.</span>')}</h1>
        </div>
        <p class="lede" id="heroLede">${strings.lede}</p>
    </header>


    <div class="nav">
        <div class="num">01</div>
        <div class="title" id="configTitle">${strings.navTitle}</div>
        <div class="back"><a href="/" id="backLink">&larr; ${strings.backToGenerator}</a></div>
    </div>

    <div class="settings-container">
        <section class="settings-section">
            <div class="section-head">
                <div class="num">02</div>
                <div class="title" id="languageSection">${strings.languageSection}</div>
                <div class="meta" id="languageMeta">${strings.languageMeta}</div>
            </div>
            <div class="form-group">
                <label for="uiLanguage" id="interfaceLanguageLabel">${strings.interfaceLanguageLabel}</label>
                <select id="uiLanguage">
                    <option value="english">English</option>
                    <option value="indonesian">Bahasa Indonesia</option>
                </select>
                <small class="help-text" id="languageHelp">${strings.languageHelp}</small>
            </div>
        </section>

        <section class="settings-section">
            <div class="section-head">
                <div class="num">03</div>
                <div class="title" id="apiSection">${strings.apiSection}</div>
                <div class="meta" id="apiMeta">${strings.apiMeta}</div>
            </div>
            <div class="byok-notice" id="byokNotice">
                <div class="byok-notice-num">BYOK</div>
                <div class="byok-notice-body">
                    <h4 id="byokNoticeTitle">${strings.byokNoticeTitle}</h4>
                    <p id="byokNoticeBody">${strings.byokNoticeBody}</p>
                </div>
            </div>
            <form id="apiKeyForm">
                <div class="form-group">
                    <label for="apiKey" id="apiKeyLabel">${strings.apiKeyLabel}</label>
                    <input type="password" id="apiKey" placeholder="AIzaSy...">
                    <small class="help-text" id="apiKeyHelp">${strings.apiKeyHelp}</small>
                </div>
                <div class="action-row">
                    <button type="submit" class="save-btn" id="saveBtn">${strings.saveButton}</button>
                    <button type="button" class="remove-btn" id="removeBtn" style="display: none;">${strings.removeButton}</button>
                </div>
                <div id="statusMessage" class="status-message"></div>
            </form>

            <div class="info-block">
                <h4 id="apiKeyGuideTitle">${strings.apiKeyGuideTitle}</h4>
                <ol>
                    <li id="guideStep01">${strings.guideStep01}</li>
                    <li id="guideStep02">${strings.guideStep02}</li>
                    <li id="guideStep03">${strings.guideStep03}</li>
                </ol>
            </div>
        </section>
    </div>

    ${footerHtml}
</div>

${ARCHIVAL_DETAILS_HTML}

<script>
window.__QUILL_I18N__ = ${JSON.stringify({ settings: SETTINGS_STRINGS, common: COMMON_STRINGS, footer: FOOTER_STRINGS })};
window.__QUILL_INITIAL_LOCALE__ = ${JSON.stringify(locale)};
window.__QUILL_TOPBAR__ = ${JSON.stringify({
  english: renderTopbar('settings', 'english'),
  indonesian: renderTopbar('settings', 'indonesian'),
})};
window.__QUILL_TOPBAR_STRINGS__ = ${JSON.stringify({
  english: getTopbarStrings('english'),
  indonesian: getTopbarStrings('indonesian'),
})};
</script>
<script>${COMMON_JS}</script>
<script>${SCRIPT}</script>
<script>${SELECT_SCRIPT}</script>
<script>${SPECIMEN_JS}</script>
<script>
(function() {
    if (window.renderSpecimen) {
        document.querySelectorAll('svg[data-specimen-seed]').forEach(function(svg) {
            window.renderSpecimen(svg, svg.getAttribute('data-specimen-seed'));
        });
    }
})();
</script>
</body>
</html>`;
}
