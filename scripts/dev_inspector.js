(() => {
    if (window.__devInspectorLoaded) {
        return;
    }
    window.__devInspectorLoaded = true;

    let active = false;

    function handleInspectClick(event) {
        if (!active) return;
        
        // Get the exact element you clicked on
        const clickedElement = event.target;
        
        // 🚨 Ignore clicks on the Script Hub UI so you can still turn it off!
        if (clickedElement.closest('#sh-root')) return;
        
        // Stop the click from triggering links, buttons, or form submissions on the main page
        event.preventDefault();
        event.stopPropagation();
        
        // Get the HTML of that element
        const elementHTML = clickedElement.outerHTML;
        
        // Show it in an alert
        alert(elementHTML);
    }

    // Hub Integration Handlers
    window.__devInspector = {
        enable: () => { 
            active = true; 
            // The 'true' ensures we capture the click before the page can react
            document.addEventListener('click', handleInspectClick, true);
        },
        disable: () => { 
            active = false; 
            document.removeEventListener('click', handleInspectClick, true);
        },
        isActive: () => active
    };
})();