import { STORAGE_KEY_DEV } from "@shared/constants";

if (!window.__devInspectorLoaded) {
    window.__devInspectorLoaded = true;

    let active: boolean = false;

    // Default settings
    let settings = {
        showDetails: true,
        showCSS: false,
        showCoords: false
    };

    try {
        const saved = localStorage.getItem(STORAGE_KEY_DEV);
        if (saved) settings = { ...settings, ...JSON.parse(saved) };
    } catch (e) {}

    function handleClick(e: MouseEvent): void {
        if (!active) return;
        
        const target = e.target as HTMLElement;

        // Ignore clicks inside the Hub so the UI remains functional
        if (target.closest('#sh-root')) return;
        
        // Prevent default if clicking a link so we don't navigate away
        if (target.tagName.toLowerCase() === 'a' || target.closest('a')) {
            e.preventDefault(); 
        }

        let msg = `🔍 Element: <${target.tagName.toLowerCase()}>\n`;
        msg += `--------------------------------\n`;

        // 1. Click Coordinates
        if (settings.showCoords) {
            msg += `📍 COORDINATES:\n`;
            msg += `   Client (Screen): X: ${e.clientX}, Y: ${e.clientY}\n`;
            msg += `   Page (Scroll):   X: ${e.pageX}, Y: ${e.pageY}\n`;
            msg += `--------------------------------\n`;
        }

        // 2. Element Details (Raw HTML)
        if (settings.showDetails) {
            msg += `📝 RAW HTML:\n`;
            
            let rawHtml = target.outerHTML || 'None';
            msg += `${rawHtml}\n`;
            msg += `--------------------------------\n`;
        }

        // 3. Computed CSS
        if (settings.showCSS) {
            msg += `🎨 CSS:\n`;
            msg += `   Inline CSS: ${target.style.cssText || 'None'}\n`;
            
            const comp = window.getComputedStyle(target);
            msg += `   Display: ${comp.display}\n`;
            msg += `   Position: ${comp.position}\n`;
            msg += `   Color: ${comp.color}\n`;
            msg += `   Background: ${comp.backgroundColor}\n`;
            msg += `   Font-Size: ${comp.fontSize}\n`;
            msg += `--------------------------------\n`;
        }

        // Fire the popup!
        alert(msg.trim());
    }

    // Use capturing phase to intercept before React/Angular handlers swallow the event
    document.addEventListener('click', handleClick, true);

    window.__devInspector = {
        enable: (): void => { active = true; },
        disable: (): void => { active = false; },
        isActive: (): boolean => active,
        getSettings: () => settings,
        updateSettings: (newSettings: Partial<typeof settings>): void => {
            settings = { ...settings, ...newSettings };
            try { localStorage.setItem(STORAGE_KEY_DEV, JSON.stringify(settings)); } catch (e) {}
        }
    };
}
