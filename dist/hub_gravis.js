"use strict";(()=>{function f(e){e.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",code:"Enter",keyCode:13,which:13,bubbles:!0,cancelable:!0})),e.dispatchEvent(new KeyboardEvent("keyup",{key:"Enter",code:"Enter",keyCode:13,which:13,bubbles:!0,cancelable:!0}))}var c=e=>new Promise(o=>setTimeout(o,e));function _(e,o){Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"value")?.set?.call(e,o),e.dispatchEvent(new Event("input",{bubbles:!0})),e.dispatchEvent(new Event("change",{bubbles:!0}))}function u(e,o){if(document.getElementById("sh-script-toast"))return;let t=document.createElement("div");t.id="sh-script-toast",t.style.cssText=`
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
    `,t.innerHTML=`
        <div style="font-size: 14px; font-weight: 500;">${e}</div>
        <div style="font-size: 12px; color: rgba(255, 255, 255, 0.6);">${o}</div>
    `,document.body.appendChild(t),requestAnimationFrame(()=>{t.style.opacity="1",t.style.transform="scale(1)"}),setTimeout(()=>{t.style.opacity="0",t.style.transform="scale(0.95)",setTimeout(()=>t.remove(),150)},3500)}var T=/^([B0-9][A-Z0-9]{9})$/i,b=6,y=4e3,n={targetLpn:"",isWatching:!1,remainingRequests:0,result:"NOT_FOUND",promise:Promise.resolve("NOT_FOUND"),resolve:null,timeoutId:null};async function w(e,o){let t=document.querySelector(e);if(!t)return!1;t.click(),await c(100);let r=Array.from(document.querySelectorAll("mat-option")).find(i=>(i.textContent||"").trim().toLowerCase()===o.toLowerCase());return r?(r.click(),!0):(t.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:!0})),!1)}function g(e){if(!e||typeof e!="object")return null;if(Array.isArray(e)){for(let t of e){let s=g(t);if(s)return s}return null}let o=e;for(let[t,s]of Object.entries(o))if(t.toLowerCase()==="asin"&&typeof s=="string"){let r=s.trim().toUpperCase();if(T.test(r))return r}for(let t of Object.values(o))if(t&&typeof t=="object"){let s=g(t);if(s)return s}return null}function l(e){if(n.isWatching=!1,n.remainingRequests=0,n.result=e,n.timeoutId&&(clearTimeout(n.timeoutId),n.timeoutId=null),n.resolve){let o=n.resolve;n.resolve=null,o(e)}}function x(e){l("NOT_FOUND"),n.targetLpn=e.trim().toLowerCase(),n.isWatching=!0,n.remainingRequests=b,n.result="NOT_FOUND",n.promise=new Promise(o=>{n.resolve=o}),n.timeoutId=setTimeout(()=>{n.isWatching&&l("NOT_FOUND")},y)}function p(e,o){if(!n.isWatching||!n.targetLpn)return;n.remainingRequests--;let t=e.toLowerCase(),s=n.targetLpn,r=encodeURIComponent(s);if(t.includes(s)||t.includes(r)){let i=o;if(typeof o=="string")try{i=JSON.parse(o)}catch{i=null}let a=g(i);l(a??"NOT_FOUND");return}n.remainingRequests<=0&&l("NOT_FOUND")}function L(){let e=XMLHttpRequest.prototype.open,o=XMLHttpRequest.prototype.send;XMLHttpRequest.prototype.open=function(s,r,...i){return this.__shTargetUrl=String(r),e.call(this,s,r,...i)},XMLHttpRequest.prototype.send=function(s){return this.addEventListener("loadend",function(){if(!n.isWatching)return;let r=this.__shTargetUrl||"";p(r,this.response)}),o.call(this,s)};let t=window.fetch;window.fetch=async function(...s){let r=await t.apply(this,s);if(n.isWatching){let i=s[0],a=typeof i=="string"?i:i instanceof URL?i.href:i?.url||"";r.clone().text().then(m=>{p(a,m)}).catch(()=>{p(a,null)})}return r}}function d(e,o=null){window.opener&&window.opener.postMessage({type:e,payload:o},"*")}window.__gravisHubLoaded?u("Gravis Automation","\u0421\u043A\u0440\u0438\u043F\u0442 \u0432\u0436\u0435 \u0431\u0443\u0432 \u0437\u0430\u043F\u0443\u0449\u0435\u043D\u0438\u0439"):(window.__gravisHubLoaded=!0,L(),window.addEventListener("message",async e=>{if(e.source!==window.opener)return;let o=e.data;if(o?.type==="SYNC_LPN"){let t=o.payload;if(!t)return;await w(".mat-select-value","EU"),await c(50);let s=document.querySelector("input.mat-input-element");s&&(_(s,t),f(s),x(t))}else if(o?.type==="TRIGGER_ASIN_SEARCH"){let t=n.isWatching?await n.promise:n.result;d("FOUND_ASIN",t)}}),u("Gravis Automation","v1.0.5 \u0423\u0441\u043F\u0456\u0448\u043D\u043E \u0437\u0430\u043F\u0443\u0449\u0435\u043D\u0438\u0439"),d("GRAVIS_READY"),window.addEventListener("beforeunload",()=>{d("GRAVIS_CLOSED")}));})();
