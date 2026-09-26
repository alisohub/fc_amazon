"use strict";(()=>{var $=`
    #sh-root { font-family: 'Roboto', -apple-system, sans-serif; z-index: 999999; }
    #sh-panel { position: fixed; top: 0; right: -340px; width: 320px; height: 100vh; z-index: 999998; background: #fafafa; box-shadow: -4px 0 24px rgba(0,0,0,0.12); transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease; display: flex; flex-direction: column; }
    #sh-panel.sh-open { right: 0; }
    .sh-header { background: #ffffff; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e0e0e0; }
    .sh-header-group { display: flex; gap: 8px; align-items: center; }
    .sh-dep-dropdown, .sh-url-btn { background: #f1f3f4; border: 1px solid transparent; border-radius: 6px; padding: 4px 8px; font-size: 12px; color: #444746; font-weight: 600; cursor: pointer; outline: none; transition: background 0.2s, border 0.2s, color 0.2s; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; height: 24px; box-sizing: border-box; }
    .sh-dep-dropdown:hover, .sh-url-btn:hover { background: #e8eaed; color: #202124; text-decoration: none; }
    .sh-dep-dropdown:focus, .sh-url-btn:focus { border-color: #1a73e8; background: #ffffff; }
    
    /* Settings button replacing the close button */
    .sh-settings-btn { background: none; border: none; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; padding: 0; line-height: 1; transition: background 0.2s, transform 0.2s; }
    .sh-settings-btn:hover { background: rgba(0,0,0,0.05); }
    .sh-settings-btn.active { background: #e8f0fe; transform: rotate(45deg); }

    /* Global panel settings box */
    .sh-global-settings { display: none; background: #f1f3f4; padding: 12px 16px; border-bottom: 1px solid #e0e0e0; }
    .sh-global-settings.sh-expanded { display: block; }
    .sh-global-settings-title { font-size: 12px; font-weight: 600; color: #3c4043; margin-bottom: 8px; }

    .sh-body { padding: 16px; overflow-y: auto; flex: 1; }
    .sh-card { background: #ffffff; border: 1px solid #dadce0; border-radius: 10px; padding: 14px; margin-bottom: 12px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
    .sh-card-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .sh-card-info { flex: 1; padding-right: 12px; }
    .sh-card-title { font-weight: 500; font-size: 14px; color: #202124; margin-bottom: 4px; }
    .sh-card-desc { font-size: 12px; color: #5f6368; line-height: 1.3; }
    .sh-card-settings { display: none; margin-top: 10px; }
    .sh-settings-divider { height: 1px; background: #f1f3f4; margin: 10px 0; }
    .sh-setting-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .sh-emoji { font-size: 16px; line-height: 1; opacity: 0.8; }
    .sh-adv-text { font-size: 11px; color: #9aa0a6; cursor: pointer; user-select: none; transition: color 0.2s; }
    .sh-adv-text:hover { color: #5f6368; }
    .sh-opt-group { display: flex; gap: 4px; flex: 1; }
    .sh-opt-btn { background: #ffffff; border: 1px solid #dadce0; border-radius: 6px; color: #5f6368; font-size: 12px; font-weight: 600; padding: 4px 0; flex: 1; text-align: center; cursor: pointer; transition: all 0.2s; }
    .sh-opt-btn:hover:not(.active) { background: #f1f3f4; }
    .sh-opt-btn.active { background: #1a73e8; border-color: #1a73e8; color: #ffffff; }
    
    .sh-time-btn { background: #ffffff; border: 1px solid #dadce0; border-radius: 6px; color: #5f6368; font-size: 11px; font-weight: 600; padding: 4px 8px; cursor: pointer; transition: all 0.2s; }
    .sh-time-btn:hover { background: #f1f3f4; color: #202124; }
    .sh-input { padding: 6px 10px; font-size: 13px; border: 1px solid #dadce0; border-radius: 6px; box-sizing: border-box; outline: none; transition: border 0.2s; }
    .sh-input:focus { border-color: #1a73e8; }
    .sh-input-small { width: 35%; flex: 0 0 35%; }
    
    /* HIDE ARROWS FOR NUMBER INPUTS */
    .sh-input[type=number]::-webkit-inner-spin-button, 
    .sh-input[type=number]::-webkit-outer-spin-button { 
        -webkit-appearance: none; 
        margin: 0; 
    }
    .sh-input[type=number] { 
        -moz-appearance: textfield; 
    }
    .sh-range { flex: 1; accent-color: #1a73e8; cursor: pointer; }
    .sh-switch { position: relative; width: 34px; height: 20px; flex-shrink: 0; margin-top: 2px;}
    .sh-switch input { opacity: 0; width: 0; height: 0; }
    .sh-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #dadce0; transition: .3s; border-radius: 20px; }
    .sh-slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
    input:checked + .sh-slider { background-color: #1a73e8; }
    input:checked + .sh-slider:before { transform: translateX(14px); }
    
    /* Shared Advanced Container Logic & Utility Classes */
    .sh-adv-container { display: none; padding-top: 8px; margin-top: 8px; border-top: 1px dashed #e0e0e0; }
    .sh-adv-container.sh-expanded { display: block; }
    .sh-adv-toggle-wrap { display: flex; justify-content: flex-end; margin-top: 6px; }
    .sh-flex-1 { flex: 1; }
    .sh-mt-8 { margin-top: 8px; }
    .sh-space-between { justify-content: space-between; }
    .sh-flex-center-gap { display: flex; align-items: center; gap: 8px; }
    .sh-flex-gap { display: flex; gap: 6px; }
    .sh-time-input-small { width: 55px; text-align: center; padding: 6px 4px; }
    
    /* Binds List and Inputs */
    .sh-bind-list { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
    .sh-bind-row { display: flex; align-items: stretch; background: #f8f9fa; border: 1px solid #e8eaed; border-radius: 6px; overflow: hidden; }
    .sh-bind-key { background: #e8f0fe; color: #1a73e8; font-weight: 600; font-size: 12px; padding: 6px 10px; display: flex; align-items: center; justify-content: center; min-width: 32px; border-right: 1px solid #e8eaed; }
    .sh-bind-action { padding: 6px 10px; font-size: 11px; color: #5f6368; line-height: 1.4; display: flex; align-items: center; flex-wrap: wrap; gap: 4px; }
    .sh-arrow { color: #bdc1c6; font-size: 10px; }
    /* Click-to-delete styling */
    .sh-bind-del-word { cursor: pointer; transition: color 0.2s, text-decoration 0.2s; }
    .sh-bind-del-word:hover { color: #d93025; text-decoration: line-through; }
    /* F-Key Interactions */
    .sh-bind-key { cursor: pointer; transition: background 0.2s, color 0.2s, border-color 0.2s; }
    .sh-bind-key:hover { background: #d2e3fc; color: #174ea6; }
    .sh-bind-key.sh-recording { background: #fce8e6 !important; color: #d93025 !important; border-color: #d93025 !important; }
`;if(window.__scriptHubLoaded){let H=document.getElementById("sh-panel");H&&(H.classList.contains("sh-open")?(H.classList.remove("sh-open"),document.querySelectorAll(".sh-adv-container").forEach(C=>C.classList.remove("sh-expanded")),window.dispatchEvent(new CustomEvent("sh-panel-closed"))):H.classList.add("sh-open"))}else{window.__scriptHubLoaded=!0;async function H(w){let T=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(w));return Array.from(new Uint8Array(T)).map(M=>M.toString(16).padStart(2,"0")).join("")}async function C(){return new Promise(w=>{let T=async()=>{let M=document.querySelector("p.user__username");M&&M.textContent?w(await H(M.textContent.trim())):setTimeout(T,500)};T()})}let D=["24deb6961c3cef1d2e3795aaf4b7e3fe8d83d20adff06215426c05827c8351ca","710a0c6095723bc0a46d78897497b5af0417cee56708fdc10cca6860b686ea6e","bc95a4675c77e3ee07d42d825c05e403c3861d29b24ddd57c6e30ebb7a8c2336","49480808159cde937909eaad603911749197829c0cea7a8b68c29e63c98538c0","61678f96fc810a611097d9b0bc98bc8ecb0abee7cd55f2faa19b455604dc2332","2f5ae5e87d1a659e1a01e2bc2c38441bba81bb12eb39d59695b4960576012c55","004381f7f5b3ace58d7dc03a047674325acd266ddc576c273942fdb7237f7130","f355a6794c9a044989a7d2e5bc1e3aa5bff909a38adfbdc68cc0433042ea84b9"];(async()=>{let w=window.__SH_BRANCH||"main",T=!1;if(w==="local")T=!0;else{let e=await C();if(T=e?D.includes(e):!1,w==="development"&&!T)return}let M=w==="local"?"http://localhost:3000/dist":`https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/${w}/dist`,k={CRET:{targetRate:47,offTaskMins:4,doubleCountMode:!1,scanTimeoutMs:6e3},FAST:{targetRate:100,offTaskMins:10,doubleCountMode:!1,scanTimeoutMs:4e3},UG:{targetRate:47,offTaskMins:4,doubleCountMode:!0,scanTimeoutMs:6e3},REFURB:{targetRate:30,offTaskMins:10,doubleCountMode:!1,scanTimeoutMs:6e3},WHD:{targetRate:20,offTaskMins:5,doubleCountMode:!1,scanTimeoutMs:6e3}},I=new URLSearchParams(window.location.search).get("gradingMode"),L=[];I==="CRETURN_PRIMARY_GRADING"?L=["UG"]:I==="CRETURN"?L=["FAST","CRET"]:I==="CRETURN_REFURB"?L=["REFURB"]:I==="WAREHOUSE_DEALS"?L=["WHD"]:L=["FAST","CRET","UG","REFURB","WHD"];function R(e){return e==="FAST"||e==="CRET"||e==="UG"||e==="REFURB"||e==="WHD"}let _=localStorage.getItem("sh_hub_dep"),y=R(_)&&L.includes(_)?_:L[0];if(_!==y)try{localStorage.setItem("sh_hub_dep",y)}catch{}let A=[{id:"item-counter",name:"\u0420\u0430\u0445\u0443\u0432\u0430\u043B\u044C\u043D\u0438\u043A",file:"counter.js",description:"\u0420\u0430\u0445\u0443\u0454 \u043F\u0430\u0447\u043A\u0438, \u043C\u043E\u0436\u0435\u0442\u0435 \u0441\u0445\u043E\u0432\u0430\u0442\u0438 \u0437 \u0435\u043A\u0440\u0430\u043D\u0443 \u0437\u0430 \u0434\u043E\u043F\u043E\u043C\u043E\u0433\u043E\u044E F10. \u0412\u0438\u0441\u0442\u0430\u0432\u0442\u0435 \u043F\u0435\u0440\u0435\u0440\u0432\u0443.",getHandler:()=>window.__itemCounter,renderSettings:e=>{let n=window.__itemCounter;if(!n)return;let o=n.getSettings(),u=n.getCount(),h=k[y]?k[y].targetRate:47,E=k[y]?k[y].doubleCountMode:!1,b=k[y]?k[y].scanTimeoutMs:6e3,d=o.targetRate!==void 0?o.targetRate:h;n.updateSettings({targetRate:d,doubleCountMode:E,scanTimeoutMs:b}),e.innerHTML=`
                        <div class="sh-settings-divider"></div>
                        <div class="sh-setting-row" title="Options & Manual Edit">
                            <span class="sh-emoji">\u{1F374}</span>
                            <div class="sh-opt-group">
                                <div class="sh-opt-btn ${o.lunchBreak===1?"active":""}" data-val="1">1</div>
                                <div class="sh-opt-btn ${o.lunchBreak===2?"active":""}" data-val="2">2</div>
                                <div class="sh-opt-btn ${o.lunchBreak===3?"active":""}" data-val="3">3</div>
                                <div class="sh-opt-btn ${o.lunchBreak===4?"active":""}" data-val="4">4</div>
                            </div>
                            <span class="sh-emoji">\u270F\uFE0F</span>
                            <input type="number" id="sh-cfg-count" class="sh-input sh-input-small" min="0" value="${u===0?"":u}" placeholder="666" />
                        </div>
                        <div class="sh-setting-row" title="Overlay Opacity">
                            <span class="sh-emoji">\u{1F47B}</span>
                            <input type="range" id="sh-cfg-opacity" class="sh-range" min="0" max="1" step="0.05" value="${o.overlayOpacity}" />
                        </div>
                        
                        <div id="sh-adv-container-item-counter" class="sh-adv-container">
                            <div class="sh-setting-row" title="Target Rate">
                                <span class="sh-emoji">\u{1F3AF}</span>
                                <input type="number" id="sh-cfg-target" class="sh-input sh-flex-1" min="0" value="${d}" placeholder="\u041D\u0435\u043E\u0431\u0445\u0456\u0434\u043D\u0430 \u043D\u043E\u0440\u043C\u0430" />
                            </div>
                            
                            <div class="sh-setting-row sh-mt-8 sh-space-between" title="\u0412\u043B\u0430\u0441\u043D\u0438\u0439 \u0447\u0430\u0441 \u043F\u043E\u0447\u0430\u0442\u043A\u0443 \u0437\u043C\u0456\u043D\u0438">
                                <div class="sh-flex-center-gap">
                                    <span class="sh-emoji">\u23F1\uFE0F</span>
                                    <input type="text" id="sh-cfg-start-time" class="sh-input sh-time-input-small" value="${o.customStartTime||""}" placeholder="14:30" maxlength="5" />
                                </div>
                                <div class="sh-flex-gap">
                                    <button id="sh-btn-start-now" class="sh-time-btn">\u0417\u0430\u0440\u0430\u0437</button>
                                    <button id="sh-btn-start-reset" class="sh-time-btn">\u0421\u043A\u0438\u043D\u0443\u0442\u0438</button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="sh-adv-toggle-wrap">
                            <span id="sh-adv-btn-item-counter" class="sh-adv-text">\u0420\u043E\u0437\u0448\u0438\u0440\u0435\u043D\u0456</span>
                        </div>
                    `,e.querySelectorAll(".sh-opt-btn").forEach(s=>{s.addEventListener("click",l=>{let a=l.target;e.querySelectorAll(".sh-opt-btn").forEach(m=>m.classList.remove("active")),a.classList.add("active");let p=parseInt(a.getAttribute("data-val")||"1",10);n.updateSettings({lunchBreak:p})})});let v=e.querySelector("#sh-cfg-count");v&&v.addEventListener("input",s=>{let l=s.target,a=parseInt(l.value,10);isNaN(a)&&(a=0),a<0&&(a=0,l.value="0"),n.setCount(a)});let x=e.querySelector("#sh-cfg-opacity");x&&x.addEventListener("input",s=>{let l=s.target,a=parseFloat(l.value);n.updateSettings({overlayOpacity:a})});let g=e.querySelector("#sh-cfg-target");g&&g.addEventListener("input",s=>{let l=s.target,a=parseFloat(l.value);(isNaN(a)||a<0)&&(a=0),n.updateSettings({targetRate:a})});let f=e.querySelector("#sh-cfg-start-time"),c=e.querySelector("#sh-btn-start-now"),t=e.querySelector("#sh-btn-start-reset");f&&c&&t&&(f.addEventListener("input",s=>{let l=s.target,a=s,p=l.value.replace(/\D/g,"").split(""),m="";if(p.length>0){let S=p.shift();S>="3"?m+="0"+S:m+=S}if(p.length>0&&m.length===1){let S=p.shift();m[0]==="2"&&S>="4"?(m="0"+m[0],p.unshift(S)):m+=S}if(m.length===2&&(p.length>0||a.inputType!=="deleteContentBackward"||l.value.endsWith(":"))&&(m+=":"),p.length>0){let S=p.shift();S>="6"?m+="0"+S:m+=S}if(p.length>0&&m.length===4){let S=p.shift();m+=S}l.value=m,m.length===5&&m.match(/^\d{2}:\d{2}$/)?n.updateSettings({customStartTime:m}):m===""&&n.updateSettings({customStartTime:null})}),c.addEventListener("click",()=>{let s=new Date,l=String(s.getHours()).padStart(2,"0"),a=String(s.getMinutes()).padStart(2,"0"),p=`${l}:${a}`;f.value=p,n.updateSettings({customStartTime:p})}),t.addEventListener("click",()=>{f.value="",n.updateSettings({customStartTime:null})}));let i=e.querySelector("#sh-adv-btn-item-counter"),r=e.querySelector("#sh-adv-container-item-counter");i&&r&&i.addEventListener("click",()=>{r.classList.toggle("sh-expanded")})}},{id:"off-task",name:"\u0410\u0432\u0442\u043E-\u0412\u0432\u0435\u0434\u0435\u043D\u043D\u044F (Off-Task)",file:"off_task.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u043F\u0440\u0438\u0431\u0438\u0432\u0430\u0454 \u0434\u043E \u0442\u043E\u0442\u0430 \u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0439 \u0447\u0430\u0441.",getHandler:()=>window.__offTask,renderSettings:e=>{let n=window.__offTask;if(!n)return;let o=k[y].offTaskMins,u=n.getSettings(),h=u.timeoutMins!==void 0?u.timeoutMins:o,E=u.toteBarcode||"";u.timeoutMins===void 0&&n.updateSettings({timeoutMins:o}),e.innerHTML=`
                        <div class="sh-setting-row" style="align-items: center; gap: 6px; margin-bottom: 2px;">
                            <span class="sh-emoji" title="\u0422\u0430\u0440\u0430">\u{1F4E6}</span>
                            <input type="text" id="sh-ot-tote" class="sh-input sh-flex-1" style="min-width: 0;" value="${E}" placeholder="ts... (\u043F\u0443\u0441\u0442\u043E=\u0432\u0438\u043C\u043A)" autocomplete="off">
                            <span class="sh-emoji" title="\u0425\u0432\u0438\u043B\u0438\u043D\u0438">\u23F1\uFE0F</span>
                            <input type="text" id="sh-ot-mins" class="sh-input sh-time-input-small" style="width: 50px; padding: 6px 2px;" value="${h}" title="\u0422\u0430\u0439\u043C\u0435\u0440">
                        </div>
                    `;let b=e.querySelector("#sh-ot-tote"),d=e.querySelector("#sh-ot-mins");b.addEventListener("input",f=>{let c=f.target.value.trim();n.updateSettings({toteBarcode:c}),c||(d.value=n.getSettings().timeoutMins?.toString()||o.toString())}),d.addEventListener("change",f=>{let c=f.target.value.trim(),t=o;if(c.includes(":")){let i=c.split(":");t=parseInt(i[0]||"0",10)+parseInt(i[1]||"0",10)/60}else{let i=parseFloat(c);!isNaN(i)&&i>0&&(t=i)}n.updateSettings({timeoutMins:t})}),d.addEventListener("keydown",f=>{f.key==="Enter"&&d.blur()});let v=()=>{document.activeElement!==b&&(b.value=n.getSettings().toteBarcode||""),document.activeElement!==d&&(d.value=n.getSettings().timeoutMins?.toString()||o.toString(),d.style.color="")},x=f=>{if(document.activeElement===d||!n.getSettings().toteBarcode)return;let c=Math.ceil(f.detail.remainingMs/1e3),t=Math.floor(c/60),i=String(c%60).padStart(2,"0");d.value=`${t}:${i}`,d.style.color=c<=30?"#d93025":"#1a73e8",d.style.fontWeight="bold"};e._abortController&&e._abortController.abort();let g=new AbortController;e._abortController=g,window.addEventListener("sh-offtask-update",v,{signal:g.signal}),window.addEventListener("sh-offtask-tick",x,{signal:g.signal})},isTrusted:!0},{id:"binds",name:"\u0411\u0456\u043D\u0434\u0438",file:"binds.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u043F\u0440\u043E\u043A\u043B\u0456\u043A\u0443\u0454 \u043F\u0440\u0438 \u043D\u0430\u0442\u0438\u0441\u043D\u0435\u043D\u043D\u0456.<br>\u041D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C \u043D\u0430 F-\u043A\u043D\u043E\u043F\u043A\u0443 \u0434\u043B\u044F \u0437\u0430\u043F\u0438\u0441\u0443(\u0430\u043B\u044C\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043D\u043E F9 \u0456 F1-F7) \u0430\u0431\u043E \u043D\u0430 \u0441\u043B\u043E\u0432\u043E, \u0449\u043E\u0431 \u0432\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0439\u043E\u0433\u043E.",getHandler:()=>window.__binds,renderSettings:e=>{let n=window.__binds;if(!n)return;let o=JSON.parse(JSON.stringify(n.getShortcuts()));e._abortController&&e._abortController.abort();let u=new AbortController;e._abortController=u,window.addEventListener("sh-binds-update",()=>{o=JSON.parse(JSON.stringify(n.getShortcuts())),h()},{signal:u.signal});let h=()=>{let E=Object.keys(o),b=n.getRecordingKey(),d="";E.length>0?d=E.map(g=>{let f=o[g],c=b===g,t=f.map((s,l)=>{let a=s.split(/\s+/).slice(0,2).join(" ");return`<span class="sh-bind-del-word" data-key="${g}" data-idx="${l}" title="\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438: ${s}">${a}</span>`}).join(' <span class="sh-arrow">\u2794</span> '),i=f.length>0?t:c?"<i>\u0417\u0430\u043F\u0438\u0441...</i>":"";return`
                                    <div class="sh-bind-row">
                                        <div class="${c?"sh-bind-key sh-recording":"sh-bind-key"}" data-key="${g}" title="\u0417\u0430\u043F\u0438\u0441 / \u0417\u0443\u043F\u0438\u043D\u043A\u0430">${g}</div>
                                        <div class="sh-bind-action">${i}</div>
                                    </div>
                                `}).join(""):d='<div style="text-align:center; padding: 10px; font-size: 11px; color:#9aa0a6;">\u041D\u0430\u0440\u0430\u0437\u0456 \u043D\u0435\u043C\u0430\u0454 \u0436\u043E\u0434\u043D\u043E\u0433\u043E \u0431\u0456\u043D\u0434\u0430.</div>',e.innerHTML=`
                            <div id="sh-adv-container-binds" class="sh-adv-container ${e.querySelector("#sh-adv-container-binds")?.classList.contains("sh-expanded")?"sh-expanded":""}">
                                <div class="sh-bind-list">
                                    ${d}
                                </div>
                            </div>
                            <div class="sh-adv-toggle-wrap">
                                <span id="sh-adv-btn-binds" class="sh-adv-text" style="margin-left: auto;">\u0414\u0435\u0442\u0430\u043B\u044C\u043D\u0456\u0448\u0435</span>
                            </div>
                        `,e.querySelectorAll(".sh-bind-key").forEach(g=>{g.addEventListener("click",f=>{let t=f.target.getAttribute("data-key");t&&(n.getRecordingKey()===t?n.stopRecording():n.startRecording(t))})}),e.querySelectorAll(".sh-bind-del-word").forEach(g=>{g.addEventListener("click",f=>{let c=f.target,t=c.getAttribute("data-key"),i=c.getAttribute("data-idx");if(t&&i!==null&&!b){let r=parseInt(i,10);o[t].splice(r,1),n.updateShortcuts(o),h()}})});let v=e.querySelector("#sh-adv-btn-binds"),x=e.querySelector("#sh-adv-container-binds");v&&x&&v.addEventListener("click",()=>{x.classList.toggle("sh-expanded")})};h()}},{id:"auto-lpn",name:"\u0410\u0432\u0442\u043E-LPN",file:"auto_lpn.js",description:'\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0432\u0456\u0434\u043A\u0440\u0438\u0432\u0430\u0454 "\u043F\u0435\u0440\u0435\u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0438\u0442\u0438 LPN" \u043F\u0440\u0438 \u0441\u043A\u0430\u043D\u0443\u0432\u0430\u043D\u043D\u0456 LPN \u0430\u0431\u043E \u0431\u0443\u0434\u044C-\u0447\u043E\u0433\u043E \u0456\u043D\u0448\u043E\u0433\u043E, \u043E\u043A\u0440\u0456\u043C \u0442\u043E\u0442\u0430',excludeDeps:["REFURB","WHD"],getHandler:()=>window.__autoLpn},{id:"refurb-lpn",name:"\u0410\u0432\u0442\u043E-LPN",file:"auto_lpn_refurb.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0437\u0430\u043F\u043E\u0432\u043D\u044E\u0454 \u0441\u0442\u0430\u0440\u0443 LPN",excludeDeps:["CRET","FAST","UG"],getHandler:()=>window.__refurbLpn},{id:"gravis-lpn",name:"Gravis \u0434\u043B\u044F LPN",file:"gravis.js",description:"\u041D\u0430\u043F\u0438\u0448\u0456\u0442\u044C gr, \u0449\u043E\u0431 \u0432\u0456\u0434\u043A\u0440\u0438\u0442\u0438 gravis \u0434\u043B\u044F \u0434\u0430\u043D\u043E\u0433\u043E \u0442\u043E\u0432\u0430\u0440\u0443",getHandler:()=>window.__gravis},{id:"dev-inspector",name:"Dev Inspector",file:"dev_inspector.js",description:"Logs detailed element data, CSS, and coordinates to the console on click.",experimental:!0,getHandler:()=>window.__devInspector,renderSettings:e=>{let n=window.__devInspector;if(!n||!n.getSettings)return;let o=n.getSettings(),u=(h,E,b)=>{let d=document.createElement("div");Object.assign(d.style,{display:"flex",alignItems:"center",marginBottom:"8px"});let v=document.createElement("input");v.type="checkbox",v.id=h,v.checked=o[b],v.style.marginRight="8px";let x=document.createElement("label");return x.htmlFor=h,x.textContent=E,Object.assign(x.style,{fontSize:"13px",color:"#aab7c4",cursor:"pointer"}),v.addEventListener("change",g=>{n.updateSettings({[b]:g.target.checked})}),d.appendChild(v),d.appendChild(x),d};e.appendChild(u("sh-dev-details","Show Element Details","showDetails")),e.appendChild(u("sh-dev-css","Show Element CSS","showCSS")),e.appendChild(u("sh-dev-coords","Show Click Coordinates","showCoords"))}}];async function B(e,n,o){let u=n.checked,h=e.getHandler();if(u&&!h){n.disabled=!0;let E=`${M}/${e.file}?cb=${Date.now()}`;try{let b=await fetch(E);if(!b.ok)throw new Error(`HTTP ${b.status}`);let d=await b.text(),v=document.createElement("script");v.textContent=d,document.head.appendChild(v),h=e.getHandler(),n.disabled=!1}catch(b){alert(`\u26A0\uFE0F Failed to load ${e.name}:
${b.message}`),n.checked=!1,n.disabled=!1;return}}h&&(u?(h.enable(),e.renderSettings&&o&&(o.style.display="block",e.renderSettings(o))):(h.disable(),o&&(o.style.display="none",o.innerHTML="")))}["keydown","keyup","keypress"].forEach(e=>{window.addEventListener(e,n=>{let o=n.target;o&&o.closest("#sh-root")&&n.stopPropagation()},!0)});function N(){let e="sh_panel_opacity",n=.4;try{let t=localStorage.getItem(e);if(t!==null){let i=parseFloat(t);!isNaN(i)&&i>=.1&&i<=1&&(n=i)}}catch{}let o=document.createElement("div");o.id="sh-root",o.innerHTML=`
                <style>
                    ${$}
                </style>
                
                <div id="sh-panel" style="opacity: ${n};">
                    <div class="sh-header">
                        <div class="sh-header-group">
                            <select id="sh-subdep-select" class="sh-dep-dropdown">
                                ${L.map(t=>`<option value="${t}" ${y===t?"selected":""}>${t}</option>`).join(`
                            `)}
                            </select>
                            <label class="sh-switch" title="Toggle all scripts" style="margin: 0;">
                                <input type="checkbox" id="sh-chk-all">
                                <span class="sh-slider"></span>
                            </label>
                            <a href="https://eu-cretfc-tools-dub.dub.proxy.amazon.com/gravis" target="_blank" rel="noopener noreferrer" class="sh-url-btn">GRAVIS</a>
                            <a href="https://w.amazon.com/bin/view/Wikipedia_LCJ4/" target="_blank" rel="noopener noreferrer" class="sh-url-btn">WIKI</a>
                        </div>
                        <button class="sh-settings-btn" id="sh-settings-toggle-btn" title="\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F">\u2699\uFE0F</button>
                    </div>
                    <div class="sh-global-settings" id="sh-global-settings">
                        <div class="sh-global-settings-title">\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u043F\u0430\u043D\u0435\u043B\u0456</div>
                        <div class="sh-setting-row" title="\u041F\u0440\u043E\u0437\u043E\u0440\u0456\u0441\u0442\u044C \u043F\u0430\u043D\u0435\u043B\u0456">
                            <span class="sh-emoji">\u{1F441}\uFE0F</span>
                            <input type="range" id="sh-panel-opacity" class="sh-range" min="0.1" max="1" step="0.05" value="${n}" />
                        </div>
                    </div>
                    <div class="sh-body" id="sh-list"></div>
                </div>
            `,document.body.appendChild(o);let u=document.getElementById("sh-panel"),h=document.getElementById("sh-settings-toggle-btn"),E=document.getElementById("sh-global-settings"),b=document.getElementById("sh-panel-opacity");h&&E&&h.addEventListener("click",()=>{h.classList.toggle("active"),E.classList.toggle("sh-expanded")}),b&&b.addEventListener("input",t=>{let i=t.target,r=parseFloat(i.value);u.style.opacity=r.toString();try{localStorage.setItem(e,r.toString())}catch{}});function d(){u.classList.remove("sh-open"),document.querySelectorAll(".sh-adv-container").forEach(t=>t.classList.remove("sh-expanded")),E&&E.classList.remove("sh-expanded"),h&&h.classList.remove("active"),window.dispatchEvent(new CustomEvent("sh-panel-closed"))}document.addEventListener("mousedown",t=>{let i=t.target;u.classList.contains("sh-open")&&!u.contains(i)&&d()});let v=document.getElementById("sh-subdep-select");v&&v.addEventListener("change",t=>{let i=t.target;if(R(i.value)){y=i.value,localStorage.setItem("sh_hub_dep",y);let r=k[y];if(r){if(window.__itemCounter){window.__itemCounter.updateSettings({targetRate:r.targetRate,doubleCountMode:r.doubleCountMode,scanTimeoutMs:r.scanTimeoutMs});let s=document.getElementById("sh-cfg-target");s&&(s.value=r.targetRate.toString())}else try{let s=JSON.parse(localStorage.getItem("sh_item_counter_settings")||"{}");s.targetRate=r.targetRate,s.doubleCountMode=r.doubleCountMode,s.scanTimeoutMs=r.scanTimeoutMs,localStorage.setItem("sh_item_counter_settings",JSON.stringify(s))}catch{}if(window.__offTask){window.__offTask.updateSettings({timeoutMins:r.offTaskMins});let s=document.getElementById("sh-ot-mins");s&&(s.value=r.offTaskMins.toString())}else try{let s=JSON.parse(localStorage.getItem("sh_off_task_settings")||"{}");s.timeoutMins=r.offTaskMins,localStorage.setItem("sh_off_task_settings",JSON.stringify(s))}catch{}}x.forEach(s=>{let l=document.getElementById(`sh-card-${s.id}`);if(l)if(s.excludeDeps?.includes(y)){l.style.display="none";let a=s.getHandler(),p=document.getElementById(`sh-chk-${s.id}`);a&&a.isActive()&&(a.disable(),p&&(p.checked=!1))}else l.style.display="block"})}});let x=A.filter(t=>!(t.experimental&&!["development","local"].includes(w)||t.isTrusted&&!T)),g=()=>{let t=document.getElementById("sh-chk-all");if(!t)return;let i=document.getElementById("sh-sub-dep-select"),r=i?i.value:"UG",l=x.filter(a=>!(a.experimental||a.excludeDeps&&a.excludeDeps.includes(r))).map(a=>document.getElementById(`sh-chk-${a.id}`));t.checked=l.length>0&&l.every(a=>a&&a.checked)},f=document.getElementById("sh-list");f&&x.forEach(t=>{let i=t.getHandler(),r=i?i.isActive():!1,s=document.createElement("div");s.id=`sh-card-${t.id}`,s.className="sh-card",t.excludeDeps?.includes(y)&&(s.style.display="none"),s.innerHTML=`
                        <div class="sh-card-top">
                            <div class="sh-card-info">
                                <div class="sh-card-title">${t.name}</div>
                                <div class="sh-card-desc">${t.description}</div>
                            </div>
                            <label class="sh-switch">
                                <input type="checkbox" id="sh-chk-${t.id}" ${r?"checked":""}>
                                <span class="sh-slider"></span>
                            </label>
                        </div>
                        <div class="sh-card-settings" id="sh-settings-${t.id}"></div>
                    `,f.appendChild(s);let l=s.querySelector(`#sh-chk-${t.id}`),a=s.querySelector(`#sh-settings-${t.id}`);r&&t.renderSettings&&(a.style.display="block",t.renderSettings(a)),l&&(l.onchange=async()=>{await B(t,l,a),g()})});let c=document.getElementById("sh-chk-all");c&&c.addEventListener("change",t=>{let i=t.target.checked,r=[],s=document.getElementById("sh-sub-dep-select"),l=s?s.value:"UG";x.forEach(a=>{if(a.experimental||a.excludeDeps&&a.excludeDeps.includes(l))return;let p=document.getElementById(`sh-chk-${a.id}`),m=document.getElementById(`sh-settings-${a.id}`);p&&p.checked!==i&&!p.disabled&&(p.checked=i,r.push(B(a,p,m)))}),r.length>0&&(c.disabled=!0,Promise.all(r).finally(()=>{c.disabled=!1,g()}))}),g(),setTimeout(()=>{u.classList.add("sh-open")},100)}N()})()}})();
