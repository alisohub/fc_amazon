"use strict";(()=>{var C="sh_hub_dep";var B="sh_item_counter_settings",P="sh_off_task_settings";var A="sh_lpn",O="sh_work_station";var U=["Wprowad\u017A LPN"],j=["Wprowad\u017A stacj\u0119 robocz\u0105"],G=["Wprowad\u017A numer rma"],z=["Wprowad\u017A lpn lub sku"];var W=`
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
`;if(window.location.href.includes("gravis"))(async()=>{let L=window.__SH_BRANCH||"main",N=L==="local"?"http://localhost:3000/dist/hub_gravis.js":`https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/${L}/dist/hub_gravis.js`;try{let I=await fetch(N);if(!I.ok)throw new Error(`HTTP ${I.status}`);let E=await I.text(),w=document.createElement("script");w.textContent=E,document.head.appendChild(w)}catch(I){alert(`\u26A0\uFE0F Failed to load Gravis Hub: ${I}`)}})();else if(window.__scriptHubLoaded){let L=document.getElementById("sh-panel");L&&(L.classList.contains("sh-open")?(L.classList.remove("sh-open"),document.querySelectorAll(".sh-adv-container").forEach(N=>N.classList.remove("sh-expanded")),window.dispatchEvent(new CustomEvent("sh-panel-closed"))):L.classList.add("sh-open"))}else{window.__scriptHubLoaded=!0;async function L(E){let w=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(E));return Array.from(new Uint8Array(w)).map(M=>M.toString(16).padStart(2,"0")).join("")}async function N(){return new Promise(E=>{let w=Date.now(),M=async()=>{let _=document.querySelector("p.user__username");_&&_.textContent?E(await L(_.textContent.trim())):Date.now()-w>1e4?E(null):setTimeout(M,500)};M()})}let I=["24deb6961c3cef1d2e3795aaf4b7e3fe8d83d20adff06215426c05827c8351ca","710a0c6095723bc0a46d78897497b5af0417cee56708fdc10cca6860b686ea6e","bc95a4675c77e3ee07d42d825c05e403c3861d29b24ddd57c6e30ebb7a8c2336","49480808159cde937909eaad603911749197829c0cea7a8b68c29e63c98538c0","61678f96fc810a611097d9b0bc98bc8ecb0abee7cd55f2faa19b455604dc2332","2f5ae5e87d1a659e1a01e2bc2c38441bba81bb12eb39d59695b4960576012c55","004381f7f5b3ace58d7dc03a047674325acd266ddc576c273942fdb7237f7130","f355a6794c9a044989a7d2e5bc1e3aa5bff909a38adfbdc68cc0433042ea84b9"];(async()=>{let E=window.__SH_BRANCH||"main",w=!1;if(E==="local")w=!0;else{let s=await N();if(!s||(w=I.includes(s),E==="development"&&!w))return}let M=E==="local"?"http://localhost:3000/dist":`https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/${E}/dist`,_={CRET:{targetRate:47,offTaskMins:4,doubleCountMode:!1,scanTimeoutMs:6e3},FAST:{targetRate:80,offTaskMins:2,doubleCountMode:!1,scanTimeoutMs:4e3},UG:{targetRate:47,offTaskMins:4,doubleCountMode:!0,scanTimeoutMs:6e3},REFURB:{targetRate:30,offTaskMins:1,doubleCountMode:!1,scanTimeoutMs:6e3},WHD:{targetRate:25,offTaskMins:5,doubleCountMode:!1,scanTimeoutMs:6e3}},H=new URLSearchParams(window.location.search).get("gradingMode"),k=[];H==="CRETURN_PRIMARY_GRADING"?k=["UG"]:H==="CRETURN"?k=["FAST","CRET"]:H==="CRETURN_REFURB"?k=["REFURB"]:H==="WAREHOUSE_DEALS"?k=["WHD"]:k=["FAST","CRET","UG","REFURB","WHD"];function D(s){return s==="FAST"||s==="CRET"||s==="UG"||s==="REFURB"||s==="WHD"}let R=localStorage.getItem(C),b=D(R)&&k.includes(R)?R:k[0];if(R!==b)try{localStorage.setItem(C,b)}catch{}let F=[{id:"item-counter",name:"\u0420\u0430\u0445\u0443\u0432\u0430\u043B\u044C\u043D\u0438\u043A",file:"counter.js",description:"\u0420\u0430\u0445\u0443\u0454 \u043F\u0430\u0447\u043A\u0438, \u043C\u043E\u0436\u0435\u0442\u0435 \u0441\u0445\u043E\u0432\u0430\u0442\u0438 \u0437 \u0435\u043A\u0440\u0430\u043D\u0443 \u0437\u0430 \u0434\u043E\u043F\u043E\u043C\u043E\u0433\u043E\u044E F10. \u0412\u0438\u0441\u0442\u0430\u0432\u0442\u0435 \u043F\u0435\u0440\u0435\u0440\u0432\u0443.",getHandler:()=>window.__itemCounter,renderSettings:s=>{let n=window.__itemCounter;if(!n)return;let i=n.getSettings(),h=n.getCount(),f=_[b]?_[b].targetRate:47,x=_[b]?_[b].doubleCountMode:!1,v=_[b]?_[b].scanTimeoutMs:6e3,p=i.targetRate!==void 0?i.targetRate:f;n.updateSettings({targetRate:p,doubleCountMode:x,scanTimeoutMs:v}),s.innerHTML=`
                            <div class="sh-settings-divider"></div>
                            <div class="sh-setting-row" title="Options & Manual Edit">
                                <span class="sh-emoji">\u{1F374}</span>
                                <div class="sh-opt-group">
                                    <div class="sh-opt-btn ${i.lunchBreak===1?"active":""}" data-val="1">1</div>
                                    <div class="sh-opt-btn ${i.lunchBreak===2?"active":""}" data-val="2">2</div>
                                    <div class="sh-opt-btn ${i.lunchBreak===3?"active":""}" data-val="3">3</div>
                                    <div class="sh-opt-btn ${i.lunchBreak===4?"active":""}" data-val="4">4</div>
                                </div>
                                <span class="sh-emoji">\u270F\uFE0F</span>
                                <input type="number" id="sh-cfg-count" class="sh-input sh-input-small" min="0" value="${h===0?"":h}" placeholder="666" />
                            </div>
                            <div class="sh-setting-row" title="Overlay Opacity">
                                <span class="sh-emoji">\u{1F47B}</span>
                                <input type="range" id="sh-cfg-opacity" class="sh-range" min="0" max="1" step="0.05" value="${i.overlayOpacity}" />
                            </div>
                            
                            <div id="sh-adv-container-item-counter" class="sh-adv-container">
                                <div class="sh-setting-row" title="Target Rate">
                                    <span class="sh-emoji">\u{1F3AF}</span>
                                    <input type="number" id="sh-cfg-target" class="sh-input sh-flex-1" min="0" value="${p}" placeholder="\u041D\u0435\u043E\u0431\u0445\u0456\u0434\u043D\u0430 \u043D\u043E\u0440\u043C\u0430" />
                                </div>
                                
                                <div class="sh-setting-row sh-mt-8 sh-space-between" title="\u0412\u043B\u0430\u0441\u043D\u0438\u0439 \u0447\u0430\u0441 \u043F\u043E\u0447\u0430\u0442\u043A\u0443 \u0437\u043C\u0456\u043D\u0438">
                                    <div class="sh-flex-center-gap">
                                        <span class="sh-emoji">\u23F1\uFE0F</span>
                                        <input type="text" id="sh-cfg-start-time" class="sh-input sh-time-input-small" value="${i.customStartTime||""}" placeholder="14:30" maxlength="5" />
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
                        `,s.querySelectorAll(".sh-opt-btn").forEach(e=>{e.addEventListener("click",r=>{let l=r.target;s.querySelectorAll(".sh-opt-btn").forEach(c=>c.classList.remove("active")),l.classList.add("active");let m=parseInt(l.getAttribute("data-val")||"1",10);n.updateSettings({lunchBreak:m})})});let T=s.querySelector("#sh-cfg-count");T&&T.addEventListener("input",e=>{let r=e.target,l=parseInt(r.value,10);isNaN(l)&&(l=0),l<0&&(l=0,r.value="0"),n.setCount(l)});let S=s.querySelector("#sh-cfg-opacity");S&&S.addEventListener("input",e=>{let r=e.target,l=parseFloat(r.value);n.updateSettings({overlayOpacity:l})});let g=s.querySelector("#sh-cfg-target");g&&g.addEventListener("input",e=>{let r=e.target,l=parseFloat(r.value);(isNaN(l)||l<0)&&(l=0),n.updateSettings({targetRate:l})});let u=s.querySelector("#sh-cfg-start-time"),d=s.querySelector("#sh-btn-start-now"),t=s.querySelector("#sh-btn-start-reset");u&&d&&t&&(u.addEventListener("input",e=>{let r=e.target,l=e,m=r.value.replace(/\D/g,"").split(""),c="";if(m.length>0){let y=m.shift();y>="3"?c+="0"+y:c+=y}if(m.length>0&&c.length===1){let y=m.shift();c[0]==="2"&&y>="4"?(c="0"+c[0],m.unshift(y)):c+=y}if(c.length===2&&(m.length>0||l.inputType!=="deleteContentBackward"||r.value.endsWith(":"))&&(c+=":"),m.length>0){let y=m.shift();y>="6"?c+="0"+y:c+=y}if(m.length>0&&c.length===4){let y=m.shift();c+=y}r.value=c,c.length===5&&c.match(/^\d{2}:\d{2}$/)?n.updateSettings({customStartTime:c}):c===""&&n.updateSettings({customStartTime:null})}),d.addEventListener("click",()=>{let e=new Date,r=String(e.getHours()).padStart(2,"0"),l=String(e.getMinutes()).padStart(2,"0"),m=`${r}:${l}`;u.value=m,n.updateSettings({customStartTime:m})}),t.addEventListener("click",()=>{u.value="",n.updateSettings({customStartTime:null})}));let a=s.querySelector("#sh-adv-btn-item-counter"),o=s.querySelector("#sh-adv-container-item-counter");a&&o&&a.addEventListener("click",()=>{o.classList.toggle("sh-expanded")})}},{id:"off-task",name:"\u0410\u0432\u0442\u043E-\u0412\u0432\u0435\u0434\u0435\u043D\u043D\u044F (Off-Task)",file:"off_task.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u043F\u0440\u0438\u0431\u0438\u0432\u0430\u0454 \u0434\u043E \u0442\u043E\u0442\u0430 \u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0439 \u0447\u0430\u0441.",getHandler:()=>window.__offTask,renderSettings:s=>{let n=window.__offTask;if(!n)return;let i=_[b].offTaskMins,h=n.getSettings(),f=h.timeoutMins!==void 0?h.timeoutMins:i,x=h.toteBarcode||"";h.timeoutMins===void 0&&n.updateSettings({timeoutMins:i}),s.innerHTML=`
                            <div class="sh-setting-row" style="align-items: center; gap: 6px; margin-bottom: 2px;">
                                <span class="sh-emoji" title="\u0422\u0430\u0440\u0430">\u{1F4E6}</span>
                                <input type="text" id="sh-ot-tote" class="sh-input sh-flex-1" style="min-width: 0;" value="${x}" placeholder="ts... (\u043F\u0443\u0441\u0442\u043E=\u0432\u0438\u043C\u043A)" autocomplete="off">
                                <span class="sh-emoji" title="\u0425\u0432\u0438\u043B\u0438\u043D\u0438">\u23F1\uFE0F</span>
                                <input type="text" id="sh-ot-mins" class="sh-input sh-time-input-small" style="width: 50px; padding: 6px 2px;" value="${f}" title="\u0422\u0430\u0439\u043C\u0435\u0440">
                            </div>
                        `;let v=s.querySelector("#sh-ot-tote"),p=s.querySelector("#sh-ot-mins");v.addEventListener("input",u=>{let d=u.target.value.trim();n.updateSettings({toteBarcode:d}),d||(p.value=n.getSettings().timeoutMins?.toString()||i.toString())}),p.addEventListener("change",u=>{let d=u.target.value.trim(),t=i;if(d.includes(":")){let a=d.split(":");t=parseInt(a[0]||"0",10)+parseInt(a[1]||"0",10)/60}else{let a=parseFloat(d);!isNaN(a)&&a>0&&(t=a)}n.updateSettings({timeoutMins:t})}),p.addEventListener("keydown",u=>{u.key==="Enter"&&p.blur()});let T=()=>{document.activeElement!==v&&(v.value=n.getSettings().toteBarcode||""),document.activeElement!==p&&(p.value=n.getSettings().timeoutMins?.toString()||i.toString(),p.style.color="")},S=u=>{if(document.activeElement===p||!n.getSettings().toteBarcode)return;let d=Math.ceil(u.detail.remainingMs/1e3),t=Math.floor(d/60),a=String(d%60).padStart(2,"0");p.value=`${t}:${a}`,p.style.color=d<=30?"#d93025":"#1a73e8",p.style.fontWeight="bold"};s._abortController&&s._abortController.abort();let g=new AbortController;s._abortController=g,window.addEventListener("sh-offtask-update",T,{signal:g.signal}),window.addEventListener("sh-offtask-tick",S,{signal:g.signal})},isTrusted:!0},{id:"binds",name:"\u0411\u0456\u043D\u0434\u0438",file:"binds.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u043F\u0440\u043E\u043A\u043B\u0456\u043A\u0443\u0454 \u043F\u0440\u0438 \u043D\u0430\u0442\u0438\u0441\u043D\u0435\u043D\u043D\u0456.<br>\u041D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C \u043D\u0430 F-\u043A\u043D\u043E\u043F\u043A\u0443 \u0434\u043B\u044F \u0437\u0430\u043F\u0438\u0441\u0443(\u0430\u043B\u044C\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043D\u043E F9 \u0456 F1-F7) \u0430\u0431\u043E \u043D\u0430 \u0441\u043B\u043E\u0432\u043E, \u0449\u043E\u0431 \u0432\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0439\u043E\u0433\u043E.",getHandler:()=>window.__binds,renderSettings:s=>{let n=window.__binds;if(!n)return;let i=JSON.parse(JSON.stringify(n.getShortcuts()));s._abortController&&s._abortController.abort();let h=new AbortController;s._abortController=h,window.addEventListener("sh-binds-update",()=>{i=JSON.parse(JSON.stringify(n.getShortcuts())),f()},{signal:h.signal});let f=()=>{let x=Object.keys(i),v=n.getRecordingKey(),p="";x.length>0?p=x.map(g=>{let u=i[g],d=v===g,t=u.map((e,r)=>{let l=e.split(/\s+/).slice(0,2).join(" ");return`<span class="sh-bind-del-word" data-key="${g}" data-idx="${r}" title="\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438: ${e}">${l}</span>`}).join(' <span class="sh-arrow">\u2794</span> '),a=u.length>0?t:d?"<i>\u0417\u0430\u043F\u0438\u0441...</i>":"";return`
                                        <div class="sh-bind-row">
                                            <div class="${d?"sh-bind-key sh-recording":"sh-bind-key"}" data-key="${g}" title="\u0417\u0430\u043F\u0438\u0441 / \u0417\u0443\u043F\u0438\u043D\u043A\u0430">${g}</div>
                                            <div class="sh-bind-action">${a}</div>
                                        </div>
                                    `}).join(""):p='<div style="text-align:center; padding: 10px; font-size: 11px; color:#9aa0a6;">\u041D\u0430\u0440\u0430\u0437\u0456 \u043D\u0435\u043C\u0430\u0454 \u0436\u043E\u0434\u043D\u043E\u0433\u043E \u0431\u0456\u043D\u0434\u0430.</div>',s.innerHTML=`
                                <div id="sh-adv-container-binds" class="sh-adv-container ${s.querySelector("#sh-adv-container-binds")?.classList.contains("sh-expanded")?"sh-expanded":""}">
                                    <div class="sh-bind-list">
                                        ${p}
                                    </div>
                                </div>
                                <div class="sh-adv-toggle-wrap">
                                    <span id="sh-adv-btn-binds" class="sh-adv-text" style="margin-left: auto;">\u0414\u0435\u0442\u0430\u043B\u044C\u043D\u0456\u0448\u0435</span>
                                </div>
                            `,s.querySelectorAll(".sh-bind-key").forEach(g=>{g.addEventListener("click",u=>{let t=u.target.getAttribute("data-key");t&&(n.getRecordingKey()===t?n.stopRecording():n.startRecording(t))})}),s.querySelectorAll(".sh-bind-del-word").forEach(g=>{g.addEventListener("click",u=>{let d=u.target,t=d.getAttribute("data-key"),a=d.getAttribute("data-idx");if(t&&a!==null&&!v){let o=parseInt(a,10);i[t].splice(o,1),n.updateShortcuts(i),f()}})});let T=s.querySelector("#sh-adv-btn-binds"),S=s.querySelector("#sh-adv-container-binds");T&&S&&T.addEventListener("click",()=>{S.classList.toggle("sh-expanded")})};f()}},{id:"auto-lpn",name:"\u0410\u0432\u0442\u043E-LPN",file:"auto_lpn.js",description:'\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0432\u0456\u0434\u043A\u0440\u0438\u0432\u0430\u0454 "\u043F\u0435\u0440\u0435\u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0438\u0442\u0438 LPN" \u043F\u0440\u0438 \u0441\u043A\u0430\u043D\u0443\u0432\u0430\u043D\u043D\u0456 LPN \u0430\u0431\u043E \u0431\u0443\u0434\u044C-\u0447\u043E\u0433\u043E \u0456\u043D\u0448\u043E\u0433\u043E, \u043E\u043A\u0440\u0456\u043C \u0442\u043E\u0442\u0430',excludeDeps:["REFURB","WHD"],getHandler:()=>window.__autoLpn},{id:"refurb-lpn",name:"A\u0432\u0442\u043E-LPN",file:"auto_lpn_refurb.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0437\u0430\u043F\u043E\u0432\u043D\u044E\u0454 \u0441\u0442\u0430\u0440\u0443 LPN",excludeDeps:["CRET","FAST","UG"],getHandler:()=>window.__refurbLpn},{id:"clear-session",name:"\u0410\u0432\u0442\u043E-\u0441\u043A\u0430\u0441\u0443\u0439",file:"clear_session.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0441\u043A\u0430\u0441\u043E\u0432\u0443\u0454 \u0441\u0435\u0441\u0456\u044E \u043F\u0440\u0438 \u043D\u0430\u0442\u0438\u0441\u043D\u0435\u043D\u043D\u0456 `us` \u043D\u0430 \u043A\u043B\u0430\u0432\u0456\u0430\u0442\u0443\u0440\u0456.",getHandler:()=>window.__clearSession},{id:"gravis",name:"Gravis",file:"gravis.js",description:"\u0412 \u043F\u0440\u043E\u0446\u0435\u0441\u0456 \u0440\u043E\u0437\u0440\u043E\u0431\u043A\u0438! \u041D\u0415 \u041F\u0420\u0410\u0426\u042E\u0404!",excludeDeps:["REFURB","WHD"],experimental:!0,getHandler:()=>window.__gravis}];async function $(s,n,i){let h=n.checked,f=s.getHandler();if(h&&!f){n.disabled=!0;let x=`${M}/${s.file}?cb=${Date.now()}`;try{let v=await fetch(x);if(!v.ok)throw new Error(`HTTP ${v.status}`);let p=await v.text(),T=document.createElement("script");T.textContent=p,document.head.appendChild(T),f=s.getHandler(),n.disabled=!1}catch(v){alert(`\u26A0\uFE0F Failed to load ${s.name}:
${v.message}`),n.checked=!1,n.disabled=!1;return}}f&&(h?(f.enable(),s.renderSettings&&i&&(i.style.display="block",s.renderSettings(i))):(f.disable(),i&&(i.style.display="none",i.innerHTML="")))}["keydown","keyup","keypress"].forEach(s=>{window.addEventListener(s,n=>{let i=n.target;i&&i.closest("#sh-root")&&n.stopPropagation()},!0)});function K(){let s="sh_panel_opacity",n=.4;try{let t=localStorage.getItem(s);if(t!==null){let a=parseFloat(t);!isNaN(a)&&a>=.1&&a<=1&&(n=a)}}catch{}let i=document.createElement("div");i.id="sh-root",i.innerHTML=`
                    <style>
                        ${W}
                    </style>
                    
                    <div id="sh-panel" style="opacity: ${n};">
                        <div class="sh-header">
                            <div class="sh-header-group">
                                <select id="sh-subdep-select" class="sh-dep-dropdown">
                                    ${k.map(t=>`<option value="${t}" ${b===t?"selected":""}>${t}</option>`).join(`
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
                `,document.body.appendChild(i);let h=document.getElementById("sh-panel"),f=document.getElementById("sh-settings-toggle-btn"),x=document.getElementById("sh-global-settings"),v=document.getElementById("sh-panel-opacity");f&&x&&f.addEventListener("click",()=>{f.classList.toggle("active"),x.classList.toggle("sh-expanded")}),v&&v.addEventListener("input",t=>{let a=t.target,o=parseFloat(a.value);h.style.opacity=o.toString();try{localStorage.setItem(s,o.toString())}catch{}});function p(){h.classList.remove("sh-open"),document.querySelectorAll(".sh-adv-container").forEach(t=>t.classList.remove("sh-expanded")),x&&x.classList.remove("sh-expanded"),f&&f.classList.remove("active"),window.dispatchEvent(new CustomEvent("sh-panel-closed"))}document.addEventListener("mousedown",t=>{let a=t.target;h.classList.contains("sh-open")&&!h.contains(a)&&p()});let T=document.getElementById("sh-subdep-select");T&&T.addEventListener("change",t=>{let a=t.target;if(D(a.value)){b=a.value,localStorage.setItem(C,b);let o=_[b];if(o){if(window.__itemCounter){window.__itemCounter.updateSettings({targetRate:o.targetRate,doubleCountMode:o.doubleCountMode,scanTimeoutMs:o.scanTimeoutMs});let e=document.getElementById("sh-cfg-target");e&&(e.value=o.targetRate.toString())}else try{let e=JSON.parse(localStorage.getItem(B)||"{}");e.targetRate=o.targetRate,e.doubleCountMode=o.doubleCountMode,e.scanTimeoutMs=o.scanTimeoutMs,localStorage.setItem(B,JSON.stringify(e))}catch{}if(window.__offTask){window.__offTask.updateSettings({timeoutMins:o.offTaskMins});let e=document.getElementById("sh-ot-mins");e&&(e.value=o.offTaskMins.toString())}else try{let e=JSON.parse(localStorage.getItem(P)||"{}");e.timeoutMins=o.offTaskMins,localStorage.setItem(P,JSON.stringify(e))}catch{}}S.forEach(e=>{let r=document.getElementById(`sh-card-${e.id}`);if(r)if(e.excludeDeps?.includes(b)){r.style.display="none";let l=e.getHandler(),m=document.getElementById(`sh-chk-${e.id}`);l&&l.isActive()&&(l.disable(),m&&(m.checked=!1))}else r.style.display="block"})}}),document.addEventListener("keydown",t=>{if(t.key!=="Enter"||!window.__refurbLpnLoaded&&!window.__gravisLoaded&&!window.__clearSession)return;let a=t.target;if(!a||!a.matches("input"))return;let o=a.value?.trim();if(!o)return;let e=(a.getAttribute("aria-label")||"").toLowerCase(),r={lpnLabels:[G,z,U],wsLabels:j};try{if(r.lpnLabels.flat().some(c=>e.includes(c.toLowerCase()))&&/^lpn[a-z0-9]+/i.test(o)){localStorage.getItem(A)!==o&&(localStorage.setItem(A,o),window.__gravis?.sendLpn(o));return}if(r.wsLabels.some(c=>e.includes(c.toLowerCase()))&&/^ws[_-]+/i.test(o)){localStorage.setItem(O,o);return}}catch{}},!0);let S=F.filter(t=>!(t.experimental&&!["development","local"].includes(E)||t.isTrusted&&!w)),g=()=>{let t=document.getElementById("sh-chk-all");if(!t)return;let o=S.filter(e=>!(e.experimental||e.excludeDeps&&e.excludeDeps.includes(b))).map(e=>document.getElementById(`sh-chk-${e.id}`));t.checked=o.length>0&&o.every(e=>e&&e.checked)},u=document.getElementById("sh-list");u&&S.forEach(t=>{let a=t.getHandler(),o=a?a.isActive():!1,e=document.createElement("div");e.id=`sh-card-${t.id}`,e.className="sh-card",t.excludeDeps?.includes(b)&&(e.style.display="none"),e.innerHTML=`
                            <div class="sh-card-top">
                                <div class="sh-card-info">
                                    <div class="sh-card-title">${t.name}</div>
                                    <div class="sh-card-desc">${t.description}</div>
                                </div>
                                <label class="sh-switch">
                                    <input type="checkbox" id="sh-chk-${t.id}" ${o?"checked":""}>
                                    <span class="sh-slider"></span>
                                </label>
                            </div>
                            <div class="sh-card-settings" id="sh-settings-${t.id}"></div>
                        `,u.appendChild(e);let r=e.querySelector(`#sh-chk-${t.id}`),l=e.querySelector(`#sh-settings-${t.id}`);o&&t.renderSettings&&(l.style.display="block",t.renderSettings(l)),r&&(r.onchange=async()=>{await $(t,r,l),g()})});let d=document.getElementById("sh-chk-all");d&&d.addEventListener("change",t=>{let a=t.target.checked,o=[];S.forEach(e=>{if(e.experimental||e.excludeDeps&&e.excludeDeps.includes(b))return;let r=document.getElementById(`sh-chk-${e.id}`),l=document.getElementById(`sh-settings-${e.id}`);r&&r.checked!==a&&!r.disabled&&(r.checked=a,o.push($(e,r,l)))}),o.length>0&&(d.disabled=!0,Promise.all(o).finally(()=>{d.disabled=!1,g()}))}),g(),setTimeout(()=>{h.classList.add("sh-open")},100)}K()})()}})();
