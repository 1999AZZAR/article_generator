import { WORKSPACE_STRINGS, COMMON_STRINGS, Locale } from './i18n';
import { renderHead, renderFooter, renderTopbar, getTopbarStrings, ARCHIVAL_DETAILS_HTML, FOOTER_STRINGS, COMMON_JS } from './styles';
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
.ws-modal-overlay { display: none; }
.ws-modal-overlay:not([hidden]) {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.55);
    z-index: 100;
    display: flex; align-items: center; justify-content: center;
}
.ws-modal {
    background: var(--white);
    border: 1px solid var(--black);
    padding: 0;
    max-width: 400px;
    width: 90%;
}
.ws-modal-head {
    padding: 16px 20px;
    border-bottom: var(--rule);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
}
.ws-modal-body {
    padding: 20px;
    font-size: 14px;
    line-height: 1.6;
    color: var(--gray-600);
}
.ws-modal-actions {
    display: flex;
    gap: 8px;
    padding: 12px 20px 16px;
    justify-content: flex-end;
    border-top: var(--rule-soft);
}

@media (max-width: 900px) {
    .hero { padding: 32px 0 24px; }
    .hero .index { display: none; }
    .hero .headline { grid-column: 1 / -1; }
    .hero h1 { font-size: 32px; }
    .hero .lede { grid-column: 1 / -1; padding-top: 12px; }
    
    .workspace-table-head { display: none; }
    .workspace-table-row { grid-template-columns: 1fr auto; grid-template-rows: auto auto; gap: 4px 8px; }
    .ws-col-status { grid-row: 1; grid-column: 2; }
    .ws-col-title { grid-row: 1; grid-column: 1; }
    .ws-col-type { grid-row: 2; grid-column: 1; font-size: 10px; }
    .ws-col-date { display: none; }
    .ws-col-actions { grid-row: 2; grid-column: 2; }
}
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
    function renderDrafts() {
        var list = document.getElementById('draftList');
        var empty = document.getElementById('wsEmpty');
        if (!list || !empty) return;
        var filtered = drafts.filter(function(d) {
            if (activeFilter === 'all') return true;
            return d.status === activeFilter;
        });
        if (filtered.length === 0) {
            list.innerHTML = '';
            empty.hidden = false;
            return;
        }
        empty.hidden = true;
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
        fetch('/api/workspace/drafts')
            .then(function(r) {
                if (r.status === 401) { window.location.href = '/login?redirect=/workspace'; return null; }
                if (!r.ok) throw new Error('load failed');
                return r.json();
            })
            .then(function(data) {
                if (!data) return;
                drafts = data.drafts || [];
                renderDrafts();
            })
            .catch(function() { showToast(t.loadError, true); });
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

    // ── Delete modal ──────────────────────────────────────────────────────────
    function openDeleteModal(id) {
        deleteTargetId = id;
        document.getElementById('deleteModal').hidden = false;
    }
    function closeDeleteModal() {
        document.getElementById('deleteModal').hidden = true;
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

    // ── i18n repaint ──────────────────────────────────────────────────────────
    function repaint(newLang) {
        t = I18N.workspace[newLang];
        lang = newLang;
        var topbar = document.querySelector('.topbar');
        if (topbar && TOPBARS[newLang]) {
            var tmp = document.createElement('div');
            tmp.innerHTML = TOPBARS[newLang];
            topbar.replaceWith(tmp.firstElementChild);
            window.setupAccountMenu();
            window.syncAuthPill();
            window.syncByokStatus();
        }
        var el = function(id) { return document.getElementById(id); };
        
        var heroTitle = el('heroTitle');
        if (heroTitle) {
            heroTitle.innerHTML = t.title.replace(/\\./, '<span class="amp">.</span>');
        }
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
        
        // Repaint Footer
        const footerEl = document.querySelector('.footer');
        if (footerEl) {
            const footerStrings = I18N.footer[newLang];
            footerEl.querySelector('.col-1').innerHTML = footerStrings.copyright;
            footerEl.querySelector('.col-2').innerHTML = footerStrings.typeface;
            footerEl.querySelector('.col-3').innerHTML = footerStrings.by.replace('{link}', '<a href="https://azzar.netlify.app/porto" target="_blank">LilyOpenCMS</a>');
        }

        renderDrafts();
    }

    // ── Storage listener (cross-tab auth changes) ─────────────────────────────
    window.addEventListener('storage', function(e) {
        if (e.key === 'uiLanguage') repaint(e.newValue || 'english');
        if (e.key === 'quillAuthUid' || e.key === 'quillAuthName') window.syncAuthPill();
        if (e.key.indexOf('geminiApiKey') === 0) window.syncByokStatus();
    });

    // ── Boot ──────────────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', function() {
        window.setupAccountMenu();
        window.syncAuthPill();
        window.syncByokStatus();
        repaint(localStorage.getItem('uiLanguage') || 'english');
        loadDrafts();

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeDeleteModal();
                if (window.closeAccountMenu) window.closeAccountMenu();
            }
        });

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
  const topbarHtml = renderTopbar('workspace', locale);
  const footerHtml = renderFooter(footerStrings);

  return `<!DOCTYPE html>
<html lang="${locale}">
${renderHead({ title: strings.documentTitle, pageStyles: PAGE_CSS })}
<body>
<div class="container">
    ${topbarHtml}

    <header class="hero">
        <div class="index">№ 02</div>
        <div class="headline">
            <h1 id="heroTitle">${strings.title.replace(/\./, '<span class="amp">.</span>')}</h1>
        </div>
        <p class="lede" id="heroLede">${strings.lede}</p>
    </header>

    <div class="ws-filter-bar" id="wsFilterBar">
        <button class="ws-filter-tab active" data-filter="all" id="filterAll">${strings.filterAll}</button>
        <button class="ws-filter-tab" data-filter="draft" id="filterDraft">${strings.filterDraft}</button>
        <button class="ws-filter-tab" data-filter="final" id="filterFinal">${strings.filterFinal}</button>
    </div>

    <div class="workspace-table" id="workspaceTable">
        <div class="workspace-table-head" id="wsTableHead">
            <div>${strings.colStatus}</div>
            <div>${strings.colTitle}</div>
            <div>${strings.colType}</div>
            <div>${strings.colDate}</div>
            <div></div>
        </div>
        <div id="draftList"></div>
        <div class="ws-empty" id="wsEmpty" hidden>
            <div class="ws-empty-ornament">∅</div>
            <div class="ws-empty-title" id="wsEmptyTitle">${strings.emptyTitle}</div>
            <p class="ws-empty-msg" id="wsEmptyMsg">${strings.emptyMsg}</p>
            <a href="/" class="ws-empty-cta" id="wsEmptyCta">${strings.emptyCtaLabel}</a>
        </div>
    </div>

    <div class="editor-panel" id="editorPanel">
        <input type="text" class="editor-title-input" id="editorTitle" placeholder="${strings.editorTitlePlaceholder}" autocomplete="off">
        <div class="editor-autosave-bar" id="autosaveBar">
            <span class="as-dot"></span>
            <span id="autosaveLabel">${strings.autosaveLabel}</span>
        </div>
        <textarea class="editor-content" id="editorContent" placeholder="${strings.editorContentPlaceholder}"></textarea>
        <div class="editor-toolbar">
            <button class="toolbar-btn" id="editorSaveBtn">${strings.actionSave}</button>
            <button class="toolbar-btn secondary" id="editorToggleStatusBtn">${strings.actionMarkFinal}</button>
            <button class="toolbar-btn secondary" id="editorCloseBtn">${strings.actionClose}</button>
            <button class="toolbar-btn danger" id="editorDeleteBtn">${strings.actionDelete}</button>
        </div>
    </div>

    ${footerHtml}
</div>

${ARCHIVAL_DETAILS_HTML}

<div class="ws-toast" id="wsToast"></div>

<div class="ws-modal-overlay" id="deleteModal" hidden>
    <div class="ws-modal">
        <div class="ws-modal-head" id="deleteModalTitle">${strings.deleteConfirmTitle}</div>
        <div class="ws-modal-body" id="deleteModalMsg">${strings.deleteConfirmMessage}</div>
        <div class="ws-modal-actions">
            <button class="toolbar-btn secondary" id="deleteModalCancel">${strings.cancelButton}</button>
            <button class="toolbar-btn danger" id="deleteModalConfirm" style="background:#c0392b;border-color:#c0392b;color:#fff">${strings.deleteConfirmButton}</button>
        </div>
    </div>
</div>

<script>
window.__QUILL_I18N__ = ${JSON.stringify({ workspace: WORKSPACE_STRINGS, common: COMMON_STRINGS, footer: FOOTER_STRINGS })};
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
