// Custom q-select dropdown component. Replaces the native OS dropdown menu
// (which can't be styled) with a Swiss-styled custom menu. The native <select>
// stays in the DOM as the source of truth — it's hidden visually, kept in the
// form's submission path, and updated whenever the user picks an option. Any
// change to the underlying <select> (e.g. via saveFormData) re-syncs the trigger
// label, so the form's existing data binding code keeps working.

export const SELECT_CSS = `
/* ========== CUSTOM q-select ========== */
.q-select {
    position: relative;
    width: 100%;
    font-family: 'Inter', sans-serif;
}
.q-select-native-hidden {
    position: absolute !important;
    left: -9999px !important;
    top: 0 !important;
    width: 1px !important;
    height: 1px !important;
    opacity: 0 !important;
    pointer-events: none !important;
}
.q-select-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: none;
    border-bottom: 1px solid var(--black);
    background: var(--white);
    padding: 6px 0 8px 0;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: var(--black);
    border-radius: 0;
    outline: none;
    cursor: pointer;
    text-align: left;
    transition: border-color 120ms linear;
    -webkit-appearance: none;
    appearance: none;
}
.q-select-trigger:hover { border-bottom-color: var(--accent); }
.q-select-trigger:focus { border-bottom: 2px solid var(--accent); padding-bottom: 7px; }
.q-select-value {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 400;
}
.q-select-value.q-select-placeholder { color: var(--gray-600); }
.q-select-chevron {
    width: 12px;
    height: 8px;
    margin-left: 12px;
    flex-shrink: 0;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' stroke='%23000' stroke-width='1.4' fill='none'/></svg>");
    background-repeat: no-repeat;
    background-position: center;
    transition: transform 120ms linear;
}
.q-select-open .q-select-chevron { transform: rotate(180deg); }
.q-select-dropdown {
    position: absolute;
    top: calc(100% + 2px);
    left: 0;
    right: 0;
    z-index: 1000;
    background: var(--white);
    border: 1px solid var(--black);
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    max-height: 320px;
    display: flex;
    flex-direction: column;
    min-width: 100%;
}
.q-select-dropdown[hidden] { display: none !important; }
.q-select-search-wrap {
    border-bottom: 1px solid var(--gray-300);
    padding: 8px 10px;
    background: var(--white);
    position: sticky;
    top: 0;
    z-index: 1;
}
.q-select-search {
    width: 100%;
    border: none;
    border-bottom: 1px solid var(--gray-300);
    background: var(--white);
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: var(--black);
    padding: 4px 0;
    outline: none;
    border-radius: 0;
    box-sizing: border-box;
}
.q-select-search:focus { border-bottom-color: var(--accent); }
.q-select-search::placeholder { color: var(--gray-600); }
.q-select-options {
    overflow-y: auto;
    flex: 1;
    padding: 4px 0;
}
.q-select-group-label {
    padding: 10px 12px 4px 14px;
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--gray-600);
    font-family: 'Inter', sans-serif;
    background: var(--white);
}
.q-select-group-label[hidden] { display: none; }
.q-select-option {
    width: 100%;
    text-align: left;
    border: none;
    background: transparent;
    padding: 8px 12px 8px 16px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: var(--black);
    cursor: pointer;
    border-left: 2px solid transparent;
    outline: none;
    transition: background 80ms linear, color 80ms linear, border-left-color 80ms linear;
    line-height: 1.4;
    display: block;
}
.q-select-option:hover {
    background: var(--gray-100);
    border-left-color: var(--black);
}
.q-select-option:focus {
    background: var(--gray-100);
    border-left-color: var(--black);
    outline: none;
}
.q-select-option.selected {
    background: var(--black);
    color: var(--white);
    border-left-color: var(--accent);
    font-weight: 500;
}
.q-select-option.selected:hover,
.q-select-option.selected:focus {
    background: var(--black);
    color: var(--white);
    border-left-color: var(--accent);
}
.q-select-option[disabled] {
    color: var(--gray-600);
    cursor: not-allowed;
    font-style: italic;
}
.q-select-option[hidden] { display: none !important; }
.q-select-empty {
    padding: 16px 12px;
    font-size: 12px;
    color: var(--gray-600);
    font-style: italic;
    text-align: center;
}
`;

export const SELECT_SCRIPT = `
(function() {
    if (window.__QUILL_SELECT_ENHANCED__) return;
    window.__QUILL_SELECT_ENHANCED__ = true;

    function enhanceSelects(root) {
        (root || document).querySelectorAll('select:not(.q-select-enhanced)').forEach(enhanceSelect);
    }
    function rebuildAllSelects(root) {
        (root || document).querySelectorAll('select.q-select-enhanced').forEach(function(sel) {
            if (typeof sel._qSelectRebuild === 'function') sel._qSelectRebuild();
        });
    }
    window.enhanceSelects = enhanceSelects;
    window.rebuildAllSelects = rebuildAllSelects;

    function enhanceSelect(sel) {
        if (sel.classList.contains('q-select-enhanced')) return;
        sel.classList.add('q-select-enhanced');
        sel.classList.add('q-select-native-hidden');
        sel.setAttribute('aria-hidden', 'true');
        sel.setAttribute('tabindex', '-1');

        var wrapper = document.createElement('div');
        wrapper.className = 'q-select';
        wrapper.setAttribute('data-for', sel.id || '');

        var trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'q-select-trigger';
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', 'false');

        var valueEl = document.createElement('span');
        valueEl.className = 'q-select-value';
        var chevron = document.createElement('span');
        chevron.className = 'q-select-chevron';
        chevron.setAttribute('aria-hidden', 'true');
        trigger.appendChild(valueEl);
        trigger.appendChild(chevron);

        var dropdown = document.createElement('div');
        dropdown.className = 'q-select-dropdown';
        dropdown.setAttribute('role', 'listbox');
        dropdown.hidden = true;

        var optionsEl = document.createElement('div');
        optionsEl.className = 'q-select-options';
        dropdown.appendChild(optionsEl);

        var search = null;
        var totalOptions = 0;
        Array.prototype.forEach.call(sel.options, function(o) { if (!o.disabled) totalOptions++; });
        if (totalOptions > 8) {
            var searchWrap = document.createElement('div');
            searchWrap.className = 'q-select-search-wrap';
            search = document.createElement('input');
            search.type = 'text';
            search.className = 'q-select-search';
            search.placeholder = 'Search…';
            search.setAttribute('aria-label', 'Search options');
            search.setAttribute('autocomplete', 'off');
            searchWrap.appendChild(search);
            dropdown.insertBefore(searchWrap, optionsEl);
        }

        wrapper.appendChild(trigger);
        wrapper.appendChild(dropdown);
        sel.parentNode.insertBefore(wrapper, sel);

        function buildOption(opt) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'q-select-option';
            btn.setAttribute('role', 'option');
            btn.setAttribute('data-value', opt.value);
            btn.textContent = opt.textContent;
            if (opt.disabled) btn.disabled = true;
            if (opt.value === sel.value && opt.value !== '') {
                btn.setAttribute('aria-selected', 'true');
                btn.classList.add('selected');
            }
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (opt.disabled) return;
                selectValue(opt.value);
                close(true);
            });
            return btn;
        }

        function buildOptions() {
            optionsEl.innerHTML = '';
            var visible = 0;
            Array.prototype.forEach.call(sel.children, function(child) {
                if (child.tagName === 'OPTGROUP') {
                    var groupLabel = document.createElement('div');
                    groupLabel.className = 'q-select-group-label';
                    groupLabel.textContent = child.label || '';
                    groupLabel.setAttribute('data-group', child.label || '');
                    optionsEl.appendChild(groupLabel);
                    Array.prototype.forEach.call(child.children, function(opt) {
                        if (opt.tagName === 'OPTION') {
                            var b = buildOption(opt);
                            b.setAttribute('data-group', child.label || '');
                            optionsEl.appendChild(b);
                        }
                    });
                } else if (child.tagName === 'OPTION') {
                    optionsEl.appendChild(buildOption(child));
                }
            });
            updateValue();
            filterOptions();
        }

        function updateValue() {
            var opt = sel.options[sel.selectedIndex];
            if (!opt || opt.value === '') {
                var firstOpt = sel.options[0];
                valueEl.textContent = firstOpt ? firstOpt.textContent : '';
                valueEl.classList.add('q-select-placeholder');
            } else {
                valueEl.textContent = opt.textContent;
                valueEl.classList.remove('q-select-placeholder');
            }
            Array.prototype.forEach.call(optionsEl.querySelectorAll('.q-select-option'), function(b) {
                if (b.getAttribute('data-value') === sel.value && sel.value !== '') {
                    b.setAttribute('aria-selected', 'true');
                    b.classList.add('selected');
                } else {
                    b.removeAttribute('aria-selected');
                    b.classList.remove('selected');
                }
            });
        }

        function selectValue(v) {
            if (sel.value !== v) {
                sel.value = v;
                sel.dispatchEvent(new Event('change', { bubbles: true }));
            }
            updateValue();
        }

        function open() {
            if (trigger.getAttribute('aria-expanded') === 'true') return;
            closeAllOthers();
            dropdown.hidden = false;
            trigger.setAttribute('aria-expanded', 'true');
            wrapper.classList.add('q-select-open');
            if (search) {
                setTimeout(function() { search.focus(); }, 0);
            } else {
                var first = optionsEl.querySelector('.q-select-option:not([disabled]):not([hidden])');
                if (first) setTimeout(function() { first.focus(); }, 0);
            }
        }

        function close(returnFocus) {
            if (trigger.getAttribute('aria-expanded') !== 'true') return;
            dropdown.hidden = true;
            trigger.setAttribute('aria-expanded', 'false');
            wrapper.classList.remove('q-select-open');
            if (search) {
                search.value = '';
                filterOptions();
            }
            if (returnFocus) trigger.focus();
        }

        function closeAllOthers() {
            document.querySelectorAll('.q-select-trigger[aria-expanded="true"]').forEach(function(t) {
                if (t === trigger) return;
                var w = t.parentNode;
                var dd = w.querySelector('.q-select-dropdown');
                if (dd) dd.hidden = true;
                t.setAttribute('aria-expanded', 'false');
                w.classList.remove('q-select-open');
            });
        }

        function filterOptions() {
            var q = (search && search.value || '').toLowerCase().trim();
            var visible = 0;
            Array.prototype.forEach.call(optionsEl.querySelectorAll('.q-select-option'), function(b) {
                var match = !q || b.textContent.toLowerCase().indexOf(q) !== -1;
                b.hidden = !match;
                if (match) visible++;
            });
            Array.prototype.forEach.call(optionsEl.querySelectorAll('.q-select-group-label'), function(lbl) {
                var anyVisible = false;
                var n = lbl.nextElementSibling;
                while (n && n.classList.contains('q-select-option')) {
                    if (!n.hidden) { anyVisible = true; break; }
                    n = n.nextElementSibling;
                }
                lbl.hidden = !anyVisible;
            });
            var empty = optionsEl.querySelector('.q-select-empty');
            if (visible === 0 && q) {
                if (!empty) {
                    empty = document.createElement('div');
                    empty.className = 'q-select-empty';
                    empty.textContent = 'No matches';
                    optionsEl.appendChild(empty);
                }
            } else if (empty) {
                empty.remove();
            }
        }

        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (trigger.getAttribute('aria-expanded') === 'true') close();
            else open();
        });
        trigger.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open();
            }
        });

        if (search) {
            search.addEventListener('input', filterOptions);
            search.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    var first = optionsEl.querySelector('.q-select-option:not([disabled]):not([hidden])');
                    if (first) first.focus();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    close(true);
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    var first = optionsEl.querySelector('.q-select-option:not([disabled]):not([hidden])');
                    if (first) { first.click(); }
                }
            });
        }

        optionsEl.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                var v = Array.prototype.filter.call(
                    optionsEl.querySelectorAll('.q-select-option:not([disabled]):not([hidden])'),
                    function(b) { return true; }
                );
                if (v.length === 0) return;
                var idx = v.indexOf(document.activeElement);
                var next = e.key === 'ArrowDown'
                    ? v[(idx + 1 + v.length) % v.length]
                    : v[(idx - 1 + v.length) % v.length];
                next.focus();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                close(true);
            } else if (e.key === 'Home') {
                e.preventDefault();
                var f = optionsEl.querySelector('.q-select-option:not([disabled]):not([hidden])');
                if (f) f.focus();
            } else if (e.key === 'End') {
                e.preventDefault();
                var vis = Array.prototype.filter.call(
                    optionsEl.querySelectorAll('.q-select-option:not([disabled]):not([hidden])'),
                    function(b) { return true; }
                );
                if (vis.length) vis[vis.length - 1].focus();
            } else if (e.key === 'Tab') {
                close(false);
            }
        });

        document.addEventListener('click', function(e) {
            if (!wrapper.contains(e.target) && trigger.getAttribute('aria-expanded') === 'true') {
                close(false);
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') {
                close(true);
            }
        });

        window.addEventListener('resize', function() {
            if (trigger.getAttribute('aria-expanded') === 'true') close(false);
        });

        buildOptions();
        sel.addEventListener('change', updateValue);
        sel._qSelectRebuild = function() { buildOptions(); };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { enhanceSelects(); });
    } else {
        enhanceSelects();
    }
})();
`;
