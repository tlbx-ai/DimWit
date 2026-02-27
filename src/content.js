(() => {
    const colorMap = {
        "rgb(0, 0, 0)":    "#15202B",
        "rgb(22, 24, 28)": "#1A2734",
        "rgb(29, 31, 35)": "#1E2D3D",
        "rgb(47, 51, 54)": "#38444D",
        "rgb(32, 35, 39)": "#253341"
    };

    const colorProps = ["backgroundColor", "borderColor", "outlineColor"];

    function patchRule(rule) {
        if (!rule.style) return;
        for (const prop of colorProps) {
            const val = rule.style[prop];
            const mapped = mapColor(val);
            if (mapped) rule.style[prop] = mapped;
        }
    }

    function patchSheets() {
        for (const sheet of document.styleSheets) {
            try {
                for (const rule of sheet.cssRules) {
                    patchRule(rule);
                    if (rule.cssRules) {
                        for (const sub of rule.cssRules) {
                            patchRule(sub);
                        }
                    }
                }
            } catch (e) {}
        }
    }

    function mapColor(val) {
        if (colorMap[val]) return colorMap[val];
        const m = val && val.match(/^rgba\(\s*0,\s*0,\s*0,\s*([\d.]+)\s*\)$/);
        if (m) return `rgba(21, 32, 43, ${m[1]})`;
        return null;
    }

    function patchInline(el) {
        if (el.nodeType !== Node.ELEMENT_NODE) return;
        for (const prop of colorProps) {
            const val = el.style[prop];
            const mapped = mapColor(val);
            if (mapped) el.style[prop] = mapped;
        }
    }

    function walkTree(root) {
        if (root.nodeType !== Node.ELEMENT_NODE) return;
        patchInline(root);
        root.querySelectorAll("[style]").forEach(patchInline);
    }

    let patchPending = false;
    function schedulePatch() {
        if (!patchPending) {
            patchPending = true;
            requestAnimationFrame(() => {
                patchSheets();
                patchPending = false;
            });
        }
    }

    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) continue;
                if (node.tagName === "STYLE" || node.tagName === "LINK") {
                    schedulePatch();
                }
                walkTree(node);
            }
            if (m.type === "attributes" && m.target.nodeType === Node.ELEMENT_NODE) {
                patchInline(m.target);
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style"]
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", patchSheets);
    } else {
        patchSheets();
    }

    // Safety net: X's CSS-in-JS may insert rules via CSSOM (insertRule)
    // which doesn't trigger DOM mutations — re-scan periodically
    setInterval(patchSheets, 1000);
})();
