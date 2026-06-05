import { WORKSPACE_STRINGS, Locale } from './i18n';
import { renderHead, renderFooter, renderTopbar, getTopbarStrings, ARCHIVAL_DETAILS_HTML, FOOTER_STRINGS } from './styles';
import { SPECIMEN_JS } from './specimen';

const PAGE_CSS = `
/* Filter bar */
.ws-filter-bar {
    display: flex;
    gap: 0;
    border-bottom: var(--rule);
    padding-top: 8px;
}
.ws-filter-tab {
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 10px 20px 8px 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--gray-600);
    cursor: pointer;
    margin-bottom: -1px;
    transition: color 0.1s, border-color 0.1s;
}
.ws-filter-tab.active {
    color: var(--black);
    border-bottom-color: var(--accent);
}
.ws-filter-tab:hover:not(.active) { color: var(--black); }

/* Draft table */
.workspace-table { width: 100%; }
.workspace-table-head {
    display: grid;
    grid-template-columns: 80px 1fr 120px 100px 120px;
    column-gap: var(--gutter);
    padding: 10px 0;
    border-bottom: var(--rule-soft);
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--gray-600);
}
.workspace-table-row {
    display: grid;
    grid-template-columns: 80px 1fr 120px 100px 120px;
    column-gap: var(--gutter);
    padding: 14px 0;
    border-bottom: var(--rule-soft);
    align-items: center;
    cursor: pointer;
    transition: background 0.1s;
}
.workspace-table-row:hover { background: var(--paper); margin: 0 -16px; padding: 14px 16px; }
.workspace-table-row.open { background: var(--paper); margin: 0 -16px; padding: 14px 16px; }

/* Status badge */
.draft-badge {
    display: inline-block;
    padding: 2px 7px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.18em;
    font-weight: 700;
    border: 1px solid;
    text-transform: uppercase;
}
.draft-badge-draft { color: var(--gray-600); border-color: var(--gray-300); }
.draft-badge-final { color: var(--black); border-color: var(--black); }

.ws-col-title { font-size: 14px; font-weight: 600; letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ws-col-type { font-size: 11px; color: var(--gray-600); letter-spacing: 0.08em; text-transform: uppercase; }
.ws-col-date { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--gray-600); }
.ws-col-actions { display: flex; gap: 8px; justify-content: flex-end; }
.ws-action-btn {
    background: none;
    border: 1px solid var(--gray-300);
    padding: 4px 10px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    color: var(--black);
    transition: border-color 0.1s, background 0.1s;
}
.ws-action-btn:hover { border-color: var(--black); background: var(--black); color: var(--white); }
.ws-action-btn.danger:hover { background: #c0392b; border-color: #c0392b; color: var(--white); }

/* Editor panel */
.editor-panel {
    display: none;
    border-bottom: var(--rule);
    background: var(--paper);
    padding: 24px 16px;
    margin: 0 -16px;
}
.editor-panel.open { display: block; }
.editor-title-input {
    width: 100%;
    border: none;
    border-bottom: 2px solid var(--black);
    background: transparent;
    font-family: 'Inter', sans-serif;
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.02em;
    padding: 4px 0 8px 0;
    outline: none;
    margin-bottom: 16px;
}
.editor-title-input:focus { border-bottom-color: var(--accent); }
.editor-content {
    width: 100%;
    border: 1px solid var(--gray-300);
    background: var(--white);
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    line-height: 1.7;
    padding: 16px;
    outline: none;
    resize: vertical;
    min-height: 360px;
    box-sizing: border-box;
}
.editor-content:focus { border-color: var(--black); }
.editor-autosave-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gray-600);
    padding: 6px 0;
    height: 20px;
}
.editor-autosave-bar .as-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--gray-300);
    transition: background 0.3s;
}
.editor-autosave-bar.active .as-dot { background: var(--accent); }
.editor-toolbar {
    display: flex;
    gap: 8px;
    padding-top: 12px;
    flex-wrap: wrap;
}
.editor-toolbar .toolbar-btn {
    background: var(--black);
    color: var(--white);
    border: 1px solid var(--black);
    padding: 10px 20px;
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.1s;
}
.editor-toolbar .toolbar-btn:hover { background: var(--gray-900); }
.editor-toolbar .toolbar-btn.secondary {
    background: transparent;
    color: var(--black);
}
.editor-toolbar .toolbar-btn.secondary:hover { background: var(--gray-100); }
.editor-toolbar .toolbar-btn.danger {
    background: transparent;
    color: var(--black);
    border-color: var(--gray-300);
}
.editor-toolbar .toolbar-btn.danger:hover { background: #c0392b; border-color: #c0392b; color: var(--white); }

/* Empty state */
.ws-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 64px 0;
    text-align: center;
    border-bottom: var(--rule-soft);
}
.ws-empty-ornament {
    font-family: 'JetBrains Mono', monospace;
    font-size: 48px;
    color: var(--gray-300);
    margin-bottom: 24px;
    line-height: 1;
}
.ws-empty-title {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.01em;
    margin-bottom: 8px;
}
.ws-empty-msg {
    font-size: 13px;
    color: var(--gray-600);
    max-width: 360px;
    line-height: 1.6;
    margin-bottom: 24px;
}
.ws-empty-cta {
    display: inline-block;
    border: 1px solid var(--black);
    padding: 10px 20px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--black);
    text-decoration: none;
    transition: background 0.1s;
}
.ws-empty-cta:hover { background: var(--black); color: var(--white); }

/* Toast */
.ws-toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: var(--black);
    color: var(--white);
    padding: 10px 20px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    opacity: 0;
    transition: opacity 0.2s, transform 0.2s;
    pointer-events: none;
    z-index: 200;
    white-space: nowrap;
}
.ws-toast.ws-toast-error { background: #c0392b; }
.ws-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

/* Delete modal */
.modal-overlay {
    position: fixed; inset: 0;
    background: rgba(255,255,255,0.92);
    z-index: 1000; display: none; align-items: center; justify-content: center;
    backdrop-filter: blur(4px);
}
.modal-overlay.show { display: flex; }
.modal-content {
    background: var(--white);
    border: 1px solid var(--black);
    width: 100%; max-width: 480px; padding: 0;
}
.modal-head {
    display: flex; justify-content: space-between; align-items: center;
    padding: 14px 20px; border-bottom: var(--rule);
}
.modal-head .lab { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; }
.modal-body { padding: 32px 40px; }
.modal-title { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 12px; }
.modal-message { font-size: 15px; line-height: 1.6; color: var(--gray-700); }
.modal-actions {
    display: flex; gap: 12px; padding: 24px 40px 32px;
}
.modal-btn {
    padding: 14px 24px; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700;
    letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; border: 1px solid var(--black);
}
.modal-btn-confirm { background: var(--black); color: var(--white); }
.modal-btn-confirm:hover { background: #c0392b; border-color: #c0392b; }
.modal-btn-cancel { background: transparent; color: var(--black); }
.modal-btn-cancel:hover { background: var(--gray-100); }

@media (max-width: 900px) {
    .ws-hero { grid-template-columns: 1fr; padding: 32px 0 24px; }
    .ws-hero .ws-hero-num { display: none; }
    .ws-hero .ws-hero-title { grid-column: 1 / -1; font-size: 32px; }
    .ws-hero .ws-hero-lede { grid-column: 1 / -1; padding-top: 12px; }
    .workspace-table-head { display: none; }
    .workspace-table-row { grid-template-columns: 1fr auto; grid-template-rows: auto auto; gap: 4px 8px; }
    .ws-col-status { grid-row: 1; grid-column: 2; }
    .ws-col-title { grid-row: 1; grid-column: 1; }
    .ws-col-type { grid-row: 2; grid-column: 1; font-size: 10px; }
    .ws-col-date { display: none; }
    .ws-col-actions { grid-row: 2; grid-column: 2; }
}
`;

const BODY_HTML = `
<div class="container">
    ${renderTopbar('workspace', 'english')}

    <header class="hero">
        <div class="index">&#8470; 02</div>
        <div class="headline">
            <h1 id="heroTitle">Workspace<span class="amp">.</span></h1>
        </div>
        <p class="lede" id="heroLede">Your saved drafts and finished pieces. Edit inline, autosave while you write.</p>
    </header>

    <div class="ws-filter-bar" id="wsFilterBar">
        <button class="ws-filter-tab active" data-filter="all" id="filterAll">All</button>
        <button class="ws-filter-tab" data-filter="draft" id="filterDraft">Draft</button>
        <button class="ws-filter-tab" data-filter="final" id="filterFinal">Final</button>
    </div>

    <div class="workspace-table" id="workspaceTable">
        <div class="workspace-table-head" id="wsTableHead">
            <div>STATUS</div>
            <div>TITLE</div>
            <div>TYPE</div>
            <div>DATE</div>
            <div></div>
        </div>
        <div id="draftList"></div>
        <div class="ws-empty" id="wsEmpty" hidden>
            <div class="ws-empty-ornament">∅</div>
            <div class="ws-empty-title" id="wsEmptyTitle">No drafts yet.</div>
            <p class="ws-empty-msg" id="wsEmptyMsg">Generate an article and save it to your Workspace to see it here.</p>
            <a href="/" class="ws-empty-cta" id="wsEmptyCta">Go to Generator →</a>
        </div>
    </div>

    <div class="editor-panel" id="editorPanel">
        <input type="text" class="editor-title-input" id="editorTitle" placeholder="Draft title…" autocomplete="off">
        <div class="editor-autosave-bar" id="autosaveBar">
            <span class="as-dot"></span>
            <span id="autosaveLabel">AUTOSAVE</span>
        </div>
        <textarea class="editor-content" id="editorContent" placeholder="Your content…"></textarea>
        <div class="editor-toolbar">
            <button class="toolbar-btn" id="editorSaveBtn">Save</button>
            <button class="toolbar-btn secondary" id="editorToggleStatusBtn">Mark Final</button>
            <button class="toolbar-btn secondary" id="editorCloseBtn">Close</button>
            <button class="toolbar-btn danger" id="editorDeleteBtn">Delete</button>
        </div>
    </div>

    ${renderFooter(FOOTER_STRINGS['english'])}
</div>

${ARCHIVAL_DETAILS_HTML}

<div class="ws-toast" id="wsToast"></div>

<div class="modal-overlay" id="confirmationModal">
    <div class="modal-content">
        <div class="modal-head">
            <span class="lab" id="modalLab">CONFIRM</span>
            <span id="modalEscClose">ESC TO CLOSE</span>
        </div>
        <div class="modal-body">
            <h3 class="modal-title" id="modalTitle"></h3>
            <p class="modal-message" id="modalMessage"></p>
            <div class="modal-extra" id="modalExtra" style="display: none;"></div>
        </div>
        <div class="modal-actions">
            <button class="modal-btn modal-btn-cancel" id="modalCancel">Cancel</button>
            <button class="modal-btn modal-btn-confirm" id="modalConfirm">Confirm</button>
        </div>
    </div>
</div>

<div class="modal-overlay" id="deleteModal">
    <div class="modal-content">
        <div class="modal-head">
            <span class="lab" id="deleteModalLab">CONFIRM</span>
        </div>
        <div class="modal-body">
            <h3 class="modal-title" id="deleteModalTitle">Delete Draft</h3>
            <p class="modal-message" id="deleteModalMsg">This will permanently delete the draft. This action cannot be undone.</p>
        </div>
        <div class="modal-actions">
            <button class="modal-btn modal-btn-cancel" id="deleteModalCancel">Cancel</button>
            <button class="modal-btn modal-btn-confirm" id="deleteModalConfirm">Delete</button>
        </div>
    </div>
</div>
`;

const SCRIPT = `
(function() {
    var I18N = window.__QUILL_I18N__;
    var TOPBARS = window.__QUILL_TOPBAR__;
    var lang = localStorage.getItem('uiLanguage') || 'english';
    var t = I18N.workspace[lang];
    var activeFilter = 'all';
    var drafts = [];
    var openDraftId = null;
    var autosaveTimer = null;
    var deleteTargetId = null;

    // ── Auth guard ──────────────────────────────────────────────────────────
    var uid = localStorage.getItem('quillAuthUid');
    if (!uid) {
        window.location.href = '/login?redirect=/workspace';
        return;
    }

    // ── Toast ────────────────────────────────────────────────────────────────
    function showToast(msg, isError) {
        var toast = document.getElementById('wsToast');
        if (!toast) return;
        toast.textContent = msg;
        toast.className = 'ws-toast' + (isError ? ' ws-toast-error' : '') + ' show';
        clearTimeout(toast._t);
        toast._t = setTimeout(function() { toast.className = 'ws-toast' + (isError ? ' ws-toast-error' : ''); }, 2800);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────
    function typeLabel(type) {
        var map = {
            article: t.typeArticle,
            shortstory: t.typeShortStory,
            news: t.typeNews,
            shortnews: t.typeShortNews,
            novel: t.typeNovel,
        };
        return map[type] || type;
    }

    function formatDate(iso) {
        try {
            var d = new Date(iso);
            return d.toLocaleDateString(lang === 'indonesian' ? 'id-ID' : 'en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
        } catch(e) { return iso.slice(0, 10); }
    }

    function escapeHtml(s) {
        return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    // ── Render draft list ─────────────────────────────────────────────────────
    function renderDrafts(isLoading) {
        var list = document.getElementById('draftList');
        var empty = document.getElementById('wsEmpty');
        var head = document.getElementById('wsTableHead');
        if (!list || !empty || !head) return;

        if (isLoading) {
            list.innerHTML = '<div class="ws-loading" style="padding: 48px; text-align: center; font-family: \\'JetBrains Mono\\', monospace; font-size: 11px; letter-spacing: 0.12em; color: var(--gray-600);">LOADING ARCHIVES…</div>';
            empty.hidden = true;
            head.style.display = 'none';
            return;
        }
        
        var filtered = drafts.filter(function(d) {
            if (activeFilter === 'all') return true;
            return d.status === activeFilter;
        });
        
        if (filtered.length === 0) {
            list.innerHTML = '';
            empty.hidden = false;
            head.style.display = 'none';
            return;
        }
        
        empty.hidden = true;
        head.style.display = 'grid';
        list.innerHTML = filtered.map(function(d) {
            var badgeClass = d.status === 'final' ? 'draft-badge-final' : 'draft-badge-draft';
            var isOpen = d.id === openDraftId;
            return '<div class="workspace-table-row' + (isOpen ? ' open' : '') + '" data-id="' + escapeHtml(d.id) + '">' +
                '<div class="ws-col-status"><span class="draft-badge ' + badgeClass + '">' + (d.status === 'final' ? t.statusFinal : t.statusDraft) + '</span></div>' +
                '<div class="ws-col-title">' + escapeHtml(d.title) + '</div>' +
                '<div class="ws-col-type">' + escapeHtml(typeLabel(d.type)) + '</div>' +
                '<div class="ws-col-date">' + formatDate(d.updatedAt) + '</div>' +
                '<div class="ws-col-actions">' +
                    '<button class="ws-action-btn" data-action="edit" data-id="' + escapeHtml(d.id) + '">' + t.actionEdit + '</button>' +
                    '<button class="ws-action-btn danger" data-action="delete" data-id="' + escapeHtml(d.id) + '">' + t.actionDelete + '</button>' +
                '</div>' +
            '</div>';
        }).join('');

        // Bind row clicks
        list.querySelectorAll('[data-action="edit"]').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                openEditor(btn.getAttribute('data-id'));
            });
        });
        list.querySelectorAll('[data-action="delete"]').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                openDeleteModal(btn.getAttribute('data-id'));
            });
        });
    }

    // ── Fetch drafts ──────────────────────────────────────────────────────────
    function loadDrafts() {
        renderDrafts(true);
        fetch('/api/workspace/drafts')
            .then(function(r) {
                if (r.status === 401) { window.location.href = '/login?redirect=/workspace'; return null; }
                if (!r.ok) throw new Error('load failed');
                return r.json();
            })
            .then(function(data) {
                if (!data) return;
                drafts = data.drafts || [];
                renderDrafts(false);
            })
            .catch(function() { showToast(t.loadError, true); renderDrafts(false); });
    }

    // ── Editor ────────────────────────────────────────────────────────────────
    function openEditor(id) {
        var draft = drafts.find(function(d) { return d.id === id; });
        if (!draft) return;
        openDraftId = id;
        var panel = document.getElementById('editorPanel');
        var titleInput = document.getElementById('editorTitle');
        var contentArea = document.getElementById('editorContent');
        var toggleBtn = document.getElementById('editorToggleStatusBtn');
        if (!panel || !titleInput || !contentArea) return;

        // Fetch full content
        fetch('/api/workspace/drafts/' + id)
            .then(function(r) { return r.json(); })
            .then(function(data) {
                titleInput.value = data.draft.title || '';
                contentArea.value = data.draft.content || '';
                // Update draft in local list with full content
                var idx = drafts.findIndex(function(d) { return d.id === id; });
                if (idx >= 0) drafts[idx] = Object.assign(drafts[idx], data.draft);
                if (data.pendingAutosave) {
                    var bar = document.getElementById('autosaveBar');
                    if (bar) bar.classList.add('active');
                }
            })
            .catch(function() {});

        toggleBtn.textContent = draft.status === 'final' ? t.actionMarkDraft : t.actionMarkFinal;
        toggleBtn.dataset.currentStatus = draft.status;

        panel.classList.add('open');
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        renderDrafts();
    }

    function closeEditor() {
        clearTimeout(autosaveTimer);
        document.getElementById('editorPanel').classList.remove('open');
        var bar = document.getElementById('autosaveBar');
        if (bar) bar.classList.remove('active');
        openDraftId = null;
        renderDrafts();
    }

    function triggerAutosave() {
        if (!openDraftId) return;
        var titleInput = document.getElementById('editorTitle');
        var contentArea = document.getElementById('editorContent');
        if (!contentArea) return;
        var bar = document.getElementById('autosaveBar');
        fetch('/api/workspace/drafts/' + openDraftId + '/autosave', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: contentArea.value, title: titleInput ? titleInput.value : undefined }),
        }).then(function() {
            if (bar) bar.classList.add('active');
        }).catch(function() {});
    }

    // ── Filter tabs ───────────────────────────────────────────────────────────
    document.getElementById('wsFilterBar').addEventListener('click', function(e) {
        var tab = e.target.closest('.ws-filter-tab');
        if (!tab) return;
        document.querySelectorAll('.ws-filter-tab').forEach(function(t) { t.classList.remove('active'); });
        tab.classList.add('active');
        activeFilter = tab.getAttribute('data-filter');
        renderDrafts();
    });

    // ── Editor controls ───────────────────────────────────────────────────────
    document.getElementById('editorContent').addEventListener('input', function() {
        clearTimeout(autosaveTimer);
        autosaveTimer = setTimeout(triggerAutosave, 30000);
    });
    document.getElementById('editorTitle').addEventListener('input', function() {
        clearTimeout(autosaveTimer);
        autosaveTimer = setTimeout(triggerAutosave, 30000);
    });

    document.getElementById('editorSaveBtn').addEventListener('click', function() {
        if (!openDraftId) return;
        var titleInput = document.getElementById('editorTitle');
        var contentArea = document.getElementById('editorContent');
        var btn = this;
        btn.disabled = true;
        btn.textContent = '…';
        fetch('/api/workspace/drafts/' + openDraftId, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: titleInput.value, content: contentArea.value }),
        })
        .then(function(r) { return r.json(); })
        .then(function(data) {
            var idx = drafts.findIndex(function(d) { return d.id === openDraftId; });
            if (idx >= 0) drafts[idx] = Object.assign(drafts[idx], data.draft);
            var bar = document.getElementById('autosaveBar');
            if (bar) bar.classList.remove('active');
            showToast(t.saveSuccess, false);
            clearTimeout(autosaveTimer);
        })
        .catch(function() { showToast(t.saveError, true); })
        .finally(function() { btn.disabled = false; btn.textContent = t.actionSave; });
    });

    document.getElementById('editorToggleStatusBtn').addEventListener('click', function() {
        if (!openDraftId) return;
        var current = this.dataset.currentStatus || 'draft';
        var next = current === 'final' ? 'draft' : 'final';
        var btn = this;
        fetch('/api/workspace/drafts/' + openDraftId, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: next }),
        })
        .then(function(r) { return r.json(); })
        .then(function(data) {
            var idx = drafts.findIndex(function(d) { return d.id === openDraftId; });
            if (idx >= 0) drafts[idx] = Object.assign(drafts[idx], data.draft);
            btn.dataset.currentStatus = next;
            btn.textContent = next === 'final' ? t.actionMarkDraft : t.actionMarkFinal;
            renderDrafts();
        })
        .catch(function() { showToast(t.saveError, true); });
    });

    document.getElementById('editorCloseBtn').addEventListener('click', closeEditor);

    document.getElementById('editorDeleteBtn').addEventListener('click', function() {
        if (!openDraftId) return;
        openDeleteModal(openDraftId);
    });

    function showModal(title, message, onConfirm, cancelText, confirmText, opts) {
        const modal = document.getElementById('confirmationModal');
        const lab = document.getElementById('modalLab');
        const escClose = document.getElementById('modalEscClose');
        const modalExtra = document.getElementById('modalExtra');
        if (lab) lab.textContent = t.confirmLabel;
        if (escClose) escClose.textContent = t.escToClose;
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalMessage').textContent = message;
        const cancelBtn = document.getElementById('modalCancel');
        const confirmBtn = document.getElementById('modalConfirm');
        cancelBtn.textContent = cancelText || 'Cancel';
        confirmBtn.textContent = confirmText || 'Confirm';

        modalExtra.style.display = 'none';
        modalExtra.innerHTML = '';
        if (opts && opts.checkboxLabel) {
            modalExtra.style.display = 'block';
            const id = 'modalCheck' + Math.random().toString(36).slice(2);
            modalExtra.innerHTML = '<div style="margin-top:20px;display:flex;align-items:center;gap:10px;cursor:pointer">' +
                '<input type="checkbox" id="' + id + '" ' + (opts.checkboxDefault ? 'checked' : '') + ' style="cursor:pointer">' +
                '<label for="' + id + '" style="font-size:13px;color:var(--gray-800);cursor:pointer">' + opts.checkboxLabel + '</label></div>';
        }

        const handleEsc = (e) => { if (e.key === 'Escape') closeModal(); };
        const closeModal = () => {
            modal.classList.remove('show');
            document.removeEventListener('keydown', handleEsc);
        };

        cancelBtn.onclick = closeModal;
        confirmBtn.onclick = () => {
            let val;
            if (opts && opts.checkboxLabel) val = modalExtra.querySelector('input').checked;
            onConfirm(val);
            closeModal();
        };

        modal.classList.add('show');
        document.addEventListener('keydown', handleEsc);
    }

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
        const newKey = (localStorage.getItem('quillAuthUid') ? ('geminiApiKey.' + localStorage.getItem('quillAuthUid')) : 'geminiApiKey');
        if (keepKey && previousKey) {
            localStorage.setItem(newKey, previousKey);
        } else {
            localStorage.setItem(newKey, '');
        }
        syncAuthPill();
        syncByokStatus();
        location.reload();
    }

    document.addEventListener('click', function(e) {
        var target = e.target;
        if (!target) return;
        var btn = target.closest('#authSignOutBtn');
        if (!btn) return;
        e.preventDefault();
        showModal(
            t.signOutConfirmTitle,
            t.signOutConfirmMessage,
            function(keepKey) { performSignOut(keepKey); },
            t.cancelButton,
            t.signOutConfirmButton,
            { checkboxLabel: t.signOutKeepKeyLabel, checkboxDefault: true }
        );
    });

    // ── Delete modal ──────────────────────────────────────────────────────────
    function openDeleteModal(id) {
        deleteTargetId = id;
        document.getElementById('deleteModal').classList.add('show');
    }
    function closeDeleteModal() {
        document.getElementById('deleteModal').classList.remove('show');
        deleteTargetId = null;
    }

    document.getElementById('deleteModalCancel').addEventListener('click', closeDeleteModal);
    document.getElementById('deleteModalConfirm').addEventListener('click', function() {
        if (!deleteTargetId) return;
        var id = deleteTargetId;
        closeDeleteModal();
        if (openDraftId === id) closeEditor();
        fetch('/api/workspace/drafts/' + id, { method: 'DELETE' })
            .then(function(r) {
                if (!r.ok) throw new Error('delete failed');
                drafts = drafts.filter(function(d) { return d.id !== id; });
                renderDrafts();
                showToast(t.deleteSuccess, false);
            })
            .catch(function() { showToast(t.deleteError, true); });
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeDeleteModal();
            closeAccountMenu();
        }
    });

    // ── Account menu (shared pattern) ─────────────────────────────────────────
    function syncAuthPill() {
        var name = localStorage.getItem('quillAuthName');
        uid = localStorage.getItem('quillAuthUid');
        var trigger = document.getElementById('accountTrigger');
        var signIn = document.getElementById('authSignInLink');
        if (!trigger || !signIn) return;
        if (uid) {
            trigger.hidden = false;
            signIn.hidden = true;
            var initials = (name || uid).slice(0, 2).toUpperCase();
            var av = document.getElementById('accountAvatar');
            var avLg = document.getElementById('accountAvatarLg');
            var trigName = document.getElementById('accountTriggerName');
            var ddName = document.getElementById('accountName');
            var ddEmail = document.getElementById('accountEmail');
            var footUid = document.getElementById('accountFootUid');
            if (av) av.textContent = initials;
            if (avLg) avLg.textContent = initials;
            if (trigName) trigName.textContent = name || 'Account';
            if (ddName) ddName.textContent = name || 'Account';
            if (ddEmail) ddEmail.textContent = uid || '';
            if (footUid) footUid.textContent = uid ? 'UID ' + uid.slice(0, 8) + (uid.length > 8 ? '\\u2026' : '') : '';
        } else {
            trigger.hidden = true;
            signIn.hidden = false;
        }
    }

    function syncByokStatus() {
        var authUid = localStorage.getItem('quillAuthUid');
        var keyStorageKey = authUid ? ('geminiApiKey.' + authUid) : 'geminiApiKey';
        var apiKey = localStorage.getItem(keyStorageKey);
        var chip = document.getElementById('byokStatus');
        var stateText = document.getElementById('byokStateText');
        if (chip) chip.setAttribute('data-state', apiKey ? 'ok' : 'missing');
        var tb = window.__QUILL_TOPBAR_STRINGS__[localStorage.getItem('uiLanguage') || 'english'];
        if (stateText) stateText.textContent = apiKey ? tb.byokSet : tb.byokMissing;
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
    }

    // ── i18n repaint ──────────────────────────────────────────────────────────
    function repaint(newLang) {
        t = I18N.workspace[newLang];
        lang = newLang;
        var topbar = document.querySelector('.topbar');
        if (topbar && TOPBARS[newLang]) topbar.outerHTML = TOPBARS[newLang];
        var el = function(id) { return document.getElementById(id); };
        var heroTitle = el('heroTitle');
        if (heroTitle) heroTitle.innerHTML = t.title.replace(/\\./, '<span class="amp">.</span>');
        if (el('heroLede')) el('heroLede').textContent = t.lede;
        if (el('filterAll')) el('filterAll').textContent = t.filterAll;
        if (el('filterDraft')) el('filterDraft').textContent = t.filterDraft;
        if (el('filterFinal')) el('filterFinal').textContent = t.filterFinal;
        if (el('wsEmptyTitle')) el('wsEmptyTitle').textContent = t.emptyTitle;
        if (el('wsEmptyMsg')) el('wsEmptyMsg').textContent = t.emptyMsg;
        if (el('wsEmptyCta')) el('wsEmptyCta').textContent = t.emptyCtaLabel;
        if (el('editorTitle')) el('editorTitle').placeholder = t.editorTitlePlaceholder;
        if (el('editorContent')) el('editorContent').placeholder = t.editorContentPlaceholder;
        if (el('autosaveLabel')) el('autosaveLabel').textContent = t.autosaveLabel;
        if (el('editorSaveBtn')) el('editorSaveBtn').textContent = t.actionSave;
        if (el('editorCloseBtn')) el('editorCloseBtn').textContent = t.actionClose;
        if (el('deleteModalTitle')) el('deleteModalTitle').textContent = t.deleteConfirmTitle;
        if (el('deleteModalMsg')) el('deleteModalMsg').textContent = t.deleteConfirmMessage;
        if (el('deleteModalCancel')) el('deleteModalCancel').textContent = t.cancelButton;
        if (el('deleteModalConfirm')) el('deleteModalConfirm').textContent = t.deleteConfirmButton;
        var wsHead = document.getElementById('wsTableHead');
        if (wsHead) wsHead.innerHTML = '<div>' + t.colStatus + '</div><div>' + t.colTitle + '</div><div>' + t.colType + '</div><div>' + t.colDate + '</div><div></div>';
        setupAccountMenu();
        syncAuthPill();
        syncByokStatus();
        renderDrafts();
    }

    // ── Storage listener (cross-tab auth changes) ─────────────────────────────
    window.addEventListener('storage', function(e) {
        if (e.key === 'uiLanguage') repaint(e.newValue || 'english');
        if (e.key === 'quillAuthUid' || e.key === 'quillAuthName') syncAuthPill();
    });

    // ── Boot ──────────────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', function() {
        setupAccountMenu();
        syncAuthPill();
        syncByokStatus();
        repaint(localStorage.getItem('uiLanguage') || 'english');
        loadDrafts();

        if (window.renderSpecimen) {
            document.querySelectorAll('svg[data-specimen-seed]').forEach(function(svg) {
                window.renderSpecimen(svg, svg.getAttribute('data-specimen-seed'));
            });
        }
    });
})();
`;

export function generateWorkspacePageHTML(locale: Locale = 'english'): string {
  const strings = WORKSPACE_STRINGS[locale];
  const footerStrings = FOOTER_STRINGS[locale];
  return `<!DOCTYPE html>
<html lang="${locale}">
${renderHead({ title: strings.documentTitle, pageStyles: PAGE_CSS })}
<body>
${BODY_HTML}
<script>
window.__QUILL_I18N__ = ${JSON.stringify({ workspace: WORKSPACE_STRINGS, footer: FOOTER_STRINGS })};
window.__QUILL_INITIAL_LOCALE__ = ${JSON.stringify(locale)};
window.__QUILL_TOPBAR__ = ${JSON.stringify({
    english: renderTopbar('workspace', 'english'),
    indonesian: renderTopbar('workspace', 'indonesian'),
  })};
window.__QUILL_TOPBAR_STRINGS__ = ${JSON.stringify({
    english: getTopbarStrings('english'),
    indonesian: getTopbarStrings('indonesian'),
  })};
</script>
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
