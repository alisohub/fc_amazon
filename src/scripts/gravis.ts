if (!window.__gravisLoaded) {
    window.__gravisLoaded = true;
    
    let active: boolean = false;
    let gravisWindow: Window | null = null;

    function syncHubUI(isActive: boolean): void {
        const chk = document.getElementById('sh-chk-gravis-lpn') as HTMLInputElement | null;
        if (chk && chk.checked !== isActive) {
            chk.checked = isActive;
        }
    }

    window.__gravis = {
        enable: (): void => {
            active = true;
            
            // Using a named window ('GravisApp') instead of '_blank' forces the browser
            // to reconnect to the existing tab if you accidentally closed the Main Tab.
            if (!gravisWindow || gravisWindow.closed) {
                gravisWindow = window.open('https://eu-cretfc-tools-dub.dub.proxy.amazon.com/gravis', 'GravisApp');
            }
        },
        disable: (): void => {
            active = false;
            if (gravisWindow && !gravisWindow.closed) {
                gravisWindow.close();
            }
            gravisWindow = null;
        },
        isActive: (): boolean => active
    };

    // Main Tab Bridge Listener
    window.addEventListener('message', (e: MessageEvent) => {
        const data = e.data;
        
        if (data?.type === 'GRAVIS_READY') {
            
            // If Gravis was reloaded, it will send this. We should ensure the Hub is active.
            active = true;
            syncHubUI(true);
            
            // Re-establish the window reference if the Main Tab was restarted
            if (!gravisWindow) gravisWindow = e.source as Window;
            
        } else if (data?.type === 'GRAVIS_CLOSED') {
            
            // Turn off the script and uncheck the Hub UI
            active = false;
            gravisWindow = null;
            syncHubUI(false);
        }
    });
}
