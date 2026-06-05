// Main page (brief → generate) HTML generator for Quill.
// English strings are the default markup; the script reads the i18n table
// injected below and re-paints fields when the user changes language.

import { MAIN_STRINGS, COMMON_STRINGS, Locale } from './i18n';
import { renderHead, renderFooter, renderTopbar, getTopbarStrings, FOOTER_STRINGS, ARCHIVAL_DETAILS_HTML, COMMON_JS } from './styles';
import { SELECT_CSS, SELECT_SCRIPT } from './select';
import { SPECIMEN_JS } from './specimen';

const PAGE_CSS = `
${SELECT_CSS}
.hero {
    padding: 64px 0 48px;
    border-bottom: var(--rule);
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    column-gap: var(--gutter);
}
.hero .index {
    grid-column: 1 / span 2;
    font-size: 14px;
    font-weight: 700;
}
.hero .headline {
    grid-column: 3 / span 7;
}
.hero h1 {
    font-family: 'Inter', sans-serif;
    font-weight: 800;
    font-size: clamp(48px, 9vw, 128px);
    line-height: 0.95;
    letter-spacing: -0.04em;
    color: var(--black);
    margin: 0;
}
.hero h1 .amp { color: var(--accent); }
.hero .lede {
    grid-column: 10 / span 3;
    align-self: end;
    font-size: 13px;
    line-height: 1.5;
    color: var(--gray-600);
    border-top: var(--rule);
    padding-top: 12px;
}

/* Form layout */
.brief { padding-top: 32px; }
.section-label {
    padding: 14px 0;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    column-gap: var(--gutter);
    border-bottom: var(--rule);
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-weight: 600;
    align-items: center;
}
.section-label .num { grid-column: 1 / span 1; color: var(--accent); font-family: 'JetBrains Mono', monospace; }
.section-label .title { grid-column: 2 / span 8; }
.section-label .meta { grid-column: 10 / span 3; text-align: right; color: var(--gray-600); font-weight: 400; letter-spacing: 0.12em; }

.form-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    column-gap: var(--gutter);
    padding-bottom: 48px;
}
.form-group {
    padding: 16px 0;
    border-bottom: var(--rule-soft);
}
.form-group.col-12 { grid-column: 1 / span 12; }
.form-group.col-6 { grid-column: span 6; }
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
.form-group select,
.form-group textarea {
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
.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
    border-bottom: 2px solid var(--accent);
    padding-bottom: 7px;
}
.form-group textarea { height: 80px; resize: none; }
.form-group select {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' stroke='%23000' stroke-width='1.4' fill='none'/></svg>");
    background-repeat: no-repeat;
    background-position: right 0 center;
    padding-right: 24px;
}

/* Tag inputs */
.tag-input-wrapper { display: flex; gap: 8px; align-items: flex-end; }
.tag-add-btn {
    background: none; border: 1px solid var(--black);
    padding: 4px 10px; font-size: 14px; cursor: pointer;
    margin-bottom: 8px;
}
.tag-add-btn:hover { background: var(--black); color: var(--white); }
.tag-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; min-height: 24px; }
.tag-chip {
    background: var(--paper); border: 1px solid var(--gray-300);
    padding: 2px 8px; font-size: 11px; font-weight: 600;
    display: flex; align-items: center; gap: 6px;
}
.tag-chip .remove { cursor: pointer; color: var(--accent); font-weight: 800; }

/* Buttons */
.action-row {
    padding: 32px 0 64px;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    column-gap: var(--gutter);
    border-top: var(--rule);
}
.generate-btn {
    grid-column: 1 / span 6;
    background: var(--black); color: var(--white);
    border: 1px solid var(--black);
    padding: 24px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
}
.generate-btn:hover { background: var(--accent); border-color: var(--accent); }
.reset-btn {
    grid-column: 7 / span 6;
    background: var(--white); color: var(--black);
    border: 1px solid var(--black);
    padding: 24px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
}
.reset-btn:hover { background: var(--black); color: var(--white); }

/* Banner / Status */
.byok-banner {
    background: var(--paper);
    border: 1px solid var(--black);
    margin-top: 16px;
    display: none;
}
.byok-banner.show { display: block; }
.byok-banner-row { display: grid; grid-template-columns: 48px 1fr auto; align-items: center; }
.byok-banner-num {
    height: 100%; border-right: 1px solid var(--black);
    display: flex; align-items: center; justify-content: center;
    font-family: 'JetBrains Mono', monospace; font-weight: 700; color: var(--accent);
}
.byok-banner-body { padding: 16px 20px; }
.byok-banner-title { font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 4px; }
.byok-banner-msg { font-size: 13px; line-height: 1.5; color: var(--gray-600); }
.byok-banner-cta { padding: 0 24px; }
.byok-banner-link { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; color: var(--black); text-decoration: none; border-bottom: 1px solid var(--black); }
.byok-banner-link:hover { color: var(--accent); border-bottom-color: var(--accent); }

/* Loading */
.loading-overlay {
    position: fixed; inset: 0; background: rgba(255,255,255,0.92);
    z-index: 1000; display: none; align-items: center; justify-content: center;
    backdrop-filter: blur(4px);
}
.loading-overlay.show { display: flex; }
.loading-box { text-align: center; max-width: 300px; }
.spinner {
    width: 48px; height: 48px; border: 2px solid var(--gray-200);
    border-top-color: var(--accent); border-radius: 50%;
    animation: spin 0.8s linear infinite; margin: 0 auto 24px;
}
@keyframes spin { to { transform: rotate(360deg); } }
.loading-box .status { font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 8px; }
.loading-box .sub-status { font-size: 14px; color: var(--gray-600); }

/* Error Banner */
.error-banner {
    background: #fff0f0; border: 1px solid #c0392b;
    margin-bottom: 32px; display: none;
}
.error-banner.show { display: block; }
.error-row { display: grid; grid-template-columns: 48px 1fr; align-items: center; min-height: 48px; }
.error-row .num {
    height: 100%; border-right: 1px solid #c0392b;
    display: flex; align-items: center; justify-content: center;
    font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #c0392b;
}
.error-row .msg { padding: 12px 20px; font-size: 13px; font-weight: 600; color: #c0392b; }

/* Result */
.result-container { padding-bottom: 64px; }
.result-card { border: 1px solid var(--black); margin-bottom: 24px; }
.result-head {
    padding: 14px 20px; border-bottom: var(--rule);
    display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 16px;
    background: var(--paper);
}
.result-head .type-tag {
    font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700;
    padding: 2px 6px; border: 1px solid var(--black); text-transform: uppercase;
}
.result-head .title { font-weight: 700; font-size: 14px; letter-spacing: -0.01em; }
.result-head .meta { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--gray-600); text-align: right; }

.result-body { padding: 48px 64px; font-family: 'Inter', sans-serif; line-height: 1.75; font-size: 17px; color: var(--gray-900); }
.result-body h2 { font-size: 28px; font-weight: 800; letter-spacing: -0.03em; margin: 48px 0 24px; }
.result-body p { margin-bottom: 24px; }
.result-body blockquote {
    border-left: 3px solid var(--accent); padding-left: 24px; margin: 32px 0;
    font-style: italic; color: var(--gray-700);
}

.result-actions {
    padding: 16px 20px; border-top: var(--rule-soft);
    display: flex; gap: 12px; background: var(--white);
}
.action-btn {
    background: none; border: 1px solid var(--gray-300);
    padding: 8px 16px; font-size: 11px; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer;
    transition: border-color 0.1s, background 0.1s;
}
.action-btn:hover { border-color: var(--black); background: var(--black); color: var(--white); }
.action-btn.primary { background: var(--black); color: var(--white); border-color: var(--black); }
.action-btn.primary:hover { background: var(--accent); border-color: var(--accent); }

/* Final pieces: export blocks */
.export-block {
    border-top: var(--rule); padding: 32px 0;
    display: grid; grid-template-columns: repeat(12, 1fr); column-gap: var(--gutter);
}
.export-block .label {
    grid-column: 1 / span 3; font-size: 10px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase; padding-top: 12px;
}
.export-block .export-buttons {
    grid-column: 4 / span 9; display: flex; gap: 12px;
}

@media (max-width: 900px) {
    .hero { padding: 32px 0 24px; }
    .hero .index { display: none; }
    .hero .headline { grid-column: 1 / -1; }
    .hero h1 { font-size: 32px; }
    .hero .lede { grid-column: 1 / -1; padding-top: 12px; }
    
    .section-label .meta { display: none; }
    .form-group.col-6 { grid-column: 1 / span 12; }
    .action-row { padding-bottom: 32px; }
    .generate-btn, .reset-btn { grid-column: 1 / span 12; margin-bottom: 12px; }
    
    .result-body { padding: 32px 20px; font-size: 16px; }
    .export-block .label { grid-column: 1 / -1; margin-bottom: 8px; }
    .export-block .export-buttons { grid-column: 1 / -1; justify-content: flex-start; margin-top: 12px; }
}
`;

const SCRIPT = `
(function() {
    const I18N = window.__QUILL_I18N__.main;
    const COMMON = window.__QUILL_I18N__.common;
    const FOOTER = window.__QUILL_I18N__.footer;
    let results = [];

    function repaint(lang) {
        const t = I18N[lang];
        document.title = t.documentTitle;
        // Topbar
        const topbarEl = document.querySelector('.topbar');
        if (topbarEl) {
            const tmp = document.createElement('div');
            tmp.innerHTML = (window.__QUILL_TOPBAR__ && window.__QUILL_TOPBAR__[lang]) || topbarEl.outerHTML;
            topbarEl.replaceWith(tmp.firstElementChild);
            window.setupAccountMenu();
            window.syncAuthPill();
            window.syncByokStatus();
        }
        // Hero
        const heroTitle = document.getElementById('heroTitle');
        if (heroTitle) {
            heroTitle.innerHTML = t.title.replace(/\\./, '<span class="amp">.</span>');
        }
        const heroLede = document.getElementById('heroLede');
        if (heroLede) heroLede.textContent = t.lede;
        // Labels
        const briefTitle = document.getElementById('briefTitle');
        if (briefTitle) briefTitle.textContent = t.briefTitle;
        
        document.getElementById('topicLabel').innerHTML = t.labelTopic + ' <span class="req">*</span>';
        document.getElementById('topic').placeholder = t.placeholderTopic;
        document.getElementById('styleLabel').innerHTML = t.labelAuthorStyle + ' <span class="req">*</span>';
        document.getElementById('perspectiveLabel').innerHTML = t.labelPerspective + ' <span class="req">*</span>';
        document.getElementById('audienceLabel').innerHTML = t.labelAudience + ' <span class="req">*</span>';
        document.getElementById('formatLabel').innerHTML = t.labelFormat + ' <span class="req">*</span>';
        document.getElementById('tagsLabel').textContent = t.labelTags;
        document.getElementById('tagInput').placeholder = t.placeholderTags;
        document.getElementById('keywordsLabel').textContent = t.labelKeywords;
        document.getElementById('keywordInput').placeholder = t.placeholderKeywords;
        document.getElementById('constraintsLabel').textContent = t.labelConstraints;
        document.getElementById('constraints').placeholder = t.placeholderConstraints;
        document.getElementById('generateBtn').textContent = t.generateButton;
        document.getElementById('resetBtn').textContent = t.resetButton;
        document.getElementById('byokBannerTitle').textContent = t.byokBannerTitle;
        document.getElementById('byokBannerMsg').innerHTML = t.byokBannerMsg;
        document.getElementById('byokBannerLink').textContent = t.openSettingsCta;
        document.getElementById('loadingStatus').textContent = t.statusInitializing;
        
        if (window.rebuildAllSelects) window.rebuildAllSelects();

        // Repaint Footer
        const footerEl = document.querySelector('.footer');
        if (footerEl) {
            const footerStrings = FOOTER[lang];
            footerEl.querySelector('.col-1').innerHTML = footerStrings.copyright;
            footerEl.querySelector('.col-2').innerHTML = footerStrings.typeface;
            footerEl.querySelector('.col-3').innerHTML = footerStrings.by.replace('{link}', '<a href="https://azzar.netlify.app/porto" target="_blank">LilyOpenCMS</a>');
        }

        renderResults();
    }

    function showStatus(message, type) {
        const overlay = document.getElementById('loadingOverlay');
        const status = document.getElementById('loadingStatus');
        const subStatus = document.getElementById('loadingSubStatus');
        if (type === 'loading') {
            overlay.classList.add('show');
            status.textContent = message || 'Processing...';
            subStatus.textContent = 'Please wait...';
        } else {
            overlay.classList.remove('show');
        }
    }

    function showError(msg) {
        const banner = document.getElementById('errorBanner');
        const text = document.getElementById('errorMessageText');
        text.textContent = msg || 'An unexpected error occurred.';
        banner.classList.add('show');
        banner.scrollIntoView({ behavior: 'smooth' });
    }

    function clearError() {
        document.getElementById('errorBanner').classList.remove('show');
    }

    function renderResults() {
        const container = document.getElementById('resultContainer');
        const lang = localStorage.getItem('uiLanguage') || 'english';
        const t = I18N[lang];
        if (results.length === 0) { container.innerHTML = ''; return; }
        
        container.innerHTML = results.map((res, idx) => {
            return \`
                <div class="result-card" data-idx="\${idx}">
                    <div class="result-head">
                        <span class="type-tag">\${res.format || 'Article'}</span>
                        <div class="title">\${res.title || 'Untitled Piece'}</div>
                        <div class="meta">\${new Date().toLocaleTimeString()}</div>
                    </div>
                    <div class="result-body">\${res.html}</div>
                    <div class="result-actions">
                        <button class="action-btn primary" onclick="window.saveToWorkspace(\${idx})">\${t.actionSaveToWorkspace || 'Save to Workspace'}</button>
                        <button class="action-btn" onclick="window.exportRTF(\${idx})">Export RTF</button>
                    </div>
                </div>
            \`;
        }).join('');
    }

    window.saveToWorkspace = async function(idx) {
        const res = results[idx];
        const lang = localStorage.getItem('uiLanguage') || 'english';
        const t = I18N[lang];
        const uid = localStorage.getItem('quillAuthUid');
        if (!uid) {
            if (confirm('You must be signed in to save drafts. Go to Sign In?')) {
                window.location.href = '/login?redirect=/';
            }
            return;
        }
        try {
            const r = await fetch('/api/workspace/drafts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: res.title,
                    content: res.html,
                    type: res.format,
                    topic: res.topic
                })
            });
            if (r.ok) {
                alert(t.saveSuccess || 'Saved to Workspace.');
            } else {
                throw new Error('failed');
            }
        } catch (e) {
            alert(t.saveError || 'Failed to save.');
        }
    };

    window.exportRTF = function(idx) {
        const res = results[idx];
        const content = res.html.replace(/<[^>]+>/g, '\\n\\n');
        const blob = new Blob([content], { type: 'application/rtf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = (res.title || 'quill-piece') + '.rtf';
        a.click();
    };

    async function handleGenerate(e) {
        e.preventDefault();
        clearError();
        const lang = localStorage.getItem('uiLanguage') || 'english';
        const t = I18N[lang];
        const apiKey = (localStorage.getItem(localStorage.getItem('quillAuthUid') ? 'geminiApiKey.' + localStorage.getItem('quillAuthUid') : 'geminiApiKey') || '').trim();
        
        if (!apiKey) {
            showError(t.errorNoApiKey || 'Gemini API key is missing. Please add it in Settings.');
            return;
        }

        const form = e.target;
        const data = {
            topic: form.topic.value,
            authorStyle: form.authorStyle.value,
            perspective: form.perspective.value,
            audience: form.audience.value,
            format: form.format.value,
            constraints: form.constraints.value,
            tags: Array.from(document.querySelectorAll('#tagsContainer .tag-chip span:not(.remove)')).map(s => s.textContent),
            keywords: Array.from(document.querySelectorAll('#keywordsContainer .tag-chip span:not(.remove)')).map(s => s.textContent),
        };

        showStatus(t.statusGenerating || 'Generating...', 'loading');
        try {
            const r = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-User-API-Key': apiKey },
                body: JSON.stringify(data)
            });
            const res = await r.json();
            if (!r.ok) throw new Error(res.error || 'Synthesis failed');
            
            results.unshift({
                topic: data.topic,
                format: data.format,
                title: res.title,
                html: res.html
            });
            renderResults();
            document.getElementById('resultContainer').scrollIntoView({ behavior: 'smooth' });
        } catch (err) {
            showError(err.message);
        } finally {
            showStatus(null);
        }
    }

    function setupTagSystem(inputId, containerId, arr, btnId) {
        const input = document.getElementById(inputId);
        const container = document.getElementById(containerId);
        const btn = document.getElementById(btnId);
        
        function add(val) {
            const v = val.trim();
            if (!v || arr.includes(v)) return;
            arr.push(v);
            const chip = document.createElement('div');
            chip.className = 'tag-chip';
            chip.innerHTML = '<span>' + v + '</span><span class="remove">&times;</span>';
            chip.querySelector('.remove').onclick = () => {
                arr.splice(arr.indexOf(v), 1);
                chip.remove();
            };
            container.appendChild(chip);
            input.value = '';
        }
        
        input.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); add(input.value); } };
        btn.onclick = () => add(input.value);
    }

    document.addEventListener('DOMContentLoaded', function() {
        const savedLanguage = localStorage.getItem('uiLanguage') || 'english';
        window.setupAccountMenu();
        window.syncAuthPill();
        window.syncByokStatus();
        repaint(savedLanguage);

        setupTagSystem('tagInput', 'tagsContainer', [], 'addTagBtn');
        setupTagSystem('keywordInput', 'keywordsContainer', [], 'addKeywordBtn');

        document.getElementById('generatorForm').onsubmit = handleGenerate;
        document.getElementById('resetBtn').onclick = () => {
            if (confirm('Reset all fields?')) {
                document.getElementById('generatorForm').reset();
                document.getElementById('tagsContainer').innerHTML = '';
                document.getElementById('keywordsContainer').innerHTML = '';
                results = [];
                renderResults();
            }
        };
    });

    window.addEventListener('storage', (e) => {
        if (e.key === 'uiLanguage') repaint(e.newValue || 'english');
        if (e.key === 'quillAuthUid' || e.key === 'quillAuthName') window.syncAuthPill();
        if (e.key.indexOf('geminiApiKey') === 0) window.syncByokStatus();
    });
})();
`;

export function generateMainPageHTML(locale: Locale = 'english'): string {
  const strings = MAIN_STRINGS[locale];
  const footerStrings = FOOTER_STRINGS[locale];
  const topbarHtml = renderTopbar('generator', locale);
  const footerHtml = renderFooter(footerStrings);

  return `<!DOCTYPE html>
<html lang="${locale}">
${renderHead({ title: strings.documentTitle, pageStyles: PAGE_CSS })}
<body>
<div class="container">
    ${topbarHtml}

    <div class="byok-banner" id="byokBanner">
        <div class="byok-banner-row">
            <div class="byok-banner-num">!</div>
            <div class="byok-banner-body">
                <div class="byok-banner-title" id="byokBannerTitle">${strings.byokBannerTitle}</div>
                <div class="byok-banner-msg" id="byokBannerMsg">${strings.byokBannerMsg}</div>
            </div>
            <div class="byok-banner-cta">
                <a href="/settings" class="byok-banner-link" id="byokBannerLink">${strings.openSettingsCta}</a>
            </div>
        </div>
    </div>

    <header class="hero">
        <div class="index">№ 01</div>
        <div class="headline">
            <h1 id="heroTitle">${strings.title.replace(/\./, '<span class="amp">.</span>')}</h1>
        </div>
        <p class="lede" id="heroLede">${strings.lede}</p>
    </header>

    <main class="brief">
        <div class="section-label">
            <div class="num">02</div>
            <div class="title" id="briefTitle">${strings.briefTitle}</div>
            <div class="meta" id="briefMeta">INPUT / PARAMETERS</div>
        </div>

        <form id="generatorForm">
            <div class="form-grid">
                <!-- Row 1: Topic -->
                <div class="form-group col-12">
                    <label for="topic" id="topicLabel">${strings.labelTopic} <span class="req">*</span></label>
                    <input type="text" id="topic" name="topic" placeholder="${strings.placeholderTopic}" required autocomplete="off">
                </div>

                <!-- Row 2: Style + Perspective -->
                <div class="form-group col-6">
                    <label for="authorStyle" id="styleLabel">${strings.labelAuthorStyle} <span class="req">*</span></label>
                    <select id="authorStyle" name="authorStyle" required>
                        <option value="journalistic">Journalistic (The New Yorker)</option>
                        <option value="academic">Academic (The Economist)</option>
                        <option value="minimalist">Minimalist (Ernest Hemingway)</option>
                        <option value="gonzo">Gonzo (Hunter S. Thompson)</option>
                        <option value="technical">Technical (Scientific American)</option>
                        <option value="noir">Neo-Noir (Raymond Chandler)</option>
                    </select>
                </div>
                <div class="form-group col-6">
                    <label for="perspective" id="perspectiveLabel">${strings.labelPerspective} <span class="req">*</span></label>
                    <select id="perspective" name="perspective" required>
                        <option value="first">First Person (I/Me)</option>
                        <option value="third">Third Person (Objective)</option>
                        <option value="editorial">Editorial (The "We")</option>
                    </select>
                </div>

                <!-- Row 3: Audience + Format -->
                <div class="form-group col-6">
                    <label for="audience" id="audienceLabel">${strings.labelAudience} <span class="req">*</span></label>
                    <select id="audience" name="audience" required>
                        <option value="general">General Public</option>
                        <option value="expert">Subject Matter Experts</option>
                        <option value="skeptical">Skeptical / Opposing Viewpoints</option>
                        <option value="student">Educational / Students</option>
                    </select>
                </div>
                <div class="form-group col-6">
                    <label for="format" id="formatLabel">${strings.labelFormat} <span class="req">*</span></label>
                    <select id="format" name="format" required>
                        <option value="article">Standard Article</option>
                        <option value="shortstory">Short Story</option>
                        <option value="news">News Report</option>
                        <option value="shortnews">Short News</option>
                        <option value="novel">Novel Chapter</option>
                    </select>
                </div>

                <!-- Row 4: Tags + Keywords -->
                <div class="form-group col-6">
                    <label id="tagsLabel">${strings.labelTags}</label>
                    <div class="tag-input-wrapper">
                        <input type="text" id="tagInput" placeholder="${strings.placeholderTags}">
                        <button type="button" id="addTagBtn" class="tag-add-btn">+</button>
                    </div>
                    <div id="tagsContainer" class="tag-list"></div>
                </div>
                <div class="form-group col-6">
                    <label id="keywordsLabel">${strings.labelKeywords}</label>
                    <div class="tag-input-wrapper">
                        <input type="text" id="keywordInput" placeholder="${strings.placeholderKeywords}">
                        <button type="button" id="addKeywordBtn" class="tag-add-btn">+</button>
                    </div>
                    <div id="keywordsContainer" class="tag-list"></div>
                </div>

                <!-- Row 5: Constraints -->
                <div class="form-group col-12">
                    <label for="constraints" id="constraintsLabel">${strings.labelConstraints}</label>
                    <textarea id="constraints" name="constraints" placeholder="${strings.placeholderConstraints}"></textarea>
                </div>
            </div>

            <div class="action-row">
                <button type="submit" id="generateBtn" class="generate-btn">${strings.generateButton}</button>
                <button type="button" id="resetBtn" class="reset-btn">${strings.resetButton}</button>
            </div>
        </form>
    </main>

    <div class="loading-overlay" id="loadingOverlay">
        <div class="loading-box">
            <div class="spinner"></div>
            <div class="status" id="loadingStatus">${strings.statusInitializing}</div>
            <div class="sub-status" id="loadingSubStatus">Preparing neural synthesis...</div>
        </div>
    </div>

    <div class="error-banner" id="errorBanner">
        <div class="error-row">
            <div class="num">!</div>
            <div class="msg" id="errorMessageText"></div>
        </div>
    </div>

    <div class="result-container" id="resultContainer"></div>

    ${footerHtml}
</div>

${ARCHIVAL_DETAILS_HTML}


<div class="modal-overlay" id="confirmationModal">
    <div class="modal-content">
        <div class="modal-head">
            <span class="lab" id="modalLab">CONFIRM</span>
            <span id="modalEscClose">ESC TO CLOSE</span>
        </div>
        <div class="modal-body">
            <h3 class="modal-title" id="modalTitle">Reset All Data</h3>
            <p class="modal-message" id="modalMessage">Are you sure you want to reset all data?</p>
            <div class="modal-extra" id="modalExtra" style="display: none;"></div>
        </div>
        <div class="modal-actions">
            <button class="modal-btn modal-btn-cancel" id="modalCancel">Cancel</button>
            <button class="modal-btn modal-btn-confirm" id="modalConfirm">Confirm</button>
        </div>
    </div>
</div>

<script>
window.__QUILL_I18N__ = ${JSON.stringify({ main: MAIN_STRINGS, common: COMMON_STRINGS, footer: FOOTER_STRINGS })};
window.__QUILL_INITIAL_LOCALE__ = ${JSON.stringify(locale)};
window.__QUILL_TOPBAR__ = ${JSON.stringify({
  english: renderTopbar('generator', 'english'),
  indonesian: renderTopbar('generator', 'indonesian'),
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
