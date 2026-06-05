// About page (philosophy + tech) HTML generator for Quill.
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

.about-content { padding-top: 32px; }
.about-section { border-bottom: var(--rule-soft); padding: 48px 0; }
.about-section:last-child { border-bottom: none; }

.about-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    column-gap: var(--gutter);
}
.about-sidebar {
    grid-column: 1 / span 3;
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-weight: 600;
}
.about-sidebar .num { color: var(--accent); font-family: 'JetBrains Mono', monospace; margin-bottom: 8px; }
.about-sidebar .meta { color: var(--gray-600); font-weight: 400; margin-top: 8px; }

.about-main { grid-column: 5 / span 8; }
.about-main h2 {
    font-size: 32px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0 0 24px 0;
}
.about-main p {
    font-size: 18px;
    line-height: 1.6;
    color: var(--gray-800);
    margin-bottom: 32px;
}

@media (max-width: 900px) {
    .hero { padding: 32px 0 24px; }
    .hero .index { display: none; }
    .hero .headline { grid-column: 1 / -1; }
    .hero h1 { font-size: 32px; }
    .hero .lede { grid-column: 1 / -1; padding-top: 12px; }
    
    .about-sidebar { grid-column: 1 / -1; margin-bottom: 16px; }
    .about-main { grid-column: 1 / -1; }
    .about-main h2 { font-size: 24px; }
    .about-main p { font-size: 16px; }
}
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

        // Repaint Footer
        const footerEl = document.querySelector('.footer');
        if (footerEl) {
            const footerStrings = window.__QUILL_I18N__.footer[lang];
            footerEl.querySelector('.col-1').innerHTML = footerStrings.copyright;
            footerEl.querySelector('.col-2').innerHTML = footerStrings.typeface;
            footerEl.querySelector('.col-3').innerHTML = footerStrings.by.replace('{link}', '<a href="https://azzar.netlify.app/porto" target="_blank">LilyOpenCMS</a>');
        }
    }

    window.addEventListener('storage', function(e) {
        if (e.key === 'uiLanguage') repaint(e.newValue || 'english');
        if (e.key === 'quillAuthUid' || e.key === 'quillAuthName') window.syncAuthPill();
        if (e.key.indexOf('geminiApiKey') === 0) window.syncByokStatus();
    });

    document.addEventListener('DOMContentLoaded', function() {
        window.setupAccountMenu();
        window.syncAuthPill();
        window.syncByokStatus();
        repaint(localStorage.getItem('uiLanguage') || 'english');
    });
})();
`;

export function generateAboutPageHTML(locale: Locale = 'english'): string {
  const strings = ABOUT_STRINGS[locale];
  const footerStrings = FOOTER_STRINGS[locale];
  const topbarHtml = renderTopbar('about', locale);
  const footerHtml = renderFooter(footerStrings);

  return `<!DOCTYPE html>
<html lang="${locale}">
${renderHead({ title: strings.documentTitle, pageStyles: PAGE_CSS })}
<body>
<div class="container">
    ${topbarHtml}

    <header class="hero">
        <div class="index">№ 03</div>
        <div class="headline">
            <h1 id="heroTitle">${strings.title.replace(/\./, '<span class="amp">.</span>')}</h1>
        </div>
        <p class="lede" id="heroLede">${strings.lede}</p>
    </header>

    <main class="about-content">
        <section class="about-section">
            <div class="about-grid">
                <div class="about-sidebar">
                    <div class="num" id="section01Num">${strings.section01Number}</div>
                    <div class="title" id="section01Title">${strings.section01Title}</div>
                    <div class="meta" id="section01Meta">${strings.section01Meta}</div>
                </div>
                <div class="about-main">
                    <h2 id="visionTitle">${strings.visionTitle}</h2>
                    <p id="visionBody">${strings.visionBody}</p>
                </div>
            </div>
        </section>

        <section class="about-section">
            <div class="about-grid">
                <div class="about-sidebar">
                    <div class="num" id="section02Num">${strings.section02Number}</div>
                    <div class="title" id="section02Title">${strings.section02Title}</div>
                    <div class="meta" id="section02Meta">${strings.section02Meta}</div>
                </div>
                <div class="about-main">
                    <h2 id="techTitle">${strings.techTitle}</h2>
                    <p id="techBody">${strings.techBody}</p>
                </div>
            </div>
        </section>

        <section class="about-section">
            <div class="about-grid">
                <div class="about-sidebar">
                    <div class="num" id="section03Num">${strings.section03Number}</div>
                    <div class="title" id="section03Title">${strings.section03Title}</div>
                    <div class="meta" id="section03Meta">${strings.section03Meta}</div>
                </div>
                <div class="about-main">
                    <h2 id="authorsTitle">${strings.authorsTitle}</h2>
                    <p id="authorsBody">${strings.authorsBody}</p>
                    
                    <h2 id="byokTitle">${strings.byokTitle}</h2>
                    <p id="byokBody">${strings.byokBody}</p>
                </div>
            </div>
        </section>
    </main>

    ${footerHtml}
</div>

${ARCHIVAL_DETAILS_HTML}

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
