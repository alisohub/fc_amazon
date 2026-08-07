(() => {
    if (window.__devInspectorLoaded) {
        return;
    }
    window.__devInspectorLoaded = true;

    let active = false;

    function handleInspectClick(event) {
        if (!active) return;
        
        // Stop the click from triggering links, buttons, or form submissions
        event.preventDefault();
        event.stopPropagation();
        
        // Get the exact element you clicked on
        const clickedElement = event.target;
        
        // Get the HTML of that element
        const elementHTML = clickedElement.outerHTML;
        
        // Show it in an alert
        alert(elementHTML);
        
        // Also print it to the console (if you ever do open DevTools)
        console.log(elementHTML);
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