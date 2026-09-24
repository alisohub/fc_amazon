if (!window.__gravisLoaded) {
    window.__gravisLoaded = true;

    let active: boolean = false;
    const STORAGE_KEY = 'lpnForGravis';

    function updateGravisButton(lpn: string | null): void {
        let btn = document.getElementById('sh-gravis-btn') as HTMLAnchorElement | null;

        if (!lpn) {
            if (btn) btn.style.display = 'none';
            return;
        }

        if (!btn) {
            btn = document.createElement('a');
            btn.id = 'sh-gravis-btn';
            btn.textContent = 'G';
            btn.target = '_blank';
            
            // Standard browser anchor styling applied as an overlay
            Object.assign(btn.style, {
                position: 'fixed',
                top: '150px',   // Adjust vertical coordinate here
                left: '40px',   // Adjust horizontal coordinate here
                zIndex: '999999',
                color: '#0000EE', // Default browser blue
                textDecoration: 'underline',
                cursor: 'pointer',
                fontFamily: 'serif',
                fontSize: '28px',
                fontWeight: 'bold',
                display: 'none'
            });
            
            document.body.appendChild(btn);
        }

        btn.href = `https://eu-cretfc-tools-dub.dub.proxy.amazon.com/gravis/${lpn}`;
        btn.style.display = active ? 'block' : 'none';
    }

    function handleKeydown(e: KeyboardEvent): void {
        if (!active || e.key !== 'Enter') return;

        const input = e.target as HTMLInputElement;
        if (!input || input.tagName.toLowerCase() !== 'input') return;

        const label = (input.getAttribute('aria-label') || '').toLowerCase();
        
        // Check if the label contains any of the target keywords
        const isValidLabel = ['lpn', 'nlp', 'лпн', 'нлп'].some(keyword => label.includes(keyword));
        if (!isValidLabel) return;

        const val = input.value?.trim();
        
        // Regex: Starts with LPN (case-insensitive) followed by alphanumeric characters
        if (val && /^lpn[a-z0-9]+/i.test(val)) {
            try {
                localStorage.setItem(STORAGE_KEY, val);
                updateGravisButton(val);
            } catch (err) {}
        }
    }

    // Use capturing phase (true) to ensure we intercept the enter key right as it happens
    document.addEventListener('keydown', handleKeydown, true);

    window.__gravis = {
        enable: (): void => {
            active = true;
            try {
                const savedLpn = localStorage.getItem(STORAGE_KEY);
                updateGravisButton(savedLpn);
            } catch (e) {}
        },
        disable: (): void => {
            active = false;
            const btn = document.getElementById('sh-gravis-btn');
            if (btn) btn.style.display = 'none';
        },
        isActive: (): boolean => active
    };
}

