// Swiss-Archival specimen module.
//
// Provides:
//   - renderSpecimen(svgEl, seedString)  → fills <svg> with a deterministic
//                                          superformula ornament + caption
//                                          (per swiss-archival-specimen-decorator
//                                          ruleset).
//   - renderSpecimenMeta(containerEl, seedString) → writes SPEC.№ / HASH /
//                                          MORPH_DNA into .specimen-sid,
//                                          .specimen-hash, .specimen-dna
//                                          children of the given container.
//
// Plus a single shared renderSpecimenJS string that exposes the helpers
// on `window` for use from the per-page client scripts.

export const SPECIMEN_JS = `
(function() {
    if (window.renderSpecimen) return;

    var ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    function seedFromString(s) {
        var hash = 0;
        for (var i = 0; i < s.length; i++) {
            hash = s.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    }

    function dnaFromSeed(seed) {
        return {
            m1: (seed % 10) + 3,
            n1: (seed % 50) / 10 + 0.5,
            n2: (seed % 100) / 10,
            n3: (Math.floor(seed / 4) % 100) / 10,
            m2: (Math.floor(seed / 16) % 8) + 2
        };
    }

    function sidFromSeed(seed) {
        var prefix = (seed % 90) + 10;
        var t = seed;
        var suffix = '';
        for (var k = 0; k < 6; k++) {
            suffix += ALPHABET.charAt(t % 32);
            t = Math.floor(t / 32);
        }
        return prefix + '-' + suffix;
    }

    function superR(theta, dna, m, n1, n2, n3) {
        if (m === undefined) m = dna.m1;
        if (n1 === undefined) n1 = dna.n1;
        if (n2 === undefined) n2 = dna.n2;
        if (n3 === undefined) n3 = dna.n3;
        var a = Math.abs(Math.cos(m * theta / 4));
        var b = Math.abs(Math.sin(m * theta / 4));
        var p1 = Math.pow(a, n2);
        var p2 = Math.pow(b, n3);
        return Math.pow(p1 + p2, -1 / n1);
    }

    function pathFor(cx, cy, scale, m, n1, n2, n3) {
        var N = 200;
        var dna = { m1: m, n1: n1, n2: n2, n3: n3 };
        var pts = [];
        for (var i = 0; i <= N; i++) {
            var t = (i / N) * 2 * Math.PI;
            var r = superR(t, dna, m, n1, n2, n3);
            var x = (cx + r * scale * Math.cos(t)).toFixed(2);
            var y = (cy + r * scale * Math.sin(t)).toFixed(2);
            pts.push(x + ' ' + y);
        }
        return 'M ' + pts.join(' L ') + ' Z';
    }

    // The palette is dark-on-cream (we're rendering onto a light background,
    // so stroke colors are deep archival tones, not bright accents).
    var PALETTE = ['#2A2520', '#8B1A1A', '#7A7068', '#3A6B3A', '#8B6B1A', '#5B5048'];

    function buildInner(s, opts) {
        opts = opts || {};
        var seed = seedFromString(s || 'Multishape Synthesis v1');
        var dna = dnaFromSeed(seed);
        var sid = sidFromSeed(seed);
        var hashHex = '0x' + seed.toString(16).toUpperCase();
        var color = opts.color || 'currentColor';
        var layerCount = opts.layerCount || 6;
        var scaleMax = opts.scaleMax || 35;
        var rotStep = 10;

        var html = '';

        // Underlay construction guides
        html += '<g opacity="0.12" stroke="' + color + '">';
        html += '<circle cx="50" cy="50" r="48" fill="none" stroke-width="0.2" stroke-dasharray="1 2"/>';
        html += '<line x1="2" y1="50" x2="98" y2="50" stroke-width="0.15" stroke-dasharray="1 3"/>';
        html += '<line x1="50" y1="2" x2="50" y2="98" stroke-width="0.15" stroke-dasharray="1 3"/>';
        html += '</g>';

        // Layered superformula stack
        for (var i = 1; i <= layerCount; i++) {
            var scale = (i / layerCount) * scaleMax;
            var stroke = PALETTE[(seed + i) % PALETTE.length];
            var rot = (seed % 360) + i * rotStep;
            var op = Math.max(0.18, 1.1 - i / layerCount);
            html += '<g transform="rotate(' + rot.toFixed(2) + ' 50 50)">';
            html += '<path d="' + pathFor(50, 50, scale, dna.m1, dna.n1, dna.n2, dna.n3) + '" fill="none" stroke="' + stroke + '" stroke-width="0.25" opacity="' + op.toFixed(2) + '"/>';
            if (i % 2 === 0) {
                html += '<path d="' + pathFor(50, 50, scale * 0.8, dna.m2, 2, 1, 1) + '" fill="none" stroke="' + stroke + '" stroke-width="0.15" stroke-dasharray="1 2" opacity="0.22"/>';
            }
            html += '</g>';
        }

        // Orbital subsystem
        var orbitCount = (seed % 4) + 2;
        var R = 38;
        for (var j = 0; j < orbitCount; j++) {
            var ang = j * (360 / orbitCount) + (seed % 90);
            var rad = ang * Math.PI / 180;
            var ox = (50 + R * Math.cos(rad)).toFixed(2);
            var oy = (50 + R * Math.sin(rad)).toFixed(2);
            html += '<line x1="50" y1="50" x2="' + ox + '" y2="' + oy + '" stroke="' + color + '" stroke-width="0.1" stroke-dasharray="0.5 1" opacity="0.18"/>';
            html += '<circle cx="' + ox + '" cy="' + oy + '" r="1.5" fill="none" stroke="' + color + '" stroke-width="0.2" opacity="0.5"/>';
            html += '<path d="' + pathFor(parseFloat(ox), parseFloat(oy), 4, dna.m2, 1, 1, 1) + '" fill="none" stroke="' + PALETTE[0] + '" stroke-width="0.15" opacity="0.45"/>';
        }

        return {
            inner: html,
            sid: sid,
            hash: hashHex,
            dna: dna.m1 + '.' + dna.m2,
            seed: seed
        };
    }

    function renderSpecimen(svgEl, s) {
        if (!svgEl) return;
        var meta = buildInner(s);
        svgEl.innerHTML = meta.inner;
        svgEl.setAttribute('aria-label', 'Specimen ' + meta.sid);
        svgEl.setAttribute('data-spec-sid', meta.sid);
        svgEl.setAttribute('data-spec-hash', meta.hash);
        svgEl.setAttribute('data-spec-dna', meta.dna);
        var host = svgEl.parentElement;
        if (host) {
            var sidEl = host.querySelector('.specimen-sid');
            if (sidEl) sidEl.textContent = 'SPEC.№ ' + meta.sid;
            var hashEl = host.querySelector('.specimen-hash');
            if (hashEl) hashEl.textContent = 'HASH ' + meta.hash;
            var dnaEl = host.querySelector('.specimen-dna');
            if (dnaEl) dnaEl.textContent = 'DNA ' + meta.dna;
        }
    }

    window.renderSpecimen = renderSpecimen;
    window.specimenMeta = function(s) { return buildInner(s); };
})();
`;
