// Login / sign-up page (Firebase auth) HTML generator for Quill.
// The Firebase JS SDK runs entirely in the browser; the server never sees
// the user's password. The user's UID is mirrored to localStorage so other
// pages can namespace the BYOK key per user.

import { AUTH_STRINGS, COMMON_STRINGS, Locale } from './i18n';
import { renderHead, renderFooter, renderTopbar, getTopbarStrings, FOOTER_STRINGS, ARCHIVAL_DETAILS_HTML, COMMON_JS } from './styles';
import { SPECIMEN_JS } from './specimen';

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyD1E_enU3EG10HHT-g2Z0fY7OhaHm_aKY8',
  authDomain: 'quill-001.firebaseapp.com',
  projectId: 'quill-001',
  storageBucket: 'quill-001.firebasestorage.app',
  messagingSenderId: '451637022029',
  appId: '1:451637022029:web:cc7a1d3e39cad3646bfb04',
  measurementId: 'G-3TSGGGQWMK',
};

const PAGE_CSS = `
/* Auth page layout (uses the .auth-page rules in styles.ts) */
.auth-section-label {
    border-top: var(--rule);
    padding: 14px 0;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    column-gap: var(--gutter);
    font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600;
    align-items: center;
}
.auth-section-label .num { grid-column: 1 / span 1; color: var(--accent); font-family: 'JetBrains Mono', monospace; }
.auth-section-label .title { grid-column: 2 / span 8; }
.auth-section-label .meta { grid-column: 10 / span 3; text-align: right; color: var(--gray-600); font-weight: 400; letter-spacing: 0.12em; }
`;

const BODY_HTML = `
<div class="container">
    ${renderTopbar('login', 'english')}

    <div class="auth-section-label">
        <div class="num">01</div>
        <div class="title" id="sectionTitle">Account</div>
        <div class="meta">FIREBASE</div>
    </div>

    <main class="auth-page">
        <div class="auth-intro">
            <h2 id="introTitle">Sign in to Quill<span class="brand-tm">™</span>.</h2>
            <p id="introBody">Quill<span class="brand-tm">™</span> is BYOK. Sign in to keep your Gemini API key and saved articles tied to your account across devices. The server never sees or stores your key — it lives only in this browser.</p>
        </div>

        <div class="auth-card">
            <div class="auth-tabs" role="tablist">
                <button class="auth-tab active" data-tab="signin" id="tabSignIn" type="button">Sign In</button>
                <button class="auth-tab" data-tab="signup" id="tabSignUp" type="button">Create Account</button>
            </div>

            <form id="authForm" class="auth-form" autocomplete="on" novalidate>
                <div class="form-group" id="displayNameGroup" style="display: none;">
                    <label for="displayName" id="displayNameLabel">Display name (optional)</label>
                    <input type="text" id="displayName" placeholder="How should we greet you?">
                </div>
                <div class="form-group">
                    <label for="email" id="emailLabel">Email</label>
                    <input type="email" id="email" required autocomplete="email" placeholder="you@example.com">
                </div>
                <div class="form-group">
                    <label for="password" id="passwordLabel">Password</label>
                    <input type="password" id="password" required autocomplete="current-password" placeholder="At least 6 characters">
                </div>

                <div class="auth-row-between" id="forgotRow">
                    <a href="#" id="forgotLink" class="auth-link-muted" style="font-size: 12px; color: var(--gray-600); border-bottom: 1px solid var(--gray-300);">Forgot password?</a>
                </div>

                <div class="auth-status" id="authStatus" role="status" aria-live="polite"></div>

                <div class="auth-actions">
                    <button type="submit" class="btn-primary" id="authSubmitBtn">Sign In</button>
                    <div class="auth-divider"><span id="dividerText">or</span></div>
                    <button type="button" class="btn-google" id="googleBtn">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path fill="#4285F4" d="M22.5 12.27c0-.78-.07-1.53-.2-2.27H12v4.51h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.22-4.74 3.22-8.32z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
                        </svg>
                        <span id="googleBtnLabel">Continue with Google</span>
                    </button>
                </div>

                <p style="margin-top: 16px; font-size: 12px; color: var(--gray-600);">
                    <a href="#" id="switchMode" style="color: var(--black); border-bottom: 1px solid var(--black);">No account yet? Create one →</a>
                </p>
            </form>
        </div>
    </main>

    ${renderFooter(FOOTER_STRINGS['english'])}
</div>

${ARCHIVAL_DETAILS_HTML}
`;

const SCRIPT = `
(function() {
    const I18N = window.__QUILL_I18N__.auth;
    const FOOTER = window.__QUILL_I18N__.footer;
    const FB_CONFIG = window.__QUILL_FIREBASE_CONFIG__;

    let mode = 'signin'; // 'signin' | 'signup'
    let inFlight = false;

    function escapeHtml(s) {
        if (s == null) return '';
        return String(s).replace(/[&<>"']/g, function(c) {
            return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
        });
    }

    function showStatus(message, type) {
        const el = document.getElementById('authStatus');
        el.textContent = message;
        el.className = 'auth-status show status-' + (type || 'error');
        if (type === 'success') {
            setTimeout(() => { el.classList.remove('show'); }, 4000);
        }
    }
    function clearStatus() {
        const el = document.getElementById('authStatus');
        el.classList.remove('show');
        el.textContent = '';
    }

    function getApiKeyStorageKey() {
        const uid = localStorage.getItem('quillAuthUid');
        return uid ? ('geminiApiKey.' + uid) : 'geminiApiKey';
    }

    function setBusy(busy) {
        inFlight = busy;
        const submit = document.getElementById('authSubmitBtn');
        const google = document.getElementById('googleBtn');
        const forgot = document.getElementById('forgotLink');
        const tabs = document.querySelectorAll('.auth-tab');
        submit.disabled = busy;
        google.disabled = busy;
        if (forgot) forgot.style.pointerEvents = busy ? 'none' : '';
        if (forgot) forgot.style.opacity = busy ? '0.5' : '';
        tabs.forEach(function(t) { t.disabled = busy; });
    }

    function repaint(lang) {
        const t = I18N[lang];
        document.title = t.documentTitle;
        const topbarEl = document.querySelector('.topbar');
        if (topbarEl) {
            const tmp = document.createElement('div');
            tmp.innerHTML = (window.__QUILL_TOPBAR__ && window.__QUILL_TOPBAR__[lang]) || topbarEl.outerHTML;
            topbarEl.replaceWith(tmp.firstElementChild);
            window.setupAccountMenu();
            window.syncAuthPill();
            window.syncByokStatus();
        }
        const introTitle = document.getElementById('introTitle');
        introTitle.innerHTML = t.introTitle.replace(/\\./, '<span class="amp">.</span>');
        document.getElementById('introBody').innerHTML = t.introBody;
        document.getElementById('tabSignIn').textContent = t.signInTab;
        document.getElementById('tabSignUp').textContent = t.signUpTab;
        document.getElementById('emailLabel').textContent = t.emailLabel;
        document.getElementById('email').placeholder = t.emailPlaceholder;
        document.getElementById('passwordLabel').textContent = t.passwordLabel;
        document.getElementById('password').placeholder = t.passwordPlaceholder;
        document.getElementById('displayNameLabel').textContent = t.displayNameLabel;
        document.getElementById('displayName').placeholder = t.displayNamePlaceholder;
        document.getElementById('dividerText').textContent = t.orDivider;
        document.getElementById('googleBtnLabel').textContent = t.googleButton;
        const forgotLink = document.getElementById('forgotLink');
        if (forgotLink) forgotLink.textContent = t.forgotPasswordLink;
        const submit = document.getElementById('authSubmitBtn');
        const labelKey = (inFlight ? (mode === 'signin' ? 'signingIn' : 'signingUp') : (mode === 'signin' ? 'signInButton' : 'signUpButton'));
        submit.textContent = t[labelKey];
        const switchLink = document.getElementById('switchMode');
        switchLink.textContent = mode === 'signin' ? t.switchToSignUp : t.switchToSignIn;
    }

    function setMode(next) {
        mode = next;
        document.getElementById('tabSignIn').classList.toggle('active', mode === 'signin');
        document.getElementById('tabSignUp').classList.toggle('active', mode === 'signup');
        document.getElementById('displayNameGroup').style.display = mode === 'signup' ? 'block' : 'none';
        document.getElementById('displayName').required = mode === 'signup';
        const forgotRow = document.getElementById('forgotRow');
        if (forgotRow) forgotRow.style.display = mode === 'signin' ? 'block' : 'none';
        const lang = localStorage.getItem('uiLanguage') || 'english';
        const t = I18N[lang];
        const submit = document.getElementById('authSubmitBtn');
        submit.textContent = mode === 'signin' ? t.signInButton : t.signUpButton;
        const switchLink = document.getElementById('switchMode');
        switchLink.textContent = mode === 'signin' ? t.switchToSignUp : t.switchToSignIn;
        document.getElementById('password').setAttribute('autocomplete', mode === 'signin' ? 'current-password' : 'new-password');
        clearStatus();
    }

    async function loadFirebase() {
        if (window.firebase && window.firebase.auth) return window.firebase;
        await new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js';
            s.onload = resolve;
            s.onerror = function() { reject(new Error('Failed to load Firebase app SDK')); };
            document.head.appendChild(s);
        });
        await new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth-compat.js';
            s.onload = resolve;
            s.onerror = function() { reject(new Error('Failed to load Firebase auth SDK')); };
            document.head.appendChild(s);
        });
        if (!window.firebase.apps || window.firebase.apps.length === 0) {
            window.firebase.initializeApp(FB_CONFIG);
        }
        return window.firebase;
    }

    function mapAuthError(code) {
        const lang = localStorage.getItem('uiLanguage') || 'english';
        const t = I18N[lang];
        switch (code) {
            case 'auth/invalid-email': return t.invalidEmail;
            case 'auth/weak-password': return t.weakPassword;
            case 'auth/email-already-in-use': return t.emailInUse;
            case 'auth/wrong-password':
            case 'auth/user-not-found':
            case 'auth/invalid-credential': return t.wrongCredentials;
            case 'auth/network-request-failed': return t.networkError;
            case 'auth/too-many-requests': return t.tooManyRequests;
            case 'auth/popup-closed-by-user': return t.popupClosed;
            case 'auth/cancelled-popup-request':
            case 'auth/popup-blocked': return t.popupClosed;
            default: return t.genericError;
        }
    }

    function persistSession(user) {
        if (!user) return;
        const previousUid = localStorage.getItem('quillAuthUid');
        const newUid = user.uid;
        localStorage.setItem('quillAuthUid', newUid);
        const name = user.displayName || (user.email ? user.email.split('@')[0] : '');
        localStorage.setItem('quillAuthName', name);
        if (previousUid && previousUid !== newUid) {
            const oldKey = 'geminiApiKey.' + previousUid;
            const newKey = 'geminiApiKey.' + newUid;
            const oldVal = localStorage.getItem(oldKey);
            if (oldVal && !localStorage.getItem(newKey)) {
                localStorage.setItem(newKey, oldVal);
            }
            localStorage.removeItem(oldKey);
        }
    }

    async function notifyServerSession(user) {
        try {
            const idToken = await user.getIdToken();
            const r = await fetch('/api/auth/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken, uid: user.uid }),
            });
            return r.ok;
        } catch (_) { return false; }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (inFlight) return;
        const lang = localStorage.getItem('uiLanguage') || 'english';
        const t = I18N[lang];
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const displayName = document.getElementById('displayName').value.trim();
        if (!email || !password) { showStatus(t.missingFields, 'error'); return; }
        if (mode === 'signup' && password.length < 6) { showStatus(t.weakPassword, 'error'); return; }
        clearStatus();
        setBusy(true);
        try {
            const fb = await loadFirebase();
            const auth = fb.auth();
            let cred;
            if (mode === 'signin') {
                cred = await auth.signInWithEmailAndPassword(email, password);
                showStatus(t.signInSuccess, 'success');
            } else {
                cred = await auth.createUserWithEmailAndPassword(email, password);
                if (displayName) {
                    try { await cred.user.updateProfile({ displayName }); } catch (_) {}
                }
                showStatus(t.signUpSuccess, 'success');
            }
            persistSession(cred.user);
            await notifyServerSession(cred.user);
            setTimeout(function() { 
                const params = new URLSearchParams(window.location.search);
                const dest = params.get('redirect') || '/';
                window.location.href = dest;
            }, 600);
        } catch (err) {
            const code = (err && err.code) || '';
            showStatus(mapAuthError(code), 'error');
            setBusy(false);
        }
    }

    async function handleGoogle() {
        if (inFlight) return;
        const lang = localStorage.getItem('uiLanguage') || 'english';
        const t = I18N[lang];
        clearStatus();
        setBusy(true);
        try {
            const fb = await loadFirebase();
            const auth = fb.auth();
            const provider = new fb.auth.GoogleAuthProvider();
            const cred = await auth.signInWithPopup(provider);
            persistSession(cred.user);
            showStatus(t.signInSuccess, 'success');
            await notifyServerSession(cred.user);
            setTimeout(function() { 
                const params = new URLSearchParams(window.location.search);
                const dest = params.get('redirect') || '/';
                window.location.href = dest;
            }, 600);
        } catch (err) {
            const code = (err && err.code) || '';
            showStatus(mapAuthError(code), 'error');
            setBusy(false);
        }
    }

    async function handleForgot(e) {
        if (e && e.preventDefault) e.preventDefault();
        if (inFlight) return;
        const lang = localStorage.getItem('uiLanguage') || 'english';
        const t = I18N[lang];
        const email = document.getElementById('email').value.trim();
        if (!email) { showStatus(t.resetEmailMissing, 'error'); return; }
        clearStatus();
        setBusy(true);
        try {
            const fb = await loadFirebase();
            const auth = fb.auth();
            await auth.sendPasswordResetEmail(email);
            showStatus(t.resetEmailSent(email), 'success');
        } catch (err) {
            const code = (err && err.code) || '';
            showStatus(mapAuthError(code), 'error');
        }
        setBusy(false);
    }

    document.addEventListener('DOMContentLoaded', function() {
        const savedLanguage = localStorage.getItem('uiLanguage') || 'english';
        window.setupAccountMenu();
        window.syncAuthPill();
        repaint(savedLanguage);
        setMode('signin');

        document.getElementById('tabSignIn').addEventListener('click', function() { if (!inFlight) setMode('signin'); });
        document.getElementById('tabSignUp').addEventListener('click', function() { if (!inFlight) setMode('signup'); });
        document.getElementById('switchMode').addEventListener('click', function(e) {
            e.preventDefault();
            if (!inFlight) setMode(mode === 'signin' ? 'signup' : 'signin');
        });
        document.getElementById('authForm').addEventListener('submit', handleSubmit);
        document.getElementById('googleBtn').addEventListener('click', handleGoogle);
        const forgotLink = document.getElementById('forgotLink');
        if (forgotLink) forgotLink.addEventListener('click', handleForgot);
    });
})();
`;

export function generateAuthPageHTML(locale: Locale = 'english'): string {
  const strings = AUTH_STRINGS[locale];
  return `<!DOCTYPE html>
<html lang="${locale}">
${renderHead({ title: strings.documentTitle, pageStyles: PAGE_CSS })}
<body>
${BODY_HTML}
<script>
window.__QUILL_I18N__ = ${JSON.stringify({ auth: AUTH_STRINGS, common: COMMON_STRINGS, footer: FOOTER_STRINGS })};
window.__QUILL_FIREBASE_CONFIG__ = ${JSON.stringify(FIREBASE_CONFIG)};
window.__QUILL_INITIAL_LOCALE__ = ${JSON.stringify(locale)};
window.__QUILL_TOPBAR__ = ${JSON.stringify({
  english: renderTopbar('login', 'english'),
  indonesian: renderTopbar('login', 'indonesian'),
})};
window.__QUILL_TOPBAR_STRINGS__ = ${JSON.stringify({
  english: getTopbarStrings('english'),
  indonesian: getTopbarStrings('indonesian'),
})};
</script>
<script>${COMMON_JS}</script>
<script>${SCRIPT}</script>
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
