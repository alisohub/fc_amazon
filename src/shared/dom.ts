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

// TODO: add every single script finding by toteid
export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function findElement(selector: string, timeout = 5000): Promise<HTMLElement | null> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        const el = document.querySelector(selector) as HTMLElement | null;
        if (el && el.offsetParent !== null) return el;
        await sleep(150);
    }
    return null;
}

export const findButtonByLabel = (labels: string[], timeout?: number) => {
    const selector: string = labels.map(lbl => `button[aria-label="${lbl}" i]`).join(', ');
    return findElement(selector, timeout);
}

export const findInputByLabel = (labels: string[], timeout?: number) => {
    const selector: string = labels.map(lbl => `input[aria-label="${lbl}" i]`).join(', ');
    return findElement(selector, timeout);
}

export const findButtonByTestId = (testId: string, timeout?: number) => {
    const selector: string = `button[data-testid="${testId}" i]`;
    return findElement(selector, timeout);
}

export const findInputByTestId = (testId: string, timeout?: number) => {
    const selector: string = `input[data-testid="${testId}" i]`;
    return findElement(selector, timeout);
}

export async function findButtonBySpan(spanTexts: string[], timeout = 5000): Promise<HTMLElement | null> {
    const start = Date.now();

    const normalizedSpans = spanTexts.map(span => normalizeText(span));
    while (Date.now() - start < timeout) {
        const spans = Array.from(document.querySelectorAll('button span'));
        const span = spans.find(s => {
            const text = normalizeText(s.textContent);
            return text && normalizedSpans.includes(text);
        });
        
        if (span) {
            const btn = span.closest('button') as HTMLButtonElement;
            if (btn && btn.offsetParent !== null && !btn.disabled) return btn;
        }
        await sleep(150);
    }
    return null;
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
