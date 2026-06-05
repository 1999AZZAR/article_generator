import { ABOUT_STRINGS, COMMON_STRINGS, Locale } from './i18n';
import { renderHead, renderFooter, renderTopbar, getTopbarStrings, FOOTER_STRINGS, ARCHIVAL_DETAILS_HTML, COMMON_JS } from './styles';
import { SPECIMEN_JS } from './specimen';

const PAGE_CSS = `
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

.about-content {
    padding-bottom: 64px;
}

.about-section {
    padding: 48px 0;
    border-bottom: var(--rule);
}

.about-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    column-gap: var(--gutter);
}

.about-sidebar {
    grid-column: 1 / 4;
}
.about-sidebar .num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    color: var(--accent);
    margin-bottom: 8px;
}
.about-sidebar .title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
}
.about-sidebar .meta {
    font-size: 10px;
    color: var(--gray-400);
    margin-top: 12px;
}

.about-main {
    grid-column: 4 / 11;
}
.about-main h2 {
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 24px;
    letter-spacing: -0.01em;
}
.about-main p {
    font-size: 16px;
    line-height: 1.6;
    margin: 0 0 1.5em;
    color: #333;
}

@media (max-width: 900px) {
    .about-hero .index, .about-sidebar { display: none; }
    .about-hero .headline, .about-hero .lede, .about-main { grid-column: 1 / -1; }
    .about-hero h1 { font-size: 36px; }
}
`;

const BODY_HTML = `
<div class="container">
    ${renderTopbar('about', 'english')}

    <header class="hero">
        <div class="index">№ 03</div>
        <div class="headline">
            <h1 id="heroTitle">About<span class="amp">.</span></h1>
        </div>
        <p class="lede" id="heroLede">An editorial writing instrument for the neural era. High-fidelity author style mimicry meeting Swiss typographic precision.</p>
    </header>

    <main class="about-content">
        <section class="about-section">
            <div class="about-grid">
                <div class="about-sidebar">
                    <div class="num" id="section01Num">01</div>
                    <div class="title" id="section01Title">Vision</div>
                    <div class="meta" id="section01Meta">EDITORIAL / INSTRUMENT</div>
                </div>
                <div class="about-main">
                    <h2 id="visionTitle">Editorial Precision</h2>
                    <p id="visionBody">Quill is designed as a focused instrument for writers, editors, and journalists. We prioritize the structural integrity of long-form content over transient chat interactions.</p>
                </div>
            </div>
        </section>

        <section class="about-section">
            <div class="about-grid">
                <div class="about-sidebar">
                    <div class="num" id="section02Num">02</div>
                    <div class="title" id="section02Title">Technology</div>
                    <div class="meta" id="section02Meta">GEMINI / RECURSIVE</div>
                </div>
                <div class="about-main">
                    <h2 id="techTitle">Neural Synthesis</h2>
                    <p id="techBody">Powered by the Google Gemini family of models, Quill utilizes recursive synthesis to generate coherent articles that maintain narrative tension and logical flow.</p>
                </div>
            </div>
        </section>

        <section class="about-section">
            <div class="about-grid">
                <div class="about-sidebar">
                    <div class="num" id="section03Num">03</div>
                    <div class="title" id="section03Title">Style Engine</div>
                    <div class="meta" id="section03Meta">LITERARY / ANALYTIC</div>
                </div>
                <div class="about-main">
                    <h2 id="authorsTitle">The Style System</h2>
                    <p id="authorsBody">Our curated style engine enables the creation of content that echoes the cadence, vocabulary, and ideological leanings of history's most significant authors.</p>
                    
                    <h2 id="byokTitle">Privacy & Sovereignty</h2>
                    <p id="byokBody">Quill is BYOK (Bring Your Own Key). We do not persist your Gemini API key on our servers; your intelligence remains your own, stored only in your local browser environment.</p>
                </div>
            </div>
        </section>
    </main>

    ${renderFooter(FOOTER_STRINGS['english'])}
</div>

${ARCHIVAL_DETAILS_HTML}
`;

const SCRIPT = `
(function() {
    const I18N = window.__QUILL_I18N__.about;

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

        const heroTitle = document.getElementById('heroTitle');
        if (heroTitle) {
            heroTitle.innerHTML = t.title.replace(/\\./, '<span class="amp">.</span>');
        }
        document.getElementById('heroLede').textContent = t.lede;

        document.getElementById('visionTitle').textContent = t.visionTitle;
        document.getElementById('visionBody').textContent = t.visionBody;
        document.getElementById('techTitle').textContent = t.techTitle;
        document.getElementById('techBody').textContent = t.techBody;
        document.getElementById('authorsTitle').textContent = t.authorsTitle;
        document.getElementById('authorsBody').textContent = t.authorsBody;
        document.getElementById('byokTitle').textContent = t.byokTitle;
        document.getElementById('byokBody').textContent = t.byokBody;

        document.getElementById('section01Num').textContent = t.section01Number;
        document.getElementById('section01Title').textContent = t.section01Title;
        document.getElementById('section01Meta').textContent = t.section01Meta;
        document.getElementById('section02Num').textContent = t.section02Number;
        document.getElementById('section02Title').textContent = t.section02Title;
        document.getElementById('section02Meta').textContent = t.section02Meta;
        document.getElementById('section03Num').textContent = t.section03Number;
        document.getElementById('section03Title').textContent = t.section03Title;
        document.getElementById('section03Meta').textContent = t.section03Meta;

        if (window.rebuildAllSelects) window.rebuildAllSelects();
    }

    document.addEventListener('DOMContentLoaded', function() {
        const lang = localStorage.getItem('uiLanguage') || 'english';
        window.setupAccountMenu();
        window.syncAuthPill();
        repaint(lang);

        window.addEventListener('storage', function(e) {
            if (e.key === 'uiLanguage') repaint(e.newValue || 'english');
            if (e.key === 'quillAuthUid' || e.key === 'quillAuthName') window.syncAuthPill();
        });
    });
})();
`;

export function generateAboutPageHTML(locale: Locale = 'english'): string {
  const strings = ABOUT_STRINGS[locale];
  return `<!DOCTYPE html>
<html lang="${locale}">
${renderHead({ title: strings.documentTitle, pageStyles: PAGE_CSS })}
<body>
${BODY_HTML}
<script>
window.__QUILL_I18N__ = ${JSON.stringify({ about: ABOUT_STRINGS, common: COMMON_STRINGS, footer: FOOTER_STRINGS })};
window.__QUILL_INITIAL_LOCALE__ = ${JSON.stringify(locale)};
window.__QUILL_TOPBAR__ = ${JSON.stringify({
  english: renderTopbar('about', 'english'),
  indonesian: renderTopbar('about', 'indonesian'),
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
