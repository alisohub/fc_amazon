import { TOTE_INPT_LBL } from "./constants";
import { normalizeText } from "./utils";

export function hasTargetLabel(labelString: string | null): boolean {
    const lowerLabel = (labelString || '').toLowerCase();
    return TOTE_INPT_LBL.some(target => lowerLabel.includes(target.toLowerCase()));
}

export function triggerEnter(el: HTMLElement): void {
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true }));
    el.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true }));
}

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function findElement(selector: string): HTMLElement | null {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (el && el.offsetParent !== null) return el;
    return null;
}


async function waitForElement(selector: string, timeout: number): Promise<HTMLElement | null> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        const el = findElement(selector);
        if (el) return el;
        await sleep(150);
    }
    return null;
}

export const findButtonByLabel = (labels: string[], timeout?: number) => {
    const selector: string = labels.map(lbl => `button[aria-label="${lbl}" i]`).join(', ');
    return timeout ? waitForElement(selector, timeout) : findElement(selector);
}

export const findButtonByTestId = (testId: string, timeout?: number) => {
    const selector: string = `button[data-testid="${testId}" i]`;
    return timeout ? waitForElement(selector, timeout) : findElement(selector);
}

export const findInputByLabel = (labels: string[], timeout?: number) => {
    const selector: string = labels.map(lbl => `input[aria-label="${lbl}" i]`).join(', ');
    return timeout ? waitForElement(selector, timeout) : findElement(selector);
}


export const findInputByTestId = (testId: string, timeout?: number) => {
    const selector: string = `input[data-testid="${testId}" i]`;
    return timeout ? waitForElement(selector, timeout) : findElement(selector);
}

function findButton(spanTexts: string[]): HTMLElement | null {
    const normalizedSpans = spanTexts.map(span => normalizeText(span));
    const spans = Array.from(document.querySelectorAll('button span'));
    const span = spans.find(s => {
        const text = normalizeText(s.textContent);
        return text && normalizedSpans.includes(text);
    });
    
    if (span) {
        const btn = span.closest('button') as HTMLButtonElement;
        if (btn && btn.offsetParent !== null && !btn.disabled) return btn;
    }
    return null;
}

async function waitForButton(spanTexts: string[], timeout: number): Promise<HTMLElement | null> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        const btn = findButton(spanTexts);
        if (btn) return btn;
        await sleep(150);
    }
    return null;
}

export const findButtonBySpan = (spanTexts: string[], timeout?: number) => {
    return timeout ? waitForButton(spanTexts, timeout) : findButton(spanTexts);
}


// Forces React/Angular to acknowledge programmatic input changes
export function setNativeValue(element: HTMLInputElement, value: string): void {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
    nativeInputValueSetter?.call(element, value);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
}

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

export function setStatusDot(id: string, color: string, visible: boolean): void {
    let container = document.getElementById('sh-status-dots');
    if (!container) {
        container = document.createElement('div');
        container.id = 'sh-status-dots';
        Object.assign(container.style, {
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            display: 'flex',
            gap: '6px',
            zIndex: '999999',
            pointerEvents: 'none'
        });
        document.body.appendChild(container);
    }

    const dotId = `sh-dot-${id}`;
    let dot = document.getElementById(dotId);

    if (!dot) {
        dot = document.createElement('div');
        dot.id = dotId;
        Object.assign(dot.style, {
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            display: 'none'
        });
        container.appendChild(dot);
    }

    dot.style.backgroundColor = color;
    dot.style.display = visible ? 'block' : 'none';
}

export function showInitializationToast(scriptName: string, message: string): void {
    if (document.getElementById('sh-script-toast')) return;

    const toast = document.createElement('div');
    toast.id = 'sh-script-toast';
    
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background-color: #323232;
        color: rgba(255, 255, 255, 0.87);
        padding: 14px 16px;
        border-radius: 4px;
        box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 
                    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 
                    0px 1px 18px 0px rgba(0, 0, 0, 0.12);
        font-family: Roboto, "Helvetica Neue", sans-serif;
        z-index: 999999;
        opacity: 0;
        transform: scale(0.95);
        transition: opacity 150ms cubic-bezier(0, 0, 0.2, 1), transform 150ms cubic-bezier(0, 0, 0.2, 1);
        pointer-events: none;
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 250px;
    `;

    toast.innerHTML = `
        <div style="font-size: 14px; font-weight: 500;">${scriptName}</div>
        <div style="font-size: 12px; color: rgba(255, 255, 255, 0.6);">${message}</div>
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'scale(1)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'scale(0.95)';
        setTimeout(() => toast.remove(), 150); 
    }, 3500);
}
