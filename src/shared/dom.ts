/**
 * Checks if a given DOM element is currently inside a visible modal or dialog.
 * This prevents our scripts from triggering actions when the user is 
 * interacting with pop-ups.
 */
export function isInsideModal(el: HTMLElement): boolean {
    // 1. Check for native HTML5 dialogs
    if (el.closest('dialog[open]')) {
        return true;
    }
    
    // 2. Check for custom or legacy Amazon UI modals
    const modal = el.closest('[role="dialog"],[role="alertdialog"],.modal,.popup,.overlay,.dialog');
    
    if (modal) {
        // Ensure the modal is actually visible on the screen
        const style = window.getComputedStyle(modal);
        if (style.display !== 'none' && style.visibility !== 'hidden') {
            return true;
        }
    }
    
    return false;
}
