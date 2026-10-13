"use strict";(()=>{function u(e){e.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",code:"Enter",keyCode:13,which:13,bubbles:!0,cancelable:!0})),e.dispatchEvent(new KeyboardEvent("keyup",{key:"Enter",code:"Enter",keyCode:13,which:13,bubbles:!0,cancelable:!0}))}var s=e=>new Promise(n=>setTimeout(n,e));function p(e,n){Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"value")?.set?.call(e,n),e.dispatchEvent(new Event("input",{bubbles:!0})),e.dispatchEvent(new Event("change",{bubbles:!0}))}function d(e,n){if(document.getElementById("sh-script-toast"))return;let t=document.createElement("div");t.id="sh-script-toast",t.style.cssText=`
        position: fixed;
        bottom: 24px;
        right: 24px;
        background-color: #323232; /* Material Snackbar default dark */
        color: rgba(255, 255, 255, 0.87);
        padding: 14px 16px;
        border-radius: 4px;
        box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 
                    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 
                    0px 1px 18px 0px rgba(0, 0, 0, 0.12); /* Material Elevation 6 */
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
    `,t.innerHTML=`
        <div style="font-size: 14px; font-weight: 500;">${e}</div>
        <div style="font-size: 12px; color: rgba(255, 255, 255, 0.6);">${n}</div>
    `,document.body.appendChild(t),requestAnimationFrame(()=>{t.style.opacity="1",t.style.transform="scale(1)"}),setTimeout(()=>{t.style.opacity="0",t.style.transform="scale(0.95)",setTimeout(()=>t.remove(),150)},3500)}async function _(e,n){let t=document.querySelector(e);if(!t)return!1;t.click(),await s(100);let r=Array.from(document.querySelectorAll("mat-option")).find(c=>(c.textContent||"").trim().toLowerCase()===n.toLowerCase());return r?(r.click(),!0):(t.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:!0})),!1)}async function T(e=1e3){let n=Date.now(),t=/^([B0-9][A-Z0-9]{9})$/;for(;Date.now()-n<e;){let o=Array.from(document.querySelectorAll("a"));for(let r of o){let a=(r.textContent||"").trim().toUpperCase().match(t);if(a)return a[1];let l=(r.href||"").match(/\/(?:dp|product)\/([B0-9][A-Z0-9]{9})/i);if(l)return l[1].toUpperCase()}await s(250)}return null}function m(){let e=/^([B0-9][A-Z0-9]{9})$/,n=Array.from(document.querySelectorAll("a"));for(let t of n){let o=(t.textContent||"").trim().toUpperCase(),r=t.href||"";(o.match(e)||r.match(/\/(?:dp|product)\/([B0-9][A-Z0-9]{9})/i))&&(t.textContent="Not Available",t.removeAttribute("href"))}}function i(e,n=null){window.opener&&window.opener.postMessage({type:e,payload:n},"*")}window.__gravisHubLoaded?d("Gravis Automation","\u0421\u043A\u0440\u0438\u043F\u0442 \u0432\u0436\u0435 \u0431\u0443\u0432 \u0437\u0430\u043F\u0443\u0449\u0435\u043D\u0438\u0439"):(window.__gravisHubLoaded=!0,window.addEventListener("message",async e=>{if(e.source!==window.opener)return;let n=e.data;if(n?.type==="SYNC_LPN"){let t=n.payload;if(!t)return;m(),await _(".mat-select-value","EU"),await s(50);let o=document.querySelector("input.mat-input-element");o&&(p(o,t),u(o))}else if(n?.type==="TRIGGER_ASIN_SEARCH"){let t=await T(2e3);t?i("FOUND_ASIN",t):i("FOUND_ASIN","NOT_FOUND")}}),d("Gravis Automation","v1.0.0 \u0423\u0441\u043F\u0456\u0448\u043D\u043E \u0437\u0430\u043F\u0443\u0449\u0435\u043D\u0438\u0439"),i("GRAVIS_READY"),window.addEventListener("beforeunload",()=>{i("GRAVIS_CLOSED")}));})();
