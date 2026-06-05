// Main page (brief → generate) HTML generator for Quill.
// English strings are the default markup; the script reads the i18n table
// injected below and re-paints fields when the user changes language.

import { MAIN_STRINGS, Locale } from './i18n';
import { renderHead, renderFooter, renderTopbar, getTopbarStrings, FOOTER_STRINGS, ARCHIVAL_DETAILS_HTML } from './styles';
import { SELECT_CSS, SELECT_SCRIPT } from './select';
import { SPECIMEN_JS } from './specimen';

const PAGE_CSS = `
${SELECT_CSS}
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
.optgroup-label { font-weight: 600; font-style: normal; color: var(--gray-600); }

/* ========== FORM CONTROLS ========== */
.form-group label { display: block; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; margin-bottom: 8px; color: var(--black); }
.form-group label .req { color: var(--accent); font-weight: 700; }
.form-group input[type="text"],
.form-group input[type="number"],
.form-group textarea,
.form-group select {
    width: 100%; box-sizing: border-box;
    border: none; border-bottom: 1px solid var(--black);
    background: var(--white);
    padding: 6px 0 8px 0;
    font-family: 'Inter', sans-serif; font-size: 14px; color: var(--black);
    border-radius: 0; outline: none;
    transition: border-color 120ms linear;
}
.form-group textarea { resize: vertical; min-height: 64px; line-height: 1.5; }
.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus { border-color: var(--accent); }
.form-group input::placeholder,
.form-group textarea::placeholder { color: var(--gray-600); }
.form-group select {
    -webkit-appearance: none; appearance: none; -moz-appearance: none;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' stroke='%23000' stroke-width='1.4' fill='none'/></svg>");
    background-repeat: no-repeat; background-position: right 2px center;
    padding-right: 24px; cursor: pointer;
}
.form-group select:invalid,
.form-group select.placeholder-shown { color: var(--gray-600); }
.form-group optgroup { font-style: normal; font-weight: 600; color: var(--gray-600); }

.tag-row { display: grid; grid-template-columns: 1fr auto; column-gap: 8px; align-items: end; }
.tag-input { display: flex; flex-wrap: wrap; gap: 6px; padding-top: 6px; }
.tag-input:empty::before { content: attr(data-empty); color: var(--gray-600); font-size: 14px; }
.chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 8px 4px 10px;
    border: 1px solid var(--black);
    font-size: 12px; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase;
}
.chip .x { cursor: pointer; color: var(--accent); font-weight: 700; line-height: 1; }

.add-btn {
    border: 1px solid var(--black); background: var(--white); color: var(--black);
    padding: 8px 14px;
    font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    cursor: pointer; border-radius: 0;
}
.add-btn:hover { background: var(--black); color: var(--white); }

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
    background: var(--black); color: var(--white);
    border: 1px solid var(--black);
    padding: 18px 24px;
    font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase;
    cursor: pointer; border-radius: 0;
    transition: background 120ms linear, color 120ms linear;
    display: flex; align-items: center; justify-content: space-between;
}
.action-row .generate-btn:hover { background: var(--accent); border-color: var(--accent); }
.action-row .generate-btn:disabled { background: var(--gray-300); border-color: var(--gray-300); color: var(--gray-600); cursor: not-allowed; }
.action-row .generate-btn .arrow { font-family: 'JetBrains Mono', monospace; font-weight: 400; }
.action-row .reset-btn {
    grid-column: 9 / span 4;
    background: var(--white); color: var(--black);
    border: 1px solid var(--black);
    padding: 18px 24px;
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600;
    letter-spacing: 0.18em; text-transform: uppercase;
    cursor: pointer; border-radius: 0;
}
.action-row .reset-btn:hover { background: var(--black); color: var(--white); }
.action-row .reset-btn.hidden { display: none; }

.status-bar { padding: 0; border-bottom: var(--rule); display: none; }
.status-bar.show { display: block; }
.status-bar .progress { height: 2px; width: 100%; background: var(--gray-100); position: relative; overflow: hidden; }
.status-bar .progress::after {
    content: ''; position: absolute; top: 0; left: 0; height: 100%; width: 30%; background: var(--accent);
    animation: slide 1.6s linear infinite;
}
@keyframes slide { 0% { left: -30%; } 100% { left: 100%; } }
.status-bar .row { display: grid; grid-template-columns: repeat(12, 1fr); column-gap: var(--gutter); padding: 14px 0; }
.status-bar .row .lab { grid-column: 1 / span 2; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--gray-600); }
.status-bar .row .msg { grid-column: 3 / span 10; font-size: 14px; font-weight: 500; }

.error-bar { padding: 14px 0; border-bottom: var(--rule); background: var(--white); color: var(--accent); display: none; }
.error-bar.show { display: block; }
.error-bar .row { display: grid; grid-template-columns: repeat(12, 1fr); column-gap: var(--gutter); align-items: center; }
.error-bar .lab { grid-column: 1 / span 2; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 700; }
.error-bar .msg { grid-column: 3 / span 10; font-size: 14px; font-weight: 500; }

.result-container { display: none; }
.result-container.show { display: block; }
.result-block { padding: 0; border-bottom: var(--rule); }
.result-head {
    padding: 14px 0;
    display: grid; grid-template-columns: repeat(12, 1fr); column-gap: var(--gutter); align-items: center;
    font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600;
}
.result-head .num { grid-column: 1 / span 1; color: var(--accent); font-family: 'JetBrains Mono', monospace; }
.result-head .title { grid-column: 2 / span 8; font-size: 18px; font-weight: 700; letter-spacing: -0.01em; text-transform: none; }
.result-head .meta { grid-column: 10 / span 3; text-align: right; color: var(--gray-600); font-weight: 400; letter-spacing: 0.12em; }
.tag-row-result { padding: 0 0 24px 0; }
.tag-row-result .tag-input { padding-top: 0; }

.option-grid { display: grid; grid-template-columns: repeat(12, 1fr); column-gap: var(--gutter); row-gap: 0; padding: 0 0 32px 0; }
.option-card {
    grid-column: span 4; border: 1px solid var(--black); padding: 16px; cursor: pointer;
    background: var(--white); border-radius: 0;
    display: flex; flex-direction: column; gap: 8px; min-height: 96px;
}
.option-card:hover { background: var(--gray-100); }
.option-card:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
.option-card.selected { background: var(--black); color: var(--white); }
.option-card.selected:hover { background: var(--black); }
.option-card.selected .option-tag { color: var(--accent); }
.option-tag { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 700; color: var(--gray-600); }
.option-text { font-size: 16px; line-height: 1.3; font-weight: 500; }

.content-display {
    grid-column: 1 / span 12; padding: 0 0 32px 0;
    font-family: 'Inter', sans-serif; font-size: 16px; line-height: 1.6;
    white-space: pre-wrap; color: var(--black);
}

.export-block { padding: 0; border-bottom: var(--rule); }
.export-block .export-row { display: grid; grid-template-columns: repeat(12, 1fr); column-gap: var(--gutter); padding: 24px 0; align-items: end; }
.export-block .export-select-group { grid-column: 1 / span 6; }
.export-block .export-buttons { grid-column: 7 / span 6; display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
.export-block label { display: block; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; margin-bottom: 8px; }
.export-select {
    width: 100%; border: none; border-bottom: 1px solid var(--black); background: transparent;
    padding: 6px 0 8px 0;
    font-family: 'Inter', sans-serif; font-size: 14px; color: var(--black);
    border-radius: 0; -webkit-appearance: none; appearance: none;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' stroke='%23000' stroke-width='1.4' fill='none'/></svg>");
    background-repeat: no-repeat; background-position: right 0 center; padding-right: 24px;
    outline: none;
    cursor: pointer;
}
.export-select:hover { border-bottom-color: var(--accent); }
.export-select:focus { border-bottom: 2px solid var(--accent); padding-bottom: 7px; }
.export-btn {
    border: 1px solid var(--black); background: var(--white); color: var(--black);
    padding: 12px 16px;
    font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: 0.16em; text-transform: uppercase;
    cursor: pointer; border-radius: 0;
    display: inline-flex; align-items: center; gap: 8px;
}
.export-btn:hover { background: var(--black); color: var(--white); }
.export-btn:disabled { background: var(--gray-100); border-color: var(--gray-300); color: var(--gray-600); cursor: not-allowed; }

.chapter-outline { padding: 0 0 32px 0; }
.chapter-item { border-top: var(--rule-soft); padding: 0; }
.chapter-item:last-child { border-bottom: var(--rule-soft); }
.chapter-header { display: grid; grid-template-columns: 80px 1fr 40px; column-gap: 16px; padding: 16px 0; align-items: center; cursor: pointer; }
.chapter-header:hover { background: var(--gray-100); }
.chapter-num { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--accent); font-weight: 500; }
.chapter-titles .ch-title { font-size: 18px; font-weight: 700; letter-spacing: -0.01em; }
.chapter-titles .ch-sub { font-size: 13px; color: var(--gray-600); }
.chapter-toggle { text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--black); }
.chapter-content-section { display: none; padding: 0 0 24px 96px; }
.chapter-content-section.expanded { display: block; }
.chapter-actions { display: flex; gap: 8px; margin: 8px 0 16px 0; flex-wrap: wrap; }
.generate-chapter-btn, .export-chapter-btn {
    border: 1px solid var(--black); background: var(--white); color: var(--black);
    padding: 10px 14px;
    font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700;
    letter-spacing: 0.16em; text-transform: uppercase;
    cursor: pointer; border-radius: 0;
}
.generate-chapter-btn:hover, .export-chapter-btn:hover { background: var(--black); color: var(--white); }
.generate-chapter-btn:disabled { background: var(--gray-100); border-color: var(--gray-300); color: var(--gray-600); cursor: not-allowed; }
.export-chapter-buttons { display: inline-flex; gap: 6px; }
.chapter-loading { padding: 8px 0; display: flex; align-items: center; gap: 12px; }
.chapter-loading .bar { flex: 1; height: 2px; background: var(--gray-100); position: relative; overflow: hidden; }
.chapter-loading .bar::after {
    content: ''; position: absolute; top: 0; left: 0; height: 100%; width: 30%; background: var(--accent);
    animation: slide 1.6s linear infinite;
}
.chapter-loading .lab { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600; }
.chapter-content { font-family: 'Inter', sans-serif; font-size: 15px; line-height: 1.6; border-left: 2px solid var(--black); padding: 0 0 0 16px; }

@media (max-width: 900px) {
    .section-label .title { grid-column: 2 / -1; }
    .section-label .meta { display: none; }
    .form-group { grid-column: 1 / -1; }
    .form-group.third { grid-column: 1 / -1; }
    .action-row .generate-btn, .action-row .reset-btn { grid-column: 1 / -1; }
    .option-card { grid-column: 1 / -1; }
    .export-block .export-select-group { grid-column: 1 / -1; }
    .export-block .export-buttons { grid-column: 1 / -1; justify-content: flex-start; margin-top: 12px; }
    .chapter-content-section { padding-left: 16px; }
}
`;

// Pre-built static HTML body content. The script below mutates the DOM using
// the i18n table that's embedded as a JSON blob.
const BODY_HTML = `
<div class="container">
    ${renderTopbar('generator', 'english')}

    <div class="byok-banner" id="byokBanner">
        <div class="byok-banner-row">
            <div class="byok-banner-num">!</div>
            <div class="byok-banner-body">
                <div class="byok-banner-title" id="byokBannerTitle">Bring Your Own Key</div>
                <div class="byok-banner-msg" id="byokBannerMsg">Quill is BYOK &mdash; Bring Your Own Key. Add your Gemini API key in Settings to start generating. The key is stored only in this browser and sent per-request via the <code>X-User-API-Key</code> header. The server never persists it.</div>
            </div>
            <div class="byok-banner-cta">
                <a href="/settings" class="byok-banner-link" id="byokBannerLink">OPEN SETTINGS &rarr;</a>
            </div>
        </div>
    </div>

    <header class="hero">
        <div class="index">&#8470; 01</div>
        <div class="headline">
            <h1 id="heroTitle">Quill<span class="amp">.</span></h1>
        </div>
        <p class="lede" id="heroLede">An editorial writing instrument powered by AI. Long-form articles, short stories, news briefs and novel outlines &mdash; drafted with author-style precision.</p>
    </header>

    <div class="section-label">
        <div class="num">02</div>
        <div class="title" id="briefTitle">Brief &mdash; Generator</div>
        <div class="meta" id="briefMeta">FIELDS 01 / 09</div>
    </div>

    <form class="generator" id="articleForm" autocomplete="off">
    <div class="form-grid">
        <div class="form-group full">
            <label for="topic"><span id="topicLabel">Topic</span> <span class="req">*</span></label>
            <input type="text" id="topic" name="topic" required placeholder="e.g. The architecture of memory, monsoon economies">
        </div>

        <div class="form-group half">
            <label for="authorStyle"><span id="authorStyleLabel">Author Style</span> <span class="req">*</span></label>
            <select id="authorStyle" name="authorStyle" required>
                <option value="" id="authorStylePlaceholder">Select an author</option>
                <optgroup label="Classic &amp; Literary">
                    <option value="Ernest Hemingway">Ernest Hemingway</option>
                    <option value="Jane Austen">Jane Austen</option>
                    <option value="Toni Morrison">Toni Morrison</option>
                    <option value="Agatha Christie">Agatha Christie</option>
                    <option value="Gabriel Garc&#237;a M&#225;rquez">Gabriel Garc&#237;a M&#225;rquez</option>
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
                    <option value="custom" id="authorStyleCustom">Custom (enter below)</option>
                </optgroup>
            </select>
            <input type="text" class="custom-field" id="customAuthorStyle" name="customAuthorStyle" placeholder="Enter custom author name" style="display: none;">
        </div>

        <div class="form-group half">
            <label for="type"><span id="typeLabel">Type</span> <span class="req">*</span></label>
            <select id="type" name="type" required>
                <option value="" id="typePlaceholder">Select type</option>
                <option value="article" id="typeArticle">Article (1800&ndash;2000 words)</option>
                <option value="shortstory" id="typeShortStory">Short Story (2500&ndash;3000 words)</option>
                <option value="novel" id="typeNovel">Novel Outline</option>
                <option value="news" id="typeNews">News Article (1200&ndash;1800 words)</option>
                <option value="shortnews" id="typeShortNews">Short News (400&ndash;600 words)</option>
            </select>
        </div>

        <div class="form-group half newspaper-style-group" id="newspaperStyleGroup" style="display: none;">
            <label for="newspaperStyle"><span id="newspaperStyleLabel">Newspaper Style</span> <span class="req">*</span></label>
            <select id="newspaperStyle" name="newspaperStyle">
                <option value="" id="newspaperStylePlaceholder">Select newspaper style</option>
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
                <option value="custom" id="newspaperStyleCustom">Custom (enter below)</option>
            </select>
            <input type="text" class="custom-field" id="customNewspaperStyle" name="customNewspaperStyle" placeholder="Enter custom newspaper style" style="display: none;">
        </div>

        <div class="form-group half">
            <label for="language"><span id="languageLabel">Language</span> <span class="req">*</span></label>
            <select id="language" name="language" required>
                <option value="" id="languagePlaceholder">Select language</option>
                <option value="english">English</option>
                <option value="indonesian">Indonesian (Bahasa Indonesia)</option>
            </select>
        </div>

        <div class="form-group third chapter-count-group" id="chapterCountGroup" style="display: none;">
            <label for="chapterCount"><span id="chapterCountLabel">Chapters</span> <span class="req">*</span></label>
            <input type="number" id="chapterCount" name="chapterCount" min="1" max="50" placeholder="e.g. 10">
        </div>

        <div class="form-group third">
            <label for="tagInput" id="tagsLabel">Tags</label>
            <div class="tag-row">
                <input type="text" id="tagInput" placeholder="Add a tag and press Enter">
                <button type="button" class="add-btn" id="addTagBtn">Add</button>
            </div>
            <div class="tag-input" id="tagsContainer" data-empty=""></div>
        </div>

        <div class="form-group third">
            <label for="keywordInput" id="keywordsLabel">Keywords</label>
            <div class="tag-row">
                <input type="text" id="keywordInput" placeholder="Add a keyword and press Enter">
                <button type="button" class="add-btn" id="addKeywordBtn">Add</button>
            </div>
            <div class="tag-input" id="keywordsContainer" data-empty=""></div>
        </div>

        <div class="form-group full">
            <label for="mainIdea" id="mainIdeaLabel">Main Idea / Plot</label>
            <textarea id="mainIdea" name="mainIdea" rows="3" placeholder="Describe the main idea, plot or concept the AI should build upon."></textarea>
        </div>

        <div class="action-row">
            <button type="submit" class="generate-btn" id="generateBtn">
                <span id="generateButtonLabel">Generate Content</span>
                <span class="arrow">&rarr;</span>
            </button>
            <button type="button" class="reset-btn hidden" id="resetBtn">Reset All</button>
        </div>
    </div>
</form>

<div class="status-bar" id="loading">
    <div class="loading-specimen">
        <svg class="specimen-figure specimen-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" data-specimen-seed="Quill-Generating" aria-hidden="true"></svg>
        <div class="loading-specimen-meta">
            <div class="specimen-sid">SPEC.№ —</div>
            <div id="loadingMsg">Generating your content with AI&hellip;</div>
        </div>
    </div>
    <div class="progress"></div>
</div>

<div class="error-bar" id="errorMessage">
    <div class="row">
        <div class="lab" id="errorLabel">Error</div>
        <div class="msg" id="errorMessageText"></div>
    </div>
</div>

<div class="result-container" id="resultContainer"></div>

    ${renderFooter(FOOTER_STRINGS['english'])}
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
`;

// Client-side script. Reuses the original form/result logic and re-paints
// translatable fields when the language changes.
const SCRIPT = `
(function() {
    const I18N = window.__QUILL_I18N__.main;
    const FOOTER = window.__QUILL_I18N__.footer;

    function tpl(s, vars) {
        return String(s).replace(/\{n(?::0(\d+))?\}/g, function(_, pad) {
            var n = vars && typeof vars.n !== 'undefined' ? vars.n : '';
            return pad ? String(n).padStart(parseInt(pad, 10), '0') : String(n);
        });
    }

    function escapeHtml(s) {
        if (s == null) return '';
        return String(s).replace(/[&<>"']/g, function(c) {
            return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
        });
    }

    function txt(lang, key) { return I18N[lang][key]; }

    function repaint(lang) {
        const t = I18N[lang];
        document.title = t.documentTitle;
        // Topbar (replace the whole topbar block so language-specific labels + state reset)
        const topbarEl = document.querySelector('.topbar');
        if (topbarEl) {
            const tmp = document.createElement('div');
            tmp.innerHTML = (window.__QUILL_TOPBAR__ && window.__QUILL_TOPBAR__[lang]) || topbarEl.outerHTML;
            topbarEl.replaceWith(tmp.firstElementChild);
            // Re-bind dropdown interactions (event listeners don't survive outerHTML replace)
            setupAccountMenu();
            // Re-populate auth pill state on the freshly-injected elements
            syncAuthPill();
            // Re-populate BYOK chip state on the freshly-injected chip
            syncByokStatus();
        }
        // Hero
        const heroTitle = document.getElementById('heroTitle');
        if (heroTitle) {
            heroTitle.innerHTML = escapeHtml(t.title).replace(/\\./, '<span class="amp">.</span>');
        }
        const heroLede = document.getElementById('heroLede');
        if (heroLede) heroLede.textContent = t.lede;
        // Section label
        const briefTitle = document.getElementById('briefTitle');
        if (briefTitle) briefTitle.textContent = t.briefTitle;
        // Form labels (rebuild as "Label *")
        const setLabel = (id, base) => {
            const el = document.getElementById(id);
            if (el) el.textContent = base;
        };
        setLabel('topicLabel', t.topicLabel.replace(/\\s*\\*\\s*$/, ''));
        setLabel('authorStyleLabel', t.authorStyleLabel.replace(/\\s*\\*\\s*$/, ''));
        setLabel('typeLabel', t.typeLabel.replace(/\\s*\\*\\s*$/, ''));
        setLabel('newspaperStyleLabel', t.newspaperStyleLabel.replace(/\\s*\\*\\s*$/, ''));
        setLabel('chapterCountLabel', t.chapterCountLabel.replace(/\\s*\\*\\s*$/, ''));
        setLabel('languageLabel', t.languageLabel.replace(/\\s*\\*\\s*$/, ''));
        setLabel('tagsLabel', t.tagsLabel);
        setLabel('keywordsLabel', t.keywordsLabel);
        setLabel('mainIdeaLabel', t.mainIdeaLabel);
        // Placeholders
        const setPh = (id, v) => { const e = document.getElementById(id); if (e) e.placeholder = v; };
        setPh('topic', t.topicPlaceholder);
        setPh('mainIdea', t.mainIdeaPlaceholder);
        setPh('tagInput', t.tagsPlaceholder);
        setPh('keywordInput', t.keywordsPlaceholder);
        setPh('customAuthorStyle', t.customAuthorPlaceholder);
        setPh('customNewspaperStyle', t.customNewspaperPlaceholder);
        setPh('chapterCount', t.chapterCountPlaceholder);
        // Select placeholders / type labels
        const setOpt = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
        setOpt('authorStylePlaceholder', t.selectAuthor);
        setOpt('newspaperStylePlaceholder', t.selectNewspaper);
        setOpt('typePlaceholder', t.typePlaceholder);
        setOpt('languagePlaceholder', t.selectLanguage);
        setOpt('typeArticle', t.typeArticle + ' (1800–2000 words)');
        setOpt('typeShortStory', t.typeShortStory + ' (2500–3000 words)');
        setOpt('typeNovel', t.typeNovel);
        setOpt('typeNews', t.typeNews + ' (1200–1800 words)');
        setOpt('typeShortNews', t.typeShortNews + ' (400–600 words)');
        setOpt('authorStyleCustom', t.authorCustom);
        setOpt('newspaperStyleCustom', t.authorCustom);
        // Optgroup labels (author groups)
        const authorGroups = document.querySelectorAll('#authorStyle optgroup');
        const groupLabels = [t.authorOptgroupClassic, t.authorOptgroupFantasy, t.authorOptgroupContemporary, t.authorOptgroupIndonesian, t.authorOptgroupNonFiction, t.authorOptgroupOther];
        authorGroups.forEach(function(og, i) { if (groupLabels[i]) og.label = groupLabels[i]; });
        setOpt('addTagBtn', t.addButton);
        setOpt('addKeywordBtn', t.addButton);
        setOpt('generateButtonLabel', t.generateButton);
        setOpt('resetBtn', t.resetButton);
        setOpt('statusLabel', t.statusLabel);
        setOpt('errorLabel', t.errorLabel);
        // Tag empty placeholders
        const tagsContainer = document.getElementById('tagsContainer');
        if (tagsContainer) tagsContainer.setAttribute('data-empty', t.tagsEmpty);
        const keywordsContainer = document.getElementById('keywordsContainer');
        if (keywordsContainer) keywordsContainer.setAttribute('data-empty', t.keywordsEmpty);
        // Auth links
        const signInLink = document.getElementById('authSignInLink');
        if (signInLink) {
            signInLink.textContent = t.signInLink;
            signInLink.setAttribute('title', t.signInTooltip);
        }
        const signOutBtn = document.getElementById('authSignOutBtn');
        if (signOutBtn) signOutBtn.setAttribute('title', t.signOutTooltip);
        // Re-sync custom selects (option text changed on language swap)
        if (window.rebuildAllSelects) window.rebuildAllSelects();
        // BYOK badge / banner
        syncByokStatus();
    }

    function syncByokStatus() {
        const lang = (localStorage.getItem('uiLanguage') || 'english');
        const t = I18N[lang];
        const key = (localStorage.getItem(getApiKeyStorageKey()) || '').trim();
        const has = key.length > 0;
        const byokStatus = document.getElementById('byokStatus');
        if (byokStatus) byokStatus.setAttribute('data-state', has ? 'ok' : 'missing');
        const byokStrings = (window.__QUILL_TOPBAR_STRINGS__ && window.__QUILL_TOPBAR_STRINGS__[lang]) || null;
        const byokStateText = document.getElementById('byokStateText');
        if (byokStateText) byokStateText.textContent = has ? (byokStrings ? byokStrings.byokSet : 'Key Set') : (byokStrings ? byokStrings.byokMissing : 'No Key');
        const byokBanner = document.getElementById('byokBanner');
        if (byokBanner) byokBanner.classList.toggle('show', !has);
        const byokBannerTitle = document.getElementById('byokBannerTitle');
        if (byokBannerTitle) byokBannerTitle.textContent = t.byokBannerTitle;
        const byokBannerMsg = document.getElementById('byokBannerMsg');
        if (byokBannerMsg) byokBannerMsg.innerHTML = t.byokBannerMsg;
        const byokBannerLink = document.getElementById('byokBannerLink');
        if (byokBannerLink) byokBannerLink.textContent = t.byokBannerCta;
    }

    function getApiKeyOrRedirect() {
        const key = (localStorage.getItem('geminiApiKey') || '').trim();
        if (!key) {
            const lang = localStorage.getItem('uiLanguage') || 'english';
            showError(I18N[lang].apiKeyRequired);
            syncByokStatus();
            return null;
        }
        return key;
    }

    async function callByokEndpoint(url, body) {
        const key = getApiKeyOrRedirect();
        if (!key) return null;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-User-API-Key': key },
            body: JSON.stringify(body),
        });
        if (response.status === 400) {
            let payload = null;
            try { payload = await response.json(); } catch (_) {}
            if (payload && payload.code === 'BYOK_KEY_REQUIRED') {
                const lang = localStorage.getItem('uiLanguage') || 'english';
                showError(I18N[lang].apiKeyRequired);
                syncByokStatus();
                return null;
            }
        }
        return response;
    }

    function showError(message) {
        const errorMessage = document.getElementById('errorMessage');
        const errorMessageText = document.getElementById('errorMessageText');
        if (errorMessageText) errorMessageText.textContent = message;
        if (errorMessage) {
            errorMessage.classList.add('show');
            errorMessage.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function showModal(title, message, onConfirm, cancelText, confirmText, opts) {
        const modal = document.getElementById('confirmationModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');
        const modalCancel = document.getElementById('modalCancel');
        const modalConfirm = document.getElementById('modalConfirm');
        const lab = document.getElementById('modalLab');
        const escClose = document.getElementById('modalEscClose');
        const modalExtra = document.getElementById('modalExtra');
        const lang = localStorage.getItem('uiLanguage') || 'english';
        if (lab) lab.textContent = I18N[lang].confirmLabel;
        if (escClose) escClose.textContent = I18N[lang].escToClose;
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modalCancel.textContent = cancelText || 'Cancel';
        modalConfirm.textContent = confirmText || 'Confirm';
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
        modalCancel.onclick = closeModal;
        modalConfirm.onclick = function() {
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

    // Loading facts cycling
    let loadingInterval;
    let shuffledFacts = [];
    let currentFactIndex = 0;
    function shuffleArray(array) {
        const s = array.slice();
        for (let i = s.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [s[i], s[j]] = [s[j], s[i]];
        }
        return s;
    }
    function startLoadingFacts(lang) {
        const facts = I18N[lang].loadingFacts;
        if (!facts || facts.length === 0) return;
        shuffledFacts = shuffleArray(facts);
        currentFactIndex = 0;
        const loadingMsg = document.getElementById('loadingMsg');
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
            const lang = localStorage.getItem('uiLanguage') || 'english';
            document.getElementById('loadingMsg').textContent = I18N[lang].generating;
        }
    }

    // Auth state
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
                closeAccountMenu();
            }
        }
    }

    function computeInitials(name) {
        if (!name) return '';
        var parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
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
                const tag = document.createElement('div');
                tag.className = 'chip';
                tag.innerHTML = escapeHtml(item) + ' <span class="x" data-index="' + index + '">&times;</span>';
                container.appendChild(tag);
            });
            container.querySelectorAll('.x').forEach((el) => {
                el.addEventListener('click', (e) => removeItem(parseInt(e.target.getAttribute('data-index'), 10)));
            });
        }
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); addItem(input.value.trim()); }
        });
        addBtn.addEventListener('click', () => addItem(input.value.trim()));
        return { addItem, removeItem, renderItems, array };
    }

    // Per-user API key namespace
    function getApiKeyStorageKey() {
        const uid = localStorage.getItem('quillAuthUid');
        return uid ? ('geminiApiKey.' + uid) : 'geminiApiKey';
    }

    document.addEventListener('DOMContentLoaded', function() {
        const savedLanguage = localStorage.getItem('uiLanguage') || 'english';
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
        const resultContainer = document.getElementById('resultContainer');

        const tagsArr = [];
        const keywordsArr = [];
        setupTagSystem('tagInput', 'tagsContainer', tagsArr, 'addTagBtn');
        setupTagSystem('keywordInput', 'keywordsContainer', keywordsArr, 'addKeywordBtn');

        syncAuthPill();
        repaint(savedLanguage);

        function saveFormData() {
            const formData = {
                topic: document.getElementById('topic').value,
                authorStyle: authorStyleSelect.value,
                customAuthorStyle: customAuthorStyle.value,
                type: typeSelect.value,
                newspaperStyle: newspaperStyleSelect.value,
                customNewspaperStyle: customNewspaperStyle.value,
                language: document.getElementById('language').value,
                chapterCount: document.getElementById('chapterCount').value,
                mainIdea: document.getElementById('mainIdea').value,
                tags: tagsArr,
                keywords: keywordsArr,
            };
            localStorage.setItem('quillFormData', JSON.stringify(formData));
        }
        function loadFormData() {
            const saved = localStorage.getItem('quillFormData');
            if (!saved) return;
            try {
                const data = JSON.parse(saved);
                document.getElementById('topic').value = data.topic || '';
                authorStyleSelect.value = data.authorStyle || '';
                customAuthorStyle.value = data.customAuthorStyle || '';
                typeSelect.value = data.type || '';
                newspaperStyleSelect.value = data.newspaperStyle || '';
                customNewspaperStyle.value = data.customNewspaperStyle || '';
                document.getElementById('language').value = data.language || '';
                document.getElementById('chapterCount').value = data.chapterCount || '';
                document.getElementById('mainIdea').value = data.mainIdea || '';
                if (data.tags) { tagsArr.length = 0; tagsArr.push.apply(tagsArr, data.tags); }
                if (data.keywords) { keywordsArr.length = 0; keywordsArr.push.apply(keywordsArr, data.keywords); }
                if (data.type === 'novel') chapterCountGroup.style.display = '';
                else chapterCountGroup.style.display = 'none';
                if (data.authorStyle === 'custom') { customAuthorStyle.style.display = 'block'; customAuthorStyle.required = true; }
                if (data.type === 'news' || data.type === 'shortnews') { newspaperStyleGroup.style.display = 'block'; newspaperStyleSelect.required = true; }
                if (data.newspaperStyle === 'custom') { customNewspaperStyle.style.display = 'block'; customNewspaperStyle.required = true; }
            } catch (_) {}
        }
        function clearAllData() {
            localStorage.removeItem('quillFormData');
            localStorage.removeItem('quillResults');
            form.reset();
            tagsArr.length = 0;
            keywordsArr.length = 0;
            document.getElementById('tagsContainer').innerHTML = '';
            document.getElementById('keywordsContainer').innerHTML = '';
            chapterCountGroup.style.display = 'none';
            customAuthorStyle.style.display = 'none';
            customAuthorStyle.required = false;
            newspaperStyleGroup.style.display = 'none';
            newspaperStyleSelect.required = false;
            customNewspaperStyle.style.display = 'none';
            customNewspaperStyle.required = false;
            resultContainer.innerHTML = '';
            resultContainer.classList.remove('show');
            document.getElementById('errorMessage').classList.remove('show');
            document.getElementById('resetBtn').classList.add('hidden');
        }
        function saveResults(result, type) {
            localStorage.setItem('quillResults', JSON.stringify({ result, type, timestamp: Date.now() }));
        }
        function loadResults() {
            const saved = localStorage.getItem('quillResults');
            if (!saved) return;
            try {
                const data = JSON.parse(saved);
                displayResults(data.result, data.type);
                document.getElementById('resetBtn').classList.remove('hidden');
            } catch (_) {}
        }

        typeSelect.addEventListener('change', function() {
            if (this.value === 'novel') chapterCountGroup.style.display = '';
            else chapterCountGroup.style.display = 'none';
            if (this.value === 'news' || this.value === 'shortnews') {
                newspaperStyleGroup.style.display = '';
                newspaperStyleSelect.required = true;
            } else {
                newspaperStyleGroup.style.display = 'none';
                newspaperStyleSelect.required = false;
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

        document.getElementById('resetBtn').addEventListener('click', function() {
            const lang = localStorage.getItem('uiLanguage') || 'english';
            const t = I18N[lang];
            showModal(t.resetConfirmTitle, t.resetConfirmMessage, clearAllData, t.cancelButton, t.resetModalButton);
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

        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const apiKey = getApiKeyOrRedirect();
            if (!apiKey) return;
            const data = {
                topic: form.topic.value,
                tags: tagsArr.length > 0 ? tagsArr : ['writing', 'content', 'creative'],
                keywords: keywordsArr.length > 0 ? keywordsArr : ['writing', 'content', 'creation'],
                authorStyle: authorStyleSelect.value === 'custom' ? customAuthorStyle.value : authorStyleSelect.value,
                type: typeSelect.value,
                newspaperStyle: newspaperStyleSelect.value === 'custom' ? customNewspaperStyle.value : newspaperStyleSelect.value,
                chapterCount: form.chapterCount.value ? parseInt(form.chapterCount.value, 10) : undefined,
                language: form.language.value,
                mainIdea: form.mainIdea.value || undefined,
            };
            loading.classList.add('show');
            generateBtn.disabled = true;
            document.getElementById('errorMessage').classList.remove('show');
            resultContainer.classList.remove('show');
            const lang = localStorage.getItem('uiLanguage') || 'english';
            startLoadingFacts(lang);
            try {
                const response = await callByokEndpoint('/api/generate', data);
                if (!response) return;
                let result;
                try {
                    const text = await response.text();
                    try { result = JSON.parse(text); }
                    catch (_) { throw new Error('Unexpected server response (' + response.status + ')'); }
                } catch (parseErr) { throw parseErr; }
                if (!response.ok) throw new Error((result && result.error) || 'Failed to generate content');
                displayResults(result, data.type);
                saveResults(result, data.type);
                document.getElementById('resetBtn').classList.remove('hidden');
                syncByokStatus();
            } catch (error) {
                const lang2 = localStorage.getItem('uiLanguage') || 'english';
                const t2 = I18N[lang2];
                let msg = error.message;
                if (error.message.includes('quota exceeded') || error.message.includes('429')) msg = t2.apiKeyQuotaExceeded;
                else if (error.message.includes('403') || error.message.includes('access denied') || error.message.includes('unauthorized')) msg = t2.apiKeyInvalid;
                else if (error.message.includes('network') || error.message.includes('fetch')) msg = t2.networkError;
                showError(msg);
            } finally {
                loading.classList.remove('show');
                generateBtn.disabled = false;
                stopLoadingFacts();
            }
        });

        function resultHead(num, title, meta) {
            const seed = 'Quill-Result-' + (num || 'X') + '-' + (title || '').slice(0, 8);
            return '<div class="result-block"><div class="result-head"><div class="num">' + num + '</div><div class="title">' + title + '</div><div class="meta">' + (meta || '') + '</div><svg class="specimen-mark-svg specimen-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" data-specimen-seed="' + escapeHtml(seed) + '" aria-hidden="true"></svg></div>';
        }
        function resultFoot() { return '</div>'; }

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

        function displayArticleResults(result) {
            const lang = localStorage.getItem('uiLanguage') || 'english';
            const t = I18N[lang];
            let html = '';
            if (result.refinedTags && result.refinedTags.length > 0) {
                html += resultHead('03', t.refinedTags, tpl(t.tagsMeta, {n: result.refinedTags.length}));
                html += '<div class="tag-row-result"><div class="tag-input">' + result.refinedTags.map(function(x) { return '<div class="chip">' + escapeHtml(x) + '</div>'; }).join('') + '</div></div>';
                html += resultFoot();
            }
            if (result.titleSelection && result.titleSelection.length > 0) {
                html += resultHead('04', t.selectTitle, tpl(t.optionsMeta, {n: result.titleSelection.length}));
                html += '<div class="option-grid">';
                result.titleSelection.forEach((title, i) => {
                    html += '<div class="option-card" data-type="title" data-index="' + i + '"><div class="option-tag">' + tpl(t.optionIndex, {n: i + 1}) + '</div><div class="option-text">' + escapeHtml(title) + '</div></div>';
                });
                html += '</div>' + resultFoot();
            }
            if (result.subtitleSelection && result.subtitleSelection.length > 0) {
                html += resultHead('05', t.selectSubtitle, tpl(t.optionsMeta, {n: result.subtitleSelection.length}));
                html += '<div class="option-grid">';
                result.subtitleSelection.forEach((s, i) => {
                    html += '<div class="option-card" data-type="subtitle" data-index="' + i + '"><div class="option-tag">' + tpl(t.optionIndex, {n: i + 1}) + '</div><div class="option-text">' + escapeHtml(s) + '</div></div>';
                });
                html += '</div>' + resultFoot();
            }
            if (result.content) {
                html += resultHead('06', t.content, t.bodyMeta);
                html += '<div class="content-display">' + result.content + '</div>';
                html += '<div class="export-block"><div class="export-row">';
                html += '<div class="export-select-group"><label for="selectedTitle">' + t.selectTitle + '</label><select id="selectedTitle" class="export-select"><option value="">' + t.selectTitle + '…</option>';
                if (result.titleSelection) result.titleSelection.forEach(function(x) { html += '<option value="' + escapeHtml(x) + '">' + escapeHtml(x) + '</option>'; });
                html += '</select></div>';
                html += '<div class="export-select-group" style="grid-column: 1 / -1; margin-top: 16px;"><label for="selectedSubtitle">' + t.selectSubtitle + '</label><select id="selectedSubtitle" class="export-select"><option value="">' + t.selectSubtitle + '…</option>';
                if (result.subtitleSelection) result.subtitleSelection.forEach(function(x) { html += '<option value="' + escapeHtml(x) + '">' + escapeHtml(x) + '</option>'; });
                html += '</select></div>';
                html += '<div class="export-buttons"><button class="export-btn" id="exportMdBtn">&#8595; ' + t.exportMarkdown + '</button><button class="export-btn" id="exportRtfBtn">&#8595; ' + t.exportRTF + '</button><button class="export-btn" id="saveToWsBtn">&#8964; ' + t.saveToWorkspace + '</button></div>';
                html += '</div></div>';
                html += resultFoot();
            }
            resultContainer.innerHTML = html;
            // Render any specimen SVGs that the result HTML just produced
            if (window.renderSpecimen) {
                resultContainer.querySelectorAll('svg[data-specimen-seed]').forEach(function(svg) {
                    window.renderSpecimen(svg, svg.getAttribute('data-specimen-seed'));
                });
            }
            bindOptionSelection();
            bindExportButtons();
        }

        function displayNovelResults(result) {
            const lang = localStorage.getItem('uiLanguage') || 'english';
            const t = I18N[lang];
            let html = '';
            if (result.titleSelection && result.titleSelection.length > 0) {
                html += resultHead('03', t.selectTitle, tpl(t.optionsMeta, {n: result.titleSelection.length}));
                html += '<div class="option-grid">';
                result.titleSelection.forEach((title, i) => {
                    html += '<div class="option-card" data-type="title" data-index="' + i + '"><div class="option-tag">' + tpl(t.optionIndex, {n: i + 1}) + '</div><div class="option-text">' + escapeHtml(title) + '</div></div>';
                });
                html += '</div>' + resultFoot();
            }
            if (result.synopsis) {
                html += resultHead('04', t.synopsis, t.narrativeMeta);
                html += '<div class="content-display">' + result.synopsis + '</div>' + resultFoot();
            }
            if (result.outline && result.outline.length > 0) {
                html += resultHead('05', t.outline, tpl(t.chaptersMeta, {n: result.outline.length}));
                html += '<div class="chapter-outline">';
                result.outline.forEach(function(ch) {
                    html += '<div class="chapter-item">';
                    html += '<div class="chapter-header" data-chapter="' + ch.chapterNumber + '">';
                    html += '<div class="chapter-num">' + t.chapterPrefix + String(ch.chapterNumber).padStart(2, '0') + '</div>';
                    html += '<div class="chapter-titles"><div class="ch-title">' + escapeHtml(ch.title) + '</div><div class="ch-sub">' + escapeHtml(ch.subtitle) + '</div></div>';
                    html += '<div class="chapter-toggle" id="chapter-toggle-' + ch.chapterNumber + '">&rarr;</div>';
                    html += '</div>';
                    html += '<div class="chapter-content-section" id="chapter-content-section-' + ch.chapterNumber + '">';
                    html += '<div class="chapter-details">';
                    html += '<div class="chapter-actions">';
                    html += '<button class="generate-chapter-btn" data-chapter-number="' + ch.chapterNumber + '" data-chapter-title="' + escapeHtml(ch.title).replace(/"/g, '&quot;') + '" data-chapter-subtitle="' + escapeHtml(ch.subtitle).replace(/"/g, '&quot;') + '" data-novel-title="' + escapeHtml(result.titleSelection ? result.titleSelection[0] : '').replace(/"/g, '&quot;') + '" data-novel-synopsis="' + escapeHtml(result.synopsis ? result.synopsis.substring(0, 100) : '').replace(/"/g, '&quot;') + '">' + t.generateChapter + '</button>';
                    html += '<div class="export-chapter-buttons" id="export-chapter-' + ch.chapterNumber + '-btn" style="display: none;">';
                    html += '<button class="export-chapter-btn" data-chapter-number="' + ch.chapterNumber + '" data-chapter-title="' + escapeHtml(ch.title).replace(/"/g, '&quot;') + '" data-chapter-subtitle="' + escapeHtml(ch.subtitle).replace(/"/g, '&quot;') + '" data-export="md">MD</button>';
                    html += '<button class="export-chapter-btn" data-chapter-number="' + ch.chapterNumber + '" data-chapter-title="' + escapeHtml(ch.title).replace(/"/g, '&quot;') + '" data-chapter-subtitle="' + escapeHtml(ch.subtitle).replace(/"/g, '&quot;') + '" data-export="rtf">RTF</button>';
                    html += '</div></div>';
                    html += '<div class="chapter-loading" id="chapter-' + ch.chapterNumber + '-loading" style="display: none;"><div class="bar"></div><div class="lab">' + t.chapterLoadingLabel + '</div></div>';
                    html += '<div class="chapter-content" id="chapter-' + ch.chapterNumber + '-content" style="display: none;"></div>';
                    html += '</div></div></div>';
                });
                html += '</div>';
                html += '<div class="export-block"><div class="export-row">';
                html += '<div class="export-select-group"><label for="selectedNovelTitle">' + t.selectTitle + '</label><select id="selectedNovelTitle" class="export-select"><option value="">' + t.selectTitle + '…</option>';
                if (result.titleSelection) result.titleSelection.forEach(function(x) { html += '<option value="' + escapeHtml(x) + '">' + escapeHtml(x) + '</option>'; });
                html += '</select></div>';
                html += '<div class="export-buttons"><button class="export-btn" id="exportNovelMdBtn">&#8595; ' + t.exportMarkdown + '</button></div>';
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
            document.querySelectorAll('.option-card').forEach((card) => {
                card.addEventListener('click', function() {
                    const type = this.getAttribute('data-type');
                    document.querySelectorAll('.option-card[data-type="' + type + '"]').forEach((c) => c.classList.remove('selected'));
                    this.classList.add('selected');
                });
            });
        }
        function bindChapterToggles() {
            document.querySelectorAll('.chapter-header').forEach((h) => {
                h.addEventListener('click', function(e) {
                    if (e.target.closest('button')) return;
                    const n = this.getAttribute('data-chapter');
                    const sec = document.getElementById('chapter-content-section-' + n);
                    const tog = document.getElementById('chapter-toggle-' + n);
                    if (sec.classList.contains('expanded')) { sec.classList.remove('expanded'); tog.innerHTML = '&rarr;'; }
                    else { sec.classList.add('expanded'); tog.innerHTML = '&darr;'; }
                });
            });
        }
        function bindChapterGenerate() {
            document.querySelectorAll('.generate-chapter-btn').forEach((btn) => btn.addEventListener('click', () => generateChapter(btn)));
            document.querySelectorAll('.export-chapter-btn').forEach((btn) => btn.addEventListener('click', function() {
                const fmt = this.getAttribute('data-export');
                if (fmt === 'md') exportChapterMarkdown(this); else exportChapterRTF(this);
            }));
        }
        function bindExportButtons() {
            const md = document.getElementById('exportMdBtn'); if (md) md.addEventListener('click', exportAsMarkdown);
            const rtf = document.getElementById('exportRtfBtn'); if (rtf) rtf.addEventListener('click', exportAsRTF);
            const nmd = document.getElementById('exportNovelMdBtn'); if (nmd) nmd.addEventListener('click', exportNovelAsMarkdown);
            const ws = document.getElementById('saveToWsBtn'); if (ws) ws.addEventListener('click', saveCurrentToWorkspace);
        }

        async function saveCurrentToWorkspace() {
            var wsBtn = document.getElementById('saveToWsBtn');
            var lang = localStorage.getItem('uiLanguage') || 'english';
            var t = window.__QUILL_I18N__.main[lang];
            var authUid = localStorage.getItem('quillAuthUid');
            if (!authUid) {
                alert(t.workspaceAuthRequired || 'Please sign in to save to your Workspace.');
                return;
            }
            var titleVal = (document.getElementById('selectedTitle') || {}).value || 'Untitled';
            var contentEl = document.querySelector('.content-display');
            var content = contentEl ? (contentEl.textContent || contentEl.innerText || '') : '';
            var savedForm = {};
            try { savedForm = JSON.parse(localStorage.getItem('quillFormData') || '{}'); } catch(e) {}
            if (wsBtn) { wsBtn.disabled = true; wsBtn.textContent = '…'; }
            try {
                var resp = await fetch('/api/workspace/drafts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: String(titleVal).slice(0, 500),
                        content: content,
                        type: savedForm.type || 'article',
                        style: savedForm.authorStyle || '',
                        topic: savedForm.topic || titleVal,
                        tags: Array.isArray(savedForm.tags) ? savedForm.tags : [],
                        status: 'draft',
                    }),
                });
                if (resp.status === 401) {
                    alert(t.workspaceAuthRequired || 'Please sign in to save to your Workspace.');
                    return;
                }
                if (!resp.ok) {
                    var j = await resp.json().catch(function() { return {}; });
                    throw new Error(j.error || 'Save failed');
                }
                if (wsBtn) { wsBtn.textContent = t.savedToWorkspace || 'Saved ✓'; }
                setTimeout(function() {
                    if (wsBtn) { wsBtn.disabled = false; wsBtn.innerHTML = '&#8964; ' + (t.saveToWorkspace || 'Save to Workspace'); }
                }, 2500);
            } catch(e) {
                if (wsBtn) { wsBtn.disabled = false; wsBtn.innerHTML = '&#8964; ' + (t.saveToWorkspace || 'Save to Workspace'); }
                alert(t.saveError || 'Failed to save. Please try again.');
            }
        }

        function exportAsMarkdown() {
            const t = (document.getElementById('selectedTitle') || {}).value;
            const s = (document.getElementById('selectedSubtitle') || {}).value;
            if (!t) { alert('Please select a title first.'); return; }
            const c = document.querySelector('.content-display');
            if (!c) { alert('No content found to export.'); return; }
            const content = c.textContent || c.innerText;
            let md = '# ' + t + '\\n\\n';
            if (s) md += '## ' + s + '\\n\\n';
            md += content;
            const blob = new Blob([md], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = t.replace(/[^a-z0-9]/g, '_').toLowerCase() + '.md';
            document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
        }
        async function exportAsRTF() {
            const t = (document.getElementById('selectedTitle') || {}).value;
            const s = (document.getElementById('selectedSubtitle') || {}).value;
            if (!t) { alert('Please select a title first.'); return; }
            const c = document.querySelector('.content-display');
            if (!c) { alert('No content found to export.'); return; }
            const content = c.textContent || c.innerText;
            try {
                const response = await fetch('/api/export-rtf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: t, subtitle: s || '', content }),
                });
                if (!response.ok) throw new Error('Export failed');
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = t.replace(/[^a-z0-9]/g, '_').toLowerCase() + '.rtf';
                document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
            } catch (e) {
                alert('RTF export failed. Please try again.');
            }
        }
        function exportNovelAsMarkdown() {
            const t = (document.getElementById('selectedNovelTitle') || {}).value;
            if (!t) { alert('Please select a novel title first.'); return; }
            const chapters = [];
            document.querySelectorAll('.chapter-item').forEach((item, index) => {
                const n = index + 1;
                const titleEl = item.querySelector('.ch-title');
                const contentEl = item.querySelector('.chapter-content');
                chapters.push({
                    number: n,
                    title: titleEl ? titleEl.textContent : 'Chapter ' + n,
                    content: contentEl && contentEl.style.display !== 'none' ? contentEl.textContent : '[Chapter content not generated yet]',
                });
            });
            let md = '# ' + t + '\\n\\n';
            const synEl = document.querySelector('.content-display');
            if (synEl) {
                const syn = synEl.textContent || synEl.innerText;
                md += '## Synopsis\\n\\n' + syn + '\\n\\n';
            }
            chapters.forEach((c) => { md += '## ' + c.title + '\\n\\n' + c.content + '\\n\\n---\\n\\n'; });
            const blob = new Blob([md], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = t.replace(/[^a-z0-9]/g, '_').toLowerCase() + '.md';
            document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
        }
        async function generateChapter(button) {
            const n = parseInt(button.getAttribute('data-chapter-number'), 10);
            const ct = button.getAttribute('data-chapter-title');
            const cs = button.getAttribute('data-chapter-subtitle');
            const nt = button.getAttribute('data-novel-title');
            const ns = button.getAttribute('data-novel-synopsis');
            const ld = document.getElementById('chapter-' + n + '-loading');
            const cd = document.getElementById('chapter-' + n + '-content');
            const apiKey = getApiKeyOrRedirect();
            if (!apiKey) return;
            button.disabled = true;
            const lang = localStorage.getItem('uiLanguage') || 'english';
            const t = I18N[lang];
            button.textContent = t.generatingChapter;
            ld.style.display = 'flex';
            try {
                const response = await callByokEndpoint('/api/generate-chapter', {
                    chapterNumber: n, chapterTitle: ct, chapterSubtitle: cs,
                    novelTitle: nt, novelSynopsis: ns,
                    previousChapters: collectPreviousChapters(n),
                });
                if (!response) return;
                if (!response.ok) {
                    let errMsg = 'Chapter generation failed';
                    try { const j = await response.json(); if (j && j.error) errMsg = j.error; } catch (_) {}
                    throw new Error(errMsg);
                }
                const result = await response.json();
                ld.style.display = 'none';
                cd.style.display = 'block';
                cd.innerHTML = (result.content || '').replace(/\\n/g, '<br>');
                const ex = document.getElementById('export-chapter-' + n + '-btn');
                if (ex) ex.style.display = 'inline-flex';
                setTimeout(() => {
                    const sec = document.getElementById('chapter-content-section-' + n);
                    const tog = document.getElementById('chapter-toggle-' + n);
                    if (!sec.classList.contains('expanded')) { sec.classList.add('expanded'); tog.innerHTML = '&darr;'; }
                }, 100);
                button.textContent = t.regenerateChapter;
                button.disabled = false;
                syncByokStatus();
            } catch (e) {
                alert('Chapter generation failed. Please try again.');
                button.disabled = false;
                const lang2 = localStorage.getItem('uiLanguage') || 'english';
                button.textContent = I18N[lang2].generateChapter;
                ld.style.display = 'none';
            }
        }
        function collectPreviousChapters(currentChapterNumber) {
            const arr = [];
            document.querySelectorAll('.chapter-item').forEach((item, index) => {
                const n = index + 1;
                if (n < currentChapterNumber) {
                    const titleEl = item.querySelector('.ch-title');
                    const title = titleEl ? titleEl.textContent : 'Chapter ' + n;
                    const contentEl = document.getElementById('chapter-' + n + '-content');
                    if (contentEl && contentEl.style.display !== 'none') {
                        const content = contentEl.textContent || contentEl.innerText;
                        if (content && content.length > 50) arr.push({ chapterNumber: n, title, content, keyEvents: [] });
                    }
                }
            });
            return arr;
        }
        function exportChapterMarkdown(button) {
            const n = parseInt(button.getAttribute('data-chapter-number'), 10);
            const t = button.getAttribute('data-chapter-title');
            const s = button.getAttribute('data-chapter-subtitle');
            const c = document.getElementById('chapter-' + n + '-content');
            if (!c || c.style.display === 'none') { alert('No chapter content found. Generate the chapter first.'); return; }
            const content = c.textContent || c.innerText;
            const md = '# Chapter ' + n + ': ' + t + '\\n\\n## ' + s + '\\n\\n' + content + '\\n\\n---\\n';
            const blob = new Blob([md], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = t.replace(/[^a-z0-9]/g, '_').toLowerCase() + '_chapter_' + n + '.md';
            document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
        }
        async function exportChapterRTF(button) {
            const n = parseInt(button.getAttribute('data-chapter-number'), 10);
            const t = button.getAttribute('data-chapter-title');
            const s = button.getAttribute('data-chapter-subtitle');
            const c = document.getElementById('chapter-' + n + '-content');
            if (!c || c.style.display === 'none') { alert('No chapter content found. Generate the chapter first.'); return; }
            const content = c.textContent || c.innerText;
            try {
                const response = await fetch('/api/export-chapter-rtf', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chapterNumber: n, chapterTitle: t, chapterSubtitle: s, content }),
                });
                if (!response.ok) throw new Error('Chapter RTF export failed');
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = t.replace(/[^a-z0-9]/g, '_').toLowerCase() + '_chapter_' + n + '.rtf';
                document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
            } catch (e) {
                alert('Chapter RTF export failed. Please try again.');
            }
        }

        // Initial paint and auth
        setupAccountMenu();
        syncAuthPill();
        repaint(savedLanguage);
        loadFormData();
        loadResults();
    });
})();
`;

export function generateMainPageHTML(locale: Locale = 'english'): string {
  const strings = MAIN_STRINGS[locale];
  return `<!DOCTYPE html>
<html lang="${locale}">
${renderHead({ title: strings.documentTitle, pageStyles: PAGE_CSS })}
<body>
${BODY_HTML}
<script>
window.__QUILL_I18N__ = ${JSON.stringify({ main: MAIN_STRINGS, footer: FOOTER_STRINGS })};
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
