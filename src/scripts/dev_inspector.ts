if (!window.__devInspectorLoaded) {
    window.__devInspectorLoaded = true;

    let active: boolean = false;

    // 1. Explicitly define the event type
    const handleInspectClick = (event: MouseEvent): void => {
        if (!active) return;
        
        // 2. Cast the event target to an HTMLElement so TS allows DOM methods
        const clickedElement = event.target as HTMLElement;
        
        // 🚨 Ignore clicks on the Script Hub UI
        if (clickedElement.closest('#sh-root')) return;
        
        // Stop the click from triggering links, buttons, or form submissions
        event.preventDefault();
        event.stopPropagation();
        
        // 3. Explicitly define the string type
        const elementHTML: string = clickedElement.outerHTML;
        
        alert(elementHTML);
    };

    // 4. Hub Integration Handlers matching the ScriptHandler interface
    window.__devInspector = {
        enable: (): void => { 
            active = true; 
            // Assert as EventListener to satisfy TS strict event typing
            document.addEventListener('click', handleInspectClick as EventListener, true);
        },
        disable: (): void => { 
            active = false; 
            document.removeEventListener('click', handleInspectClick as EventListener, true);
        },
        isActive: (): boolean => active
    };
}
