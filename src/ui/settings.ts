// Settings page (language + Gemini API key) HTML generator for Quill.
// English strings are the default markup; the script below re-paints
// translatable fields when the user changes the language.

import { SETTINGS_STRINGS, Locale } from './i18n';
import { renderHead, renderFooter, renderTopbar, getTopbarStrings, FOOTER_STRINGS } from './styles';
import { SELECT_CSS, SELECT_SCRIPT } from './select';

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

const BODY_HTML = `
<div class="container">
    ${renderTopbar('settings', 'english')}

    <header class="hero">
        <div class="index">&#8470; S.01</div>
        <div class="headline">
            <h1 id="heroTitle">Settings<span class="amp">.</span></h1>
        </div>
        <p class="lede" id="heroLede">Configure the language of the interface and your Gemini API key. All values are stored locally in this browser.</p>
    </header>

    <div class="nav">
        <div class="num">01</div>
        <div class="title" id="configTitle">Configuration</div>
        <div class="back"><a href="/" id="backLink">&larr; Back to Generator</a></div>
    </div>

    <div class="settings-container">
        <section class="settings-section">
            <div class="section-head">
                <div class="num">02</div>
                <div class="title" id="languageSection">Language</div>
                <div class="meta" id="languageMeta">UI / LOCALE</div>
            </div>
            <div class="form-group">
                <label for="uiLanguage" id="interfaceLanguageLabel">Interface Language</label>
                <select id="uiLanguage">
                    <option value="english">English</option>
                    <option value="indonesian">Bahasa Indonesia</option>
                </select>
                <small class="help-text" id="languageHelp">Choose the language for the user interface.</small>
            </div>
        </section>

        <section class="settings-section">
            <div class="section-head">
                <div class="num">03</div>
                <div class="title" id="apiSection">Gemini AI Configuration</div>
                <div class="meta" id="apiMeta">CREDENTIALS</div>
            </div>
            <div class="byok-notice" id="byokNotice">
                <div class="byok-notice-num">BYOK</div>
                <div class="byok-notice-body">
                    <div class="byok-notice-title" id="byokNoticeTitle">Bring Your Own Key</div>
                    <div class="byok-notice-msg" id="byokNoticeMsg">Quill is BYOK &mdash; Bring Your Own Key. The server has no default Gemini key, so every visitor must provide their own. Your key is stored only in this browser (<code>localStorage</code>) and is sent per-request as the <code>X-User-API-Key</code> header. The server never persists, logs, or shares it.</div>
                </div>
            </div>
            <div class="info-block">
                <h4 id="apiInstructions">How to get your API key</h4>
                <ol id="apiStepsList">
                    <li><a href="https://aistudio.google.com/app/apikey" target="_blank">Go to Google AI Studio</a></li>
                    <li>Sign in with your Google account</li>
                    <li>Create a new API key</li>
                    <li>Copy the key and paste it below</li>
                </ol>
            </div>
            <form id="apiKeyForm">
                <div class="form-group">
                    <label for="apiKey" id="apiKeyLabel">Gemini API Key <span class="req">*</span></label>
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
        <div class="col-1" id="footerCol1">Quill&trade; <span class="accent-dot">&middot;</span> Ed. 02 / 2026</div>
        <div class="col-2" id="footerCol2">Set in Inter &amp; JetBrains Mono</div>
        <div class="col-3" id="footerCol3">By <a href="https://azzar.netlify.app/porto" target="_blank">LilyOpenCMS</a></div>
    </footer>
</div>

<div class="modal-overlay" id="confirmationModal">
    <div class="modal-content">
        <div class="modal-head">
            <span class="lab" id="modalLab">CONFIRM</span>
            <span id="modalEscClose">ESC TO CLOSE</span>
        </div>
        <div class="modal-body">
            <h3 class="modal-title" id="modalTitle">Remove API Key</h3>
            <p class="modal-message" id="modalMessage">Are you sure you want to remove your API key?</p>
            <div class="modal-extra" id="modalExtra" style="display: none;"></div>
        </div>
        <div class="modal-actions">
            <button class="modal-btn modal-btn-cancel" id="modalCancel">Cancel</button>
            <button class="modal-btn modal-btn-confirm" id="modalConfirm">Confirm</button>
        </div>
    </div>
</div>
`;

const SCRIPT = `
(function() {
    const I18N = window.__QUILL_I18N__.settings;
    const FOOTER = window.__QUILL_I18N__.footer;

    function escapeHtml(s) {
        if (s == null) return '';
        return String(s).replace(/[&<>"']/g, function(c) {
            return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
        });
    }

    function repaint(lang) {
        const t = I18N[lang];
        document.title = t.documentTitle;
        // Topbar (replace on language change)
        const topbarEl = document.querySelector('.topbar');
        if (topbarEl) {
            const tmp = document.createElement('div');
            tmp.innerHTML = (window.__QUILL_TOPBAR__ && window.__QUILL_TOPBAR__[lang]) || topbarEl.outerHTML;
            topbarEl.replaceWith(tmp.firstElementChild);
            setupAccountMenu();
            syncAuthPill();
        }
        const heroTitle = document.getElementById('heroTitle');
        if (heroTitle) {
            heroTitle.innerHTML = escapeHtml(t.title).replace(/\\./, '<span class="amp">.</span>');
        }
        document.getElementById('heroLede').textContent = t.lede;
        document.getElementById('backLink').textContent = t.backLink;
        document.getElementById('configTitle').textContent = t.configTitle;
        document.getElementById('languageSection').textContent = t.languageSection;
        document.getElementById('interfaceLanguageLabel').textContent = t.interfaceLanguageLabel;
        document.getElementById('languageHelp').textContent = t.languageHelp;
        document.getElementById('apiSection').textContent = t.apiSection;
        document.getElementById('apiInstructions').textContent = t.apiInstructions;
        const stepsList = document.getElementById('apiStepsList');
        if (stepsList) stepsList.innerHTML = t.apiSteps.map(function(s) { return '<li>' + s + '</li>'; }).join('');
        const apiKeyLabel = document.getElementById('apiKeyLabel');
        if (apiKeyLabel) apiKeyLabel.innerHTML = escapeHtml(t.apiKeyLabel) + ' <span class="req">*</span>';
        document.getElementById('saveBtn').textContent = t.saveButton;
        document.getElementById('removeBtn').textContent = t.removeButton;
        const f = FOOTER[lang];
        document.getElementById('footerCol1').innerHTML = f.copyright;
        document.getElementById('footerCol2').textContent = f.typeface;
        document.getElementById('footerCol3').innerHTML = f.by.replace('{link}', '<a href="https://azzar.netlify.app/porto" target="_blank">LilyOpenCMS</a>');
        const signInLink = document.getElementById('authSignInLink');
        if (signInLink) {
            signInLink.textContent = t.signInLink;
            signInLink.setAttribute('title', t.signInTooltip);
        }
        const signOutBtn = document.getElementById('authSignOutBtn');
        if (signOutBtn) signOutBtn.setAttribute('title', t.signOutTooltip);
        if (window.rebuildAllSelects) window.rebuildAllSelects();
        syncByokStatus();
    }

    function syncByokStatus() {
        const lang = localStorage.getItem('uiLanguage') || 'english';
        const t = I18N[lang];
        const has = !!((localStorage.getItem(getApiKeyStorageKey()) || '').trim());
        const byokStatus = document.getElementById('byokStatus');
        if (byokStatus) byokStatus.setAttribute('data-state', has ? 'ok' : 'missing');
        const byokStrings = (window.__QUILL_TOPBAR_STRINGS__ && window.__QUILL_TOPBAR_STRINGS__[lang]) || null;
        const byokStateText = document.getElementById('byokStateText');
        if (byokStateText) byokStateText.textContent = has ? (byokStrings ? byokStrings.byokSet : 'Key Set') : (byokStrings ? byokStrings.byokMissing : 'No Key');
        const byokNoticeTitle = document.getElementById('byokNoticeTitle');
        if (byokNoticeTitle) byokNoticeTitle.textContent = t.byokNoticeTitle;
        const byokNoticeMsg = document.getElementById('byokNoticeMsg');
        if (byokNoticeMsg) byokNoticeMsg.innerHTML = t.byokNoticeMsg;
    }

    function showModal(title, message, onConfirm, cancelText, confirmText, opts) {
        const modal = document.getElementById('confirmationModal');
        const lang = localStorage.getItem('uiLanguage') || 'english';
        const t = I18N[lang];
        const lab = document.getElementById('modalLab');
        const escClose = document.getElementById('modalEscClose');
        const modalExtra = document.getElementById('modalExtra');
        if (lab) lab.textContent = t.confirmLabel;
        if (escClose) escClose.textContent = t.escToClose;
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalMessage').textContent = message;
        document.getElementById('modalCancel').textContent = cancelText || 'Cancel';
        document.getElementById('modalConfirm').textContent = confirmText || 'Confirm';
        if (modalExtra) {
            if (opts && opts.checkboxLabel) {
                modalExtra.innerHTML = '<label class="modal-checkbox"><input type="checkbox" id="modalCheckbox" ' + (opts.checkboxDefault !== false ? 'checked' : '') + '> <span id="modalCheckboxLabel"></span></label>';
                const lbl = document.getElementById('modalCheckboxLabel');
                if (lbl) lbl.textContent = opts.checkboxLabel;
                modalExtra.style.display = 'block';
            } else {
                modalExtra.innerHTML = '';
                modalExtra.style.display = 'none';
            }
        }
        modal.classList.add('show');
        function closeModal() { modal.classList.remove('show'); }
        document.getElementById('modalCancel').onclick = closeModal;
        document.getElementById('modalConfirm').onclick = function() {
            const cb = document.getElementById('modalCheckbox');
            const checked = cb ? cb.checked : true;
            closeModal();
            onConfirm(checked);
        };
        modal.onclick = function(e) { if (e.target === modal) closeModal(); };
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', escHandler); }
        });
    }

    function getApiKeyStorageKey() {
        const uid = localStorage.getItem('quillAuthUid');
        return uid ? ('geminiApiKey.' + uid) : 'geminiApiKey';
    }

    function showStatus(message, type) {
        const sm = document.getElementById('statusMessage');
        sm.textContent = message;
        sm.className = 'status-message status-' + type;
        sm.style.display = 'block';
        setTimeout(() => { sm.style.display = 'none'; }, 5000);
    }

    function computeInitials(name) {
        if (!name) return '';
        var parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    function syncAuthPill() {
        const trigger = document.getElementById('accountTrigger');
        const signIn = document.getElementById('authSignInLink');
        const name = localStorage.getItem('quillAuthName') || '';
        const uid = localStorage.getItem('quillAuthUid') || '';
        const initials = computeInitials(name) || (uid ? uid.slice(0, 2).toUpperCase() : '--');
        if (trigger && signIn) {
            if (name || uid) {
                trigger.hidden = false;
                signIn.hidden = true;
                trigger.setAttribute('data-uid', uid);
                const av = document.getElementById('accountAvatar');
                const avLg = document.getElementById('accountAvatarLg');
                const trigName = document.getElementById('accountTriggerName');
                const ddName = document.getElementById('accountName');
                const ddEmail = document.getElementById('accountEmail');
                const footUid = document.getElementById('accountFootUid');
                if (av) av.textContent = initials;
                if (avLg) avLg.textContent = initials;
                if (trigName) trigName.textContent = name || 'Account';
                if (ddName) ddName.textContent = name || 'Account';
                if (ddEmail) ddEmail.textContent = uid || '';
                if (footUid) footUid.textContent = uid ? 'UID ' + uid.slice(0, 8) + (uid.length > 8 ? '…' : '') : '';
            } else {
                trigger.hidden = true;
                signIn.hidden = false;
            }
        }
    }

    function openAccountMenu() {
        var trigger = document.getElementById('accountTrigger');
        var dd = document.getElementById('accountDropdown');
        var back = document.getElementById('accountBackdrop');
        if (!trigger || !dd) return;
        trigger.setAttribute('aria-expanded', 'true');
        dd.hidden = false;
        if (back) back.hidden = false;
    }
    function closeAccountMenu() {
        var trigger = document.getElementById('accountTrigger');
        var dd = document.getElementById('accountDropdown');
        var back = document.getElementById('accountBackdrop');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
        if (dd) dd.hidden = true;
        if (back) back.hidden = true;
    }
    function setupAccountMenu() {
        var trigger = document.getElementById('accountTrigger');
        var back = document.getElementById('accountBackdrop');
        if (trigger) {
            trigger.addEventListener('click', function(e) {
                e.stopPropagation();
                if (trigger.getAttribute('aria-expanded') === 'true') closeAccountMenu();
                else openAccountMenu();
            });
        }
        if (back) back.addEventListener('click', closeAccountMenu);
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeAccountMenu();
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        const apiKeyForm = document.getElementById('apiKeyForm');
        const apiKeyInput = document.getElementById('apiKey');
        const saveBtn = document.getElementById('saveBtn');
        const removeBtn = document.getElementById('removeBtn');
        const languageSelect = document.getElementById('uiLanguage');

        const savedLanguage = localStorage.getItem('uiLanguage') || 'english';
        languageSelect.value = savedLanguage;

        const storageKey = getApiKeyStorageKey();
        const savedApiKey = localStorage.getItem(storageKey);
        if (savedApiKey) {
            apiKeyInput.value = savedApiKey;
            removeBtn.style.display = 'inline-block';
        } else {
            removeBtn.style.display = 'none';
        }
        setupAccountMenu();
        syncAuthPill();
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
                syncByokStatus();
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
            syncByokStatus();
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
            syncAuthPill();
            syncByokStatus();
            location.reload();
        }
    });
})();
`;

export function generateSettingsPageHTML(locale: Locale = 'english'): string {
  const strings = SETTINGS_STRINGS[locale];
  return `<!DOCTYPE html>
<html lang="${locale}">
${renderHead({ title: strings.documentTitle, pageStyles: PAGE_CSS })}
<body>
${BODY_HTML}
<script>
window.__QUILL_I18N__ = ${JSON.stringify({ settings: SETTINGS_STRINGS, footer: FOOTER_STRINGS })};
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
<script>${SCRIPT}</script>
<script>${SELECT_SCRIPT}</script>
</body>
</html>`;
}
