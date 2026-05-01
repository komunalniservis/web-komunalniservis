// POZNÁMKA:
// Tento skript dynamicky nastavuje CSS proměnné pro mobilní spacing hlavičky
// podle šířky/výšky viewportu, DPR a poměru stran zařízení.
// Cíl: konzistentní klikací plochy a odsazení na různých telefonech.

// Adaptivní odsazení hlavičky podle rozlišení, DPR a poměru stran.
(function () {
    function getViewport() {
        const vv = window.visualViewport;
        const width = Math.round(vv ? vv.width : window.innerWidth);
        const height = Math.round(vv ? vv.height : window.innerHeight);
        return { width, height };
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function applyAdaptiveSpacing() {
        const root = document.documentElement;
        const { width, height } = getViewport();
        const dpr = window.devicePixelRatio || 1;

        if (width > 1280) {
            root.style.removeProperty('--mobile-left-gutter');
            root.style.removeProperty('--mobile-right-gutter');
            root.style.removeProperty('--mobile-menu-hit-size');
            root.style.removeProperty('--mobile-menu-font-size');
            return;
        }

        const shortSide = Math.min(width, height);
        const longSide = Math.max(width, height);
        const aspect = longSide / shortSide;

        // Výchozí mobilní odsazení podle šířky zařízení.
        let leftGutter = 12;
        let rightGutter = 20;

        if (shortSide <= 360) {
            leftGutter = 14;
            rightGutter = 24;
        } else if (shortSide <= 390) {
            leftGutter = 13;
            rightGutter = 22;
        } else if (shortSide <= 430) {
            leftGutter = 12;
            rightGutter = 21;
        }

        // Velmi vysoké poměry stran (často novější Samsung/iPhone) dostanou víc místa od kraje.
        if (aspect >= 2.12) {
            rightGutter += 2;
        }

        // Vyšší DPR může tlačítko opticky zmenšovat.
        let menuHitSize = shortSide < 390 ? 48 : 46;
        let menuFontSize = shortSide < 390 ? 28 : 27;
        if (dpr >= 3) {
            menuHitSize += 1;
            menuFontSize += 1;
        }

        leftGutter = clamp(leftGutter, 12, 20);
        rightGutter = clamp(rightGutter, 20, 28);
        menuHitSize = clamp(menuHitSize, 46, 50);
        menuFontSize = clamp(menuFontSize, 26, 30);

        root.style.setProperty('--mobile-left-gutter', `${leftGutter}px`);
        root.style.setProperty('--mobile-right-gutter', `${rightGutter}px`);
        root.style.setProperty('--mobile-menu-hit-size', `${menuHitSize}px`);
        root.style.setProperty('--mobile-menu-font-size', `${menuFontSize}px`);
    }

    applyAdaptiveSpacing();
    window.addEventListener('resize', applyAdaptiveSpacing);
    window.addEventListener('orientationchange', applyAdaptiveSpacing);
})();
