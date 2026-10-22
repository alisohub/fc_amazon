"use strict";(()=>{function d(t){t.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",code:"Enter",keyCode:13,which:13,bubbles:!0,cancelable:!0})),t.dispatchEvent(new KeyboardEvent("keyup",{key:"Enter",code:"Enter",keyCode:13,which:13,bubbles:!0,cancelable:!0}))}var c=t=>new Promise(n=>setTimeout(n,t));function _(t,n){Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"value")?.set?.call(t,n),t.dispatchEvent(new Event("input",{bubbles:!0})),t.dispatchEvent(new Event("change",{bubbles:!0}))}function p(t,n){if(document.getElementById("sh-script-toast"))return;let e=document.createElement("div");e.id="sh-script-toast",e.style.cssText=`
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
    `,e.innerHTML=`
        <div style="font-size: 14px; font-weight: 500;">${t}</div>
        <div style="font-size: 12px; color: rgba(255, 255, 255, 0.6);">${n}</div>
    `,document.body.appendChild(e),requestAnimationFrame(()=>{e.style.opacity="1",e.style.transform="scale(1)"}),setTimeout(()=>{e.style.opacity="0",e.style.transform="scale(0.95)",setTimeout(()=>e.remove(),150)},3500)}var g=/^([B0-9][A-Z0-9]{9})$/i;async function m(t,n){let e=document.querySelector(t);if(!e)return!1;e.click(),await c(100);let s=Array.from(document.querySelectorAll("mat-option")).find(r=>(r.textContent||"").trim().toLowerCase()===n.toLowerCase());return s?(s.click(),!0):(e.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:!0})),!1)}function a(t,n=null){window.opener&&window.opener.postMessage({type:t,payload:n},"*")}if(window.__gravisHubLoaded)p("Gravis Automation","\u0421\u043A\u0440\u0438\u043F\u0442 \u0432\u0436\u0435 \u0431\u0443\u0432 \u0437\u0430\u043F\u0443\u0449\u0435\u043D\u0438\u0439");else{let e=function(s){if(!s)return;let r=s;if(typeof s=="string"){let o=s.trim();if(!o.startsWith("[")&&!o.startsWith("{"))return;try{r=JSON.parse(o)}catch{return}}if(Array.isArray(r)&&r.length>0){let o=r[0],i=o?.returnUnitId,l=o?.returnUnitProductAttributes?.asin;if(!i||!l)return;let T=g.test(l);(!n||i.toLowerCase()===n)&&T&&(t=l.toUpperCase())}};b=e,window.__gravisHubLoaded=!0;let t=null,n="",u=XMLHttpRequest.prototype.send;XMLHttpRequest.prototype.send=function(s){return this.addEventListener("readystatechange",function(){if(this.readyState===4)try{let r=this.responseType===""||this.responseType==="text"?this.responseText:this.response;e(r)}catch{}}),u.call(this,s)},window.addEventListener("message",async s=>{if(s.source!==window.opener)return;let r=s.data;if(r?.type==="SYNC_LPN"){let o=r.payload;if(!o)return;t=null,n=o.trim().toLowerCase(),await m(".mat-select-value","EU"),await c(50);let i=document.querySelector("input.mat-input-element");i&&(_(i,o),d(i))}else if(r?.type==="TRIGGER_ASIN_SEARCH")if(t){let o=t;t=null,a("FOUND_ASIN",o)}else a("FOUND_ASIN","NOT_FOUND")}),p("Gravis Automation","v1.0.5 \u0423\u0441\u043F\u0456\u0448\u043D\u043E \u0437\u0430\u043F\u0443\u0449\u0435\u043D\u0438\u0439"),a("GRAVIS_READY"),window.addEventListener("beforeunload",()=>{a("GRAVIS_CLOSED")})}var b;})();
